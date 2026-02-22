// src/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Go to https://console.firebase.google.com
// STEP 2: Create a project → Add Web App → Copy the config below
// STEP 3: Replace every value below with YOUR project's values
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPlXP5bej1r5hymMX-h2aqYcsMEcjsanU",
  authDomain: "tnbc-lenten-2026.firebaseapp.com",
  projectId: "tnbc-lenten-2026",
  storageBucket: "tnbc-lenten-2026.firebasestorage.app",
  messagingSenderId: "342761759913",
  appId: "1:342761759913:web:739aeb55990f68e13f35b8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
