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

        let coursesQuery = query(
          collection(db, 'courses'),
          orderBy('createdAt', 'desc')
        );

        if (category && category !== 'All') {
          coursesQuery = query(
            collection(db, 'courses'),
            where('category', '==', category),
            orderBy('createdAt', 'desc')
          );
        }

        if (isPremiumOnly) {
          coursesQuery = query(
            collection(db, 'courses'),
            where('isPremium', '==', true),
            orderBy('createdAt', 'desc')
          );
        }

        const querySnapshot = await getDocs(coursesQuery);
        const coursesData: Course[] = [];

        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() } as Course);
        });

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