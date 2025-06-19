import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User, TavusCompletion } from '../types';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from './toast';

/**
 * Enhanced Tavus service for handling AI practice sessions with dynamic API integration
 * Phase 4: Enhanced error handling and offline fallback
 */

interface TavusSession {
  id?: string;
  userId: string;
  courseId: string;
  conversationId?: string | null;
  tavusConversationId?: string;
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
    callbackUrl?: string;
    retryCount?: number; // NEW: Track retry attempts
    lastError?: string; // NEW: Store last error for debugging
  };
}

interface TavusConversationRequest {
  replica_id: string;
  persona_id: string;
  conversational_context: string;
  callback_url: string;
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
 * Enhanced error classes for better error handling
 */
export class TavusError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'TavusError';
  }
}

export class TavusNetworkError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details, true);
  }
}

export class TavusConfigError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIG_ERROR', details, false);
  }
}

export class TavusAPIError extends TavusError {
  constructor(message: string, status: number, details?: any) {
    super(message, 'API_ERROR', { status, ...details }, status >= 500);
  }
}

export class TavusTimeoutError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'TIMEOUT_ERROR', details, true);
  }
}

/**
 * Enhanced network status detection
 */
const isNetworkAvailable = (): boolean => {
  return navigator.onLine;
};

/**
 * Enhanced retry mechanism with exponential backoff and jitter
 */
export const retryTavusOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry non-retryable errors
      if (error instanceof TavusError && !error.retryable) {
        throw error;
      }
      
      console.warn(`⚠️ Tavus operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
          maxDelay
        );
        
        console.log(`⏳ Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new TavusError(
    `Operation failed after ${maxRetries} attempts: ${lastError.message}`,
    'RETRY_EXHAUSTED',
    lastError,
    false
  );
};

/**
 * Enhanced offline queue with persistence and error recovery
 */
class TavusOfflineQueue {
  private queue: Array<{
    id: string;
    operation: string;
    data: any;
    timestamp: number;
    retryCount: number;
    lastError?: string;
  }> = [];

  private readonly STORAGE_KEY = 'tavus_offline_queue';
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly MAX_RETRY_COUNT = 5;
  private readonly ITEM_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Process queue when coming back online
    window.addEventListener('online', () => {
      console.log('🌐 Network restored - processing Tavus offline queue');
      this.processQueue().catch(console.error);
    });

