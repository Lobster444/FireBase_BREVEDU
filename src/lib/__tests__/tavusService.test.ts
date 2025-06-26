import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createTavusConversation,
  endTavusConversation,
  startTavusSession,
  updateTavusSession,
  completeTavusSession,
  retryTavusOperation,
  TavusError,
  TavusNetworkError,
  TavusConfigError,
  TavusAPIError,
  TavusTimeoutError,
  tavusOfflineQueue
} from '../tavusService';

// Mock Firebase
vi.mock('../firebase', () => ({
  db: {},
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}));

// Mock toast notifications
vi.mock('../toast', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  notifyWarning: vi.fn(),
  notifyInfo: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('TavusService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    (global.fetch as any).mockClear();
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createTavusConversation', () => {
    const mockCourseId = 'test-course-123';
    const mockUserId = 'test-user-456';
    const mockSessionId = 'test-session-789';

    const mockTavusSettings = {
      replica_id: 'test-replica-id',
      persona_id: 'test-persona-id',
      api_key: 'test-api-key'
    };

    const mockCourseData = {
      conversationalContext: 'Test conversation context for JavaScript fundamentals',
      title: 'JavaScript Basics'
    };

    const mockTavusResponse = {
      conversation_id: 'tavus-conv-123',
      conversation_url: 'https://tavus.daily.co/test-conversation',
      status: 'created'
    };

    beforeEach(() => {
      // Mock Firebase getDoc for settings
      const { getDoc } = require('firebase/firestore');
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => mockTavusSettings
          });
        }
        if (ref.path?.includes(`courses/${mockCourseId}`)) {
          return Promise.resolve({
            exists: () => true,
            data: () => mockCourseData
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      // Mock updateDoc
      const { updateDoc } = require('firebase/firestore');
      updateDoc.mockResolvedValue(undefined);
    });

    it('should create Tavus conversation successfully', async () => {
      // Mock successful API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTavusResponse),
      });

      const result = await createTavusConversation(mockCourseId, mockUserId, mockSessionId);

      expect(result).toEqual(mockTavusResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://tavusapi.com/v2/conversations',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': mockTavusSettings.api_key
          },
          body: expect.stringContaining(mockTavusSettings.replica_id)
        })
      );
    });

    it('should include correct payload in API request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTavusResponse),
      });

      await createTavusConversation(mockCourseId, mockUserId, mockSessionId);

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody).toEqual({
        replica_id: mockTavusSettings.replica_id,
        persona_id: mockTavusSettings.persona_id,
        conversational_context: mockCourseData.conversationalContext,
        callback_url: expect.stringContaining(mockUserId)
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(createTavusConversation(mockCourseId, mockUserId, mockSessionId))
        .rejects.toThrow(TavusNetworkError);
    });

    it('should handle API errors with proper categorization', async () => {
      // Test 401 Unauthorized
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      await expect(createTavusConversation(mockCourseId, mockUserId, mockSessionId))
        .rejects.toThrow(TavusConfigError);

      // Test 429 Rate Limit
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
      });

      await expect(createTavusConversation(mockCourseId, mockUserId, mockSessionId))
        .rejects.toThrow(TavusAPIError);
    });

    it('should handle timeout errors', async () => {
      // Mock AbortError
      const abortError = new Error('Request timeout');
      abortError.name = 'AbortError';
      (global.fetch as any).mockRejectedValueOnce(abortError);

      await expect(createTavusConversation(mockCourseId, mockUserId, mockSessionId))
        .rejects.toThrow(TavusTimeoutError);
    });

    it('should handle missing Tavus settings', async () => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({ exists: () => false });
        }
        return Promise.resolve({ exists: () => false });
      });

      await expect(createTavusConversation(mockCourseId, mockUserId, mockSessionId))
        .rejects.toThrow(TavusConfigError);
    });

    it('should handle missing course context', async () => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => mockTavusSettings
          });
        }
        if (ref.path?.includes(`courses/${mockCourseId}`)) {
          return Promise.resolve({ exists: () => false });
        }
        return Promise.resolve({ exists: () => false });
      });

      await expect(createTavusConversation(mockCourseId, mockUserId, mockSessionId))
        .rejects.toThrow(TavusConfigError);
    });

    it('should generate valid callback URL', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTavusResponse),
      });

      await createTavusConversation(mockCourseId, mockUserId, mockSessionId);

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      
      expect(requestBody.callback_url).toMatch(/^https?:\/\/.+\/api\/tavus\/callback\/.+/);
      expect(requestBody.callback_url).toContain(mockUserId);
      expect(requestBody.callback_url).toContain(mockSessionId);
    });
  });

  describe('endTavusConversation', () => {
    const mockConversationId = 'tavus-conv-123';
    const mockTavusSettings = {
      replica_id: 'test-replica-id',
      persona_id: 'test-persona-id',
      api_key: 'test-api-key'
    };

    beforeEach(() => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockTavusSettings
      });
    });

    it('should end conversation successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'ended' }),
      });

      await expect(endTavusConversation(mockConversationId)).resolves.not.toThrow();

      expect(global.fetch).toHaveBeenCalledWith(
        `https://tavusapi.com/v2/conversations/${mockConversationId}/end`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': mockTavusSettings.api_key
          }
        })
      );
    });

    it('should handle 404 errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      // Should not throw for 404 (conversation already ended)
      await expect(endTavusConversation(mockConversationId)).resolves.not.toThrow();
    });

    it('should handle 409 errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: 'Already ended' }),
      });

      // Should not throw for 409 (conversation already ended)
      await expect(endTavusConversation(mockConversationId)).resolves.not.toThrow();
    });

    it('should throw for server errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      await expect(endTavusConversation(mockConversationId))
        .rejects.toThrow(TavusAPIError);
    });

    it('should validate conversation ID', async () => {
      await expect(endTavusConversation('')).rejects.toThrow(TavusConfigError);
      await expect(endTavusConversation('   ')).rejects.toThrow(TavusConfigError);
    });
  });

  describe('retryTavusOperation', () => {
    it('should succeed on first attempt', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');

      const result = await retryTavusOperation(mockOperation, 3, 100);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new TavusNetworkError('Network error'))
        .mockRejectedValueOnce(new TavusAPIError('Server error', 500))
        .mockResolvedValue('success');

      const result = await retryTavusOperation(mockOperation, 3, 10);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValue(new TavusConfigError('Config error'));

      await expect(retryTavusOperation(mockOperation, 3, 10))
        .rejects.toThrow(TavusConfigError);

      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should throw after max retries', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValue(new TavusNetworkError('Network error'));

      await expect(retryTavusOperation(mockOperation, 2, 10))
        .rejects.toThrow(TavusError);

      expect(mockOperation).toHaveBeenCalledTimes(2);
    });
  });

  describe('startTavusSession', () => {
    const mockUserId = 'test-user-123';
    const mockCourseId = 'test-course-456';

    beforeEach(() => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'session-123' });
    });

    it('should create session with correct data', async () => {
      const sessionId = await startTavusSession(mockUserId, mockCourseId, 120);

      expect(sessionId).toBe('session-123');

      const { addDoc } = require('firebase/firestore');
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: mockUserId,
          courseId: mockCourseId,
          status: 'confirmed',
          ttl: 180
        })
      );
    });

    it('should validate input parameters', async () => {
      await expect(startTavusSession('', mockCourseId, 120))
        .rejects.toThrow(TavusConfigError);

      await expect(startTavusSession(mockUserId, '', 120))
        .rejects.toThrow(TavusConfigError);

      await expect(startTavusSession(mockUserId, mockCourseId, 0))
        .rejects.toThrow(TavusConfigError);

      await expect(startTavusSession(mockUserId, mockCourseId, 4000))
        .rejects.toThrow(TavusConfigError);
    });

    it('should set correct expiration time', async () => {
      const beforeTime = Date.now();
      await startTavusSession(mockUserId, mockCourseId, 180);
      const afterTime = Date.now();

      const { addDoc } = require('firebase/firestore');
      const sessionData = addDoc.mock.calls[0][1];
      const expiresAt = new Date(sessionData.expiresAt).getTime();

      expect(expiresAt).toBeGreaterThanOrEqual(beforeTime + 180000);
      expect(expiresAt).toBeLessThanOrEqual(afterTime + 180000);
    });
  });

  describe('TavusOfflineQueue', () => {
    beforeEach(() => {
      // Clear localStorage
      localStorage.clear();
      // Reset queue
      tavusOfflineQueue.loadFromStorage();
    });

    it('should add operations to queue when offline', () => {
      Object.defineProperty(navigator, 'onLine', { value: false });

      const operationId = tavusOfflineQueue.add('testOperation', { test: 'data' });

      expect(operationId).toMatch(/^tavus_\d+_[a-z0-9]+$/);

      const queueStatus = tavusOfflineQueue.getQueueStatus();
      expect(queueStatus.size).toBe(1);
    });

    it('should persist queue to localStorage', () => {
      tavusOfflineQueue.add('testOperation', { test: 'data' });

      const stored = localStorage.getItem('tavus_offline_queue');
      expect(stored).toBeTruthy();

      const parsedQueue = JSON.parse(stored!);
      expect(parsedQueue).toHaveLength(1);
      expect(parsedQueue[0].operation).toBe('testOperation');
    });

    it('should load queue from localStorage', () => {
      const mockQueue = [{
        id: 'test-id',
        operation: 'testOperation',
        data: { test: 'data' },
        timestamp: Date.now(),
        retryCount: 0
      }];

      localStorage.setItem('tavus_offline_queue', JSON.stringify(mockQueue));
      tavusOfflineQueue.loadFromStorage();

      const queueStatus = tavusOfflineQueue.getQueueStatus();
      expect(queueStatus.size).toBe(1);
    });

    it('should clean up expired items', () => {
      const expiredItem = {
        id: 'expired-id',
        operation: 'testOperation',
        data: { test: 'data' },
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        retryCount: 0
      };

      localStorage.setItem('tavus_offline_queue', JSON.stringify([expiredItem]));
      tavusOfflineQueue.loadFromStorage();

      const queueStatus = tavusOfflineQueue.getQueueStatus();
      expect(queueStatus.size).toBe(0);
    });
  });

  describe('Error Classes', () => {
    it('should create TavusNetworkError with correct properties', () => {
      const error = new TavusNetworkError('Network failed', { status: 0 });

      expect(error).toBeInstanceOf(TavusError);
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.retryable).toBe(true);
      expect(error.message).toBe('Network failed');
    });

    it('should create TavusConfigError with correct properties', () => {
      const error = new TavusConfigError('Config missing');

      expect(error).toBeInstanceOf(TavusError);
      expect(error.code).toBe('CONFIG_ERROR');
      expect(error.retryable).toBe(false);
    });

    it('should create TavusAPIError with retryable based on status', () => {
      const retryableError = new TavusAPIError('Server error', 500);
      expect(retryableError.retryable).toBe(true);

      const nonRetryableError = new TavusAPIError('Bad request', 400);
      expect(nonRetryableError.retryable).toBe(false);
    });

    it('should create TavusTimeoutError with correct properties', () => {
      const error = new TavusTimeoutError('Request timeout');

      expect(error).toBeInstanceOf(TavusError);
      expect(error.code).toBe('TIMEOUT_ERROR');
      expect(error.retryable).toBe(true);
    });
  });
});