import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User, TavusCompletion } from '../types';
import { notifySuccess, notifyError, notifyWarning } from './toast';

/**
 * Enhanced Tavus service for handling AI practice sessions with dynamic API integration
 */

interface TavusSession {
  id?: string;
  userId: string;
  courseId: string;
  conversationId?: string | null;
  tavusConversationId?: string; // NEW: Actual Tavus conversation ID from API
  status: 'confirmed' | 'started' | 'in_progress' | 'completed' | 'failed' | 'abandoned' | 'expired';
  confirmedAt?: string;
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  accuracyScore?: number;
  duration?: number;
  ttl?: number;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    deviceType?: string;
    confirmationDelay?: number;
    callbackUrl?: string; // NEW: Store callback URL
  };
}

interface TavusConversationRequest {
  replica_id: string;
  persona_id: string;
  conversational_context: string;
  callback_url: string;
  ttl: number;
}

interface TavusConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: string;
}

interface TavusSettings {
  replica_id: string;
  persona_id: string;
  api_key: string;
}

/**
 * NEW: Create a Tavus conversation via API
 * @param courseId - Course ID to get conversational context
 * @param userId - User ID for callback URL generation
 * @param sessionId - Session ID for tracking
 * @returns Promise<TavusConversationResponse>
 */
export const createTavusConversation = async (
  courseId: string,
  userId: string,
  sessionId: string
): Promise<TavusConversationResponse> => {
  try {
    console.log('🚀 Creating Tavus conversation via API for course:', courseId);

    // Get Tavus settings from Firebase
    const settings = await getTavusSettings();
    if (!settings) {
      throw new Error('Tavus settings not configured. Please contact administrator.');
    }

    // Get course conversational context
    const courseContext = await getCourseConversationalContext(courseId);
    if (!courseContext) {
      throw new Error('Course conversational context not found.');
    }

    // Generate unique callback URL
    const callbackUrl = generateCallbackUrl(userId, sessionId);

    // Prepare API request
    const requestPayload: TavusConversationRequest = {
      replica_id: settings.replica_id,
      persona_id: settings.persona_id,
      conversational_context: courseContext,
      callback_url: callbackUrl,
      ttl: 180 // 3 minutes
    };

    console.log('📤 Tavus API request payload:', {
      ...requestPayload,
      api_key: '[REDACTED]'
    });

    // Call Tavus API
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.api_key
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Tavus API error:', response.status, errorData);
      throw new Error(`Tavus API error: ${response.status} - ${errorData}`);
    }

    const conversationData: TavusConversationResponse = await response.json();
    console.log('✅ Tavus conversation created:', conversationData.conversation_id);

    // Update session with Tavus conversation ID and callback URL
    await updateTavusSession(sessionId, {
      tavusConversationId: conversationData.conversation_id,
      conversationId: conversationData.conversation_url,
      metadata: {
        callbackUrl: callbackUrl
      }
    });

    return conversationData;
  } catch (error) {
    console.error('❌ Error creating Tavus conversation:', error);
    throw error;
  }
};

/**
 * NEW: Get Tavus settings from Firebase
 * @returns Promise<TavusSettings | null>
 */
const getTavusSettings = async (): Promise<TavusSettings | null> => {
  try {
    const settingsRef = doc(db, 'settings', 'tavus');
    const settingsSnap = await getDoc(settingsRef);
    
    if (!settingsSnap.exists()) {
      console.warn('⚠️ Tavus settings not found in Firebase');
      return null;
    }

    const data = settingsSnap.data();
    
    // Validate required fields
    if (!data.replica_id || !data.persona_id || !data.api_key) {
      console.error('❌ Incomplete Tavus settings:', data);
      throw new Error('Tavus settings are incomplete. Missing replica_id, persona_id, or api_key.');
    }

    return {
      replica_id: data.replica_id,
      persona_id: data.persona_id,
      api_key: data.api_key
    };
  } catch (error) {
    console.error('❌ Error fetching Tavus settings:', error);
    throw error;
  }
};

/**
 * NEW: Get course conversational context from Firebase
 * @param courseId - Course ID
 * @returns Promise<string | null>
 */
const getCourseConversationalContext = async (courseId: string): Promise<string | null> => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) {
      console.warn('⚠️ Course not found:', courseId);
      return null;
    }

    const courseData = courseSnap.data();
    const context = courseData.conversationalContext || courseData.tavusConversationalContext;
    
    if (!context) {
      console.warn('⚠️ No conversational context found for course:', courseId);
      // Fallback to course description
      return courseData.description || 'General learning conversation about the course topic.';
    }

    return context;
  } catch (error) {
    console.error('❌ Error fetching course conversational context:', error);
    throw error;
  }
};

/**
 * NEW: Generate unique callback URL for user session
 * @param userId - User ID
 * @param sessionId - Session ID
 * @returns string - Callback URL
 */
const generateCallbackUrl = (userId: string, sessionId: string): string => {
  const baseUrl = window.location.origin;
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  
  return `${baseUrl}/api/tavus/callback/${userId}/${sessionId}/${timestamp}/${randomId}`;
};

/**
 * NEW: End Tavus conversation via API
 * @param conversationId - Tavus conversation ID
 * @returns Promise<void>
 */
export const endTavusConversation = async (conversationId: string): Promise<void> => {
  try {
    console.log('🛑 Ending Tavus conversation:', conversationId);

    const settings = await getTavusSettings();
    if (!settings) {
      throw new Error('Tavus settings not configured');
    }

    const response = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.api_key
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Error ending Tavus conversation:', response.status, errorData);
      throw new Error(`Failed to end conversation: ${response.status}`);
    }

    console.log('✅ Tavus conversation ended successfully');
  } catch (error) {
    console.error('❌ Error ending Tavus conversation:', error);
    throw error;
  }
};

/**
 * UPDATED: Start a new Tavus session with dynamic API integration
 * @param userId - User ID
 * @param courseId - Course ID
 * @param ttl - Time to live in seconds (default 180 = 3 minutes)
 * @returns Promise<string> - Session ID
 */
export const startTavusSession = async (
  userId: string,
  courseId: string,
  ttl: number = 180 // Default 3 minutes for API conversations
): Promise<string> => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID and Course ID are required');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttl * 1000));

    console.log('🚀 Creating Tavus session for API conversation:', {
      userId,
      courseId,
      ttl: `${ttl}s`,
      expiresAt: expiresAt.toISOString()
    });

    const sessionData: Omit<TavusSession, 'id'> = {
      userId,
      courseId,
      conversationId: null, // Will be set after API call
      tavusConversationId: null, // Will be set after API call
      status: 'confirmed',
      confirmedAt: now.toISOString(),
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ttl,
      metadata: {
        userAgent: navigator.userAgent,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        confirmationDelay: 0
      }
    };

    const sessionRef = await addDoc(collection(db, 'tavusSessions'), {
      ...sessionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Tavus session created:', sessionRef.id);
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