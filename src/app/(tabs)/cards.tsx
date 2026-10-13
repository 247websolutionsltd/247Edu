import Container from "@/components/custom-container";
import { ThemedText } from "@/components/themed-text";
import TransactionRow from "@/components/transaction";
import { Card, IconBadge, SectionHeader } from "@/components/ui";
import VirtualCard from "@/components/virtual-card";
import { Spacing, TabBarSpace } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useWallet } from "@/context/WalletContext";
import { Category, IconName, categoryMeta } from "@/data/categories";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney } from "@/lib/format";
import { go } from "@/lib/nav";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Cards() {
  const theme = useTheme();
  const { owner } = useAuth();
  const { cardFrozen, toggleCardFrozen, transactions } = useWallet();
  const [revealed, setRevealed] = useState(false);

  // money out this month, grouped by category (excluding savings moves)
  const { rows, total } = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const map = new Map<Category, number>();
    transactions.forEach((t) => {
      if (t.kind !== "debit" || t.category === "savings" || t.ts < start.getTime()) return;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });
    const list = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return { rows: list, total: list.reduce((s, [, v]) => s + v, 0) };
  }, [transactions]);

  const cardTx = transactions.filter((t) => t.kind === "debit" && t.subtitle === "Card payment").slice(0, 4);

  const actions: { label: string; icon: IconName; onPress: () => void; active?: boolean }[] = [
    { label: cardFrozen ? "Unfreeze" : "Freeze", icon: "snow", onPress: toggleCardFrozen, active: cardFrozen },
    { label: revealed ? "Hide" : "Details", icon: revealed ? "eye-off" : "eye", onPress: () => setRevealed((v) => !v) },
    { label: "Add money", icon: "add-circle", onPress: () => go("/add-money/card") },
    { label: "Pay bills", icon: "flash", onPress: () => go("/bills") },
  ];

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ padding: Spacing.three }}>
        <ThemedText type="large">Cards & spending</ThemedText>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        <VirtualCard name={owner.name} revealed={revealed} frozen={cardFrozen} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: Spacing.four, marginTop: Spacing.four }}>
        {actions.map((a) => (
          <TouchableOpacity key={a.label} onPress={a.onPress} activeOpacity={0.8} style={{ alignItems: "center", width: 74 }} accessibilityLabel={a.label}>
            <IconBadge icon={a.icon} size={58} bg={a.active ? theme.accent : theme.card} color={a.active ? theme.ctaText : theme.accent} />
            <ThemedText type="caption" style={{ marginTop: Spacing.two, fontWeight: "600" }}>{a.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <SectionHeader title="Spent this month" />
        <Card>
          <ThemedText type="subtitle">{formatMoney(total, { decimals: false })}</ThemedText>
          {total > 0 && (
            <View style={{ flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden", marginTop: Spacing.three, gap: 2 }}>
              {rows.map(([cat, v]) => (
                <View key={cat} style={{ flex: v, backgroundColor: categoryMeta[cat].color }} />
              ))}
            </View>
          )}
          <View style={{ marginTop: Spacing.three }}>
            {rows.length === 0 && (
              <ThemedText type="small" themeColor="textSecondary">Nothing spent yet this month.</ThemedText>
            )}
            {rows.slice(0, 5).map(([cat, v]) => (
              <View key={cat} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: categoryMeta[cat].color }} />
                <ThemedText type="small" style={{ flex: 1, marginLeft: Spacing.two + 2 }}>{categoryMeta[cat].label}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" style={{ marginRight: Spacing.three }}>{Math.round((v / total) * 100)}%</ThemedText>
                <ThemedText type="amount" style={{ fontSize: 14 }}>{formatMoney(v, { decimals: false })}</ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <SectionHeader title="Card payments" action="All activity" onAction={() => go("/activity")} />
        <Card style={{ paddingVertical: Spacing.one }}>
          {cardTx.map((t, i) => (
            <TransactionRow key={t.id} tx={t} last={i === cardTx.length - 1} onPress={() => go(`/transaction/${t.id}`)} />
          ))}
        </Card>
      </View>
    </Container>
  );
}
