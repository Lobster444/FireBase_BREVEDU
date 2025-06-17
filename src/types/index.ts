export interface Course {
  id?: string;
  title: string;
  description: string;         // ≤ 500 chars
  videoUrl: string;           // YouTube nocookie embed URL
  thumbnailUrl: string;
  duration: string;           // e.g. "5m", "12m"
  category: "Business" | "Tech" | "Health" | "Personal" | "Creative";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  published: boolean;
  createdAt?: any;  // Firestore Timestamp
  updatedAt?: any;  // Firestore Timestamp
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'anonymous' | 'free' | 'premium';
  isAdmin?: boolean;  // Added admin flag
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