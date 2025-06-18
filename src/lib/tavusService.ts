import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User, TavusCompletion } from '../types';
import { notifySuccess, notifyError, notifyWarning } from './toast';

/**
 * Enhanced Tavus service for handling AI practice sessions
 */

export interface TavusSession {
  id?: string;
  userId: string;
  courseId: string;
  conversationId?: string | null;
  status: 'started' | 'in_progress' | 'completed' | 'failed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  accuracyScore?: number;
  duration?: number; // in seconds
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    deviceType?: string;
  };
}

export interface TavusWebhookPayload {
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
 * Start a new Tavus session and track it in Firestore
 * @param userId - User ID
 * @param courseId - Course ID
 * @param conversationUrl - Optional Tavus conversation URL
 * @returns Promise<string> - Session ID
 */
export const startTavusSession = async (
  userId: string,
  courseId: string,
  conversationUrl?: string
): Promise<string> => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }

    const sessionData: Omit<TavusSession, 'id'> = {
      userId,
      courseId,
      conversationId: conversationUrl || null, // Convert undefined to null for Firestore
      status: 'started',
      startedAt: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      }
    };

    const sessionRef = await addDoc(collection(db, 'tavusSessions'), {
      ...sessionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('🚀 Started Tavus session:', sessionRef.id);
    return sessionRef.id;
  } catch (error) {
    console.error('❌ Error starting Tavus session:', error);
    throw error;
  }
};

/**
 * Update Tavus session status
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

    // Convert undefined values to null for Firestore compatibility
    const sanitizedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      acc[key] = value === undefined ? null : value;
      return acc;
    }, {} as any);

    const sessionRef = doc(db, 'tavusSessions', sessionId);
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
 * Complete a Tavus session and update user completion status
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

    console.log('✅ Completed Tavus session:', sessionId);
  } catch (error) {
    console.error('❌ Error completing Tavus session:', error);
    throw error;
  }
};

/**
 * Update user's Tavus completion status with enhanced error handling
 * @param userId - User ID
 * @param courseId - Course ID
 * @param completion - Tavus completion data
 * @returns Promise<void>
 */
export const updateUserTavusCompletion = async (
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
 * Handle Tavus webhook payload (for server-side callbacks)
 * @param payload - Webhook payload from Tavus
 * @param signature - Webhook signature for verification
 * @returns Promise<void>
 */
export const handleTavusWebhook = async (
  payload: TavusWebhookPayload,
  signature?: string
): Promise<void> => {
  try {
    // Verify webhook signature if provided
    if (signature && !verifyTavusSignature(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }

    const { event_type, conversation_id, user_id, course_id, data } = payload;

    console.log('📨 Processing Tavus webhook:', event_type, conversation_id);

    switch (event_type) {
      case 'conversation_started':
        await handleConversationStarted(user_id, course_id, conversation_id);
        break;

      case 'conversation_completed':
        await handleConversationCompleted(
          user_id,
          course_id,
          conversation_id,
          data
        );
        break;

      case 'conversation_failed':
        await handleConversationFailed(
          user_id,
          course_id,
          conversation_id,
          data?.error_message
        );
        break;

      default:
        console.warn('⚠️ Unknown webhook event type:', event_type);
    }
  } catch (error) {
    console.error('❌ Error handling Tavus webhook:', error);
    throw error;
  }
};

/**
 * Handle conversation started webhook
 */
const handleConversationStarted = async (
  userId: string,
  courseId: string,
  conversationId: string
): Promise<void> => {
  try {
    // Find existing session or create new one
    const sessionId = await startTavusSession(userId, courseId, conversationId);
    
    await updateTavusSession(sessionId, {
      status: 'in_progress',
      conversationId
    });

    console.log('🎬 Conversation started:', conversationId);
  } catch (error) {
    console.error('❌ Error handling conversation started:', error);
  }
};

/**
 * Handle conversation completed webhook
 */
const handleConversationCompleted = async (
  userId: string,
  courseId: string,
  conversationId: string,
  data?: any
): Promise<void> => {
  try {
    const completion: TavusCompletion = {
      completed: true,
      accuracyScore: data?.accuracy_score,
      conversationId,
      completedAt: new Date().toISOString()
    };

    await updateUserTavusCompletion(userId, courseId, completion);

    // Log completion event
    await addDoc(collection(db, 'tavusEvents'), {
      type: 'completion',
      userId,
      courseId,
      conversationId,
      data,
      timestamp: serverTimestamp()
    });

    console.log('🎉 Conversation completed:', conversationId);
  } catch (error) {
    console.error('❌ Error handling conversation completed:', error);
  }
};

/**
 * Handle conversation failed webhook
 */
const handleConversationFailed = async (
  userId: string,
  courseId: string,
  conversationId: string,
  errorMessage?: string
): Promise<void> => {
  try {
    // Log failure event
    await addDoc(collection(db, 'tavusEvents'), {
      type: 'failure',
      userId,
      courseId,
      conversationId,
      error: errorMessage,
      timestamp: serverTimestamp()
    });

    console.log('❌ Conversation failed:', conversationId, errorMessage);
  } catch (error) {
    console.error('❌ Error handling conversation failed:', error);
  }
};

/**
 * Verify Tavus webhook signature
 * @param payload - Webhook payload
 * @param signature - Provided signature
 * @returns boolean - Whether signature is valid
 */
const verifyTavusSignature = (
  payload: TavusWebhookPayload,
  signature: string
): boolean => {
  try {
    // This would typically use a shared secret from environment variables
    // For now, we'll implement basic validation
    const expectedSignature = generateTavusSignature(payload);
    return signature === expectedSignature;
  } catch (error) {
    console.error('❌ Error verifying Tavus signature:', error);
    return false;
  }
};

/**
 * Generate expected Tavus signature (placeholder implementation)
 * @param payload - Webhook payload
 * @returns string - Expected signature
 */
const generateTavusSignature = (payload: TavusWebhookPayload): string => {
  // This is a placeholder implementation
  // In production, this would use HMAC-SHA256 with a shared secret
  const payloadString = JSON.stringify(payload);
  return btoa(payloadString).slice(0, 32);
};

/**
 * Get Tavus session analytics for a user
 * @param userId - User ID
 * @returns Promise<TavusSession[]>
 */
export const getTavusSessionAnalytics = async (
  userId: string
): Promise<TavusSession[]> => {
  try {
    // This would typically query Firestore for user sessions
    // For now, return empty array as placeholder
    console.log('📊 Getting Tavus analytics for user:', userId);
    return [];
  } catch (error) {
    console.error('❌ Error getting Tavus analytics:', error);
    return [];
  }
};

/**
 * Cleanup abandoned Tavus sessions (for maintenance)
 * @param maxAgeHours - Maximum age in hours for abandoned sessions
 * @returns Promise<number> - Number of cleaned up sessions
 */
export const cleanupAbandonedSessions = async (
  maxAgeHours: number = 24
): Promise<number> => {
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);
    
    // This would query and update abandoned sessions
    // For now, return 0 as placeholder
    console.log('🧹 Cleaning up abandoned sessions older than:', cutoffTime);
    return 0;
  } catch (error) {
    console.error('❌ Error cleaning up abandoned sessions:', error);
    return 0;
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
          item.data.conversationUrl
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