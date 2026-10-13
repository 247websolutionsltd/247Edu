import { Colors, Radius, Spacing } from "@/constants/theme";
import { Slide } from "@/data/onboardData";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, View } from "react-native";
import { Logo } from "./brand";
import { ThemedText } from "./themed-text";

const { width } = Dimensions.get("window");
const F = Colors.palette;

const glass = {
  backgroundColor: F.forest700,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
} as const;

function Illustration({ kind }: { kind: Slide["kind"] }) {
  return (
    <View style={{ height: 300, alignItems: "center", justifyContent: "center" }}>
      {/* glow */}
      <View style={{ position: "absolute", width: 290, height: 290, borderRadius: 145, backgroundColor: F.forest600, opacity: 0.55 }} />
      <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: F.forest500, opacity: 0.4 }} />

      {kind === "save" && (
        <>
          <View style={[glass, { width: 270, borderRadius: Radius.lg, padding: Spacing.three + 2 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.lime, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="airplane" size={20} color={F.forest950} />
              </View>
              <View style={{ marginLeft: Spacing.three }}>
                <ThemedText type="smallBold" style={{ color: "#FFF" }}>Dream Vacation</ThemedText>
                <ThemedText type="caption" style={{ color: Colors.heroMuted }}>Due Dec 2026</ThemedText>
              </View>
            </View>
            <ThemedText type="title" style={{ color: "#FFF", marginTop: Spacing.three, fontSize: 28 }}>₦306,000</ThemedText>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.14)", marginTop: Spacing.two }}>
              <View style={{ width: "68%", height: 8, borderRadius: 4, backgroundColor: Colors.lime }} />
            </View>
            <ThemedText type="caption" style={{ color: Colors.heroMuted, marginTop: Spacing.two }}>68% of ₦450,000</ThemedText>
          </View>
          <View style={{ position: "absolute", right: 22, bottom: 26, backgroundColor: Colors.lime, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, transform: [{ rotate: "-6deg" }] }}>
            <ThemedText type="smallBold" style={{ color: F.forest950 }}>+14% p.a.</ThemedText>
          </View>
        </>
      )}

      {kind === "spend" && (
        <>
          <View style={{ position: "absolute", width: 250, height: 156, borderRadius: 22, backgroundColor: F.forest800, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", transform: [{ rotate: "-9deg" }, { translateY: -22 }] }} />
          <View style={{ width: 260, height: 164, borderRadius: 24, backgroundColor: Colors.lime, padding: Spacing.three + 2, justifyContent: "space-between", transform: [{ rotate: "4deg" }] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Logo size={26} />
              <Ionicons name="wifi" size={20} color={F.forest950} style={{ transform: [{ rotate: "90deg" }] }} />
            </View>
            <View>
              <ThemedText style={{ color: F.forest950, fontWeight: "700", fontSize: 18, letterSpacing: 2 }}>••••  ••••  ••••  4821</ThemedText>
              <ThemedText type="caption" style={{ color: F.forest800, marginTop: 4 }}>KEN NWAEZE</ThemedText>
            </View>
          </View>
          <View style={[glass, { position: "absolute", left: 14, bottom: 22, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 }]}>
            <Ionicons name="lock-closed" size={13} color={Colors.lime} />
            <ThemedText type="caption" style={{ color: "#FFF", marginLeft: 6 }}>Freeze anytime</ThemedText>
          </View>
        </>
      )}

      {kind === "send" && (
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.lime, alignItems: "center", justifyContent: "center" }}>
              <ThemedText style={{ color: F.forest950, fontWeight: "800", fontSize: 26 }}>KN</ThemedText>
            </View>
            <View style={{ width: width * 0.2, alignItems: "center" }}>
              <View style={{ height: 0, width: "100%", borderTopWidth: 2, borderStyle: "dashed", borderColor: "rgba(255,255,255,0.4)" }} />
              <View style={{ position: "absolute", width: 34, height: 34, borderRadius: 17, backgroundColor: F.forest600, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
                <Ionicons name="arrow-forward" size={17} color="#FFF" />
              </View>
            </View>
            <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
              <ThemedText style={{ color: F.forest800, fontWeight: "800", fontSize: 26 }}>AO</ThemedText>
            </View>
          </View>
          <View style={[glass, { marginTop: 34, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999 }]}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.lime} />
            <ThemedText type="smallBold" style={{ color: "#FFF", marginLeft: 8 }}>₦25,000 sent · just now</ThemedText>
          </View>
        </>
      )}
    </View>
  );
}

export default function OnboardingItem({ item }: { item: Slide }) {
  return (
    <View style={{ width, paddingHorizontal: Spacing.four, paddingTop: Spacing.six }}>
      <Illustration kind={item.kind} />
      <View style={{ marginTop: Spacing.four }}>
        <ThemedText type="label" style={{ color: Colors.lime }}>{item.eyebrow}</ThemedText>
        <ThemedText type="title" style={{ color: "#FFF", marginTop: Spacing.two }}>{item.title}</ThemedText>
        <ThemedText style={{ color: Colors.heroMuted, marginTop: Spacing.three, lineHeight: 24 }}>{item.description}</ThemedText>
      </View>
    </View>
  );
}
