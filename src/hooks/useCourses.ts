import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course, UserRole, canUserAccessCourse } from '../types';

export const useCourses = (
  category?: string, 
  isPremiumOnly?: boolean,
  userRole?: UserRole | null
) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        let coursesQuery;

        // Build query based on filters to avoid composite index requirements
        if (category && category !== 'All' && isPremiumOnly) {
          // Filter by both category and premium status
          coursesQuery = query(
            collection(db, 'courses'),
            where('category', '==', category),
            where('accessLevel', '==', 'premium'),
            where('published', '==', true)
          );
        } else if (category && category !== 'All') {
          // Filter by category only
          coursesQuery = query(
            collection(db, 'courses'),
            where('category', '==', category),
            where('published', '==', true)
          );
        } else if (isPremiumOnly) {
          // Filter by premium status only
          coursesQuery = query(
            collection(db, 'courses'),
            where('accessLevel', '==', 'premium'),
            where('published', '==', true)
          );
        } else {
          // No filters, just published courses
          coursesQuery = query(
            collection(db, 'courses'),
            where('published', '==', true),
            orderBy('createdAt', 'desc')
          );
        }

        const querySnapshot = await getDocs(coursesQuery);
        const coursesData: Course[] = [];

        querySnapshot.forEach((doc) => {
          const courseData = { id: doc.id, ...doc.data() } as Course;
          
          // Apply access level filtering based on user role
          const courseAccessLevel = courseData.accessLevel || 'free';
          if (canUserAccessCourse(userRole, courseAccessLevel)) {
            coursesData.push(courseData);
          }
        });

        // Sort client-side when we can't use orderBy due to composite index requirements
        if (category && category !== 'All' || isPremiumOnly) {
          coursesData.sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return bDate.getTime() - aDate.getTime();
          });
        }

        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
        // Fallback to mock data if Firestore fails, but still apply access filtering
        const { mockCourses } = await import('../data/mockCourses');
        const filteredMockCourses = mockCourses.filter(course => {
          const courseAccessLevel = course.accessLevel || 'free';
          return canUserAccessCourse(userRole, courseAccessLevel);
        });
        setCourses(filteredMockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category, isPremiumOnly, userRole]);

  return { courses, loading, error };
};