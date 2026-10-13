import { Colors } from "@/constants/theme";
import { View } from "react-native";

export default function Paginator({ count, currentIndex }: { count: number; currentIndex: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 8,
            width: currentIndex === i ? 28 : 8,
            borderRadius: 4,
            marginRight: 6,
            backgroundColor: currentIndex === i ? Colors.lime : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </View>
  );
}
