import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { Brand } from "@/constants/brand";
import { Category, IconName } from "@/data/categories";
import { AppNotification, NewNotification } from "@/data/notifications";
import { db } from "../config/firebase";
import { userRef } from "./users";

/* --------------------------------- types --------------------------------- */

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

export type Beneficiary = { id: string; name: string; bank: string; account: string };

export type TransferInput = {
  name: string;
  bank: string;
  account: string;
  amount: number;
  note?: string;
  saveBeneficiary?: boolean;
};

export type Result = { ok: true; id: string; tx?: Transaction } | { ok: false; error: string };

export const TRANSFER_FEE = 10.75;
export const MIN_TOP_UP = 100;

/* -------------------------------- helpers -------------------------------- */

/** Business-rule failure with a message that is safe to show to the customer. */
export class WalletError extends Error {}

const round2 = (n: number) => Math.round(n * 100) / 100;
const makeRef = () => "VRD" + Math.random().toString(36).slice(2, 10).toUpperCase();

const path = (uid: string, name: string) => collection(db, "users", uid, name);

function friendlyError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  if (code === "unavailable" || code === "deadline-exceeded")
    return "Can't reach the server. Check your connection and try again.";
  if (code === "permission-denied") return "You don't have permission to do that. Please sign in again.";
  if (code === "failed-precondition" || code === "aborted")
    return "That took too long to process. Please try again.";
  return "Something went wrong. Please try again.";
}

async function run(fn: () => Promise<{ id: string; tx?: Transaction }>): Promise<Result> {
  try {
    return { ok: true, ...(await fn()) };
  } catch (e) {
    if (e instanceof WalletError) return { ok: false, error: e.message };
    console.error("[wallet]", e);
    return { ok: false, error: friendlyError(e) };
  }
}

function readBalance(data: DocumentData | undefined): number {
  if (!data) throw new WalletError("Your account isn't set up yet. Please sign out and sign in again.");
  const b = data.balance;
  if (typeof b !== "number" || !Number.isFinite(b) || b < 0)
    throw new WalletError("We couldn't read your balance. Please try again shortly.");
  return b;
}

function assertAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) throw new WalletError("Enter an amount greater than zero.");
}

type TxFields = Omit<Transaction, "id" | "ts" | "reference" | "status" | "fee"> & { fee?: number };

function buildTx(fields: TxFields): Omit<Transaction, "id"> {
  const { note, ...rest } = fields;
  return { fee: 0, ...rest, ...(note ? { note } : {}), ts: Date.now(), status: "success", reference: makeRef() };
}

const notice = (n: NewNotification) => ({ ...n, ts: Date.now(), unread: true });

export const beneficiaryId = (bank: string, account: string) => `${bank.replace(/\W/g, "")}_${account}`;

/* ------------------------------ subscriptions ----------------------------- */

