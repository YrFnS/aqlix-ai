/**
 * Iraqi AI Chat Desktop - Offline Synchronization Service
 * Manages offline capabilities and data synchronization
 */

import { EventEmitter } from 'events';
import Store from 'electron-store';

// Types
interface SyncQueueItem {
  id: string;
  type: 'chat' | 'settings' | 'cultural' | 'professional' | 'document';
  action: 'create' | 'update' | 'delete' | 'sync';
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  culturalValidation?: boolean;
  professionalValidation?: boolean;
}

interface OfflineConfig {
  enableOfflineMode: boolean;
  syncInterval: number; // seconds
  maxQueueSize: number;
  maxRetries: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  culturalCaching: boolean;
  professionalCaching: boolean;
  arabicProcessingCache: boolean;
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  queueSize: number;
  syncInProgress: boolean;
  failedItems: number;
  errors: SyncError[];
}

interface SyncError {
  id: string;
  timestamp: Date;
  error: string;
  retryCount: number;
  itemType: string;
}

interface OfflineCapability {
  feature: string;
  available: boolean;
  description: string;
  descriptionAr: string;
  limitations: string[];
  storageRequired: number; // MB
  lastUpdated: Date;
}

export class OfflineSyncService extends EventEmitter {
  private store: Store;
  private config: OfflineConfig;
  private syncQueue: Map<string, SyncQueueItem>;
  private syncStatus: SyncStatus;
  private syncTimer: NodeJS.Timeout | null = null;
  private retryTimer: NodeJS.Timeout | null = null;
  private offlineCapabilities: Map<string, OfflineCapability>;
  
  constructor() {
    super();
    
    this.store = new Store({
      name: 'offline-sync',
      defaults: {
        config: this.getDefaultConfig(),
        syncQueue: {},
        offlineData: {
          chats: {},
          settings: {},
          culturalData: {},
          professionalData: {},
          documents: {},
          arabicCache: {}
        },
        syncStats: {
          totalSynced: 0,
          lastSuccessfulSync: null,
          averageSyncTime: 0,
          errorCount: 0
        }
      }
    });
    
    this.config = this.store.get('config') as OfflineConfig;
    this.syncQueue = new Map();
    this.syncStatus = {
      isOnline: navigator.onLine,
      lastSync: null,
      queueSize: 0,
      syncInProgress: false,
      failedItems: 0,
      errors: []
    };
    
    this.offlineCapabilities = new Map();
    
    this.initialize();
  }
  
  private getDefaultConfig(): OfflineConfig {
    return {
      enableOfflineMode: true,
      syncInterval: 30, // 30 seconds
      maxQueueSize: 1000,
      maxRetries: 3,
      compressionEnabled: true,
      encryptionEnabled: true,
      culturalCaching: true,
      professionalCaching: true,
      arabicProcessingCache: true
    };
  }
  
  private async initialize(): Promise<void> {
    try {
      // Load persisted sync queue
      await this.loadPersistedQueue();
      
      // Initialize offline capabilities
      await this.initializeOfflineCapabilities();
      
      // Set up online/offline listeners
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      
      // Start sync timer if online
      if (this.syncStatus.isOnline) {
        this.startSyncTimer();
      }
      
      console.log('OfflineSyncService initialized successfully');
      this.emit('initialized', { status: this.syncStatus });
      
    } catch (error) {
      console.error('Failed to initialize OfflineSyncService:', error);
      this.emit('error', { error: error.message });
    }
  }
  
  private async loadPersistedQueue(): Promise<void> {
    const persistedQueue = this.store.get('syncQueue') as Record<string, SyncQueueItem>;
    
    Object.entries(persistedQueue).forEach(([id, item]) => {
      // Convert timestamp strings back to Date objects
      item.timestamp = new Date(item.timestamp);
      this.syncQueue.set(id, item);
    });
    
    this.syncStatus.queueSize = this.syncQueue.size;
  }
  
