import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in:", user.uid);
  } else {
    console.log("Not logged in");
  }
});