    // Clean up queue periodically
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 60 * 60 * 1000); // Every hour
  }

  add(operation: string, data: any): string {
    const id = `tavus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Remove oldest items if queue is full
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.queue.shift();
      console.warn('⚠️ Offline queue full, removing oldest item');
    }
    
    const item = {
      id,
      operation,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    this.queue.push(item);
    this.saveToStorage();
    
    console.log('📦 Added operation to offline queue:', id, operation);
    notifyInfo('📦 Operation queued for when you\'re back online');
    
    return id;
  }

  async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      console.log('📦 Offline queue is empty');
      return;
    }

    if (!isNetworkAvailable()) {
      console.log('📡 Still offline, cannot process queue');
      return;
    }

    console.log('🔄 Processing Tavus offline queue:', this.queue.length, 'items');
    
    const processedIds: string[] = [];
    const failedItems: typeof this.queue = [];

    for (const item of this.queue) {
      try {
        await this.processQueueItem(item);
        processedIds.push(item.id);
        console.log('✅ Processed queue item:', item.id);
      } catch (error) {
        console.error('❌ Error processing queue item:', item.id, error);
        
        item.retryCount++;
        item.lastError = error instanceof Error ? error.message : 'Unknown error';
        
        // Remove items that have exceeded retry limit or are expired
        if (item.retryCount >= this.MAX_RETRY_COUNT || this.isExpired(item)) {
          processedIds.push(item.id);
          console.log('🗑️ Removing failed/expired queue item:', item.id);
        } else {
          failedItems.push(item);
        }
      }
    }

    // Update queue with failed items that can be retried
    this.queue = failedItems;
    this.saveToStorage();

    if (processedIds.length > 0) {
      notifySuccess(`✅ Processed ${processedIds.length} queued operations`);
    }

    if (failedItems.length > 0) {
      notifyWarning(`⚠️ ${failedItems.length} operations will be retried later`);
    }
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

      case 'createConversation':
        await createTavusConversation(
          item.data.courseId,
          item.data.userId,
          item.data.sessionId
        );
        break;

      case 'endConversation':
        await endTavusConversation(item.data.conversationId);
        break;
      
      default:
        throw new TavusError(`Unknown queue operation: ${item.operation}`, 'UNKNOWN_OPERATION');
    }
  }

  private isExpired(item: any): boolean {
    return Date.now() - item.timestamp > this.ITEM_EXPIRY_MS;
  }

  private cleanupExpiredItems(): void {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(item => !this.isExpired(item));
    
    if (this.queue.length < initialLength) {
      console.log(`🧹 Cleaned up ${initialLength - this.queue.length} expired queue items`);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('❌ Error saving offline queue to storage:', error);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        console.log('📦 Loaded Tavus offline queue:', this.queue.length, 'items');
        
        // Clean up expired items on load
        this.cleanupExpiredItems();
      }
    } catch (error) {
      console.error('❌ Error loading offline queue from storage:', error);
      this.queue = [];
    }
  }

  getQueueStatus(): { size: number; oldestItem?: number } {
    return {
      size: this.queue.length,
      oldestItem: this.queue.length > 0 ? this.queue[0].timestamp : undefined
    };
  }
}

// Export singleton instance
export const tavusOfflineQueue = new TavusOfflineQueue();

/**
 * Enhanced wrapper for offline-aware operations
 */
export const executeWithOfflineFallback = async <T>(
  operation: () => Promise<T>,
  fallbackData: { operation: string; data: any },
  operationName: string = 'Tavus operation'
): Promise<T | null> => {
  if (!isNetworkAvailable()) {
    console.log(`📡 Offline - queuing ${operationName}`);
    tavusOfflineQueue.add(fallbackData.operation, fallbackData.data);
    notifyWarning(`📡 ${operationName} queued - will process when online`);
    return null;
  }

  try {
    return await retryTavusOperation(operation, 3, 1000);
  } catch (error) {
    console.error(`❌ ${operationName} failed:`, error);
    
    // Queue for retry if it's a retryable error
    if (error instanceof TavusError && error.retryable) {
      console.log(`📦 Queuing failed ${operationName} for retry`);
      tavusOfflineQueue.add(fallbackData.operation, fallbackData.data);
      notifyWarning(`⚠️ ${operationName} failed - queued for retry`);
      return null;
    }
    
    throw error;
  }
};

/**
 * Enhanced Tavus conversation creation with comprehensive error handling
 */
export const createTavusConversation = async (
  courseId: string,
  userId: string,
  sessionId: string
): Promise<TavusConversationResponse> => {
  try {
    console.log('🚀 Creating Tavus conversation via API for course:', courseId);

    if (!isNetworkAvailable()) {
      throw new TavusNetworkError('No internet connection available');
    }

    // Get Tavus settings with enhanced error handling
    const settings = await getTavusSettings();
    if (!settings) {
      throw new TavusConfigError('Tavus settings not configured. Please contact administrator.');
    }

    // Get course conversational context with fallback
    const courseContext = await getCourseConversationalContext(courseId);
    if (!courseContext) {
      throw new TavusConfigError('Course conversational context not found.');
    }

    // Generate unique callback URL
    const callbackUrl = generateCallbackUrl(userId, sessionId);

    // Prepare API request
    const requestPayload: TavusConversationRequest = {
      replica_id: settings.replica_id,
      persona_id: settings.persona_id,
      conversational_context: courseContext,
      callback_url: callbackUrl
    };

    console.log('📤 Tavus API request payload:', {
      ...requestPayload,
      api_key: '[REDACTED]'
    });

    // Call Tavus API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response: Response;
    try {
      response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.api_key
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new TavusTimeoutError('Request timed out after 30 seconds');
      }
      
      if (!isNetworkAvailable()) {
        throw new TavusNetworkError('Network connection lost during request');
      }
      
      throw new TavusNetworkError(`Network error: ${error.message}`, error);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      console.error('❌ Tavus API error:', response.status, errorData);
      
      // Categorize API errors
      if (response.status === 401) {
        throw new TavusConfigError('Invalid Tavus API key');
      } else if (response.status === 403) {
        throw new TavusConfigError('Tavus API access forbidden - check permissions');
      } else if (response.status === 404) {
        throw new TavusConfigError('Tavus API endpoint not found');
      } else if (response.status === 429) {
        throw new TavusAPIError('Tavus API rate limit exceeded', response.status, errorData);
      } else if (response.status >= 500) {
        throw new TavusAPIError('Tavus service temporarily unavailable', response.status, errorData);
      } else {
        throw new TavusAPIError(`Tavus API error: ${response.status}`, response.status, errorData);
      }
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
    
    // Update session with error information
    if (sessionId) {
      try {
        await updateTavusSession(sessionId, {
          status: 'failed',
          metadata: {
            lastError: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      } catch (updateError) {
        console.error('❌ Error updating session with failure:', updateError);
      }
    }
    
    throw error;
  }
};

/**
 * Enhanced Tavus settings retrieval with validation
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
      console.error('❌ Incomplete Tavus settings:', {
        hasReplicaId: !!data.replica_id,
        hasPersonaId: !!data.persona_id,
        hasApiKey: !!data.api_key
      });
      throw new TavusConfigError('Tavus settings are incomplete. Missing replica_id, persona_id, or api_key.');
    }

    // Validate format
    if (typeof data.replica_id !== 'string' || data.replica_id.trim().length === 0) {
      throw new TavusConfigError('Invalid replica_id format');
    }
    
    if (typeof data.persona_id !== 'string' || data.persona_id.trim().length === 0) {
      throw new TavusConfigError('Invalid persona_id format');
    }
    
    if (typeof data.api_key !== 'string' || data.api_key.trim().length === 0) {
      throw new TavusConfigError('Invalid api_key format');
    }

    return {
      replica_id: data.replica_id.trim(),
      persona_id: data.persona_id.trim(),
      api_key: data.api_key.trim()
    };
  } catch (error) {
    console.error('❌ Error fetching Tavus settings:', error);
    throw error;
  }
};

/**
 * Enhanced course context retrieval with fallbacks
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
    
    // Try multiple context fields
    let context = courseData.conversationalContext || 
                  courseData.tavusConversationalContext ||
                  courseData.description;
    
    if (!context || context.trim().length === 0) {
      console.warn('⚠️ No conversational context found for course:', courseId);
      // Final fallback
      context = `Practice conversation about ${courseData.title || 'the course topic'}. Help the student understand key concepts through interactive dialogue.`;
    }

    // Validate context length
    if (context.length > 1000) {
      console.warn('⚠️ Conversational context too long, truncating:', context.length);
      context = context.substring(0, 997) + '...';
    }

    return context.trim();
  } catch (error) {
    console.error('❌ Error fetching course conversational context:', error);
    throw new TavusConfigError(`Failed to get course context: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Enhanced callback URL generation with validation
 */
const generateCallbackUrl = (userId: string, sessionId: string): string => {
  try {
    const baseUrl = window.location.origin;
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Validate inputs
    if (!userId || !sessionId) {
      throw new Error('userId and sessionId are required');
    }
    
    const callbackUrl = `${baseUrl}/api/tavus/callback/${encodeURIComponent(userId)}/${encodeURIComponent(sessionId)}/${timestamp}/${randomId}`;
    
    // Validate URL format
    try {
      new URL(callbackUrl);
    } catch {
      throw new Error('Generated invalid callback URL');
    }
    
    return callbackUrl;
  } catch (error) {
    console.error('❌ Error generating callback URL:', error);
    throw new TavusConfigError(`Failed to generate callback URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Enhanced conversation ending with comprehensive error handling
 */
export const endTavusConversation = async (conversationId: string): Promise<void> => {
  try {
    console.log('🛑 Ending Tavus conversation:', conversationId);

    if (!conversationId || conversationId.trim().length === 0) {
      throw new TavusConfigError('Invalid conversation ID');
    }

    if (!isNetworkAvailable()) {
      throw new TavusNetworkError('No internet connection available');
    }

    const settings = await getTavusSettings();
    if (!settings) {
      throw new TavusConfigError('Tavus settings not configured');
    }

    // Call API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    let response: Response;
    try {
      response = await fetch(`https://tavusapi.com/v2/conversations/${encodeURIComponent(conversationId)}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.api_key
        },
        signal: controller.signal
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new TavusTimeoutError('End conversation request timed out');
      }
      
      if (!isNetworkAvailable()) {
        throw new TavusNetworkError('Network connection lost during request');
      }
      
      throw new TavusNetworkError(`Network error: ${error.message}`, error);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      console.error('❌ Error ending Tavus conversation:', response.status, errorData);
      
      // Some errors are acceptable (conversation already ended, etc.)
      if (response.status === 404) {
        console.log('ℹ️ Conversation not found (may already be ended)');
        return; // Don't throw error for 404
      } else if (response.status === 409) {
        console.log('ℹ️ Conversation already ended');
        return; // Don't throw error for 409
      } else if (response.status >= 500) {
        throw new TavusAPIError('Tavus service error when ending conversation', response.status, errorData);
      } else {
        throw new TavusAPIError(`Failed to end conversation: ${response.status}`, response.status, errorData);
      }
    }

    console.log('✅ Tavus conversation ended successfully');
  } catch (error) {
    console.error('❌ Error ending Tavus conversation:', error);
    
    // Don't throw for certain acceptable errors
    if (error instanceof TavusAPIError && [404, 409].includes(error.details?.status)) {
      return;
    }
    
    throw error;
  }
};

