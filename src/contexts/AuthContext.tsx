import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Safely convert createdAt to Date object
            let createdAtDate: Date;
            if (userData.createdAt instanceof Timestamp) {
              createdAtDate = userData.createdAt.toDate();
            } else if (userData.createdAt) {
              // Handle string dates or other formats
              createdAtDate = new Date(userData.createdAt);
            } else {
              createdAtDate = new Date();
            }
            
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name || userData.displayName || firebaseUser.displayName || '',
              role: userData.role || 'free',
              createdAt: createdAtDate,
              emailVerified: firebaseUser.emailVerified,
              isAdmin: userData.isAdmin || false
            });
          } else {
            // Create user document if it doesn't exist
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || '',
              role: 'free',
              createdAt: new Date(),
              emailVerified: firebaseUser.emailVerified,
              isAdmin: false
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...newUser,
              createdAt: new Date(),
              isAdmin: false
            });
            
            setCurrentUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!result.user.emailVerified) {
      // Send verification email
      await sendEmailVerification(result.user);
      // Sign out the user
      await signOut(auth);
      throw new Error('Please verify your email before logging in. A new verification email has been sent.');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase profile
    await updateProfile(user, { displayName: name });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    const newUser: User = {
      uid: user.uid,
      email: user.email!,
      name,
      role: 'free',
      createdAt: new Date(),
      emailVerified: user.emailVerified
    };
    
    await setDoc(doc(db, 'users', user.uid), {
      ...newUser,
      createdAt: new Date()
    });
    
    // Sign out the user to force email verification
    await signOut(auth);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Update Firestore document
    await updateDoc(doc(db, 'users', currentUser.uid), updates);
    
    // Update local state
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};