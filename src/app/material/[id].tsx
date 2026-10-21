import Button from "@/components/button";
import Container from "@/components/custom-container";
import Header from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Card, DetailRow, EmptyState, IconBadge, Tag } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { findMaterial, typeMeta } from "@/data/materials";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Alert, Linking, Share, TouchableOpacity, View } from "react-native";

const ACTION: Record<string, { label: string; icon: "download" | "play" | "open" | "headset" }> = {
  PDF: { label: "Open document", icon: "open" },
  Slides: { label: "Open slides", icon: "open" },
  Video: { label: "Watch video", icon: "play" },
  Link: { label: "Open resource", icon: "open" },
  Audio: { label: "Listen now", icon: "headset" },
};

export default function MaterialDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookmarks, toggleBookmark, opened, markOpened } = usePortal();
  const m = findMaterial(id);

  if (!m) {
    return (
      <Container edges={["top", "bottom"]}>
        <Header title="Material" />
        <EmptyState icon="help-circle" title="Material not found" />
      </Container>
    );
  }

  const meta = typeMeta[m.type];
  const saved = bookmarks.includes(m.id);
  const seen = opened.includes(m.id);
  const action = ACTION[m.type];

  const open = async () => {
    try {
      await Linking.openURL(m.url);
      markOpened(m.id);
    } catch {
      Alert.alert("Couldn't open this file", "Check your connection and try again.");
    }
  };

  const share = () => Share.share({ message: `${m.title} (${m.courseCode})\n${m.url}` }).catch(() => {});

  return (
    <Container edges={["top", "bottom"]}>
      <Header
        title="Material"
        right={
          <TouchableOpacity
            onPress={() => toggleBookmark(m.id)}
            accessibilityLabel={saved ? "Remove bookmark" : "Save for later"}
            style={{ width: 44, height: 44, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}
          >
            <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={20} color={saved ? theme.accent : theme.text} />
          </TouchableOpacity>
        }
      />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ height: 170, borderRadius: Radius.xl, backgroundColor: meta.bg, alignItems: "center", justifyContent: "center" }}>
          <IconBadge icon={meta.icon} size={84} bg="#FFFFFF" color={meta.color} />
          <View style={{ position: "absolute", top: Spacing.three, left: Spacing.three }}>
            <Tag label={m.type} color={meta.color} bg="#FFFFFF" />
          </View>
          {seen && (
            <View style={{ position: "absolute", top: Spacing.three, right: Spacing.three, flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Ionicons name="checkmark-circle" size={13} color="#1F8A5B" />
              <ThemedText style={{ color: "#1F8A5B", fontSize: 11, fontWeight: "800", marginLeft: 4 }}>OPENED</ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="label" style={{ color: theme.accent, marginTop: Spacing.four }}>
          {m.courseCode} · Week {m.week}
        </ThemedText>
        <ThemedText type="title" style={{ marginTop: 4 }}>
          {m.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.three, lineHeight: 24 }}>
          {m.description}
        </ThemedText>

        <Card style={{ marginTop: Spacing.four, paddingVertical: Spacing.two }}>
          <DetailRow label="Course" value={m.course} />
          <DetailRow label="Shared by" value={m.author} />
          <DetailRow label="Length" value={m.length} />
          {m.size ? <DetailRow label="File size" value={m.size} /> : null}
          <DetailRow label="Week" value={`Week ${m.week}`} last />
        </Card>

        <Button title={action.label} icon={action.icon} onPress={open} style={{ marginTop: Spacing.four }} />
        <Button title="Share with a classmate" iconLeft="share-outline" variant="secondary" onPress={share} style={{ marginTop: Spacing.three }} />
      </View>
    </Container>
  );
}
