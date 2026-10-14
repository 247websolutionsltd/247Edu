import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  collection,
  type DocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { welcomeNotifications } from "@/data/notifications";
import type { User } from "firebase/auth";
import { db } from "../config/firebase";

export type UserProfile = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  balance: number;
  accountNumber: string;
  referralCode: string;
  tier: string;
  cardFrozen: boolean;
  roundUps: boolean;
};

export const DEFAULT_TIER = "Tier 1 · Basic";

export const userRef = (uid: string) => doc(db, "users", uid);

/* ------------------------------ generators ------------------------------- */

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

// NOTE: random, not guaranteed unique. Issue real account numbers from a server in production.
export const generateAccountNumber = () => "70" + digits(8);

export function generateReferralCode(name?: string | null) {
  const letters = (name ?? "").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3).padEnd(3, "V");
  return letters + digits(4);
}

/* -------------------------------- mapping -------------------------------- */

const toNumber = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

export function toProfile(snap: DocumentSnapshot): UserProfile | null {
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: snap.id,
    email: d.email,
    displayName: d.displayName,
    photoURL: d.photoURL,
    // older docs stored this as `phoneNumber`
    phone: d.phone ?? d.phoneNumber ?? "",
    balance: toNumber(d.balance) ?? 0,
    accountNumber: d.accountNumber ?? "",
    referralCode: d.referralCode ?? "",
    tier: d.tier ?? DEFAULT_TIER,
    cardFrozen: d.cardFrozen === true,
    roundUps: d.roundUps !== false,
  };
}

/* ------------------------------ operations ------------------------------- */

/**
 * Idempotent: creates the account document for a new user (balance 0, account number,
 * referral code, welcome notifications) and repairs documents from older app versions
 * (string balances, missing account number...). Safe to call on every sign-in.
 */
export async function ensureUserAccount(
  user: User,
  extra: { displayName?: string; phone?: string } = {},
): Promise<void> {
  const ref = userRef(user.uid);
  const displayName = extra.displayName?.trim() || user.displayName || undefined;

  await runTransaction(db, async (t) => {
    const snap = await t.get(ref);

    if (!snap.exists()) {
      t.set(ref, {
        uid: user.uid,
        ...(user.email ? { email: user.email } : {}),
        ...(displayName ? { displayName } : {}),
        ...(user.photoURL ? { photoURL: user.photoURL } : {}),
        phone: extra.phone?.trim() ?? "",
        balance: 0,
        accountNumber: generateAccountNumber(),
        referralCode: generateReferralCode(displayName),
        tier: DEFAULT_TIER,
        cardFrozen: false,
        roundUps: true,
        createdAt: Date.now(),
        updatedAt: serverTimestamp(),
      });
      const now = Date.now();
      welcomeNotifications(displayName?.split(" ")[0]).forEach((n, i) => {
        t.set(doc(collection(db, "users", user.uid, "notifications")), { ...n, ts: now - i, unread: true });
      });
      return;
    }

    const d = snap.data();
    const patch: Record<string, unknown> = {};

    const balance = toNumber(d.balance);
    if (balance === null || balance < 0) throw new Error("The stored wallet balance is invalid.");
    if (typeof d.balance !== "number") patch.balance = balance; // legacy string balance

    if (!d.accountNumber) patch.accountNumber = generateAccountNumber();
    if (!d.referralCode) patch.referralCode = generateReferralCode(displayName ?? d.displayName);
    if (!d.tier) patch.tier = DEFAULT_TIER;
    if (typeof d.cardFrozen !== "boolean") patch.cardFrozen = false;
    if (typeof d.roundUps !== "boolean") patch.roundUps = true;
    if (!d.phone && d.phoneNumber) patch.phone = d.phoneNumber;
    if (extra.displayName?.trim() && d.displayName !== extra.displayName.trim()) patch.displayName = extra.displayName.trim();
    if (extra.phone?.trim() && d.phone !== extra.phone.trim()) patch.phone = extra.phone.trim();
    if (!d.email && user.email) patch.email = user.email;

    if (Object.keys(patch).length) t.set(ref, { ...patch, updatedAt: serverTimestamp() }, { merge: true });
  });
}

export function subscribeUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  return onSnapshot(userRef(uid), (snap) => onData(toProfile(snap)), onError);
}

/** Only fields a customer may change directly. Balance is never written from here. */
export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserProfile, "displayName" | "phone" | "cardFrozen" | "roundUps">>,
) {
  await setDoc(userRef(uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}
