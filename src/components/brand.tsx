import { Brand } from "@/constants/brand";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

export function Logo({ size = 40, showName = true, light = false }: { size?: number; showName?: boolean; light?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.34,
          backgroundColor: Colors.lime,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="leaf" size={size * 0.52} color={Colors.palette.forest950} />
      </View>
      {showName && (
        <ThemedText
          style={{
            marginLeft: size * 0.3,
            fontSize: size * 0.64,
            lineHeight: size * 0.8,
            fontWeight: "800",
            letterSpacing: -0.8,
            color: light ? "#FFFFFF" : undefined,
          }}
        >
          {Brand.name.toLowerCase()}
        </ThemedText>
      )}
    </View>
  );
}
