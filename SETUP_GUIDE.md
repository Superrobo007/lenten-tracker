# 🙏 TNBC Lenten Journey Tracker — Setup Guide
## Firebase + Vercel · Ready in ~30 minutes

---

## PART 1 — Firebase Setup (10 mins)

### Step 1 · Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it: `tnbc-lenten-2025`
4. Disable Google Analytics (not needed) → **Create project**

### Step 2 · Create the Database
1. In the left sidebar click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Pick any location (e.g. `asia-south1` for India) → **Enable**

### Step 3 · Set Security Rules
In Firestore → **Rules** tab, replace everything with this and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
    match /progress/{userId} {
      allow read, write: if true;
    }
    match /reminders/{remId} {
      allow read, write: if true;
    }
  }
}
```

### Step 4 · Get Your Config Keys
1. Go to **Project Settings** (gear icon ⚙️ top-left)
2. Scroll down to **"Your apps"** → Click **"</> Web"**
3. Register app name: `lenten-web` → **Register app**
4. Copy the `firebaseConfig` object shown (it has 6 values)

### Step 5 · Paste Keys Into Your Code
Open `src/firebase.js` and replace each `"PASTE_YOUR_..."` with your real values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // your real key
  authDomain: "tnbc-lenten-2025.firebaseapp.com",
  projectId: "tnbc-lenten-2025",
  storageBucket: "tnbc-lenten-2025.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

---

## PART 2 — Deploy to Vercel (10 mins)

### Step 1 · Push code to GitHub
1. Create a free account at https://github.com if you don't have one
2. Create a **New Repository** → name it `lenten-tracker` → Public
3. On your computer, open Terminal in the `lenten-app` folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lenten-tracker.git
git push -u origin main
```

### Step 2 · Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click **"New Project"** → Import your `lenten-tracker` repo
3. Leave all settings default → Click **"Deploy"**
4. Wait ~60 seconds... 🎉

### Step 3 · Get your shareable URL
Vercel gives you a URL like:
`https://lenten-tracker.vercel.app`

**Share this link with all your participants!**

---

## PART 3 — How to Use

### For Participants
- Open the link → click **"புதிய பதிவு"** → enter their name
- They see their personal 40-day tracker
- Tap any row to mark it done ✓
- Progress saves automatically to Firebase

### For Admin (You)
- Open the same link
- Tap **"நிர்வாக"** (top right, small text)
- Password: **TNBC2026**  ← Change this in `src/data/days.js` if you want
- Four tabs:
  - **கண்ணோட்டம்** — Overall stats
  - **உறுப்பினர்கள்** — All members + progress + remove button
  - **நினைவூட்டல்** — Send a message banner to ALL users instantly
  - **தரவரிசை** — Live leaderboard

---

## PART 4 — Cost & Reliability for 40 Days

| Service | Free Tier | Your Expected Usage |
|---------|-----------|---------------------|
| Firebase Firestore | 50,000 reads/day, 20,000 writes/day | ~500 users × 10 reads = 5,000/day ✅ |
| Vercel Hosting | 100GB bandwidth/month | Negligible ✅ |

**Bottom line: Completely free for 40–45 days, even with 500+ users.**

No credit card needed. No expiry. No maintenance required.
Firebase and Vercel both have excellent uptime (99.9%+).

---

## Troubleshooting

**"Firebase: Error (permission-denied)"**
→ Check your Firestore Security Rules (Part 1 Step 3)

**App shows blank page on Vercel**
→ Check that `src/firebase.js` has your real config values (not the placeholder text)

**"NAME_TAKEN" error on registration**
→ That name is already registered. User should login instead.

**Change admin password**
→ Open `src/data/days.js` → change `"TNBC2026"` to whatever you want → redeploy

---

*Built for TNBC Commission for Charismatic Renewal and Proclamation*
*Lenten Journey 2025 · 40 நாட்கள்*
