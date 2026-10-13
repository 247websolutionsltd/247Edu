/**
 * Verdi design tokens.
 * Dark-first: deep forest greens with a lime accent. A light mode is provided too,
 * where the "hero" surfaces (balance card, auth header) stay deep green for brand consistency.
 */
import '@/global.css';

import { Platform } from 'react-native';

const palette = {
  forest950: '#04120C',
  forest900: '#071A12',
  forest850: '#0A2218',
  forest800: '#0D2B1E',
  forest700: '#123A29',
  forest600: '#17482F',
  forest500: '#1E5C3E',
  forest400: '#2E7D57',
  mint300: '#9FD8B7',
  mint100: '#DDF3E5',
  lime: '#B9F55B',
  limeDeep: '#9BDD3B',
  white: '#FFFFFF',
  danger: '#FF6B6B',
  warning: '#FFC857',
  success: '#4ADE80',
} as const;

export const Colors = {
  // Brand constants (theme independent)
  primary: palette.forest500,
  primaryDark: palette.forest800,
  primaryTint: palette.mint100,
  lime: palette.lime,
  palette,

  // Hero surfaces stay green in both modes
  hero: palette.forest600,
  heroDeep: palette.forest700,
  heroGlow: palette.forest500,
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.68)',
  heroChip: 'rgba(255,255,255,0.12)',

  light: {
    text: '#0B1F16',
    textSecondary: '#5B7166',
    background: '#F2F6F3',
    paper: '#F2F6F3',
    card: '#FFFFFF',
    cardAlt: '#E7F0EA',
    backgroundElement: '#E7F0EA',
    backgroundSelected: '#D5E4DB',
    line: '#DCE7E0',
    tint: '#DDF3E5',
    inkSoft: '#8AA095',
    accent: '#0F6B45',
    accentSurface: '#E1F3E8',
    accentText: '#0B4A30',
    cta: '#0D3B27',
    ctaText: '#FFFFFF',
    controlOff: '#C9D6CE',
    controlThumb: '#FFFFFF',
    danger: '#D64545',
    success: '#1E9E5A',
    warning: '#C98A00',
    overlay: 'rgba(7,26,18,0.5)',
  },
  dark: {
    text: '#F1F7F3',
    textSecondary: '#8FAA9C',
    background: palette.forest950,
    paper: palette.forest950,
    card: palette.forest850,
    cardAlt: palette.forest800,
    backgroundElement: palette.forest800,
    backgroundSelected: palette.forest700,
    line: '#16352A',
    tint: palette.forest700,
    inkSoft: '#5E7C6D',
    accent: palette.lime,
    accentSurface: '#123324',
    accentText: palette.lime,
    cta: palette.lime,
    ctaText: palette.forest950,
    controlOff: '#2A4A3B',
    controlThumb: '#FFFFFF',
    danger: palette.danger,
    success: palette.success,
    warning: palette.warning,
    overlay: 'rgba(0,0,0,0.6)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type AppColors = typeof Colors.light | typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
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
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/** Bottom padding tab screens need so content clears the floating tab bar. */
export const TabBarSpace = 128;
