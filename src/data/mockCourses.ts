import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript including variables, functions, and control structures in just 5 minutes.',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5:24',
    category: 'Programming',
    difficulty: 'Beginner',
    isPremium: false,
    videoUrl: 'https://www.youtube-nocookie.com/embed/PkZNo7MFNFg'
  },
  {
    id: '2',
    title: 'CSS Grid Layout Mastery',
    description: 'Master CSS Grid with practical examples and create responsive layouts that work on any device.',
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '4:52',
    category: 'Design',
    difficulty: 'Intermediate',
    isPremium: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/jV8B24rSN5o'
  },
  {
    id: '3',
    title: 'React Hooks in Action',
    description: 'Understand useState, useEffect, and custom hooks with real-world examples and best practices.',
    thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5:18',
    category: 'Programming',
    difficulty: 'Advanced',
    isPremium: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/O6P86uwfdR0'
  },
  {
    id: '4',
    title: 'Typography Principles for Web',
    description: 'Learn how to choose fonts, create hierarchy, and improve readability in your web designs.',
    thumbnail: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '4:33',
    category: 'Design',
    difficulty: 'Beginner',
    isPremium: false,
    videoUrl: 'https://www.youtube-nocookie.com/embed/sByzHoiYFX0'
  },
  {
    id: '5',
    title: 'API Integration Patterns',
    description: 'Best practices for fetching data, handling errors, and managing loading states in modern web apps.',
    thumbnail: 'https://images.pexels.com/photos/11035382/pexels-photo-11035382.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '5:47',
    category: 'Programming',
    difficulty: 'Intermediate',
    isPremium: true,
    videoUrl: 'https://www.youtube-nocookie.com/embed/cuEtnrL9-H0'
  },
  {
    id: '6',
    title: 'UX Research Fundamentals',
    description: 'Discover user research methods, interview techniques, and how to validate your design decisions.',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop',
    duration: '4:15',
    category: 'UX',
    difficulty: 'Beginner',
    isPremium: false,
    videoUrl: 'https://www.youtube-nocookie.com/embed/Ovj4hFxko7c'
  }
];

export const categories = ['All', 'Programming', 'Design', 'UX', 'Business', 'Marketing'];