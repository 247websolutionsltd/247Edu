import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { View } from "react-native";

const sections = [
  { h: "What we collect", p: `${Brand.school} collects the details you give us at registration (name, student ID, department, level, email and phone) and the activity needed to run the portal, such as tests you take and materials you save.` },
  { h: "How we use it", p: "Your information is used to show your academic record, deliver tests and notices, and keep your account secure. It is never sold or used for advertising." },
  { h: "Who can see it", p: "Your results and test history are visible to you and to authorised staff in the Registry and your department. Classmates cannot see your scores." },
  { h: "Your choices", p: `You can update your contact details from Edit profile at any time. To correct academic records or request account deletion, contact ${Brand.supportEmail}.` },
];

export default function PrivacyPolicy() {
  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Privacy policy" />
      <View style={{ paddingHorizontal: Spacing.three, gap: Spacing.four }}>
        {sections.map((s) => (
          <View key={s.h}>
            <ThemedText type="big">{s.h}</ThemedText>
            <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.one + 2, lineHeight: 24 }}>
              {s.p}
            </ThemedText>
          </View>
        ))}
      </View>
    </Container>
  );
}
