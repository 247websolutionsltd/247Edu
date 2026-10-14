import { auth } from "@/config/firebase";
import { Category } from "@/data/categories";
import { AppNotification } from "@/data/notifications";
import * as wallet from "@/services/wallet";
import type { Beneficiary, Goal, Result, Transaction, TransferInput, TxStatus } from "@/services/wallet";
import { updateUserProfile } from "@/services/users";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./PageContext";

export type { Beneficiary, Goal, Result, Transaction, TxStatus };

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
  transfer: (input: TransferInput) => Promise<Result>;
  addMoney: (amount: number, method: string) => Promise<Result>;
  payBill: (input: { category: Category; provider: string; target: string; amount: number }) => Promise<Result>;
  createGoal: (input: Omit<Goal, "id" | "saved"> & { initial: number }) => Promise<Result>;
  fundGoal: (id: string, amount: number) => Promise<Result>;
  withdrawGoal: (id: string, amount: number) => Promise<Result>;
  removeBeneficiary: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  getTransaction: (id?: string) => Transaction | undefined;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const NOT_SIGNED_IN: Result = { ok: false, error: "Please sign in again to continue." };

/**
 * Everything here is Firestore-backed: balance comes from the live users/{uid} profile,
 * the rest from its subcollections. Actions run as Firestore transactions (services/wallet.ts).
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  const { uid, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [balanceHidden, setBalanceHidden] = useState(false);
  // transactions we just created, so a receipt can show before the listener delivers them
  const recent = useRef(new Map<string, Transaction>());
  const syncAlerted = useRef(false);

  useEffect(() => {
    setTransactions([]);
    setGoals([]);
    setBeneficiaries([]);
    setNotifications([]);
    recent.current.clear();
    if (!uid) return;

    const onError = (label: string) => (error: unknown) => {
      if (!auth.currentUser) return; // signing out
      console.error(`[wallet] ${label} subscription failed`, error);
      if (!syncAlerted.current) {
        syncAlerted.current = true;
        Alert.alert("Sync problem", "We couldn't load some of your data. Check your connection and reopen the app.");
      }
    };

    const unsubs = [
      wallet.subscribeTransactions(uid, setTransactions, onError("transactions")),
      wallet.subscribeGoals(uid, setGoals, onError("goals")),
      wallet.subscribeBeneficiaries(uid, setBeneficiaries, onError("beneficiaries")),
      wallet.subscribeNotifications(uid, setNotifications, onError("notifications")),
    ];
    return () => unsubs.forEach((u) => u());
  }, [uid]);

  const balance = user?.balance ?? 0;
  const cardFrozen = user?.cardFrozen ?? false;
  const roundUps = user?.roundUps ?? true;

  const savingsTotal = useMemo(() => goals.reduce((s, g) => s + g.saved, 0), [goals]);
  const interestEarned = useMemo(
    () => Math.round(goals.reduce((s, g) => s + (g.saved * g.rate) / 100 / 12, 0)),
    [goals],
  );

  const remember = (res: Result) => {
    if (res.ok && res.tx) recent.current.set(res.id, res.tx);
    return res;
  };

  const act = useCallback(
    <A extends unknown[]>(fn: (uid: string, ...args: A) => Promise<Result>) =>
      async (...args: A): Promise<Result> => (uid ? remember(await fn(uid, ...args)) : NOT_SIGNED_IN),
    [uid],
  );

  const setPref = (patch: Parameters<typeof updateUserProfile>[1]) => {
    if (!uid) return;
    updateUserProfile(uid, patch).catch((e) => {
      console.error("[wallet] couldn't save setting", e);
      Alert.alert("Couldn't save", "Your change wasn't saved. Please try again.");
    });
  };

  const unreadIds = notifications.filter((n) => n.unread).map((n) => n.id);

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
    setRoundUps: (v) => setPref({ roundUps: v }),
    toggleBalanceHidden: () => setBalanceHidden((v) => !v),
    toggleCardFrozen: () => setPref({ cardFrozen: !cardFrozen }),
    transfer: act(wallet.transferMoney),
    addMoney: act(wallet.addMoney),
    payBill: act(wallet.payBill),
    createGoal: act(wallet.createGoal),
    fundGoal: act(wallet.fundGoal),
    withdrawGoal: act(wallet.withdrawGoal),
    removeBeneficiary: async (id) => {
      if (uid) await wallet.removeBeneficiary(uid, id);
    },
    markNotificationRead: (id) => {
      if (uid) wallet.markNotificationRead(uid, id).catch((e) => console.error("[wallet] mark read failed", e));
    },
    markAllRead: () => {
      if (uid) wallet.markAllNotificationsRead(uid, unreadIds).catch((e) => console.error("[wallet] mark all failed", e));
    },
    getTransaction: (id) => (id ? transactions.find((t) => t.id === id) ?? recent.current.get(id) : undefined),
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside a WalletProvider");
  return ctx;
}
