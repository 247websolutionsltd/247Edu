import { Logo } from "@/components/brand";
import Button from "@/components/button";
import OnboardingItem from "@/components/onboard";
import Paginator from "@/components/paginator";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { onboardingData } from "@/data/onboardData";
import { useTheme } from "@/hooks/use-theme";
import { goReplace } from "@/lib/nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";
import { FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const listRef = useRef<FlatList<any> | null>(null);
  const last = index === onboardingData.length - 1;

  const onViewable = useRef(({ viewableItems }: any) => {
    const next = viewableItems[0]?.index;
    if (typeof next === "number") setIndex(next);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const markSeen = async () => {
    try {
      await AsyncStorage.setItem("onboarded", "true");
    } catch (e) {
      console.error(e);
    }
  };

  const finish = async () => {
    setBusy(true);
    await markSeen();
    setBusy(false);
    goReplace("/auth/register");
  };

  const next = () => (last ? finish() : listRef.current?.scrollToIndex({ index: index + 1 }));

  const skip = async () => {
    await markSeen();
    goReplace("/auth/logIn");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: Spacing.four, paddingTop: Spacing.two }}>
        <Logo size={34} />
        <TouchableOpacity onPress={skip} hitSlop={12}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Skip
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={onboardingData}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={viewConfig}
      />

      <View style={{ paddingHorizontal: Spacing.four, paddingBottom: Spacing.three }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Paginator count={onboardingData.length} currentIndex={index} />
          <Button title={last ? "Get started" : "Next"} icon="arrow-forward" onPress={next} loading={busy} style={{ minWidth: 160 }} />
        </View>
        <TouchableOpacity onPress={skip} style={{ alignSelf: "center", marginTop: Spacing.three }} hitSlop={8}>
          <ThemedText type="small" themeColor="textSecondary">
            Already a student here? <ThemedText type="smallBold" style={{ color: theme.accent }}>Sign in</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
