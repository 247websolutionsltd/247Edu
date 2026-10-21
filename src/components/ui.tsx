import { Colors, Radius, Spacing } from "@/constants/theme";
import { IconName } from "@/data/icons";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "./themed-text";

/* ------------------------------ Card ------------------------------------ */
/** Flat, hairline-bordered card. `accent` adds the crimson "tab" down the left edge. */
export function Card({
  children,
  style,
  alt = false,
  accent,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  alt?: boolean;
  accent?: string | boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const stripe = accent === true ? theme.accent : typeof accent === "string" ? accent : undefined;
  const base: ViewStyle = {
    backgroundColor: alt ? theme.accentSurface : theme.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: theme.line,
    padding: Spacing.three,
    overflow: "hidden",
    ...(stripe ? { paddingLeft: Spacing.three + 6 } : {}),
  };
  const inner = (
    <>
      {stripe ? <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, backgroundColor: stripe }} /> : null}
      {children}
    </>
  );
  if (onPress)
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[base, style]}>
        {inner}
      </TouchableOpacity>
    );
  return <View style={[base, style]}>{inner}</View>;
}

/* --------------------------- Hero decoration ---------------------------- */
/**
 * The signature motif: an exercise-book page. Faint ruled lines, a margin rule down the left
 * and a large ring in the corner. Pure Views, no gradient/SVG dependency.
 */
export function HeroPattern({ lines = 14, margin = true }: { lines?: number; margin?: boolean }) {
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} style={{ position: "absolute", left: 0, right: 0, top: 34 + i * 30, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
      ))}
      {margin && <View style={{ position: "absolute", top: 0, bottom: 0, left: 34, width: 1.5, backgroundColor: "rgba(255,255,255,0.22)" }} />}
      <View style={{ position: "absolute", width: 230, height: 230, borderRadius: 115, right: -80, top: -90, borderWidth: 30, borderColor: "rgba(255,255,255,0.07)" }} />
      <View style={{ position: "absolute", width: 90, height: 90, borderRadius: 45, right: 40, bottom: -36, backgroundColor: "rgba(242,182,50,0.22)" }} />
    </View>
  );
}

/* ------------------------------ IconBadge ------------------------------- */
export function IconBadge({ icon, size = 46, color, bg, round = false }: { icon: IconName; size?: number; color?: string; bg?: string; round?: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : size * 0.28,
        backgroundColor: bg ?? theme.accentSurface,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={size * 0.48} color={color ?? theme.accent} />
    </View>
  );
}

/* -------------------------------- Chip ---------------------------------- */
export function Chip({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: IconName }) {
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
        borderRadius: Radius.sm,
        backgroundColor: selected ? theme.cta : theme.card,
        borderWidth: 1.5,
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

/* ----------------------------- Tag / pill ------------------------------- */
export function Tag({ label, color, bg, icon }: { label: string; color?: string; bg?: string; icon?: IconName }) {
  const theme = useTheme();
  const fg = color ?? theme.accentText;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: Radius.xs,
        backgroundColor: bg ?? theme.accentSurface,
      }}
    >
      {icon && <Ionicons name={icon} size={12} color={fg} style={{ marginRight: 4 }} />}
      <ThemedText style={{ color: fg, fontSize: 11, lineHeight: 14, fontWeight: "800", letterSpacing: 0.6 }}>{label.toUpperCase()}</ThemedText>
    </View>
  );
}

/* ---------------------------- ProgressBar ------------------------------- */
export function ProgressBar({ value, color, height = 8, track }: { value: number; color?: string; height?: number; track?: string }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track ?? theme.line, overflow: "hidden" }}>
      <View style={{ width: `${pct * 100}%`, height, borderRadius: height / 2, backgroundColor: color ?? theme.accent }} />
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
        borderRadius: 10,
        backgroundColor: value ? theme.accent : theme.controlOff,
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: value ? "flex-end" : "flex-start",
      }}
    >
      <View style={{ width: 22, height: 22, borderRadius: 7, backgroundColor: theme.controlThumb }} />
    </TouchableOpacity>
  );
}

/* --------------------------- SectionHeader ------------------------------ */
export function SectionHeader({ title, action, onAction, kicker }: { title: string; action?: string; onAction?: () => void; kicker?: string }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: Spacing.three }}>
      <View style={{ flex: 1 }}>
        {kicker ? (
          <ThemedText type="label" style={{ color: theme.accent, marginBottom: 2 }}>
            {kicker}
          </ThemedText>
        ) : null}
        <ThemedText type="big">{title}</ThemedText>
        <View style={{ width: 28, height: 3, borderRadius: 2, backgroundColor: Colors.gold, marginTop: 5 }} />
      </View>
      {action && (
        <TouchableOpacity onPress={onAction} hitSlop={10} style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {action}
          </ThemedText>
          <Ionicons name="arrow-forward" size={14} color={theme.accent} style={{ marginLeft: 3 }} />
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
      <IconBadge icon={icon} size={40} color={danger ? theme.danger : undefined} />
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

/* ------------------------------ DetailRow ------------------------------- */
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

/* ------------------------------ GradeBadge ------------------------------ */
export function gradeColors(letter: string) {
  switch (letter) {
    case "A":
      return { fg: "#0F7A4A", bg: "#DDF4E8" };
    case "B":
      return { fg: "#2F6FDE", bg: "#E4EEFF" };
    case "C":
      return { fg: "#9A6B00", bg: "#FFF1CC" };
    case "D":
      return { fg: "#C25A0A", bg: "#FFE6D0" };
    default:
      return { fg: "#C8102E", bg: "#FCE3E6" };
  }
}

export function GradeBadge({ letter, size = 44 }: { letter: string; size?: number }) {
  const c = gradeColors(letter);
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.26, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
      <ThemedText style={{ color: c.fg, fontSize: size * 0.5, lineHeight: size * 0.62, fontWeight: "900" }}>{letter}</ThemedText>
    </View>
  );
}

/* ------------------------------- StatTile ------------------------------- */
export function StatTile({ label, value, sub, icon, tone }: { label: string; value: string; sub?: string; icon?: IconName; tone?: string }) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.line, padding: Spacing.three - 2 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <ThemedText type="label" themeColor="textSecondary" style={{ fontSize: 10 }}>
          {label}
        </ThemedText>
        {icon && <Ionicons name={icon} size={15} color={tone ?? theme.accent} />}
      </View>
      <ThemedText type="large" style={{ marginTop: 6, color: tone ?? theme.text }}>
        {value}
      </ThemedText>
      {sub ? (
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 1 }}>
          {sub}
        </ThemedText>
      ) : null}
    </View>
  );
}

/* ------------------------------ EmptyState ------------------------------ */
export function EmptyState({ icon, title, text }: { icon: IconName; title: string; text?: string }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: Spacing.five, paddingHorizontal: Spacing.four }}>
      <IconBadge icon={icon} size={64} />
      <ThemedText type="big" style={{ marginTop: Spacing.three, textAlign: "center" }}>
        {title}
      </ThemedText>
      {text ? (
        <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.one, textAlign: "center", lineHeight: 20 }}>
          {text}
        </ThemedText>
      ) : null}
    </View>
  );
}
