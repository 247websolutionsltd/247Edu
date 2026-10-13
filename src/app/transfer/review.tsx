import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import PinPad from "@/components/pin-pad";
import { ThemedText } from "@/components/themed-text";
import { Card, DetailRow } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { formatMoney } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Review() {
  const p = useLocalSearchParams<{ name: string; bank: string; account: string; amount: string; note?: string; save?: string }>();
  const { transfer } = useWallet();
  const amount = Number(p.amount ?? 0);
  const fee = p.bank === Brand.bankName ? 0 : 10.75;
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const change = (v: string) => {
    setPin(v);
    setError(null);
    if (v.length === 4) {
      // Demo build: any 4-digit PIN is accepted. Validate against your backend here.
      const res = transfer({ name: p.name!, bank: p.bank!, account: p.account!, amount, note: p.note, saveBeneficiary: p.save === "1" });
      if (res.ok) goWith("/transfer/success", { kind: "transfer", txId: res.id });
      else {
        setError(res.error);
        setPin("");
      }
    }
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title={pinOpen ? "Enter PIN" : "Review"} onBack={() => (pinOpen ? setPinOpen(false) : undefined)} />
      <View style={{ paddingHorizontal: Spacing.three }}>
        {!pinOpen ? (
          <>
            <View style={{ alignItems: "center", paddingVertical: Spacing.four }}>
              <ThemedText type="caption" themeColor="textSecondary">You're sending</ThemedText>
              <ThemedText type="display" style={{ marginTop: Spacing.two }}>{formatMoney(amount)}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>to {p.name}</ThemedText>
            </View>
            <Card style={{ paddingVertical: Spacing.one }}>
              <DetailRow label="Recipient" value={p.name ?? ""} />
              <DetailRow label="Bank" value={p.bank ?? ""} />
              <DetailRow label="Account" value={p.account ?? ""} />
              <DetailRow label="Fee" value={fee === 0 ? "Free" : formatMoney(fee)} />
              {p.note ? <DetailRow label="Note" value={p.note} /> : null}
              <DetailRow label="Total" value={formatMoney(amount + fee)} bold last />
            </Card>
            <Button title="Confirm & enter PIN" iconLeft="lock-closed" onPress={() => setPinOpen(true)} style={{ marginTop: Spacing.four }} />
          </>
        ) : (
          <View style={{ paddingTop: Spacing.three }}>
            <ThemedText style={{ textAlign: "center" }} themeColor="textSecondary">Enter your 4-digit PIN to send {formatMoney(amount)}</ThemedText>
            <PinPad value={pin} onChange={change} error={error} />
          </View>
        )}
      </View>
    </Container>
  );
}
