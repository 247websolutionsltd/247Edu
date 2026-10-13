import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/hooks/use-theme";
import { go } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { Alert, TouchableOpacity, View } from "react-native";

export default function Beneficiaries() {
  const theme = useTheme();
  const { beneficiaries, removeBeneficiary } = useWallet();

  const confirm = (id: string, name: string) =>
    Alert.alert("Remove beneficiary", `Remove ${name} from your saved recipients?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeBeneficiary(id) },
    ]);

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Beneficiaries" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        {beneficiaries.length === 0 && <ThemedText themeColor="textSecondary" style={{ textAlign: "center", marginVertical: Spacing.five }}>No saved recipients yet.</ThemedText>}
        <View style={{ gap: Spacing.two + 2 }}>
          {beneficiaries.map((b) => (
            <Card key={b.id} style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar name={b.name} />
              <View style={{ flex: 1, marginLeft: Spacing.three }}>
                <ThemedText type="smallBold">{b.name}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>{b.bank} · {b.account}</ThemedText>
              </View>
              <TouchableOpacity onPress={() => confirm(b.id, b.name)} hitSlop={10} accessibilityLabel={`Remove ${b.name}`}>
                <Ionicons name="trash-outline" size={20} color={theme.danger} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
        <Button title="Send to someone new" iconLeft="paper-plane" onPress={() => go("/transfer")} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