const num = (v: unknown, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

const toTx = (d: QueryDocumentSnapshot): Transaction => {
  const x = d.data();
  return {
    id: d.id,
    kind: x.kind === "credit" ? "credit" : "debit",
    category: x.category,
    title: x.title ?? "",
    subtitle: x.subtitle ?? "",
    amount: num(x.amount),
    fee: num(x.fee),
    ts: num(x.ts, Date.now()),
    status: x.status ?? "success",
    reference: x.reference ?? d.id,
    note: x.note,
  };
};

const toGoal = (d: QueryDocumentSnapshot): Goal => {
  const x = d.data();
  return {
    id: d.id,
    name: x.name ?? "",
    icon: x.icon ?? "leaf",
    target: num(x.target),
    saved: num(x.saved),
    dueLabel: x.dueLabel ?? "Flexible",
    locked: x.locked === true,
    rate: num(x.rate, 10),
  };
};

const toBeneficiary = (d: QueryDocumentSnapshot): Beneficiary => {
  const x = d.data();
  return { id: d.id, name: x.name ?? "", bank: x.bank ?? "", account: x.account ?? "" };
};

const toNotification = (d: QueryDocumentSnapshot): AppNotification => {
  const x = d.data();
  return {
    id: d.id,
    title: x.title ?? "",
    desc: x.desc ?? "",
    detail: x.detail ?? "",
    icon: x.icon ?? "notifications",
    type: x.type ?? "Offers",
    ts: num(x.ts, Date.now()),
    unread: x.unread === true,
    action: x.action,
  };
};

type Sub<T> = (uid: string, onData: (rows: T[]) => void, onError: (e: unknown) => void) => Unsubscribe;

const makeSub =
  <T>(name: string, order: [string, "asc" | "desc"], max: number, map: (d: QueryDocumentSnapshot) => T): Sub<T> =>
  (uid, onData, onError) =>
    onSnapshot(query(path(uid, name), orderBy(order[0], order[1]), limit(max)), (s) => onData(s.docs.map(map)), onError);

// Capped so a long-lived account doesn't download its whole history on every launch.
export const subscribeTransactions = makeSub("transactions", ["ts", "desc"], 300, toTx);
export const subscribeGoals = makeSub("goals", ["createdAt", "asc"], 50, toGoal);
export const subscribeBeneficiaries = makeSub("beneficiaries", ["createdAt", "desc"], 100, toBeneficiary);
export const subscribeNotifications = makeSub("notifications", ["ts", "desc"], 50, toNotification);

/* --------------------------- money-moving actions ------------------------- */

export function transferMoney(uid: string, input: TransferInput): Promise<Result> {
  return run(async () => {
    const amount = round2(input.amount);
    assertAmount(amount);
    const fee = input.bank === Brand.bankName ? 0 : TRANSFER_FEE;
    const total = round2(amount + fee);

    const txRef = doc(path(uid, "transactions"));
    const notifRef = doc(path(uid, "notifications"));
    const benRef = doc(path(uid, "beneficiaries"), beneficiaryId(input.bank, input.account));
    const tx = buildTx({
      kind: "debit",
      category: "transfer",
      title: input.name,
      subtitle: `Transfer to ${input.bank}`,
      amount,
      fee,
      note: input.note?.trim(),
    });

    await runTransaction(db, async (t) => {
      // all reads first
      const user = await t.get(userRef(uid));
      const ben = input.saveBeneficiary ? await t.get(benRef) : null;
      const balance = readBalance(user.data());
      if (total > balance) throw new WalletError("Insufficient balance for this transfer.");

      t.update(userRef(uid), { balance: round2(balance - total), updatedAt: serverTimestamp() });
      t.set(txRef, tx);
      if (ben && !ben.exists()) {
        t.set(benRef, { name: input.name, bank: input.bank, account: input.account, createdAt: Date.now() });
      }
      t.set(notifRef, notice({
        title: "Money sent",
        desc: `₦${amount.toLocaleString("en-NG")} to ${input.name}`,
        detail: `You sent ₦${amount.toLocaleString("en-NG")} to ${input.name} (${input.bank}, ${input.account}).`,
        icon: "paper-plane",
        type: "Transactions",
        action: { label: "View activity", route: "/activity" },
      }));
    });
    return { id: txRef.id, tx: { id: txRef.id, ...tx } };
  });
}

export function addMoney(uid: string, rawAmount: number, method: string): Promise<Result> {
  return run(async () => {
    const amount = round2(rawAmount);
    assertAmount(amount);
    if (amount < MIN_TOP_UP) throw new WalletError(`Minimum top-up is ₦${MIN_TOP_UP}.`);

    const txRef = doc(path(uid, "transactions"));
    const notifRef = doc(path(uid, "notifications"));
    const tx = buildTx({ kind: "credit", category: "topup", title: "Wallet top-up", subtitle: method, amount });

    await runTransaction(db, async (t) => {
      const balance = readBalance((await t.get(userRef(uid))).data());
      t.update(userRef(uid), { balance: round2(balance + amount), updatedAt: serverTimestamp() });
      t.set(txRef, tx);
      t.set(notifRef, notice({
        title: "Wallet funded",
        desc: `₦${amount.toLocaleString("en-NG")} added to your wallet.`,
        detail: `Your wallet was credited with ₦${amount.toLocaleString("en-NG")} (${method}).`,
        icon: "arrow-down-circle",
        type: "Transactions",
        action: { label: "View activity", route: "/activity" },
      }));
    });
    return { id: txRef.id, tx: { id: txRef.id, ...tx } };
  });
}

export function payBill(
  uid: string,
  input: { category: Category; provider: string; target: string; amount: number },
): Promise<Result> {
  return run(async () => {
    const amount = round2(input.amount);
    assertAmount(amount);

    const txRef = doc(path(uid, "transactions"));
    const notifRef = doc(path(uid, "notifications"));
    const tx = buildTx({ kind: "debit", category: input.category, title: input.provider, subtitle: input.target, amount });

    await runTransaction(db, async (t) => {
      const balance = readBalance((await t.get(userRef(uid))).data());
      if (amount > balance) throw new WalletError("Insufficient balance.");
      t.update(userRef(uid), { balance: round2(balance - amount), updatedAt: serverTimestamp() });
      t.set(txRef, tx);
      t.set(notifRef, notice({
        title: "Payment successful",
        desc: `${input.provider} · ₦${amount.toLocaleString("en-NG")}`,
        detail: `${input.provider} (${input.target}) was paid from your wallet.`,
        icon: "flash",
        type: "Transactions",
        action: { label: "View activity", route: "/activity" },
      }));
    });
    return { id: txRef.id, tx: { id: txRef.id, ...tx } };
  });
}

/* ----------------------------------- goals -------------------------------- */

export function createGoal(
  uid: string,
  input: Omit<Goal, "id" | "saved"> & { initial: number },
): Promise<Result> {
  return run(async () => {
    const name = input.name.trim();
    const initial = round2(input.initial || 0);
    const target = round2(input.target);
    if (!name) throw new WalletError("Give your goal a name.");
    if (!Number.isFinite(target) || target <= 0) throw new WalletError("Set a target amount.");
    if (!Number.isFinite(initial) || initial < 0) throw new WalletError("Enter a valid first deposit.");

    const goalRef = doc(path(uid, "goals"));
    const txRef = doc(path(uid, "transactions"));
    const tx = initial > 0
      ? buildTx({ kind: "debit", category: "savings", title: name, subtitle: "Moved to savings", amount: initial })
      : null;

    await runTransaction(db, async (t) => {
      const balance = readBalance((await t.get(userRef(uid))).data());
      if (initial > balance) throw new WalletError("Your first deposit is more than your balance.");

      t.set(goalRef, {
        name,
        icon: input.icon,
        target,
        saved: initial,
        dueLabel: input.dueLabel,
        locked: input.locked,
        rate: input.rate,
        createdAt: Date.now(),
      });
      if (tx) {
        t.update(userRef(uid), { balance: round2(balance - initial), updatedAt: serverTimestamp() });
        t.set(txRef, tx);
      }
    });
    return tx ? { id: goalRef.id, tx: { id: txRef.id, ...tx } } : { id: goalRef.id };
  });
}

export function fundGoal(uid: string, goalId: string, rawAmount: number): Promise<Result> {
  return run(async () => {
    const amount = round2(rawAmount);
    assertAmount(amount);

    const goalRef = doc(path(uid, "goals"), goalId);
    const txRef = doc(path(uid, "transactions"));
    const notifRef = doc(path(uid, "notifications"));
    let tx!: Omit<Transaction, "id">;

    await runTransaction(db, async (t) => {
      const [user, goalSnap] = await Promise.all([t.get(userRef(uid)), t.get(goalRef)]);
      const balance = readBalance(user.data());
      if (!goalSnap.exists()) throw new WalletError("Goal not found.");
      if (amount > balance) throw new WalletError("Insufficient wallet balance.");

      const g = goalSnap.data();
      const saved = num(g.saved);
      const target = num(g.target);
      const nextSaved = round2(saved + amount);

      tx = buildTx({ kind: "debit", category: "savings", title: g.name, subtitle: "Moved to savings", amount });
      t.update(userRef(uid), { balance: round2(balance - amount), updatedAt: serverTimestamp() });
      t.update(goalRef, { saved: nextSaved });
      t.set(txRef, tx);
      if (saved < target && nextSaved >= target) {
        t.set(notifRef, notice({
          title: "Goal reached",
          desc: `${g.name} is fully funded.`,
          detail: `You've hit your ₦${target.toLocaleString("en-NG")} target for ${g.name}. Well done!`,
          icon: "trophy",
          type: "Offers",
          action: { label: "Open savings", route: "/(tabs)/save" },
        }));
      }
    });
    return { id: txRef.id, tx: { id: txRef.id, ...tx } };
  });
}

export function withdrawGoal(uid: string, goalId: string, rawAmount: number): Promise<Result> {
  return run(async () => {
    const amount = round2(rawAmount);
    assertAmount(amount);

    const goalRef = doc(path(uid, "goals"), goalId);
    const txRef = doc(path(uid, "transactions"));
    let tx!: Omit<Transaction, "id">;

    await runTransaction(db, async (t) => {
      const [user, goalSnap] = await Promise.all([t.get(userRef(uid)), t.get(goalRef)]);
      const balance = readBalance(user.data());
      if (!goalSnap.exists()) throw new WalletError("Goal not found.");
      const g = goalSnap.data();
      if (g.locked === true) throw new WalletError("This goal is locked until its due date.");
      const saved = num(g.saved);
      if (amount > saved) throw new WalletError("That's more than you've saved in this goal.");

      tx = buildTx({ kind: "credit", category: "savings", title: g.name, subtitle: "Withdrawn from savings", amount });
      t.update(userRef(uid), { balance: round2(balance + amount), updatedAt: serverTimestamp() });
      t.update(goalRef, { saved: round2(saved - amount) });
      t.set(txRef, tx);
    });
    return { id: txRef.id, tx: { id: txRef.id, ...tx } };
  });
}

/* ------------------------- beneficiaries & notifications ------------------ */

export const removeBeneficiary = (uid: string, id: string) => deleteDoc(doc(path(uid, "beneficiaries"), id));

export const markNotificationRead = (uid: string, id: string) =>
  updateDoc(doc(path(uid, "notifications"), id), { unread: false });

export async function markAllNotificationsRead(uid: string, ids: string[]) {
  if (!ids.length) return;
  const batch = writeBatch(db);
  ids.forEach((id) => batch.update(doc(path(uid, "notifications"), id), { unread: false }));
  await batch.commit();
}
