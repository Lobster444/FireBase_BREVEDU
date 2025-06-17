import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow mb-4"></div>
          <p className="text-body text-text-secondary">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="bg-neutral-gray/10 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-accent-yellow mx-auto mb-4" />
          <h2 className="text-h2 text-text-light mb-4">Authentication Required</h2>
          <p className="text-body text-text-secondary mb-6">
            You must be signed in to access the admin panel.
          </p>
          <a
            href="/"
            className="inline-block bg-accent-yellow text-text-dark px-6 py-3 rounded-lg text-link font-medium hover:bg-accent-green transition-all shadow-button"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Check if user has admin privileges
  if (!currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="bg-neutral-gray/10 rounded-2xl p-8 max-w-md w-full text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-h2 text-text-light mb-4">Access Denied</h2>
          <p className="text-body text-text-secondary mb-6">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="block bg-accent-yellow text-text-dark px-6 py-3 rounded-lg text-link font-medium hover:bg-accent-green transition-all shadow-button"
            >
              Go to Homepage
            </a>
            <a
              href="/courses"
              className="block border border-accent-purple text-accent-purple px-6 py-3 rounded-lg text-link font-medium hover:bg-accent-purple hover:text-text-dark transition-all"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has admin privileges
  return <>{children}</>;
};

export default AdminRoute;