import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, IconBadge } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { IconName } from "@/data/categories";
import { go } from "@/lib/nav";
import { View } from "react-native";

const items: { icon: IconName; title: string; sub: string; tag?: string }[] = [
  { icon: "card", title: "Visa •••• 2458", sub: "Expires 08/28", tag: "Default" },
  { icon: "card", title: "Mastercard •••• 9031", sub: "Expires 02/27" },
  { icon: "business", title: "GTBank •••• 4410", sub: "Salary account" },
];

export default function LinkedAccounts() {
  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Linked accounts" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ gap: Spacing.two + 2 }}>
          {items.map((i) => (
            <Card key={i.title} style={{ flexDirection: "row", alignItems: "center" }}>
              <IconBadge icon={i.icon} />
              <View style={{ flex: 1, marginLeft: Spacing.three }}>
                <ThemedText type="smallBold">{i.title}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>{i.sub}</ThemedText>
              </View>
              {i.tag && <ThemedText type="caption" themeColor="accent" style={{ fontWeight: "700" }}>{i.tag}</ThemedText>}
            </Card>
          ))}
        </View>
        <Button title="Add a card" iconLeft="add" variant="secondary" onPress={() => go("/add-money/card")} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
