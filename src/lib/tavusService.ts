import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User, TavusCompletion } from '../types';
import { notifySuccess, notifyError, notifyWarning } from './toast';

/**
 * Enhanced Tavus service for handling AI practice sessions with TTL support
 */

interface TavusSession {
  id?: string;
  userId: string;
  courseId: string;
  conversationId?: string | null;
  status: 'confirmed' | 'started' | 'in_progress' | 'completed' | 'failed' | 'abandoned' | 'expired';
  confirmedAt?: string; // NEW: When user confirmed start
  startedAt: string;
  completedAt?: string;
  expiresAt?: string; // NEW: TTL expiration time
  accuracyScore?: number;
  duration?: number; // in seconds
  ttl?: number; // NEW: Time to live in seconds (default 3600)
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    deviceType?: string;
    confirmationDelay?: number; // Time between confirmation and actual start
  };
}

interface TavusWebhookPayload {
  event_type: 'conversation_started' | 'conversation_completed' | 'conversation_failed';
  conversation_id: string;
  user_id: string;
  course_id: string;
  timestamp: string;
  data?: {
    accuracy_score?: number;
    duration?: number;
    completion_percentage?: number;
    error_message?: string;
  };
  signature?: string; // For webhook verification
}

/**
 * UPDATED: Start a new Tavus session with TTL and track it in Firestore
 * Session is created only after user confirmation, not on modal open
 * @param userId - User ID
 * @param courseId - Course ID
 * @param conversationUrl - Optional Tavus conversation URL
 * @param ttl - Time to live in seconds (default 3600 = 1 hour)
 * @returns Promise<string> - Session ID
 */
export const startTavusSession = async (
  userId: string,
  courseId: string,
  conversationUrl?: string,
  ttl: number = 3600 // Default 1 hour TTL
): Promise<string> => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttl * 1000)); // TTL in milliseconds

    console.log('🚀 Creating Tavus session with TTL:', {
      userId,
      courseId,
      ttl: `${ttl}s`,
      expiresAt: expiresAt.toISOString()
    });

    const sessionData: Omit<TavusSession, 'id'> = {
      userId,
      courseId,
      conversationId: conversationUrl || null,
      status: 'confirmed', // NEW: Start with confirmed status
      confirmedAt: now.toISOString(), // NEW: Track confirmation time
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(), // NEW: TTL expiration
      ttl, // NEW: Store TTL value
      metadata: {
        userAgent: navigator.userAgent,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        confirmationDelay: 0 // Will be updated when session actually starts
      }
    };

    const sessionRef = await addDoc(collection(db, 'tavusSessions'), {
      ...sessionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Tavus session created with TTL:', sessionRef.id, `expires in ${ttl}s`);
    
    // Schedule cleanup for expired sessions (client-side reminder)
    setTimeout(() => {
      console.log('⏰ Session TTL expired for:', sessionRef.id);
      // The session will be marked as expired by backend cleanup
    }, ttl * 1000);

    return sessionRef.id;
  } catch (error) {
    console.error('❌ Error starting Tavus session:', error);
    throw error;
  }
};

/**
 * UPDATED: Update Tavus session status with TTL awareness
 * @param sessionId - Session ID
 * @param updates - Session updates
 * @returns Promise<void>
 */
