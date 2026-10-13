import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { IconName } from "@/data/categories";
import { db } from "../config/firebase";

const normalizeNumber = (value: number | string | undefined, fallback = 0): number => {
  if (value === undefined || value === null || value === "") return fallback;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export type UserProfile = {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    phone?: string;
    balance?: number;
    savings?: number;
    weekSpent?: number;
    savingsGoal?: {
        name: string;
        amount: string;
        goal: string;
        locked: boolean;
        id: string;
        icon: IconName;
        dueLabel: string;
    }[];
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as Partial<UserProfile>;

    return {
      ...data,
      balance: normalizeNumber(data.balance, 0),
      savings: normalizeNumber(data.savings, 0),
      weekSpent: normalizeNumber(data.weekSpent, 0),
    } as UserProfile;
}

export async function ensureUserBalance(uid: string): Promise<void> {
    const userRef = doc(db, "users", uid);

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const balance = snapshot.data()?.balance;

      if (!snapshot.exists() || balance === undefined) {
        transaction.set(userRef, {
          balance: 0,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        return;
      }

      const normalizedBalance = typeof balance === "number" ? balance : Number(balance);

      if (!Number.isFinite(normalizedBalance) || normalizedBalance < 0) {
        throw new Error("The stored wallet balance is invalid.");
      }

      if (typeof balance !== "number" || balance !== normalizedBalance) {
        transaction.set(userRef, {
          balance: normalizedBalance,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    });
}

export async function updateUserProfile(
    uid: string,
    profile: Partial<UserProfile>
) {
    const userRef = doc(db, "users", uid);
    const normalizedProfile: Partial<UserProfile> = {
      ...profile,
      ...(profile.balance !== undefined ? { balance: normalizeNumber(profile.balance, 0) } : {}),
      ...(profile.savings !== undefined ? { savings: normalizeNumber(profile.savings, 0) } : {}),
      ...(profile.weekSpent !== undefined ? { weekSpent: normalizeNumber(profile.weekSpent, 0) } : {}),
    };

    await setDoc(userRef, {
      ...normalizedProfile,
      updatedAt: serverTimestamp(),
    }, {
      merge: true,
    });
}