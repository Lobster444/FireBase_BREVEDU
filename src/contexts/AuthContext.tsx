import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  incrementAIChatsUsed: () => Promise<void>;
  resetDailyAIChats: () => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (firebaseUser: FirebaseUser, name?: string, role: UserRole = 'free') => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: name || firebaseUser.displayName || 'User',
        role,
        isAdmin: false, // Default to false, can be updated manually in Firestore
        aiChatsUsed: 0,
        lastChatReset: new Date().toISOString().split('T')[0], // Today's date
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, userData);
      return userData;
    }

    return userSnap.data() as User;
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth profile with name
    await updateProfile(result.user, {
      displayName: name
    });
    
    // Create user document in Firestore (no email verification required)
    await createUserDocument(result.user, name);
    
    return result;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserRole = async (role: UserRole) => {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, { role });
    
    setCurrentUser(prev => prev ? { ...prev, role } : null);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, updates);
    
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const incrementAIChatsUsed = async () => {
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', currentUser.uid);
    
    // Reset counter if it's a new day
    if (currentUser.lastChatReset !== today) {
      await updateDoc(userRef, {
        aiChatsUsed: 1,
        lastChatReset: today
      });
      setCurrentUser(prev => prev ? { ...prev, aiChatsUsed: 1, lastChatReset: today } : null);
    } else {
      const newCount = (currentUser.aiChatsUsed || 0) + 1;
      await updateDoc(userRef, { aiChatsUsed: newCount });
      setCurrentUser(prev => prev ? { ...prev, aiChatsUsed: newCount } : null);
    }
  };

  const resetDailyAIChats = async () => {
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', currentUser.uid);
    
    await updateDoc(userRef, {
      aiChatsUsed: 0,
      lastChatReset: today
    });
    
    setCurrentUser(prev => prev ? { ...prev, aiChatsUsed: 0, lastChatReset: today } : null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await createUserDocument(firebaseUser);
          setCurrentUser(userData);
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

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    updateUserRole,
    incrementAIChatsUsed,
    resetDailyAIChats,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};