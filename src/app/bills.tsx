import Button from "@/components/button";
import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, IconBadge } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { Category, IconName } from "@/data/categories";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney, groupDigits, parseAmount } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

type Bill = { key: string; label: string; icon: IconName; category: Category; providers: string[]; field: string; placeholder: string; quick: number[] };

const bills: Bill[] = [
  { key: "airtime", label: "Airtime", icon: "call", category: "airtime", providers: ["MTN", "Airtel", "Glo", "9mobile"], field: "Phone number", placeholder: "0803 000 0000", quick: [500, 1000, 2000, 5000] },
  { key: "data", label: "Data", icon: "cellular", category: "airtime", providers: ["MTN", "Airtel", "Glo", "9mobile"], field: "Phone number", placeholder: "0803 000 0000", quick: [1000, 2500, 5000, 10000] },
  { key: "power", label: "Electricity", icon: "flash", category: "bills", providers: ["IKEDC", "EKEDC", "AEDC", "PHED"], field: "Meter number", placeholder: "11-digit meter number", quick: [2000, 5000, 10000, 20000] },
  { key: "tv", label: "Cable TV", icon: "tv", category: "bills", providers: ["DStv", "GOtv", "Startimes"], field: "Smartcard number", placeholder: "10-digit smartcard", quick: [2500, 5000, 9000, 15000] },
];

export default function Bills() {
  const theme = useTheme();
  const { payBill, balance } = useWallet();
  const [bill, setBill] = useState(bills[0]);
  const [provider, setProvider] = useState(bills[0].providers[0]);
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const choose = (b: Bill) => {
    setBill(b);
    setProvider(b.providers[0]);
    setError(null);
  };

  const pay = async () => {
    if (target.replace(/\s/g, "").length < 10) return setError(`Enter a valid ${bill.field.toLowerCase()}.`);
    setError(null);
    setBusy(true);
    const res = await payBill({ category: bill.category, provider: `${provider} ${bill.label}`, target: `${bill.label} · ${target}`, amount: parseAmount(amount) });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    goWith("/transfer/success", { kind: "bill", txId: res.id });
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Pay bills" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ flexDirection: "row", gap: Spacing.two + 2 }}>
          {bills.map((b) => {
            const on = b.key === bill.key;
            return (
              <TouchableOpacity key={b.key} onPress={() => choose(b)} activeOpacity={0.85} style={{ flex: 1, alignItems: "center", paddingVertical: Spacing.three, borderRadius: Radius.lg, backgroundColor: on ? theme.accentSurface : theme.card, borderWidth: 1.5, borderColor: on ? theme.accent : theme.line }}>
                <IconBadge icon={b.icon} size={40} bg={on ? theme.accent : theme.cardAlt} color={on ? theme.ctaText : theme.accent} />
                <ThemedText type="caption" style={{ marginTop: 6, fontWeight: "700" }}>{b.label}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <Card style={{ marginTop: Spacing.four }}>
          <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>Provider</ThemedText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two }}>
            {bill.providers.map((p) => (
              <Chip key={p} label={p} selected={provider === p} onPress={() => setProvider(p)} />
            ))}
          </View>
          <Input label={bill.field} placeholder={bill.placeholder} number value={target} onChangeText={setTarget} />
          <Input label="Amount" prefix="₦" placeholder="0" number value={amount} onChangeText={(t) => setAmount(groupDigits(t))} error={error} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two }}>
            {bill.quick.map((q) => (
              <Chip key={q} label={`₦${q.toLocaleString()}`} selected={parseAmount(amount) === q} onPress={() => setAmount(groupDigits(String(q)))} />
            ))}
          </View>
        </Card>

        <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: Spacing.three, textAlign: "center" }}>
          Paying from wallet · {formatMoney(balance, { decimals: false })} available
        </ThemedText>
        <Button title="Pay now" onPress={pay} loading={busy} style={{ marginTop: Spacing.three }} />
      </View>
    </Container>
  );
}
