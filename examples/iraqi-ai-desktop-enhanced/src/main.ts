/**
 * Iraqi AI Chat System - Desktop Application Main Process
 * Enhanced for Iraqi Government and Enterprise Users
 * 
 * Features:
 * - Electron application structure with Iraqi security compliance
 * - Native OS integration for Iraqi government systems
 * - Offline functionality for remote Iraqi locations
 * - Arabic-first desktop interface with RTL support
 * - Enhanced security for sensitive government communications
 * - Professional domain workspace management
 * - Integrated IraqiPersonaManagementService for cultural-aware persona handling
 * - Native notifications with Arabic support, urgency levels, and prayer time awareness
 * - Persona integration: Offline loading/saving, notifications on validation failures
 */

import { app, BrowserWindow, Menu, shell, ipcMain, dialog, protocol, Notification } from 'electron';
import { join } from 'path';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { autoUpdater } from 'electron-updater';
import electronStore from 'electron-store';
import contextMenu from 'electron-context-menu';
import { IraqiOfflineManager, registerOfflineHandlers } from './services/offline-manager'; // Updated import
import { IraqiPersonaManagementService } from '../iraqi-persona-management.service.ts'; // Service import (assumed shared)
import type { Persona, PersonaTraits, CulturalValidationResult } from './types/persona'; // Shared types

// Iraqi AI System Configuration (unchanged)
interface IraqiDesktopConfig {
  // Security Settings
  enableGovernmentMode: boolean;
  encryptionLevel: 'standard' | 'government' | 'enterprise';
  offlineMode: boolean;
  
  // Localization
  defaultLanguage: 'ar' | 'en' | 'ku';
  textDirection: 'rtl' | 'ltr';
  arabicFontFamily: string;
  
  // Professional Domain Settings
  allowedDomains: string[];
  governmentCompliance: boolean;
  auditLogging: boolean;
  
  // Network & Connectivity
  proxySettings?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
  };
  
  // Window Configuration
  windowBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // Iraqi Specific
  ministryAffiliation?: string;
  governorateLocation?: string;
  securityClearanceLevel?: 'public' | 'restricted' | 'confidential' | 'secret';
}

// Configuration Store (unchanged)
const store = new electronStore<IraqiDesktopConfig>({
  defaults: {
    enableGovernmentMode: false,
    encryptionLevel: 'standard',
    offlineMode: false,
    defaultLanguage: 'ar',
    textDirection: 'rtl',
    arabicFontFamily: 'Noto Sans Arabic',
    allowedDomains: ['legal', 'medical', 'educational', 'business', 'government', 'general'],
    governmentCompliance: false,
    auditLogging: false,
    windowBounds: {
      x: 100,
      y: 100,
      width: 1200,
      height: 800
    }
  }
});

// Global References (unchanged)
let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;
let isQuitting = false;

// Security Configuration for Iraqi Government Use (unchanged)
const SECURITY_CONFIG = {
  government: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    allowRunningInsecureContent: false,
    experimentalFeatures: false,
    webSecurity: true,
    additionalArguments: [
      '--disable-dev-shm-usage',
      '--disable-gpu-process-crash-reporting',
      '--disable-renderer-backgrounding',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-features=TranslateUI,VizDisplayCompositor'
    ]
  },
  enterprise: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    allowRunningInsecureContent: false,
    webSecurity: true
  },
  standard: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false
  }
};

// Application Lifecycle Management
class IraqiAIDesktopApp {
  private config: IraqiDesktopConfig;
  private auditLogger: AuditLogger;
  private personaService: IraqiPersonaManagementService;
  private offlineManager: IraqiOfflineManager;
  
  constructor() {
    this.config = store.store;
    this.auditLogger = new AuditLogger();
    this.personaService = new IraqiPersonaManagementService();
    this.offlineManager = new IraqiOfflineManager();
    
    this.initializeApp();
    this.setupSecurityProtocols();
    this.registerEventHandlers();
    registerOfflineHandlers(this.offlineManager);
    this.registerPersonaIPC();
    this.registerNotificationIPC(); // New: Notification handlers
  }

