import { useState, useEffect } from 'react';
import { getCourses, getCoursesByCategory } from '../lib/courseService';
import { Course, UserRole, canUserAccessCourse } from '../types';

interface UseCoursesOptions {
  category?: string;
  publishedOnly?: boolean;
  userRole?: UserRole | null;
  includeRestricted?: boolean; // For admin views
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch courses from Firestore with real-time updates and access level filtering
 * @param options - Configuration options
 * @returns Object containing courses, loading state, error, and refetch function
 */
export const useFirestoreCourses = (options: UseCoursesOptions = {}): UseCoursesReturn => {
  const { category, publishedOnly = true, userRole, includeRestricted = false } = options;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = () => {
    setLoading(true);
    setError(null);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    let unsubscribe: (() => void) | undefined;

    const handleCoursesUpdate = (updatedCourses: Course[]) => {
      let filteredCourses = updatedCourses;
      
      // Apply access level filtering unless it's an admin view
      if (!includeRestricted) {
        filteredCourses = updatedCourses.filter(course => {
          const courseAccessLevel = course.accessLevel || 'free';
          return canUserAccessCourse(userRole, courseAccessLevel);
        });
      }
      
      setCourses(filteredCourses);
      setLoading(false);
      setError(null);
    };

    const handleError = (err: any) => {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
      setLoading(false);
      setCourses([]);
    };

    try {
      if (category && category !== 'All') {
        // Fetch courses by category
        unsubscribe = getCoursesByCategory(
          category,
          handleCoursesUpdate,
          publishedOnly
        );
      } else {
        // Fetch all courses
        unsubscribe = getCourses(
          handleCoursesUpdate,
          publishedOnly
        );
      }
    } catch (err) {
      handleError(err);
    }

    // Cleanup subscription on unmount or dependency change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [category, publishedOnly, userRole, includeRestricted]);

  return {
    courses,
    loading,
    error,
    refetch
  };
};

/**
 * Hook to get a specific number of featured courses with access level filtering
 * @param limit - Number of courses to return
 * @param category - Optional category filter
 * @param userRole - User role for access filtering
 * @returns Object containing featured courses and loading state
 */
export const useFeaturedCourses = (
  limit: number = 3, 
  category?: string, 
  userRole?: UserRole | null
) => {
  const { courses, loading, error } = useFirestoreCourses({ 
    category, 
    userRole,
    includeRestricted: false 
  });
  
  const featuredCourses = courses.slice(0, limit);
  
  return {
    courses: featuredCourses,
    loading,
    error
  };
};