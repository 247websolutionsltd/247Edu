# Firebase setup

## 1. Console (one-time)
1. **Authentication → Sign-in method:** enable **Email/Password** (and **Google** if you use the Google button).
2. **Firestore Database:** create a database (production mode).
3. Deploy the rules in `firestore.rules`:
   `npm i -g firebase-tools && firebase login && firebase deploy --only firestore:rules --project <your-project-id>`
   (or paste the file into Firestore → Rules → Publish).
4. Your `.env` needs the variables in `.env.example`. Restart Expo with `npx expo start --clear` after editing it.

## 2. Data model
```
users/{uid}                     email, displayName, phone, balance, accountNumber, referralCode,
                                tier, cardFrozen, roundUps, createdAt
users/{uid}/transactions/{id}   kind, category, title, subtitle, amount, fee, ts, status, reference, note?
users/{uid}/goals/{id}          name, icon, target, saved, dueLabel, locked, rate, createdAt
users/{uid}/beneficiaries/{id}  name, bank, account, createdAt        (id = bank_account, so no duplicates)
users/{uid}/notifications/{id}  title, desc, detail, icon, type, ts, unread, action?
```
Existing users are upgraded automatically the next time they sign in (string balances become numbers,
`phoneNumber` is copied to `phone`, missing account number / referral code are generated).
Old `savings` and `weekSpent` fields are no longer used and can be deleted.

## 3. Before real money
Read the comment at the top of `firestore.rules`. Moving money from the client is demo-grade:
use Cloud Functions for transfers/top-ups/bills/savings, make `balance` read-only in rules, and
replace the card top-up with a payment provider (Paystack, Flutterwave...) that verifies payment server-side.
