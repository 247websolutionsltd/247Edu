# Verdi — save, spend and send money

Rebrand of the original delivery app into a fintech app. Drop the contents of `src/` over your project's `src/`
(delete the old `app/`, `components/`, `data/`, `styles/` first so no stale routes remain).

* Rename the app in one place: `src/constants/brand.ts`
* Colors / radii / tokens: `src/constants/theme.ts` (dark-first deep green + lime; light mode in Profile)
* Demo wallet logic (balance, transfers, goals, bills): `src/context/WalletContext.tsx` — swap for real API calls
* No new dependencies were added. Onboarding/auth no longer need image assets.
