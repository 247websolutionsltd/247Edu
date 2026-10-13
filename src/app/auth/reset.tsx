import AuthShell from "@/components/auth-shell";
import Button from "@/components/button";
import Input from "@/components/custom-input";
import { Spacing } from "@/constants/theme";
import { goReplace } from "@/lib/nav";
import { router } from "expo-router";
import { useState } from "react";

export default function Reset() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (pw.length < 8) return setError("Use at least 8 characters.");
    if (pw !== confirm) return setError("Your passwords don't match.");
    setError(null);
    goReplace("/auth/logIn");
  };

  return (
    <AuthShell title="New password" subtitle="Choose something strong that you haven't used before." onBack={() => router.back()}>
      <Input label="New password" icon="lock-closed-outline" placeholder="At least 8 characters" password value={pw} onChangeText={setPw} />
      <Input label="Confirm password" icon="lock-closed-outline" placeholder="Repeat your password" password value={confirm} onChangeText={setConfirm} error={error} />
      <Button title="Update password" onPress={submit} style={{ marginTop: Spacing.four }} />
    </AuthShell>
  );
}
