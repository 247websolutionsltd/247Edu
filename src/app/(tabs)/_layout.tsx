import { Colors, Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { go } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_META: Record<string, { label: string; icon: IconName; iconActive: IconName }> = {
  home: { label: "Home", icon: "home-outline", iconActive: "home" },
  save: { label: "Save", icon: "leaf-outline", iconActive: "leaf" },
  cards: { label: "Cards", icon: "card-outline", iconActive: "card" },
  profile: { label: "Profile", icon: "person-outline", iconActive: "person" },
};

const ORDER = ["home", "save", "cards", "profile"];

function CustomTabBar({ state, navigation }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const routes = ORDER.map((name) => state.routes.find((r: any) => r.name === name)).filter(Boolean);
  const focusedName = state.routes[state.index]?.name;

  const renderTab = (route: any) => {
    const meta = TAB_META[route.name];
    const focused = focusedName === route.name;
    const color = focused ? theme.accent : theme.textSecondary;
    return (
      <Pressable
        key={route.key}
        onPress={() => navigation.navigate(route.name)}
        style={styles.tab}
        accessibilityRole="button"
        accessibilityLabel={meta.label}
        accessibilityState={{ selected: focused }}
      >
        <Ionicons name={focused ? meta.iconActive : meta.icon} size={22} color={color} />
        <Text style={[styles.label, { color, fontWeight: focused ? "700" : "500" }]}>{meta.label}</Text>
        <View style={[styles.dot, { backgroundColor: focused ? theme.accent : "transparent" }]} />
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.card,
            borderColor: theme.line,
            shadowColor: "#000",
          },
        ]}
      >
        {routes.slice(0, 2).map(renderTab)}
        <View style={styles.fabSlot}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => go("/transfer")}
            accessibilityRole="button"
            accessibilityLabel="Send money"
            style={[styles.fab, { borderColor: theme.background }]}
          >
            <Ionicons name="paper-plane" size={24} color={Colors.palette.forest950} style={{ marginLeft: -2, marginTop: 1 }} />
          </TouchableOpacity>
          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 2 }]}>Send</Text>
        </View>
        {routes.slice(2).map(renderTab)}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="save" options={{ title: "Save" }} />
      <Tabs.Screen name="cards" options={{ title: "Cards" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    borderRadius: Radius.xl,
    borderWidth: 1,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    ...(Platform.OS === "android" ? { elevation: 12 } : {}),
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 11 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  fabSlot: { width: 76, alignItems: "center", justifyContent: "flex-end", height: 70 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -34,
    borderWidth: 5,
    shadowColor: Colors.lime,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    ...(Platform.OS === "android" ? { elevation: 8 } : {}),
  },
});
