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
 * - Persona management IPC for IraqiPersonaManagementService integration
 * - Notification APIs with Arabic support and prayer time scheduling
 */

import { contextBridge, ipcRenderer, shell } from "electron";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  Persona,
  PersonaTraits,
  CulturalValidationResult,
} from "./types/persona"; // Shared types

// Security validation (unchanged)
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

// Iraqi Desktop API Interface (updated with notifications)
export interface IraqiDesktopAPI {
  // Existing sections unchanged: config, fileSystem, offline, arabic, professional, government, native, events, security, system, personas

  // New: Notifications (with Arabic/RTL support, urgency, prayer time awareness)
  notifications: {
    showGovernmentNotification(
      title: string,
      body: string,
      urgency?: "normal" | "high",
    ): Promise<void>;
    schedulePrayerTimeNotification(
      title: string,
      body: string,
      prayerTime: Date,
    ): Promise<void>;
  };
}

// Secure IPC wrapper (updated to validate notification channels)
class SecureIPC {
  private static validateChannel(channel: string): boolean {
    const allowedChannels = [
      // Existing channels unchanged
      "create-persona",
      "load-persona",
      "load-all-personas",
      "evaluate-traits",
      "apply-memory",
      "generate-domain-response",
      // New notifications
      "show-government-notification",
      "schedule-prayer-time-notification",
    ];

    return allowedChannels.includes(channel);
  }

  static async invoke(channel: string, ...args: unknown[]): Promise<unknown> {
    if (!this.validateChannel(channel)) {
      throw new Error(`Invalid IPC channel: ${channel}`);
    }

    return ipcRenderer.invoke(channel, ...args);
  }

  static send(channel: string, ...args: unknown[]): void {
    if (!this.validateChannel(channel)) {
      throw new Error(`Invalid IPC channel: ${channel}`);
    }

    ipcRenderer.send(channel, ...args);
  }

  static on(
    channel: string,
    listener: (...args: unknown[]) => void,
  ): () => void {
    const wrappedListener = (
      event: Electron.IpcRendererEvent,
      ...args: unknown[]
    ) => {
      if (event.senderFrame && !isValidOrigin(event.senderFrame.url)) {
        console.warn(
          "Blocked IPC message from invalid origin:",
          event.senderFrame.url,
        );
        return;
      }

      listener(...args);
    };

    ipcRenderer.on(channel, wrappedListener);

    return () => ipcRenderer.removeListener(channel, wrappedListener);
  }
}

// Iraqi Desktop API Implementation (updated with notifications)
const iraqiDesktopAPI: IraqiDesktopAPI = {
  // Existing sections unchanged

  // Existing: Personas (unchanged)

  // New: Notifications
  notifications: {
    async showGovernmentNotification(
      title: string,
      body: string,
      urgency: "normal" | "high" = "normal",
    ): Promise<void> {
      return SecureIPC.invoke(
        "show-government-notification",
        title,
        body,
        urgency,
      ) as Promise<void>;
    },

    async schedulePrayerTimeNotification(
      title: string,
      body: string,
      prayerTime: Date,
    ): Promise<void> {
      return SecureIPC.invoke(
        "schedule-prayer-time-notification",
        title,
        body,
        prayerTime,
      ) as Promise<void>;
    },
  },
};

(iraqiDesktopAPI.native as any).parent = iraqiDesktopAPI;

// Iraqi-specific utility functions (unchanged)
const iraqiUtils = {
  // Unchanged
};

// Expose APIs (unchanged)
contextBridge.exposeInMainWorld("iraqiDesktop", iraqiDesktopAPI);
contextBridge.exposeInMainWorld("iraqiUtils", iraqiUtils);

// Enhanced error handling (updated for notifications)
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception in preload:", error);
  iraqiDesktopAPI.security.logSecurityEvent("uncaught-exception", {
    message: error.message,
    stack: error.stack,
  });
});

process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection in preload:", reason);
    iraqiDesktopAPI.security.logSecurityEvent("unhandled-rejection", {
      reason: String(reason),
      promise: String(promise),
    });
  },
);

// Listen for cultural validation events from main (unchanged)
SecureIPC.on(
  "cultural-validation-failed",
  (data: { score: number; message: string }) => {
    console.warn("Cultural validation failed:", data);
  },
);

// Initialize security monitoring (unchanged)
iraqiDesktopAPI.security.logSecurityEvent("preload-initialized", {
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
});

// Export types for TypeScript support
export type { IraqiDesktopAPI };
