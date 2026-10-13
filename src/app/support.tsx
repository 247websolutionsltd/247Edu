import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, ListRow } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";

const faqs = [
  { q: "How long do transfers take?", a: "Transfers to other Nigerian banks usually arrive within seconds. If a transfer is still pending after 30 minutes, contact us with the reference." },
  { q: "Are there fees?", a: `Sending to another ${Brand.name} account is free. Transfers to other banks cost ₦10.75. Adding money by bank transfer is free.` },
  { q: "How do locked savings work?", a: "Locked goals earn a higher rate, but you can't withdraw until the due date. Flexible goals can be withdrawn any time." },
  { q: "I think my card was compromised", a: "Freeze your card immediately from the Cards tab, then contact support so we can issue you a new one." },
];

export default function Support() {
  const theme = useTheme();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Help & support" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow icon="mail-outline" title="Email us" subtitle={Brand.supportEmail} onPress={() => Linking.openURL(`mailto:${Brand.supportEmail}`)} />
          <ListRow icon="call-outline" title="Call us" subtitle={Brand.supportPhone} onPress={() => Linking.openURL(`tel:${Brand.supportPhone.replace(/\s/g, "")}`)} last />
        </Card>

        <ThemedText type="big" style={{ marginTop: Spacing.five, marginBottom: Spacing.three }}>Common questions</ThemedText>
        <View style={{ gap: Spacing.two + 2 }}>
          {faqs.map((f, i) => (
            <Card key={f.q} onPress={() => setOpen(open === i ? null : i)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText type="smallBold" style={{ flex: 1 }}>{f.q}</ThemedText>
                <Ionicons name={open === i ? "chevron-up" : "chevron-down"} size={18} color={theme.textSecondary} />
              </View>
              {open === i && <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 21 }}>{f.a}</ThemedText>}
            </Card>
          ))}
        </View>
      </View>
    </Container>
  );
}
