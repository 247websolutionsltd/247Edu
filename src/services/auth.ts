import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import { auth } from "../config/firebase";

export const registerUser = async (
  email: string,
  password: string
) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};