export type Question = {
  id: string;
  text: string;
  options: string[];
  /** index into options */
  answer: number;
  explanation: string;
};

export type TestDef = {
  id: string;
  courseCode: string;
  course: string;
  title: string;
  durationMin: number;
  /** pass mark as a percentage */
  passMark: number;
  instructions: string;
  /** days from "now" the test closes (kept relative so the demo never goes stale) */
  closesInDays: number;
  questions: Question[];
};

export const tests: TestDef[] = [
  {
    id: "csc301-quiz2",
    courseCode: "CSC 301",
    course: "Algorithms & Complexity",
    title: "Quiz 2: Sorting & Big-O",
    durationMin: 8,
    passMark: 50,
    closesInDays: 3,
    instructions: "Answer every question. Pick the single best option. You can move back and forth before you submit.",
    questions: [
      {
        id: "q1",
        text: "What is the worst-case time complexity of binary search on a sorted array of n items?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        explanation: "Each comparison halves the search space, so at most log₂ n steps are needed.",
      },
      {
        id: "q2",
        text: "Which sorting algorithm has O(n log n) worst-case time and is not in-place by default?",
        options: ["Quick sort", "Bubble sort", "Merge sort", "Insertion sort"],
        answer: 2,
        explanation: "Merge sort always runs in O(n log n) but needs O(n) extra space to merge.",
      },
      {
        id: "q3",
        text: "Quick sort degrades to O(n²) most commonly when…",
        options: [
          "the pivot is always the median",
          "the input is already sorted and the first element is the pivot",
          "the array has fewer than 10 items",
          "all items are random",
        ],
        answer: 1,
        explanation: "A bad pivot choice on sorted input produces maximally unbalanced partitions.",
      },
      {
        id: "q4",
        text: "Which notation describes an upper bound on growth rate?",
        options: ["Big-O", "Big-Omega", "Big-Theta", "Little-omega"],
        answer: 0,
        explanation: "Big-O gives an asymptotic upper bound; Omega is a lower bound; Theta is both.",
      },
      {
        id: "q5",
        text: "Which of these sorts is stable?",
        options: ["Heap sort", "Selection sort", "Merge sort", "Quick sort (typical)"],
        answer: 2,
        explanation: "Merge sort preserves the relative order of equal keys when merging carefully.",
      },
      {
        id: "q6",
        text: "The recurrence T(n) = 2T(n/2) + n solves to…",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        answer: 1,
        explanation: "By the Master Theorem (case 2), a = 2, b = 2, f(n) = n gives Θ(n log n).",
      },
    ],
  },
  {
    id: "csc305-sql",
    courseCode: "CSC 305",
    course: "Database Systems",
    title: "SQL & Normalisation Test",
    durationMin: 10,
    passMark: 50,
    closesInDays: 6,
    instructions: "This test covers SQL basics and normal forms. Choose the best answer for each question.",
    questions: [
      {
        id: "q1",
        text: "Which SQL clause filters rows AFTER grouping?",
        options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
        answer: 1,
        explanation: "HAVING filters groups produced by GROUP BY; WHERE filters individual rows before grouping.",
      },
      {
        id: "q2",
        text: "A table is in 3NF when it is in 2NF and…",
        options: [
          "has no repeating groups",
          "has no partial dependencies",
          "has no transitive dependencies on the primary key",
          "has only one column",
        ],
        answer: 2,
        explanation: "Third normal form removes transitive dependencies of non-key attributes on the key.",
      },
      {
        id: "q3",
        text: "Which JOIN returns all rows from the left table even when there is no match on the right?",
        options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"],
        answer: 1,
        explanation: "LEFT JOIN keeps every left row and fills right-side columns with NULL when unmatched.",
      },
      {
        id: "q4",
        text: "A foreign key is used to…",
        options: [
          "speed up all queries",
          "uniquely identify a row in its own table",
          "link a row to a row in another table",
          "encrypt a column",
        ],
        answer: 2,
        explanation: "A foreign key references the primary key of another table to enforce referential integrity.",
      },
      {
        id: "q5",
        text: "Which property of ACID means a transaction is all-or-nothing?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        answer: 0,
        explanation: "Atomicity guarantees that either every step of a transaction applies or none do.",
      },
    ],
  },
  {
    id: "mth301-numerical",
    courseCode: "MTH 301",
    course: "Numerical Analysis",
    title: "Root-finding Methods",
    durationMin: 6,
    passMark: 50,
    closesInDays: 9,
    instructions: "Short conceptual test on root-finding. No calculators needed.",
    questions: [
      {
        id: "q1",
        text: "The bisection method requires that f(a) and f(b)…",
        options: ["are both positive", "have opposite signs", "are both zero", "are equal"],
        answer: 1,
        explanation: "Opposite signs guarantee (by the Intermediate Value Theorem) a root in [a, b].",
      },
      {
        id: "q2",
        text: "Newton–Raphson uses which iteration formula?",
        options: ["xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)", "xₙ₊₁ = (a+b)/2", "xₙ₊₁ = xₙ + f(xₙ)", "xₙ₊₁ = f′(xₙ)/f(xₙ)"],
        answer: 0,
        explanation: "It follows the tangent line at xₙ to where it crosses the x-axis.",
      },
      {
        id: "q3",
        text: "Which method typically converges fastest near a simple root?",
        options: ["Bisection", "False position", "Newton–Raphson", "Fixed-point (slowly convergent)"],
        answer: 2,
        explanation: "Newton–Raphson converges quadratically near a simple root.",
      },
      {
        id: "q4",
        text: "After 10 bisection steps on an interval of length 1, the interval length is…",
        options: ["1/10", "1/100", "1/1024", "1/2048"],
        answer: 2,
        explanation: "Each step halves the interval: 1 / 2¹⁰ = 1/1024.",
      },
    ],
  },
  {
    id: "csc303-os",
    courseCode: "CSC 303",
    course: "Operating Systems",
    title: "Processes & Scheduling",
    durationMin: 8,
    passMark: 50,
    closesInDays: 12,
    instructions: "Pick the best answer. The test auto-submits when the timer reaches zero.",
    questions: [
      {
        id: "q1",
        text: "Which scheduling algorithm can cause starvation of long processes?",
        options: ["Round robin", "Shortest job first", "FCFS", "Multilevel feedback with ageing"],
        answer: 1,
        explanation: "SJF keeps favouring short jobs, so a long job may wait indefinitely.",
      },
      {
        id: "q2",
        text: "A process waiting for I/O to complete is in which state?",
        options: ["Running", "Ready", "Blocked / waiting", "Terminated"],
        answer: 2,
        explanation: "It cannot run until the I/O event finishes, so it sits in the waiting state.",
      },
      {
        id: "q3",
        text: "Which of these is NOT shared between threads of the same process?",
        options: ["Heap memory", "Open files", "Stack", "Global variables"],
        answer: 2,
        explanation: "Each thread has its own stack; heap, files and globals are shared.",
      },
      {
        id: "q4",
        text: "A deadlock requires all of these EXCEPT…",
        options: ["Mutual exclusion", "Hold and wait", "Pre-emption", "Circular wait"],
        answer: 2,
        explanation: "Deadlock needs NO pre-emption (resources can't be forcibly taken), not pre-emption.",
      },
      {
        id: "q5",
        text: "Round robin scheduling is defined by a fixed…",
        options: ["priority", "time quantum", "burst length", "memory size"],
        answer: 1,
        explanation: "Each process gets the CPU for at most one time quantum before going to the back of the queue.",
      },
    ],
  },
  {
    id: "gst301-peace",
    courseCode: "GST 301",
    course: "Peace & Conflict Studies",
    title: "Conflict Resolution Basics",
    durationMin: 5,
    passMark: 50,
    closesInDays: 15,
    instructions: "A quick check of the first four lectures.",
    questions: [
      {
        id: "q1",
        text: "Mediation is best described as…",
        options: [
          "a binding decision by a judge",
          "a neutral third party helping disputants reach their own agreement",
          "one side forcing the other to concede",
          "avoiding the conflict entirely",
        ],
        answer: 1,
        explanation: "The mediator facilitates; the parties keep control of the outcome.",
      },
      {
        id: "q2",
        text: "“Positive peace” refers to…",
        options: [
          "the absence of war only",
          "the presence of justice and equity alongside the absence of violence",
          "military strength",
          "silence about disagreements",
        ],
        answer: 1,
        explanation: "Galtung's positive peace includes structural conditions such as justice and inclusion.",
      },
      {
        id: "q3",
        text: "Which is a key principle of interest-based negotiation?",
        options: ["Focus on positions", "Separate people from the problem", "Win at all costs", "Avoid compromise"],
        answer: 1,
        explanation: "Separating people from the problem is a core principle from 'Getting to Yes'.",
      },
    ],
  },
];

export const findTest = (id?: string) => tests.find((t) => t.id === id);
