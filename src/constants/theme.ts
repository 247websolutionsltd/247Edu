/**
 * Cardinal design tokens.
 * Warm paper backgrounds, ink-black type and a confident crimson. Gold is used sparingly
 * for achievement (grades, streaks). Headlines are set in a serif for an editorial,
 * "report card" feel; everything else stays in the system sans.
 */
import '@/global.css';

import { Platform } from 'react-native';

const palette = {
  red950: '#2A0409',
  red900: '#4A0711',
  red800: '#74101F',
  red700: '#9E1329',
  red600: '#C8102E',
  red500: '#E02B45',
  red300: '#F4A1AC',
  red100: '#FCE3E6',
  red50: '#FFF3F4',
  gold: '#F2B632',
  goldDeep: '#B7820A',
  goldSurface: '#FFF4D6',
  ink: '#1C1315',
  paper: '#FBF7F3',
  white: '#FFFFFF',
  green: '#1F8A5B',
  blue: '#2F6FDE',
} as const;

export const Colors = {
  // Brand constants (theme independent)
  primary: palette.red600,
  primaryDark: palette.red800,
  primaryTint: palette.red100,
  gold: palette.gold,
  palette,

  // Hero (masthead) surfaces stay crimson in both modes
  hero: palette.red600,
  heroDeep: palette.red800,
  heroGlow: palette.red500,
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.74)',
  heroChip: 'rgba(255,255,255,0.16)',

  light: {
    text: palette.ink,
    textSecondary: '#6E5F62',
    background: palette.paper,
    paper: palette.paper,
    card: '#FFFFFF',
    cardAlt: '#F5EEE8',
    backgroundElement: '#F5EEE8',
    backgroundSelected: '#EADFD6',
    line: '#E9DFD8',
    tint: palette.red100,
    inkSoft: '#A39598',
    accent: palette.red600,
    accentSurface: palette.red50,
    accentText: palette.red700,
    cta: palette.red600,
    ctaText: '#FFFFFF',
    controlOff: '#D9CCC6',
    controlThumb: '#FFFFFF',
    danger: '#C8102E',
    success: palette.green,
    warning: palette.goldDeep,
    info: palette.blue,
    gold: palette.gold,
    goldSurface: palette.goldSurface,
    overlay: 'rgba(28,19,21,0.5)',
  },
  dark: {
    text: '#F7EEEE',
    textSecondary: '#B3A0A3',
    background: '#150B0D',
    paper: '#150B0D',
    card: '#201316',
    cardAlt: '#2A1A1E',
    backgroundElement: '#2A1A1E',
    backgroundSelected: '#3A2429',
    line: '#35232A',
    tint: '#3A1219',
    inkSoft: '#7D6A6E',
    accent: '#FF5A70',
    accentSurface: '#321017',
    accentText: '#FF8D9C',
    cta: palette.red600,
    ctaText: '#FFFFFF',
    controlOff: '#4A353B',
    controlThumb: '#FFFFFF',
    danger: '#FF6B7D',
    success: '#4ADE9A',
    warning: '#F2B632',
    info: '#7AA7FF',
    gold: palette.gold,
    goldSurface: '#3A2E10',
    overlay: 'rgba(0,0,0,0.65)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type AppColors = typeof Colors.light | typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
}) as { sans: string; serif: string; rounded: string; mono: string };

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Squarer than a typical "friendly" app on purpose: this is a school, not a bank. */
export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

export const MaxContentWidth = 800;

/** Height of the docked tab bar (excluding the safe-area inset). */
export const TabBarHeight = 64;
/** Bottom padding tab screens need so content clears the tab bar. */
export const TabBarSpace = 40;
