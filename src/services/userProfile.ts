import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { IconName } from "@/data/categories";
import type { User } from "firebase/auth";
import { db } from "../config/firebase";

type UserProfileFields = {
  displayName?: string;
  phone?: string;
  balance?: string;
  savings?: string;
  weekSpent?: string;
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

export async function createUserProfile(
  user: User,
  profile: UserProfileFields = {}
) {
  const userRef = doc(db, "users", user.uid);
  const displayName = profile.displayName ?? user.displayName;

  await setDoc(
    userRef,
    {
      uid: user.uid,
      ...(user.email ? { email: user.email } : {}),
      ...(displayName ? { displayName } : {}),
      ...(user.photoURL ? { photoURL: user.photoURL } : {}),
      ...(profile.phone !== undefined ? { phoneNumber: profile.phone } : {}),
      ...(profile.balance !== undefined ? { balance: profile.balance } : {}),
      ...(profile.savings !== undefined ? { savings: profile.savings } : {}),
      ...(profile.weekSpent !== undefined ? { weekSpent: profile.weekSpent } : {}),
      ...(profile.savingsGoal !== undefined ? { savings: profile.savingsGoal } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}