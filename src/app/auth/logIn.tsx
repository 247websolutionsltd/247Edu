import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import Input from "@/components/custom-input";
import { ThemedText } from "@/components/themed-text";
import { IconBadge } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { go } from "@/lib/nav";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function LogIn() {
  const theme = useTheme();
  const { logInForm, updateLogInField, handleLogin, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  const submit = () => {
    if (!logInForm.email.trim() || !logInForm.password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError(null);
    handleLogin();
  };

  return (
    <AuthShell tall title={"Welcome back,\nscholar."} subtitle={`Sign in to the ${Brand.school} portal to see your scores, tests and notices.`}>
      <Input
        label="School or personal email"
        icon="mail-outline"
        placeholder="you@student.cardinal.edu"
        autoCapitalize="none"
        autoCorrect={false}
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

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: Spacing.two }}>
        <TouchableOpacity onPress={() => setRemember(!remember)} activeOpacity={0.8} style={{ flexDirection: "row", alignItems: "center" }} accessibilityRole="checkbox" accessibilityState={{ checked: remember }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              borderWidth: 1.5,
              borderColor: remember ? theme.accent : theme.controlOff,
              backgroundColor: remember ? theme.accent : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {remember ? <ThemedText style={{ color: "#FFF", fontSize: 13, lineHeight: 16, fontWeight: "900" }}>✓</ThemedText> : null}
          </View>
          <ThemedText type="small" style={{ marginLeft: Spacing.two }}>
            Keep me signed in
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go("/auth/forgot")} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            Forgot password?
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Button title="Sign in" icon="arrow-forward" onPress={submit} loading={loading} style={{ marginTop: Spacing.two }} />

      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: Spacing.four }}>
        <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
        <ThemedText type="label" themeColor="inkSoft" style={{ marginHorizontal: Spacing.three, fontSize: 10 }}>
          New here?
        </ThemedText>
        <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
      </View>

      <TouchableOpacity
        onPress={() => go("/auth/register")}
        activeOpacity={0.85}
        style={{ flexDirection: "row", alignItems: "center", padding: Spacing.three, borderRadius: Radius.md, backgroundColor: theme.accentSurface, borderWidth: 1, borderColor: theme.line }}
      >
        <IconBadge icon="person-add" size={40} bg={theme.card} />
        <View style={{ flex: 1, marginLeft: Spacing.three }}>
          <ThemedText type="smallBold">Create a student account</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Takes about two minutes
          </ThemedText>
        </View>
        <ThemedText type="bold" style={{ color: theme.accent }}>
          →
        </ThemedText>
      </TouchableOpacity>
    </AuthShell>
  );
}
