import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole } from '../types';
import { getUserUsageStatus } from '../services/tavusUsage';
import { trackAuthEvent } from '../lib/analytics';

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

      console.log('Creating user document with data:', userData); // Add this
      await setDoc(userRef, userData);
      return userData;
    }

    // Document exists - check if we need to update the name
    const existingData = userSnap.data() as User;
    if (name && existingData.name !== name) {
      console.log('Updating existing user document with new name:', name);
      await updateDoc(userRef, { name });
      existingData.name = name;
    }
    return existingData;
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    trackAuthEvent('login');
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth profile with name
    await updateProfile(result.user, {
      displayName: name
    });
    
    // Send email verification with redirect settings
    const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: true,
    };
    await sendEmailVerification(result.user, actionCodeSettings);
    console.log('✅ Email verification sent to:', email);
    
    // Create user document in Firestore but don't log user in
    await createUserDocument(result.user, name);
    
    // Sign user out to keep them logged out until email is verified
    await signOut(auth);
    console.log('✅ User signed out - email verification required');
    
    trackAuthEvent('sign_up');
    return result;
  };

  const logout = async () => {
    console.log('🚪 AuthContext logout function called');
    
    console.log('🔍 Firebase auth object:', auth);
    console.log('🔍 Current Firebase user:', auth.currentUser?.email);
    
    await signOut(auth);
    console.log('✅ Firebase signOut completed');
    trackAuthEvent('logout');
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

    try {
      // Get current usage status from the usage service
      const usageStatus = await getUserUsageStatus(currentUser);
      
      // Update user document with current usage
      const today = new Date().toISOString().split('T')[0];
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        aiChatsUsed: usageStatus.used,
        lastChatReset: today
      });
      
      // Update local state
      setCurrentUser(prev => prev ? { 
        ...prev, 
        aiChatsUsed: usageStatus.used, 
        lastChatReset: today 
      } : null);
      
      console.log('📊 Updated user AI chats used:', usageStatus.used);
    } catch (error) {
      console.error('❌ Error updating AI chats used:', error);
    }
  };

  const resetDailyAIChats = async () => {
    if (!currentUser) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        aiChatsUsed: 0,
        lastChatReset: today
      });
      
      setCurrentUser(prev => prev ? { ...prev, aiChatsUsed: 0, lastChatReset: today } : null);
      console.log('🔄 Reset daily AI chats for user:', currentUser.uid);
    } catch (error) {
      console.error('❌ Error resetting daily AI chats:', error);
    }
  };

  // Sync user usage data when user changes
  useEffect(() => {
    const syncUsageData = async () => {
      if (currentUser && currentUser.role !== 'anonymous') {
        try {
          const usageStatus = await getUserUsageStatus(currentUser);
          const today = new Date().toISOString().split('T')[0];
          
          // Only update if the data is different
          if (currentUser.aiChatsUsed !== usageStatus.used || currentUser.lastChatReset !== today) {
            setCurrentUser(prev => prev ? {
              ...prev,
              aiChatsUsed: usageStatus.used,
              lastChatReset: today
            } : null);
          }
        } catch (error) {
          console.error('❌ Error syncing usage data:', error);
        }
      }
    };

    syncUsageData();
  }, [currentUser?.uid, currentUser?.role]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser?.email || 'null');
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('👤 User is authenticated:', firebaseUser.email);
        try {
          const userData = await createUserDocument(firebaseUser);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        console.log('🚪 User is signed out');
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