import Button from "@/components/button";
import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import Header from "@/components/header";
import BigAmount from "@/components/money";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, DetailRow, HeroDecor, ProgressBar } from "@/components/ui";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney, groupDigits, parseAmount } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function GoalDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, balance, fundGoal, withdrawGoal } = useWallet();
  const goal = goals.find((g) => g.id === id);
  const [mode, setMode] = useState<"add" | "withdraw">("add");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!goal) {
    return (
      <Container edges={["top"]}>
        <Header title="Goal" />
        <ThemedText style={{ padding: Spacing.three }} themeColor="textSecondary">This goal no longer exists.</ThemedText>
      </Container>
    );
  }

  const pct = goal.saved / goal.target;
  const submit = () => {
    const amt = parseAmount(amount);
    const res = mode === "add" ? fundGoal(goal.id, amt) : withdrawGoal(goal.id, amt);
    if (!res.ok) return setError(res.error);
    setError(null);
    setAmount("");
    goWith("/transfer/success", { kind: "goal", txId: res.id });
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title={goal.name} />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four - 2, overflow: "hidden" }}>
          <HeroDecor />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <ThemedText type="label" style={{ color: Colors.heroMuted }}>Saved so far</ThemedText>
            <Ionicons name={goal.icon} size={22} color={Colors.lime} />
          </View>
          <View style={{ marginTop: Spacing.two }}>
            <BigAmount value={goal.saved} size={38} color="#FFF" mutedColor={Colors.heroMuted} decimals={false} />
          </View>
          <View style={{ height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.16)", marginTop: Spacing.four }}>
            <View style={{ width: `${Math.min(100, pct * 100)}%`, height: 10, borderRadius: 5, backgroundColor: Colors.lime }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: Spacing.two }}>
            <ThemedText type="caption" style={{ color: "#FFF", fontWeight: "700" }}>{Math.round(pct * 100)}%</ThemedText>
            <ThemedText type="caption" style={{ color: Colors.heroMuted }}>Target {formatMoney(goal.target, { decimals: false })}</ThemedText>
          </View>
        </View>

        <Card style={{ marginTop: Spacing.three, paddingVertical: Spacing.one }}>
          <DetailRow label="Remaining" value={formatMoney(Math.max(0, goal.target - goal.saved), { decimals: false })} />
          <DetailRow label="Due" value={goal.dueLabel} />
          <DetailRow label="Interest" value={`${goal.rate}% p.a.`} />
          <DetailRow label="Status" value={goal.locked ? "Locked" : "Flexible"} last />
        </Card>

        <View style={{ flexDirection: "row", gap: Spacing.two, marginTop: Spacing.four }}>
          <Chip label="Add money" icon="add" selected={mode === "add"} onPress={() => { setMode("add"); setError(null); }} />
          <Chip label="Withdraw" icon="arrow-down" selected={mode === "withdraw"} onPress={() => { setMode("withdraw"); setError(null); }} />
        </View>

        <Input
          label={mode === "add" ? `Amount (wallet: ${formatMoney(balance, { decimals: false })})` : "Amount to withdraw"}
          prefix="₦"
          placeholder="0"
          number
          value={amount}
          onChangeText={(t) => setAmount(groupDigits(t))}
          error={error}
        />
        {mode === "withdraw" && goal.locked && (
          <ThemedText type="caption" themeColor="textSecondary">This goal is locked until {goal.dueLabel}.</ThemedText>
        )}
        <Button
          title={mode === "add" ? "Add to goal" : "Withdraw to wallet"}
          onPress={submit}
          disabled={mode === "withdraw" && goal.locked}
          style={{ marginTop: Spacing.three }}
        />
      </View>
    </Container>
  );
}
