import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, ListRow } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, View } from "react-native";

const faqs = [
  { q: "When are my results published?", a: "Results appear here once the Registry has approved them, usually within two weeks after the last paper. Scores shown before that are unofficial." },
  { q: "I think a score is wrong", a: `Visit your department's exam officer within 7 days of publication with your student ID, or email ${Brand.supportEmail} with the course code and the score you expected.` },
  { q: "My test closed before I could finish", a: "Tests auto-submit when the timer ends, so any answered questions are marked. If you lost connection, contact your course lecturer to request a resit slot." },
  { q: "I can't sign in", a: "Use the email you registered with. If you've forgotten your password, tap 'Forgot password?' on the sign-in screen and we'll email you a reset link." },
];

export default function Support() {
  const theme = useTheme();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Help desk" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow icon="mail-outline" title="ICT help desk" subtitle={Brand.supportEmail} onPress={() => Linking.openURL(`mailto:${Brand.supportEmail}`)} />
          <ListRow icon="call-outline" title="Call the school office" subtitle={Brand.supportPhone} onPress={() => Linking.openURL(`tel:${Brand.supportPhone.replace(/\s/g, "")}`)} last />
        </Card>

        <ThemedText type="big" style={{ marginTop: Spacing.five, marginBottom: Spacing.three }}>
          Common questions
        </ThemedText>
        <View style={{ gap: Spacing.two + 2 }}>
          {faqs.map((f, i) => (
            <Card key={f.q} onPress={() => setOpen(open === i ? null : i)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText type="smallBold" style={{ flex: 1 }}>
                  {f.q}
                </ThemedText>
                <Ionicons name={open === i ? "chevron-up" : "chevron-down"} size={18} color={theme.textSecondary} />
              </View>
              {open === i && (
                <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 21 }}>
                  {f.a}
                </ThemedText>
              )}
            </Card>
          ))}
        </View>
      </View>
    </Container>
  );
}
