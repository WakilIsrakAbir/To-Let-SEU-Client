import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  Auth,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== 'undefined' || isFirebaseConfigured()) {
  try {
    app = !getApps().length
      ? initializeApp(
          isFirebaseConfigured()
            ? firebaseConfig
            : {
                // Fallback placeholder during build if env vars not yet configured
                apiKey: 'AIzaSyDemoPlaceholderKeyForBuildSafety',
                authDomain: 'to-let-seu-demo.firebaseapp.com',
                projectId: 'to-let-seu-demo',
              }
        )
      : getApp();

    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  } catch (error) {
    console.warn('[Firebase] Initialization notice:', error);
  }
}

export { app, auth, googleProvider, sendPasswordResetEmail, signInWithPopup };
