import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';
import { User } from '../types';

/**
 * Analytics Service for tracking user interactions and events
 */

// Check if analytics is available
const isAnalyticsAvailable = (): boolean => {
  return analytics !== null && typeof window !== 'undefined';
};

/**
 * Track page views
 */
export const trackPageView = (pageName: string, pageTitle?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
    console.log('📊 Page view tracked:', pageName);
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
  }
};

/**
 * Track user authentication events
 */
export const trackAuthEvent = (eventType: 'sign_up' | 'login' | 'logout', method?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, eventType, {
      method: method || 'email'
    });
    console.log('📊 Auth event tracked:', eventType);
  } catch (error) {
    console.error('❌ Error tracking auth event:', error);
  }
};

/**
 * Track course interactions
 */
export const trackCourseEvent = (
  eventType: 'course_view' | 'course_start' | 'course_complete' | 'ai_practice_start' | 'ai_practice_complete',
  courseId: string,
  courseTitle: string,
  additionalData?: Record<string, any>
) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, eventType, {
      course_id: courseId,
      course_title: courseTitle,
      ...additionalData
    });
    console.log('📊 Course event tracked:', eventType, courseTitle);
  } catch (error) {
    console.error('❌ Error tracking course event:', error);
  }
};

/**
 * Track AI practice sessions
 */
export const trackAIPracticeEvent = (
  eventType: 'ai_practice_start' | 'ai_practice_complete' | 'ai_practice_timeout',
  courseId: string,
  sessionData?: {
    duration?: number;
    accuracyScore?: number;
    userRole?: string;
  }
) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, eventType, {
      course_id: courseId,
      duration: sessionData?.duration,
      accuracy_score: sessionData?.accuracyScore,
      user_role: sessionData?.userRole
    });
    console.log('📊 AI practice event tracked:', eventType);
  } catch (error) {
    console.error('❌ Error tracking AI practice event:', error);
  }
};

/**
 * Track subscription events
 */
export const trackSubscriptionEvent = (
  eventType: 'subscription_start' | 'subscription_cancel' | 'upgrade_click',
  plan?: string
) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, eventType, {
      plan: plan || 'premium'
    });
    console.log('📊 Subscription event tracked:', eventType);
  } catch (error) {
    console.error('❌ Error tracking subscription event:', error);
  }
};

/**
 * Track search events
 */
export const trackSearchEvent = (searchTerm: string, category?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, 'search', {
      search_term: searchTerm,
      category: category
    });
    console.log('📊 Search event tracked:', searchTerm);
  } catch (error) {
    console.error('❌ Error tracking search event:', error);
  }
};

/**
 * Track button clicks and interactions
 */
export const trackInteraction = (
  elementName: string,
  action: string,
  location?: string
) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, 'interaction', {
      element_name: elementName,
      action: action,
      location: location || window.location.pathname
    });
    console.log('📊 Interaction tracked:', elementName, action);
  } catch (error) {
    console.error('❌ Error tracking interaction:', error);
  }
};

/**
 * Set user properties for analytics
 */
export const setAnalyticsUser = (user: User | null) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    if (user) {
      setUserId(analytics!, user.uid);
      setUserProperties(analytics!, {
        user_role: user.role,
        is_admin: user.isAdmin || false,
        account_created: user.createdAt
      });
      console.log('📊 Analytics user set:', user.uid, user.role);
    } else {
      setUserId(analytics!, null);
      console.log('📊 Analytics user cleared');
    }
  } catch (error) {
    console.error('❌ Error setting analytics user:', error);
  }
};

/**
 * Track custom events
 */
export const trackCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (!isAnalyticsAvailable()) return;
  
  try {
    logEvent(analytics!, eventName, parameters);
    console.log('📊 Custom event tracked:', eventName, parameters);
  } catch (error) {
    console.error('❌ Error tracking custom event:', error);
  }
};