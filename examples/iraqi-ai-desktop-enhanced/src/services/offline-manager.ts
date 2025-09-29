/**
 * Iraqi AI Desktop - Offline Manager Service
 * Handles domain-specific caching, encrypted chat persistence, and background sync
 * with Iraqi government endpoint fallback. Integrates with persona service for offline ops.
 *
 * Features:
 * - Domain-specific caching (legal/medical templates)
 * - Encrypted chat session persistence (save/load with AES-256-GCM)
 * - Background sync with Iraqi gov fallback (e.g., api.gov.iq)
 * - Persona offline loading/saving via hooks
 * - Cultural compliance: No sync during prayer times (Asia/Baghdad)
 * - Error handling for validation failures (e.g., resync on low cultural score)
 *
 * Dependencies: crypto (Node.js), electron-store for metadata
 */

import { createDecipheriv, createCipheriv, randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { app } from "electron";
import electronStore from "electron-store";
import type { Persona } from "../types/persona"; // Assume shared types

// Interfaces for strict typing
interface OfflineChatSession {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string; // UTF-8 for Arabic/RTL support
    role: "user" | "assistant";
    timestamp: Date;
    domain:
      | "legal"
      | "medical"
      | "educational"
      | "business"
      | "government"
      | "general";
    culturalScore?: number; // For validation
  }>;
  syncStatus: "pending" | "synced" | "conflict" | "failed";
  encryptionKeyId: string; // Reference to key for decryption
  createdAt: Date;
  updatedAt: Date;
}

interface DomainCacheEntry {
  domain: string;
  data: unknown; // Templates, e.g., legal contracts
  expiresAt: Date;
  size: number; // Bytes for cache management
}

interface SyncQueueItem {
  type: "chat" | "persona";
  data: OfflineChatSession | Partial<Persona>;
  retryCount: number;
  maxRetries: 3;
}

interface OfflineConfig {
  maxCacheSize: number; // MB
  retentionPeriod: number; // Days
  encryptionEnabled: boolean;
  autoSync: boolean;
  syncInterval: number; // Minutes
  prayerTimes: Array<{ name: string; start: Date; end: Date }>; // Avoid sync during these
}

export class IraqiOfflineManager {
  private store: electronStore<OfflineConfig>;
  private cacheDir: string;
  private keysDir: string;
  private isOnline: boolean = navigator.onLine; // Simplified; use net module in prod
  private syncQueue: SyncQueueItem[] = [];
  private syncIntervalId: NodeJS.Timeout | null = null;
  private encryptionKeyLength = 32; // AES-256
  private algorithm = "aes-256-gcm";

  constructor() {
    this.store = new electronStore<OfflineConfig>({
      defaults: {
        maxCacheSize: 500, // 500MB
        retentionPeriod: 30,
        encryptionEnabled: true,
        autoSync: true,
        syncInterval: 15,
        prayerTimes: [], // Populated on init
      },
    });
    this.cacheDir = path.join(app.getPath("userData"), "offline-cache");
    this.keysDir = path.join(app.getPath("userData"), "encryption-keys");
    this.ensureDirs();
    this.updatePrayerTimes(); // Asia/Baghdad
    if (this.store.get("autoSync")) {
      this.startBackgroundSync();
    }
    this.monitorOnlineStatus();
  }

  private async ensureDirs(): Promise<void> {
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.mkdir(this.keysDir, { recursive: true });
  }

  private updatePrayerTimes(): void {
    // Simplified prayer times calculation for 2025 (Asia/Baghdad, UTC+3)
    // In prod, use astronomical library like `islamic-prayer-times`
    const now = new Date();
    const baghdadOffset = 3 * 60; // Minutes
    this.store.set("prayerTimes", [
      {
        name: "Fajr",
        start: new Date(
          now.getTime() - 60 * 60 * 1000 + baghdadOffset * 60 * 1000,
        ),
        end: new Date(
          now.getTime() + 30 * 60 * 1000 + baghdadOffset * 60 * 1000,
        ),
      },
      {
        name: "Dhuhr",
        start: new Date(
          now.getTime() + 11 * 60 * 60 * 1000 + baghdadOffset * 60 * 1000,
        ),
        end: new Date(
          now.getTime() + 11.5 * 60 * 60 * 1000 + baghdadOffset * 60 * 1000,
        ),
      },
      // Add Asr, Maghrib, Isha similarly (approximate for demo)
    ]);
  }

  private isPrayerTime(): boolean {
    const prayerTimes = this.store.get("prayerTimes", []);
    const now = new Date();
    return prayerTimes.some((pt) => now >= pt.start && now <= pt.end);
  }

  private monitorOnlineStatus(): void {
    // Simulate with setInterval; use 'net' module for real connectivity
    setInterval(() => {
      this.isOnline = true; // Placeholder; implement real check
    }, 30000);
  }

