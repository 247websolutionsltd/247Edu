import Button from "@/components/button";
import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, DetailRow, HeroDecor } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { groupDigits, parseAmount } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Share, View } from "react-native";

const quick = [5000, 20000, 50000, 100000];

export default function AddMoney() {
  const theme = useTheme();
  const { method: initial = "bank" } = useLocalSearchParams<{ method?: string }>();
  const { owner } = useAuth();
  const { addMoney } = useWallet();
  const [method, setMethod] = useState(initial === "card" ? "card" : "bank");
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fund = async() => {
    if (card.replace(/\s/g, "").length < 16) return setError("Enter a valid 16-digit card number.");
    if (exp.length < 5 || cvv.length < 3) return setError("Check the expiry date and CVV.");

    const topUpAmount = parseAmount(amount);
    setError(null);
    setBusy(true);
    // Only the last 4 digits are kept. The balance is updated atomically inside addMoney().
    const res = await addMoney(topUpAmount, `Card ending ${card.replace(/\s/g, "").slice(-4)}`);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    goWith("/transfer/success", { kind: "topup", txId: res.id });
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Add money" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ flexDirection: "row", gap: Spacing.two, marginBottom: Spacing.three }}>
          <Chip label="Bank transfer" icon="business" selected={method === "bank"} onPress={() => setMethod("bank")} />
          <Chip label="Debit card" icon="card" selected={method === "card"} onPress={() => setMethod("card")} />
        </View>

        {method === "bank" ? (
          <>
            <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four - 2, overflow: "hidden" }}>
              <HeroDecor />
              <ThemedText type="label" style={{ color: Colors.heroMuted }}>Your {Brand.name} account</ThemedText>
              <ThemedText style={{ color: "#FFF", fontSize: 36, fontWeight: "800", letterSpacing: 2, marginTop: Spacing.two }}>{owner.accountNumber}</ThemedText>
              <ThemedText style={{ color: Colors.heroMuted, marginTop: 4 }}>{Brand.bankName} · {owner.name}</ThemedText>
            </View>
            <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.four, lineHeight: 22 }}>
              Transfer from any bank app to this account number. Your wallet is credited within seconds, 24/7, with no fees.
            </ThemedText>
            <Card style={{ marginTop: Spacing.three, paddingVertical: Spacing.one }}>
              <DetailRow label="Bank" value={Brand.bankName} />
              <DetailRow label="Account name" value={owner.name} />
              <DetailRow label="Account number" value={owner.accountNumber} last />
            </Card>
            <Button
              title="Share account details"
              iconLeft="share-outline"
              onPress={() => Share.share({ message: `${owner.name}\n${Brand.bankName}\n${owner.accountNumber}` })}
              style={{ marginTop: Spacing.four }}
            />
          </>
        ) : (
          <>
            <Card style={{ alignItems: "center", paddingVertical: Spacing.four }}>
              <ThemedText type="caption" themeColor="textSecondary">Amount to add</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.two }}>
                <ThemedText style={{ fontSize: 30, fontWeight: "800", color: theme.textSecondary }}>₦</ThemedText>
                <Input value={amount} onChangeText={(t) => setAmount(groupDigits(t))} placeholder="0" number style={{ fontSize: 36, fontWeight: "800", textAlign: "center", minWidth: 120 }} />
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: Spacing.two, marginTop: Spacing.two }}>
                {quick.map((q) => (
                  <Chip key={q} label={`₦${q.toLocaleString()}`} selected={parseAmount(amount) === q} onPress={() => setAmount(groupDigits(String(q)))} />
                ))}
              </View>
            </Card>
            <Input label="Card number" icon="card-outline" placeholder="0000 0000 0000 0000" number maxLength={19} value={card} onChangeText={(t) => setCard(t.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())} />
            <View style={{ flexDirection: "row", gap: Spacing.three }}>
              <View style={{ flex: 1 }}>
                <Input label="Expiry" placeholder="MM/YY" number maxLength={5} value={exp} onChangeText={(t) => { const d = t.replace(/\D/g, "").slice(0, 4); setExp(d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d); }} />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="CVV" placeholder="•••" number password maxLength={3} value={cvv} onChangeText={setCvv} />
              </View>
            </View>
            {error ? <ThemedText type="small" style={{ color: theme.danger, marginTop: Spacing.two }}>{error}</ThemedText> : null}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.two }}>
              <Ionicons name="lock-closed" size={13} color={theme.textSecondary} />
              <ThemedText type="caption" themeColor="textSecondary" style={{ marginLeft: 6 }}>Card details are encrypted</ThemedText>
            </View>
            <Button title="Add money" onPress={fund} loading={busy} style={{ marginTop: Spacing.four }} />
          </>
        )}
      </View>
    </Container>
  );
}
