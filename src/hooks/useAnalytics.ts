import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trackPageView, setAnalyticsUser } from '../lib/analytics';

/**
 * Hook to automatically track page views and set user properties
 */
export const useAnalytics = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Track page views on route changes
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    const pageTitle = document.title;
    
    // Small delay to ensure page title is updated
    setTimeout(() => {
      trackPageView(pageName, pageTitle);
    }, 100);
  }, [location]);

  // Set user properties when user changes
  useEffect(() => {
    setAnalyticsUser(currentUser);
  }, [currentUser]);
};