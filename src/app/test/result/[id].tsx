import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, EmptyState, ProgressBar } from "@/components/ui";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { findTest } from "@/data/tests";
import { useTheme } from "@/hooks/use-theme";
import { clock } from "@/lib/format";
import { goReplace } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function TestResult() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { attempts } = usePortal();
  const test = findTest(id);
  const a = test ? attempts[test.id] : undefined;

  const toTests = () => goReplace("/(tabs)/tests");

  if (!test || !a) {
    return (
      <Container edges={["top", "bottom"]}>
        <Header title="Result" onBack={toTests} />
        <EmptyState icon="help-circle" title="No result yet" text="Take the test to see your score here." />
      </Container>
    );
  }

  const pct = Math.round(a.percent);
  const message = pct >= 80 ? "Outstanding work!" : a.passed ? "Well done, you passed." : "Keep practising, you'll get there.";

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Test result" onBack={toTests} />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: a.passed ? Colors.hero : Colors.palette.ink, borderRadius: Radius.xl, padding: Spacing.four, alignItems: "center" }}>
          <Ionicons name={a.passed ? "ribbon" : "refresh-circle"} size={30} color={Colors.gold} />
          <ThemedText type="display" style={{ color: "#FFF", fontSize: 64, lineHeight: 70, marginTop: Spacing.two }}>
            {pct}%
          </ThemedText>
          <ThemedText type="bold" style={{ color: "#FFF" }}>
            {a.score} of {a.total} correct
          </ThemedText>
          <ThemedText style={{ color: Colors.heroMuted, marginTop: 4 }}>{message}</ThemedText>
          <View style={{ flexDirection: "row", gap: Spacing.four, marginTop: Spacing.four }}>
            <View style={{ alignItems: "center" }}>
              <ThemedText style={{ color: "#FFF", fontWeight: "800" }}>{clock(a.durationSec)}</ThemedText>
              <ThemedText style={{ color: Colors.heroMuted, fontSize: 11 }}>time taken</ThemedText>
            </View>
            <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />
            <View style={{ alignItems: "center" }}>
              <ThemedText style={{ color: "#FFF", fontWeight: "800" }}>{test.passMark}%</ThemedText>
              <ThemedText style={{ color: Colors.heroMuted, fontSize: 11 }}>pass mark</ThemedText>
            </View>
          </View>
        </View>

        <ThemedText type="big" style={{ marginTop: Spacing.five }}>
          {test.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: Spacing.three }}>
          {test.courseCode} · {test.course}
        </ThemedText>

        <ThemedText type="label" themeColor="textSecondary" style={{ marginBottom: Spacing.three }}>
          Answer review
        </ThemedText>
        <View style={{ gap: Spacing.three }}>
          {test.questions.map((q, i) => {
            const picked = a.answers[i];
            const ok = picked === q.answer;
            const tone = ok ? theme.success : theme.danger;
            return (
              <Card key={q.id} accent={tone}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.two }}>
                  <Ionicons name={ok ? "checkmark-circle" : "close-circle"} size={20} color={tone} />
                  <ThemedText type="label" style={{ marginLeft: 6, color: tone, fontSize: 10 }}>
                    Question {i + 1} · {picked < 0 ? "Not answered" : ok ? "Correct" : "Incorrect"}
                  </ThemedText>
                </View>
                <ThemedText type="smallBold" style={{ lineHeight: 21 }}>
                  {q.text}
                </ThemedText>
                {!ok && picked >= 0 && (
                  <View style={{ marginTop: Spacing.two, flexDirection: "row" }}>
                    <ThemedText type="small" style={{ color: theme.danger, fontWeight: "700" }}>
                      Your answer:{" "}
                    </ThemedText>
                    <ThemedText type="small" style={{ flex: 1 }}>
                      {q.options[picked]}
                    </ThemedText>
                  </View>
                )}
                <View style={{ marginTop: 4, flexDirection: "row" }}>
                  <ThemedText type="small" style={{ color: theme.success, fontWeight: "700" }}>
                    Correct:{" "}
                  </ThemedText>
                  <ThemedText type="small" style={{ flex: 1 }}>
                    {q.options[q.answer]}
                  </ThemedText>
                </View>
                <View style={{ marginTop: Spacing.two, padding: Spacing.two + 2, borderRadius: Radius.sm, backgroundColor: theme.cardAlt }}>
                  <ThemedText type="caption" themeColor="textSecondary" style={{ lineHeight: 17 }}>
                    💡 {q.explanation}
                  </ThemedText>
                </View>
              </Card>
            );
          })}
        </View>

        <View style={{ marginTop: Spacing.four }}>
          <ProgressBar value={a.percent / 100} color={a.passed ? theme.success : theme.danger} height={8} />
        </View>
        <Button title="Back to tests" onPress={toTests} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
