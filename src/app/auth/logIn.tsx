import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import Input from "@/components/custom-input";
import GoogleSignInButton from "@/components/google-signin-button";
import { ThemedText } from "@/components/themed-text";
import { Brand } from "@/constants/brand";
import { Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { go } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function LogIn() {
  const theme = useTheme();
  const { logInForm, updateLogInField, handleLogin, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!logInForm.email.trim() || !logInForm.password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError(null);
    handleLogin();
  };

  return (
    <AuthShell hero title={"Welcome\nback."} subtitle={`Sign in to ${Brand.name} to manage your money.`}>
      <Input
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={logInForm.email}
        onChangeText={(t) => updateLogInField("email", t)}
      />
      <Input
        label="Password"
        icon="lock-closed-outline"
        placeholder="Enter your password"
        password
        value={logInForm.password}
        onChangeText={(t) => updateLogInField("password", t)}
        error={error}
      />
      <TouchableOpacity onPress={() => go("/auth/forgot")} style={{ alignSelf: "flex-end", paddingVertical: Spacing.two }}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>Forgot password?</ThemedText>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.three, marginTop: Spacing.two }}>
        <Button title="Sign in" onPress={submit} loading={loading} style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={submit}
          accessibilityLabel="Sign in with biometrics"
          style={{
            width: 58,
            height: 58,
            borderRadius: Radius.pill,
            borderWidth: 1.5,
            borderColor: theme.line,
            backgroundColor: theme.card,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="finger-print" size={28} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: Spacing.four }}>
        <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginHorizontal: Spacing.three }}>OR CONTINUE WITH</ThemedText>
        <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
      </View>

      <View style={{ flexDirection: "row", gap: Spacing.three }}>
        <GoogleSignInButton/>
        
        <TouchableOpacity
          onPress={submit}
          style={{
            flex: 1,
            height: 52,
            borderRadius: Radius.pill,
            borderWidth: 1,
            borderColor: theme.line,
            backgroundColor: theme.card,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons name={"logo-apple"} size={19} color={theme.text} />
          <ThemedText type="smallBold" style={{ marginLeft: Spacing.two }}>Apple</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, minHeight: Spacing.four }} />
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <ThemedText type="small" themeColor="textSecondary">New to {Brand.name}? </ThemedText>
        <TouchableOpacity onPress={() => go("/auth/register")} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>Create account</ThemedText>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}
