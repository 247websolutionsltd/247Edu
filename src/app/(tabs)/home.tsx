import Avatar from "@/components/avatar";
import { RoundButton } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, HeroPattern, IconBadge, SectionHeader, StatTile, Tag } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { classOfDegree, DAY_NAMES, slotsForDay, to12h } from "@/data/academics";
import { announcements, categoryMeta } from "@/data/announcements";
import { materials, typeMeta } from "@/data/materials";
import { tests } from "@/data/tests";
import { useAuth } from "@/context/PageContext";
import { usePortal } from "@/context/PortalContext";
import { useTheme } from "@/hooks/use-theme";
import { closesLabel, fmtGpa, greeting, timeAgo } from "@/lib/format";
import { go, goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StatusBar, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BARS = [3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1];

/** Finds the next class from now, looking up to a week ahead. */
function nextClass(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < 7; i++) {
    const day = (now.getDay() + i) % 7;
    const slots = slotsForDay(day);
    const hit = slots.find((s) => {
      if (i > 0) return true;
      const [h, m] = s.end.split(":").map(Number);
      return h * 60 + m > mins;
    });
    if (hit) return { slot: hit, when: i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAY_NAMES[day] };
  }
  return null;
}

const QUICK = [
  { label: "Results", icon: "ribbon" as const, route: "/(tabs)/results", tint: "#FCE3E6", color: "#C8102E" },
  { label: "Tests", icon: "create" as const, route: "/(tabs)/tests", tint: "#FFF1CC", color: "#9A6B00" },
  { label: "Library", icon: "library" as const, route: "/(tabs)/library", tint: "#E4EEFF", color: "#2F6FDE" },
  { label: "Timetable", icon: "calendar" as const, route: "/timetable", tint: "#DDF4E8", color: "#0F7A4A" },
];

