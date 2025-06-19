import { notifyInfo, notifySuccess, notifyWarning } from '../toast';

/**
 * Tavus Offline Queue
 * Handles queuing and processing of Tavus operations when offline
 */

interface QueueItem {
  id: string;
  operation: string;
  data: any;
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

/**
 * Enhanced offline queue with persistence and error recovery
 */
export class TavusOfflineQueue {
  private queue: QueueItem[] = [];
  private readonly STORAGE_KEY = 'tavus_offline_queue';
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly MAX_RETRY_COUNT = 5;
  private readonly ITEM_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Process queue when coming back online
    window.addEventListener('online', () => {
      console.log('🌐 Network restored - processing Tavus offline queue');
      this.processQueue().catch(console.error);
    });

    // Clean up queue periodically
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 60 * 60 * 1000); // Every hour
  }

  add(operation: string, data: any): string {
    const id = `tavus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Remove oldest items if queue is full
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.queue.shift();
      console.warn('⚠️ Offline queue full, removing oldest item');
    }
    
    const item: QueueItem = {
      id,
      operation,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    this.queue.push(item);
    this.saveToStorage();
    
    console.log('📦 Added operation to offline queue:', id, operation);
    notifyInfo('📦 Operation queued for when you\'re back online');
    
    return id;
  }

  async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      console.log('📦 Offline queue is empty');
      return;
    }

    if (!navigator.onLine) {
      console.log('📡 Still offline, cannot process queue');
      return;
    }

    console.log('🔄 Processing Tavus offline queue:', this.queue.length, 'items');
    
    const processedIds: string[] = [];
    const failedItems: QueueItem[] = [];

    for (const item of this.queue) {
      try {
        await this.processQueueItem(item);
        processedIds.push(item.id);
        console.log('✅ Processed queue item:', item.id);
      } catch (error) {
        console.error('❌ Error processing queue item:', item.id, error);
        
        item.retryCount++;
        item.lastError = error instanceof Error ? error.message : 'Unknown error';
        
        // Remove items that have exceeded retry limit or are expired
        if (item.retryCount >= this.MAX_RETRY_COUNT || this.isExpired(item)) {
          processedIds.push(item.id);
          console.log('🗑️ Removing failed/expired queue item:', item.id);
        } else {
          failedItems.push(item);
        }
      }
    }

    // Update queue with failed items that can be retried
    this.queue = failedItems;
    this.saveToStorage();

    if (processedIds.length > 0) {
      notifySuccess(`✅ Processed ${processedIds.length} queued operations`);
    }

    if (failedItems.length > 0) {
      notifyWarning(`⚠️ ${failedItems.length} operations will be retried later`);
    }
  }

  private async processQueueItem(item: QueueItem): Promise<void> {
    // Import functions dynamically to avoid circular dependencies
    const { updateUserTavusCompletion, startTavusSession, createTavusConversation, endTavusConversation } = await import('./api');
    
    switch (item.operation) {
      case 'updateCompletion':
        await updateUserTavusCompletion(
          item.data.userId,
          item.data.courseId,
          item.data.completion
        );
        break;
      
      case 'startSession':
        await startTavusSession(
          item.data.userId,
          item.data.courseId,
          item.data.ttl
        );
        break;

      case 'createConversation':
        await createTavusConversation(
          item.data.courseId,
          item.data.userId,
          item.data.sessionId
        );
        break;

      case 'endConversation':
        await endTavusConversation(item.data.conversationId);
        break;
      
      default:
        const { TavusError } = await import('./errors');
        throw new TavusError(`Unknown queue operation: ${item.operation}`, 'UNKNOWN_OPERATION');
    }
  }

  private isExpired(item: QueueItem): boolean {
    return Date.now() - item.timestamp > this.ITEM_EXPIRY_MS;
  }

  private cleanupExpiredItems(): void {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(item => !this.isExpired(item));
    
    if (this.queue.length < initialLength) {
      console.log(`🧹 Cleaned up ${initialLength - this.queue.length} expired queue items`);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('❌ Error saving offline queue to storage:', error);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        console.log('📦 Loaded Tavus offline queue:', this.queue.length, 'items');
        
        // Clean up expired items on load
        this.cleanupExpiredItems();
      }
    } catch (error) {
      console.error('❌ Error loading offline queue from storage:', error);
      this.queue = [];
    }
  }

  getQueueStatus(): { size: number; oldestItem?: number } {
    return {
      size: this.queue.length,
      oldestItem: this.queue.length > 0 ? this.queue[0].timestamp : undefined
    };
  }
}

// Export singleton instance
export const tavusOfflineQueue = new TavusOfflineQueue();