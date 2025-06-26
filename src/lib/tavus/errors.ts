/**
 * Tavus Error Classes
 * Enhanced error handling for Tavus AI service operations
 */

/**
 * Base Tavus error class with enhanced error handling
 */
export class TavusError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'TavusError';
  }
}

/**
 * Network-related errors (connection issues, timeouts, etc.)
 */
export class TavusNetworkError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details, true);
    this.name = 'TavusNetworkError';
  }
}

/**
 * Configuration-related errors (missing settings, invalid config, etc.)
 */
export class TavusConfigError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIG_ERROR', details, false);
    this.name = 'TavusConfigError';
  }
}

/**
 * API-related errors (HTTP errors, invalid responses, etc.)
 */
export class TavusAPIError extends TavusError {
  constructor(message: string, status: number, details?: any) {
    super(message, 'API_ERROR', { status, ...details }, status >= 500);
    this.name = 'TavusAPIError';
  }
}

/**
 * Timeout-related errors (request timeouts, session timeouts, etc.)
 */
export class TavusTimeoutError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'TIMEOUT_ERROR', details, true);
    this.name = 'TavusTimeoutError';
  }
}
/**
 * Usage limit-related errors (daily limits reached, quota exceeded, etc.)
 */
export class TavusLimitError extends TavusError {
  constructor(message: string, details?: any) {
    super(message, 'LIMIT_ERROR', details, false);
    this.name = 'TavusLimitError';
  }
}