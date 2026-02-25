// src/db.js
import {
  doc, getDoc, setDoc, getDocs, deleteDoc,
  collection, onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "./firebase";

export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

// ── USERS ─────────────────────────────────────────────────────────────────────

export async function registerUser(name, password, parish = "", phone = "") {
  const snap = await getDocs(collection(db, "users"));
  for (const d of snap.docs) {
    if (d.data().name === name) throw new Error("NAME_TAKEN");
  }
  const id = "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  const pwHash = simpleHash(password);
  await setDoc(doc(db, "users", id), {
    id, name, pwHash, parish, phone,
    joinedAt: new Date().toLocaleDateString("en-CA"),
    createdAt: serverTimestamp(),
  });
  return { id, name, parish, phone };
}

export async function loginUser(name, password) {
  const snap = await getDocs(collection(db, "users"));
  for (const d of snap.docs) {
    const u = d.data();
    if (u.name === name) {
      if (u.pwHash !== simpleHash(password)) throw new Error("WRONG_PASSWORD");
      return { id: u.id, name: u.name, parish: u.parish || "", phone: u.phone || "" };
    }
  }
  throw new Error("NOT_FOUND");
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => {
    const { pwHash, ...safe } = d.data();
    return safe;
  });
}

export async function deleteUser(userId) {
  await deleteDoc(doc(db, "users", userId));
}

// ── PROGRESS ──────────────────────────────────────────────────────────────────

export async function getProgress(userId) {
  const d = await getDoc(doc(db, "progress", userId));
  return d.exists() ? d.data() : {};
}

export async function saveProgress(userId, dayIndex, checks) {
  await setDoc(
    doc(db, "progress", userId),
    { ["d" + dayIndex]: checks, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────

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
    const partial = Object.keys(p).filter(k =>
      k.startsWith("d") && (p[k]?.do || p[k]?.give || p[k]?.avoid) &&
      !(p[k]?.do && p[k]?.give && p[k]?.avoid)
    ).length;
    return { id: u.id, name: u.name, parish: u.parish || "", phone: u.phone || "", full, partial };
  }).sort((a, b) => (b.full * 3 + b.partial) - (a.full * 3 + a.partial));
}

export function subscribeLeaderboard(callback) {
  return onSnapshot(collection(db, "progress"), () => {
    buildLeaderboard().then(callback);
  });
}

// ── REMINDERS ─────────────────────────────────────────────────────────────────

export async function sendReminder(text, attachment = null) {
  const id = "rem_" + Date.now();
  const data = {
    id, text,
    date: new Date().toLocaleDateString("en-CA"),
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    createdAt: serverTimestamp(),
  };
  if (attachment) {
    data.attachmentUrl = attachment.dataUrl;
    data.attachmentName = attachment.name;
    data.attachmentType = attachment.type;
  }
  await setDoc(doc(db, "reminders", id), data);
}

export async function getReminders() {
  const snap = await getDocs(query(collection(db, "reminders"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => d.data()).slice(0, 10);
}

export function subscribeReminders(callback) {
  return onSnapshot(
    query(collection(db, "reminders"), orderBy("createdAt", "desc")),
    snap => callback(snap.docs.map(d => d.data()).slice(0, 10))
  );
}

export async function deleteReminder(id) {
  await deleteDoc(doc(db, "reminders", id));
}
