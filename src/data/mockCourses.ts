import { Course } from '../types';

// Updated mock courses to match new Firestore structure
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript including variables, functions, and control structures in just 5 minutes.',
    thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5m',
    category: 'Science & Technology',
    published: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/PkZNo7MFNFg'
  },
  {
    id: '2',
    title: 'CSS Grid Layout Mastery',
    description: 'Master CSS Grid with practical examples and create responsive layouts that work on any device.',
    thumbnailUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '7m',
    category: 'Science & Technology',
    published: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/jV8B24rSN5o'
  },
  {
    id: '3',
    title: 'React Hooks in Action',
    description: 'Understand useState, useEffect, and custom hooks with real-world examples and best practices.',
    thumbnailUrl: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '8m',
    category: 'Science & Technology',
    published: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/O6P86uwfdR0'
  },
  {
    id: '4',
    title: 'Effective Time Management Strategies',
    description: 'Learn proven techniques to boost productivity and manage your time effectively.',
    thumbnailUrl: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '6m',
    category: 'Personal Development',
    published: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/sByzHoiYFX0'
  },
  {
    id: '5',
    title: 'Digital Marketing Fundamentals',
    description: 'Master the basics of digital marketing including SEO, social media, and content strategy.',
    thumbnailUrl: 'https://images.pexels.com/photos/11035382/pexels-photo-11035382.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '9m',
    category: 'Society & Culture',
    published: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/cuEtnrL9-H0'
  },
  {
    id: '6',
    title: 'Mindfulness and Stress Reduction',
    description: 'Discover simple mindfulness techniques to reduce stress and improve mental well-being.',
    thumbnailUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5m',
    category: 'Personal Development',
    published: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/Ovj4hFxko7c'
  }
];

export const categories = ['All', 'Society & Culture', 'Personal Development', 'Science & Technology'];