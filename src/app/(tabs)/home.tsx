import Avatar from "@/components/avatar";
import Container from "@/components/custom-container";
import { RoundButton } from "@/components/header";
import BigAmount from "@/components/money";
import { ThemedText } from "@/components/themed-text";
import TransactionRow from "@/components/transaction";
import { Card, HeroDecor, IconBadge, ProgressBar, SectionHeader } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Colors, Radius, Spacing, TabBarSpace } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useWallet } from "@/context/WalletContext";
import { IconName } from "@/data/categories";
import { useTheme } from "@/hooks/use-theme";
import { compactMoney, formatMoney, greeting } from "@/lib/format";
import { go } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { ScrollView, Share, TouchableOpacity, View } from "react-native";

const DAY = 86_400_000;
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

const quickActions: { label: string; icon: IconName; route: string }[] = [
  { label: "Add money", icon: "add", route: "/add-money/bank" },
  { label: "Send", icon: "arrow-up", route: "/transfer" },
  { label: "Save", icon: "leaf", route: "/(tabs)/save" },
  { label: "Pay bills", icon: "flash", route: "/bills" },
];

export default function Home() {
  const theme = useTheme();
  const { owner, user, setUser } = useAuth();
  const { transactions, goals, balanceHidden, toggleBalanceHidden, notifications } = useWallet();
  const walletBalance = Number(user?.balance ?? 0);
  const savingsTotal = Number(user?.savings ?? 0);
  const weekSpent = Number(user?.weekSpent ?? 0);
  const firstName = owner.name.split(" ")[0];
  const unread = notifications.some((n) => n.unread);
  // spending = money out, excluding transfers to savings
  const { week, weekTotal } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const start = now.getTime() - (6 - i) * DAY;
      return { start, letter: DAY_LETTERS[new Date(start).getDay()], total: 0, today: i === 6 };
    });
    transactions.forEach((t) => {
      if (t.kind !== "debit" || t.category === "savings") return;
      const d = days.find((x) => t.ts >= x.start && t.ts < x.start + DAY);
      if (d) d.total += t.amount;
    });
    return { week: days, weekTotal: days.reduce((s, d) => s + d.total, 0) };
  }, [transactions]);
  const maxDay = Math.max(...week.map((d) => d.total), 1);

  const shareAccount = () =>
    Share.share({ message: `${owner.name}\n${Brand.bankName}\n${Brand.accountNumber}` });

  useEffect(()=>{
    // const load = async()=>{
    //   const userID = await AsyncStorage.getItem("userID");
    //   const userData = await getUserProfile(userID || "");
    //   console.log("User profile:", userData);
    //   setUser(userData);
    //   console.log(user);
    // }
    // load();
    console.log("User profile:", user);
  })

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing.three, paddingTop: Spacing.two }}>
        <TouchableOpacity onPress={() => go("/(tabs)/profile")} accessibilityLabel="Open profile">
          <Avatar name={owner.name} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: Spacing.three }}>
          <ThemedText type="caption" themeColor="textSecondary">{greeting()}</ThemedText>
          <ThemedText type="big">{firstName}</ThemedText>
        </View>
        <RoundButton icon="notifications-outline" label="Notifications" dot={unread} onPress={() => go("/notifications")} />
      </View>

      {/* Balance hero */}
      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.four }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four - 2, overflow: "hidden" }}>
          <HeroDecor />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <ThemedText type="label" style={{ color: Colors.heroMuted }}>Wallet balance</ThemedText>
            <TouchableOpacity onPress={toggleBalanceHidden} hitSlop={12} accessibilityLabel={balanceHidden ? "Show balance" : "Hide balance"}>
              <Ionicons name={balanceHidden ? "eye-off-outline" : "eye-outline"} size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: Spacing.two }}>
            <BigAmount value={walletBalance} hidden={balanceHidden} size={40} color="#FFF" mutedColor={Colors.heroMuted} />
          </View>

          <TouchableOpacity
            onPress={shareAccount}
            activeOpacity={0.8}
            style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginTop: Spacing.three, backgroundColor: Colors.heroChip, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 }}
          >
            <ThemedText type="caption" style={{ color: "#FFF", fontWeight: "600" }}>
              {Brand.bankName} · {Brand.accountNumber}
            </ThemedText>
            <Ionicons name="share-outline" size={14} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: Spacing.two, marginTop: Spacing.four }}>
            <TouchableOpacity onPress={() => go("/(tabs)/save")} activeOpacity={0.85} style={{ flex: 1, backgroundColor: "rgba(4,18,12,0.28)", borderRadius: Radius.md, padding: Spacing.three - 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="leaf" size={14} color={Colors.lime} />
                <ThemedText type="caption" style={{ color: Colors.heroMuted, marginLeft: 6 }}>Savings</ThemedText>
              </View>
              <ThemedText type="bold" style={{ color: "#FFF", marginTop: 4 }}>{balanceHidden ? "••••" : compactMoney(savingsTotal)}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => go("/activity")} activeOpacity={0.85} style={{ flex: 1, backgroundColor: "rgba(4,18,12,0.28)", borderRadius: Radius.md, padding: Spacing.three - 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="trending-down" size={14} color={Colors.lime} />
                <ThemedText type="caption" style={{ color: Colors.heroMuted, marginLeft: 6 }}>Spent this week</ThemedText>
              </View>
              <ThemedText type="bold" style={{ color: "#FFF", marginTop: 4 }}>{balanceHidden ? "••••" : compactMoney(weekSpent)}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: Spacing.four, marginTop: Spacing.four }}>
        {quickActions.map((a) => (
          <TouchableOpacity key={a.label} onPress={() => go(a.route)} activeOpacity={0.8} style={{ alignItems: "center", width: 74 }} accessibilityLabel={a.label}>
            <View style={{ width: 62, height: 62, borderRadius: 22, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={a.icon} size={24} color={theme.accent} />
            </View>
            <ThemedText type="caption" style={{ marginTop: Spacing.two, fontWeight: "600" }}>{a.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goals */}
      <View style={{ marginTop: Spacing.five }}>
        <View style={{ paddingHorizontal: Spacing.three }}>
          <SectionHeader title="Savings goals" action="See all" onAction={() => go("/(tabs)/save")} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.three, gap: Spacing.three }}>
          {goals.map((g) => (
            <Card key={g.id} onPress={() => go(`/save/${g.id}`)} style={{ width: 216 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <IconBadge icon={g.icon} size={42} />
                {g.locked && <Ionicons name="lock-closed" size={14} color={theme.textSecondary} />}
              </View>
              <ThemedText type="smallBold" style={{ marginTop: Spacing.three }} numberOfLines={1}>{g.name}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
                {compactMoney(g.saved)} of {compactMoney(g.target)}
              </ThemedText>
              <View style={{ marginTop: Spacing.three }}>
                <ProgressBar value={g.saved / g.target} />
              </View>
            </Card>
          ))}
          <TouchableOpacity
            onPress={() => go("/save/new-goal")}
            activeOpacity={0.8}
            style={{ width: 130, borderRadius: Radius.lg, borderWidth: 1.5, borderStyle: "dashed", borderColor: theme.inkSoft, alignItems: "center", justifyContent: "center", padding: Spacing.three }}
          >
            <Ionicons name="add-circle-outline" size={28} color={theme.accent} />
            <ThemedText type="smallBold" style={{ marginTop: Spacing.two, color: theme.accent }}>New goal</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Weekly insight */}
      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <SectionHeader title="This week" />
        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <View>
              <ThemedText type="caption" themeColor="textSecondary">Total spent</ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 2 }}>{balanceHidden ? "₦••••••" : formatMoney(weekSpent, { decimals: false })}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => go("/(tabs)/cards")} hitSlop={10}>
              <ThemedText type="smallBold" style={{ color: theme.accent }}>Breakdown</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 110, marginTop: Spacing.four }}>
            {week.map((d, i) => (
              <View key={i} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
                <View
                  style={{
                    width: 26,
                    height: Math.max(6, (d.total / maxDay) * 84),
                    borderRadius: 8,
                    backgroundColor: d.today ? theme.accent : theme.line,
                  }}
                />
                <ThemedText type="caption" themeColor={d.today ? "accent" : "textSecondary"} style={{ marginTop: 8, fontWeight: d.today ? "700" : "500" }}>
                  {d.letter}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Recent transactions */}
      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <SectionHeader title="Recent activity" action="See all" onAction={() => go("/activity")} />
        <Card style={{ paddingVertical: Spacing.one }}>
          {transactions.slice(0, 5).map((t, i, arr) => (
            <TransactionRow key={t.id} tx={t} hidden={balanceHidden} last={i === arr.length - 1} onPress={() => go(`/transaction/${t.id}`)} />
          ))}
        </Card>
      </View>

      {/* Referral banner */}
      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.five }}>
        <TouchableOpacity
          onPress={() => go("/refer")}
          activeOpacity={0.9}
          style={{ backgroundColor: Colors.lime, borderRadius: Radius.lg, padding: Spacing.four - 4, flexDirection: "row", alignItems: "center", overflow: "hidden" }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText type="bold" style={{ color: Colors.palette.forest950 }}>Invite friends, earn ₦2,000</ThemedText>
            <ThemedText type="small" style={{ color: Colors.palette.forest800, marginTop: 4 }}>
              They get ₦2,000 too when they fund their wallet.
            </ThemedText>
          </View>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.palette.forest950, alignItems: "center", justifyContent: "center", marginLeft: Spacing.three }}>
            <Ionicons name="gift" size={22} color={Colors.lime} />
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
