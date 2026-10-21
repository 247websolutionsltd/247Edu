import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import Input from "@/components/custom-input";
import { ThemedText } from "@/components/themed-text";
import { Chip } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { go, goReplace } from "@/lib/nav";
import { LEVELS } from "@/services/users";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Register() {
  const theme = useTheme();
  const { registerForm: f, updateRegisterField, handleSignup, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!f.name.trim() || !f.studentId.trim() || !f.department.trim() || !f.email.trim() || !f.password) {
      setError("Please fill in every field marked required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) {
      setError("Enter a valid email address.");
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
    <AuthShell
      title="Join the portal"
      subtitle={`Register with your ${Brand.school} details to get started.`}
      onBack={() => (router.canGoBack() ? router.back() : goReplace("/auth/logIn"))}
    >
      <Input label="Full name *" icon="person-outline" placeholder="As it appears on your admission letter" value={f.name} onChangeText={(t) => updateRegisterField("name", t)} />
      <Input label="Matric / Student ID *" icon="id-card-outline" placeholder="CAD/23/0457" autoCapitalize="characters" value={f.studentId} onChangeText={(t) => updateRegisterField("studentId", t)} />
      <Input label="Department *" icon="school-outline" placeholder="e.g. Computer Science" value={f.department} onChangeText={(t) => updateRegisterField("department", t)} />

      <View style={{ paddingVertical: Spacing.two }}>
        <ThemedText type="label" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>
          Level *
        </ThemedText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two }}>
          {LEVELS.map((l) => (
            <Chip key={l} label={l} selected={f.level === l} onPress={() => updateRegisterField("level", l)} />
          ))}
        </View>
      </View>

      <Input label="Phone number" icon="call-outline" placeholder="0803 000 0000" number value={f.phone} onChangeText={(t) => updateRegisterField("phone", t)} />
      <Input label="Email *" icon="mail-outline" placeholder="you@student.cardinal.edu" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" value={f.email} onChangeText={(t) => updateRegisterField("email", t)} />
      <Input label="Password *" icon="lock-closed-outline" placeholder="At least 8 characters" password value={f.password} onChangeText={(t) => updateRegisterField("password", t)} />
      <Input label="Confirm password *" icon="lock-closed-outline" placeholder="Repeat your password" password value={f.confirm} onChangeText={(t) => updateRegisterField("confirm", t)} error={error} />

      <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 18 }}>
        By continuing you agree to {Brand.school}&apos;s portal terms and{" "}
        <ThemedText type="caption" style={{ color: theme.accent, fontWeight: "700" }} onPress={() => go("/account/privacy-policy")}>
          Privacy Policy
        </ThemedText>
        .
      </ThemedText>

      <Button title="Create account" icon="arrow-forward" onPress={submit} loading={loading} style={{ marginTop: Spacing.four }} />

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: Spacing.four }}>
        <ThemedText type="small" themeColor="textSecondary">
          Already registered?{" "}
        </ThemedText>
        <TouchableOpacity onPress={() => goReplace("/auth/logIn")} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            Sign in
          </ThemedText>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}