  private async initializeOfflineCapabilities(): Promise<void> {
    // Chat functionality
    this.offlineCapabilities.set('chat', {
      feature: 'chat',
      available: true,
      description: 'Send and receive messages offline',
      descriptionAr: 'إرسال واستقبال الرسائل في وضع عدم الاتصال',
      limitations: [
        'Messages sent offline will be queued for sync',
        'AI responses not available offline',
        'Cultural validation uses cached models'
      ],
      storageRequired: 100, // MB
      lastUpdated: new Date()
    });
    
    // Arabic processing
    this.offlineCapabilities.set('arabic-processing', {
      feature: 'arabic-processing',
      available: this.config.arabicProcessingCache,
      description: 'Process Arabic text and detect dialects offline',
      descriptionAr: 'معالجة النصوص العربية وتحديد اللهجات في وضع عدم الاتصال',
      limitations: [
        'Limited dialect recognition accuracy',
        'No real-time updates to language models'
      ],
      storageRequired: 50, // MB
      lastUpdated: new Date()
    });
    
    // Cultural validation
    this.offlineCapabilities.set('cultural-validation', {
      feature: 'cultural-validation',
      available: this.config.culturalCaching,
      description: 'Validate content for cultural appropriateness offline',
      descriptionAr: 'التحقق من المحتوى للملائمة الثقافية في وضع عدم الاتصال',
      limitations: [
        'Uses cached cultural guidelines',
        'May not reflect latest cultural updates'
      ],
      storageRequired: 25, // MB
      lastUpdated: new Date()
    });
    
    // Professional domain
    this.offlineCapabilities.set('professional-domain', {
      feature: 'professional-domain',
      available: this.config.professionalCaching,
      description: 'Access professional domain features offline',
      descriptionAr: 'الوصول إلى ميزات النطاق المهني في وضع عدم الاتصال',
      limitations: [
        'Limited professional knowledge base',
        'No real-time regulatory updates'
      ],
      storageRequired: 75, // MB
      lastUpdated: new Date()
    });
    
    // Documents
    this.offlineCapabilities.set('documents', {
      feature: 'documents',
      available: true,
      description: 'View and edit documents offline',
      descriptionAr: 'عرض وتحرير المستندات في وضع عدم الاتصال',
      limitations: [
        'Collaboration features disabled',
        'No cloud synchronization'
      ],
      storageRequired: 200, // MB
      lastUpdated: new Date()
    });
    
    // Settings
    this.offlineCapabilities.set('settings', {
      feature: 'settings',
      available: true,
      description: 'Modify application settings offline',
      descriptionAr: 'تعديل إعدادات التطبيق في وضع عدم الاتصال',
      limitations: [
        'Settings sync when connection restored'
      ],
      storageRequired: 5, // MB
      lastUpdated: new Date()
    });
  }
  
