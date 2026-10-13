import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export default function PinPad({ value, onChange, length = 4, error }: { value: string; onChange: (v: string) => void; length?: number; error?: string | null }) {
  const theme = useTheme();
  const press = (k: string) => {
    if (k === "del") return onChange(value.slice(0, -1));
    if (k && value.length < length) onChange(value + k);
  };
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: Spacing.three, marginVertical: Spacing.three }}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: i < value.length ? theme.accent : "transparent", borderWidth: 2, borderColor: i < value.length ? theme.accent : theme.inkSoft }} />
        ))}
      </View>
      {error ? <ThemedText type="caption" style={{ color: theme.danger, textAlign: "center", marginBottom: Spacing.two }}>{error}</ThemedText> : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {KEYS.map((k, i) => (
          <View key={i} style={{ width: "33.33%", alignItems: "center", paddingVertical: 6 }}>
            {k !== "" && (
              <TouchableOpacity
                onPress={() => press(k)}
                accessibilityLabel={k === "del" ? "Delete" : k}
                style={{ width: 72, height: 58, borderRadius: Radius.lg, alignItems: "center", justifyContent: "center", backgroundColor: k === "del" ? "transparent" : theme.card }}
              >
                {k === "del" ? <Ionicons name="backspace-outline" size={24} color={theme.text} /> : <ThemedText type="subtitle">{k}</ThemedText>}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
