import { Colors, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "./themed-text";

type IconName = ComponentProps<typeof Ionicons>["name"];
type Variant = "primary" | "dark" | "secondary" | "soft" | "danger" | "light";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconLeft?: IconName;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({ title, onPress, variant = "primary", loading = false, disabled = false, icon, iconLeft, small = false, style }: Props) {
  const theme = useTheme();

  const palette = {
    primary: { bg: theme.cta, fg: theme.ctaText, border: "transparent" },
    dark: { bg: Colors.palette.ink, fg: "#FFFFFF", border: "transparent" },
    light: { bg: "#FFFFFF", fg: Colors.primary, border: "transparent" },
    soft: { bg: theme.accentSurface, fg: theme.accentText, border: theme.line },
    secondary: { bg: "transparent", fg: theme.text, border: theme.text },
    danger: { bg: "transparent", fg: theme.danger, border: theme.danger },
  }[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.base, small && styles.small, { backgroundColor: palette.bg, borderColor: palette.border, opacity: disabled ? 0.45 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {iconLeft && <Ionicons name={iconLeft} size={small ? 16 : 19} color={palette.fg} style={{ marginRight: Spacing.two }} />}
          <ThemedText style={{ color: palette.fg, fontSize: small ? 14 : 15, fontWeight: "800", letterSpacing: 0.3 }}>{title}</ThemedText>
          {icon && <Ionicons name={icon} size={small ? 16 : 19} color={palette.fg} style={{ marginLeft: Spacing.two }} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  small: { height: 40, paddingHorizontal: Spacing.three, borderRadius: Radius.sm },
  row: { flexDirection: "row", alignItems: "center" },
});
