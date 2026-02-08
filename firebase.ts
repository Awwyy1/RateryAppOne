import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBA5e023wB-ZHr8RZ5DIL7zFAmeyVBHTAs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rateryappone.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rateryappone",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rateryappone.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "716505401460",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:716505401460:web:d913cbbd8e748418702921"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (browser only, graceful fallback)
export let analytics: Analytics | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  // Analytics not supported in this environment (SSR, tests, etc.)
});

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
