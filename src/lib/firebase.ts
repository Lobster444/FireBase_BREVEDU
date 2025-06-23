import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChSy_0MFnUJiUHDeFxGZjszTji3CMRc0I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "brevedy-tracking.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "brevedy-tracking",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "brevedy-tracking.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "776880219074",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:776880219074:web:ab60d8676fa049a3026c5b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VZWL7CE7T8"
};

// Validate required configuration
const requiredEnvVars = [
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0 && import.meta.env.MODE === 'production') {
  console.warn('⚠️ Missing Firebase environment variables:', missingVars);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Connect to Firestore emulator in development (optional)
if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true' && import.meta.env.MODE === 'development') {
  const firestoreHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  const [host, port] = firestoreHost.split(':');
  connectFirestoreEmulator(db, host, parseInt(port));
  console.log('🔧 Connected to Firestore emulator:', firestoreHost);
}

// Log configuration in development
if (import.meta.env.MODE === 'development') {
  console.log('🔥 Firebase initialized with project:', firebaseConfig.projectId);
}