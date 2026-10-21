import type { IconName } from "./icons";

export type AnnouncementCategory = "Academics" | "Exams" | "Events" | "Finance" | "General";

export type Announcement = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: AnnouncementCategory;
  /** who posted it */
  from: string;
  /** hours ago, resolved to a timestamp at load so the demo always feels fresh */
  ts: number;
  pinned?: boolean;
  action?: { label: string; route: string };
};

const HOUR = 3_600_000;
const ago = (h: number) => Date.now() - h * HOUR;

export const categoryMeta: Record<AnnouncementCategory, { icon: IconName; color: string }> = {
  Academics: { icon: "school", color: "#C8102E" },
  Exams: { icon: "create", color: "#B7820A" },
  Events: { icon: "calendar", color: "#2F6FDE" },
  Finance: { icon: "wallet", color: "#1F8A5B" },
  General: { icon: "megaphone", color: "#7A5CC8" },
};

export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "First-semester examination timetable released",
    summary: "Exams begin Monday 8 December. Check your venue and seat number.",
    body:
      "The Examinations & Records office has published the timetable for the 2025/2026 first-semester examinations.\n\nExams run from Monday 8 December to Friday 19 December. Papers hold in two sittings: 9:00 AM and 1:00 PM. Please arrive at least 30 minutes early with your student ID card; no ID, no entry.\n\nSeat numbers and venues will be pinned on departmental boards one week before the first paper. Report any clash to your course adviser before Friday.",
    category: "Exams",
    from: "Examinations & Records",
    ts: ago(3),
    pinned: true,
    action: { label: "View timetable", route: "/timetable" },
  },
  {
    id: "a2",
    title: "Online test window opens for CSC 301 & CSC 305",
    summary: "Two computer-based tests are now live in the Tests tab.",
    body:
      "Computer-based continuous assessment tests for CSC 301 (Algorithms) and CSC 305 (Database Systems) are now open.\n\nEach test is timed and can only be attempted once. Make sure you have stable data or Wi-Fi before you begin. The test submits automatically when the timer ends.",
    category: "Academics",
    from: "Dept. of Computer Science",
    ts: ago(20),
    action: { label: "Go to tests", route: "/(tabs)/tests" },
  },
  {
    id: "a3",
    title: "Tuition second instalment deadline: 14 November",
    summary: "Clear your balance to keep access to exams and results.",
    body:
      "Students who have not completed their second tuition instalment are reminded that the deadline is Friday 14 November.\n\nOutstanding balances after this date will block exam clearance. Payments can be made at any partner bank or via the school's payment page. Keep your receipt and upload it at the Bursary if your payment doesn't reflect within 48 hours.",
    category: "Finance",
    from: "Bursary",
    ts: ago(30),
    pinned: true,
  },
  {
    id: "a4",
    title: "Career fair & alumni mixer",
    summary: "Meet 25+ employers on campus this Saturday, 10 AM at the Main Hall.",
    body:
      "Join us for the annual Cardinal Career Fair. Over 25 employers and 40 alumni will be on campus offering internships, graduate roles and mentorship.\n\nBring printed copies of your CV and dress smartly. Final-year students get priority interview slots; sign up at the Careers desk.",
    category: "Events",
    from: "Student Affairs",
    ts: ago(52),
  },
  {
    id: "a5",
    title: "Library extends opening hours during exams",
    summary: "The main library will open 7 AM – 11 PM from 1 December.",
    body:
      "To support exam preparation, the main library and the e-library lab will stay open from 7:00 AM to 11:00 PM Monday to Saturday, starting 1 December.\n\nGroup study rooms can be booked at the front desk. Please keep noise low and clear your desk when you leave.",
    category: "General",
    from: "University Library",
    ts: ago(78),
  },
  {
    id: "a6",
    title: "Course registration correction window",
    summary: "Add or drop courses until Friday; no changes after.",
    body:
      "The course registration correction window closes this Friday at 5:00 PM. If you registered for a course in error, or missed one, see your course adviser to add or drop it.\n\nStudents carrying more than 24 units need written approval from the Dean.",
    category: "Academics",
    from: "Registry",
    ts: ago(110),
  },
  {
    id: "a7",
    title: "Inter-faculty sports week",
    summary: "Football, volleyball, athletics and chess. Register your team by Thursday.",
    body:
      "Sports week is back! Register your faculty team with the Sports Director by Thursday. Events include football, volleyball, 100m & 4×100m relays, table tennis and chess.\n\nOpening ceremony is Monday at 4:00 PM at the Sports Complex.",
    category: "Events",
    from: "Sports Directorate",
    ts: ago(150),
  },
  {
    id: "a8",
    title: "Reminder: wear your ID card on campus",
    summary: "Security will begin checking IDs at all gates from Monday.",
    body:
      "For everyone's safety, all students must display a valid ID card at campus gates, in lecture halls and in the library. Lost your card? Request a replacement at the Student Affairs office with a copy of your admission letter.",
    category: "General",
    from: "Student Affairs",
    ts: ago(190),
  },
];

export const announcementCategories: ("All" | AnnouncementCategory)[] = ["All", "Academics", "Exams", "Events", "Finance", "General"];

export const findAnnouncement = (id?: string) => announcements.find((a) => a.id === id);