export const updateTavusSession = async (
  sessionId: string,
  updates: Partial<TavusSession>
): Promise<void> => {
  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Check if session has expired before updating
    const sessionRef = doc(db, 'tavusSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const sessionData = sessionSnap.data() as TavusSession;
      
      // Check TTL expiration
      if (sessionData.expiresAt) {
        const expiresAt = new Date(sessionData.expiresAt);
        const now = new Date();
        
        if (now > expiresAt && sessionData.status !== 'completed') {
          console.warn('⏰ Attempting to update expired session:', sessionId);
          // Mark as expired instead of the requested update
          updates = { ...updates, status: 'expired' };
        }
      }

      // Calculate confirmation delay if transitioning to started
      if (updates.status === 'started' && sessionData.confirmedAt) {
        const confirmedAt = new Date(sessionData.confirmedAt);
        const now = new Date();
        const confirmationDelay = Math.round((now.getTime() - confirmedAt.getTime()) / 1000);
        
        updates.metadata = {
          ...sessionData.metadata,
          ...updates.metadata,
          confirmationDelay
        };
        
        console.log('📊 Session confirmation delay:', confirmationDelay, 'seconds');
      }
    }

    // Convert undefined values to null for Firestore compatibility
    const sanitizedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      acc[key] = value === undefined ? null : value;
      return acc;
    }, {} as any);

    await updateDoc(sessionRef, {
      ...sanitizedUpdates,
      updatedAt: serverTimestamp()
    });

    console.log('📝 Updated Tavus session:', sessionId, sanitizedUpdates);
  } catch (error) {
    console.error('❌ Error updating Tavus session:', error);
    throw error;
  }
};

/**
 * UPDATED: Complete a Tavus session with TTL validation
 * @param sessionId - Session ID
 * @param completionData - Completion data from Tavus
 * @returns Promise<void>
 */
export const completeTavusSession = async (
  sessionId: string,
  completionData: {
    accuracyScore?: number;
    duration?: number;
    conversationId?: string;
  }
): Promise<void> => {
  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Get session data
    const sessionRef = doc(db, 'tavusSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Session not found');
    }

    const sessionData = sessionSnap.data() as TavusSession;
    const { userId, courseId } = sessionData;

    // Check if session has expired
    if (sessionData.expiresAt) {
      const expiresAt = new Date(sessionData.expiresAt);
      const now = new Date();
      
      if (now > expiresAt) {
        console.warn('⏰ Attempting to complete expired session:', sessionId);
        await updateTavusSession(sessionId, { status: 'expired' });
        throw new Error('Session has expired and cannot be completed');
      }
    }

    // Calculate duration if not provided
    const startTime = new Date(sessionData.startedAt).getTime();
    const endTime = new Date().getTime();
    const calculatedDuration = Math.round((endTime - startTime) / 1000);

    // Update session as completed
    await updateTavusSession(sessionId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      accuracyScore: completionData.accuracyScore,
      duration: completionData.duration || calculatedDuration,
      conversationId: completionData.conversationId || sessionData.conversationId
    });

    // Update user completion status
    const completion: TavusCompletion = {
      completed: true,
      accuracyScore: completionData.accuracyScore,
      conversationId: completionData.conversationId || sessionData.conversationId,
      completedAt: new Date().toISOString()
    };

    await updateUserTavusCompletion(userId, courseId, completion);

    console.log('✅ Completed Tavus session within TTL:', sessionId);
  } catch (error) {
    console.error('❌ Error completing Tavus session:', error);
    throw error;
  }
};

/**
 * NEW: Cleanup expired Tavus sessions (for maintenance/backend)
 * This should be called periodically by a backend service
 * @param batchSize - Number of sessions to process in one batch
 * @returns Promise<number> - Number of sessions cleaned up
 */
const cleanupExpiredSessions = async (batchSize: number = 100): Promise<number> => {
  try {
    const now = new Date();
    let cleanedCount = 0;

    // This is a simplified version - in production, you'd use Cloud Functions
    // with proper querying and batching
    console.log('🧹 Starting cleanup of expired Tavus sessions...');
    
    // In a real implementation, you would:
    // 1. Query sessions where expiresAt < now AND status != 'completed' AND status != 'expired'
    // 2. Update them to status: 'expired'
    // 3. Log analytics about expired sessions
    // 4. Optionally notify users about expired sessions
    
    console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    return cleanedCount;
  } catch (error) {
    console.error('❌ Error cleaning up expired sessions:', error);
    return 0;
  }
};

/**
 * NEW: Get session analytics with TTL insights
 * @param userId - Optional user ID for user-specific analytics
 * @param timeRange - Time range in days
 * @returns Promise<object> - Analytics data
 */
