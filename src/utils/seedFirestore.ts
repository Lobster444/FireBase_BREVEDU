import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mockCourses } from '../data/mockCourses';

export const seedFirestore = async () => {
  try {
    console.log('Starting Firestore seeding...');
    
    // Add courses to Firestore
    for (const course of mockCourses) {
      const { id, ...courseData } = course;
      await setDoc(doc(db, 'courses', id), {
        ...courseData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Added course: ${course.title}`);
    }

    // Add AI chat templates
    const aiTemplates = [
      {
        id: 'javascript-basics',
        topic: 'JavaScript Fundamentals',
        systemPrompt: 'You are an AI tutor helping students practice JavaScript fundamentals. Ask questions about variables, functions, and basic concepts. Keep responses concise and encouraging.',
        difficulty: 'Beginner',
        category: 'Programming'
      },
      {
        id: 'css-grid',
        topic: 'CSS Grid Layout',
        systemPrompt: 'You are an AI tutor helping students practice CSS Grid. Ask about grid properties, layout techniques, and responsive design. Provide practical examples.',
        difficulty: 'Intermediate',
        category: 'Design'
      },
      {
        id: 'react-hooks',
        topic: 'React Hooks',
        systemPrompt: 'You are an AI tutor helping students practice React Hooks. Focus on useState, useEffect, and custom hooks. Ask about practical use cases.',
        difficulty: 'Advanced',
        category: 'Programming'
      }
    ];

    for (const template of aiTemplates) {
      await setDoc(doc(db, 'aiTemplates', template.id), {
        ...template,
        createdAt: new Date()
      });
      console.log(`Added AI template: ${template.topic}`);
    }

    console.log('Firestore seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
  }
};

// Uncomment the line below to run seeding (run once only)
// seedFirestore();