import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Course Progress Service
 * Manages user progress tracking for courses in Firestore
 */

export interface CourseProgress {
  userId: string;
  courseId: string;
  progress: number; // 0, 50, or 100
  lastUpdated: any; // Firestore Timestamp
  videoCompleted?: boolean;
  aiPracticeCompleted?: boolean;
}

/**
 * Update course progress for a user
 * Only updates if new progress is higher than existing progress
 */
export const updateCourseProgress = async (
  userId: string, 
  courseId: string, 
  newProgress: number,
  source: 'video' | 'ai-practice' = 'video'
): Promise<void> => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }

    if (newProgress < 0 || newProgress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    const progressRef = doc(db, 'userProgress', userId, 'courses', courseId);
    const progressSnap = await getDoc(progressRef);

    let currentProgress = 0;
    let videoCompleted = false;
    let aiPracticeCompleted = false;

    if (progressSnap.exists()) {
      const data = progressSnap.data() as CourseProgress;
      currentProgress = data.progress || 0;
      videoCompleted = data.videoCompleted || false;
      aiPracticeCompleted = data.aiPracticeCompleted || false;
    }

    // Update completion flags based on source
    if (source === 'video' && newProgress >= 50) {
      videoCompleted = true;
    }
    if (source === 'ai-practice' && newProgress >= 100) {
      aiPracticeCompleted = true;
    }

    // Only update if new progress is higher than current progress
    if (newProgress > currentProgress) {
      const progressData: CourseProgress = {
        userId,
        courseId,
        progress: newProgress,
        lastUpdated: serverTimestamp(),
        videoCompleted,
        aiPracticeCompleted
      };

      await setDoc(progressRef, progressData);
      console.log(`✅ Updated course progress: ${userId}/${courseId} → ${newProgress}% (${source})`);
    } else {
      console.log(`ℹ️ Progress not updated: current ${currentProgress}% >= new ${newProgress}%`);
    }
  } catch (error) {
    console.error('❌ Error updating course progress:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time course progress updates
 */
export const subscribeToCourseProgress = (
  userId: string,
  courseId: string,
  callback: (progress: number) => void
): Unsubscribe => {
  try {
    if (!userId || !courseId) {
      console.warn('⚠️ Invalid userId or courseId for progress subscription');
      return () => {};
    }

    const progressRef = doc(db, 'userProgress', userId, 'courses', courseId);
    
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as CourseProgress;
        callback(data.progress || 0);
        console.log(`📊 Progress update: ${courseId} → ${data.progress}%`);
      } else {
        callback(0);
        console.log(`📊 No progress found for: ${courseId} → 0%`);
      }
    }, (error) => {
      console.error('❌ Error in progress subscription:', error);
      callback(0);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up progress subscription:', error);
    return () => {};
  }
};

/**
 * Get current course progress for a user
 */
export const getCourseProgress = async (
  userId: string, 
  courseId: string
): Promise<number> => {
  try {
    if (!userId || !courseId) {
      return 0;
    }

    const progressRef = doc(db, 'userProgress', userId, 'courses', courseId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const data = progressSnap.data() as CourseProgress;
      return data.progress || 0;
    }

    return 0;
  } catch (error) {
    console.error('❌ Error getting course progress:', error);
    return 0;
  }
};

/**
 * Reset course progress for a user (admin function)
 */
export const resetCourseProgress = async (
  userId: string, 
  courseId: string
): Promise<void> => {
  try {
    const progressRef = doc(db, 'userProgress', userId, 'courses', courseId);
    
    const resetData: CourseProgress = {
      userId,
      courseId,
      progress: 0,
      lastUpdated: serverTimestamp(),
      videoCompleted: false,
      aiPracticeCompleted: false
    };

    await setDoc(progressRef, resetData);
    console.log(`🔄 Reset progress for: ${userId}/${courseId}`);
  } catch (error) {
    console.error('❌ Error resetting course progress:', error);
    throw error;
  }
};