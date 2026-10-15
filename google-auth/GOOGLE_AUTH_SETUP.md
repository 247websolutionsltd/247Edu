# Google sign-in setup (Login + Register)

Files changed (copy over your project, paths relative to `src/`):
- `components/google-signin-button.tsx`  (rewritten, native Google Sign-In)
- `app/auth/register.tsx`                 (adds "Sign up with Google")
`app/auth/logIn.tsx` already renders `<GoogleSignInButton/>`; no change needed.

Google sign-in is both sign-in and sign-up: a first-time Google user gets a
Firebase user plus the wallet profile (account number, balance, etc.) created
automatically by `ensureUserAccount`.

## 1. Install
    npx expo install @react-native-google-signin/google-signin

## 2. Firebase console
1. Authentication > Sign-in method > enable **Google**, set a support email, save.
2. Project settings > Your apps: add an **Android** app (package name = `android.package` in app.json) and an **iOS** app (bundle id = `ios.bundleIdentifier`).
3. Android: add your **SHA-1** (and SHA-256) fingerprints.
   - Debug/dev build: `cd android && ./gradlew signingReport` (after prebuild), or `eas credentials`.
   - EAS/Play release: add the fingerprints shown by `eas credentials` and the Play Console "App signing" SHA-1.
4. Download `google-services.json` and `GoogleService-Info.plist` into the project root.
5. Re-download `google-services.json` after adding SHA-1s so it contains the OAuth clients.

## 3. .env
Use the **Web client ID** (Google Cloud Console > APIs & Services > Credentials,
the one named "Web client (auto created by Google Service)", or Firebase > Auth >
Google > Web SDK configuration):

    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1234567890-xxxx.apps.googleusercontent.com

(`EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` is no longer used.)

## 4. app.json
Add the files and plugin. The iOS URL scheme is the `REVERSED_CLIENT_ID` from GoogleService-Info.plist.

    {
      "expo": {
        "android": { "package": "com.yourco.verdi", "googleServicesFile": "./google-services.json" },
        "ios": { "bundleIdentifier": "com.yourco.verdi", "googleServicesFile": "./GoogleService-Info.plist" },
        "plugins": [
          ["@react-native-google-signin/google-signin", { "iosUrlScheme": "com.googleusercontent.apps.1234567890-xxxx" }]
        ]
      }
    }

## 5. Build a dev build (Expo Go will NOT work: native module)
    npx expo prebuild --clean
    npx expo run:android      # or: eas build --profile development --platform android
    npx expo run:ios          # (needs a Mac)

## Troubleshooting
- `DEVELOPER_ERROR` / code 10: SHA-1 or package name in Firebase doesn't match the build. Add the SHA-1, re-download google-services.json, rebuild.
- "not configured" alert: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` missing; restart Metro with `npx expo start -c`.
- `auth/operation-not-allowed`: Google provider not enabled in Firebase.
- `auth/account-exists-with-different-credential`: that email already registered with a password; the button shows a message asking the user to use email/password.
- Not tested on a device here; I verified the library's API against v16.1.5 and type-checked the code.
