import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ComponentProps, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** Square-ish icon button used in headers and mastheads. */
export function RoundButton({
  icon,
  onPress,
  label,
  onHero = false,
  dot = false,
  count,
}: {
  icon: IconName;
  onPress?: () => void;
  label?: string;
  onHero?: boolean;
  dot?: boolean;
  count?: number;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? icon}
      style={{
        width: 44,
        height: 44,
        borderRadius: Radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: onHero ? "rgba(255,255,255,0.16)" : theme.card,
        borderWidth: onHero ? 0 : 1,
        borderColor: theme.line,
      }}
    >
      <Ionicons name={icon} size={20} color={onHero ? "#FFF" : theme.text} />
      {typeof count === "number" && count > 0 ? (
        <View
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            minWidth: 19,
            height: 19,
            paddingHorizontal: 4,
            borderRadius: 10,
            backgroundColor: "#F2B632",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: onHero ? "#C8102E" : theme.background,
          }}
        >
          <ThemedText style={{ color: "#2A0409", fontSize: 10, lineHeight: 12, fontWeight: "900" }}>{count > 9 ? "9+" : count}</ThemedText>
        </View>
      ) : dot ? (
        <View style={{ position: "absolute", top: 10, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: "#F2B632" }} />
      ) : null}
    </TouchableOpacity>
  );
}

/** Standard screen header: back button, left-aligned serif title, optional right slot. */
export default function Header({ title, right, back = true, onBack }: { title?: string; right?: ReactNode; back?: boolean; onBack?: () => void }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        minHeight: 64,
        gap: Spacing.three,
      }}
    >
      {back && <RoundButton icon="arrow-back" label="Go back" onPress={onBack ?? (() => router.back())} />}
      <ThemedText type="big" numberOfLines={1} style={{ flex: 1 }}>
        {title}
      </ThemedText>
      {right ? <View style={{ alignItems: "flex-end" }}>{right}</View> : null}
    </View>
  );
}
