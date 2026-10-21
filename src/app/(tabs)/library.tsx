import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import { ThemedText } from "@/components/themed-text";
import { Card, Chip, EmptyState, IconBadge, Tag } from "@/components/ui";
import { Spacing, TabBarSpace } from "@/constants/theme";
import { usePortal } from "@/context/PortalContext";
import { materials, materialTypes, MaterialType, typeMeta } from "@/data/materials";
import { useTheme } from "@/hooks/use-theme";
import { goWith } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Library() {
  const theme = useTheme();
  const { bookmarks, toggleBookmark, opened } = usePortal();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | MaterialType>("All");
  const [savedOnly, setSavedOnly] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter(
      (m) =>
        (type === "All" || m.type === type) &&
        (!savedOnly || bookmarks.includes(m.id)) &&
        (!q || `${m.title} ${m.courseCode} ${m.course} ${m.author}`.toLowerCase().includes(q)),
    );
  }, [query, type, savedOnly, bookmarks]);

  return (
    <Container edges={["top"]} style={{ paddingBottom: TabBarSpace }}>
      <View style={{ padding: Spacing.three, paddingBottom: 0 }}>
        <ThemedText type="label" style={{ color: theme.accent }}>
          Reading materials
        </ThemedText>
        <ThemedText type="large">Library</ThemedText>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        <Input icon="search" placeholder="Search notes, courses or lecturers" value={query} onChangeText={setQuery} returnKeyType="search" autoCorrect={false} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, gap: Spacing.two }}>
        <Chip label="Saved" icon={savedOnly ? "bookmark" : "bookmark-outline"} selected={savedOnly} onPress={() => setSavedOnly(!savedOnly)} />
        {materialTypes.map((t) => (
          <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: Spacing.three, paddingTop: Spacing.two }}>
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginBottom: Spacing.three }}>
          {list.length} {list.length === 1 ? "item" : "items"}
          {opened.length ? ` · ${opened.length} opened` : ""}
        </ThemedText>

        {list.length === 0 ? (
          <EmptyState icon={savedOnly ? "bookmark-outline" : "search"} title={savedOnly ? "No saved materials" : "No matches"} text={savedOnly ? "Tap the bookmark on any material to keep it here for quick access." : "Try a different search or filter."} />
        ) : (
          <View style={{ gap: Spacing.three - 4 }}>
            {list.map((m) => {
              const meta = typeMeta[m.type];
              const saved = bookmarks.includes(m.id);
              const seen = opened.includes(m.id);
              return (
                <Card key={m.id} onPress={() => goWith("/material/[id]", { id: m.id })} style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconBadge icon={meta.icon} size={50} bg={meta.bg} color={meta.color} />
                  <View style={{ flex: 1, marginLeft: Spacing.three }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Tag label={m.courseCode} />
                      {seen && <Ionicons name="checkmark-circle" size={14} color={theme.success} />}
                    </View>
                    <ThemedText type="smallBold" numberOfLines={2} style={{ marginTop: 5 }}>
                      {m.title}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 2 }}>
                      {m.type} · {m.length}
                      {m.size ? ` · ${m.size}` : ""}
                    </ThemedText>
                  </View>
                  <TouchableOpacity onPress={() => toggleBookmark(m.id)} hitSlop={10} accessibilityLabel={saved ? "Remove bookmark" : "Save for later"}>
                    <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={22} color={saved ? theme.accent : theme.inkSoft} />
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        )}
      </View>
    </Container>
  );
}
