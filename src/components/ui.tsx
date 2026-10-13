import { Colors, Radius, Spacing } from "@/constants/theme";
import { IconName } from "@/data/categories";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "./themed-text";

/* ------------------------------ Card ------------------------------------ */
export function Card({
  children,
  style,
  alt = false,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  alt?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const base: ViewStyle = {
    backgroundColor: alt ? theme.accentSurface : theme.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: theme.line,
    padding: Spacing.three,
  };
  if (onPress)
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[base, style]}>
        {children}
      </TouchableOpacity>
    );
  return <View style={[base, style]}>{children}</View>;
}

/* --------------------------- Hero decoration ---------------------------- */
/** Soft overlapping circles that give green hero surfaces depth (no gradient dependency). */
export function HeroDecor() {
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      <View style={{ position: "absolute", width: 260, height: 260, borderRadius: 130, right: -90, top: -110, backgroundColor: Colors.heroGlow, opacity: 0.55 }} />
      <View style={{ position: "absolute", width: 170, height: 170, borderRadius: 85, right: 30, top: -80, backgroundColor: Colors.heroGlow, opacity: 0.35 }} />
      <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, left: -90, bottom: -120, backgroundColor: Colors.heroDeep, opacity: 0.8 }} />
    </View>
  );
}

/* ------------------------------ IconBadge ------------------------------- */
export function IconBadge({
  icon,
  size = 46,
  color,
  bg,
  round = false,
}: {
  icon: IconName;
  size?: number;
  color?: string;
  bg?: string;
  round?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : size * 0.32,
        backgroundColor: bg ?? theme.accentSurface,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={size * 0.46} color={color ?? theme.accent} />
    </View>
  );
}

/* -------------------------------- Chip ---------------------------------- */
export function Chip({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.three,
        height: 38,
        borderRadius: Radius.pill,
        backgroundColor: selected ? theme.cta : theme.card,
        borderWidth: 1,
        borderColor: selected ? theme.cta : theme.line,
      }}
    >
      {icon && <Ionicons name={icon} size={15} color={selected ? theme.ctaText : theme.textSecondary} style={{ marginRight: 6 }} />}
      <ThemedText type="smallBold" style={{ color: selected ? theme.ctaText : theme.text }}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

/* ---------------------------- ProgressBar ------------------------------- */
export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ height, borderRadius: height, backgroundColor: theme.line, overflow: "hidden" }}>
      <View style={{ width: `${pct * 100}%`, height, borderRadius: height, backgroundColor: color ?? theme.accent }} />
    </View>
  );
}

/* ------------------------------- Toggle --------------------------------- */
export function Toggle({ value, onValueChange, label }: { value: boolean; onValueChange: (v: boolean) => void; label?: string }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.9}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      style={{
        width: 52,
        height: 30,
        borderRadius: 15,
        backgroundColor: value ? theme.accent : theme.controlOff,
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: value ? "flex-end" : "flex-start",
      }}
    >
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: value ? theme.ctaText : theme.controlThumb }} />
    </TouchableOpacity>
  );
}

/* --------------------------- SectionHeader ------------------------------ */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: Spacing.three }}>
      <ThemedText type="big">{title}</ThemedText>
      {action && (
        <TouchableOpacity onPress={onAction} hitSlop={10}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {action}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ------------------------------- ListRow -------------------------------- */
export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
  last = false,
  danger = false,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
  last?: boolean;
  danger?: boolean;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.three,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.line,
      }}
    >
      <IconBadge icon={icon} size={42} color={danger ? theme.danger : undefined} />
      <View style={{ flex: 1, marginLeft: Spacing.three }}>
        <ThemedText type="smallBold" style={danger ? { color: theme.danger } : undefined}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={theme.inkSoft} /> : null)}
    </TouchableOpacity>
  );
}

/* --------------------------------- Row ---------------------------------- */
export function DetailRow({ label, value, last = false, bold = false }: { label: string; value: string; last?: boolean; bold?: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: Spacing.three - 4,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.line,
        gap: Spacing.three,
      }}
    >
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type={bold ? "bold" : "smallBold"} style={{ flexShrink: 1, textAlign: "right" }}>
        {value}
      </ThemedText>
    </View>
  );
}
