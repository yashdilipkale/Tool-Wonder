import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmFlDvcqY1sbBbWXB5k1ikST56hKVCKB0",
  authDomain: "toolswonder-edc99.firebaseapp.com",
  projectId: "toolswonder-edc99",
  storageBucket: "toolswonder-edc99.firebasestorage.app",
  messagingSenderId: "776889286998",
  appId: "1:776889286998:web:5ef2d62c29c78dbe55d6f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
