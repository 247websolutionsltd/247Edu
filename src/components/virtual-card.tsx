import { Colors, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Logo } from "./brand";
import { ThemedText } from "./themed-text";

const F = Colors.palette;

export default function VirtualCard({
  name,
  revealed,
  frozen,
}: {
  name: string;
  revealed: boolean;
  frozen: boolean;
}) {
  const ink = frozen ? "#C8D3CC" : F.forest950;
  const number = revealed ? "5399  8341  2207  4821" : "••••  ••••  ••••  4821";
  return (
    <View
      style={{
        height: 210,
        borderRadius: 28,
        padding: Spacing.four - 2,
        backgroundColor: frozen ? "#5E7367" : Colors.lime,
        overflow: "hidden",
        justifyContent: "space-between",
      }}
    >
      {/* decorative rings */}
      <View style={{ position: "absolute", width: 240, height: 240, borderRadius: 120, borderWidth: 34, borderColor: "rgba(255,255,255,0.16)", right: -80, top: -100 }} />
      <View style={{ position: "absolute", width: 160, height: 160, borderRadius: 80, borderWidth: 26, borderColor: "rgba(4,18,12,0.06)", left: -60, bottom: -70 }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={28} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {frozen && (
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(4,18,12,0.35)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginRight: 10 }}>
              <Ionicons name="snow" size={13} color="#FFF" />
              <ThemedText type="caption" style={{ color: "#FFF", marginLeft: 4, fontWeight: "700" }}>Frozen</ThemedText>
            </View>
          )}
          <Ionicons name="wifi" size={22} color={ink} style={{ transform: [{ rotate: "90deg" }] }} />
        </View>
      </View>

      <View>
        <ThemedText style={{ color: ink, fontSize: 20, fontWeight: "700", letterSpacing: 1.5, fontVariant: ["tabular-nums"] }}>
          {number}
        </ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: Spacing.three }}>
          <View>
            <ThemedText type="caption" style={{ color: ink, opacity: 0.7 }}>CARD HOLDER</ThemedText>
            <ThemedText type="smallBold" style={{ color: ink }}>{name.toUpperCase()}</ThemedText>
          </View>
          <View>
            <ThemedText type="caption" style={{ color: ink, opacity: 0.7 }}>EXP · CVV</ThemedText>
            <ThemedText type="smallBold" style={{ color: ink }}>{revealed ? "09/29 · 314" : "••/•• · •••"}</ThemedText>
          </View>
          <ThemedText style={{ color: ink, fontWeight: "800", fontSize: 18 }}>NGN</ThemedText>
        </View>
      </View>
    </View>
  );
}
