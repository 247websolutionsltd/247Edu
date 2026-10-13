import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { View } from "react-native";

const sections = [
  { t: "Information we collect", b: "We collect the details you give us (name, phone, email, ID) and information about how you use the app, such as transactions and device data, so we can run your account safely." },
  { t: "How we use it", b: "To process payments, prevent fraud, meet regulatory requirements and improve your experience. We never sell your personal data." },
  { t: "How we protect it", b: "Your data is encrypted in transit and at rest. Access is restricted to staff who need it, and sensitive actions require your PIN or biometrics." },
  { t: "Your choices", b: `You can update your details in Profile at any time, or contact ${Brand.supportEmail} to request a copy of your data or close your account.` },
];

export default function Privacy() {
  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Privacy policy" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <ThemedText themeColor="textSecondary" style={{ lineHeight: 24 }}>
          At {Brand.name}, your money and your privacy come first. Here's a plain-English summary of how we handle your information.
        </ThemedText>
        {sections.map((s) => (
          <View key={s.t} style={{ marginTop: Spacing.four }}>
            <ThemedText type="big">{s.t}</ThemedText>
            <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 24 }}>{s.b}</ThemedText>
          </View>
        ))}
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: Spacing.five }}>
          Placeholder text. Replace with your legal team's policy before launch.
        </ThemedText>
      </View>
    </Container>
  );
}
