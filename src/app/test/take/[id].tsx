import Button from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { EmptyState, ProgressBar } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { Attempt, usePortal } from "@/context/PortalContext";
import { findTest } from "@/data/tests";
import { useTheme } from "@/hooks/use-theme";
import { clock } from "@/lib/format";
import { goReplace } from "@/lib/nav";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, BackHandler, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TakeTest() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { saveAttempt, attempts } = usePortal();
  const test = findTest(id);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => (test ? test.questions.map(() => -1) : []));
  const [left, setLeft] = useState(test ? test.durationMin * 60 : 0);
  const submitted = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const startedAt = useRef(Date.now());

  const submit = useCallback(() => {
    if (!test || submitted.current) return;
    submitted.current = true;
    const final = answersRef.current;
    const score = final.reduce((s, a, i) => (a === test.questions[i].answer ? s + 1 : s), 0);
    const total = test.questions.length;
    const percent = (score / total) * 100;
    const attempt: Attempt = {
      testId: test.id,
      answers: final,
      score,
      total,
      percent,
      passed: percent >= test.passMark,
      durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      ts: Date.now(),
    };
    saveAttempt(attempt);
    goReplace(`/test/result/${test.id}`);
  }, [test, saveAttempt]);

  // countdown
  useEffect(() => {
    if (!test) return;
    const timer = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test]);

  useEffect(() => {
    if (test && left === 0) submit();
  }, [left, test, submit]);

  const confirmExit = useCallback(() => {
    Alert.alert("Leave this test?", "Your attempt will be lost and the test stays available to take again.", [
      { text: "Keep going", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: () => (router.canGoBack() ? router.back() : goReplace("/(tabs)/tests")) },
    ]);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmExit();
      return true;
    });
    return () => sub.remove();
  }, [confirmExit]);

  if (!test || attempts[test.id]) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <EmptyState icon="help-circle" title={test ? "Already submitted" : "Test not found"} />
        <View style={{ paddingHorizontal: Spacing.four }}>
          <Button title="Back to tests" onPress={() => goReplace("/(tabs)/tests")} />
        </View>
      </SafeAreaView>
    );
  }

  const q = test.questions[index];
  const total = test.questions.length;
  const answered = answers.filter((a) => a >= 0).length;
  const last = index === total - 1;
  const urgent = left <= 60;

  const pick = (opt: number) => setAnswers((prev) => prev.map((a, i) => (i === index ? opt : a)));

  const finish = () => {
    const missing = total - answered;
    Alert.alert(
      "Submit test?",
      missing > 0 ? `You have ${missing} unanswered question${missing > 1 ? "s" : ""}. You can't change answers after submitting.` : "You can't change your answers after submitting.",
      [
        { text: "Review", style: "cancel" },
        { text: "Submit", onPress: submit },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "bottom"]}>
      {/* top bar */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, gap: Spacing.three }}>
        <TouchableOpacity onPress={confirmExit} accessibilityLabel="Leave test" style={{ width: 44, height: 44, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card }}>
          <Ionicons name="close" size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={{ fontWeight: "700" }}>
            {test.courseCode} · {test.title}
          </ThemedText>
          <ThemedText type="smallBold">
            Question {index + 1} of {total}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 40, borderRadius: Radius.sm, backgroundColor: urgent ? theme.danger : theme.text }}>
          <Ionicons name="time" size={15} color={urgent ? "#FFF" : theme.background} />
          <ThemedText style={{ color: urgent ? "#FFF" : theme.background, fontWeight: "900", marginLeft: 6, fontVariant: ["tabular-nums"] }}>{clock(left)}</ThemedText>
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.three }}>
        <ProgressBar value={answered / total} height={6} />
      </View>

      {/* question navigator */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingVertical: Spacing.three, gap: Spacing.two }}>
        {test.questions.map((_, i) => {
          const on = i === index;
          const has = answers[i] >= 0;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setIndex(i)}
              accessibilityLabel={`Question ${i + 1}${has ? ", answered" : ""}`}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: on ? theme.accent : has ? theme.accentText : theme.line,
                backgroundColor: on ? theme.accent : has ? theme.accentSurface : theme.card,
              }}
            >
              <ThemedText type="smallBold" style={{ color: on ? "#FFF" : has ? theme.accentText : theme.textSecondary }}>
                {i + 1}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingBottom: Spacing.four }} showsVerticalScrollIndicator={false}>
        <ThemedText type="subtitle" style={{ lineHeight: 30 }}>
          {q.text}
        </ThemedText>

        <View style={{ gap: Spacing.three - 2, marginTop: Spacing.four }}>
          {q.options.map((opt, i) => {
            const on = answers[index] === i;
            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.85}
                onPress={() => pick(i)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: Spacing.three,
                  borderRadius: Radius.md,
                  borderWidth: 2,
                  borderColor: on ? theme.accent : theme.line,
                  backgroundColor: on ? theme.accentSurface : theme.card,
                }}
              >
                <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: on ? theme.accent : theme.cardAlt, alignItems: "center", justifyContent: "center" }}>
                  <ThemedText style={{ color: on ? "#FFF" : theme.textSecondary, fontWeight: "900" }}>{"ABCDEF"[i]}</ThemedText>
                </View>
                <ThemedText type="mid" style={{ flex: 1, marginLeft: Spacing.three, fontWeight: on ? "700" : "500" }}>
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* footer */}
      <View style={{ flexDirection: "row", gap: Spacing.three, paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.two, borderTopWidth: 1, borderTopColor: theme.line, backgroundColor: theme.card }}>
        <Button title="Back" variant="secondary" iconLeft="arrow-back" onPress={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} style={{ flex: 1 }} />
        {last ? (
          <Button title="Submit" icon="checkmark" onPress={finish} style={{ flex: 1.4 }} />
        ) : (
          <Button title="Next" icon="arrow-forward" onPress={() => setIndex((i) => Math.min(total - 1, i + 1))} style={{ flex: 1.4 }} />
        )}
      </View>
    </SafeAreaView>
  );
}
