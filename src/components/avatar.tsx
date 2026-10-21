import { Colors } from "@/constants/theme";
import { initials } from "@/lib/format";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

export default function Avatar({ name, size = 46, onHero = false, square = false }: { name: string; size?: number; onHero?: boolean; square?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: square ? size * 0.26 : size / 2,
        backgroundColor: onHero ? "#FFFFFF" : Colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedText style={{ color: onHero ? Colors.primary : "#FFF", fontWeight: "800", fontSize: size * 0.36 }}>
        {initials(name) || "?"}
      </ThemedText>
    </View>
  );
}
