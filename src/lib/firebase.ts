import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyChSy_0MFnUJiUHDeFxGZjszTji3CMRc0I",
  authDomain: "brevedy-tracking.firebaseapp.com",
  projectId: "brevedy-tracking",
  storageBucket: "brevedy-tracking.firebasestorage.app",
  messagingSenderId: "776880219074",
  appId: "1:776880219074:web:ab60d8676fa049a3026c5b",
  measurementId: "G-VZWL7CE7T8"
};

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
// Uncomment the lines below if you want to use the Firestore emulator for local development
// if (process.env.NODE_ENV === 'development' && !db._delegate._databaseId.projectId.includes('demo-')) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

