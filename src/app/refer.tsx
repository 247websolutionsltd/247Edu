import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, HeroDecor, IconBadge } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { IconName } from "@/data/categories";
import { Share, View } from "react-native";

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "paper-plane", title: "Share your code", text: "Send your referral code to friends and family." },
  { icon: "person-add", title: "They sign up", text: `They open a ${Brand.name} account with your code.` },
  { icon: "cash", title: "You both earn ₦2,000", text: "Paid once they fund their wallet with ₦5,000 or more." },
];

export default function Refer() {
  const { owner } = useAuth();
  const share = () =>
    Share.share({ message: `Join me on ${Brand.name}: save, spend and send money in one app. Use my code ${owner.referralCode} and we both get ₦2,000.` });

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Refer & earn" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four, overflow: "hidden", alignItems: "center" }}>
          <HeroDecor />
          <IconBadge icon="gift" size={64} round bg={Colors.lime} color={Colors.palette.forest950} />
          <ThemedText type="title" style={{ color: "#FFF", marginTop: Spacing.three, textAlign: "center" }}>Earn ₦2,000 for every friend</ThemedText>
          <View style={{ marginTop: Spacing.four, borderWidth: 1.5, borderStyle: "dashed", borderColor: "rgba(255,255,255,0.4)", borderRadius: Radius.md, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three }}>
            <ThemedText type="caption" style={{ color: Colors.heroMuted, textAlign: "center" }}>YOUR CODE</ThemedText>
            <ThemedText style={{ color: Colors.lime, fontSize: 28, fontWeight: "800", letterSpacing: 4, textAlign: "center" }}>{owner.referralCode}</ThemedText>
          </View>
        </View>

        <Card style={{ marginTop: Spacing.four }}>
          {steps.map((s, i) => (
            <View key={s.title} style={{ flexDirection: "row", alignItems: "center", paddingVertical: Spacing.two + 2 }}>
              <IconBadge icon={s.icon} />
              <View style={{ flex: 1, marginLeft: Spacing.three }}>
                <ThemedText type="smallBold">{i + 1}. {s.title}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>{s.text}</ThemedText>
              </View>
            </View>
          ))}
        </Card>

        <Button title="Invite friends" iconLeft="share-social" onPress={share} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
