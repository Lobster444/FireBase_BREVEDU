import { User } from '../types';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TavusLimitError } from '../lib/tavus/errors';

/**
 * Tavus Usage Service
 * Manages daily conversation limits for different user tiers
 */

export interface UsageRecord {
  userId: string;
  date: string; // YYYY-MM-DD format
  conversationCount: number;
  lastUpdated: string;
}

export interface UsageLimits {
  free: number;
  premium: number;
}

// Daily conversation limits by user tier
export const DAILY_LIMITS: UsageLimits = {
  free: 1,
  premium: 3
};

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get or create usage record for a user on a specific date
 */
const getOrCreateUsageRecord = async (userId: string, date: string): Promise<UsageRecord> => {
  try {
    const usageRef = doc(db, 'usage', userId, date);
    const usageSnap = await getDoc(usageRef);
    
    if (usageSnap.exists()) {
      return usageSnap.data() as UsageRecord;
    } else {
      // Create new usage record for today
      const newRecord: UsageRecord = {
        userId,
        date,
        conversationCount: 0,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(usageRef, newRecord);
      console.log('📊 Created new usage record for user:', userId, 'date:', date);
      return newRecord;
    }
  } catch (error) {
    console.error('❌ Error getting/creating usage record:', error);
    throw new Error('Failed to access usage data');
  }
};

/**
 * Increment conversation count for a user on a specific date
 */
const incrementUsageCount = async (userId: string, date: string): Promise<void> => {
  try {
    const usageRef = doc(db, 'usage', `${userId}_${date}`);
    const usageSnap = await getDoc(usageRef);
    
    if (usageSnap.exists()) {
      const currentRecord = usageSnap.data() as UsageRecord;
      await updateDoc(usageRef, {
        conversationCount: currentRecord.conversationCount + 1,
        lastUpdated: new Date().toISOString()
      });
      console.log('📈 Incremented usage count for user:', userId, 'new count:', currentRecord.conversationCount + 1);
    } else {
      throw new Error('Usage record not found');
    }
  } catch (error) {
    console.error('❌ Error incrementing usage count:', error);
    throw new Error('Failed to update usage data');
  }
};

/**
 * Check if user can start a new Tavus conversation
 * Throws error if limit reached or user not allowed
 */
export const canStartConversation = async (user: User | null): Promise<boolean> => {
  // Block anonymous users
  if (!user) {
    throw new Error('Anonymous users cannot access AI practice sessions. Please sign in to continue.');
  }

  // Block users with 'anonymous' role (shouldn't happen but safety check)
  if (user.role === 'anonymous') {
    throw new Error('Anonymous users cannot access AI practice sessions. Please create an account.');
  }

  const today = getTodayString();
  const userTier = user.role as keyof UsageLimits;
  const dailyLimit = DAILY_LIMITS[userTier];

  if (!dailyLimit) {
    throw new Error(`Unknown user tier: ${userTier}`);
  }

  try {
    // Get or create usage record for today
    const usageRecord = await getOrCreateUsageRecord(user.uid, today);
    
    console.log('📊 Usage check for user:', user.uid, {
      tier: userTier,
      dailyLimit,
      currentCount: usageRecord.conversationCount,
      date: today
    });

    // Check if limit reached
    if (usageRecord.conversationCount >= dailyLimit) {
      const errorMessage = userTier === 'free' 
        ? `Daily limit of ${dailyLimit} AI practice session reached. Upgrade to BrevEdu+ for more sessions!`
        : `Daily limit of ${dailyLimit} AI practice sessions reached. More sessions available tomorrow!`;
      
      throw new TavusLimitError(errorMessage);
    }

    // Increment count before allowing conversation
    await incrementUsageCount(user.uid, today);
    
    console.log('✅ User can start conversation. Remaining today:', dailyLimit - usageRecord.conversationCount - 1);
    return true;
  } catch (error) {
    console.error('❌ Error checking conversation eligibility:', error);
    throw error; // Re-throw to preserve original error message
  }
};

/**
 * Get current usage status for a user
 */
export const getUserUsageStatus = async (user: User | null): Promise<{
  canStart: boolean;
  used: number;
  limit: number;
  remaining: number;
  tier: string;
  resetTime: string;
}> => {
  if (!user || user.role === 'anonymous') {
    return {
      canStart: false,
      used: 0,
      limit: 0,
      remaining: 0,
      tier: 'anonymous',
      resetTime: 'N/A'
    };
  }

  const today = getTodayString();
  const userTier = user.role as keyof UsageLimits;
  const dailyLimit = DAILY_LIMITS[userTier];

  try {
    const usageRecord = await getOrCreateUsageRecord(user.uid, today);
    const remaining = Math.max(0, dailyLimit - usageRecord.conversationCount);
    
    // Calculate reset time (midnight tonight)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return {
      canStart: remaining > 0,
      used: usageRecord.conversationCount,
      limit: dailyLimit,
      remaining,
      tier: userTier,
      resetTime: tomorrow.toISOString()
    };
  } catch (error) {
    console.error('❌ Error getting usage status:', error);
    // Return safe defaults on error
    return {
      canStart: false,
      used: 0,
      limit: dailyLimit,
      remaining: 0,
      tier: userTier,
      resetTime: 'Unknown'
    };
  }
};

/**
 * Reset usage count for a user (admin function)
 */
export const resetUserUsage = async (userId: string, date?: string): Promise<void> => {
  const targetDate = date || getTodayString();
  
  try {
    const usageRef = doc(db, 'usage', `${userId}_${targetDate}`);
    await setDoc(usageRef, {
      userId,
      date: targetDate,
      conversationCount: 0,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('🔄 Reset usage for user:', userId, 'date:', targetDate);
  } catch (error) {
    console.error('❌ Error resetting usage:', error);
    throw new Error('Failed to reset usage data');
  }
};

/**
 * Get usage statistics for admin dashboard
 */
export const getUsageStatistics = async (startDate: string, endDate: string): Promise<{
  totalConversations: number;
  uniqueUsers: number;
  averagePerUser: number;
  byTier: { [key: string]: number };
}> => {
  // This would require a more complex query in a real implementation
  // For now, return placeholder data
  console.warn('⚠️ getUsageStatistics not fully implemented - requires backend aggregation');
  
  return {
    totalConversations: 0,
    uniqueUsers: 0,
    averagePerUser: 0,
    byTier: {
      free: 0,
      premium: 0
    }
  };
};