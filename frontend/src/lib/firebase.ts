import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const getCleanEnv = (val: string | undefined, fallback: string): string => {
  if (!val || val === 'undefined' || val === 'null') return fallback;
  return val.trim().replace(/^['"]|['"]$/g, '');
};

const firebaseConfig = {
  apiKey: getCleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyC9O3KM2wFey1sVNorS6Q9Ldvq0bWV53To"),
  authDomain: getCleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "zoodo-a1151.firebaseapp.com"),
  projectId: getCleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "zoodo-a1151"),
  storageBucket: getCleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "zoodo-a1151.firebasestorage.app"),
  messagingSenderId: getCleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "693811144114"),
  appId: getCleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:693811144114:web:c3debc05a02c7e1d59b0ab")
};

// Initialize Firebase cleanly without duplicate instances in Next.js hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Always prompt account chooser
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, googleProvider };
