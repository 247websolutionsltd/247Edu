import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import Input from "@/components/custom-input";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { go, goReplace } from "@/lib/nav";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Forgot() {
  const theme = useTheme();
  const { logInForm, updateLogInField } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(logInForm.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    go("/auth/otp");
  };

  return (
    <AuthShell title="Forgot password?" subtitle="No stress. We'll send a 6-digit code to your email." onBack={() => router.back()}>
      <Input label="Email" icon="mail-outline" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={logInForm.email} onChangeText={(t) => updateLogInField("email", t)} error={error} />
      <Button title="Send code" onPress={submit} style={{ marginTop: Spacing.three }} />
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: Spacing.four }}>
        <ThemedText type="small" themeColor="textSecondary">Remembered it? </ThemedText>
        <TouchableOpacity onPress={() => goReplace("/auth/logIn")} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>Back to sign in</ThemedText>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}
