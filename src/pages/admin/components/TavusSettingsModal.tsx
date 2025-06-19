import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { notifyLoading, updateToast, notifyError } from '../../../lib/toast';

interface TavusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TavusSettingsModal: React.FC<TavusSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    replica_id: '',
    persona_id: '',
    api_key: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTavusSettings();
    }
  }, [isOpen]);

  const loadTavusSettings = async () => {
    setLoading(true);
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../../../lib/firebase');
      
      const settingsRef = doc(db, 'settings', 'tavus');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setSettings({
          replica_id: data.replica_id || '',
          persona_id: data.persona_id || '',
          api_key: data.api_key || ''
        });
      }
    } catch (error) {
      console.error('Error loading Tavus settings:', error);
      notifyError('Failed to load Tavus settings');
    } finally {
      setLoading(false);
    }
  };

  const saveTavusSettings = async () => {
    setSaving(true);
    const toastId = notifyLoading('Saving Tavus settings...');
    
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../../lib/firebase');
      
      const settingsRef = doc(db, 'settings', 'tavus');
      await setDoc(settingsRef, {
        replica_id: settings.replica_id.trim(),
        persona_id: settings.persona_id.trim(),
        api_key: settings.api_key.trim(),
        updatedAt: new Date().toISOString()
      });
      
      updateToast(toastId, '✅ Tavus settings saved successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error saving Tavus settings:', error);
      updateToast(toastId, '❌ Failed to save Tavus settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-headspace-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <span>Tavus AI Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-headspace-lg hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Replica ID *
              </label>
              <input
                type="text"
                value={settings.replica_id}
                onChange={(e) => setSettings(prev => ({ ...prev, replica_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-headspace-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter Tavus replica ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Persona ID *
              </label>
              <input
                type="text"
                value={settings.persona_id}
                onChange={(e) => setSettings(prev => ({ ...prev, persona_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-headspace-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter Tavus persona ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                API Key *
              </label>
              <input
                type="password"
                value={settings.api_key}
                onChange={(e) => setSettings(prev => ({ ...prev, api_key: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-headspace-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter Tavus API key"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="bg-blue-50 border border-blue-200 rounded-headspace-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These settings are used for all dynamic AI conversations. 
                Make sure to use valid Tavus credentials.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-headspace-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveTavusSettings}
                disabled={saving || !settings.replica_id || !settings.persona_id || !settings.api_key}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-headspace-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusSettingsModal;