import type { IconName } from "./icons";

export type MaterialType = "PDF" | "Slides" | "Video" | "Link" | "Audio";

export type Material = {
  id: string;
  title: string;
  courseCode: string;
  course: string;
  type: MaterialType;
  /** pages / slides / minutes depending on type */
  length: string;
  size?: string;
  author: string;
  description: string;
  /** Swap these for your school's own hosted files. */
  url: string;
  week: number;
};

export const typeMeta: Record<MaterialType, { icon: IconName; color: string; bg: string }> = {
  PDF: { icon: "document-text", color: "#C8102E", bg: "#FCE3E6" },
  Slides: { icon: "easel", color: "#B7820A", bg: "#FFF4D6" },
  Video: { icon: "play-circle", color: "#7A5CC8", bg: "#EFE9FB" },
  Link: { icon: "link", color: "#2F6FDE", bg: "#E4EEFF" },
  Audio: { icon: "headset", color: "#1F8A5B", bg: "#DFF5EA" },
};

export const materialTypes: ("All" | MaterialType)[] = ["All", "PDF", "Slides", "Video", "Link", "Audio"];

export const materials: Material[] = [
  {
    id: "m1",
    title: "Introduction to Algorithms: lecture notes",
    courseCode: "CSC 301",
    course: "Algorithms & Complexity",
    type: "PDF",
    length: "48 pages",
    size: "3.2 MB",
    author: "Prof. N. Bello",
    description: "Asymptotic notation, recurrences, divide-and-conquer and an introduction to dynamic programming with worked examples.",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    week: 4,
  },
  {
    id: "m2",
    title: "Sorting algorithms visual walkthrough",
    courseCode: "CSC 301",
    course: "Algorithms & Complexity",
    type: "Slides",
    length: "36 slides",
    size: "5.8 MB",
    author: "Prof. N. Bello",
    description: "Step-by-step slides on bubble, insertion, merge, quick and heap sort, with complexity comparisons.",
    url: "https://visualgo.net/en/sorting",
    week: 5,
  },
  {
    id: "m3",
    title: "CS50: Algorithms (lecture)",
    courseCode: "CSC 301",
    course: "Algorithms & Complexity",
    type: "Video",
    length: "1h 52m",
    author: "Harvard CS50",
    description: "A clear video lecture on searching, sorting and running time. Recommended before the next quiz.",
    url: "https://cs50.harvard.edu/x/",
    week: 5,
  },
  {
    id: "m4",
    title: "Relational model & SQL handbook",
    courseCode: "CSC 305",
    course: "Database Systems",
    type: "PDF",
    length: "62 pages",
    size: "4.1 MB",
    author: "Dr. S. Nwosu",
    description: "Keys, joins, aggregation, subqueries and a full normalisation walkthrough from 1NF to BCNF.",
    url: "https://www.w3schools.com/sql/",
    week: 3,
  },
  {
    id: "m5",
    title: "ER diagrams practice sheet",
    courseCode: "CSC 305",
    course: "Database Systems",
    type: "PDF",
    length: "8 pages",
    size: "0.9 MB",
    author: "Dr. S. Nwosu",
    description: "Twelve modelling problems with solutions at the end. Attempt before looking at the answers.",
    url: "https://www.lucidchart.com/pages/er-diagrams",
    week: 4,
  },
  {
    id: "m6",
    title: "Numerical methods: root-finding",
    courseCode: "MTH 301",
    course: "Numerical Analysis",
    type: "Slides",
    length: "28 slides",
    size: "2.4 MB",
    author: "Dr. A. Okafor",
    description: "Bisection, false position, Newton–Raphson and secant methods with convergence analysis.",
    url: "https://openstax.org/subjects/math",
    week: 3,
  },
  {
    id: "m7",
    title: "Khan Academy: Newton's method",
    courseCode: "MTH 301",
    course: "Numerical Analysis",
    type: "Link",
    length: "Interactive",
    author: "Khan Academy",
    description: "Interactive practice problems to build intuition for iterative root-finding.",
    url: "https://www.khanacademy.org/math/ap-calculus-ab",
    week: 3,
  },
  {
    id: "m8",
    title: "Processes, threads & scheduling",
    courseCode: "CSC 303",
    course: "Operating Systems",
    type: "PDF",
    length: "54 pages",
    size: "3.7 MB",
    author: "Mr. D. Eze",
    description: "Process states, context switching, CPU scheduling algorithms and synchronisation primitives.",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    week: 2,
  },
  {
    id: "m9",
    title: "OS concepts: audio revision",
    courseCode: "CSC 303",
    course: "Operating Systems",
    type: "Audio",
    length: "34 min",
    size: "18 MB",
    author: "Mr. D. Eze",
    description: "A recorded revision session you can listen to on the go. Covers deadlocks and memory management.",
    url: "https://www.youtube.com/results?search_query=operating+systems+revision",
    week: 6,
  },
  {
    id: "m10",
    title: "Agile & software process models",
    courseCode: "CSC 307",
    course: "Software Engineering",
    type: "Slides",
    length: "40 slides",
    size: "6.0 MB",
    author: "Dr. S. Nwosu",
    description: "Waterfall vs agile, Scrum roles and ceremonies, and how to estimate and plan a sprint.",
    url: "https://www.atlassian.com/agile",
    week: 2,
  },
  {
    id: "m11",
    title: "Conflict resolution reader",
    courseCode: "GST 301",
    course: "Peace & Conflict Studies",
    type: "PDF",
    length: "30 pages",
    size: "1.6 MB",
    author: "Mrs. T. Lawal",
    description: "Key theories, case studies and negotiation frameworks used throughout the course.",
    url: "https://www.usip.org/publications",
    week: 1,
  },
];

export const findMaterial = (id?: string) => materials.find((m) => m.id === id);
