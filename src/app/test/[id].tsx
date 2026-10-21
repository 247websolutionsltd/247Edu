import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, DetailRow, EmptyState, IconBadge } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { findTest } from "@/data/tests";
import { useTheme } from "@/hooks/use-theme";
import { closesLabel } from "@/lib/format";
import { goReplace } from "@/lib/nav";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const rules = [
  "You can attempt this test once only.",
  "The timer starts as soon as you tap Start and cannot be paused.",
  "You can move between questions and change answers before you submit.",
  "When time runs out, your answers are submitted automatically.",
];

export default function TestIntro() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { attempts } = usePortal();
  const test = findTest(id);

  if (!test) {
    return (
      <Container edges={["top", "bottom"]}>
        <Header title="Test" />
        <EmptyState icon="help-circle" title="Test not found" />
      </Container>
    );
  }

  const done = attempts[test.id];

  return (
    <Container edges={["top", "bottom"]}>
      <Header title={test.courseCode} />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <ThemedText type="label" style={{ color: theme.accent }}>
          {test.course}
        </ThemedText>
        <ThemedText type="title" style={{ marginTop: 4 }}>
          {test.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.two, lineHeight: 23 }}>
          {test.instructions}
        </ThemedText>

        <View style={{ flexDirection: "row", gap: Spacing.two + 2, marginTop: Spacing.four }}>
          {[
            { icon: "help-circle" as const, v: String(test.questions.length), k: "Questions" },
            { icon: "time" as const, v: `${test.durationMin}m`, k: "Duration" },
            { icon: "flag" as const, v: `${test.passMark}%`, k: "Pass mark" },
          ].map((s) => (
            <Card key={s.k} style={{ flex: 1, alignItems: "center", paddingHorizontal: Spacing.two }}>
              <IconBadge icon={s.icon} size={36} />
              <ThemedText type="subtitle" style={{ marginTop: Spacing.two }}>
                {s.v}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {s.k}
              </ThemedText>
            </Card>
          ))}
        </View>

        <Card style={{ marginTop: Spacing.three, paddingVertical: Spacing.two }}>
          <DetailRow label="Status" value={done ? "Completed" : "Open"} />
          <DetailRow label="Closes" value={closesLabel(test.closesInDays).replace("Closes ", "")} last />
        </Card>

        <ThemedText type="big" style={{ marginTop: Spacing.five, marginBottom: Spacing.three }}>
          Before you begin
        </ThemedText>
        <View style={{ gap: Spacing.three }}>
          {rules.map((r, i) => (
            <View key={r} style={{ flexDirection: "row" }}>
              <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: theme.accentSurface, alignItems: "center", justifyContent: "center", marginRight: Spacing.three }}>
                <ThemedText style={{ color: theme.accent, fontWeight: "900", fontSize: 13 }}>{i + 1}</ThemedText>
              </View>
              <ThemedText type="small" style={{ flex: 1, lineHeight: 21 }}>
                {r}
              </ThemedText>
            </View>
          ))}
        </View>

        {done ? (
          <Button title="View my result" icon="arrow-forward" onPress={() => goReplace(`/test/result/${test.id}`)} style={{ marginTop: Spacing.five }} />
        ) : (
          <Button title="Start test" icon="play" onPress={() => goReplace(`/test/take/${test.id}`)} style={{ marginTop: Spacing.five }} />
        )}
      </View>
    </Container>
  );
}
