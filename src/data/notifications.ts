import { IconName } from "./categories";

export type NotificationType = "Transactions" | "Security" | "Offers";

export type AppNotification = {
  id: string;
  title: string;
  desc: string;
  detail: string;
  icon: IconName;
  type: NotificationType;
  ts: number;
  unread: boolean;
  action?: { label: string; route: string };
};

/** Fields written to Firestore (id comes from the document). */
export type NewNotification = Omit<AppNotification, "id" | "ts" | "unread">;

export const welcomeNotifications = (firstName?: string): NewNotification[] => [
  {
    title: firstName ? `Welcome to Verdi, ${firstName}` : "Welcome to Verdi",
    desc: "Add money to your wallet to get started.",
    detail:
      "Your wallet is ready. Add money by bank transfer, then send it, pay bills or start saving toward a goal.",
    icon: "sparkles",
    type: "Offers",
    action: { label: "Add money", route: "/add-money/bank" },
  },
  {
    title: "Earn ₦2,000 per friend",
    desc: "Invite friends and both of you win.",
    detail:
      "Share your referral code. When a friend signs up and funds their wallet, you both get ₦2,000 straight into your balance.",
    icon: "gift",
    type: "Offers",
    action: { label: "Invite friends", route: "/refer" },
  },
];