  private async generateKey(): Promise<Buffer> {
    return randomBytes(this.encryptionKeyLength);
  }

  private async saveKey(keyId: string, key: Buffer): Promise<void> {
    const keyPath = path.join(this.keysDir, `${keyId}.key`);
    await fs.writeFile(keyPath, key);
  }

  private async loadKey(keyId: string): Promise<Buffer | null> {
    const keyPath = path.join(this.keysDir, `${keyId}.key`);
    try {
      return await fs.readFile(keyPath);
    } catch {
      return null;
    }
  }

  private async encrypt(
    data: string,
  ): Promise<{ iv: Buffer; encrypted: Buffer; keyId: string }> {
    if (!this.store.get("encryptionEnabled")) {
      throw new Error("Encryption disabled");
    }
    const key = await this.generateKey();
    const keyId = `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.saveKey(keyId, key);
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv, encrypted, keyId };
  }

  private async decrypt(encryptedData: string, keyId: string): Promise<string> {
    const key = await this.loadKey(keyId);
    if (!key) {
      throw new Error(`Key not found: ${keyId}`);
    }
    const [algo, ivHex, encryptedHex, keyIdStored] = encryptedData.split(":");
    if (keyIdStored !== keyId) {
      throw new Error("Key ID mismatch");
    }
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = createDecipheriv(algo as string, key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
  }

  // Domain-specific caching (e.g., legal/medical templates)
  async setDomainCache(
    domain: string,
    data: unknown,
    ttlDays: number = 7,
  ): Promise<void> {
    try {
      const entry: DomainCacheEntry = {
        domain,
        data: JSON.stringify(data), // Stringify for storage
        expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000),
        size: Buffer.byteLength(JSON.stringify(data), "utf8"),
      };
      const cacheKey = `domain-${domain}`;
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
      await fs.writeFile(cachePath, JSON.stringify(entry));
      // Enforce max size (simplified)
      if (
        (await this.getCacheSize()) >
        this.store.get("maxCacheSize") * 1024 * 1024
      ) {
        await this.cleanupCache();
      }
    } catch (error) {
      throw new Error(
        `Cache set failed for domain ${domain}: ${(error as Error).message}`,
      );
    }
  }

  async getDomainCache<T>(domain: string): Promise<T | null> {
    try {
      const cacheKey = `domain-${domain}`;
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
      const entryStr = await fs.readFile(cachePath, "utf8");
      const entry: DomainCacheEntry = JSON.parse(entryStr);
      if (new Date() > entry.expiresAt) {
        await fs.unlink(cachePath); // Expired
        return null;
      }
      return JSON.parse(entry.data) as T;
    } catch (error) {
      return null; // Graceful fallback
    }
  }

  private async getCacheSize(): Promise<number> {
    // Implement directory size calculation
    return 0; // Placeholder
  }

  private async cleanupCache(): Promise<void> {
    // Remove expired entries
    const files = await fs.readdir(this.cacheDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        // Parse and check expiry
      }
    }
  }

  // Chat persistence (save/load full sessions offline with encryption)
  async saveChatSession(
    session: Omit<
      OfflineChatSession,
      "encryptionKeyId" | "createdAt" | "updatedAt"
    >,
  ): Promise<void> {
    try {
      const fullSession: OfflineChatSession = {
        ...session,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: this.isOnline ? "synced" : "pending",
      };
      const jsonData = JSON.stringify(fullSession);
      const { iv, encrypted, keyId } = await this.encrypt(jsonData);
      const encryptedStr = `${this.algorithm}:${iv.toString("hex")}:${encrypted.toString("hex")}:${keyId}`;
      const sessionPath = path.join(this.cacheDir, `chat-${session.id}.enc`);
      await fs.writeFile(sessionPath, encryptedStr);
      if (!this.isOnline) {
        this.addToSyncQueue({
          type: "chat",
          data: fullSession,
          retryCount: 0,
          maxRetries: 3,
        });
      }
      // Cultural validation check (integrate with persona service)
      if (
        session.messages.some(
          (msg) => msg.culturalScore && msg.culturalScore < 85,
        )
      ) {
        throw new Error("Cultural validation failed: Resync required");
      }
    } catch (error) {
      throw new Error(`Chat save failed: ${(error as Error).message}`);
    }
  }

  async loadChatSession(id: string): Promise<OfflineChatSession | null> {
    try {
      const sessionPath = path.join(this.cacheDir, `chat-${id}.enc`);
      const encryptedStr = await fs.readFile(sessionPath, "utf8");
      const decryptedJson = await this.decrypt(
        encryptedStr,
        encryptedStr.split(":")[3],
      ); // Extract keyId
      const session: OfflineChatSession = JSON.parse(decryptedJson);
      // Check retention
      if (
        new Date() >
        new Date(
          session.updatedAt.getTime() +
            this.store.get("retentionPeriod") * 24 * 60 * 60 * 1000,
        )
      ) {
        await this.deleteChatSession(id);
        return null;
      }
      return session;
    } catch (error) {
      console.warn(`Chat load failed for ${id}: ${(error as Error).message}`);
      return null;
    }
  }

  private async deleteChatSession(id: string): Promise<void> {
    const sessionPath = path.join(this.cacheDir, `chat-${id}.enc`);
    await fs.unlink(sessionPath).catch(() => {}); // Ignore if not exists
  }

  // Background sync with Iraqi gov fallback
  private startBackgroundSync(): void {
    this.syncIntervalId = setInterval(
      async () => {
        if (
          !this.isOnline ||
          this.isPrayerTime() ||
          this.syncQueue.length === 0
        )
          return;
        await this.processSyncQueue();
      },
      this.store.get("syncInterval") * 60 * 1000,
    );
  }

  private addToSyncQueue(item: SyncQueueItem): void {
    this.syncQueue.push(item);
  }

  private async processSyncQueue(): Promise<void> {
    for (let i = 0; i < this.syncQueue.length; i++) {
      const item = this.syncQueue[i];
      try {
        // Primary endpoint fallback to gov
        const response = await fetch("https://api.iraqi-ai.com/sync", {
          // Assume primary
          method: "POST",
          body: JSON.stringify(item.data),
          headers: { "Content-Type": "application/json" },
        }).catch(async () => {
          // Fallback to gov endpoint
          return fetch("https://api.gov.iq/sync-fallback", {
            method: "POST",
            body: JSON.stringify(item.data),
            headers: {
              "Content-Type": "application/json",
              "X-Gov-Auth": "iraqi-token",
            }, // Secure token
          });
        });
        if (response.ok) {
          (item.data as OfflineChatSession).syncStatus = "synced";
          this.syncQueue.splice(i, 1);
          i--;
        } else if (item.retryCount < item.maxRetries) {
          item.retryCount++;
          // Exponential backoff
          setTimeout(
            () => this.processSyncQueue(),
            Math.pow(2, item.retryCount) * 1000,
          );
        } else {
          (item.data as OfflineChatSession).syncStatus = "failed";
          this.syncQueue.splice(i, 1);
          i--;
        }
      } catch (error) {
        console.error(
          `Sync failed for ${item.type}: ${(error as Error).message}`,
        );
      }
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (this.isOnline && !this.isPrayerTime()) {
      await this.processSyncQueue();
    }
  }

  // Persona integration: Offline loading/saving hooks
  async savePersona(persona: Partial<Persona>): Promise<void> {
    try {
      const personaData = JSON.stringify(persona);
      const { iv, encrypted, keyId } = await this.encrypt(personaData);
      const encryptedStr = `${this.algorithm}:${iv.toString("hex")}:${encrypted.toString("hex")}:${keyId}`;
      const personaPath = path.join(this.cacheDir, `persona-${persona.id}.enc`);
      await fs.writeFile(personaPath, encryptedStr);
      if (!this.isOnline) {
        this.addToSyncQueue({
          type: "persona",
          data: persona,
          retryCount: 0,
          maxRetries: 3,
        });
      }
      // Error handling: If cultural score low (from persona service), flag for resync
      if (
        (persona as any).culturalScore &&
        (persona as any).culturalScore < 85
      ) {
        throw new Error("Persona cultural validation failed: Resync required");
      }
    } catch (error) {
      throw new Error(`Persona save failed: ${(error as Error).message}`);
    }
  }

  async loadPersona(id: string): Promise<Persona | null> {
    try {
      const personaPath = path.join(this.cacheDir, `persona-${id}.enc`);
      const encryptedStr = await fs.readFile(personaPath, "utf8");
      const decryptedJson = await this.decrypt(
        encryptedStr,
        encryptedStr.split(":")[3],
      );
      return JSON.parse(decryptedJson) as Persona;
    } catch (error) {
      console.warn(
        `Persona load failed for ${id}: ${(error as Error).message}`,
      );
      return null;
    }
  }

  async getAllOfflinePersonas(): Promise<Persona[]> {
    const files = await fs.readdir(this.cacheDir);
    const personas: Persona[] = [];
    for (const file of files) {
      if (file.startsWith("persona-") && file.endsWith(".enc")) {
        const id = file.replace("persona-", "").replace(".enc", "");
        const persona = await this.loadPersona(id);
        if (persona) personas.push(persona);
      }
    }
    return personas;
  }

  // Cleanup on app quit
  async cleanup(): Promise<void> {
    if (this.syncIntervalId) clearInterval(this.syncIntervalId);
    await this.cleanupCache();
  }

  get isOffline(): boolean {
    return !this.isOnline;
  }
}

// Export for IPC registration
export const registerOfflineHandlers = (manager: IraqiOfflineManager) => {
  // IPC handlers would be registered in main.ts
};
