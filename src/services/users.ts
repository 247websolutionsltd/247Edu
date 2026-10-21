import { doc, onSnapshot, runTransaction, serverTimestamp, setDoc, type DocumentSnapshot, type Unsubscribe } from "firebase/firestore";

import type { User } from "firebase/auth";
import { db } from "../config/firebase";

export type UserProfile = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  studentId: string;
  department: string;
  level: string;
};

export const LEVELS = ["100", "200", "300", "400", "500"] as const;

export const userRef = (uid: string) => doc(db, "users", uid);

/* ------------------------------ generators ------------------------------- */

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

// NOTE: random, not guaranteed unique. Issue real matric numbers from your registry in production.
export const generateStudentId = () => `CAD/${new Date().getFullYear().toString().slice(2)}/${digits(4)}`;

/* -------------------------------- mapping -------------------------------- */

export function toProfile(snap: DocumentSnapshot): UserProfile | null {
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: snap.id,
    email: d.email,
    displayName: d.displayName,
    photoURL: d.photoURL,
    phone: d.phone ?? d.phoneNumber ?? "",
    studentId: d.studentId ?? "",
    department: d.department ?? "",
    level: d.level ?? "100",
  };
}

/* ------------------------------ operations ------------------------------- */

type Extra = { displayName?: string; phone?: string; studentId?: string; department?: string; level?: string };

/**
 * Idempotent: creates the student document on first sign-in and fills in anything missing
 * on later ones. Safe to call on every sign-in.
 */
export async function ensureUserAccount(user: User, extra: Extra = {}): Promise<void> {
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
        studentId: extra.studentId?.trim().toUpperCase() || generateStudentId(),
        department: extra.department?.trim() || "Computer Science",
        level: extra.level || "300",
        createdAt: Date.now(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const d = snap.data();
    const patch: Record<string, unknown> = {};
    if (!d.studentId) patch.studentId = extra.studentId?.trim().toUpperCase() || generateStudentId();
    if (!d.department) patch.department = extra.department?.trim() || "Computer Science";
    if (!d.level) patch.level = extra.level || "300";
    if (!d.phone && d.phoneNumber) patch.phone = d.phoneNumber;
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

/** Only fields a student may change directly. */
export async function updateUserProfile(uid: string, patch: Partial<Pick<UserProfile, "displayName" | "phone" | "department">>) {
  await setDoc(userRef(uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}
