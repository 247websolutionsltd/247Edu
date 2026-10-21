import { Colors, Radius, Spacing } from "@/constants/theme";
import { Brand } from "@/constants/brand";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "./brand";
import { RoundButton } from "./header";
import { ThemedText } from "./themed-text";
import { HeroPattern } from "./ui";

/**
 * Shared frame for every sign-in style screen: a crimson "exercise book" masthead with the
 * crest and headline, and a floating form card that overlaps its lower edge.
 */
export default function AuthShell({
  title,
  subtitle,
  onBack,
  tall,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** taller masthead for the sign-in screen */
  tall?: boolean;
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
              paddingBottom: tall ? 92 : 78,
              borderBottomLeftRadius: Radius.xl,
              borderBottomRightRadius: Radius.xl,
              overflow: "hidden",
            }}
          >
            <HeroPattern lines={tall ? 12 : 10} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44, paddingLeft: Spacing.three }}>
              {onBack ? <RoundButton icon="arrow-back" onHero onPress={onBack} label="Go back" /> : <Logo light />}
              {onBack ? <Logo size={32} showName={false} light /> : null}
            </View>
            <View style={{ paddingLeft: Spacing.three }}>
              <ThemedText type="display" style={{ color: "#FFF", marginTop: tall ? Spacing.five : Spacing.four, fontSize: tall ? 40 : 32, lineHeight: tall ? 46 : 38 }}>
                {title}
              </ThemedText>
              {subtitle ? <ThemedText style={{ color: Colors.heroMuted, marginTop: Spacing.two, lineHeight: 22 }}>{subtitle}</ThemedText> : null}
            </View>
          </View>

          <View
            style={{
              marginTop: -56,
              marginHorizontal: Spacing.three,
              backgroundColor: theme.card,
              borderRadius: Radius.lg,
              borderWidth: 1,
              borderColor: theme.line,
              padding: Spacing.four,
              shadowColor: "#2A0409",
              shadowOpacity: 0.12,
              shadowRadius: 22,
              shadowOffset: { width: 0, height: 10 },
              ...(Platform.OS === "android" ? { elevation: 6 } : {}),
            }}
          >
            {children}
          </View>

          <View style={{ flex: 1, minHeight: Spacing.four }} />
          <ThemedText type="caption" themeColor="inkSoft" style={{ textAlign: "center", paddingBottom: insets.bottom + Spacing.three, paddingTop: Spacing.three }}>
            {Brand.school} · Need help? {Brand.supportEmail}
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
