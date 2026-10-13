import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import TransactionRow from "@/components/transaction";
import { Card, Chip } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { dayLabel, formatMoney } from "@/lib/format";
import { go } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { TextInput, View } from "react-native";

const filters = ["All", "Money in", "Money out"] as const;

export default function Activity() {
  const theme = useTheme();
  const { transactions } = useWallet();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const { groups, inTotal, outTotal } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = transactions
      .filter((t) => (filter === "All" ? true : filter === "Money in" ? t.kind === "credit" : t.kind === "debit"))
      .filter((t) => !q || `${t.title} ${t.subtitle} ${t.reference}`.toLowerCase().includes(q))
      .sort((a, b) => b.ts - a.ts);
    const map = new Map<string, typeof list>();
    list.forEach((t) => {
      const k = dayLabel(t.ts);
      map.set(k, [...(map.get(k) ?? []), t]);
    });
    return {
      groups: [...map.entries()],
      inTotal: list.filter((t) => t.kind === "credit").reduce((s, t) => s + t.amount, 0),
      outTotal: list.filter((t) => t.kind === "debit").reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions, filter, query]);

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Activity" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ flexDirection: "row", alignItems: "center", height: 50, borderRadius: 25, paddingHorizontal: Spacing.three, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}>
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search transactions" placeholderTextColor={theme.inkSoft} selectionColor={theme.accent} style={{ flex: 1, marginLeft: Spacing.two, color: theme.text, fontSize: 15 }} />
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three }}>
          {filters.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.three, marginTop: Spacing.three }}>
          <Card alt style={{ flex: 1, padding: Spacing.three - 2 }}>
            <ThemedText type="caption" themeColor="textSecondary">In</ThemedText>
            <ThemedText type="bold" style={{ color: theme.success, marginTop: 2 }}>{formatMoney(inTotal, { decimals: false })}</ThemedText>
          </Card>
          <Card alt style={{ flex: 1, padding: Spacing.three - 2 }}>
            <ThemedText type="caption" themeColor="textSecondary">Out</ThemedText>
            <ThemedText type="bold" style={{ marginTop: 2 }}>{formatMoney(outTotal, { decimals: false })}</ThemedText>
          </Card>
        </View>

        {groups.length === 0 && (
          <ThemedText themeColor="textSecondary" style={{ textAlign: "center", marginTop: Spacing.five }}>No transactions match your search.</ThemedText>
        )}

        {groups.map(([day, items]) => (
          <View key={day} style={{ marginTop: Spacing.four }}>
            <ThemedText type="label" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>{day}</ThemedText>
            <Card style={{ paddingVertical: Spacing.one }}>
              {items.map((t, i) => (
                <TransactionRow key={t.id} tx={t} last={i === items.length - 1} onPress={() => go(`/transaction/${t.id}`)} />
              ))}
            </Card>
          </View>
        ))}
      </View>
    </Container>
  );
}
