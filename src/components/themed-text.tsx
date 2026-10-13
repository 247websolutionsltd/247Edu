import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
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
    | 'amount';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  display: { fontSize: 40, lineHeight: 44, fontWeight: '800', letterSpacing: -1.2 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4 },
  large: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.6 },
  big: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  bold: { fontSize: 17, lineHeight: 22, fontWeight: '700' },
  mid: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' },
  amount: { fontSize: 16, lineHeight: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
