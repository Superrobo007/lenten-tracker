// src/db.js  — All Firebase calls live here
import {
  doc, getDoc, setDoc, updateDoc,
  collection, getDocs, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "./firebase";

// ── USERS ────────────────────────────────────────────────────────────────────

export async function registerUser(name) {
  // Check if name taken
  const snap = await getDocs(collection(db, "users"));
  for (const d of snap.docs) {
    if (d.data().name === name) throw new Error("NAME_TAKEN");
  }
  const id = "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  await setDoc(doc(db, "users", id), {
    id, name,
    joinedAt: new Date().toLocaleDateString("en-CA"),
    createdAt: serverTimestamp(),
  });
  return { id, name };
}

export async function loginUser(name) {
  const snap = await getDocs(collection(db, "users"));
  for (const d of snap.docs) {
    if (d.data().name === name) return d.data();
  }
  throw new Error("NOT_FOUND");
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => d.data());
}

export async function deleteUser(userId) {
  await deleteDoc(doc(db, "users", userId));
}

// ── PROGRESS ─────────────────────────────────────────────────────────────────

export async function getProgress(userId) {
  const d = await getDoc(doc(db, "progress", userId));
  return d.exists() ? d.data() : {};
}

export async function saveProgress(userId, dayIndex, checks) {
  const ref = doc(db, "progress", userId);
  await setDoc(ref, { ["d" + dayIndex]: checks, updatedAt: serverTimestamp() }, { merge: true });
}

// Live listener for leaderboard
export function subscribeLeaderboard(callback) {
  return onSnapshot(collection(db, "progress"), () => {
    buildLeaderboard().then(callback);
  });
}

export async function buildLeaderboard() {
  const [usersSnap, progressSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "progress")),
  ]);
  const progressMap = {};
  for (const d of progressSnap.docs) progressMap[d.id] = d.data();
  return usersSnap.docs.map(d => {
    const u = d.data();
    const p = progressMap[u.id] || {};
    const full = Object.keys(p).filter(k => k.startsWith("d") && p[k]?.do && p[k]?.give && p[k]?.avoid).length;
    const partial = Object.keys(p).filter(k => k.startsWith("d") && (p[k]?.do || p[k]?.give || p[k]?.avoid) && !(p[k]?.do && p[k]?.give && p[k]?.avoid)).length;
    return { ...u, full, partial };
  }).sort((a, b) => (b.full * 3 + b.partial) - (a.full * 3 + a.partial));
}

// ── REMINDERS ────────────────────────────────────────────────────────────────

export async function sendReminder(text) {
  const id = "rem_" + Date.now();
  await setDoc(doc(db, "reminders", id), {
    id, text,
    date: new Date().toLocaleDateString("en-CA"),
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    createdAt: serverTimestamp(),
  });
}

export async function getReminders() {
  const snap = await getDocs(query(collection(db, "reminders"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => d.data()).slice(0, 10);
}

export function subscribeReminders(callback) {
  return onSnapshot(
    query(collection(db, "reminders"), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map(d => d.data()).slice(0, 10))
  );
}

export async function deleteReminder(id) {
  await deleteDoc(doc(db, "reminders", id));
}
