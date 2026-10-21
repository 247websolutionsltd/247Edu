import { Brand } from "@/constants/brand";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

/** Cardinal crest: a red tile with a mortarboard and a gold star. Inverts on red backgrounds. */
export function Crest({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: inverted ? "#FFFFFF" : Colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="school" size={size * 0.56} color={inverted ? Colors.primary : "#FFFFFF"} />
      <View
        style={{
          position: "absolute",
          top: -size * 0.12,
          right: -size * 0.12,
          width: size * 0.38,
          height: size * 0.38,
          borderRadius: size * 0.19,
          backgroundColor: Colors.gold,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: inverted ? Colors.primary : "#FFFFFF",
        }}
      >
        <Ionicons name="star" size={size * 0.2} color={Colors.palette.red900} />
      </View>
    </View>
  );
}

export function Logo({ size = 40, showName = true, light = false }: { size?: number; showName?: boolean; light?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Crest size={size} inverted={light} />
      {showName && (
        <View style={{ marginLeft: size * 0.32 }}>
          <ThemedText
            style={{
              fontFamily: Fonts.serif,
              fontSize: size * 0.56,
              lineHeight: size * 0.64,
              fontWeight: "800",
              letterSpacing: -0.3,
              color: light ? "#FFFFFF" : undefined,
            }}
          >
            {Brand.name}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Math.max(9, size * 0.22),
              lineHeight: Math.max(11, size * 0.28),
              fontWeight: "800",
              letterSpacing: 2,
              color: light ? "rgba(255,255,255,0.75)" : "#A39598",
            }}
          >
            STUDENT PORTAL
          </ThemedText>
        </View>
      )}
    </View>
  );
}
