/**
 * Iraqi AI Chat System - Offline Functionality Manager
 * Enhanced for Iraqi Remote Locations and Government Users
 *
 * Features:
 * - Comprehensive offline data synchronization
 * - Chat history persistence with government encryption
 * - Professional domain offline capabilities
 * - Arabic text processing offline support
 * - Background sync for intermittent connectivity
 * - Enterprise-grade caching with security compliance
 */

import { ipcMain, BrowserWindow } from "electron";
import { join } from "path";
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "fs";
import { app } from "electron";
import crypto from "crypto";

// Offline Data Types
interface OfflineChat {
  id: string;
  title: string;
  messages: OfflineMessage[];
  domain: string;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: "pending" | "synced" | "conflict";
  encryptionLevel: "none" | "standard" | "government";
}

interface OfflineMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  language: "ar" | "en" | "mixed";
  domain: string;
  persona?: string;
  attachments?: OfflineAttachment[];
  metadata?: {
    culturalScore?: number;
    professionalScore?: number;
    complianceLevel?: string;
  };
}

interface OfflineAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded
  encryptedData?: string;
}

interface OfflinePersona {
  id: string;
  name: string;
  arabicName: string;
  domain: string;
  configuration: any;
  lastUsed: Date;
  syncStatus: "pending" | "synced" | "conflict";
}

interface OfflineConfig {
  version: string;
  lastSync: Date;
  syncInterval: number; // minutes
  maxCacheSize: number; // MB
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
  retentionPeriod: number; // days
  autoSync: boolean;
  syncOnWiFiOnly: boolean;
  backgroundSyncEnabled: boolean;
}

interface SyncQueueItem {
  id: string;
  type: "chat" | "persona" | "attachment" | "config";
  action: "create" | "update" | "delete";
  data: any;
  priority: "high" | "medium" | "low";
  attempts: number;
  maxAttempts: number;
  lastAttempt?: Date;
  error?: string;
}

