import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TavusSettings {
  replica_id: string;
  persona_id: string;
  api_key: string;
  enabled: boolean;
}

interface UseTavusSettingsReturn {
  settings: TavusSettings | null;
  loading: boolean;
  error: string | null;
  isEnabled: boolean;
}

/**
 * Hook to get Tavus settings with real-time updates
 */
export const useTavusSettings = (): UseTavusSettingsReturn => {
  const [settings, setSettings] = useState<TavusSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'tavus');
    
    const unsubscribe = onSnapshot(
      settingsRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setSettings({
            replica_id: data.replica_id || '',
            persona_id: data.persona_id || '',
            api_key: data.api_key || '',
            enabled: data.enabled !== undefined ? data.enabled : true
          });
        } else {
          setSettings(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching Tavus settings:', error);
        setError('Failed to load Tavus settings');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return {
    settings,
    loading,
    error,
    isEnabled: settings?.enabled ?? true
  };
};