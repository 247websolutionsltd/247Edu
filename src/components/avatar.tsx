import { Colors } from "@/constants/theme";
import { initials } from "@/lib/format";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

export default function Avatar({ name, size = 46, onHero = false }: { name: string; size?: number; onHero?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: onHero ? Colors.heroChip : Colors.lime,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedText style={{ color: onHero ? "#FFF" : Colors.palette.forest950, fontWeight: "800", fontSize: size * 0.36 }}>
        {initials(name)}
      </ThemedText>
    </View>
  );
}
