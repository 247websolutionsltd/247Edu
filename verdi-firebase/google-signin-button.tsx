import { useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import {
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../config/firebase";
import { goReplace } from "@/lib/nav";
import { ensureUserAccount } from "@/services/users";
import { ThemedText } from "./themed-text";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
    const theme = useTheme();
  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    const signIn = async () => {
      if (response?.type !== "success") {
        return;
      }

      try {
        const { id_token } = response.params;

        if (!id_token) {
          throw new Error("Google did not return an ID token.");
        }

        const credential =
          GoogleAuthProvider.credential(id_token);

        const userCredential = await signInWithCredential(
          auth,
          credential
        );

        await ensureUserAccount(userCredential.user);
        goReplace("/(tabs)/home");
      } catch (error) {
        console.error("Google Sign-In Error:", error);

        Alert.alert(
          "Google Sign-In Failed",
          "Unable to sign in with Google."
        );
      }
    };

    signIn();
  }, [response]);

  return (
    <TouchableOpacity
        onPress={() => {
            promptAsync();
        }}
        style={{
            flex: 1,
            height: 52,
            borderRadius: Radius.pill,
            borderWidth: 1,
            borderColor: theme.line,
            backgroundColor: theme.card,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
        }}
    >
        <Ionicons name={"logo-google"} size={19} color={theme.text} />
        <ThemedText type="smallBold" style={{ marginLeft: Spacing.two }}>Google</ThemedText>
    </TouchableOpacity>
  );
}