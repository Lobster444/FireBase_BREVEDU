import { collection, addDoc, query, where, getDocs, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { TavusSession } from './tavusService';

/**
 * Analytics service for Tavus AI practice sessions
 */

export interface TavusAnalytics {
  totalSessions: number;
  completedSessions: number;
  averageAccuracy: number;
  averageDuration: number;
  completionRate: number;
  popularCourses: Array<{
    courseId: string;
    sessionCount: number;
    completionRate: number;
  }>;
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
}

export interface TavusEvent {
  id?: string;
  type: 'session_start' | 'session_complete' | 'session_abandon' | 'error';
  userId: string;
  courseId: string;
  sessionId?: string;
  conversationId?: string;
  timestamp: any; // Firestore timestamp
  metadata?: {
    accuracyScore?: number;
    duration?: number;
    errorMessage?: string;
    userAgent?: string;
    deviceType?: string;
  };
}

/**
 * Track Tavus event for analytics
 * @param event - Event data to track
 * @returns Promise<string> - Event ID
 */
export const trackTavusEvent = async (
  event: Omit<TavusEvent, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    const eventData = {
      ...event,
      timestamp: serverTimestamp(),
      metadata: {
        ...event.metadata,
        userAgent: navigator.userAgent,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      }
    };

    const eventRef = await addDoc(collection(db, 'tavusEvents'), eventData);
    console.log('📊 Tracked Tavus event:', event.type, eventRef.id);
    return eventRef.id;
  } catch (error) {
    console.error('❌ Error tracking Tavus event:', error);
    throw error;
  }
};

/**
 * Get Tavus analytics for a specific user
 * @param userId - User ID
 * @param timeRange - Time range in days (default: 30)
 * @returns Promise<TavusAnalytics>
 */
export const getUserTavusAnalytics = async (
  userId: string,
  timeRange: number = 30
): Promise<TavusAnalytics> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    // Query user's Tavus events
    const eventsQuery = query(
      collection(db, 'tavusEvents'),
      where('userId', '==', userId),
      where('timestamp', '>=', cutoffDate),
      orderBy('timestamp', 'desc')
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TavusEvent[];

    // Calculate analytics
    const analytics = calculateAnalytics(events);
    
    console.log('📊 User Tavus analytics:', userId, analytics);
    return analytics;
  } catch (error) {
    console.error('❌ Error getting user Tavus analytics:', error);
    throw error;
  }
};

/**
 * Get global Tavus analytics
 * @param timeRange - Time range in days (default: 30)
 * @returns Promise<TavusAnalytics>
 */
export const getGlobalTavusAnalytics = async (
  timeRange: number = 30
): Promise<TavusAnalytics> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    // Query all Tavus events in time range
    const eventsQuery = query(
      collection(db, 'tavusEvents'),
      where('timestamp', '>=', cutoffDate),
      orderBy('timestamp', 'desc'),
      limit(10000) // Limit for performance
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TavusEvent[];

    // Calculate analytics
    const analytics = calculateAnalytics(events);
    
    console.log('📊 Global Tavus analytics:', analytics);
    return analytics;
  } catch (error) {
    console.error('❌ Error getting global Tavus analytics:', error);
    throw error;
  }
};

/**
 * Calculate analytics from events
 * @param events - Array of Tavus events
 * @returns TavusAnalytics
 */
