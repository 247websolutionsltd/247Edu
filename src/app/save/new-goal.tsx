import Button from "@/components/button";
import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, IconBadge, Toggle } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { goalIcons } from "@/data/categories";
import { useTheme } from "@/hooks/use-theme";
import { groupDigits, parseAmount } from "@/lib/format";
import { goReplace } from "@/lib/nav";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const durations = [
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "12 months", months: 12 },
];

const dueLabel = (months: number) =>
  new Date(new Date().setMonth(new Date().getMonth() + months)).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

export default function NewGoal() {
  const theme = useTheme();
  const { locked: lockedParam } = useLocalSearchParams<{ locked?: string }>();
  const { createGoal } = useWallet();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(goalIcons[0]);
  const [target, setTarget] = useState("");
  const [initial, setInitial] = useState("");
  const [months, setMonths] = useState(6);
  const [locked, setLocked] = useState(lockedParam === "1");
  const [error, setError] = useState<string | null>(null);
  const rate = locked ? 14 : 10;

  const submit = () => {
    const res = createGoal({ name, icon, target: parseAmount(target), initial: parseAmount(initial), dueLabel: dueLabel(months), locked, rate });
    if (!res.ok) return setError(res.error);
    goReplace(`/save/${res.id}`);
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="New savings goal" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>Pick an icon</ThemedText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two + 2 }}>
          {goalIcons.map((i) => (
            <TouchableOpacity key={i} onPress={() => setIcon(i)} accessibilityLabel={i}>
              <IconBadge icon={i} size={54} bg={icon === i ? theme.accent : theme.card} color={icon === i ? theme.ctaText : theme.accent} />
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Goal name" placeholder="e.g. New laptop" value={name} onChangeText={setName} />
        <Input label="Target amount" prefix="₦" placeholder="0" number value={target} onChangeText={(t) => setTarget(groupDigits(t))} />
        <Input label="First deposit (optional)" prefix="₦" placeholder="0" number value={initial} onChangeText={(t) => setInitial(groupDigits(t))} />

        <ThemedText type="small" themeColor="textSecondary" style={{ marginVertical: Spacing.two }}>Reach it in</ThemedText>
        <View style={{ flexDirection: "row", gap: Spacing.two }}>
          {durations.map((d) => (
            <Chip key={d.months} label={d.label} selected={months === d.months} onPress={() => setMonths(d.months)} />
          ))}
        </View>

        <Card style={{ marginTop: Spacing.four, flexDirection: "row", alignItems: "center" }}>
          <IconBadge icon="lock-closed" />
          <View style={{ flex: 1, marginHorizontal: Spacing.three }}>
            <ThemedText type="smallBold">Lock until {dueLabel(months)}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
              Earn {rate}% p.a. {locked ? "· no early withdrawals" : "· switch on for 14%"}
            </ThemedText>
          </View>
          <Toggle value={locked} onValueChange={setLocked} label="Lock goal" />
        </Card>

        {error ? <ThemedText type="small" style={{ color: theme.danger, marginTop: Spacing.three }}>{error}</ThemedText> : null}
        <Button title="Create goal" onPress={submit} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
