import { Colors, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "./brand";
import { RoundButton } from "./header";
import { ThemedText } from "./themed-text";
import { HeroDecor } from "./ui";

/**
 * Shared frame for every sign-in style screen: a deep-green hero with the headline,
 * and a rounded "sheet" that slides up over it holding the form.
 */
export default function AuthShell({
  title,
  subtitle,
  onBack,
  hero,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hero?: boolean;
  children: ReactNode;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          <View
            style={{
              backgroundColor: Colors.hero,
              paddingTop: insets.top + Spacing.three,
              paddingHorizontal: Spacing.four,
              paddingBottom: hero ? 64 : 52,
            }}
          >
            <HeroDecor />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44 }}>
              {onBack ? <RoundButton icon="chevron-back" onHero onPress={onBack} label="Go back" /> : <Logo light />}
              {onBack ? <Logo size={30} showName={false} /> : null}
            </View>
            <ThemedText type={hero ? "display" : "title"} style={{ color: "#FFF", marginTop: hero ? Spacing.five : Spacing.four }}>
              {title}
            </ThemedText>
            {subtitle ? (
              <ThemedText style={{ color: Colors.heroMuted, marginTop: Spacing.two }}>{subtitle}</ThemedText>
            ) : null}
          </View>

          <View
            style={{
              flexGrow: 1,
              marginTop: -Radius.xl + 6,
              backgroundColor: theme.background,
              borderTopLeftRadius: Radius.xl,
              borderTopRightRadius: Radius.xl,
              paddingHorizontal: Spacing.four,
              paddingTop: Spacing.four,
              paddingBottom: insets.bottom + Spacing.four,
            }}
          >
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
