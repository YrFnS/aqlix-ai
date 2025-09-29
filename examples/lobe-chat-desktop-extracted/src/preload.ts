/**
 * Iraqi AI Chat System - Preload Script
 * Enhanced for Iraqi Government and Enterprise Users
 *
 * Features:
 * - Secure IPC bridge for Iraqi government compliance
 * - Native OS integration APIs
 * - Offline functionality bridges
 * - Arabic text processing utilities
 * - Security event handling
 * - Professional domain context management
 */

import { contextBridge, ipcRenderer, shell } from "electron";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Security validation
const isValidOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    "file://",
    "http://localhost:3000",
    "https://iraqi-ai.gov.iq",
    "https://*.gov.iq",
  ];

  return allowedOrigins.some((allowed) => {
    if (allowed.includes("*")) {
      const pattern = allowed.replace("*", ".*");
      return new RegExp(pattern).test(origin);
    }
    return origin.startsWith(allowed);
  });
};

// Iraqi Desktop API Interface
export interface IraqiDesktopAPI {
  // Application Configuration
  config: {
    get(): Promise<any>;
    update(updates: any): Promise<any>;
    reset(): Promise<void>;
  };

  // File System Operations (Secure)
  fileSystem: {
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<boolean>;
    selectFile(filters?: any[]): Promise<string | null>;
    selectDirectory(): Promise<string | null>;
    exportData(data: any): Promise<{ success: boolean; path?: string }>;
  };

  // Offline Operations
  offline: {
    enableOfflineMode(): Promise<boolean>;
    disableOfflineMode(): Promise<boolean>;
    syncWhenOnline(): Promise<void>;
    getCachedData(key: string): Promise<any>;
    setCachedData(key: string, data: any): Promise<boolean>;
    clearCache(): Promise<void>;
  };

  // Arabic & RTL Support
  arabic: {
    detectLanguage(text: string): Promise<"ar" | "en" | "mixed">;
    formatRTL(text: string): Promise<string>;
    translateText(text: string, targetLang: "ar" | "en"): Promise<string>;
    validateArabicText(
      text: string,
    ): Promise<{ isValid: boolean; issues: string[] }>;
  };

  // Professional Domain Integration
  professional: {
    getCurrentDomain(): Promise<string>;
    switchDomain(domain: string): Promise<boolean>;
    getDomainConfig(domain: string): Promise<any>;
    validateDomainAccess(domain: string): Promise<boolean>;
  };

  // Government & Enterprise Features
  government: {
    isGovernmentMode(): Promise<boolean>;
    getSecurityLevel(): Promise<string>;
    generateSecurityReport(): Promise<any>;
    exportAuditLog(): Promise<any[]>;
    enableAuditLogging(): Promise<boolean>;
  };

  // Native OS Integration
  native: {
    showNotification(title: string, body: string, options?: any): Promise<void>;
    openExternal(url: string): Promise<void>;
    showInFolder(path: string): Promise<void>;
    copyToClipboard(text: string): Promise<void>;
    getFromClipboard(): Promise<string>;
    minimizeWindow(): Promise<void>;
    maximizeWindow(): Promise<void>;
    closeWindow(): Promise<void>;
  };

  // Event Listeners
  events: {
    on(channel: string, listener: (...args: any[]) => void): () => void;
    once(channel: string, listener: (...args: any[]) => void): () => void;
    removeListener(channel: string, listener: (...args: any[]) => void): void;
  };

  // Security & Compliance
  security: {
    validateCertificate(url: string): Promise<boolean>;
    encryptData(data: string): Promise<string>;
    decryptData(encryptedData: string): Promise<string>;
    logSecurityEvent(eventType: string, data: any): Promise<void>;
    checkIntegrity(): Promise<boolean>;
  };

  // System Information
  system: {
    getPlatform(): Promise<string>;
    getVersion(): Promise<string>;
    getSystemInfo(): Promise<any>;
    getNetworkStatus(): Promise<boolean>;
    getBatteryStatus(): Promise<any>;
  };
}

