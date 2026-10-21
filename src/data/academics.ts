import { Brand } from "@/constants/brand";

/* -------------------------------------------------------------------------- */
/* Results                                                                     */
/* -------------------------------------------------------------------------- */

export type Course = {
  id: string;
  code: string;
  title: string;
  units: number;
  /** continuous assessment, out of 30 */
  ca: number;
  /** exam, out of 70 */
  exam: number;
  lecturer: string;
};

export type Term = {
  id: string;
  session: string;
  semester: string;
  courses: Course[];
};

export type Grade = { letter: "A" | "B" | "C" | "D" | "E" | "F"; point: number; remark: string };

/** Standard 5-point scale. */
export function gradeFor(total: number): Grade {
  if (total >= 70) return { letter: "A", point: 5, remark: "Excellent" };
  if (total >= 60) return { letter: "B", point: 4, remark: "Very good" };
  if (total >= 50) return { letter: "C", point: 3, remark: "Good" };
  if (total >= 45) return { letter: "D", point: 2, remark: "Fair" };
  if (total >= 40) return { letter: "E", point: 1, remark: "Pass" };
  return { letter: "F", point: 0, remark: "Fail" };
}

export const courseTotal = (c: Course) => c.ca + c.exam;

export function termStats(term: Term) {
  const units = term.courses.reduce((s, c) => s + c.units, 0);
  const points = term.courses.reduce((s, c) => s + gradeFor(courseTotal(c)).point * c.units, 0);
  const average = term.courses.length ? term.courses.reduce((s, c) => s + courseTotal(c), 0) / term.courses.length : 0;
  return {
    units,
    points,
    gpa: units ? points / units : 0,
    average,
    passed: term.courses.filter((c) => courseTotal(c) >= 40).length,
  };
}

export function cumulativeGpa(terms: Term[]) {
  let units = 0;
  let points = 0;
  terms.forEach((t) => {
    const s = termStats(t);
    units += s.units;
    points += s.points;
  });
  return { units, gpa: units ? points / units : 0 };
}

export function classOfDegree(gpa: number) {
  if (gpa >= 4.5) return "First Class";
  if (gpa >= 3.5) return "Second Class Upper";
  if (gpa >= 2.4) return "Second Class Lower";
  if (gpa >= 1.5) return "Third Class";
  return "Pass";
}

export const terms: Term[] = [
  {
    id: "2425-1",
    session: "2024/2025",
    semester: "1st Semester",
    courses: [
      { id: "mth201", code: "MTH 201", title: "Linear Algebra I", units: 3, ca: 24, exam: 52, lecturer: "Dr. A. Okafor" },
      { id: "csc201", code: "CSC 201", title: "Computer Programming II", units: 4, ca: 27, exam: 58, lecturer: "Prof. N. Bello" },
      { id: "phy201", code: "PHY 201", title: "General Physics III", units: 3, ca: 19, exam: 41, lecturer: "Dr. E. Adeyemi" },
      { id: "gst201", code: "GST 201", title: "Entrepreneurship Studies", units: 2, ca: 25, exam: 55, lecturer: "Mrs. T. Lawal" },
      { id: "sta201", code: "STA 201", title: "Statistics for Scientists", units: 3, ca: 21, exam: 44, lecturer: "Dr. K. Musa" },
    ],
  },
  {
    id: "2425-2",
    session: "2024/2025",
    semester: "2nd Semester",
    courses: [
      { id: "mth202", code: "MTH 202", title: "Elementary Differential Equations", units: 3, ca: 22, exam: 47, lecturer: "Dr. A. Okafor" },
      { id: "csc202", code: "CSC 202", title: "Data Structures", units: 4, ca: 28, exam: 60, lecturer: "Prof. N. Bello" },
      { id: "csc204", code: "CSC 204", title: "Computer Architecture", units: 3, ca: 23, exam: 49, lecturer: "Mr. D. Eze" },
      { id: "eng202", code: "ENG 202", title: "Technical Communication", units: 2, ca: 26, exam: 51, lecturer: "Mrs. R. Ibrahim" },
      { id: "sta202", code: "STA 202", title: "Probability Theory", units: 3, ca: 18, exam: 38, lecturer: "Dr. K. Musa" },
    ],
  },
  {
    id: "2526-1",
    session: Brand.session,
    semester: Brand.semester,
    courses: [
      { id: "csc301", code: "CSC 301", title: "Algorithms & Complexity", units: 4, ca: 26, exam: 56, lecturer: "Prof. N. Bello" },
      { id: "csc303", code: "CSC 303", title: "Operating Systems", units: 3, ca: 24, exam: 50, lecturer: "Mr. D. Eze" },
      { id: "csc305", code: "CSC 305", title: "Database Systems", units: 3, ca: 27, exam: 61, lecturer: "Dr. S. Nwosu" },
      { id: "mth301", code: "MTH 301", title: "Numerical Analysis", units: 3, ca: 20, exam: 43, lecturer: "Dr. A. Okafor" },
      { id: "csc307", code: "CSC 307", title: "Software Engineering", units: 3, ca: 25, exam: 57, lecturer: "Dr. S. Nwosu" },
      { id: "gst301", code: "GST 301", title: "Peace & Conflict Studies", units: 2, ca: 23, exam: 48, lecturer: "Mrs. T. Lawal" },
    ],
  },
];

