/**
 * Single source of truth for the brand. Rename the school/app here and every screen follows.
 */
export const Brand = {
  name: "Cardinal",
  fullName: "Cardinal Student Portal",
  school: "Cardinal Academy",
  tagline: "Learn. Track. Excel.",
  supportEmail: "help@cardinal.edu",
  supportPhone: "+234 800 227 3462",
  /** The academic session shown across the app. */
  session: "2025/2026",
  semester: "1st Semester",
  /** Highest possible grade point (used for GPA maths and display). */
  gpaScale: 5,
} as const;
