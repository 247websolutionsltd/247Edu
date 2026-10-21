import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, DetailRow, GradeBadge, ProgressBar, gradeColors } from "@/components/ui";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { courseTotal, findCourse, gradeFor } from "@/data/academics";
import { materials } from "@/data/materials";
import { useTheme } from "@/hooks/use-theme";
import { goWith } from "@/lib/nav";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { EmptyState, ListRow } from "@/components/ui";
import { typeMeta } from "@/data/materials";

export default function CourseDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const found = findCourse(id);

  if (!found) {
    return (
      <Container edges={["top", "bottom"]}>
        <Header title="Course" />
        <EmptyState icon="help-circle" title="Course not found" />
      </Container>
    );
  }

  const { course: c, term } = found;
  const total = courseTotal(c);
  const g = gradeFor(total);
  const gc = gradeColors(g.letter);
  const related = materials.filter((m) => m.courseCode === c.code);

  return (
    <Container edges={["top", "bottom"]}>
      <Header title={c.code} />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ backgroundColor: Colors.hero, borderRadius: Radius.xl, padding: Spacing.four, alignItems: "center" }}>
          <ThemedText type="caption" style={{ color: Colors.heroMuted, fontWeight: "700" }}>
            {term.session} · {term.semester}
          </ThemedText>
          <ThemedText type="title" style={{ color: "#FFF", textAlign: "center", marginTop: 4 }}>
            {c.title}
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.four, gap: Spacing.three }}>
            <View style={{ alignItems: "center" }}>
              <ThemedText type="display" style={{ color: "#FFF", fontSize: 54, lineHeight: 58 }}>
                {total}
              </ThemedText>
              <ThemedText style={{ color: Colors.heroMuted, fontSize: 12 }}>out of 100</ThemedText>
            </View>
            <View style={{ width: 1, height: 56, backgroundColor: "rgba(255,255,255,0.3)" }} />
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" }}>
                <ThemedText style={{ color: gc.fg, fontSize: 36, lineHeight: 44, fontWeight: "900" }}>{g.letter}</ThemedText>
              </View>
              <ThemedText style={{ color: Colors.heroMuted, fontSize: 12, marginTop: 4 }}>{g.remark}</ThemedText>
            </View>
          </View>
        </View>

        <Card style={{ marginTop: Spacing.three }}>
          <ThemedText type="label" themeColor="textSecondary" style={{ fontSize: 10, marginBottom: Spacing.three }}>
            Score breakdown
          </ThemedText>
          <View style={{ marginBottom: Spacing.three }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <ThemedText type="smallBold">Continuous assessment</ThemedText>
              <ThemedText type="smallBold">{c.ca} / 30</ThemedText>
            </View>
            <ProgressBar value={c.ca / 30} height={9} color={theme.info} />
          </View>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <ThemedText type="smallBold">Examination</ThemedText>
              <ThemedText type="smallBold">{c.exam} / 70</ThemedText>
            </View>
            <ProgressBar value={c.exam / 70} height={9} color={theme.accent} />
          </View>
        </Card>

        <Card style={{ marginTop: Spacing.three, paddingVertical: Spacing.two }}>
          <DetailRow label="Course code" value={c.code} />
          <DetailRow label="Credit units" value={String(c.units)} />
          <DetailRow label="Grade point" value={`${g.point}.0`} />
          <DetailRow label="Quality points" value={String(g.point * c.units)} />
          <DetailRow label="Lecturer" value={c.lecturer} last />
        </Card>

        {related.length > 0 && (
          <Card style={{ marginTop: Spacing.three, paddingVertical: 0 }}>
            {related.map((m, i) => (
              <ListRow key={m.id} icon={typeMeta[m.type].icon} title={m.title} subtitle={`${m.type} · ${m.length}`} onPress={() => goWith("/material/[id]", { id: m.id })} last={i === related.length - 1} />
            ))}
          </Card>
        )}
      </View>
    </Container>
  );
}
