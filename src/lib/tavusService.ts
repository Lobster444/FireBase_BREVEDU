/**
 * Tavus Service - Main Entry Point
 * Re-exports all Tavus functionality for backward compatibility
 */

// Export error classes
export {
  TavusError,
  TavusNetworkError,
  TavusConfigError,
  TavusAPIError,
  TavusTimeoutError,
  TavusLimitError
} from './tavus/errors';

// Export offline queue
export { tavusOfflineQueue } from './tavus/offlineQueue';

// Export API functions
export {
  createTavusConversation,
  endTavusConversation,
  startTavusSession,
  updateTavusSession,
  completeTavusSession,
  updateUserTavusCompletion,
  retryTavusOperation,
  executeWithOfflineFallback,
  checkTavusHealth
} from './tavus/api';