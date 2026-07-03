import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDp9NSh5SgRkbvku-1Q7Vg7ScvhJNfYbpY",
  authDomain: "e-commerce-product-catalog.firebaseapp.com",
  projectId: "e-commerce-product-catalog",
  storageBucket: "e-commerce-product-catalog.firebasestorage.app",
  messagingSenderId: "863822935089",
  appId: "1:863822935089:web:66298b4aca370d313e1110",
  measurementId: "G-DKCPZ5EE7G"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
