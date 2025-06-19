import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkTavusHealth } from '../tavusService';

// Mock Firebase
vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('Tavus Health Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  it('should report healthy system when all components work', async () => {
    const { getDoc } = require('firebase/firestore');
    
    // Mock healthy settings
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        replica_id: 'test-replica',
        persona_id: 'test-persona',
        api_key: 'test-key'
      })
    });

    // Mock healthy API
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 'healthy' }),
    });

    const health = await checkTavusHealth();

    expect(health).toEqual({
      settings: true,
      api: true,
      network: true,
      queue: { size: 0 }
    });
  });

  it('should detect missing settings', async () => {
    const { getDoc } = require('firebase/firestore');
    
    // Mock missing settings
    getDoc.mockResolvedValue({
      exists: () => false
    });

    const health = await checkTavusHealth();

    expect(health.settings).toBe(false);
    expect(health.api).toBe(false); // Can't test API without settings
  });

  it('should detect API issues', async () => {
    const { getDoc } = require('firebase/firestore');
    
    // Mock healthy settings
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        replica_id: 'test-replica',
        persona_id: 'test-persona',
        api_key: 'test-key'
      })
    });

    // Mock unhealthy API
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const health = await checkTavusHealth();

    expect(health.settings).toBe(true);
    expect(health.api).toBe(false);
  });

  it('should detect network issues', async () => {
    // Mock offline
    Object.defineProperty(navigator, 'onLine', { value: false });

    const health = await checkTavusHealth();

    expect(health.network).toBe(false);
    expect(health.api).toBe(false); // Can't test API when offline
  });

  it('should handle API timeout gracefully', async () => {
    const { getDoc } = require('firebase/firestore');
    
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        replica_id: 'test-replica',
        persona_id: 'test-persona',
        api_key: 'test-key'
      })
    });

    // Mock API timeout
    (global.fetch as any).mockRejectedValueOnce(new Error('Timeout'));

    const health = await checkTavusHealth();

    expect(health.settings).toBe(true);
    expect(health.api).toBe(false);
  });

  it('should include queue status', async () => {
    const { getDoc } = require('firebase/firestore');
    
    getDoc.mockResolvedValue({
      exists: () => false
    });

    const health = await checkTavusHealth();

    expect(health.queue).toBeDefined();
    expect(typeof health.queue.size).toBe('number');
  });
});