/**
 * Utility functions for course management
 */
import { Course, AccessLevel } from '../../../types';

export interface AccessLevelInfo {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface AIPracticeInfo {
  status: 'dynamic' | 'legacy' | 'none';
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

/**
 * Get access level display information
 */
export const getAccessLevelInfo = (level: AccessLevel | undefined): AccessLevelInfo => {
  const accessLevel = level || 'free';
  switch (accessLevel) {
    case 'anonymous':
      return {
        label: 'Anonymous',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        icon: '🌐'
      };
    case 'free':
      return {
        label: 'Free',
        color: 'text-white',
        bgColor: 'bg-subscription-free',
        icon: '👤'
      };
    case 'premium':
      return {
        label: 'Premium',
        color: 'text-white',
        bgColor: 'bg-subscription-premium',
        icon: '💎'
      };
    default:
      return {
        label: 'Free',
        color: 'text-white',
        bgColor: 'bg-subscription-free',
        icon: '👤'
      };
  }
};

/**
 * Get AI practice status for a course
 */
export const getAIPracticeStatus = (course: Course): AIPracticeInfo => {
  const hasLegacyUrl = !!course.tavusConversationUrl;
  const hasContext = !!(course.conversationalContext || course.tavusConversationalContext);
  
  if (hasContext) {
    return {
      status: 'dynamic',
      label: 'Dynamic AI',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      icon: '🤖'
    };
  } else if (hasLegacyUrl) {
    return {
      status: 'legacy',
      label: 'Legacy URL',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      icon: '🔗'
    };
  } else {
    return {
      status: 'none',
      label: 'No AI',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: '❌'
    };
  }
};

/**
 * Format timestamp for display
 */
export const formatDate = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  
  try {
    // Handle Firestore Timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    // Handle regular Date
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    // Handle string dates
    return new Date(timestamp).toLocaleDateString();
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Calculate course statistics
 */
export const calculateCourseStats = (courses: Course[]) => {
  return {
    total: courses.length,
    published: courses.filter(c => c.published).length,
    drafts: courses.filter(c => !c.published).length,
    premium: courses.filter(c => (c.accessLevel || 'free') === 'premium').length,
    aiPractice: courses.filter(c => 
      c.conversationalContext || 
      c.tavusConversationalContext || 
      c.tavusConversationUrl
    ).length
  };
};

/**
 * Filter courses based on criteria
 */
export const filterCourses = (
  courses: Course[],
  filters: {
    searchQuery: string;
    selectedCategory: string;
    selectedDifficulty: string;
    selectedAccessLevel: string;
    showPublishedOnly: boolean;
  }
) => {
  return courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesCategory = filters.selectedCategory === 'All' || course.category === filters.selectedCategory;
    const matchesDifficulty = filters.selectedDifficulty === 'All' || course.difficulty === filters.selectedDifficulty;
    const matchesAccessLevel = filters.selectedAccessLevel === 'All' || (course.accessLevel || 'free') === filters.selectedAccessLevel;
    const matchesPublished = !filters.showPublishedOnly || course.published;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesAccessLevel && matchesPublished;
  });
};