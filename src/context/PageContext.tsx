import { auth } from "@/config/firebase";
import { goReplace } from "@/lib/nav";
import { loginUser, registerUser } from "@/services/auth";
import { createUserProfile } from "@/services/userProfile";
import { getUserProfile, updateUserProfile, UserProfile } from "@/services/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

/* -------------------------------------------------------------------------- */
/* Theme                                                                       */
/* -------------------------------------------------------------------------- */

export type ThemeMode = "light" | "dark";

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({
  children,
  initialTheme = "dark",
}: {
  children: ReactNode;
  initialTheme?: ThemeMode;
}) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  const toggleThemeMode = () => setThemeMode((c) => (c === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used inside an AppThemeProvider");
  return context;
}

/* -------------------------------------------------------------------------- */
/* Auth / profile                                                              */
/* -------------------------------------------------------------------------- */

type LogInForm = { email: string; password: string };
type RegisterForm = {
  email: string;
  password: string;
  confirm: string;
  name: string;
  phone: string;
};

export type Owner = {
  name: string;
  tier: string;
  phone: string;
  email: string;
  referralCode: string;
};

type AuthContextType = {
  loading: boolean;
  logInForm: LogInForm;
  updateLogInField: (field: keyof LogInForm, value: string) => void;
  registerForm: RegisterForm;
  updateRegisterField: (field: keyof RegisterForm, value: string) => void;
  owner: Owner;
  updateOwner: (patch: Pick<Partial<Owner>, "name" | "phone">) => Promise<void>;
  handleSignup: () => Promise<void>;
  handleLogin: () => Promise<void>;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialOwner: Owner = {
  name: "",
  tier: "Tier 2 · Verified",
  phone: "",
  email: "",
  referralCode: "KEN2400",
};

async function loadOwnerProfile(user: User): Promise<Owner> {
  let profile = await getUserProfile(user.uid);
  if (!profile) {
    await createUserProfile(user);
    profile = {
      uid: user.uid,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
      photoURL: user.photoURL ?? undefined,
    };
  }

  return {
    ...initialOwner,
    name: profile.displayName ?? user.displayName ?? "",
    email: profile.email ?? user.email ?? "",
    phone: profile.phone ?? "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading] = useState(false);
  const [logInForm, setLogInForm] = useState<LogInForm>({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: "",
    password: "",
    confirm: "",
    name: "",
    phone: "",
  });
  const [owner, setOwner] = useState<Owner>(initialOwner);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setOwner(initialOwner);
        return;
      }

      void loadOwnerProfile(user)
        .then((profile) => {
          if (auth.currentUser?.uid === user.uid) {
            setOwner(profile);
          }
        })
        .catch((error: unknown) => {
          console.error("Unable to load the Firebase user profile", error);
          Alert.alert("Profile unavailable", "Your account is signed in, but we couldn't load your profile. Please try again.");
        });
      });

    return unsubscribe;
  }, []);

  const handleSignup = async () => {
    try {
      const user = await registerUser(registerForm.email, registerForm.password);
      const displayName = registerForm.name.trim();
      await updateProfile(user, { displayName });
      await createUserProfile(user, {
        displayName,
        phone: registerForm.phone.trim(),
        balance: "0",
        savings: "0",
        weekSpent: "0",
        savingsGoal: [],
      });
      setOwner({
        ...initialOwner,
        name: displayName,
        email: user.email ?? "",
        phone: registerForm.phone.trim(),
      });
      const userData = await getUserProfile(user.uid);
      console.log("Registered user:", userData);
      setUser(userData);
      goReplace("/(tabs)/home");
    } catch (error: unknown) {
      Alert.alert(
        "Signup failed",
        error instanceof Error ? error.message : "Unable to create your account."
      );
    }
  };
  const handleLogin = async () => {
    try {
      const user = await loginUser(logInForm.email, logInForm.password);
      const userData = await getUserProfile(user.uid);
      console.log("User profile:", userData);
      AsyncStorage.setItem("userID", JSON.stringify(userData?.uid));
      setUser(userData);
      goReplace("/(tabs)/home");
    } catch (error: unknown) {
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Unable to sign in."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        logInForm,
        updateLogInField: (f, v) => setLogInForm((p) => ({ ...p, [f]: v })),
        registerForm,
        updateRegisterField: (f, v) => setRegisterForm((p) => ({ ...p, [f]: v })),
        owner,
        updateOwner: async (patch) => {
          const user = auth.currentUser;
          if (!user) {
            throw new Error("You must be signed in to update your profile.");
          }

          const displayName = patch.name?.trim() ?? owner.name;
          const phone = patch.phone?.trim() ?? owner.phone;
          await updateProfile(user, { displayName });
          await updateUserProfile(user.uid, { displayName, phone });
          setOwner((current) => ({ ...current, name: displayName, phone }));
        },
        handleSignup,
        handleLogin,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