const calculateAnalytics = (events: TavusEvent[]): TavusAnalytics => {
  const sessionStarts = events.filter(e => e.type === 'session_start');
  const sessionCompletes = events.filter(e => e.type === 'session_complete');
  const sessionAbandons = events.filter(e => e.type === 'session_abandon');

  const totalSessions = sessionStarts.length;
  const completedSessions = sessionCompletes.length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Calculate average accuracy
  const accuracyScores = sessionCompletes
    .map(e => e.metadata?.accuracyScore)
    .filter(score => typeof score === 'number') as number[];
  const averageAccuracy = accuracyScores.length > 0 
    ? accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length 
    : 0;

  // Calculate average duration
  const durations = sessionCompletes
    .map(e => e.metadata?.duration)
    .filter(duration => typeof duration === 'number') as number[];
  const averageDuration = durations.length > 0 
    ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
    : 0;

  // Calculate popular courses
  const courseStats = new Map<string, { starts: number; completes: number }>();
  
  sessionStarts.forEach(event => {
    const courseId = event.courseId;
    const stats = courseStats.get(courseId) || { starts: 0, completes: 0 };
    stats.starts++;
    courseStats.set(courseId, stats);
  });

  sessionCompletes.forEach(event => {
    const courseId = event.courseId;
    const stats = courseStats.get(courseId) || { starts: 0, completes: 0 };
    stats.completes++;
    courseStats.set(courseId, stats);
  });

  const popularCourses = Array.from(courseStats.entries())
    .map(([courseId, stats]) => ({
      courseId,
      sessionCount: stats.starts,
      completionRate: stats.starts > 0 ? (stats.completes / stats.starts) * 100 : 0
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 10);

  // Calculate user engagement (simplified)
  const uniqueUsers = new Set(events.map(e => e.userId));
  const userEngagement = {
    dailyActive: uniqueUsers.size, // Simplified - would need more complex logic for real DAU
    weeklyActive: uniqueUsers.size,
    monthlyActive: uniqueUsers.size
  };

  return {
    totalSessions,
    completedSessions,
    averageAccuracy: Math.round(averageAccuracy * 100) / 100,
    averageDuration: Math.round(averageDuration),
    completionRate: Math.round(completionRate * 100) / 100,
    popularCourses,
    userEngagement
  };
};

/**
 * Get Tavus performance metrics for monitoring
 * @returns Promise<object>
 */
export const getTavusPerformanceMetrics = async (): Promise<{
  errorRate: number;
  averageLoadTime: number;
  sessionAbandonmentRate: number;
}> => {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const eventsQuery = query(
      collection(db, 'tavusEvents'),
      where('timestamp', '>=', last24Hours),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => doc.data()) as TavusEvent[];

    const totalEvents = events.length;
    const errorEvents = events.filter(e => e.type === 'error').length;
    const sessionStarts = events.filter(e => e.type === 'session_start').length;
    const sessionAbandons = events.filter(e => e.type === 'session_abandon').length;

    const errorRate = totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;
    const sessionAbandonmentRate = sessionStarts > 0 ? (sessionAbandons / sessionStarts) * 100 : 0;

    // Average load time would need to be tracked separately
    const averageLoadTime = 0; // Placeholder

    return {
      errorRate: Math.round(errorRate * 100) / 100,
      averageLoadTime,
      sessionAbandonmentRate: Math.round(sessionAbandonmentRate * 100) / 100
    };
  } catch (error) {
    console.error('❌ Error getting Tavus performance metrics:', error);
    return {
      errorRate: 0,
      averageLoadTime: 0,
      sessionAbandonmentRate: 0
    };
  }
};

/**
 * Export Tavus analytics data for reporting
 * @param userId - Optional user ID for user-specific export
 * @param timeRange - Time range in days
 * @returns Promise<string> - CSV data
 */
export const exportTavusAnalytics = async (
  userId?: string,
  timeRange: number = 30
): Promise<string> => {
  try {
    const analytics = userId 
      ? await getUserTavusAnalytics(userId, timeRange)
      : await getGlobalTavusAnalytics(timeRange);

    // Convert to CSV format
    const csvData = [
      'Metric,Value',
      `Total Sessions,${analytics.totalSessions}`,
      `Completed Sessions,${analytics.completedSessions}`,
      `Completion Rate,${analytics.completionRate}%`,
      `Average Accuracy,${analytics.averageAccuracy}%`,
      `Average Duration,${analytics.averageDuration}s`,
      '',
      'Popular Courses',
      'Course ID,Session Count,Completion Rate',
      ...analytics.popularCourses.map(course => 
        `${course.courseId},${course.sessionCount},${course.completionRate}%`
      )
    ].join('\n');

    return csvData;
  } catch (error) {
    console.error('❌ Error exporting Tavus analytics:', error);
    throw error;
  }
};