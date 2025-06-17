import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChSy_0MFnUJiUHDeFxGZjszTji3CMRc0I",
  authDomain: "brevedy-tracking.firebaseapp.com",
  projectId: "brevedy-tracking",
  storageBucket: "brevedy-tracking.firebasestorage.app",
  messagingSenderId: "776880219074",
  appId: "1:776880219074:web:ab60d8676fa049a3026c5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to Firestore emulator in development (optional)
// Uncomment the lines below if you want to use the Firestore emulator for local development
// if (process.env.NODE_ENV === 'development' && !db._delegate._databaseId.projectId.includes('demo-')) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;