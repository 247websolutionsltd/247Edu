import Container from "@/components/custom-container";
import { ThemedText } from "@/components/themed-text";
import { Card, EmptyState, IconBadge, Tag, gradeColors } from "@/components/ui";
import { Radius, Spacing, TabBarSpace } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { tests } from "@/data/tests";
import { useTheme } from "@/hooks/use-theme";
import { closesLabel, shortDate } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Tests() {
  const theme = useTheme();
  const { attempts } = usePortal();
  const [tab, setTab] = useState<"open" | "done">("open");

  const open = tests.filter((t) => !attempts[t.id]);
  const done = tests.filter((t) => attempts[t.id]);
  const list = tab === "open" ? open : done;

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ padding: Spacing.three, paddingBottom: Spacing.two }}>
        <ThemedText type="label" style={{ color: theme.accent }}>
          Computer-based assessment
        </ThemedText>
        <ThemedText type="large">Tests</ThemedText>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        {/* segmented control */}
        <View style={{ flexDirection: "row", padding: 4, borderRadius: Radius.md, backgroundColor: theme.cardAlt, marginBottom: Spacing.three }}>
          {(
            [
              { id: "open", label: `Available (${open.length})` },
              { id: "done", label: `Completed (${done.length})` },
            ] as const
          ).map((s) => {
            const on = tab === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setTab(s.id)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                style={{ flex: 1, height: 40, borderRadius: Radius.sm, alignItems: "center", justifyContent: "center", backgroundColor: on ? theme.card : "transparent" }}
              >
                <ThemedText type="smallBold" style={{ color: on ? theme.accent : theme.textSecondary }}>
                  {s.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {list.length === 0 ? (
          <EmptyState
            icon={tab === "open" ? "checkmark-done" : "create-outline"}
            title={tab === "open" ? "No tests waiting" : "Nothing taken yet"}
            text={tab === "open" ? "You've completed every available test. Nice work." : "Tests you finish will appear here with your score and answer review."}
          />
        ) : (
          <View style={{ gap: Spacing.three }}>
            {list.map((t) => {
              const a = attempts[t.id];
              const letter = a ? (a.percent >= 70 ? "A" : a.percent >= 60 ? "B" : a.percent >= 50 ? "C" : a.percent >= 45 ? "D" : "F") : "";
              const gc = gradeColors(letter);
              return (
                <Card key={t.id} accent={a ? (a.passed ? theme.success : theme.danger) : true} onPress={() => goWith(a ? "/test/result/[id]" : "/test/[id]", { id: t.id })}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Tag label={t.courseCode} />
                    {a ? (
                      <ThemedText type="caption" themeColor="textSecondary">
                        Taken {shortDate(a.ts)}
                      </ThemedText>
                    ) : (
                      <ThemedText type="caption" style={{ color: theme.accent, fontWeight: "700" }}>
                        {closesLabel(t.closesInDays)}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText type="big" style={{ marginTop: Spacing.two }}>
                    {t.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t.course}
                  </ThemedText>

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.three }}>
                    {a ? (
                      <>
                        <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: gc.bg, alignItems: "center", justifyContent: "center" }}>
                          <ThemedText style={{ color: gc.fg, fontWeight: "900", fontSize: 20 }}>{letter}</ThemedText>
                        </View>
                        <View style={{ marginLeft: Spacing.three, flex: 1 }}>
                          <ThemedText type="smallBold">
                            {a.score}/{a.total} correct · {Math.round(a.percent)}%
                          </ThemedText>
                          <ThemedText type="caption" style={{ color: a.passed ? theme.success : theme.danger, fontWeight: "700" }}>
                            {a.passed ? "Passed" : "Below pass mark"} · tap to review
                          </ThemedText>
                        </View>
                      </>
                    ) : (
                      <>
                        <IconBadge icon="help-circle" size={34} />
                        <ThemedText type="small" style={{ marginLeft: Spacing.two, flex: 1 }}>
                          {t.questions.length} questions
                        </ThemedText>
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 4 }}>
                          {t.durationMin} min
                        </ThemedText>
                      </>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </View>
    </Container>
  );
}
