import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import OTPInput from "@/components/otpInput";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { go } from "@/lib/nav";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Otp() {
  const theme = useTheme();
  const { logInForm } = useAuth();
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = () => {
    if (code.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setError(null);
    go("/auth/reset");
  };

  return (
    <AuthShell title="Check your email" subtitle={`We sent a code to ${logInForm.email || "your email address"}.`} onBack={() => router.back()}>
      <OTPInput onChange={setCode} />
      {error ? <ThemedText type="caption" style={{ color: theme.danger }}>{error}</ThemedText> : null}

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: Spacing.three }}>
        {seconds > 0 ? (
          <ThemedText type="small" themeColor="textSecondary">Resend code in 0:{String(seconds).padStart(2, "0")}</ThemedText>
        ) : (
          <TouchableOpacity onPress={() => setSeconds(30)} hitSlop={8}>
            <ThemedText type="smallBold" style={{ color: theme.accent }}>Resend code</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <Button title="Verify" onPress={verify} style={{ marginTop: Spacing.five }} />
    </AuthShell>
  );
}
