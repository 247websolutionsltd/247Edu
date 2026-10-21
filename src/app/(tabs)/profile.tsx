import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Container from "@/components/custom-container";
import { ThemedText } from "@/components/themed-text";
import { Card, HeroPattern, ListRow, Toggle } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Colors, Radius, Spacing, TabBarSpace } from "@/constants/theme";
import { classOfDegree } from "@/data/academics";
import type { IconName } from "@/data/icons";
import { useAppTheme, useAuth } from "@/context/PageContext";
import { usePortal } from "@/context/PortalContext";
import { useTheme } from "@/hooks/use-theme";
import { fmtGpa } from "@/lib/format";
import { go, goReplace } from "@/lib/nav";
import { logoutUser } from "@/services/auth";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

type Item = { title: string; subtitle: string; icon: IconName; route: string };

const academic: Item[] = [
  { title: "Timetable", subtitle: "Your weekly class schedule", icon: "calendar-outline" as const, route: "/timetable" },
  { title: "Announcements", subtitle: "Notices from the school", icon: "megaphone-outline" as const, route: "/announcements" },
];
const account: Item[] = [
  { title: "Edit profile", subtitle: "Name, department and phone", icon: "person-outline" as const, route: "/account/edit-profile" },
  { title: "Password & security", subtitle: "Change your password", icon: "shield-checkmark-outline" as const, route: "/account/security" },
];
const more: Item[] = [
  { title: "Help desk", subtitle: "ICT, Registry and Bursary contacts", icon: "chatbubble-ellipses-outline" as const, route: "/support" },
  { title: "Privacy policy", subtitle: "How we protect your data", icon: "document-text-outline" as const, route: "/account/privacy-policy" },
];

export default function Profile() {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useAppTheme();
  const { owner } = useAuth();
  const { cgpa, alertsOn, setAlertsOn, attempts, bookmarks } = usePortal();
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

  const group = (items: Item[]) => (
    <Card style={{ paddingVertical: 0 }}>
      {items.map((s, i) => (
        <ListRow key={s.title} icon={s.icon} title={s.title} subtitle={s.subtitle} onPress={() => go(s.route)} last={i === items.length - 1} />
      ))}
    </Card>
  );

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ padding: Spacing.three }}>
        <ThemedText type="large">My profile</ThemedText>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four, overflow: "hidden" }}>
          <HeroPattern lines={9} />
          <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: Spacing.three }}>
            <Avatar name={owner.name} size={68} onHero square />
            <View style={{ flex: 1, marginLeft: Spacing.three }}>
              <ThemedText type="big" style={{ color: "#FFF" }} numberOfLines={1}>
                {owner.name || "Student"}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: Colors.gold, marginTop: 1 }}>
                {owner.studentId || "—"}
              </ThemedText>
              <ThemedText type="caption" style={{ color: Colors.heroMuted, marginTop: 2 }} numberOfLines={1}>
                {owner.email}
              </ThemedText>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: Spacing.four, backgroundColor: "rgba(255,255,255,0.14)", borderRadius: Radius.md, paddingVertical: Spacing.three, marginLeft: Spacing.three }}>
            {[
              { k: "Level", v: owner.level || "—" },
              { k: "CGPA", v: fmtGpa(cgpa) },
              { k: "Tests taken", v: String(Object.keys(attempts).length) },
              { k: "Saved", v: String(bookmarks.length) },
            ].map((s, i) => (
              <View key={s.k} style={{ flex: 1, alignItems: "center", borderLeftWidth: i ? 1 : 0, borderLeftColor: "rgba(255,255,255,0.25)" }}>
                <ThemedText type="bold" style={{ color: "#FFF" }}>
                  {s.v}
                </ThemedText>
                <ThemedText type="caption" style={{ color: Colors.heroMuted, fontSize: 10 }}>
                  {s.k}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: Spacing.two, textAlign: "center" }}>
          {owner.department || "Department"} · {classOfDegree(cgpa)} standing
        </ThemedText>

        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}>
          Academics
        </ThemedText>
        {group(academic)}

        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}>
          Account
        </ThemedText>
        {group(account)}

        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}>
          Preferences
        </ThemedText>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow icon="notifications-outline" title="Announcement alerts" subtitle="Get notified about new notices" right={<Toggle value={alertsOn} onValueChange={setAlertsOn} label="Announcement alerts" />} />
          <ListRow icon="moon-outline" title="Dark mode" subtitle="Easier on the eyes at night" right={<Toggle value={themeMode === "dark"} onValueChange={(v) => setThemeMode(v ? "dark" : "light")} label="Dark mode" />} last />
        </Card>

        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}>
          Support
        </ThemedText>
        {group(more)}

        <Card style={{ paddingVertical: 0, marginTop: Spacing.four }}>
          <ListRow icon="log-out-outline" title="Sign out" danger onPress={() => setLogoutVisible(true)} last />
        </Card>

        <ThemedText type="caption" themeColor="inkSoft" style={{ textAlign: "center", marginTop: Spacing.four }}>
          {Brand.fullName} · v1.0.0
        </ThemedText>
      </View>

      <Modal visible={logoutVisible} transparent animationType="fade" onRequestClose={() => !loggingOut && setLogoutVisible(false)}>
        <Pressable style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: "center", padding: Spacing.four }} onPress={() => !loggingOut && setLogoutVisible(false)}>
          <Pressable style={{ backgroundColor: theme.card, borderRadius: Radius.xl, padding: Spacing.four }} onPress={() => {}}>
            <ThemedText type="big">Sign out?</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 20 }}>
              You'll need your email and password to get back in. Your saved materials and test history stay on this device.
            </ThemedText>
            {logoutError ? (
              <ThemedText type="caption" style={{ color: theme.danger, marginTop: Spacing.two }}>
                {logoutError}
              </ThemedText>
            ) : null}
            <View style={{ flexDirection: "row", gap: Spacing.three, marginTop: Spacing.four }}>
              <Button title="Cancel" variant="secondary" onPress={() => setLogoutVisible(false)} disabled={loggingOut} style={{ flex: 1 }} />
              <Button title="Sign out" onPress={confirmLogout} loading={loggingOut} style={{ flex: 1 }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Container>
  );
}