const getSessionAnalytics = async (
  userId?: string,
  timeRange: number = 30
): Promise<{
  totalSessions: number;
  completedSessions: number;
  expiredSessions: number;
  averageConfirmationDelay: number;
  completionRate: number;
  expirationRate: number;
}> => {
  try {
    // This would query Firestore for session analytics
    // For now, return mock data
    console.log('📊 Getting session analytics for:', userId || 'all users');
    
    return {
      totalSessions: 0,
      completedSessions: 0,
      expiredSessions: 0,
      averageConfirmationDelay: 0,
      completionRate: 0,
      expirationRate: 0
    };
  } catch (error) {
    console.error('❌ Error getting session analytics:', error);
    throw error;
  }
};

// ... (rest of the existing functions remain the same)

/**
 * Update user's Tavus completion status with enhanced error handling
 * @param userId - User ID
 * @param courseId - Course ID
 * @param completion - Tavus completion data
 * @returns Promise<void>
 */
const updateUserTavusCompletion = async (
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
      tavusCompletions: updatedCompletions,
      updatedAt: serverTimestamp()
    });

    console.log(`✅ Updated Tavus completion for user ${userId}, course ${courseId}`);
  } catch (error) {
    console.error('❌ Error updating Tavus completion:', error);
    throw error;
  }
};

/**
 * Enhanced error handling for Tavus operations
 */
export class TavusError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'TavusError';
  }
}

/**
 * Retry mechanism for failed Tavus operations
 * @param operation - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Delay between retries in ms
 * @returns Promise<T>
 */
export const retryTavusOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Tavus operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw new TavusError(
    `Tavus operation failed after ${maxRetries} attempts`,
    'RETRY_EXHAUSTED',
    lastError
  );
};

/**
 * Offline queue for Tavus operations
 */
class TavusOfflineQueue {
  private queue: Array<{
    id: string;
    operation: string;
    data: any;
    timestamp: number;
  }> = [];

  add(operation: string, data: any): string {
    const id = `tavus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.queue.push({
      id,
      operation,
      data,
      timestamp: Date.now()
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('tavus_offline_queue', JSON.stringify(this.queue));
    
    console.log('📦 Added Tavus operation to offline queue:', id);
    return id;
  }

  async processQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    console.log('🔄 Processing Tavus offline queue:', this.queue.length, 'items');

    const processedIds: string[] = [];

    for (const item of this.queue) {
      try {
        await this.processQueueItem(item);
        processedIds.push(item.id);
      } catch (error) {
        console.error('❌ Error processing queue item:', item.id, error);
        
        // Remove items older than 24 hours
        if (Date.now() - item.timestamp > 24 * 60 * 60 * 1000) {
          processedIds.push(item.id);
          console.log('🗑️ Removing expired queue item:', item.id);
        }
      }
    }

    // Remove processed items
    this.queue = this.queue.filter(item => !processedIds.includes(item.id));
    localStorage.setItem('tavus_offline_queue', JSON.stringify(this.queue));
  }

  private async processQueueItem(item: any): Promise<void> {
    switch (item.operation) {
      case 'updateCompletion':
        await updateUserTavusCompletion(
          item.data.userId,
          item.data.courseId,
          item.data.completion
        );
        break;
      
      case 'startSession':
        await startTavusSession(
          item.data.userId,
          item.data.courseId,
          item.data.conversationUrl,
          item.data.ttl
        );
        break;
      
      default:
        console.warn('⚠️ Unknown queue operation:', item.operation);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('tavus_offline_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
        console.log('📦 Loaded Tavus offline queue:', this.queue.length, 'items');
      }
    } catch (error) {
      console.error('❌ Error loading offline queue:', error);
      this.queue = [];
    }
  }
}

// Export singleton instance
export const tavusOfflineQueue = new TavusOfflineQueue();

// Initialize offline queue on module load
tavusOfflineQueue.loadFromStorage();

// Process queue when online
window.addEventListener('online', () => {
  console.log('🌐 Back online - processing Tavus queue');
  tavusOfflineQueue.processQueue().catch(console.error);
});