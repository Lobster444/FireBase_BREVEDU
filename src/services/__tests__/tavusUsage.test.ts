import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { canStartConversation, getUserUsageStatus, DAILY_LIMITS } from '../tavusUsage';
import { User } from '../../types';

// Mock Firebase
vi.mock('../../lib/firebase', () => ({
  db: {},
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

describe('TavusUsage Service', () => {
  const mockFreeUser: User = {
    uid: 'free-user-123',
    email: 'free@example.com',
    name: 'Free User',
    role: 'free',
    isAdmin: false,
    aiChatsUsed: 0,
    lastChatReset: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z'
  };

  const mockPremiumUser: User = {
    uid: 'premium-user-123',
    email: 'premium@example.com',
    name: 'Premium User',
    role: 'premium',
    isAdmin: false,
    aiChatsUsed: 0,
    lastChatReset: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('canStartConversation', () => {
    it('should block anonymous users', async () => {
      await expect(canStartConversation(null)).rejects.toThrow(
        'Anonymous users cannot access AI practice sessions. Please sign in to continue.'
      );
    });

    it('should block users with anonymous role', async () => {
      const anonymousUser: User = { ...mockFreeUser, role: 'anonymous' };
      
      await expect(canStartConversation(anonymousUser)).rejects.toThrow(
        'Anonymous users cannot access AI practice sessions. Please create an account.'
      );
    });

    it('should allow free user within limit', async () => {
      const { getDoc, setDoc, updateDoc } = require('firebase/firestore');
      
      // Mock no existing record (first conversation of the day)
      getDoc.mockResolvedValueOnce({ exists: () => false });
      setDoc.mockResolvedValueOnce(undefined);
      
      // Mock successful increment
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockFreeUser.uid,
          date: '2024-01-01',
          conversationCount: 0,
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });
      updateDoc.mockResolvedValueOnce(undefined);

      const result = await canStartConversation(mockFreeUser);
      expect(result).toBe(true);
      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
    });

    it('should block free user at limit', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Mock existing record at limit
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockFreeUser.uid,
          date: '2024-01-01',
          conversationCount: DAILY_LIMITS.free, // At limit
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });

      await expect(canStartConversation(mockFreeUser)).rejects.toThrow(
        `Daily limit of ${DAILY_LIMITS.free} AI practice session reached. Upgrade to BrevEdu+ for more sessions!`
      );
    });

    it('should allow premium user within limit', async () => {
      const { getDoc, setDoc, updateDoc } = require('firebase/firestore');
      
      // Mock existing record with 2 conversations (under limit of 3)
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockPremiumUser.uid,
          date: '2024-01-01',
          conversationCount: 2,
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });
      
      // Mock successful increment
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockPremiumUser.uid,
          date: '2024-01-01',
          conversationCount: 2,
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });
      updateDoc.mockResolvedValueOnce(undefined);

      const result = await canStartConversation(mockPremiumUser);
      expect(result).toBe(true);
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          conversationCount: 3
        })
      );
    });

    it('should block premium user at limit', async () => {
      const { getDoc } = require('firebase/firestore');
      
      // Mock existing record at limit
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockPremiumUser.uid,
          date: '2024-01-01',
          conversationCount: DAILY_LIMITS.premium, // At limit
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });

      await expect(canStartConversation(mockPremiumUser)).rejects.toThrow(
        `Daily limit of ${DAILY_LIMITS.premium} AI practice sessions reached. More sessions available tomorrow!`
      );
    });

    it('should handle database errors gracefully', async () => {
      const { getDoc } = require('firebase/firestore');
      
      getDoc.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(canStartConversation(mockFreeUser)).rejects.toThrow(
        'Failed to access usage data'
      );
    });
  });

  describe('getUserUsageStatus', () => {
    it('should return correct status for anonymous user', async () => {
      const status = await getUserUsageStatus(null);
      
      expect(status).toEqual({
        canStart: false,
        used: 0,
        limit: 0,
        remaining: 0,
        tier: 'anonymous',
        resetTime: 'N/A'
      });
    });

    it('should return correct status for free user', async () => {
      const { getDoc } = require('firebase/firestore');
      
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockFreeUser.uid,
          date: '2024-01-01',
          conversationCount: 0,
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });

      const status = await getUserUsageStatus(mockFreeUser);
      
      expect(status.tier).toBe('free');
      expect(status.limit).toBe(DAILY_LIMITS.free);
      expect(status.used).toBe(0);
      expect(status.remaining).toBe(DAILY_LIMITS.free);
      expect(status.canStart).toBe(true);
    });

    it('should return correct status for premium user at limit', async () => {
      const { getDoc } = require('firebase/firestore');
      
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: mockPremiumUser.uid,
          date: '2024-01-01',
          conversationCount: DAILY_LIMITS.premium,
          lastUpdated: '2024-01-01T00:00:00Z'
        })
      });

      const status = await getUserUsageStatus(mockPremiumUser);
      
      expect(status.tier).toBe('premium');
      expect(status.limit).toBe(DAILY_LIMITS.premium);
      expect(status.used).toBe(DAILY_LIMITS.premium);
      expect(status.remaining).toBe(0);
      expect(status.canStart).toBe(false);
    });

    it('should handle database errors gracefully', async () => {
      const { getDoc } = require('firebase/firestore');
      
      getDoc.mockRejectedValueOnce(new Error('Database error'));

      const status = await getUserUsageStatus(mockFreeUser);
      
      expect(status.canStart).toBe(false);
      expect(status.tier).toBe('free');
      expect(status.limit).toBe(DAILY_LIMITS.free);
    });
  });

  describe('DAILY_LIMITS', () => {
    it('should have correct limits defined', () => {
      expect(DAILY_LIMITS.free).toBe(1);
      expect(DAILY_LIMITS.premium).toBe(3);
    });
  });
});