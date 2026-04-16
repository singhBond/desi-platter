// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDB-VXpvtaoUbkjbEh1RWe3WmndPpLLDb4",
  authDomain: "desi-platter.firebaseapp.com",
  projectId: "desi-platter",
  storageBucket: "desi-platter.firebasestorage.app",
  messagingSenderId: "658107361598",
  appId: "1:658107361598:web:7835f7e0abd5290978e46f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Export app if needed elsewhere
export default app;