export const currentTerm = terms[terms.length - 1];

export const findCourse = (id?: string) => {
  for (const t of terms) {
    const c = t.courses.find((x) => x.id === id);
    if (c) return { course: c, term: t };
  }
  return undefined;
};

/* -------------------------------------------------------------------------- */
/* Timetable                                                                   */
/* -------------------------------------------------------------------------- */

export type ClassSlot = {
  id: string;
  /** 1 = Monday ... 5 = Friday */
  day: 1 | 2 | 3 | 4 | 5;
  start: string; // "08:00"
  end: string;
  code: string;
  title: string;
  venue: string;
  lecturer: string;
  kind: "Lecture" | "Lab" | "Tutorial";
};

export const timetable: ClassSlot[] = [
  { id: "t1", day: 1, start: "08:00", end: "10:00", code: "CSC 301", title: "Algorithms & Complexity", venue: "LT 2", lecturer: "Prof. N. Bello", kind: "Lecture" },
  { id: "t2", day: 1, start: "12:00", end: "14:00", code: "CSC 305", title: "Database Systems", venue: "Lab B", lecturer: "Dr. S. Nwosu", kind: "Lab" },
  { id: "t3", day: 2, start: "09:00", end: "11:00", code: "MTH 301", title: "Numerical Analysis", venue: "LT 5", lecturer: "Dr. A. Okafor", kind: "Lecture" },
  { id: "t4", day: 2, start: "14:00", end: "16:00", code: "CSC 303", title: "Operating Systems", venue: "LT 2", lecturer: "Mr. D. Eze", kind: "Lecture" },
  { id: "t5", day: 3, start: "08:00", end: "09:00", code: "GST 301", title: "Peace & Conflict Studies", venue: "Main Hall", lecturer: "Mrs. T. Lawal", kind: "Lecture" },
  { id: "t6", day: 3, start: "10:00", end: "12:00", code: "CSC 307", title: "Software Engineering", venue: "LT 1", lecturer: "Dr. S. Nwosu", kind: "Lecture" },
  { id: "t7", day: 3, start: "15:00", end: "17:00", code: "CSC 305", title: "Database Systems", venue: "LT 4", lecturer: "Dr. S. Nwosu", kind: "Tutorial" },
  { id: "t8", day: 4, start: "09:00", end: "11:00", code: "CSC 301", title: "Algorithms & Complexity", venue: "Lab A", lecturer: "Prof. N. Bello", kind: "Lab" },
  { id: "t9", day: 4, start: "13:00", end: "15:00", code: "CSC 303", title: "Operating Systems", venue: "Lab C", lecturer: "Mr. D. Eze", kind: "Lab" },
  { id: "t10", day: 5, start: "08:00", end: "10:00", code: "MTH 301", title: "Numerical Analysis", venue: "LT 5", lecturer: "Dr. A. Okafor", kind: "Tutorial" },
  { id: "t11", day: 5, start: "11:00", end: "13:00", code: "CSC 307", title: "Software Engineering", venue: "Lab B", lecturer: "Dr. S. Nwosu", kind: "Lab" },
];

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const slotsForDay = (day: number) => timetable.filter((s) => s.day === day).sort((a, b) => a.start.localeCompare(b.start));

export const to12h = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
};
