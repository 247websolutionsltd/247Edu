import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, EmptyState, Tag } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { announcementCategories, announcements, categoryMeta } from "@/data/announcements";
import { usePortal } from "@/context/PortalContext";
import { useTheme } from "@/hooks/use-theme";
import { timeAgo } from "@/lib/format";
import { goWith } from "@/lib/nav";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Announcements() {
  const theme = useTheme();
  const { readAnnouncements, unreadCount, markAllRead } = usePortal();
  const [cat, setCat] = useState<(typeof announcementCategories)[number]>("All");

  const list = announcements
    .filter((a) => cat === "All" || a.category === cat)
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.ts - a.ts);

  return (
    <Container edges={["top", "bottom"]}>
      <Header
        title="Announcements"
        right={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead} hitSlop={10}>
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                Mark all read
              </ThemedText>
            </TouchableOpacity>
          ) : undefined
        }
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingBottom: Spacing.three, gap: Spacing.two }}>
        {announcementCategories.map((c) => (
          <Chip key={c} label={c} selected={cat === c} onPress={() => setCat(c)} icon={c === "All" ? undefined : categoryMeta[c].icon} />
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: Spacing.three }}>
        {list.length === 0 ? (
          <EmptyState icon="megaphone-outline" title="Nothing here" text="No announcements in this category yet." />
        ) : (
          <View style={{ gap: Spacing.three - 4 }}>
            {list.map((a) => {
              const unread = !readAnnouncements.includes(a.id);
              const meta = categoryMeta[a.category];
              return (
                <Card key={a.id} accent={meta.color} onPress={() => goWith("/announcements/[id]", { id: a.id })}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Tag label={a.category} color={meta.color} bg={theme.cardAlt} icon={meta.icon} />
                      {a.pinned && <Tag label="Pinned" color={theme.warning} bg={theme.goldSurface} icon="pin" />}
                    </View>
                    {unread && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.accent }} />}
                  </View>
                  <ThemedText type="bold" style={{ marginTop: Spacing.two, fontWeight: unread ? "800" : "600" }}>
                    {a.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={2} style={{ marginTop: 2 }}>
                    {a.summary}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="inkSoft" style={{ marginTop: Spacing.two }}>
                    {a.from} · {timeAgo(a.ts)}
                  </ThemedText>
                </Card>
              );
            })}
          </View>
        )}
      </View>
    </Container>
  );
}
