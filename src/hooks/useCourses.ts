import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course } from '../types';

export const useCourses = (category?: string, isPremiumOnly?: boolean) => {
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
            where('isPremium', '==', true)
          );
        } else if (category && category !== 'All') {
          // Filter by category only
          coursesQuery = query(
            collection(db, 'courses'),
            where('category', '==', category)
          );
        } else if (isPremiumOnly) {
          // Filter by premium status only
          coursesQuery = query(
            collection(db, 'courses'),
            where('isPremium', '==', true)
          );
        } else {
          // No filters, just order by createdAt
          coursesQuery = query(
            collection(db, 'courses'),
            orderBy('createdAt', 'desc')
          );
        }

        const querySnapshot = await getDocs(coursesQuery);
        const coursesData: Course[] = [];

        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() } as Course);
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
        // Fallback to mock data if Firestore fails
        const { mockCourses } = await import('../data/mockCourses');
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category, isPremiumOnly]);

  return { courses, loading, error };
};