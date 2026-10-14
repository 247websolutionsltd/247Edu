import Container from "@/components/custom-container";
import { RoundButton } from "@/components/header";
import BigAmount from "@/components/money";
import { ThemedText } from "@/components/themed-text";
import { Card, HeroDecor, IconBadge, ProgressBar, SectionHeader, Toggle } from "@/components/ui";
import { Colors, Radius, Spacing, TabBarSpace } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { compactMoney, formatMoney } from "@/lib/format";
import { go, goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

const plans = [
  { title: "Flexible savings", detail: "Withdraw any time", rate: "10% p.a.", icon: "leaf" as const, locked: "0" },
  { title: "Locked savings", detail: "Lock for 90 days or more", rate: "14% p.a.", icon: "lock-closed" as const, locked: "1" },
];

export default function Save() {
  const theme = useTheme();
  const { goals, savingsTotal, interestEarned, roundUps, setRoundUps } = useWallet();

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: Spacing.three }}>
        <ThemedText type="large">Savings</ThemedText>
        <RoundButton icon="add" label="New goal" onPress={() => go("/save/new-goal")} />
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four - 2, overflow: "hidden" }}>
          <HeroDecor />
          <ThemedText type="label" style={{ color: Colors.heroMuted }}>Total saved</ThemedText>
          <View style={{ marginTop: Spacing.two }}>
            <BigAmount value={savingsTotal} size={38} color="#FFF" mutedColor={Colors.heroMuted} decimals={false} />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.three }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: Colors.lime, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 }}>
              <Ionicons name="trending-up" size={14} color={Colors.palette.forest950} />
              <ThemedText type="caption" style={{ color: Colors.palette.forest950, marginLeft: 6, fontWeight: "700" }}>Earning up to 14% p.a.</ThemedText>
            </View>
            <View style={{ backgroundColor: Colors.heroChip, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 }}>
              <ThemedText type="caption" style={{ color: "#FFF", fontWeight: "600" }}>≈ {formatMoney((savingsTotal * (0.14 / 12)), { decimals: false })} interest / month</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.four }}>
        <Card style={{ flexDirection: "row", alignItems: "center" }}>
          <IconBadge icon="sparkles" />
          <View style={{ flex: 1, marginHorizontal: Spacing.three }}>
            <ThemedText type="smallBold">Round-up savings</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
              Save the spare change from every card payment.
            </ThemedText>
          </View>
          <Toggle value={roundUps} onValueChange={setRoundUps} label="Round-up savings" />
        </Card>
      </View>

      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <SectionHeader title="Start saving" />
        <View style={{ gap: Spacing.two + 2 }}>
          {plans.map((p) => (
            <Card key={p.title} onPress={() => goWith("/save/new-goal", { locked: p.locked })} style={{ flexDirection: "row", alignItems: "center" }}>
              <IconBadge icon={p.icon} />
              <View style={{ flex: 1, marginHorizontal: Spacing.three }}>
                <ThemedText type="smallBold">{p.title}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>{p.detail}</ThemedText>
              </View>
              <View style={{ backgroundColor: theme.accentSurface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                <ThemedText type="caption" style={{ color: theme.accentText, fontWeight: "700" }}>{p.rate}</ThemedText>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <SectionHeader title="Your goals" />
        {goals.length === 0 && (
          <Card alt>
            <ThemedText type="small" themeColor="textSecondary">No goals yet. Tap + to create your first one.</ThemedText>
          </Card>
        )}
        <View style={{ gap: Spacing.three }}>
          {goals.map((g) => {
            const pct = g.saved / g.target || 1;
            return (
              <Card key={g.id} onPress={() => go(`/save/${g.id}`)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconBadge icon={g.icon} />
                  <View style={{ flex: 1, marginLeft: Spacing.three }}>
                    <ThemedText type="smallBold">{g.name}</ThemedText>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                      {g.locked && <Ionicons name="lock-closed" size={11} color={theme.textSecondary} style={{ marginRight: 4 }} />}
                      <ThemedText type="caption" themeColor="textSecondary">{g.locked ? "Locked · " : ""}Due {g.dueLabel}</ThemedText>
                    </View>
                  </View>
                  <ThemedText type="smallBold" style={{ color: theme.accent }}>{Math.round(pct * 100)}%</ThemedText>
                </View>
                <View style={{ marginTop: Spacing.three }}>
                  <ProgressBar value={pct} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: Spacing.two }}>
                  <ThemedText type="caption" style={{ fontWeight: "700" }}>{compactMoney(g.saved)} saved</ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">Target {compactMoney(g.target)}</ThemedText>
                </View>
              </Card>
            );
          })}
        </View>
      </View>
    </Container>
  );
}
