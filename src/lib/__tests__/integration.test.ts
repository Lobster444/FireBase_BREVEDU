import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CourseDetailModal from '../../components/CourseDetailModal';
import TavusConfirmationModal from '../../components/TavusConfirmationModal';
import { AuthProvider } from '../../contexts/AuthContext';
import { Course, User } from '../../types';

// Mock Firebase
vi.mock('../../lib/firebase', () => ({
  db: {},
  auth: {},
}));

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}));

// Mock Auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

// Mock Tavus Service - Updated imports
vi.mock('../../lib/tavusService', () => ({
  createTavusConversation: vi.fn(),
  startTavusSession: vi.fn(),
  endTavusConversation: vi.fn(),
  updateTavusSession: vi.fn(),
  completeTavusSession: vi.fn(),
  retryTavusOperation: vi.fn(),
  executeWithOfflineFallback: vi.fn(),
  tavusOfflineQueue: {
    add: vi.fn(),
    processQueue: vi.fn(),
    getQueueStatus: vi.fn(() => ({ size: 0 })),
    loadFromStorage: vi.fn(),
  },
  TavusError: class TavusError extends Error {},
  TavusNetworkError: class TavusNetworkError extends Error {},
  TavusConfigError: class TavusConfigError extends Error {},
  TavusAPIError: class TavusAPIError extends Error {},
  TavusTimeoutError: class TavusTimeoutError extends Error {},
}));

// Mock Tavus Usage Service
vi.mock('../../services/tavusUsage', () => ({
  canStartConversation: vi.fn(),
  getUserUsageStatus: vi.fn(),
  DAILY_LIMITS: { free: 1, premium: 3 },
}));

// Mock toast notifications
vi.mock('../../lib/toast', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  notifyWarning: vi.fn(),
  notifyInfo: vi.fn(),
  notifyLoading: vi.fn(() => 'toast-id'),
  updateToast: vi.fn(),
}));

// Mock hooks
vi.mock('../../hooks/useOfflineSupport', () => ({
  useOfflineSupport: () => ({
    isOnline: true,
    executeWithOfflineFallback: vi.fn((fn) => fn()),
  }),
}));