// Secure IPC wrapper with validation
class SecureIPC {
  private static validateChannel(channel: string): boolean {
    const allowedChannels = [
      "get-app-config",
      "update-app-config",
      "get-audit-logs",
      "export-data",
      "read-file",
      "write-file",
      "select-file",
      "select-directory",
      "show-notification",
      "open-external",
      "copy-clipboard",
      "get-clipboard",
      "validate-certificate",
      "encrypt-data",
      "decrypt-data",
      "log-security-event",
      "get-system-info",
      "get-network-status",
      "enable-offline-mode",
      "disable-offline-mode",
      "sync-when-online",
      "get-cached-data",
      "set-cached-data",
      "clear-cache",
      "detect-language",
      "format-rtl",
      "translate-text",
      "validate-arabic-text",
      "get-current-domain",
      "switch-domain",
      "get-domain-config",
      "validate-domain-access",
      "is-government-mode",
      "get-security-level",
      "generate-security-report",
      "export-audit-log",
      "enable-audit-logging",
      "check-integrity",
      "get-platform",
      "get-version",
      "get-battery-status",
    ];

    return allowedChannels.includes(channel);
  }

  static async invoke(channel: string, ...args: any[]): Promise<any> {
    if (!this.validateChannel(channel)) {
      throw new Error(`Invalid IPC channel: ${channel}`);
    }

    return ipcRenderer.invoke(channel, ...args);
  }

  static send(channel: string, ...args: any[]): void {
    if (!this.validateChannel(channel)) {
      throw new Error(`Invalid IPC channel: ${channel}`);
    }

    ipcRenderer.send(channel, ...args);
  }

  static on(channel: string, listener: (...args: any[]) => void): () => void {
    const wrappedListener = (event: any, ...args: any[]) => {
      // Validate origin if applicable
      if (event.senderFrame && !isValidOrigin(event.senderFrame.origin)) {
        console.warn(
          "Blocked IPC message from invalid origin:",
          event.senderFrame.origin,
        );
        return;
      }

      listener(...args);
    };

    ipcRenderer.on(channel, wrappedListener);

    // Return cleanup function
    return () => ipcRenderer.removeListener(channel, wrappedListener);
  }
}

