export interface Course {
  id?: string;
  title: string;
  description: string;         // ≤ 500 chars
  videoUrl: string;           // YouTube nocookie embed URL
  thumbnailUrl: string;
  duration: string;           // e.g. "5m", "12m"
  category: "Business" | "Tech" | "Health" | "Personal" | "Creative";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  accessLevel: "anonymous" | "free" | "premium";  // New field for access control
  published: boolean;
  tavusConversationUrl?: string;  // New: Tavus AI conversation URL
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
  // New: Track Tavus AI completion per course
  tavusCompletions?: { [courseId: string]: TavusCompletion };
}

export interface TavusCompletion {
  completed: boolean;
  accuracyScore?: number;
  completedAt: string;
  conversationId?: string;
}

export type UserRole = 'anonymous' | 'free' | 'premium';
export type AccessLevel = 'anonymous' | 'free' | 'premium';

export interface AIChat {
  topic: string;
  objective: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  conversationUrl?: string;
  timestamp: string;
}

// Helper function to check if user can access a course
export const canUserAccessCourse = (
  userRole: UserRole | null, 
  courseAccessLevel: AccessLevel
): boolean => {
  // If no user (anonymous), only allow anonymous courses
  if (!userRole || userRole === 'anonymous') {
    return courseAccessLevel === 'anonymous';
  }
  
  // Free users can access anonymous and free courses
  if (userRole === 'free') {
    return courseAccessLevel === 'anonymous' || courseAccessLevel === 'free';
  }
  
  // Premium users can access all courses
  if (userRole === 'premium') {
    return true;
  }
  
  return false;
};

// Helper function to get access level requirements
export const getAccessLevelRequirement = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case 'anonymous':
      return 'No account required';
    case 'free':
      return 'Free account required';
    case 'premium':
      return 'BrevEdu+ subscription required';
    default:
      return 'Account required';
  }
};

// Helper function to check if user has completed Tavus AI for a course
export const hasTavusCompletion = (user: User | null, courseId: string): boolean => {
  if (!user || !courseId) return false;
  return user.tavusCompletions?.[courseId]?.completed || false;
};

// Helper function to get Tavus completion data for a course
export const getTavusCompletion = (user: User | null, courseId: string): TavusCompletion | null => {
  if (!user || !courseId) return null;
  return user.tavusCompletions?.[courseId] || null;
};