import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { EmptyState, IconBadge, Tag } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { categoryMeta, findAnnouncement } from "@/data/announcements";
import { useTheme } from "@/hooks/use-theme";
import { fullDate } from "@/lib/format";
import { go } from "@/lib/nav";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Share, View } from "react-native";

export default function AnnouncementDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { markRead } = usePortal();
  const a = findAnnouncement(id);

  useEffect(() => {
    if (a) markRead(a.id);
  }, [a, markRead]);

  if (!a) {
    return (
      <Container edges={["top", "bottom"]}>
        <Header title="Announcement" />
        <EmptyState icon="help-circle" title="Announcement not found" />
      </Container>
    );
  }

  const meta = categoryMeta[a.category];

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Announcement" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Tag label={a.category} color={meta.color} bg={theme.cardAlt} icon={meta.icon} />
          {a.pinned && <Tag label="Pinned" color={theme.warning} bg={theme.goldSurface} icon="pin" />}
        </View>
        <ThemedText type="title" style={{ marginTop: Spacing.three }}>
          {a.title}
        </ThemedText>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: Spacing.three, paddingVertical: Spacing.three, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.line }}>
          <IconBadge icon={meta.icon} size={38} bg={theme.cardAlt} color={meta.color} />
          <View style={{ marginLeft: Spacing.three }}>
            <ThemedText type="smallBold">{a.from}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {fullDate(a.ts)}
            </ThemedText>
          </View>
        </View>

        {a.body.split("\n\n").map((p, i) => (
          <ThemedText key={i} style={{ marginTop: Spacing.three, lineHeight: 26 }}>
            {p}
          </ThemedText>
        ))}

        {a.action && <Button title={a.action.label} icon="arrow-forward" onPress={() => go(a.action!.route)} style={{ marginTop: Spacing.five }} />}
        <Button
          title="Share"
          variant="secondary"
          iconLeft="share-outline"
          onPress={() => Share.share({ message: `${a.title}\n\n${a.summary}` }).catch(() => {})}
          style={{ marginTop: Spacing.three, borderRadius: Radius.md }}
        />
      </View>
    </Container>
  );
}