// Iraqi Desktop API Implementation
const iraqiDesktopAPI: IraqiDesktopAPI = {
  // Application Configuration
  config: {
    async get() {
      return SecureIPC.invoke("get-app-config");
    },

    async update(updates: any) {
      return SecureIPC.invoke("update-app-config", updates);
    },

    async reset() {
      return SecureIPC.invoke("reset-app-config");
    },
  },

  // File System Operations
  fileSystem: {
    async readFile(path: string): Promise<string> {
      return SecureIPC.invoke("read-file", path);
    },

    async writeFile(path: string, data: string): Promise<boolean> {
      return SecureIPC.invoke("write-file", path, data);
    },

    async selectFile(filters: any[] = []): Promise<string | null> {
      return SecureIPC.invoke("select-file", filters);
    },

    async selectDirectory(): Promise<string | null> {
      return SecureIPC.invoke("select-directory");
    },

    async exportData(data: any): Promise<{ success: boolean; path?: string }> {
      return SecureIPC.invoke("export-data", data);
    },
  },

  // Offline Operations
  offline: {
    async enableOfflineMode(): Promise<boolean> {
      return SecureIPC.invoke("enable-offline-mode");
    },

    async disableOfflineMode(): Promise<boolean> {
      return SecureIPC.invoke("disable-offline-mode");
    },

    async syncWhenOnline(): Promise<void> {
      return SecureIPC.invoke("sync-when-online");
    },

    async getCachedData(key: string): Promise<any> {
      return SecureIPC.invoke("get-cached-data", key);
    },

    async setCachedData(key: string, data: any): Promise<boolean> {
      return SecureIPC.invoke("set-cached-data", key, data);
    },

    async clearCache(): Promise<void> {
      return SecureIPC.invoke("clear-cache");
    },
  },

  // Arabic & RTL Support
  arabic: {
    async detectLanguage(text: string): Promise<"ar" | "en" | "mixed"> {
      return SecureIPC.invoke("detect-language", text);
    },

    async formatRTL(text: string): Promise<string> {
      return SecureIPC.invoke("format-rtl", text);
    },

    async translateText(
      text: string,
      targetLang: "ar" | "en",
    ): Promise<string> {
      return SecureIPC.invoke("translate-text", text, targetLang);
    },

    async validateArabicText(
      text: string,
    ): Promise<{ isValid: boolean; issues: string[] }> {
      return SecureIPC.invoke("validate-arabic-text", text);
    },
  },

  // Professional Domain Integration
  professional: {
    async getCurrentDomain(): Promise<string> {
      return SecureIPC.invoke("get-current-domain");
    },

    async switchDomain(domain: string): Promise<boolean> {
      return SecureIPC.invoke("switch-domain", domain);
    },

    async getDomainConfig(domain: string): Promise<any> {
      return SecureIPC.invoke("get-domain-config", domain);
    },

    async validateDomainAccess(domain: string): Promise<boolean> {
      return SecureIPC.invoke("validate-domain-access", domain);
    },
  },

  // Government & Enterprise Features
  government: {
    async isGovernmentMode(): Promise<boolean> {
      return SecureIPC.invoke("is-government-mode");
    },

    async getSecurityLevel(): Promise<string> {
      return SecureIPC.invoke("get-security-level");
    },

    async generateSecurityReport(): Promise<any> {
      return SecureIPC.invoke("generate-security-report");
    },

    async exportAuditLog(): Promise<any[]> {
      return SecureIPC.invoke("export-audit-log");
    },

    async enableAuditLogging(): Promise<boolean> {
      return SecureIPC.invoke("enable-audit-logging");
    },
  },

  // Native OS Integration
  native: {
    async showNotification(
      title: string,
      body: string,
      options: any = {},
    ): Promise<void> {
      return SecureIPC.invoke("show-notification", { title, body, ...options });
    },

    async openExternal(url: string): Promise<void> {
      // Additional security check for external URLs
      const allowedDomains = [".gov.iq", ".iraq.gov", "iraqi-ai.gov.iq"];
      const isGovernmentMode = await this.parent.government.isGovernmentMode();

      if (isGovernmentMode) {
        const isAllowed = allowedDomains.some((domain) => url.includes(domain));
        if (!isAllowed) {
          throw new Error("External URL not allowed in government mode");
        }
      }

      return shell.openExternal(url);
    },

    async showInFolder(path: string): Promise<void> {
      return shell.showItemInFolder(path);
    },

    async copyToClipboard(text: string): Promise<void> {
      return SecureIPC.invoke("copy-clipboard", text);
    },

    async getFromClipboard(): Promise<string> {
      return SecureIPC.invoke("get-clipboard");
    },

    async minimizeWindow(): Promise<void> {
      return SecureIPC.invoke("minimize-window");
    },

    async maximizeWindow(): Promise<void> {
      return SecureIPC.invoke("maximize-window");
    },

    async closeWindow(): Promise<void> {
      return SecureIPC.invoke("close-window");
    },
  } as any,

  // Event Listeners
  events: {
    on(channel: string, listener: (...args: any[]) => void): () => void {
      return SecureIPC.on(channel, listener);
    },

    once(channel: string, listener: (...args: any[]) => void): () => void {
      const cleanup = SecureIPC.on(channel, (...args) => {
        cleanup();
        listener(...args);
      });
      return cleanup;
    },

    removeListener(channel: string, listener: (...args: any[]) => void): void {
      ipcRenderer.removeListener(channel, listener);
    },
  },

  // Security & Compliance
  security: {
    async validateCertificate(url: string): Promise<boolean> {
      return SecureIPC.invoke("validate-certificate", url);
    },

    async encryptData(data: string): Promise<string> {
      return SecureIPC.invoke("encrypt-data", data);
    },

    async decryptData(encryptedData: string): Promise<string> {
      return SecureIPC.invoke("decrypt-data", encryptedData);
    },

    async logSecurityEvent(eventType: string, data: any): Promise<void> {
      return SecureIPC.invoke("log-security-event", eventType, data);
    },

    async checkIntegrity(): Promise<boolean> {
      return SecureIPC.invoke("check-integrity");
    },
  },

  // System Information
  system: {
    async getPlatform(): Promise<string> {
      return SecureIPC.invoke("get-platform");
    },

    async getVersion(): Promise<string> {
      return SecureIPC.invoke("get-version");
    },

    async getSystemInfo(): Promise<any> {
      return SecureIPC.invoke("get-system-info");
    },

    async getNetworkStatus(): Promise<boolean> {
      return SecureIPC.invoke("get-network-status");
    },

    async getBatteryStatus(): Promise<any> {
      return SecureIPC.invoke("get-battery-status");
    },
  },
};