/**
 * Enhanced session management with better error handling
 */
export const startTavusSession = async (
  userId: string,
  courseId: string,
  ttl: number = 180
): Promise<string> => {
  try {
    if (!userId || !courseId) {
      throw new TavusConfigError('User ID and Course ID are required');
    }

    if (ttl <= 0 || ttl > 3600) {
      throw new TavusConfigError('TTL must be between 1 and 3600 seconds');
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
      conversationId: null,
      tavusConversationId: null,
      status: 'confirmed',
      confirmedAt: now.toISOString(),
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ttl,
      metadata: {
        userAgent: navigator.userAgent,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        confirmationDelay: 0,
        retryCount: 0
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
 * Enhanced session updates with validation
 */
export const updateTavusSession = async (
  sessionId: string,
  updates: Partial<TavusSession>
): Promise<void> => {
  try {
    if (!sessionId || sessionId.trim().length === 0) {
      throw new TavusConfigError('Session ID is required');
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
        
        if (now > expiresAt && sessionData.status !== 'completed' && updates.status !== 'expired') {
          console.warn('⏰ Attempting to update expired session:', sessionId);
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
 * Enhanced session completion with validation
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
    if (!sessionId || sessionId.trim().length === 0) {
      throw new TavusConfigError('Session ID is required');
    }

    // Get session data
    const sessionRef = doc(db, 'tavusSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new TavusConfigError('Session not found');
    }

    const sessionData = sessionSnap.data() as TavusSession;
    const { userId, courseId } = sessionData;

    if (!userId || !courseId) {
      throw new TavusConfigError('Session missing required user or course data');
    }

    // Check if session has expired
    if (sessionData.expiresAt) {
      const expiresAt = new Date(sessionData.expiresAt);
      const now = new Date();
      
      if (now > expiresAt) {
        console.warn('⏰ Attempting to complete expired session:', sessionId);
        await updateTavusSession(sessionId, { status: 'expired' });
        throw new TavusTimeoutError('Session has expired and cannot be completed');
      }
    }

    // Calculate duration if not provided
    const startTime = new Date(sessionData.startedAt).getTime();
    const endTime = new Date().getTime();
    const calculatedDuration = Math.round((endTime - startTime) / 1000);

    // Validate completion data
    if (completionData.accuracyScore !== undefined) {
      if (completionData.accuracyScore < 0 || completionData.accuracyScore > 100) {
        console.warn('⚠️ Invalid accuracy score, clamping:', completionData.accuracyScore);
        completionData.accuracyScore = Math.max(0, Math.min(100, completionData.accuracyScore));
      }
    }

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
 * Enhanced user completion updates with validation
 */
const updateUserTavusCompletion = async (
  userId: string,
  courseId: string,
  completion: TavusCompletion
): Promise<void> => {
  try {
    if (!userId || !courseId) {
      throw new TavusConfigError('User ID and Course ID are required');
    }

    if (!completion.completedAt) {
      completion.completedAt = new Date().toISOString();
    }

    const userRef = doc(db, 'users', userId);
    
    // Get current user data to preserve existing completions
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new TavusConfigError('User not found');
    }

    const userData = userSnap.data() as User;
    const currentCompletions = userData.tavusCompletions || {};

    // Update the specific course completion
    const updatedCompletions = {
      ...currentCompletions,
      [courseId]: {
        ...completion,
        completedAt: completion.completedAt
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
 * Health check for Tavus service
 */
export const checkTavusHealth = async (): Promise<{
  settings: boolean;
  api: boolean;
  network: boolean;
  queue: { size: number; oldestItem?: number };
}> => {
  const result = {
    settings: false,
    api: false,
    network: isNetworkAvailable(),
    queue: tavusOfflineQueue.getQueueStatus()
  };

  try {
    // Check settings
    const settings = await getTavusSettings();
    result.settings = !!settings;

    // Check API connectivity (if network is available)
    if (result.network && settings) {
      try {
        const response = await fetch('https://tavusapi.com/v2/health', {
          method: 'GET',
          headers: {
            'x-api-key': settings.api_key
          }
        });
        result.api = response.ok;
      } catch {
        result.api = false;
      }
    }
  } catch {
    // Settings check failed
  }

  return result;
};