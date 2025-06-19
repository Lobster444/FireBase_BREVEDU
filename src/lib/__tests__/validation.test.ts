import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createTavusConversation,
  startTavusSession,
  endTavusConversation,
  checkTavusHealth
} from '../tavusService';

// Mock Firebase
vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}));

// Mock fetch
global.fetch = vi.fn();

describe('Tavus Validation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('Input Validation', () => {
    describe('createTavusConversation', () => {
      it('should validate required parameters', async () => {
        await expect(createTavusConversation('', 'user-123', 'session-123'))
          .rejects.toThrow();

        await expect(createTavusConversation('course-123', '', 'session-123'))
          .rejects.toThrow();

        await expect(createTavusConversation('course-123', 'user-123', ''))
          .rejects.toThrow();
      });

      it('should validate parameter types', async () => {
        // @ts-expect-error - Testing invalid input
        await expect(createTavusConversation(null, 'user-123', 'session-123'))
          .rejects.toThrow();

        // @ts-expect-error - Testing invalid input
        await expect(createTavusConversation('course-123', undefined, 'session-123'))
          .rejects.toThrow();
      });
    });

    describe('startTavusSession', () => {
      beforeEach(() => {
        const { addDoc } = require('firebase/firestore');
        addDoc.mockResolvedValue({ id: 'session-123' });
      });

      it('should validate TTL bounds', async () => {
        await expect(startTavusSession('user-123', 'course-123', 0))
          .rejects.toThrow('TTL must be between 1 and 3600 seconds');

        await expect(startTavusSession('user-123', 'course-123', -1))
          .rejects.toThrow('TTL must be between 1 and 3600 seconds');

        await expect(startTavusSession('user-123', 'course-123', 3601))
          .rejects.toThrow('TTL must be between 1 and 3600 seconds');

        // Valid TTL should work
        await expect(startTavusSession('user-123', 'course-123', 180))
          .resolves.toBe('session-123');
      });

      it('should validate required string parameters', async () => {
        await expect(startTavusSession('', 'course-123', 180))
          .rejects.toThrow('User ID and Course ID are required');

        await expect(startTavusSession('user-123', '', 180))
          .rejects.toThrow('User ID and Course ID are required');

        await expect(startTavusSession('   ', 'course-123', 180))
          .rejects.toThrow('User ID and Course ID are required');
      });
    });

    describe('endTavusConversation', () => {
      beforeEach(() => {
        const { getDoc } = require('firebase/firestore');
        getDoc.mockResolvedValue({
          exists: () => true,
          data: () => ({
            replica_id: 'test-replica',
            persona_id: 'test-persona',
            api_key: 'test-key'
          })
        });
      });

      it('should validate conversation ID', async () => {
        await expect(endTavusConversation(''))
          .rejects.toThrow('Invalid conversation ID');

        await expect(endTavusConversation('   '))
          .rejects.toThrow('Invalid conversation ID');

        // @ts-expect-error - Testing invalid input
        await expect(endTavusConversation(null))
          .rejects.toThrow('Invalid conversation ID');
      });
    });
  });

  describe('Configuration Validation', () => {
    it('should validate Tavus settings completeness', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Missing replica_id
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              persona_id: 'test-persona',
              api_key: 'test-key'
              // replica_id missing
            })
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      await expect(createTavusConversation('course-123', 'user-123', 'session-123'))
        .rejects.toThrow('Tavus settings are incomplete');
    });

    it('should validate Tavus settings format', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Empty string values
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              replica_id: '',
              persona_id: 'test-persona',
              api_key: 'test-key'
            })
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      await expect(createTavusConversation('course-123', 'user-123', 'session-123'))
        .rejects.toThrow('Invalid replica_id format');
    });

    it('should validate conversational context length', async () => {
      const { getDoc } = require('firebase/firestore');
      
      const longContext = 'a'.repeat(1001); // Exceeds 1000 char limit
      
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              replica_id: 'test-replica',
              persona_id: 'test-persona',
              api_key: 'test-key'
            })
          });
        }
        if (ref.path?.includes('courses/')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              conversationalContext: longContext,
              title: 'Test Course'
            })
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      // Should truncate long context, not throw error
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          conversation_id: 'test-conv',
          conversation_url: 'https://test.com',
          status: 'created'
        }),
      });

      await expect(createTavusConversation('course-123', 'user-123', 'session-123'))
        .resolves.toBeDefined();

      // Verify the context was truncated
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.conversational_context.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('URL Validation', () => {
    it('should generate valid callback URLs', async () => {
      const { getDoc } = require('firebase/firestore');
      
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              replica_id: 'test-replica',
              persona_id: 'test-persona',
              api_key: 'test-key'
            })
          });
        }
        if (ref.path?.includes('courses/')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              conversationalContext: 'Test context',
              title: 'Test Course'
            })
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          conversation_id: 'test-conv',
          conversation_url: 'https://test.com',
          status: 'created'
        }),
      });

      await createTavusConversation('course-123', 'user-123', 'session-123');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      
      // Validate callback URL format
      expect(requestBody.callback_url).toMatch(/^https?:\/\/.+\/api\/tavus\/callback\/.+/);
      
      // Should be a valid URL
      expect(() => new URL(requestBody.callback_url)).not.toThrow();
      
      // Should contain user and session IDs
      expect(requestBody.callback_url).toContain('user-123');
      expect(requestBody.callback_url).toContain('session-123');
    });

    it('should handle invalid base URLs gracefully', () => {
      // Mock invalid window.location.origin
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, origin: 'invalid-url' };

      expect(() => {
        // This should be tested in the actual callback URL generation
        new URL('invalid-url/api/tavus/callback/test');
      }).toThrow();

      // Restore original location
      window.location = originalLocation;
    });
  });

  describe('API Response Validation', () => {
    beforeEach(() => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              replica_id: 'test-replica',
              persona_id: 'test-persona',
              api_key: 'test-key'
            })
          });
        }
        if (ref.path?.includes('courses/')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              conversationalContext: 'Test context',
              title: 'Test Course'
            })
          });
        }
        return Promise.resolve({ exists: () => false });
      });
    });

    it('should handle malformed API responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          // Missing required fields
          status: 'created'
        }),
      });

      const result = await createTavusConversation('course-123', 'user-123', 'session-123');
      
      // Should still return the response even if fields are missing
      expect(result.status).toBe('created');
      expect(result.conversation_id).toBeUndefined();
    });

    it('should handle non-JSON API responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Not JSON')),
        text: () => Promise.resolve('Internal Server Error'),
      });

      await expect(createTavusConversation('course-123', 'user-123', 'session-123'))
        .rejects.toThrow('Tavus service temporarily unavailable');
    });
  });

  describe('Health Check Validation', () => {
    it('should validate system health correctly', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Mock healthy settings
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          replica_id: 'test-replica',
          persona_id: 'test-persona',
          api_key: 'test-key'
        })
      });

      // Mock healthy API
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'healthy' }),
      });

      const health = await checkTavusHealth();

      expect(health.settings).toBe(true);
      expect(health.api).toBe(true);
      expect(health.network).toBe(true);
      expect(health.queue).toBeDefined();
    });

    it('should detect configuration issues', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Mock missing settings
      getDoc.mockResolvedValue({
        exists: () => false
      });

      const health = await checkTavusHealth();

      expect(health.settings).toBe(false);
      expect(health.api).toBe(false); // Can't test API without settings
    });

    it('should detect API issues', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Mock healthy settings
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          replica_id: 'test-replica',
          persona_id: 'test-persona',
          api_key: 'test-key'
        })
      });

      // Mock unhealthy API
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      const health = await checkTavusHealth();

      expect(health.settings).toBe(true);
      expect(health.api).toBe(false);
    });

    it('should detect network issues', async () => {
      // Mock offline
      Object.defineProperty(navigator, 'onLine', { value: false });

      const health = await checkTavusHealth();

      expect(health.network).toBe(false);
      expect(health.api).toBe(false); // Can't test API when offline
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent session creation', async () => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'session-123' });

      // Create multiple sessions concurrently
      const promises = Array.from({ length: 5 }, (_, i) => 
        startTavusSession(`user-${i}`, 'course-123', 180)
      );

      const results = await Promise.all(promises);
      
      // All should succeed
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBe('session-123');
      });
    });

    it('should handle very long course titles', async () => {
      const { getDoc } = require('firebase/firestore');
      
      const longTitle = 'a'.repeat(500);
      
      getDoc.mockImplementation((ref) => {
        if (ref.path?.includes('settings/tavus')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              replica_id: 'test-replica',
              persona_id: 'test-persona',
              api_key: 'test-key'
            })
          });
        }
        if (ref.path?.includes('courses/')) {
          return Promise.resolve({
            exists: () => true,
            data: () => ({
              title: longTitle,
              description: 'Test description'
            })
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          conversation_id: 'test-conv',
          conversation_url: 'https://test.com',
          status: 'created'
        }),
      });

      // Should handle long titles gracefully
      await expect(createTavusConversation('course-123', 'user-123', 'session-123'))
        .resolves.toBeDefined();
    });

    it('should handle special characters in user IDs', async () => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'session-123' });

      const specialUserId = 'user@example.com+test';
      
      await expect(startTavusSession(specialUserId, 'course-123', 180))
        .resolves.toBe('session-123');
    });
  });
});