// Fix the circular reference
(iraqiDesktopAPI.native as any).parent = iraqiDesktopAPI;

// Iraqi-specific utility functions for renderer process
const iraqiUtils = {
  // Arabic text utilities
  isArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  },

  // RTL formatting
  formatForRTL(text: string): string {
    if (this.isArabic(text)) {
      return `\u202B${text}\u202C`; // Right-to-Left Embedding
    }
    return text;
  },

  // Iraqi dialect detection
  detectIraqiDialect(text: string): { isIraqi: boolean; region?: string } {
    const iraqiWords = {
      baghdad: ["شلونك", "وين", "شنو", "هسه"],
      basra: ["شلونكم", "ويش", "شنهو", "هسع"],
      mosul: ["كيفك", "وين", "شو", "هلا"],
    };

    for (const [region, words] of Object.entries(iraqiWords)) {
      if (words.some((word) => text.includes(word))) {
        return { isIraqi: true, region };
      }
    }

    return { isIraqi: false };
  },

  // Government domain validation
  isGovernmentDomain(url: string): boolean {
    const govDomains = [".gov.iq", ".iraq.gov", "iraqi-ai.gov.iq"];
    return govDomains.some((domain) => url.includes(domain));
  },

  // Professional domain helpers
  getDomainIcon(domain: string): string {
    const icons = {
      legal: "⚖️",
      medical: "👨‍⚕️",
      educational: "👨‍🏫",
      engineering: "👨‍🔧",
      business: "💼",
      government: "🏛️",
      religious: "🕌",
      cultural: "🎭",
      general: "💡",
    };
    return icons[domain as keyof typeof icons] || "💡";
  },

  // Security helpers
  sanitizeForLogging(data: any): any {
    // Remove sensitive information before logging
    const sensitiveKeys = ["password", "token", "key", "secret", "credential"];
    const sanitized = { ...data };

    for (const key in sanitized) {
      if (
        sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
      ) {
        sanitized[key] = "[REDACTED]";
      }
    }

    return sanitized;
  },
};

// Expose APIs to renderer process through context bridge
contextBridge.exposeInMainWorld("iraqiDesktop", iraqiDesktopAPI);
contextBridge.exposeInMainWorld("iraqiUtils", iraqiUtils);

// Enhanced error handling
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception in preload:", error);
  iraqiDesktopAPI.security.logSecurityEvent("uncaught-exception", {
    message: error.message,
    stack: error.stack,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection in preload:", reason);
  iraqiDesktopAPI.security.logSecurityEvent("unhandled-rejection", {
    reason: String(reason),
    promise: String(promise),
  });
});

// Initialize security monitoring
iraqiDesktopAPI.security.logSecurityEvent("preload-initialized", {
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
});

// Export types for TypeScript support
export type { IraqiDesktopAPI };
