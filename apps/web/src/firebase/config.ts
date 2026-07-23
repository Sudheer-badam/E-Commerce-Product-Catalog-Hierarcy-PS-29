import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBN565VbW6aYCN2_u16GFlI0MCYEgkkZmw",
  authDomain: "shopsmart-catalog-60fee.firebaseapp.com",
  projectId: "shopsmart-catalog-60fee",
  storageBucket: "shopsmart-catalog-60fee.firebasestorage.app",
  messagingSenderId: "182149378562",
  appId: "1:182149378562:web:bac3d47c00b5970a5a2d1b",
  measurementId: "G-MR38F9HFYZ"
};

// Initialize Firebase (prevent re-initialization in Next.js hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
