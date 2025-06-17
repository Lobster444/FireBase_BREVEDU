import { useState, useEffect } from 'react';
import { getCourses, getCoursesByCategory } from '../lib/courseService';
import { Course } from '../types';

interface UseCoursesOptions {
  category?: string;
  publishedOnly?: boolean;
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch courses from Firestore with real-time updates
 * @param options - Configuration options
 * @returns Object containing courses, loading state, error, and refetch function
 */
export const useFirestoreCourses = (options: UseCoursesOptions = {}): UseCoursesReturn => {
  const { category, publishedOnly = true } = options;
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
      setCourses(updatedCourses);
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
  }, [category, publishedOnly]);

  return {
    courses,
    loading,
    error,
    refetch
  };
};

/**
 * Hook to get a specific number of featured courses
 * @param limit - Number of courses to return
 * @param category - Optional category filter
 * @returns Object containing featured courses and loading state
 */
export const useFeaturedCourses = (limit: number = 3, category?: string) => {
  const { courses, loading, error } = useFirestoreCourses({ category });
  
  const featuredCourses = courses.slice(0, limit);
  
  return {
    courses: featuredCourses,
    loading,
    error
  };
};