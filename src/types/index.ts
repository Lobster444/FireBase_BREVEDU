export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPremium: boolean;
  videoUrl: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'anonymous' | 'free' | 'premium';
  aiChatsUsed?: number;
  lastChatReset?: string;
  createdAt?: string;
}

export type UserRole = 'anonymous' | 'free' | 'premium';

export interface AIChat {
  topic: string;
  objective: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  conversationUrl?: string;
  timestamp: string;
}