  // Existing methods unchanged: initializeApp, setupSecurityProtocols, enableGovernmentSecurity, registerEventHandlers, createSplashWindow, createMainWindow, hideSplashWindow, setupApplicationMenu, setupContextMenu, generateSplashHTML, checkForUpdates, generateSecurityReport, showAuditLog, showAboutDialog

  // Updated: Register IPC handlers for persona operations (with offline integration)
  private registerPersonaIPC(): void {
    const handleValidationFailure = (event: Electron.IpcMainInvokeEvent, result: CulturalValidationResult, personaData: Partial<Persona>) => {
      if (result.score < 85) {
        this.auditLogger.logSecurityEvent('cultural-validation-failed', { score: result.score, personaId: personaData.id });
        mainWindow?.webContents.send('cultural-validation-failed', { score: result.score, message: 'Resend required for cultural compliance' });
        // New: Trigger notification on failure
        this.showGovernmentNotification(
          'تحقق ثقافي فشل', // Cultural validation failed
          `درجة التحقق: ${result.score}%. يرجى إعادة الإرسال للامتثال الثقافي.`, // Score: X%. Please resend for cultural compliance.
          'high' // High urgency for gov alerts
        );
        // Offline: Queue for resync
        this.offlineManager.addToSyncQueue({ type: 'persona', data: personaData as any, retryCount: 0, maxRetries: 3 });
        throw new Error(`Cultural validation failed (score: ${result.score}%). Resend required.`);
      }
      return result;
    };

    ipcMain.handle('create-persona', async (event, personaData: Omit<Persona, 'id'>): Promise<Persona> => {
      try {
        const persona = await this.personaService.createPersona(personaData);
        const traits = await this.personaService.evaluateTraits(persona.id, personaData.traits || []);
        const validation = await this.personaService.evaluateTraits(persona.id, traits);
        handleValidationFailure(event, { score: validation.culturalScore, issues: [] }, persona);

        // Offline save via manager
        await this.offlineManager.savePersona({ ...persona, syncStatus: this.offlineManager.isOffline ? 'pending' : 'synced' } as any);

        this.auditLogger.logEvent('persona-created', { id: persona.id });
        return persona;
      } catch (error) {
        this.auditLogger.logEvent('persona-creation-failed', { error: (error as Error).message });
        throw error;
      }
    });

    ipcMain.handle('load-persona', async (event, id: string): Promise<Persona | null> => {
      try {
        let persona = await this.personaService.loadPersona(id);
        if (!persona && this.offlineManager.isOffline) {
          persona = await this.offlineManager.loadPersona(id); // Offline fallback
        }
        if (persona) {
          const memory = await this.personaService.applyMemory(persona.id, { /* context */ });
          persona.memoryContext = memory;
        }
        return persona;
      } catch (error) {
        this.auditLogger.logEvent('persona-load-failed', { id, error: (error as Error).message });
        return null;
      }
    });

    // Other handlers unchanged: evaluateTraits, applyMemory, generateDomainResponse, loadAllPersonas (with offline merge)
    ipcMain.handle('evaluate-traits', async (event, id: string, traits: PersonaTraits[]): Promise<CulturalValidationResult> => {
      try {
        const result = await this.personaService.evaluateTraits(id, traits);
        handleValidationFailure(event, result, { id });
        return result;
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('apply-memory', async (event, id: string, context: unknown): Promise<unknown> => {
      return this.personaService.applyMemory(id, context);
    });

    ipcMain.handle('generate-domain-response', async (event, id: string, prompt: string, domain: string): Promise<string> => {
      try {
        const response = await this.personaService.generateDomainResponse(id, prompt, domain);
        if (this.offlineManager.isOffline) {
          await this.offlineManager.setDomainCache(domain, { prompt, response }, 1); // Cache for 1 day
        }
        return response;
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('load-all-personas', async (): Promise<Persona[]> => {
      try {
        let personas = await this.personaService.loadAllPersonas();
        if (this.offlineManager.isOnline) {
          const offlinePersonas = await this.offlineManager.getAllOfflinePersonas();
          await this.offlineManager.syncWhenOnline();
          personas = [...personas, ...offlinePersonas.filter(p => !personas.some(existing => existing.id === p.id))];
        } else {
          personas = await this.offlineManager.getAllOfflinePersonas();
        }
        return personas;
      } catch (error) {
        this.auditLogger.logEvent('load-all-personas-failed', { error: (error as Error).message });
        return [];
      }
    });
  }

  // New: Register IPC for notifications
  private registerNotificationIPC(): void {
    ipcMain.handle('show-government-notification', async (event, title: string, body: string, urgency: 'normal' | 'high' = 'normal'): Promise<void> => {
      this.showGovernmentNotification(title, body, urgency);
    });

    ipcMain.handle('schedule-prayer-time-notification', async (event, title: string, body: string, prayerTime: Date): Promise<void> => {
      // Schedule for prayer time (Asia/Baghdad)
      const now = new Date();
      const delay = prayerTime.getTime() - now.getTime();
      if (delay > 0) {
        setTimeout(() => {
          this.showGovernmentNotification(title, body, 'normal');
        }, delay);
      }
    });
  }

  // New: Native notification with Arabic support and cultural checks
  private showGovernmentNotification(title: string, body: string, urgency: 'normal' | 'high'): void {
    if (this.isPrayerTime()) {
      console.log('Notification suppressed during prayer time for cultural compliance.');
      return; // No intrusive alerts during prayer
    }

    const notification = new Notification({
      title: title, // Arabic title
      body: body, // Arabic body
      icon: path.join(__dirname, 'assets', 'notification-icon.png'), // Assume icon exists
      urgency: urgency === 'high' ? 'critical' : 'normal', // Electron urgency
      silent: urgency === 'normal', // Sound for high urgency gov alerts
    });

    notification.show();
    this.auditLogger.logEvent('notification-shown', { title, urgency, timestamp: new Date().toISOString() });

    // WCAG AA: Ensure accessible (Electron handles basic, app renderer enhances)
    if (mainWindow) {
      mainWindow.webContents.send('notification-displayed', { title, body, urgency });
    }
  }

  private isPrayerTime(): boolean {
    // Reuse from offline manager logic (Asia/Baghdad)
    const prayerTimes = this.offlineManager['prayerTimes'] || []; // Private access or expose
    const now = new Date();
    return prayerTimes.some(pt => now >= pt.start && now <= pt.end);
  }

  // Rest of class methods unchanged...
  private initializeApp(): void { /* unchanged */ }
  private setupSecurityProtocols(): void { /* unchanged */ }
  private enableGovernmentSecurity(): void { /* unchanged */ }
  private registerEventHandlers(): void { /* unchanged */ }
  private createSplashWindow(): void { /* unchanged */ }
  private createMainWindow(): void { /* unchanged */ }
  private hideSplashWindow(): void { /* unchanged */ }
  private setupApplicationMenu(): void { /* unchanged */ }
  private setupContextMenu(): void { /* unchanged */ }
  private generateSplashHTML(): string { /* unchanged */ }
  private checkForUpdates(): void { /* unchanged */ }
  private generateSecurityReport(): void { /* unchanged */ }
  private showAuditLog(): void { /* unchanged */ }
  private showAboutDialog(): void { /* unchanged */ }
}

// Audit Logging System (unchanged)
class AuditLogger {
  // Implementation unchanged...
}

// Existing IPC Handlers (unchanged)
ipcMain.handle('get-app-config', () => store.store);
ipcMain.handle('update-app-config', (event, updates: Partial<IraqiDesktopConfig>) => {
  store.set(updates);
  return store.store;
});
ipcMain.handle('get-audit-logs', async () => {
  const auditLogger = new AuditLogger();
  try {
    const logData = readFileSync(auditLogger['logFile'], 'utf-8');
    return logData.split('\\n').filter(line => line.trim()).map(line => JSON.parse(line));
  } catch (error) {
    return [];
  }
});
ipcMain.handle('export-data', async (event, data: Record<string, unknown>) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: 'iraqi-ai-export.json',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePath) {
    writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { success: true, path: result.filePath };
  }
  
  return { success: false };
});

// App quit cleanup
app.on('before-quit', async (event) => {
  if (!isQuitting) {
    event.preventDefault();
    const appInstance = new IraqiAIDesktopApp(); // Access manager
    await appInstance.offlineManager.cleanup();
    isQuitting = true;
    app.quit();
  }
});

// Initialize Application
const iraqiAIApp = new IraqiAIDesktopApp();

export default IraqiAIDesktopApp;
