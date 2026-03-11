import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDc_TZICA6ccQZQq6Z0gZxkBVWnfl1OAc8",
  authDomain: "dashboard-saylani.firebaseapp.com",
  projectId: "dashboard-saylani",
  storageBucket: "dashboard-saylani.firebasestorage.app",
  messagingSenderId: "185516393618",
  appId: "1:185516393618:web:acec6a15904f9ef955924b",
  measurementId: "G-SET6SVD7F5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
