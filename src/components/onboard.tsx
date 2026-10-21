import { Colors, Radius, Spacing } from "@/constants/theme";
import { Slide } from "@/data/onboardData";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, View } from "react-native";
import { ThemedText } from "./themed-text";

const { width } = Dimensions.get("window");
const R = Colors.palette;

function Row({ code, title, score, grade }: { code: string; title: string; score: number; grade: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "#F1E8E1" }}>
      <View style={{ flex: 1 }}>
        <ThemedText style={{ color: R.ink, fontWeight: "800", fontSize: 13 }}>{code}</ThemedText>
        <ThemedText style={{ color: "#8A7B7E", fontSize: 11 }}>{title}</ThemedText>
      </View>
      <ThemedText style={{ color: R.ink, fontWeight: "700", marginRight: 10 }}>{score}</ThemedText>
      <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: grade === "A" ? "#DDF4E8" : "#E4EEFF", alignItems: "center", justifyContent: "center" }}>
        <ThemedText style={{ color: grade === "A" ? "#0F7A4A" : "#2F6FDE", fontWeight: "900", fontSize: 14 }}>{grade}</ThemedText>
      </View>
    </View>
  );
}

function Illustration({ kind }: { kind: Slide["kind"] }) {
  const paper = { backgroundColor: "#FFFFFF", borderRadius: Radius.lg, padding: Spacing.three, borderWidth: 1, borderColor: "#EADFD6" } as const;
  return (
    <View style={{ height: 320, alignItems: "center", justifyContent: "center" }}>
      {/* crimson backdrop block */}
      <View style={{ position: "absolute", width: 290, height: 270, borderRadius: Radius.xl, backgroundColor: R.red600, transform: [{ rotate: "-4deg" }] }} />
      <View style={{ position: "absolute", width: 290, height: 270, borderRadius: Radius.xl, borderWidth: 2, borderColor: R.gold, transform: [{ rotate: "3deg" }] }} />

      {kind === "results" && (
        <View style={[paper, { width: 262 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <ThemedText style={{ color: "#8A7B7E", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }}>CURRENT GPA</ThemedText>
            <View style={{ backgroundColor: R.goldSurface, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
              <ThemedText style={{ color: R.goldDeep, fontSize: 10, fontWeight: "800" }}>FIRST CLASS</ThemedText>
            </View>
          </View>
          <ThemedText type="stat" style={{ color: R.red600, fontSize: 44, lineHeight: 50, marginTop: 2 }}>4.38</ThemedText>
          <Row code="CSC 301" title="Algorithms" score={82} grade="A" />
          <Row code="CSC 305" title="Database Systems" score={88} grade="A" />
          <Row code="MTH 301" title="Numerical Analysis" score={63} grade="B" />
        </View>
      )}

      {kind === "tests" && (
        <View style={[paper, { width: 262 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <ThemedText style={{ color: "#8A7B7E", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }}>QUESTION 3 OF 6</ThemedText>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: R.red600, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Ionicons name="time" size={12} color="#FFF" />
              <ThemedText style={{ color: "#FFF", fontWeight: "800", fontSize: 12, marginLeft: 4 }}>04:52</ThemedText>
            </View>
          </View>
          <View style={{ height: 5, borderRadius: 3, backgroundColor: "#F1E8E1", marginTop: 10 }}>
            <View style={{ width: "50%", height: 5, borderRadius: 3, backgroundColor: R.red600 }} />
          </View>
          <ThemedText style={{ color: R.ink, fontFamily: undefined, fontWeight: "700", fontSize: 14, marginTop: 12, lineHeight: 19 }}>
            Which sort is stable?
          </ThemedText>
          {["Heap sort", "Selection sort", "Merge sort"].map((o, i) => (
            <View
              key={o}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 7,
                padding: 9,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: i === 2 ? R.red600 : "#EADFD6",
                backgroundColor: i === 2 ? R.red50 : "#FFF",
              }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: i === 2 ? R.red600 : "#F1E8E1", alignItems: "center", justifyContent: "center" }}>
                <ThemedText style={{ color: i === 2 ? "#FFF" : "#8A7B7E", fontSize: 11, fontWeight: "800" }}>{"ABC"[i]}</ThemedText>
              </View>
              <ThemedText style={{ color: R.ink, fontSize: 13, fontWeight: "600", marginLeft: 8 }}>{o}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {kind === "campus" && (
        <View style={{ width: 262, gap: 10 }}>
          <View style={[paper, { flexDirection: "row", alignItems: "center", padding: 12 }]}>
            <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: R.red100, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="megaphone" size={18} color={R.red600} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <ThemedText style={{ color: R.ink, fontWeight: "800", fontSize: 13 }}>Exam timetable released</ThemedText>
              <ThemedText style={{ color: "#8A7B7E", fontSize: 11 }}>Examinations & Records · 3h ago</ThemedText>
            </View>
          </View>
          <View style={[paper, { flexDirection: "row", alignItems: "center", padding: 12 }]}>
            <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: R.goldSurface, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="document-text" size={18} color={R.goldDeep} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <ThemedText style={{ color: R.ink, fontWeight: "800", fontSize: 13 }}>Algorithms lecture notes</ThemedText>
              <ThemedText style={{ color: "#8A7B7E", fontSize: 11 }}>PDF · 48 pages</ThemedText>
            </View>
          </View>
          <View style={[paper, { flexDirection: "row", alignItems: "center", padding: 12 }]}>
            <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#E4EEFF", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="time" size={18} color="#2F6FDE" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <ThemedText style={{ color: R.ink, fontWeight: "800", fontSize: 13 }}>Database Systems · Lab B</ThemedText>
              <ThemedText style={{ color: "#8A7B7E", fontSize: 11 }}>Next class · 12:00 PM</ThemedText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default function OnboardingItem({ item }: { item: Slide }) {
  const theme = useTheme();
  return (
    <View style={{ width, paddingHorizontal: Spacing.four, paddingTop: Spacing.three }}>
      <Illustration kind={item.kind} />
      <View style={{ marginTop: Spacing.three }}>
        <ThemedText type="label" style={{ color: theme.accent }}>
          {item.eyebrow}
        </ThemedText>
        <ThemedText type="title" style={{ marginTop: Spacing.two }}>
          {item.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.three, lineHeight: 24 }}>
          {item.description}
        </ThemedText>
      </View>
    </View>
  );
}