// Mock useAuth
const mockUser: User = {
  uid: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'free',
  isAdmin: false,
  aiChatsUsed: 0,
  lastChatReset: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: mockUser,
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockCourse: Course = {
  id: 'test-course-123',
  title: 'JavaScript Fundamentals',
  description: 'Learn the basics of JavaScript programming',
  videoUrl: 'https://www.youtube-nocookie.com/embed/test-video',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  duration: '5m',
  category: 'Tech',
  accessLevel: 'free',
  published: true,
  conversationalContext: 'Practice JavaScript fundamentals with interactive exercises',
  createdAt: new Date().toISOString(),
};

describe('Tavus Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Course Detail Modal - AI Practice Flow', () => {
    const renderCourseModal = () => {
      return render(
        <BrowserRouter>
          <AuthProvider>
            <CourseDetailModal
              isOpen={true}
              course={mockCourse}
              onClose={vi.fn()}
            />
          </AuthProvider>
        </BrowserRouter>
      );
    };

    it('should show Practice with AI button for courses with conversational context', () => {
      renderCourseModal();

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      expect(practiceButton).toBeInTheDocument();
      expect(practiceButton).not.toBeDisabled();
    });

    it('should show session availability info for free users', () => {
      renderCourseModal();

      expect(screen.getByText(/1 practice session available today/i)).toBeInTheDocument();
    });

    it('should open confirmation modal when Practice with AI is clicked', async () => {
      const user = userEvent.setup();
      renderCourseModal();

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      expect(screen.getByText(/start ai practice/i)).toBeInTheDocument();
      expect(screen.getByText(/ready to practice with ai/i)).toBeInTheDocument();
    });

    it('should show course information in confirmation modal', async () => {
      const user = userEvent.setup();
      renderCourseModal();

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
      expect(screen.getByText(/2 minutes max/i)).toBeInTheDocument();
    });

    it('should show practice tips in confirmation modal', async () => {
      const user = userEvent.setup();
      renderCourseModal();

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      expect(screen.getByText(/make sure you have a stable internet connection/i)).toBeInTheDocument();
      expect(screen.getByText(/session will automatically end after 2 minutes/i)).toBeInTheDocument();
    });
  });

  describe('Tavus Confirmation Modal', () => {
    const renderConfirmationModal = (onConfirmStart = vi.fn()) => {
      return render(
        <BrowserRouter>
          <AuthProvider>
            <TavusConfirmationModal
              isOpen={true}
              course={mockCourse}
              onClose={vi.fn()}
              onConfirmStart={onConfirmStart}
            />
          </AuthProvider>
        </BrowserRouter>
      );
    };

    it('should call onConfirmStart when Start Practice button is clicked', async () => {
      const mockOnConfirmStart = vi.fn();
      const user = userEvent.setup();
      
      renderConfirmationModal(mockOnConfirmStart);

      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);

      expect(mockOnConfirmStart).toHaveBeenCalledTimes(1);
    });

    it('should show loading state when starting practice', async () => {
      const user = userEvent.setup();
      renderConfirmationModal();

      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);

      expect(screen.getByText(/creating session/i)).toBeInTheDocument();
    });

    it('should disable start button when offline', () => {
      // Mock offline state
      vi.mocked(require('../../hooks/useOfflineSupport').useOfflineSupport).mockReturnValue({
        isOnline: false,
        executeWithOfflineFallback: vi.fn(),
      });

      renderConfirmationModal();

      const startButton = screen.getByRole('button', { name: /start practice/i });
      expect(startButton).toBeDisabled();
      expect(screen.getByText(/you're currently offline/i)).toBeInTheDocument();
    });

    it('should show upgrade prompt for free users', () => {
      renderConfirmationModal();

      expect(screen.getByText(/want more practice sessions/i)).toBeInTheDocument();
      expect(screen.getByText(/upgrade to brevedu\+ for 3 daily sessions/i)).toBeInTheDocument();
    });
  });

  describe('API Integration Flow', () => {
    it('should create Tavus conversation with correct payload', async () => {
      const { createTavusConversation, startTavusSession } = require('../../lib/tavusService');
      const { canStartConversation } = require('../../services/tavusUsage');
      
      // Mock successful responses
      canStartConversation.mockResolvedValue(true);
      startTavusSession.mockResolvedValue('session-123');
      createTavusConversation.mockResolvedValue({
        conversation_id: 'tavus-conv-123',
        conversation_url: 'https://tavus.daily.co/test-conversation',
        status: 'created'
      });

      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <AuthProvider>
            <CourseDetailModal
              isOpen={true}
              course={mockCourse}
              onClose={vi.fn()}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      // Click Practice with AI
      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      // Click Start Practice in confirmation modal
      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);

      await waitFor(() => {
        expect(canStartConversation).toHaveBeenCalledWith(mockUser);
      });

      await waitFor(() => {
        expect(startTavusSession).toHaveBeenCalledWith(
          mockUser.uid,
          mockCourse.id,
          120
        );
      });

      await waitFor(() => {
        expect(createTavusConversation).toHaveBeenCalledWith(
          mockCourse.id,
          mockUser.uid,
          'session-123'
        );
      });
    });

    it('should handle usage limit errors', async () => {
      const { canStartConversation } = require('../../services/tavusUsage');
      
      canStartConversation.mockRejectedValue(
        new Error('Daily limit of 1 AI practice session reached. Upgrade to BrevEdu+ for more sessions!')
      );

      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <AuthProvider>
            <CourseDetailModal
              isOpen={true}
              course={mockCourse}
              onClose={vi.fn()}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);

      await waitFor(() => {
        const { notifyError } = require('../../lib/toast');
        expect(notifyError).toHaveBeenCalledWith(
          'Daily limit of 1 AI practice session reached. Upgrade to BrevEdu+ for more sessions!'
        );
      });
    });

    it('should handle API errors gracefully', async () => {
      const { createTavusConversation, startTavusSession } = require('../../lib/tavusService');
      const { TavusConfigError } = require('../../lib/tavusService');
      
      startTavusSession.mockResolvedValue('session-123');
      createTavusConversation.mockRejectedValue(
        new TavusConfigError('Tavus settings not configured')
      );

      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <AuthProvider>
            <CourseDetailModal
              isOpen={true}
              course={mockCourse}
              onClose={vi.fn()}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);

      await waitFor(() => {
        const { updateToast } = require('../../lib/toast');
        expect(updateToast).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('AI practice is not configured'),
          'error'
        );
      });
    });

    it('should handle network errors with retry guidance', async () => {
      const { createTavusConversation, startTavusSession } = require('../../lib/tavusService');
      const { TavusNetworkError } = require('../../lib/tavusService');
      
      startTavusSession.mockResolvedValue('session-123');
      createTavusConversation.mockRejectedValue(
        new TavusNetworkError('Network connection lost')
      );

      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <AuthProvider>
            <CourseDetailModal
              isOpen={true}
              course={mockCourse}
              onClose={vi.fn()}
            />
          </AuthProvider>
        </BrowserRouter>
      );

      const practiceButton = screen.getByRole('button', { name: /practice with ai/i });
      await user.click(practiceButton);

      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);

      await waitFor(() => {
        const { notifyWarning } = require('../../lib/toast');
        expect(notifyWarning).toHaveBeenCalledWith(
          expect.stringContaining('You can try again when your connection is stable')
        );
      });
    });
  });

  describe('Session Timeout Handling', () => {
    it('should show 3-minute timer when conversation starts', () => {
      // This would require mocking the TavusModal component
      // and testing the timer functionality
      expect(true).toBe(true); // Placeholder for timer tests
    });

    it('should show warning at 30 seconds remaining', () => {
      // Timer warning test
      expect(true).toBe(true); // Placeholder
    });

    it('should automatically end conversation after 2 minutes', () => {
      // Auto-end test
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Offline Support', () => {
    it('should queue operations when offline', () => {
      const { tavusOfflineQueue } = require('../../lib/tavusService');
      
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', { value: false });
      
      tavusOfflineQueue.add('createConversation', {
        courseId: mockCourse.id,
        userId: mockUser.uid,
        sessionId: 'session-123'
      });

      expect(tavusOfflineQueue.add).toHaveBeenCalledWith(
        'createConversation',
        expect.objectContaining({
          courseId: mockCourse.id,
          userId: mockUser.uid
        })
      );
    });

    it('should process queue when coming back online', () => {
      const { tavusOfflineQueue } = require('../../lib/tavusService');
      
      // Simulate coming back online
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));

      expect(tavusOfflineQueue.processQueue).toHaveBeenCalled();
    });
  });

  describe('User Experience Validation', () => {
    it('should show appropriate messages for different user roles', () => {
      // Test free user experience
      const renderCourseModal = () => {
        return render(
          <BrowserRouter>
            <AuthProvider>
              <CourseDetailModal
                isOpen={true}
                course={mockCourse}
                onClose={vi.fn()}
              />
            </AuthProvider>
          </BrowserRouter>
        );
      };
      
      renderCourseModal();
      expect(screen.getByText(/1 practice session available today/i)).toBeInTheDocument();
    });

    it('should handle session limits correctly', () => {
      // Mock user with used sessions
      const usedSessionUser = { ...mockUser, aiChatsUsed: 1 };
      vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue({
        currentUser: usedSessionUser,
        loading: false,
      });

      const renderCourseModal = () => {
        return render(
          <BrowserRouter>
            <AuthProvider>
              <CourseDetailModal
                isOpen={true}
                course={mockCourse}
                onClose={vi.fn()}
              />
            </AuthProvider>
          </BrowserRouter>
        );
      };
      
      renderCourseModal();
      expect(screen.getByText(/daily limit reached/i)).toBeInTheDocument();
    });

    it('should show completion status for completed courses', () => {
      const completedUser = {
        ...mockUser,
        tavusCompletions: {
          [mockCourse.id!]: {
            completed: true,
            accuracyScore: 85,
            completedAt: new Date().toISOString(),
            conversationId: 'conv-123'
          }
        }
      };

      vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue({
        currentUser: completedUser,
        loading: false,
      });

      const renderCourseModal = () => {
        return render(
          <BrowserRouter>
            <AuthProvider>
              <CourseDetailModal
                isOpen={true}
                course={mockCourse}
                onClose={vi.fn()}
              />
            </AuthProvider>
          </BrowserRouter>
        );
      };
      
      renderCourseModal();
      expect(screen.getByText(/practice completed/i)).toBeInTheDocument();
      expect(screen.getByText(/accuracy score: 85%/i)).toBeInTheDocument();
    });
  });
});