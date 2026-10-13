import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ComponentProps, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

type IconName = ComponentProps<typeof Ionicons>["name"];

export function RoundButton({
  icon,
  onPress,
  label,
  onHero = false,
  dot = false,
}: {
  icon: IconName;
  onPress?: () => void;
  label?: string;
  onHero?: boolean;
  dot?: boolean;
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
        borderRadius: Radius.pill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: onHero ? "rgba(255,255,255,0.14)" : theme.card,
        borderWidth: onHero ? 0 : 1,
        borderColor: theme.line,
      }}
    >
      <Ionicons name={icon} size={20} color={onHero ? "#FFF" : theme.text} />
      {dot && (
        <View
          style={{
            position: "absolute",
            top: 11,
            right: 12,
            width: 9,
            height: 9,
            borderRadius: 5,
            backgroundColor: theme.danger,
            borderWidth: 1.5,
            borderColor: onHero ? "#17482F" : theme.card,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

/** Standard screen header: back button, centred title, optional right slot. */
export default function Header({
  title,
  right,
  back = true,
  onBack,
}: {
  title?: string;
  right?: ReactNode;
  back?: boolean;
  onBack?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        minHeight: 60,
      }}
    >
      <View style={{ width: 44 }}>
        {back && <RoundButton icon="chevron-back" label="Go back" onPress={onBack ?? (() => router.back())} />}
      </View>
      <ThemedText type="bold" numberOfLines={1} style={{ flex: 1, textAlign: "center" }}>
        {title}
      </ThemedText>
      <View style={{ width: 44, alignItems: "flex-end" }}>{right}</View>
    </View>
  );
}
