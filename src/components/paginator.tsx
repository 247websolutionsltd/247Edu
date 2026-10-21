import { Colors } from "@/constants/theme";
import { View } from "react-native";

export default function Paginator({ count, currentIndex }: { count: number; currentIndex: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            width: currentIndex === i ? 30 : 12,
            borderRadius: 3,
            marginRight: 6,
            backgroundColor: currentIndex === i ? Colors.primary : "rgba(200,16,46,0.22)",
          }}
        />
      ))}
    </View>
  );
}
