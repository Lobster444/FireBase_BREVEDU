import { useState, useEffect } from 'react';
import { tavusOfflineQueue } from '../lib/tavusService';
import { notifyInfo, notifyWarning, notifyError } from '../lib/toast';

/**
 * Hook for handling offline scenarios in Tavus operations
 */
export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      notifyInfo('🌐 Back online! Processing queued Tavus operations...');
      
      // Process offline queue
      tavusOfflineQueue.processQueue()
        .then(() => {
          notifyInfo('✅ All queued operations processed successfully');
        })
        .catch((error) => {
          console.error('❌ Error processing offline queue:', error);
          notifyError('❌ Some queued operations failed to process');
        });
    };

    const handleOffline = () => {
      setIsOnline(false);
      notifyWarning('📡 You\'re offline. Tavus operations will be queued until connection is restored.');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Queue Tavus operation for offline processing
  const queueTavusOperation = (operation: string, data: any): string => {
    if (isOnline) {
      console.warn('⚠️ Attempting to queue operation while online');
      return '';
    }

    const id = tavusOfflineQueue.add(operation, data);
    setQueueSize(prev => prev + 1);
    
    notifyInfo(`📦 Tavus operation queued for when you're back online`);
    return id;
  };

  // Execute operation with offline fallback
  const executeWithOfflineFallback = async <T>(
    operation: () => Promise<T>,
    fallbackData: { operation: string; data: any }
  ): Promise<T | null> => {
    if (!isOnline) {
      queueTavusOperation(fallbackData.operation, fallbackData.data);
      return null;
    }

    try {
      return await operation();
    } catch (error) {
      console.error('❌ Operation failed, queuing for retry:', error);
      queueTavusOperation(fallbackData.operation, fallbackData.data);
      throw error;
    }
  };

  return {
    isOnline,
    queueSize,
    queueTavusOperation,
    executeWithOfflineFallback
  };
};