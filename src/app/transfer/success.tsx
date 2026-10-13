import Button from "@/components/button";
import Container from "@/components/custom-container";
import { ThemedText } from "@/components/themed-text";
import { Card, DetailRow } from "@/components/ui";
import { Colors, Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { formatMoney, fullDate } from "@/lib/format";
import { go, goReplace } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Share, View } from "react-native";

const copy: Record<string, { title: string; sub: (t: string) => string }> = {
  transfer: { title: "Money sent!", sub: (t) => `Your transfer to ${t} is on its way.` },
  topup: { title: "Wallet funded!", sub: () => "The money is in your wallet and ready to use." },
  goal: { title: "Nicely done!", sub: (t) => `${t} just got closer to its target.` },
  bill: { title: "Payment successful", sub: (t) => `Your ${t} payment went through.` },
};

export default function Success() {
  const { kind = "transfer", txId } = useLocalSearchParams<{ kind?: string; txId?: string }>();
  const { getTransaction } = useWallet();
  const tx = getTransaction(txId);
  const c = copy[kind] ?? copy.transfer;

  return (
    <Container edges={["top", "bottom"]} style={{ padding: Spacing.three, justifyContent: "center" }}>
      <View style={{ alignItems: "center", marginTop: Spacing.five }}>
        <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: Colors.palette.forest600, alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
          <View style={{ width: 108, height: 108, borderRadius: 54, backgroundColor: Colors.palette.forest500, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.lime, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="checkmark" size={40} color={Colors.palette.forest950} />
            </View>
          </View>
        </View>
        <ThemedText type="title" style={{ marginTop: Spacing.four }}>{c.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={{ textAlign: "center", marginTop: Spacing.two }}>{c.sub(tx?.title ?? "")}</ThemedText>
        {tx && <ThemedText type="display" style={{ marginTop: Spacing.four }}>{formatMoney(tx.amount)}</ThemedText>}
      </View>

      {tx && (
        <Card style={{ marginTop: Spacing.five, paddingVertical: Spacing.one }}>
          <DetailRow label="Date" value={fullDate(tx.ts)} />
          <DetailRow label="Reference" value={tx.reference} last />
        </Card>
      )}

      <View style={{ flex: 1, minHeight: Spacing.five }} />
      <Button title="Done" onPress={() => goReplace("/(tabs)/home")} />
      <View style={{ flexDirection: "row", gap: Spacing.three, marginTop: Spacing.three }}>
        <Button variant="secondary" small title="View receipt" style={{ flex: 1 }} onPress={() => tx && go(`/transaction/${tx.id}`)} />
        <Button variant="secondary" small title="Share" iconLeft="share-outline" style={{ flex: 1 }} onPress={() => tx && Share.share({ message: `${tx.title} · ${formatMoney(tx.amount)} · Ref ${tx.reference}` })} />
      </View>
    </Container>
  );
}
