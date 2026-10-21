import Container from "@/components/custom-container";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, GradeBadge, HeroPattern, ProgressBar, SectionHeader, gradeColors } from "@/components/ui";
import Button from "@/components/button";
import { Brand } from "@/constants/brand";
import { Colors, Radius, Spacing, TabBarSpace } from "@/constants/theme";
import { classOfDegree, courseTotal, cumulativeGpa, gradeFor, termStats, terms } from "@/data/academics";
import { useAuth } from "@/context/PageContext";
import { useTheme } from "@/hooks/use-theme";
import { fmtGpa, fmtScore } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Share, TouchableOpacity, View } from "react-native";

export default function Results() {
  const theme = useTheme();
  const { owner } = useAuth();
  const [termId, setTermId] = useState(terms[terms.length - 1].id);
  const term = terms.find((t) => t.id === termId) ?? terms[terms.length - 1];
  const stats = termStats(term);
  const cum = cumulativeGpa(terms);
  const best = Math.max(...terms.map((t) => termStats(t).gpa), 0.01);

  const share = async () => {
    const lines = term.courses.map((c) => `${c.code.padEnd(8)} ${String(courseTotal(c)).padStart(3)}  ${gradeFor(courseTotal(c)).letter}`);
    try {
      await Share.share({
        message: `${Brand.school} result slip\n${owner.name} · ${owner.studentId}\n${term.session} ${term.semester}\n\n${lines.join("\n")}\n\nGPA ${fmtGpa(stats.gpa)} · CGPA ${fmtGpa(cum.gpa)}`,
      });
    } catch {}
  };

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ padding: Spacing.three, paddingBottom: Spacing.two }}>
        <ThemedText type="label" style={{ color: theme.accent }}>
          Academic record
        </ThemedText>
        <ThemedText type="large">Results</ThemedText>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        {/* cumulative banner */}
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four, overflow: "hidden" }}>
          <HeroPattern lines={8} />
          <View style={{ paddingLeft: Spacing.three }}>
            <ThemedText type="label" style={{ color: Colors.gold }}>
              Cumulative GPA
            </ThemedText>
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 2 }}>
              <ThemedText type="display" style={{ color: "#FFF", fontSize: 56, lineHeight: 62 }}>
                {fmtGpa(cum.gpa)}
              </ThemedText>
              <ThemedText style={{ color: Colors.heroMuted, marginBottom: 10, marginLeft: 6, fontWeight: "700" }}>/ {Brand.gpaScale.toFixed(1)}</ThemedText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2, gap: Spacing.two }}>
              <View style={{ backgroundColor: Colors.gold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                <ThemedText style={{ color: Colors.palette.red900, fontWeight: "900", fontSize: 11, letterSpacing: 0.8 }}>{classOfDegree(cum.gpa).toUpperCase()}</ThemedText>
              </View>
              <ThemedText type="caption" style={{ color: Colors.heroMuted }}>
                {cum.units} credit units earned
              </ThemedText>
            </View>
          </View>
        </View>

        {/* GPA trend */}
        <Card style={{ marginTop: Spacing.three }}>
          <ThemedText type="label" themeColor="textSecondary" style={{ fontSize: 10 }}>
            GPA by semester
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", height: 96, marginTop: Spacing.three, gap: Spacing.three }}>
            {terms.map((t) => {
              const g = termStats(t).gpa;
              const on = t.id === termId;
              return (
                <TouchableOpacity key={t.id} onPress={() => setTermId(t.id)} activeOpacity={0.8} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                  <ThemedText type="smallBold" style={{ color: on ? theme.accent : theme.textSecondary, marginBottom: 4 }}>
                    {fmtGpa(g)}
                  </ThemedText>
                  <View style={{ width: "100%", height: Math.max(8, (g / best) * 56), borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: on ? theme.accent : theme.controlOff }} />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ flexDirection: "row", gap: Spacing.three, marginTop: Spacing.two }}>
            {terms.map((t) => (
              <ThemedText key={t.id} type="caption" themeColor="textSecondary" style={{ flex: 1, textAlign: "center" }}>
                {t.session.slice(2, 4)}/{t.session.slice(7)} · {t.semester.slice(0, 3)}
              </ThemedText>
            ))}
          </View>
        </Card>

        {/* term picker */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.two, paddingVertical: Spacing.four }}>
          {[...terms].reverse().map((t) => (
            <Chip key={t.id} label={`${t.session} · ${t.semester}`} selected={t.id === termId} onPress={() => setTermId(t.id)} />
          ))}
        </ScrollView>

        {/* semester summary */}
        <View style={{ flexDirection: "row", gap: Spacing.two + 2 }}>
          {[
            { k: "Semester GPA", v: fmtGpa(stats.gpa) },
            { k: "Average", v: `${fmtScore(Math.round(stats.average * 10) / 10)}%` },
            { k: "Passed", v: `${stats.passed}/${term.courses.length}` },
          ].map((s) => (
            <View key={s.k} style={{ flex: 1, padding: Spacing.three, borderRadius: Radius.md, backgroundColor: theme.cardAlt }}>
              <ThemedText type="caption" themeColor="textSecondary">
                {s.k}
              </ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 2 }}>
                {s.v}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* courses */}
        <View style={{ marginTop: Spacing.five }}>
          <SectionHeader title="Course scores" kicker={`${term.courses.length} courses · ${stats.units} units`} />
          <View style={{ gap: Spacing.two + 2 }}>
            {term.courses.map((c) => {
              const total = courseTotal(c);
              const g = gradeFor(total);
              return (
                <Card key={c.id} onPress={() => goWith("/course/[id]", { id: c.id })}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <GradeBadge letter={g.letter} size={46} />
                    <View style={{ flex: 1, marginLeft: Spacing.three }}>
                      <ThemedText type="caption" themeColor="textSecondary" style={{ fontWeight: "800", letterSpacing: 0.6 }}>
                        {c.code} · {c.units} UNITS
                      </ThemedText>
                      <ThemedText type="smallBold" numberOfLines={1} style={{ marginTop: 1 }}>
                        {c.title}
                      </ThemedText>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <ThemedText type="large" style={{ fontSize: 24, lineHeight: 28 }}>
                        {total}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="textSecondary">
                        / 100
                      </ThemedText>
                    </View>
                  </View>
                  <View style={{ marginTop: Spacing.three }}>
                    <ProgressBar value={total / 100} color={gradeColors(g.letter).fg} height={6} />
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: Spacing.four, padding: Spacing.three, borderRadius: Radius.md, backgroundColor: theme.cardAlt }}>
          <Ionicons name="information-circle" size={18} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary" style={{ flex: 1, marginLeft: Spacing.two, lineHeight: 17 }}>
            Grading: A 70–100 · B 60–69 · C 50–59 · D 45–49 · E 40–44 · F below 40. Results shown here are unofficial until confirmed by the Registry.
          </ThemedText>
        </View>

        <Button title="Share result slip" iconLeft="share-outline" variant="secondary" onPress={share} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