export default function Home() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { owner } = useAuth();
  const { cgpa, currentGpa, pendingTests, unreadCount, attempts, opened } = usePortal();

  const first = owner.name.split(" ")[0] || "Student";
  const next = nextClass();
  const open = tests.filter((t) => !attempts[t.id]).slice(0, 2);
  const latest = [...announcements].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.ts - a.ts).slice(0, 3);
  const toRead = materials.filter((m) => !opened.includes(m.id)).slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.five }} overScrollMode="never">
        {/* ---------------------------- masthead ---------------------------- */}
        <View
          style={{
            backgroundColor: Colors.hero,
            paddingTop: insets.top + Spacing.three,
            paddingHorizontal: Spacing.four,
            paddingBottom: 84,
            borderBottomLeftRadius: Radius.xl,
            borderBottomRightRadius: Radius.xl,
            overflow: "hidden",
          }}
        >
          <HeroPattern />
          <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: Spacing.three }}>
            <Avatar name={owner.name} size={46} onHero />
            <View style={{ flex: 1, marginLeft: Spacing.three }}>
              <ThemedText type="caption" style={{ color: Colors.heroMuted, fontWeight: "700", letterSpacing: 0.4 }}>
                {greeting()}
              </ThemedText>
              <ThemedText type="big" style={{ color: "#FFF" }} numberOfLines={1}>
                {first}
              </ThemedText>
            </View>
            <RoundButton icon="notifications-outline" onHero count={unreadCount} label="Announcements" onPress={() => go("/announcements")} />
          </View>
          <View style={{ paddingLeft: Spacing.three, marginTop: Spacing.four }}>
            <ThemedText type="label" style={{ color: Colors.gold }}>
              {Brand.session} · {Brand.semester}
            </ThemedText>
            <ThemedText type="title" style={{ color: "#FFF", marginTop: 4 }}>
              {pendingTests > 0 ? `${pendingTests} test${pendingTests > 1 ? "s" : ""} waiting\nfor you.` : "You're all\ncaught up."}
            </ThemedText>
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.three }}>
          {/* --------------------------- ID card --------------------------- */}
          <View
            style={{
              marginTop: -56,
              backgroundColor: theme.card,
              borderRadius: Radius.lg,
              borderWidth: 1,
              borderColor: theme.line,
              overflow: "hidden",
              shadowColor: "#2A0409",
              shadowOpacity: 0.12,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.cardAlt, paddingHorizontal: Spacing.three, paddingVertical: 8 }}>
              <Ionicons name="school" size={14} color={theme.accent} />
              <ThemedText type="label" style={{ marginLeft: 6, color: theme.accent, fontSize: 10 }}>
                {Brand.school} · Student ID
              </ThemedText>
            </View>
            <View style={{ flexDirection: "row", padding: Spacing.three, alignItems: "center" }}>
              <Avatar name={owner.name} size={64} square />
              <View style={{ flex: 1, marginLeft: Spacing.three }}>
                <ThemedText type="big" numberOfLines={1}>
                  {owner.name || "Student"}
                </ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.accent, marginTop: 1 }}>
                  {owner.studentId || "—"}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={{ marginTop: 2 }}>
                  {owner.department || "Department"} · {owner.level || "—"} Level
                </ThemedText>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", height: 26, paddingHorizontal: Spacing.three, paddingBottom: Spacing.two, gap: 2 }}>
              {BARS.map((w, i) => (
                <View key={i} style={{ width: w, height: i % 5 === 0 ? 18 : 14, backgroundColor: theme.text, opacity: 0.75 }} />
              ))}
            </View>
          </View>

          {/* ---------------------------- stats ---------------------------- */}
          <View style={{ flexDirection: "row", gap: Spacing.two + 2, marginTop: Spacing.three }}>
            <StatTile label="CGPA" value={fmtGpa(cgpa)} sub={classOfDegree(cgpa)} icon="trophy" tone={theme.accent} />
            <StatTile label="This sem." value={fmtGpa(currentGpa)} sub={`of ${Brand.gpaScale.toFixed(1)}`} icon="trending-up" />
            <StatTile label="Tests due" value={String(pendingTests)} sub="not yet taken" icon="time" />
          </View>

          {/* --------------------------- next class --------------------------- */}
          {next && (
            <Card accent style={{ marginTop: Spacing.three, flexDirection: "row", alignItems: "center" }} onPress={() => go("/timetable")}>
              <View style={{ flex: 1 }}>
                <ThemedText type="label" style={{ color: theme.accent, fontSize: 10 }}>
                  Up next · {next.when}
                </ThemedText>
                <ThemedText type="bold" style={{ marginTop: 3 }} numberOfLines={1}>
                  {next.slot.code} · {next.slot.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
                  {to12h(next.slot.start)} – {to12h(next.slot.end)} · {next.slot.venue}
                </ThemedText>
              </View>
              <IconBadge icon="chevron-forward" size={36} />
            </Card>
          )}

          {/* ---------------------------- quick access ---------------------------- */}
          <View style={{ flexDirection: "row", gap: Spacing.two + 2, marginTop: Spacing.four }}>
            {QUICK.map((q) => (
              <TouchableOpacity
                key={q.label}
                activeOpacity={0.85}
                onPress={() => go(q.route)}
                accessibilityLabel={q.label}
                style={{ flex: 1, alignItems: "center", paddingVertical: Spacing.three, borderRadius: Radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}
              >
                <IconBadge icon={q.icon} size={44} bg={q.tint} color={q.color} />
                <ThemedText type="caption" style={{ marginTop: 8, fontWeight: "800" }}>
                  {q.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* --------------------------- announcements --------------------------- */}
          <View style={{ marginTop: Spacing.five }}>
            <SectionHeader kicker="Notice board" title="Announcements" action="See all" onAction={() => go("/announcements")} />
            <View style={{ gap: Spacing.two + 2 }}>
              {latest.map((a) => (
                <Card key={a.id} accent={categoryMeta[a.category].color} onPress={() => goWith("/announcements/[id]", { id: a.id })}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Tag label={a.category} color={categoryMeta[a.category].color} bg={theme.cardAlt} icon={categoryMeta[a.category].icon} />
                    <ThemedText type="caption" themeColor="textSecondary">
                      {a.pinned ? "📌 " : ""}
                      {timeAgo(a.ts)}
                    </ThemedText>
                  </View>
                  <ThemedText type="bold" style={{ marginTop: Spacing.two }} numberOfLines={2}>
                    {a.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 2 }} numberOfLines={2}>
                    {a.summary}
                  </ThemedText>
                </Card>
              ))}
            </View>
          </View>

          {/* ------------------------------ tests ------------------------------ */}
          {open.length > 0 && (
            <View style={{ marginTop: Spacing.five }}>
              <SectionHeader kicker="Open now" title="Tests to take" action="All tests" onAction={() => go("/(tabs)/tests")} />
              <View style={{ gap: Spacing.two + 2 }}>
                {open.map((t) => (
                  <Card key={t.id} onPress={() => goWith("/test/[id]", { id: t.id })} style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconBadge icon="create" size={46} bg={theme.goldSurface} color={theme.warning} />
                    <View style={{ flex: 1, marginLeft: Spacing.three }}>
                      <ThemedText type="smallBold" numberOfLines={1}>
                        {t.title}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
                        {t.courseCode} · {t.questions.length} questions · {t.durationMin} min
                      </ThemedText>
                      <ThemedText type="caption" style={{ color: theme.accent, marginTop: 2, fontWeight: "700" }}>
                        {closesLabel(t.closesInDays)}
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.inkSoft} />
                  </Card>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ------------------------------ reading ------------------------------ */}
        {toRead.length > 0 && (
          <View style={{ marginTop: Spacing.five }}>
            <View style={{ paddingHorizontal: Spacing.three }}>
              <SectionHeader kicker="Keep studying" title="From your library" action="Browse" onAction={() => go("/(tabs)/library")} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.three, gap: Spacing.two + 2 }}>
              {toRead.map((m) => {
                const meta = typeMeta[m.type];
                return (
                  <TouchableOpacity
                    key={m.id}
                    activeOpacity={0.85}
                    onPress={() => goWith("/material/[id]", { id: m.id })}
                    style={{ width: 188, padding: Spacing.three, borderRadius: Radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}
                  >
                    <IconBadge icon={meta.icon} size={40} bg={meta.bg} color={meta.color} />
                    <ThemedText type="smallBold" numberOfLines={2} style={{ marginTop: Spacing.three, minHeight: 40 }}>
                      {m.title}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 4 }}>
                      {m.courseCode} · {m.type}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
