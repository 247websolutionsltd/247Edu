import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'display'
    | 'title'
    | 'subtitle'
    | 'large'
    | 'big'
    | 'bold'
    | 'mid'
    | 'small'
    | 'smallBold'
    | 'caption'
    | 'label'
    | 'stat';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

/** Headlines and big numbers are serif; body copy stays sans. */
const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  display: { fontFamily: Fonts.mono, fontSize: 38, lineHeight: 44, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontFamily: Fonts.mono, fontSize: 29, lineHeight: 36, fontWeight: '800', letterSpacing: -0.9 },
  subtitle: { fontFamily: Fonts.mono, fontSize: 22, lineHeight: 28, fontWeight: '700' },
  large: { fontFamily: Fonts.mono, fontSize: 26, lineHeight: 32, fontWeight: '800', letterSpacing: -0.3 },
  big: { fontFamily: Fonts.mono, fontSize: 20, lineHeight: 26, fontWeight: '700' },
  bold: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  mid: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  stat: { fontFamily: Fonts.mono, fontSize: 34, lineHeight: 38, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
