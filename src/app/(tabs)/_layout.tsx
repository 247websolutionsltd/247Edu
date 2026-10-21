import { Colors, Spacing, TabBarHeight } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_META: Record<string, { label: string; icon: IconName; iconActive: IconName }> = {
  home: { label: "Home", icon: "grid-outline", iconActive: "grid" },
  results: { label: "Results", icon: "ribbon-outline", iconActive: "ribbon" },
  tests: { label: "Tests", icon: "create-outline", iconActive: "create" },
  library: { label: "Library", icon: "library-outline", iconActive: "library" },
  profile: { label: "Me", icon: "person-outline", iconActive: "person" },
};

const ORDER = ["home", "results", "tests", "library", "profile"];

/** Docked bar: hairline on top, a crimson tab marker over the active item. */
function CustomTabBar({ state, navigation }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { pendingTests } = usePortal();

  const routes = ORDER.map((name) => state.routes.find((r: any) => r.name === name)).filter(Boolean);
  const focusedName = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.line,
          paddingBottom: Math.max(insets.bottom, 8),
          height: TabBarHeight + Math.max(insets.bottom, 8),
        },
      ]}
    >
      {routes.map((route: any) => {
        const meta = TAB_META[route.name];
        const focused = focusedName === route.name;
        const color = focused ? theme.accent : theme.textSecondary;
        const badge = route.name === "tests" ? pendingTests : 0;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={meta.label}
            accessibilityState={{ selected: focused }}
          >
            <View style={[styles.marker, { backgroundColor: focused ? Colors.primary : "transparent" }]} />
            <View>
              <Ionicons name={focused ? meta.iconActive : meta.icon} size={23} color={color} />
              {badge > 0 && (
                <View style={[styles.badge, { borderColor: theme.card }]}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color, fontWeight: focused ? "800" : "600" }]}>{meta.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="results" options={{ title: "Results" }} />
      <Tabs.Screen name="tests" options={{ title: "Tests" }} />
      <Tabs.Screen name="library" options={{ title: "Library" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: 1, paddingHorizontal: Spacing.two },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  marker: { position: "absolute", top: 0, width: 28, height: 3.5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  label: { fontSize: 11, letterSpacing: 0.2 },
  badge: {
    position: "absolute",
    top: -5,
    right: -9,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "900", lineHeight: 12 },
});
