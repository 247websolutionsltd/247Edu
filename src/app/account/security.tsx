import Container from "@/components/custom-container";
import Header from "@/components/header";
import { Card, ListRow } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { authErrorMessage, resetPassword } from "@/services/auth";
import { Alert, View } from "react-native";

export default function Security() {
  const { owner } = useAuth();

  const changePassword = () => {
    if (!owner.email) return;
    Alert.alert("Change password", `We'll email a secure reset link to ${owner.email}.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send link",
        onPress: async () => {
          try {
            await resetPassword(owner.email);
            Alert.alert("Check your inbox", "The reset link is on its way.");
          } catch (e) {
            Alert.alert("Couldn't send link", authErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Password & security" />
      <View style={{ paddingHorizontal: Spacing.three, gap: Spacing.three }}>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow icon="key-outline" title="Change password" subtitle="Get a reset link by email" onPress={changePassword} />
          <ListRow icon="mail-outline" title="Sign-in email" subtitle={owner.email || "—"} last />
        </Card>
      </View>
    </Container>
  );
}
