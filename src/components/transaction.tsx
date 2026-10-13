import { Spacing } from "@/constants/theme";
import { categoryMeta } from "@/data/categories";
import { Transaction } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney, timeLabel } from "@/lib/format";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { IconBadge } from "./ui";

export default function TransactionRow({
  tx,
  onPress,
  hidden = false,
  last = false,
}: {
  tx: Transaction;
  onPress?: () => void;
  hidden?: boolean;
  last?: boolean;
}) {
  const theme = useTheme();
  const meta = categoryMeta[tx.category];
  const credit = tx.kind === "credit";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.three - 2,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.line,
      }}
    >
      <IconBadge icon={meta.icon} size={44} round bg={meta.color + "26"} color={meta.color} />
      <View style={{ flex: 1, marginLeft: Spacing.three }}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {tx.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={{ marginTop: 2 }}>
          {tx.subtitle} · {timeLabel(tx.ts)}
        </ThemedText>
      </View>
      <ThemedText type="amount" style={{ color: credit ? theme.success : theme.text }}>
        {hidden ? "••••" : formatMoney(credit ? tx.amount : -tx.amount, { sign: credit, decimals: false })}
      </ThemedText>
    </TouchableOpacity>
  );
}
