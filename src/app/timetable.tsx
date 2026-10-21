import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, EmptyState, Tag } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { Radius, Spacing } from "@/constants/theme";
import { DAY_NAMES, DAY_SHORT, slotsForDay, timetable, to12h } from "@/data/academics";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const DAYS = [1, 2, 3, 4, 5] as const;

export default function Timetable() {
  const theme = useTheme();
  const today = new Date().getDay();
  const [day, setDay] = useState<number>(today >= 1 && today <= 5 ? today : 1);
  const slots = slotsForDay(day);
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Timetable" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginBottom: Spacing.three }}>
          {Brand.session} · {Brand.semester} · {timetable.length} sessions a week
        </ThemedText>

        <View style={{ flexDirection: "row", gap: Spacing.two }}>
          {DAYS.map((d) => {
            const on = d === day;
            const isToday = d === today;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => setDay(d)}
                activeOpacity={0.85}
                accessibilityState={{ selected: on }}
                style={{ flex: 1, alignItems: "center", paddingVertical: Spacing.three - 2, borderRadius: Radius.md, borderWidth: 1.5, borderColor: on ? theme.accent : theme.line, backgroundColor: on ? theme.accent : theme.card }}
              >
                <ThemedText type="caption" style={{ color: on ? "rgba(255,255,255,0.8)" : theme.textSecondary, fontWeight: "800", letterSpacing: 0.6 }}>
                  {DAY_SHORT[d].toUpperCase()}
                </ThemedText>
                <ThemedText type="bold" style={{ color: on ? "#FFF" : theme.text, marginTop: 2 }}>
                  {slotsForDay(d).length}
                </ThemedText>
                <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 4, backgroundColor: isToday ? (on ? "#F2B632" : theme.accent) : "transparent" }} />
              </TouchableOpacity>
            );
          })}
        </View>

        <ThemedText type="big" style={{ marginTop: Spacing.four, marginBottom: Spacing.three }}>
          {DAY_NAMES[day]}
          {day === today ? " · Today" : ""}
        </ThemedText>

        {slots.length === 0 ? (
          <EmptyState icon="cafe-outline" title="No classes" text="Enjoy the free day." />
        ) : (
          <View>
            {slots.map((s, i) => {
              const [sh, sm] = s.start.split(":").map(Number);
              const [eh, em] = s.end.split(":").map(Number);
              const live = day === today && nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
              return (
                <View key={s.id} style={{ flexDirection: "row" }}>
                  <View style={{ width: 66, alignItems: "flex-end", paddingRight: Spacing.three, paddingTop: 4 }}>
                    <ThemedText type="smallBold">{to12h(s.start).replace(" ", " ")}</ThemedText>
                    <ThemedText type="caption" themeColor="inkSoft">
                      {to12h(s.end).replace(" ", " ")}
                    </ThemedText>
                  </View>
                  <View style={{ alignItems: "center", width: 14 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, marginTop: 8, backgroundColor: live ? theme.accent : theme.card, borderWidth: 3, borderColor: theme.accent }} />
                    {i < slots.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: theme.line }} />}
                  </View>
                  <View style={{ flex: 1, paddingLeft: Spacing.three, paddingBottom: Spacing.three }}>
                    <Card accent={live ? theme.accent : theme.controlOff}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Tag label={s.kind} />
                        {live && (
                          <ThemedText type="label" style={{ color: theme.accent, fontSize: 10 }}>
                            ● Live now
                          </ThemedText>
                        )}
                      </View>
                      <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
                        {s.code} · {s.title}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
                        {s.venue} · {s.lecturer}
                      </ThemedText>
                    </Card>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </Container>
  );
}
