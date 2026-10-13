import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, DetailRow, IconBadge } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { categoryMeta } from "@/data/categories";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney, fullDate } from "@/lib/format";
import { go } from "@/lib/nav";
import { useLocalSearchParams } from "expo-router";
import { Share, View } from "react-native";

export default function TransactionDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getTransaction } = useWallet();
  const tx = getTransaction(id);
  if (!tx) return null;
  const meta = categoryMeta[tx.category];
  const credit = tx.kind === "credit";
  const statusColor = tx.status === "success" ? theme.success : tx.status === "pending" ? theme.warning : theme.danger;

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Receipt" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ alignItems: "center", paddingVertical: Spacing.four }}>
          <IconBadge icon={meta.icon} size={68} round bg={meta.color + "26"} color={meta.color} />
          <ThemedText type="bold" style={{ marginTop: Spacing.three }}>{tx.title}</ThemedText>
          <ThemedText type="display" style={{ marginTop: Spacing.two, color: credit ? theme.success : theme.text }}>
            {formatMoney(tx.amount, { sign: credit })}
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.two, backgroundColor: statusColor + "22", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: statusColor, marginRight: 6 }} />
            <ThemedText type="caption" style={{ color: statusColor, fontWeight: "700", textTransform: "capitalize" }}>{tx.status}</ThemedText>
          </View>
        </View>

        <Card style={{ paddingVertical: Spacing.one }}>
          <DetailRow label="Type" value={credit ? "Money in" : "Money out"} />
          <DetailRow label="Category" value={meta.label} />
          <DetailRow label="Details" value={tx.subtitle} />
          <DetailRow label="Date" value={fullDate(tx.ts)} />
          {tx.note ? <DetailRow label="Note" value={tx.note} /> : null}
          {tx.fee > 0 ? <DetailRow label="Fee" value={formatMoney(tx.fee)} /> : null}
          <DetailRow label="Reference" value={tx.reference} last />
        </Card>

        <Button title="Share receipt" iconLeft="share-outline" style={{ marginTop: Spacing.four }} onPress={() => Share.share({ message: `${tx.title}\n${formatMoney(tx.amount)}\n${fullDate(tx.ts)}\nRef: ${tx.reference}` })} />
        <Button title="Report a problem" variant="secondary" style={{ marginTop: Spacing.three }} onPress={() => go("/support")} />
      </View>
    </Container>
  );
}
