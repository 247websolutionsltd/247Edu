import { Logo } from '@/components/brand';
import { ThemedText } from '@/components/themed-text';
import { HeroDecor } from '@/components/ui';
import { auth } from '@/config/firebase';
import { Brand } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/PageContext';
import { goReplace } from '@/lib/nav';
import { getUserProfile } from '@/services/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { StatusBar, View } from 'react-native';

/** Branded splash. Decides between onboarding (first launch) and sign-in. */
export default function Splash() {
  const {setUser} = useAuth();
  useEffect(() => {
    let mounted = true;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe = () => {};
    const start = Date.now();

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      let target = user ? '/(tabs)/home' : '/onboard';
      if (!user) {
        try {
          const done = await AsyncStorage.getItem('onboarded');
          if (done === 'true') target = '/auth/logIn';
        } catch (e) {
          console.error('Unable to read onboarding status', e);
        }
      }else{
        const userData = await getUserProfile(user?.uid || '');
        console.log("User profile:", userData);
        AsyncStorage.setItem("userID", JSON.stringify(userData?.uid));
        setUser(userData);
      }
      const wait = Math.max(0, 900 - (Date.now() - start));
      redirectTimer = setTimeout(() => mounted && goReplace(target), wait);
    });

    return () => {
      mounted = false;
      unsubscribe();
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, []);

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
