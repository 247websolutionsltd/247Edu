import { Logo } from '@/components/brand';
import { ThemedText } from '@/components/themed-text';
import { HeroDecor } from '@/components/ui';
import { Brand } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/PageContext';
import { goReplace } from '@/lib/nav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { StatusBar, View } from 'react-native';

const MIN_SPLASH_MS = 900;
const MAX_WAIT_MS = 5000; // don't hang on the splash if the network is down

/** Branded splash. Routes to home (signed in), sign-in (returning) or onboarding (first launch). */
export default function Splash() {
  const { authReady, uid, profileReady } = useAuth();
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const navigated = useRef(false);

  useEffect(() => {
    const a = setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (navigated.current || !authReady || !minElapsed) return;
    if (uid && !profileReady && !timedOut) return; // let the profile load so Home isn't empty
    navigated.current = true;

    (async () => {
      if (uid) return goReplace('/(tabs)/home');
      let target = '/onboard';
      try {
        if ((await AsyncStorage.getItem('onboarded')) === 'true') target = '/auth/logIn';
      } catch (e) {
        console.error('Unable to read onboarding status', e);
      }
      goReplace(target);
    })();
  }, [authReady, uid, profileReady, minElapsed, timedOut]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.hero, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" />
      <HeroDecor />
      <Logo size={64} light />
      <ThemedText style={{ color: Colors.heroMuted, marginTop: 14, letterSpacing: 2, fontWeight: '600' }}>
        {Brand.tagline.toUpperCase()}
      </ThemedText>
    </View>
  );
}