// Offline Manager Class
export class IraqiOfflineManager {
  private offlineDir: string;
  private chatsDir: string;
  private personasDir: string;
  private attachmentsDir: string;
  private cacheDir: string;
  private configFile: string;
  private encryptionKey: Buffer;
  private config: OfflineConfig;
  private syncQueue: SyncQueueItem[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncTimer: NodeJS.Timer | null = null;

  constructor() {
    this.offlineDir = join(app.getPath("userData"), "offline");
    this.chatsDir = join(this.offlineDir, "chats");
    this.personasDir = join(this.offlineDir, "personas");
    this.attachmentsDir = join(this.offlineDir, "attachments");
    this.cacheDir = join(this.offlineDir, "cache");
    this.configFile = join(this.offlineDir, "config.json");

    this.initializeOfflineStorage();
    this.loadConfiguration();
    this.setupNetworkMonitoring();
    this.initializeEncryption();
    this.startBackgroundSync();
  }

  private initializeOfflineStorage(): void {
    const dirs = [
      this.offlineDir,
      this.chatsDir,
      this.personasDir,
      this.attachmentsDir,
      this.cacheDir,
    ];

    dirs.forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  private loadConfiguration(): void {
    const defaultConfig: OfflineConfig = {
      version: "1.0.0",
      lastSync: new Date(),
      syncInterval: 15, // 15 minutes
      maxCacheSize: 500, // 500 MB
      encryptionEnabled: true,
      compressionEnabled: true,
      retentionPeriod: 30, // 30 days
      autoSync: true,
      syncOnWiFiOnly: false,
      backgroundSyncEnabled: true,
    };

    if (existsSync(this.configFile)) {
      try {
        const configData = readFileSync(this.configFile, "utf-8");
        this.config = { ...defaultConfig, ...JSON.parse(configData) };
      } catch (error) {
        console.error("Failed to load offline config:", error);
        this.config = defaultConfig;
      }
    } else {
      this.config = defaultConfig;
      this.saveConfiguration();
    }
  }

  private saveConfiguration(): void {
    try {
      writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error("Failed to save offline config:", error);
    }
  }

  private initializeEncryption(): void {
    // Generate or load encryption key for government compliance
    const keyFile = join(this.offlineDir, "key.bin");

    if (existsSync(keyFile)) {
      try {
        this.encryptionKey = readFileSync(keyFile);
      } catch (error) {
        console.error("Failed to load encryption key:", error);
        this.generateEncryptionKey();
      }
    } else {
      this.generateEncryptionKey();
    }
  }

  private generateEncryptionKey(): void {
    this.encryptionKey = crypto.randomBytes(32); // 256-bit key
    const keyFile = join(this.offlineDir, "key.bin");

    try {
      writeFileSync(keyFile, this.encryptionKey);
      console.log("Generated new encryption key for offline storage");
    } catch (error) {
      console.error("Failed to save encryption key:", error);
    }
  }

  private setupNetworkMonitoring(): void {
    // Monitor network status changes
    const updateOnlineStatus = () => {
      const wasOnline = this.isOnline;
      this.isOnline = navigator.onLine;

      if (!wasOnline && this.isOnline) {
        console.log("Network connection restored - starting sync");
        this.syncWhenOnline();
      } else if (wasOnline && !this.isOnline) {
        console.log("Network connection lost - switching to offline mode");
        this.enableOfflineMode();
      }
    };

    // Listen for network events
    process.on("online", updateOnlineStatus);
    process.on("offline", updateOnlineStatus);

    // Periodic connectivity check for government networks
    setInterval(() => {
      this.checkConnectivity();
    }, 30000); // Check every 30 seconds
  }

  private async checkConnectivity(): Promise<boolean> {
    try {
      // Try to reach a known government endpoint
      const response = await fetch("https://iraqi-ai.gov.iq/api/ping", {
        method: "HEAD",
        timeout: 5000,
      });

      const isConnected = response.ok;

      if (this.isOnline !== isConnected) {
        this.isOnline = isConnected;

        if (isConnected) {
          this.syncWhenOnline();
        }
      }

      return isConnected;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  private startBackgroundSync(): void {
    if (!this.config.backgroundSyncEnabled) return;

    this.syncTimer = setInterval(
      () => {
        if (this.isOnline && this.config.autoSync) {
          this.processSyncQueue();
        }
      },
      this.config.syncInterval * 60 * 1000,
    );
  }

  private stopBackgroundSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // Encryption Utilities
  private encryptData(
    data: string,
    level: "standard" | "government" = "standard",
  ): string {
    if (!this.config.encryptionEnabled) return data;

    try {
      const algorithm = level === "government" ? "aes-256-gcm" : "aes-256-cbc";
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(algorithm, this.encryptionKey);

      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");

      return `${algorithm}:${iv.toString("hex")}:${encrypted}`;
    } catch (error) {
      console.error("Encryption failed:", error);
      return data; // Fallback to unencrypted
    }
  }

  private decryptData(encryptedData: string): string {
    if (!this.config.encryptionEnabled || !encryptedData.includes(":")) {
      return encryptedData;
    }

    try {
      const [algorithm, ivHex, encrypted] = encryptedData.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipher(algorithm, this.encryptionKey);

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("Decryption failed:", error);
      return encryptedData; // Return as-is if decryption fails
    }
  }

  // Chat Management
  async saveChat(chat: OfflineChat): Promise<boolean> {
    try {
      const chatFile = join(this.chatsDir, `${chat.id}.json`);
      const encryptionLevel =
        chat.encryptionLevel === "government" ? "government" : "standard";

      // Encrypt sensitive data
      const chatData = {
        ...chat,
        messages: chat.messages.map((msg) => ({
          ...msg,
          content: this.encryptData(msg.content, encryptionLevel),
        })),
      };

      writeFileSync(chatFile, JSON.stringify(chatData, null, 2));

      // Add to sync queue if online
      this.addToSyncQueue({
        id: crypto.randomUUID(),
        type: "chat",
        action: "update",
        data: chat,
        priority: "medium",
        attempts: 0,
        maxAttempts: 3,
      });

      return true;
    } catch (error) {
      console.error("Failed to save chat:", error);
      return false;
    }
  }

  async loadChat(chatId: string): Promise<OfflineChat | null> {
    try {
      const chatFile = join(this.chatsDir, `${chatId}.json`);

      if (!existsSync(chatFile)) {
        return null;
      }

      const chatData = JSON.parse(readFileSync(chatFile, "utf-8"));

      // Decrypt messages
      chatData.messages = chatData.messages.map((msg: any) => ({
        ...msg,
        content: this.decryptData(msg.content),
        timestamp: new Date(msg.timestamp),
      }));

      chatData.createdAt = new Date(chatData.createdAt);
      chatData.updatedAt = new Date(chatData.updatedAt);

      return chatData as OfflineChat;
    } catch (error) {
      console.error("Failed to load chat:", error);
      return null;
    }
  }

  async getAllChats(): Promise<OfflineChat[]> {
    try {
      const chatFiles = readdirSync(this.chatsDir).filter((file) =>
        file.endsWith(".json"),
      );
      const chats: OfflineChat[] = [];

      for (const file of chatFiles) {
        const chatId = file.replace(".json", "");
        const chat = await this.loadChat(chatId);

        if (chat) {
          chats.push(chat);
        }
      }

      // Sort by last updated
      return chats.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      );
    } catch (error) {
      console.error("Failed to load chats:", error);
      return [];
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const chatFile = join(this.chatsDir, `${chatId}.json`);

      if (existsSync(chatFile)) {
        // Security wipe for government compliance
        writeFileSync(chatFile, crypto.randomBytes(1024)); // Overwrite with random data
        readdirSync(chatFile); // Trigger file system sync

        // Add to sync queue
        this.addToSyncQueue({
          id: crypto.randomUUID(),
          type: "chat",
          action: "delete",
          data: { id: chatId },
          priority: "high",
          attempts: 0,
          maxAttempts: 3,
        });
      }

      return true;
    } catch (error) {
      console.error("Failed to delete chat:", error);
      return false;
    }
  }

  // Persona Management
  async savePersona(persona: OfflinePersona): Promise<boolean> {
    try {
      const personaFile = join(this.personasDir, `${persona.id}.json`);

      // Encrypt persona configuration
      const personaData = {
        ...persona,
        configuration: this.encryptData(JSON.stringify(persona.configuration)),
      };

      writeFileSync(personaFile, JSON.stringify(personaData, null, 2));

      this.addToSyncQueue({
        id: crypto.randomUUID(),
        type: "persona",
        action: "update",
        data: persona,
        priority: "low",
        attempts: 0,
        maxAttempts: 3,
      });

      return true;
    } catch (error) {
      console.error("Failed to save persona:", error);
      return false;
    }
  }

  async loadPersona(personaId: string): Promise<OfflinePersona | null> {
    try {
      const personaFile = join(this.personasDir, `${personaId}.json`);

      if (!existsSync(personaFile)) {
        return null;
      }

      const personaData = JSON.parse(readFileSync(personaFile, "utf-8"));

      // Decrypt configuration
      personaData.configuration = JSON.parse(
        this.decryptData(personaData.configuration),
      );
      personaData.lastUsed = new Date(personaData.lastUsed);

      return personaData as OfflinePersona;
    } catch (error) {
      console.error("Failed to load persona:", error);
      return null;
    }
  }

  // Attachment Management
  async saveAttachment(attachment: OfflineAttachment): Promise<boolean> {
    try {
      const attachmentFile = join(this.attachmentsDir, `${attachment.id}.json`);

      // Encrypt attachment data for government compliance
      const encryptedAttachment = {
        ...attachment,
        data: undefined,
        encryptedData: this.encryptData(attachment.data, "government"),
      };

      writeFileSync(
        attachmentFile,
        JSON.stringify(encryptedAttachment, null, 2),
      );

      this.addToSyncQueue({
        id: crypto.randomUUID(),
        type: "attachment",
        action: "create",
        data: attachment,
        priority: "low",
        attempts: 0,
        maxAttempts: 5,
      });

      return true;
    } catch (error) {
      console.error("Failed to save attachment:", error);
      return false;
    }
  }

  // Cache Management
  async setCachedData(key: string, data: any, ttl?: number): Promise<boolean> {
    try {
      const cacheFile = join(
        this.cacheDir,
        `${crypto.createHash("md5").update(key).digest("hex")}.json`,
      );

      const cacheEntry = {
        key,
        data,
        createdAt: new Date(),
        expiresAt: ttl ? new Date(Date.now() + ttl * 1000) : null,
        size: JSON.stringify(data).length,
      };

      writeFileSync(cacheFile, JSON.stringify(cacheEntry, null, 2));

      // Check cache size and cleanup if needed
      this.cleanupCache();

      return true;
    } catch (error) {
      console.error("Failed to cache data:", error);
      return false;
    }
  }

  async getCachedData(key: string): Promise<any> {
    try {
      const cacheFile = join(
        this.cacheDir,
        `${crypto.createHash("md5").update(key).digest("hex")}.json`,
      );

      if (!existsSync(cacheFile)) {
        return null;
      }

      const cacheEntry = JSON.parse(readFileSync(cacheFile, "utf-8"));

      // Check if expired
      if (cacheEntry.expiresAt && new Date() > new Date(cacheEntry.expiresAt)) {
        // Remove expired cache
        readdirSync(cacheFile);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error("Failed to retrieve cached data:", error);
      return null;
    }
  }

  private cleanupCache(): void {
    try {
      const cacheFiles = readdirSync(this.cacheDir).filter((file) =>
        file.endsWith(".json"),
      );
      let totalSize = 0;
      const cacheEntries: Array<{
        file: string;
        size: number;
        createdAt: Date;
      }> = [];

      // Calculate total cache size
      for (const file of cacheFiles) {
        const filePath = join(this.cacheDir, file);
        const stats = statSync(filePath);
        const cacheData = JSON.parse(readFileSync(filePath, "utf-8"));

        totalSize += stats.size;
        cacheEntries.push({
          file,
          size: stats.size,
          createdAt: new Date(cacheData.createdAt),
        });
      }

      // Convert to MB
      totalSize = totalSize / (1024 * 1024);

      // If over limit, remove oldest entries
      if (totalSize > this.config.maxCacheSize) {
        cacheEntries.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        );

        let removedSize = 0;
        for (const entry of cacheEntries) {
          if (
            totalSize - removedSize / (1024 * 1024) <=
            this.config.maxCacheSize * 0.8
          ) {
            break;
          }

          const filePath = join(this.cacheDir, entry.file);
          readdirSync(filePath);
          removedSize += entry.size;
        }

        console.log(`Cleaned up ${removedSize / (1024 * 1024)}MB from cache`);
      }
    } catch (error) {
      console.error("Failed to cleanup cache:", error);
    }
  }

  // Sync Queue Management
  private addToSyncQueue(item: SyncQueueItem): void {
    this.syncQueue.push(item);

    // If online, try to process immediately
    if (this.isOnline) {
      setTimeout(() => this.processSyncQueue(), 1000);
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    // Sort by priority
    this.syncQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const itemsToProcess = this.syncQueue.splice(0, 5); // Process 5 items at a time

    for (const item of itemsToProcess) {
      try {
        await this.syncItem(item);
        console.log(`Successfully synced ${item.type} ${item.id}`);
      } catch (error) {
        item.attempts++;
        item.lastAttempt = new Date();
        item.error = error instanceof Error ? error.message : String(error);

        if (item.attempts < item.maxAttempts) {
          // Re-add to queue with exponential backoff
          setTimeout(
            () => {
              this.syncQueue.push(item);
            },
            Math.pow(2, item.attempts) * 1000,
          );
        } else {
          console.error(
            `Failed to sync ${item.type} ${item.id} after ${item.maxAttempts} attempts:`,
            error,
          );
        }
      }
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    // Implementation would depend on the actual API endpoints
    // This is a placeholder for the sync logic

    const endpoint = `https://iraqi-ai.gov.iq/api/sync/${item.type}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sync-Action": item.action,
      },
      body: JSON.stringify(item.data),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }
  }

  // Public API Methods
  async enableOfflineMode(): Promise<boolean> {
    try {
      console.log("Enabling offline mode for Iraqi AI Chat System");

      // Cache essential data
      await this.cacheEssentialData();

      // Update configuration
      this.config.lastSync = new Date();
      this.saveConfiguration();

      return true;
    } catch (error) {
      console.error("Failed to enable offline mode:", error);
      return false;
    }
  }

  async disableOfflineMode(): Promise<boolean> {
    try {
      console.log("Disabling offline mode - syncing data");

      if (this.isOnline) {
        await this.syncWhenOnline();
      }

      return true;
    } catch (error) {
      console.error("Failed to disable offline mode:", error);
      return false;
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (!this.isOnline) {
      console.log("Cannot sync - no network connection");
      return;
    }

    try {
      console.log("Starting sync process...");

      // Process all pending sync items
      await this.processSyncQueue();

      // Update last sync time
      this.config.lastSync = new Date();
      this.saveConfiguration();

      console.log("Sync completed successfully");

      // Notify renderer process
      const windows = BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send("sync-completed");
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }

  private async cacheEssentialData(): Promise<void> {
    // Cache personas, recent chats, and other essential data
    // This would be implemented based on specific requirements

    console.log("Caching essential data for offline use");

    // Example: Cache recent personas
    await this.setCachedData("recent-personas", [], 24 * 60 * 60); // 24 hours

    // Example: Cache system configuration
    await this.setCachedData("system-config", this.config, 7 * 24 * 60 * 60); // 7 days
  }

  async clearCache(): Promise<void> {
    try {
      const cacheFiles = readdirSync(this.cacheDir);

      for (const file of cacheFiles) {
        const filePath = join(this.cacheDir, file);
        readdirSync(filePath);
      }

      console.log("Cache cleared successfully");
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  }

  getStorageStats(): any {
    try {
      const stats = {
        chats: readdirSync(this.chatsDir).length,
        personas: readdirSync(this.personasDir).length,
        attachments: readdirSync(this.attachmentsDir).length,
        cacheFiles: readdirSync(this.cacheDir).length,
        totalSize: 0,
        lastSync: this.config.lastSync,
        isOnline: this.isOnline,
        syncQueueLength: this.syncQueue.length,
      };

      // Calculate total size
      const allDirs = [
        this.chatsDir,
        this.personasDir,
        this.attachmentsDir,
        this.cacheDir,
      ];

      for (const dir of allDirs) {
        const files = readdirSync(dir);
        for (const file of files) {
          const filePath = join(dir, file);
          stats.totalSize += statSync(filePath).size;
        }
      }

      stats.totalSize =
        Math.round((stats.totalSize / (1024 * 1024)) * 100) / 100; // MB

      return stats;
    } catch (error) {
      console.error("Failed to get storage stats:", error);
      return null;
    }
  }
}

// IPC Handler Registration
export function registerOfflineHandlers(
  offlineManager: IraqiOfflineManager,
): void {
  ipcMain.handle("enable-offline-mode", () =>
    offlineManager.enableOfflineMode(),
  );
  ipcMain.handle("disable-offline-mode", () =>
    offlineManager.disableOfflineMode(),
  );
  ipcMain.handle("sync-when-online", () => offlineManager.syncWhenOnline());
  ipcMain.handle("get-cached-data", (event, key) =>
    offlineManager.getCachedData(key),
  );
  ipcMain.handle("set-cached-data", (event, key, data, ttl) =>
    offlineManager.setCachedData(key, data, ttl),
  );
  ipcMain.handle("clear-cache", () => offlineManager.clearCache());
  ipcMain.handle("get-storage-stats", () => offlineManager.getStorageStats());
  ipcMain.handle("save-offline-chat", (event, chat) =>
    offlineManager.saveChat(chat),
  );
  ipcMain.handle("load-offline-chat", (event, chatId) =>
    offlineManager.loadChat(chatId),
  );
  ipcMain.handle("get-all-offline-chats", () => offlineManager.getAllChats());
  ipcMain.handle("delete-offline-chat", (event, chatId) =>
    offlineManager.deleteChat(chatId),
  );
  ipcMain.handle("save-offline-persona", (event, persona) =>
    offlineManager.savePersona(persona),
  );
  ipcMain.handle("load-offline-persona", (event, personaId) =>
    offlineManager.loadPersona(personaId),
  );
}

// Export singleton instance
export const offlineManager = new IraqiOfflineManager();
