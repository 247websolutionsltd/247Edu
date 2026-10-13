import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export type Category =
  | "transfer"
  | "topup"
  | "salary"
  | "food"
  | "transport"
  | "bills"
  | "shopping"
  | "entertainment"
  | "savings"
  | "airtime";

export const categoryMeta: Record<Category, { label: string; icon: IconName; color: string }> = {
  transfer: { label: "Transfers", icon: "swap-horizontal", color: "#7DD3FC" },
  topup: { label: "Top-ups", icon: "add-circle", color: "#B9F55B" },
  salary: { label: "Income", icon: "cash", color: "#4ADE80" },
  food: { label: "Food & drinks", icon: "restaurant", color: "#FFC857" },
  transport: { label: "Transport", icon: "car", color: "#C4B5FD" },
  bills: { label: "Bills", icon: "flash", color: "#FDA4AF" },
  shopping: { label: "Shopping", icon: "bag-handle", color: "#F9A8D4" },
  entertainment: { label: "Fun", icon: "musical-notes", color: "#FDBA74" },
  savings: { label: "Savings", icon: "leaf", color: "#86EFAC" },
  airtime: { label: "Airtime & data", icon: "phone-portrait", color: "#67E8F9" },
};

export const goalIcons: IconName[] = [
  "airplane",
  "home",
  "car-sport",
  "laptop",
  "school",
  "gift",
  "heart",
  "shield-checkmark",
];
