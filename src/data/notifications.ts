import { IconName } from "./categories";

export type NotificationType = "Transactions" | "Security" | "Offers";

export type AppNotification = {
  id: string;
  title: string;
  desc: string;
  detail: string;
  icon: IconName;
  type: NotificationType;
  time: string;
  unread: boolean;
  action?: { label: string; route: string };
};

export const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Salary received",
    desc: "₦450,000.00 landed in your wallet.",
    detail:
      "Your monthly salary from Brightpath Ltd has been credited to your Verdi wallet. Tap below to see it in your activity.",
    icon: "arrow-down-circle",
    type: "Transactions",
    time: "2h ago",
    unread: true,
    action: { label: "View activity", route: "/activity" },
  },
  {
    id: "n2",
    title: "New sign-in detected",
    desc: "Pixel 8 · Lagos, Nigeria",
    detail:
      "We noticed a sign-in to your account from a new device. If this was you, no action is needed. If not, change your password right away.",
    icon: "shield-checkmark",
    type: "Security",
    time: "5h ago",
    unread: true,
    action: { label: "Review security", route: "/account/security" },
  },
  {
    id: "n3",
    title: "You're 68% to your goal",
    desc: "Dream Vacation is looking great.",
    detail:
      "You've saved ₦306,000 of ₦450,000 for Dream Vacation. Add a little each week and you'll get there ahead of schedule.",
    icon: "leaf",
    type: "Offers",
    time: "Yesterday",
    unread: false,
    action: { label: "Open savings", route: "/(tabs)/save" },
  },
  {
    id: "n4",
    title: "Earn ₦2,000 per friend",
    desc: "Invite friends and both of you win.",
    detail:
      "Share your referral code. When a friend signs up and funds their wallet, you both get ₦2,000 straight into your balance.",
    icon: "gift",
    type: "Offers",
    time: "Yesterday",
    unread: false,
    action: { label: "Invite friends", route: "/refer" },
  },
  {
    id: "n5",
    title: "Virtual card is ready",
    desc: "Start spending online in seconds.",
    detail:
      "Your naira virtual card is active. Use it for online shopping, subscriptions and in-app purchases. You can freeze it any time.",
    icon: "card",
    type: "Transactions",
    time: "2 days ago",
    unread: false,
    action: { label: "View card", route: "/(tabs)/cards" },
  },
];
