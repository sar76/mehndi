// lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTwgfwKuZ4A302DyJ_vx1BqpHmDCeDueg",
  authDomain: "mehndiartists-d1431.firebaseapp.com",
  projectId: "mehndiartists-d1431",
  storageBucket: "mehndiartists-d1431.firebasestorage.app",
  messagingSenderId: "430053090913",
  appId: "1:430053090913:web:a5f75e7dc9c83c7ea66c20",
  measurementId: "G-C64PNXP6CC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize Analytics
let analytics;
if (typeof window !== "undefined") {
  // isSupported returns a promise that resolves to true if analytics is supported in this environment.
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
