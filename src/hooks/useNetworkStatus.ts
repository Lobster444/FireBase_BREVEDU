import { useState, useEffect } from 'react';
import { notifyInfo, notifyWarning } from '../lib/toast';

/**
 * Custom hook to monitor network connectivity status
 * @param showToasts - Whether to show toast notifications on status change
 * @returns boolean indicating if the device is online
 */
const useNetworkStatus = (showToasts: boolean = false) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) {
        notifyInfo('🌐 Back online! You can now save changes.');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) {
        notifyWarning('📡 You\'re offline. Changes cannot be saved until connection is restored.');
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToasts]);

  return isOnline;
};

/**
 * Hook that provides network status with additional utilities
 * @param showToasts - Whether to show toast notifications
 * @returns Object with network status and utility functions
 */
export const useNetworkStatusWithUtils = (showToasts: boolean = false) => {
  const isOnline = useNetworkStatus(showToasts);

  const checkOnlineStatus = () => {
    if (!isOnline) {
      notifyWarning('🚫 You\'re offline. Please check your internet connection.');
      return false;
    }
    return true;
  };

  const executeIfOnline = (callback: () => void, offlineMessage?: string) => {
    if (isOnline) {
      callback();
    } else {
      notifyWarning(offlineMessage || '🚫 This action requires an internet connection.');
    }
  };

  return {
    isOnline,
    checkOnlineStatus,
    executeIfOnline,
  };
};