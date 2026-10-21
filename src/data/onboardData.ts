export type Slide = {
  id: string;
  kind: "results" | "tests" | "campus";
  eyebrow: string;
  title: string;
  description: string;
};

export const onboardingData: Slide[] = [
  {
    id: "1",
    kind: "results",
    eyebrow: "RESULTS",
    title: "Your scores, the moment they're out",
    description: "See every course, your CA and exam marks, your GPA each semester and your cumulative standing in one place.",
  },
  {
    id: "2",
    kind: "tests",
    eyebrow: "TESTS",
    title: "Take timed tests from your phone",
    description: "Sit computer-based quizzes with a live countdown, get instant marking and review the answers you missed.",
  },
  {
    id: "3",
    kind: "campus",
    eyebrow: "CAMPUS",
    title: "Notes, notices and your timetable",
    description: "Download lecture materials, get official announcements first, and always know what class is next.",
  },
];
