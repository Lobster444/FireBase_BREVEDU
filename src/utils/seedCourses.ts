import { addCourse } from '../lib/courseService';
import { Course } from '../types';

// Sample courses data for seeding
const sampleCourses: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Introduction to JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript including variables, functions, and control structures in just 5 minutes. Perfect for beginners starting their programming journey.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/PkZNo7MFNFg',
    thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5m',
    category: 'Tech',
    difficulty: 'Beginner',
    published: true
  },
  {
    title: 'CSS Grid Layout Mastery',
    description: 'Master CSS Grid with practical examples and create responsive layouts that work on any device. Learn modern web design techniques.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/jV8B24rSN5o',
    thumbnailUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '7m',
    category: 'Tech',
    difficulty: 'Intermediate',
    published: true
  },
  {
    title: 'React Hooks in Action',
    description: 'Understand useState, useEffect, and custom hooks with real-world examples and best practices. Take your React skills to the next level.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/O6P86uwfdR0',
    thumbnailUrl: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '8m',
    category: 'Tech',
    difficulty: 'Advanced',
    published: true
  },
  {
    title: 'Effective Time Management Strategies',
    description: 'Learn proven techniques to boost productivity and manage your time effectively. Transform your daily routine with these practical tips.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/sByzHoiYFX0',
    thumbnailUrl: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '6m',
    category: 'Personal',
    difficulty: 'Beginner',
    published: true
  },
  {
    title: 'Digital Marketing Fundamentals',
    description: 'Master the basics of digital marketing including SEO, social media, and content strategy. Perfect for entrepreneurs and marketers.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/cuEtnrL9-H0',
    thumbnailUrl: 'https://images.pexels.com/photos/11035382/pexels-photo-11035382.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '9m',
    category: 'Business',
    difficulty: 'Intermediate',
    published: true
  },
  {
    title: 'Mindfulness and Stress Reduction',
    description: 'Discover simple mindfulness techniques to reduce stress and improve mental well-being. Start your journey to better mental health.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/Ovj4hFxko7c',
    thumbnailUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5m',
    category: 'Health',
    difficulty: 'Beginner',
    published: true
  },
  {
    title: 'Creative Writing Techniques',
    description: 'Unlock your creativity with proven writing techniques. Learn to craft compelling stories and improve your writing skills.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/example1',
    thumbnailUrl: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '7m',
    category: 'Creative',
    difficulty: 'Intermediate',
    published: true
  },
  {
    title: 'Financial Planning Basics',
    description: 'Learn essential financial planning skills including budgeting, saving, and investment basics. Take control of your financial future.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/example2',
    thumbnailUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '8m',
    category: 'Business',
    difficulty: 'Beginner',
    published: true
  }
];

/**
 * Seed the Firestore database with sample courses
 * This function should be called once to populate the database
 */
export const seedCourses = async (): Promise<void> => {
  try {
    console.log('Starting to seed courses...');
    
    for (const course of sampleCourses) {
      try {
        const courseId = await addCourse(course);
        console.log(`✅ Added course: "${course.title}" with ID: ${courseId}`);
      } catch (error) {
        console.error(`❌ Failed to add course: "${course.title}"`, error);
      }
    }
    
    console.log('🎉 Course seeding completed!');
  } catch (error) {
    console.error('❌ Error during course seeding:', error);
  }
};

// Uncomment the line below to run the seeding function
// Note: Only run this once to avoid duplicate data
// seedCourses();