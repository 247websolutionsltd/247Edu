import { auth, db } from "@/config/firebase";
import { Brand } from "@/constants/brand";
import { Category, IconName } from "@/data/categories";
import { AppNotification, seedNotifications } from "@/data/notifications";
import { ensureUserBalance, updateUserProfile } from "@/services/users";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./PageContext";

export type TxStatus = "success" | "pending" | "failed";

export type Transaction = {
  id: string;
  kind: "credit" | "debit";
  category: Category;
  title: string;
  subtitle: string;
  amount: number;
  fee: number;
  ts: number;
  status: TxStatus;
  reference: string;
  note?: string;
};

export type Goal = {
  id: string;
  name: string;
  icon: IconName;
  target: number;
  saved: number;
  dueLabel: string;
  locked: boolean;
  rate: number; // % per annum
};

export type Beneficiary = {
  id: string;
  name: string;
  bank: string;
  account: string;
};

type TransferInput = {
  name: string;
  bank: string;
  account: string;
  amount: number;
  note?: string;
  saveBeneficiary?: boolean;
};

export type Result = { ok: true; id: string } | { ok: false; error: string };

type WalletContextType = {
  balance: number;
  savingsTotal: number;
  interestEarned: number;
  transactions: Transaction[];
  goals: Goal[];
  beneficiaries: Beneficiary[];
  notifications: AppNotification[];
  cardFrozen: boolean;
  balanceHidden: boolean;
  roundUps: boolean;
  setRoundUps: (v: boolean) => void;
  toggleBalanceHidden: () => void;
  toggleCardFrozen: () => void;
  transfer: (input: TransferInput) => Result;
  addMoney: (amount: number, method: string) => Result;
  payBill: (input: { category: Category; provider: string; target: string; amount: number }) => Result;
  createGoal: (input: Omit<Goal, "id" | "saved"> & { initial: number }) => Result;
  fundGoal: (id: string, amount: number) => Result;
  withdrawGoal: (id: string, amount: number) => Result;
  removeBeneficiary: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  getTransaction: (id?: string) => Transaction | undefined;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const ago = (days: number, hour: number) => {
  const d = new Date(Date.now() - days * DAY);
  d.setHours(hour, (hour * 7) % 60, 0, 0);
  // never seed a transaction in the future (e.g. "today at 8pm" when it's 9am)
  return Math.min(d.getTime(), Date.now() - 60_000);
};
const ref = () => "VRD" + Math.random().toString(36).slice(2, 10).toUpperCase();
const uid = (p: string) => p + Math.random().toString(36).slice(2, 9);

const seedTx = (
  id: string,
  kind: Transaction["kind"],
  category: Category,
  title: string,
  subtitle: string,
  amount: number,
  ts: number,
): Transaction => ({
  id,
  kind,
  category,
  title,
  subtitle,
  amount,
  fee: 0,
  ts,
  status: "success",
  reference: "VRD" + id.toUpperCase().padEnd(8, "0"),
});

const seedTransactions: Transaction[] = [
  seedTx("t01", "credit", "salary", "Salary · Brightpath Ltd", "Income", 450000, ago(0, 7)),
  seedTx("t02", "debit", "food", "Chicken Republic", "Card payment", 6800, ago(0, 8)),
  seedTx("t03", "debit", "transport", "Bolt ride", "Card payment", 3200, ago(1, 18)),
  seedTx("t04", "debit", "transfer", "Adaeze Okonkwo", "Transfer to Access Bank", 25000, ago(1, 11)),
  seedTx("t05", "debit", "bills", "IKEDC Prepaid", "Electricity · 45021884703", 15000, ago(2, 9)),
  seedTx("t06", "debit", "entertainment", "Netflix", "Card payment", 4400, ago(3, 21)),
  seedTx("t07", "credit", "transfer", "Tunde Bakare", "Received from GTBank", 40000, ago(3, 15)),
  seedTx("t08", "debit", "shopping", "Jumia", "Card payment", 28500, ago(4, 12)),
  seedTx("t09", "debit", "airtime", "MTN Airtime", "0803 555 0192", 2000, ago(5, 10)),
  seedTx("t10", "debit", "food", "Shoprite", "Card payment", 18400, ago(5, 17)),
  seedTx("t11", "debit", "transport", "Uber", "Card payment", 5900, ago(6, 19)),
  seedTx("t12", "credit", "topup", "Wallet top-up", "Card ending 2458", 100000, ago(8, 9)),
  seedTx("t13", "debit", "savings", "Dream Vacation", "Moved to savings", 50000, ago(9, 8)),
  seedTx("t14", "debit", "food", "Mama Put Kitchen", "Card payment", 3500, ago(10, 14)),
];

const seedGoals: Goal[] = [
  { id: "g1", name: "Dream Vacation", icon: "airplane", target: 450000, saved: 306000, dueLabel: "Dec 2026", locked: false, rate: 10 },
  { id: "g2", name: "New Laptop", icon: "laptop", target: 900000, saved: 210000, dueLabel: "Mar 2027", locked: true, rate: 14 },
  { id: "g3", name: "Emergency Fund", icon: "shield-checkmark", target: 1000000, saved: 640000, dueLabel: "Flexible", locked: false, rate: 10 },
];

const seedBeneficiaries: Beneficiary[] = [
  { id: "b1", name: "Adaeze Okonkwo", bank: "Access Bank", account: "0123456789" },
  { id: "b2", name: "Tunde Bakare", bank: "GTBank", account: "0987654321" },
  { id: "b3", name: "Chidi Eze", bank: "Zenith Bank", account: "2034561122" },
  { id: "b4", name: "Mum", bank: "First Bank", account: "3045678901" },
];

/**
 * In-memory demo wallet. Swap the bodies of the actions below for real API calls
 * when you wire up a backend - the screens only depend on this interface.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState(seedTransactions);
  const [goals, setGoals] = useState(seedGoals);
  const [beneficiaries, setBeneficiaries] = useState(seedBeneficiaries);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [roundUps, setRoundUps] = useState(true);

  useEffect(() => {
    let unsubscribeBalance: (() => void) | undefined;
    let activeUid: string | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeBalance?.();
      unsubscribeBalance = undefined;
      activeUid = user?.uid;
      setBalance(0);
      console.log("Auth state changed:", user?.uid);
      if (!user) return;

      void ensureUserBalance(user?.uid)
        .then(() => {
          if (activeUid !== user.uid) return;

          unsubscribeBalance = onSnapshot(
            doc(db, "users", user.uid),
            (snapshot) => {
              const remoteBalance = snapshot.data()?.balance;
              if (
                typeof remoteBalance !== "number" ||
                !Number.isFinite(remoteBalance) ||
                remoteBalance < 0
              ) {
                console.error("The Firebase wallet balance is missing or invalid.");
                Alert.alert(
                  "Balance unavailable",
                  "We couldn't read a valid wallet balance from your account."
                );
                return;
              }
              setBalance(remoteBalance);
            },
            (error) => {
              console.error("Unable to subscribe to the Firebase wallet balance", error);
              Alert.alert(
                "Balance unavailable",
                "We couldn't load your wallet balance. Please try again."
              );
            }
          );
        })
        .catch((error: unknown) => {
          console.error("Unable to initialize the Firebase wallet balance", error);
          Alert.alert(
            "Balance unavailable",
            error instanceof Error
              ? error.message
              : "We couldn't initialize your wallet balance."
          );
        });
    });

    return () => {
      activeUid = undefined;
      unsubscribeBalance?.();
      unsubscribeAuth();
    };
  }, []);

  const pushTx = useCallback((tx: Transaction) => setTransactions((prev) => [tx, ...prev]), []);

  const savingsTotal = useMemo(() => goals.reduce((s, g) => s + g.saved, 0), [goals]);
  const interestEarned = useMemo(
    () => Math.round(goals.reduce((s, g) => s + (g.saved * g.rate) / 100 / 12, 0)),
    [goals],
  );

  const transfer: WalletContextType["transfer"] = useCallback(
    ({ name, bank, account, amount, note, saveBeneficiary }) => {
      const fee = bank === Brand.bankName ? 0 : 10.75;
      if (amount <= 0) return { ok: false, error: "Enter an amount greater than zero." };
      if (amount + fee > balance) return { ok: false, error: "Insufficient balance for this transfer." };
      const id = uid("tx");
      setBalance((b) => b - amount - fee);
      pushTx({
        id,
        kind: "debit",
        category: "transfer",
        title: name,
        subtitle: `Transfer to ${bank}`,
        amount,
        fee,
        ts: Date.now(),
        status: "success",
        reference: ref(),
        note,
      });
      if (saveBeneficiary && !beneficiaries.some((b) => b.account === account && b.bank === bank)) {
        setBeneficiaries((prev) => [{ id: uid("b"), name, bank, account }, ...prev]);
      }
      return { ok: true, id };
    },
    [balance, beneficiaries, pushTx],
  );

  const addMoney: WalletContextType["addMoney"] = useCallback(
    (amount, method) => {
      if (amount < 100) return { ok: false, error: "Minimum top-up is ₦100." };
      const id = uid("tx");
      setBalance((b) => b + amount);
      pushTx({
        id,
        kind: "credit",
        category: "topup",
        title: "Wallet top-up",
        subtitle: method,
        amount,
        fee: 0,
        ts: Date.now(),
        status: "success",
        reference: ref(),
      });
      return { ok: true, id };
    },
    [pushTx],
  );

  const payBill: WalletContextType["payBill"] = useCallback(
    ({ category, provider, target, amount }) => {
      if (amount <= 0) return { ok: false, error: "Enter an amount greater than zero." };
      if (amount > balance) return { ok: false, error: "Insufficient balance." };
      const id = uid("tx");
      setBalance((b) => b - amount);
      pushTx({
        id,
        kind: "debit",
        category,
        title: provider,
        subtitle: target,
        amount,
        fee: 0,
        ts: Date.now(),
        status: "success",
        reference: ref(),
      });
      return { ok: true, id };
    },
    [balance, pushTx],
  );

  const createGoal: WalletContextType["createGoal"] = useCallback(
    ({ initial, ...goal }) => {
      if (!goal.name.trim()) return { ok: false, error: "Give your goal a name." };
      if (goal.target <= 0) return { ok: false, error: "Set a target amount." };
      if (initial > balance) return { ok: false, error: "Your first deposit is more than your balance." };
      const id = uid("g");
      const nextGoal: Goal = { ...goal, id, saved: initial };
      setGoals((prev) => [...prev, nextGoal]);

      if (user?.uid) {
        const nextSavingsGoal = [
          ...(user.savingsGoal ?? []),
          {
            id,
            name: goal.name,
            amount: String(initial),
            goal: String(goal.target),
            locked: goal.locked,
            icon: goal.icon,
            dueLabel: goal.dueLabel,
          },
        ];

        const nextSavingsTotal = Number(user.savings ?? 0) + initial;
        setUser({ ...user, savings: nextSavingsTotal, savingsGoal: nextSavingsGoal });
        void updateUserProfile(user.uid, {
          savings: nextSavingsTotal,
          savingsGoal: nextSavingsGoal,
        });
      }

      if (initial > 0) {
        setBalance((b) => b - initial);
        pushTx({
          id: uid("tx"),
          kind: "debit",
          category: "savings",
          title: goal.name,
          subtitle: "Moved to savings",
          amount: initial,
          fee: 0,
          ts: Date.now(),
          status: "success",
          reference: ref(),
        });
      }
      return { ok: true, id };
    },
    [balance, pushTx, setUser, user],
  );

  const fundGoal: WalletContextType["fundGoal"] = useCallback(
    (id, amount) => {
      const goal = goals.find((g) => g.id === id);
      if (!goal) return { ok: false, error: "Goal not found." };
      if (amount <= 0) return { ok: false, error: "Enter an amount greater than zero." };
      if (amount > balance) return { ok: false, error: "Insufficient wallet balance." };
      setBalance((b) => b - amount);
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g)));
      const txId = uid("tx");
      pushTx({
        id: txId,
        kind: "debit",
        category: "savings",
        title: goal.name,
        subtitle: "Moved to savings",
        amount,
        fee: 0,
        ts: Date.now(),
        status: "success",
        reference: ref(),
      });
      return { ok: true, id: txId };
    },
    [goals, balance, pushTx],
  );

  const withdrawGoal: WalletContextType["withdrawGoal"] = useCallback(
    (id, amount) => {
      const goal = goals.find((g) => g.id === id);
      if (!goal) return { ok: false, error: "Goal not found." };
      if (goal.locked) return { ok: false, error: "This goal is locked until its due date." };
      if (amount <= 0) return { ok: false, error: "Enter an amount greater than zero." };
      if (amount > goal.saved) return { ok: false, error: "That's more than you've saved in this goal." };
      setBalance((b) => b + amount);
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved: g.saved - amount } : g)));
      const txId = uid("tx");
      pushTx({
        id: txId,
        kind: "credit",
        category: "savings",
        title: goal.name,
        subtitle: "Withdrawn from savings",
        amount,
        fee: 0,
        ts: Date.now(),
        status: "success",
        reference: ref(),
      });
      return { ok: true, id: txId };
    },
    [goals, pushTx],
  );

  const value: WalletContextType = {
    balance,
    savingsTotal,
    interestEarned,
    transactions,
    goals,
    beneficiaries,
    notifications,
    cardFrozen,
    balanceHidden,
    roundUps,
    setRoundUps,
    toggleBalanceHidden: () => setBalanceHidden((v) => !v),
    toggleCardFrozen: () => setCardFrozen((v) => !v),
    transfer,
    addMoney,
    payBill,
    createGoal,
    fundGoal,
    withdrawGoal,
    removeBeneficiary: (id) => setBeneficiaries((prev) => prev.filter((b) => b.id !== id)),
    markNotificationRead: (id) =>
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n))),
    markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))),
    getTransaction: (id) => transactions.find((t) => t.id === id) ?? transactions[0],
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside a WalletProvider");
  return ctx;
}
