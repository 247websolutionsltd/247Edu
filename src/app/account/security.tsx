import Container from "@/components/custom-container";
import Header from "@/components/header";
import { Card, ListRow, Toggle } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { go } from "@/lib/nav";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function Security() {
  const [bio, setBio] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [twoFa, setTwoFa] = useState(false);

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Security" />
      <View style={{ paddingHorizontal: Spacing.three, gap: Spacing.three }}>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow icon="finger-print" title="Biometric sign-in" subtitle="Use fingerprint or Face ID" right={<Toggle value={bio} onValueChange={setBio} label="Biometric sign-in" />} />
          <ListRow icon="notifications-outline" title="Transaction alerts" subtitle="Get notified on every debit and credit" right={<Toggle value={alerts} onValueChange={setAlerts} label="Transaction alerts" />} />
          <ListRow icon="shield-checkmark-outline" title="Two-factor authentication" subtitle="Extra code when signing in" right={<Toggle value={twoFa} onValueChange={setTwoFa} label="Two-factor authentication" />} last />
        </Card>
        <Card style={{ paddingVertical: 0 }}>
          <ListRow icon="keypad-outline" title="Change transaction PIN" subtitle="Your 4-digit PIN" onPress={() => Alert.alert("Change PIN", "PIN changes are handled by your backend in the live app.")} />
          <ListRow icon="key-outline" title="Change password" onPress={() => go("/auth/forgot")} last />
        </Card>
      </View>
    </Container>
  );
}
