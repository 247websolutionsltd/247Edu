export type Slide = {
  id: string;
  kind: "save" | "spend" | "send";
  eyebrow: string;
  title: string;
  description: string;
};

export const onboardingData: Slide[] = [
  {
    id: "1",
    kind: "save",
    eyebrow: "SAVE",
    title: "Grow your money, one goal at a time",
    description: "Set goals, lock them if you need the discipline, and earn up to 14% a year on everything you put away.",
  },
  {
    id: "2",
    kind: "spend",
    eyebrow: "SPEND",
    title: "A card that works everywhere online",
    description: "Get an instant naira virtual card, pay bills and top up airtime, and freeze it in one tap if anything looks off.",
  },
  {
    id: "3",
    kind: "send",
    eyebrow: "TRANSFER",
    title: "Send money to anyone, instantly",
    description: "Move money to any Nigerian bank account in seconds, with low fees and clear receipts every time.",
  },
];
