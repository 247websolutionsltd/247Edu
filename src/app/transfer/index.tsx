import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney, groupDigits, parseAmount } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

const banks = ["Verdi MFB", "Access Bank", "GTBank", "Zenith Bank", "First Bank", "UBA", "Kuda", "Opay"];
const quick = [5000, 10000, 20000, 50000];

export default function Transfer() {
  const theme = useTheme();
  const { balance, beneficiaries } = useWallet();
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [save, setSave] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pick = (b: (typeof beneficiaries)[number]) => {
    setName(b.name);
    setBank(b.bank);
    setAccount(b.account);
  };

  const next = () => {
    const amt = parseAmount(amount);
    if (account.length !== 10) return setError("Account numbers are 10 digits.");
    if (!bank) return setError("Choose the recipient's bank.");
    if (!name.trim()) return setError("Enter the account name.");
    if (amt <= 0) return setError("Enter an amount to send.");
    if (amt > balance) return setError("That's more than your available balance.");
    setError(null);
    const isNew = !beneficiaries.some((b) => b.account === account && b.bank === bank);
    goWith("/transfer/review", { name: name.trim(), bank, account, amount: amt, note, save: save && isNew ? "1" : "0" });
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Send money" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        {beneficiaries.length > 0 && (
          <>
            <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>Recent recipients</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.three, paddingBottom: Spacing.three }}>
              {beneficiaries.map((b) => (
                <TouchableOpacity key={b.id} onPress={() => pick(b)} style={{ alignItems: "center", width: 68 }}>
                  <View style={{ borderWidth: 2, borderColor: account === b.account ? theme.accent : "transparent", borderRadius: 30, padding: 2 }}>
                    <Avatar name={b.name} size={52} />
                  </View>
                  <ThemedText type="caption" numberOfLines={1} style={{ marginTop: 6 }}>{b.name.split(" ")[0]}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <Card>
          <Input label="Account number" icon="keypad-outline" placeholder="10-digit account number" number maxLength={10} value={account} onChangeText={(t) => setAccount(t.replace(/\D/g, ""))} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two, marginBottom: Spacing.two }}>Bank</ThemedText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two }}>
            {banks.map((b) => (
              <Chip key={b} label={b} selected={bank === b} onPress={() => setBank(b)} />
            ))}
          </View>
          <Input label="Account name" icon="person-outline" placeholder="Recipient's name" value={name} onChangeText={setName} autoCapitalize="words" />
        </Card>

        <Card style={{ marginTop: Spacing.three, alignItems: "center", paddingVertical: Spacing.four }}>
          <ThemedText type="caption" themeColor="textSecondary">Amount</ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.two }}>
            <ThemedText style={{ fontSize: 34, fontWeight: "800", color: theme.textSecondary }}>₦</ThemedText>
            <TextInput
              value={amount}
              onChangeText={(t) => setAmount(groupDigits(t))}
              placeholder="0"
              placeholderTextColor={theme.inkSoft}
              keyboardType="decimal-pad"
              selectionColor={theme.accent}
              style={{ fontSize: 44, fontWeight: "800", color: theme.text, minWidth: 80, textAlign: "center", padding: 0 }}
            />
          </View>
          <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>Available: {formatMoney(balance)}</ThemedText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: Spacing.two, marginTop: Spacing.three }}>
            {quick.map((q) => (
              <Chip key={q} label={`₦${q.toLocaleString()}`} onPress={() => setAmount(groupDigits(String(q)))} selected={parseAmount(amount) === q} />
            ))}
          </View>
        </Card>

        <Input label="Note (optional)" icon="create-outline" placeholder="What's it for?" value={note} onChangeText={setNote} />

        <TouchableOpacity onPress={() => setSave(!save)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: Spacing.two }}>
          <View style={{ width: 22, height: 22, borderRadius: 7, backgroundColor: save ? theme.accent : "transparent", borderWidth: 1.5, borderColor: save ? theme.accent : theme.inkSoft, alignItems: "center", justifyContent: "center" }}>
            {save && <ThemedText style={{ color: theme.ctaText, fontSize: 13, fontWeight: "800", lineHeight: 16 }}>✓</ThemedText>}
          </View>
          <ThemedText type="small" style={{ marginLeft: Spacing.two + 2 }}>Save as beneficiary</ThemedText>
        </TouchableOpacity>

        {error ? <ThemedText type="small" style={{ color: theme.danger, marginTop: Spacing.two }}>{error}</ThemedText> : null}
        <Button title="Continue" icon="arrow-forward" onPress={next} style={{ marginTop: Spacing.three }} />
      </View>
    </Container>
  );
}
