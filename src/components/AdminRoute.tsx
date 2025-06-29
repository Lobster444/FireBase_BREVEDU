import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Warning } from '@phosphor-icons/react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt mb-4"></div>
          <p className="text-lg text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-grey rounded-[1.6rem] p-8 max-w-md w-full text-center shadow-lg border border-black/5">
          <Warning className="h-12 w-12 text-hyper-yellow mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-black mb-4">Authentication Required</h2>
          <p className="text-lg text-gray-700 mb-6">
            You must be signed in to access the admin panel.
          </p>
          <a
            href="/"
            className="inline-block bg-hyper-yellow text-black px-6 py-3 rounded-[1.2rem] text-lg font-medium hover:bg-[#ffed4d] transition-all shadow-lg"
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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-grey rounded-[1.6rem] p-8 max-w-md w-full text-center shadow-lg border border-black/5">
          <Shield className="h-12 w-12 text-red mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-black mb-4">Access Denied</h2>
          <p className="text-lg text-gray-700 mb-6">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="block bg-hyper-yellow text-black px-6 py-3 rounded-[1.2rem] text-lg font-medium hover:bg-[#ffed4d] transition-all shadow-lg"
            >
              Go to Homepage
            </a>
            <a
              href="/courses"
              className="block border border-cobalt text-cobalt px-6 py-3 rounded-[1.2rem] text-lg font-medium hover:bg-cobalt hover:text-white transition-all"
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