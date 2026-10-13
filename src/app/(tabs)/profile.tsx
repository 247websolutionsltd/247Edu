import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Container from "@/components/custom-container";
import { ThemedText } from "@/components/themed-text";
import { Card, ListRow, Toggle } from "@/components/ui";
import { Colors, Radius, Spacing, TabBarSpace } from "@/constants/theme";
import { useAppTheme, useAuth } from "@/context/PageContext";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { compactMoney } from "@/lib/format";
import { go, goReplace } from "@/lib/nav";
import { logoutUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

const settings = [
  { title: "Edit profile", subtitle: "Name, email and phone", icon: "person-outline" as const, route: "/account/edit-profile" },
  { title: "Beneficiaries", subtitle: "People you send money to", icon: "people-outline" as const, route: "/account/beneficiaries" },
  { title: "Linked accounts", subtitle: "Cards and bank accounts", icon: "card-outline" as const, route: "/account/linked-accounts" },
  { title: "Security", subtitle: "PIN, biometrics and alerts", icon: "shield-checkmark-outline" as const, route: "/account/security" },
];
const more = [
  { title: "Refer & earn", subtitle: "Get ₦2,000 per friend", icon: "gift-outline" as const, route: "/refer" },
  { title: "Help & support", subtitle: "We're here 24/7", icon: "chatbubble-ellipses-outline" as const, route: "/support" },
  { title: "Privacy policy", subtitle: "How we protect your data", icon: "document-text-outline" as const, route: "/account/privacy-policy" },
];

export default function Profile() {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useAppTheme();
  const { owner } = useAuth();
  const { savingsTotal, transactions } = useWallet();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const confirmLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await logoutUser();
      setLogoutVisible(false);
      goReplace("/");
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ padding: Spacing.three }}>
        <ThemedText type="large">Profile</ThemedText>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four - 2, overflow: "hidden" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar name={owner.name} size={68} />
            <View style={{ flex: 1, marginLeft: Spacing.three }}>
              <ThemedText type="big" style={{ color: "#FFF" }}>{owner.name}</ThemedText>
              <ThemedText type="small" style={{ color: Colors.heroMuted, marginTop: 2 }}>{owner.email}</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.two, alignSelf: "flex-start", backgroundColor: Colors.heroChip, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.lime} />
                <ThemedText type="caption" style={{ color: "#FFF", marginLeft: 5, fontWeight: "600" }}>{owner.tier}</ThemedText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: Spacing.two, marginTop: Spacing.four }}>
            {[
              { label: "Transactions", value: String(transactions.length) },
              { label: "Saved", value: compactMoney(savingsTotal) },
              { label: "Referrals", value: "3" },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(4,18,12,0.28)", borderRadius: Radius.md, paddingVertical: Spacing.three - 2, alignItems: "center" }}>
                <ThemedText type="bold" style={{ color: "#FFF" }}>{s.value}</ThemedText>
                <ThemedText type="caption" style={{ color: Colors.heroMuted, marginTop: 2 }}>{s.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.four, gap: Spacing.three }}>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow
            icon={themeMode === "dark" ? "moon-outline" : "sunny-outline"}
            title="Dark mode"
            subtitle={themeMode === "dark" ? "On" : "Off"}
            last
            right={<Toggle value={themeMode === "dark"} onValueChange={(v) => setThemeMode(v ? "dark" : "light")} label="Dark mode" />}
          />
        </Card>

        <Card style={{ paddingVertical: 0 }}>
          {settings.map((s, i) => (
            <ListRow key={s.title} icon={s.icon} title={s.title} subtitle={s.subtitle} onPress={() => go(s.route)} last={i === settings.length - 1} />
          ))}
        </Card>

        <Card style={{ paddingVertical: 0 }}>
          {more.map((s, i) => (
            <ListRow key={s.title} icon={s.icon} title={s.title} subtitle={s.subtitle} onPress={() => go(s.route)} last={i === more.length - 1} />
          ))}
        </Card>

        <Button
          title="Sign out"
          variant="danger"
          iconLeft="log-out-outline"
          onPress={() => {
            setLogoutError(null);
            setLogoutVisible(true);
          }}
        />
      </View>

      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !loggingOut && setLogoutVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", padding: Spacing.four }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close sign-out dialog"
            onPress={() => !loggingOut && setLogoutVisible(false)}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: theme.overlay }}
          />
          <View style={{ backgroundColor: theme.card, borderRadius: Radius.lg, padding: Spacing.four }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.two }}>
              <Ionicons name="log-out-outline" size={22} color={theme.danger} />
              <ThemedText type="large">Sign out?</ThemedText>
            </View>
            <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
              You will need to sign in again to access your account.
            </ThemedText>
            {logoutError && (
              <ThemedText style={{ color: theme.danger, marginTop: Spacing.two }}>
                {logoutError}
              </ThemedText>
            )}
            <View style={{ flexDirection: "row", gap: Spacing.two, marginTop: Spacing.four }}>
              <Button
                title="Cancel"
                variant="secondary"
                disabled={loggingOut}
                onPress={() => setLogoutVisible(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Sign out"
                variant="danger"
                loading={loggingOut}
                onPress={confirmLogout}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
