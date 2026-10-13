import { Colors } from '@/constants/theme';
import { AppThemeProvider, AuthProvider, useAppTheme } from '@/context/PageContext';
import { WalletProvider } from '@/context/WalletContext';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'react-native';

function Shell() {
  const { themeMode } = useAppTheme();
  const c = Colors[themeMode];
  const base = themeMode === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: c.background,
      card: c.card,
      text: c.text,
      border: c.line,
      primary: c.accent,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
          animation: 'slide_from_right',
        }}
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    // Verdi is dark-first; users can switch to light in Profile > Appearance.
    <AppThemeProvider initialTheme="dark">
      <AuthProvider>
        <WalletProvider>
          <Shell />
        </WalletProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
