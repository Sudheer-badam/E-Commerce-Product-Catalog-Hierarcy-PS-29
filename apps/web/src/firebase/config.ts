import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZh9yubYHJINb_MftQOKmENcWtaLawZEs",
  authDomain: "e-commerce-product-catal-aca51.firebaseapp.com",
  projectId: "e-commerce-product-catal-aca51",
  storageBucket: "e-commerce-product-catal-aca51.firebasestorage.app",
  messagingSenderId: "1062815821441",
  appId: "1:1062815821441:web:9cc592e8fb07aae7172780",
  measurementId: "G-84F9Z7C8NK"
};

// Initialize Firebase (prevent re-initialization in Next.js hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
