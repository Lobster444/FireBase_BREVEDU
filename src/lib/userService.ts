import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User, TavusCompletion } from '../types';

/**
 * Update user's Tavus completion status for a specific course
 * @param userId - User ID
 * @param courseId - Course ID
 * @param completion - Tavus completion data
 * @returns Promise<void>
 */
export const updateTavusCompletion = async (
  userId: string,
  courseId: string,
  completion: TavusCompletion
): Promise<void> => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }

    const userRef = doc(db, 'users', userId);
    
    // Get current user data to preserve existing completions
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data() as User;
    const currentCompletions = userData.tavusCompletions || {};

    // Update the specific course completion
    const updatedCompletions = {
      ...currentCompletions,
      [courseId]: {
        ...completion,
        completedAt: completion.completedAt || new Date().toISOString()
      }
    };

    await updateDoc(userRef, {
      tavusCompletions: updatedCompletions
    });

    console.log(`✅ Updated Tavus completion for user ${userId}, course ${courseId}`);
  } catch (error) {
    console.error('Error updating Tavus completion:', error);
    throw error;
  }
};

/**
 * Get user's Tavus completion status for a specific course
 * @param userId - User ID
 * @param courseId - Course ID
 * @returns Promise<TavusCompletion | null>
 */
export const getTavusCompletion = async (
  userId: string,
  courseId: string
): Promise<TavusCompletion | null> => {
  try {
    if (!userId || !courseId) {
      return null;
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data() as User;
    return userData.tavusCompletions?.[courseId] || null;
  } catch (error) {
    console.error('Error getting Tavus completion:', error);
    return null;
  }
};

/**
 * Get all Tavus completions for a user
 * @param userId - User ID
 * @returns Promise<{ [courseId: string]: TavusCompletion } | null>
 */
export const getAllTavusCompletions = async (
  userId: string
): Promise<{ [courseId: string]: TavusCompletion } | null> => {
  try {
    if (!userId) {
      return null;
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data() as User;
    return userData.tavusCompletions || null;
  } catch (error) {
    console.error('Error getting all Tavus completions:', error);
    return null;
  }
};

/**
 * Remove Tavus completion for a specific course (for retaking practice)
 * @param userId - User ID
 * @param courseId - Course ID
 * @returns Promise<void>
 */
export const removeTavusCompletion = async (
  userId: string,
  courseId: string
): Promise<void> => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }

    const userRef = doc(db, 'users', userId);
    
    // Get current user data
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data() as User;
    const currentCompletions = userData.tavusCompletions || {};

    // Remove the specific course completion
    const updatedCompletions = { ...currentCompletions };
    delete updatedCompletions[courseId];

    await updateDoc(userRef, {
      tavusCompletions: updatedCompletions
    });

    console.log(`✅ Removed Tavus completion for user ${userId}, course ${courseId}`);
  } catch (error) {
    console.error('Error removing Tavus completion:', error);
    throw error;
  }
};