import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import Input from "@/components/custom-input";
import GoogleSignInButton from "@/components/google-signin-button";
import { ThemedText } from "@/components/themed-text";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { go, goReplace } from "@/lib/nav";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Register() {
  const theme = useTheme();
  const { registerForm: f, updateRegisterField, handleSignup, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const submit = async() => {
    if (!f.name.trim() || !f.phone.trim() || !f.email.trim() || !f.password) {
      setError("Please fill in every field.");
      return;
    }
    if (f.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (f.password !== f.confirm) {
      setError("Your passwords don't match.");
      return;
    }
    setError(null);
    await handleSignup();
  };

  return (
    <AuthShell title="Open your account" subtitle="It takes about two minutes. No paperwork." onBack={() => (router.canGoBack() ? router.back() : goReplace("/auth/logIn"))}>
      <Input label="Full name" icon="person-outline" placeholder="As it appears on your ID" value={f.name} onChangeText={(t) => updateRegisterField("name", t)} />
      <Input label="Phone number" icon="call-outline" placeholder="0803 000 0000" number value={f.phone} onChangeText={(t) => updateRegisterField("phone", t)} />
      <Input label="Email" icon="mail-outline" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={f.email} onChangeText={(t) => updateRegisterField("email", t)} />
      <Input label="Password" icon="lock-closed-outline" placeholder="At least 8 characters" password value={f.password} onChangeText={(t) => updateRegisterField("password", t)} />
      <Input label="Confirm password" icon="lock-closed-outline" placeholder="Repeat your password" password value={f.confirm} onChangeText={(t) => updateRegisterField("confirm", t)} error={error} />

      <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 18 }}>
        By continuing you agree to {Brand.name}&apos;s Terms of Service and{" "}
        <ThemedText type="caption" style={{ color: theme.accent }} onPress={() => go("/account/privacy-policy")}>
          Privacy Policy
        </ThemedText>
        .
      </ThemedText>

      <Button title="Create account" onPress={submit} loading={loading} style={{ marginTop: Spacing.four }} />

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.four }}>
        <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginHorizontal: Spacing.three }}>OR SIGN UP WITH</ThemedText>
        <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
      </View>
      <View style={{ flexDirection: "row", marginTop: Spacing.three }}>
        <GoogleSignInButton />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: Spacing.four }}>
        <ThemedText type="small" themeColor="textSecondary">Already have an account? </ThemedText>
        <TouchableOpacity onPress={() => goReplace("/auth/logIn")} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>Sign in</ThemedText>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}
