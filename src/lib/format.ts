import { Brand } from "@/constants/brand";

const group = (n: number) => Math.floor(Math.abs(n)).toLocaleString("en-NG");

/** ₦12,345.60 */
export function formatMoney(value: number, opts: { decimals?: boolean; sign?: boolean } = {}) {
  const { decimals = true, sign = false } = opts;
  const abs = Math.abs(value);
  const kobo = Math.round((abs - Math.floor(abs)) * 100)
    .toString()
    .padStart(2, "0");
  const body = `${Brand.currency}${group(abs)}${decimals ? "." + kobo : ""}`;
  if (!sign) return value < 0 ? `-${body}` : body;
  return value < 0 ? `-${body}` : `+${body}`;
}

/** Splits an amount for the "big number, small kobo" display. */
export function splitMoney(value: number) {
  const abs = Math.abs(value);
  const kobo = Math.round((abs - Math.floor(abs)) * 100)
    .toString()
    .padStart(2, "0");
  return { whole: group(value), kobo };
}

/** 1.2M / 45K style shorthand. */
export function compactMoney(value: number) {
  const abs = Math.abs(value);
  const fmt = (n: number, s: string) => `${Brand.currency}${n.toFixed(1).replace(/\.0$/, "")}${s}`;
  if (abs >= 1_000_000) return fmt(value / 1_000_000, "M");
  if (abs >= 1_000) return fmt(value / 1_000, "K");
  return `${Brand.currency}${Math.round(value)}`;
}

export function parseAmount(text: string) {
  const n = Number(String(text).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Formats as the user types: "12500" -> "12,500" */
export function groupDigits(text: string) {
  const clean = text.replace(/[^0-9.]/g, "");
  const [whole, dec] = clean.split(".");
  const grouped = (whole || "").replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${grouped || "0"}.${dec.slice(0, 2)}` : grouped;
}

const DAY = 86_400_000;
const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dayLabel(ts: number, now = Date.now()) {
  const diff = Math.round((startOfDay(now) - startOfDay(ts)) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function fullDate(ts: number) {
  return `${new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · ${timeLabel(ts)}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const maskAccount = (acc: string) => (acc.length > 4 ? `••••${acc.slice(-4)}` : acc);