  /**
   * Add item to sync queue
   */
  public addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>): string {
    const queueItem: SyncQueueItem = {
      id: this.generateId(),
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      ...item
    };
    
    // Check queue size limit
    if (this.syncQueue.size >= this.config.maxQueueSize) {
      // Remove oldest low priority items
      this.cleanupQueue();
    }
    
    this.syncQueue.set(queueItem.id, queueItem);
    this.syncStatus.queueSize = this.syncQueue.size;
    
    // Persist queue
    this.persistQueue();
    
    this.emit('queueUpdated', { 
      queueSize: this.syncStatus.queueSize,
      newItem: queueItem 
    });
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline && !this.syncStatus.syncInProgress) {
      setTimeout(() => this.performSync(), 1000);
    }
    
    return queueItem.id;
  }
  
  /**
   * Perform synchronization
   */
  private async performSync(): Promise<void> {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline || this.syncQueue.size === 0) {
      return;
    }
    
    this.syncStatus.syncInProgress = true;
    this.emit('syncStarted', { queueSize: this.syncStatus.queueSize });
    
    const startTime = Date.now();
    let processedCount = 0;
    let errorCount = 0;
    
    try {
      // Sort queue by priority and timestamp
      const sortedItems = Array.from(this.syncQueue.values()).sort((a, b) => {
        const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
      
      // Process items
      for (const item of sortedItems) {
        try {
          await this.syncItem(item);
          this.syncQueue.delete(item.id);
          processedCount++;
          
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          errorCount++;
          
          // Increment retry count
          item.retryCount++;
          
          if (item.retryCount >= item.maxRetries) {
            // Move to failed items
            this.handleFailedItem(item, error as Error);
            this.syncQueue.delete(item.id);
          }
          
          // Add to error list
          this.syncStatus.errors.push({
            id: item.id,
            timestamp: new Date(),
            error: (error as Error).message,
            retryCount: item.retryCount,
            itemType: item.type
          });
        }
      }
      
      // Update sync status
      this.syncStatus.lastSync = new Date();
      this.syncStatus.queueSize = this.syncQueue.size;
      this.syncStatus.failedItems = errorCount;
      
      // Update statistics
      const syncTime = Date.now() - startTime;
      this.updateSyncStats(processedCount, syncTime, errorCount);
      
      // Persist queue
      this.persistQueue();
      
      this.emit('syncCompleted', {
        processedCount,
        errorCount,
        syncTime,
        remainingItems: this.syncQueue.size
      });
      
    } catch (error) {
      console.error('Sync process failed:', error);
      this.emit('syncError', { error: (error as Error).message });
      
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }
  
  /**
   * Sync individual item
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    switch (item.type) {
      case 'chat':
        await this.syncChatItem(item);
        break;
      case 'settings':
        await this.syncSettingsItem(item);
        break;
      case 'cultural':
        await this.syncCulturalItem(item);
        break;
      case 'professional':
        await this.syncProfessionalItem(item);
        break;
      case 'document':
        await this.syncDocumentItem(item);
        break;
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }
  
  private async syncChatItem(item: SyncQueueItem): Promise<void> {
    // Implement chat synchronization logic
    // This would typically involve API calls to sync chat messages
    console.log('Syncing chat item:', item.id);
    
    // Simulate API call
    await this.simulateApiCall(500);
    
    // If cultural validation is required
    if (item.culturalValidation) {
      await this.validateCulturalContent(item.data);
    }
  }
  
  private async syncSettingsItem(item: SyncQueueItem): Promise<void> {
    // Implement settings synchronization logic
    console.log('Syncing settings item:', item.id);
    await this.simulateApiCall(200);
  }
  
  private async syncCulturalItem(item: SyncQueueItem): Promise<void> {
    // Implement cultural data synchronization
    console.log('Syncing cultural item:', item.id);
    await this.simulateApiCall(300);
  }
  
  private async syncProfessionalItem(item: SyncQueueItem): Promise<void> {
    // Implement professional data synchronization
    console.log('Syncing professional item:', item.id);
    await this.simulateApiCall(400);
    
    if (item.professionalValidation) {
      await this.validateProfessionalContent(item.data);
    }
  }
  
  private async syncDocumentItem(item: SyncQueueItem): Promise<void> {
    // Implement document synchronization
    console.log('Syncing document item:', item.id);
    await this.simulateApiCall(600);
  }
  
  private async validateCulturalContent(data: any): Promise<void> {
    // Cultural validation logic
    console.log('Validating cultural content');
    await this.simulateApiCall(100);
  }
  
  private async validateProfessionalContent(data: any): Promise<void> {
    // Professional validation logic
    console.log('Validating professional content');
    await this.simulateApiCall(150);
  }
  
  private async simulateApiCall(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  
  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.syncStatus.isOnline = true;
    console.log('Connection restored - starting sync');
    this.emit('connectionRestored', { queueSize: this.syncStatus.queueSize });
    
    this.startSyncTimer();
    
    // Start sync immediately
    setTimeout(() => this.performSync(), 1000);
  }
  
  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.syncStatus.isOnline = false;
    console.log('Connection lost - entering offline mode');
    this.emit('connectionLost', { offlineCapabilities: Array.from(this.offlineCapabilities.values()) });
    
    this.stopSyncTimer();
  }
  
  /**
   * Start sync timer
   */
  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(() => {
      if (this.syncStatus.isOnline && this.syncQueue.size > 0) {
        this.performSync();
      }
    }, this.config.syncInterval * 1000);
  }
  
  /**
   * Stop sync timer
   */
  private stopSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
  
  /**
   * Clean up queue by removing oldest low priority items
   */
  private cleanupQueue(): void {
    const items = Array.from(this.syncQueue.values());
    const lowPriorityItems = items
      .filter(item => item.priority === 'low')
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Remove 10% of low priority items
    const itemsToRemove = Math.ceil(lowPriorityItems.length * 0.1);
    
    for (let i = 0; i < itemsToRemove && i < lowPriorityItems.length; i++) {
      this.syncQueue.delete(lowPriorityItems[i].id);
    }
  }
  
  /**
   * Handle failed sync item
   */
  private handleFailedItem(item: SyncQueueItem, error: Error): void {
    console.error(`Item ${item.id} failed after ${item.retryCount} retries:`, error);
    
    // Store failed item for manual retry
    const failedItems = this.store.get('failedItems', []) as any[];
    failedItems.push({
      ...item,
      failedAt: new Date(),
      error: error.message
    });
    this.store.set('failedItems', failedItems);
    
    this.emit('itemFailed', { item, error: error.message });
  }
  
  /**
   * Update sync statistics
   */
  private updateSyncStats(processedCount: number, syncTime: number, errorCount: number): void {
    const stats = this.store.get('syncStats') as any;
    
    stats.totalSynced += processedCount;
    stats.errorCount += errorCount;
    stats.lastSuccessfulSync = processedCount > 0 ? new Date() : stats.lastSuccessfulSync;
    stats.averageSyncTime = ((stats.averageSyncTime * (stats.totalSynced - processedCount)) + syncTime) / stats.totalSynced;
    
    this.store.set('syncStats', stats);
  }
  
  /**
   * Persist sync queue to storage
   */
  private persistQueue(): void {
    const queueObject: Record<string, SyncQueueItem> = {};
    this.syncQueue.forEach((item, id) => {
      queueObject[id] = item;
    });
    this.store.set('syncQueue', queueObject);
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  /**
   * Public API methods
   */
  
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
  
  public getOfflineCapabilities(): OfflineCapability[] {
    return Array.from(this.offlineCapabilities.values());
  }
  
  public isFeatureAvailableOffline(feature: string): boolean {
    const capability = this.offlineCapabilities.get(feature);
    return capability ? capability.available : false;
  }
  
  public forcSync(): void {
    if (this.syncStatus.isOnline) {
      this.performSync();
    }
  }
  
  public clearSyncQueue(): void {
    this.syncQueue.clear();
    this.syncStatus.queueSize = 0;
    this.persistQueue();
    this.emit('queueCleared');
  }
  
  public retryFailedItems(): number {
    const failedItems = this.store.get('failedItems', []) as any[];
    let retriedCount = 0;
    
    failedItems.forEach((item: any) => {
      // Reset retry count and add back to queue
      item.retryCount = 0;
      delete item.failedAt;
      delete item.error;
      
      this.syncQueue.set(item.id, item);
      retriedCount++;
    });
    
    // Clear failed items
    this.store.set('failedItems', []);
    
    this.syncStatus.queueSize = this.syncQueue.size;
    this.persistQueue();
    
    this.emit('failedItemsRetried', { count: retriedCount });
    
    return retriedCount;
  }
  
  public updateConfig(newConfig: Partial<OfflineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.store.set('config', this.config);
    
    // Restart sync timer if interval changed
    if (newConfig.syncInterval && this.syncTimer) {
      this.startSyncTimer();
    }
    
    this.emit('configUpdated', this.config);
  }
  
  public getConfig(): OfflineConfig {
    return { ...this.config };
  }
  
  public getSyncStats(): any {
    return this.store.get('syncStats');
  }
  
  public exportOfflineData(): any {
    return {
      queue: Array.from(this.syncQueue.values()),
      failedItems: this.store.get('failedItems', []),
      offlineData: this.store.get('offlineData', {}),
      stats: this.store.get('syncStats', {}),
      capabilities: Array.from(this.offlineCapabilities.values())
    };
  }
  
  public destroy(): void {
    this.stopSyncTimer();
    
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    
    this.removeAllListeners();
  }
}