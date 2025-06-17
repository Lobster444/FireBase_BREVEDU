import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Course } from '../types';

const COURSES_COLLECTION = 'courses';

/**
 * Get all courses with real-time listener
 * @param callback - Function to handle course updates
 * @param publishedOnly - Whether to fetch only published courses
 * @returns Unsubscribe function
 */
export const getCourses = (
  callback: (courses: Course[]) => void,
  publishedOnly: boolean = true
) => {
  try {
    let coursesQuery = query(
      collection(db, COURSES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    if (publishedOnly) {
      coursesQuery = query(
        collection(db, COURSES_COLLECTION),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(coursesQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const courses: Course[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        courses.push({
          id: doc.id,
          ...data,
          // Ensure accessLevel defaults to 'free' if not set
          accessLevel: data.accessLevel || 'free',
          // Convert Firestore Timestamps to readable format if needed
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Course);
      });
      callback(courses);
    }, (error) => {
      console.error('Error fetching courses:', error);
      callback([]); // Return empty array on error
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up courses listener:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Get courses by category with real-time listener
 * @param category - Course category to filter by
 * @param callback - Function to handle course updates
 * @param publishedOnly - Whether to fetch only published courses
 * @returns Unsubscribe function
 */
export const getCoursesByCategory = (
  category: string,
  callback: (courses: Course[]) => void,
  publishedOnly: boolean = true
) => {
  try {
    let coursesQuery = query(
      collection(db, COURSES_COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    if (publishedOnly) {
      coursesQuery = query(
        collection(db, COURSES_COLLECTION),
        where('category', '==', category),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(coursesQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const courses: Course[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        courses.push({
          id: doc.id,
          ...data,
          // Ensure accessLevel defaults to 'free' if not set
          accessLevel: data.accessLevel || 'free',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Course);
      });
      callback(courses);
    }, (error) => {
      console.error('Error fetching courses by category:', error);
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up category courses listener:', error);
    return () => {};
  }
};

/**
 * Get a single course by ID
 * @param id - Course ID
 * @returns Promise<Course | null>
 */
export const getCourse = async (id: string): Promise<Course | null> => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Ensure accessLevel defaults to 'free' if not set
        accessLevel: data.accessLevel || 'free',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Course;
    } else {
      console.log('No course found with ID:', id);
      return null;
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Add a new course
 * @param course - Course data (without createdAt/updatedAt)
 * @returns Promise<string> - Document ID of created course
 */
export const addCourse = async (
  course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // Validate course data
    if (!course.title || course.title.trim().length === 0) {
      throw new Error('Course title is required');
    }
    
    if (!course.description || course.description.trim().length === 0) {
      throw new Error('Course description is required');
    }
    
    if (course.description.length > 500) {
      throw new Error('Course description must be 500 characters or less');
    }
    
    if (!course.videoUrl || !course.videoUrl.includes('youtube-nocookie.com')) {
      throw new Error('Valid YouTube nocookie embed URL is required');
    }
    
    if (!course.thumbnailUrl) {
      throw new Error('Thumbnail URL is required');
    }

    // Validate accessLevel
    const validAccessLevels = ['anonymous', 'free', 'premium'];
    if (!validAccessLevels.includes(course.accessLevel)) {
      throw new Error('Access level must be anonymous, free, or premium');
    }

    const courseData = {
      ...course,
      title: course.title.trim(),
      description: course.description.trim(),
      // Ensure accessLevel is set, default to 'free' if not provided
      accessLevel: course.accessLevel || 'free',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COURSES_COLLECTION), courseData);
    console.log('Course added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

/**
 * Update an existing course
 * @param id - Course ID
 * @param data - Partial course data to update
 * @returns Promise<void>
 */
export const updateCourse = async (
  id: string, 
  data: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    if (!id) {
      throw new Error('Course ID is required');
    }

    // Validate updated data
    if (data.description && data.description.length > 500) {
      throw new Error('Course description must be 500 characters or less');
    }
    
    if (data.videoUrl && !data.videoUrl.includes('youtube-nocookie.com')) {
      throw new Error('Valid YouTube nocookie embed URL is required');
    }

    // Validate accessLevel if provided
    if (data.accessLevel) {
      const validAccessLevels = ['anonymous', 'free', 'premium'];
      if (!validAccessLevels.includes(data.accessLevel)) {
        throw new Error('Access level must be anonymous, free, or premium');
      }
    }

    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    // Clean up any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const docRef = doc(db, COURSES_COLLECTION, id);
    await updateDoc(docRef, updateData);
    console.log('Course updated:', id);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Delete a course
 * @param id - Course ID
 * @returns Promise<void>
 */
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new Error('Course ID is required');
    }

    const docRef = doc(db, COURSES_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Course deleted:', id);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

/**
 * Get courses with pagination
 * @param limit - Number of courses to fetch
 * @param publishedOnly - Whether to fetch only published courses
 * @returns Promise<Course[]>
 */
export const getCoursesPaginated = async (
  limit: number = 10,
  publishedOnly: boolean = true
): Promise<Course[]> => {
  try {
    let coursesQuery = query(
      collection(db, COURSES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    if (publishedOnly) {
      coursesQuery = query(
        collection(db, COURSES_COLLECTION),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(coursesQuery);
    const courses: Course[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id,
        ...data,
        // Ensure accessLevel defaults to 'free' if not set
        accessLevel: data.accessLevel || 'free',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Course);
    });

    return courses.slice(0, limit);
  } catch (error) {
    console.error('Error fetching paginated courses:', error);
    throw error;
  }
};

/**
 * Search courses by title or description
 * @param searchTerm - Search term
 * @param publishedOnly - Whether to search only published courses
 * @returns Promise<Course[]>
 */
export const searchCourses = async (
  searchTerm: string,
  publishedOnly: boolean = true
): Promise<Course[]> => {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation that fetches all courses and filters client-side
    // For production, consider using Algolia or similar service for better search
    
    let coursesQuery = query(
      collection(db, COURSES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    if (publishedOnly) {
      coursesQuery = query(
        collection(db, COURSES_COLLECTION),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(coursesQuery);
    const courses: Course[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const course = {
        id: doc.id,
        ...data,
        // Ensure accessLevel defaults to 'free' if not set
        accessLevel: data.accessLevel || 'free',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Course;
      
      // Client-side filtering
      const searchLower = searchTerm.toLowerCase();
      if (
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower)
      ) {
        courses.push(course);
      }
    });

    return courses;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};