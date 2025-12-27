import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcUdVNJ7EaWYuu9bIqu8WoP5FT5VO99tE",
  authDomain: "aquasense-81c33.firebaseapp.com",
  projectId: "aquasense-81c33",
  storageBucket: "aquasense-81c33.firebasestorage.app",
  messagingSenderId: "266509459498",
  appId: "1:266509459498:web:c735e843c7a750caa8a353",
  measurementId: "G-BWYEG2KM5R",
  databaseURL:
    "https://aquasense-81c33-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

/* ===== AUTH ===== */
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

/* ===== REALTIME DATABASE (unchanged) ===== */
export const database = getDatabase(app);

/* ===== FIRESTORE (NEW & REQUIRED) ===== */
export const firestore = getFirestore(app);

/* Optional */
export const getFirebaseApp = () => app;
