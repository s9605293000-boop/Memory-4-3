// src/firebase.js
// Paste your Firebase config below into window.FIREBASE_CONFIG in main.js if not already set.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue, set, get, update, remove, serverTimestamp, push, onDisconnect } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export const app = initializeApp(window.FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getDatabase(app);

export {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged,
  signInAnonymously, signOut, ref, onValue, set, get, update, remove, serverTimestamp, push, onDisconnect
};
