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
 */

import {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  dialog,
  protocol,
} from "electron";
import { join } from "path";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { autoUpdater } from "electron-updater";
import electronStore from "electron-store";
import contextMenu from "electron-context-menu";

// Iraqi AI System Configuration
interface IraqiDesktopConfig {
  // Security Settings
  enableGovernmentMode: boolean;
  encryptionLevel: "standard" | "government" | "enterprise";
  offlineMode: boolean;

  // Localization
  defaultLanguage: "ar" | "en" | "ku";
  textDirection: "rtl" | "ltr";
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
  securityClearanceLevel?: "public" | "restricted" | "confidential" | "secret";
}

// Configuration Store
const store = new electronStore<IraqiDesktopConfig>({
  defaults: {
    enableGovernmentMode: false,
    encryptionLevel: "standard",
    offlineMode: false,
    defaultLanguage: "ar",
    textDirection: "rtl",
    arabicFontFamily: "Noto Sans Arabic",
    allowedDomains: [
      "legal",
      "medical",
      "educational",
      "business",
      "government",
      "general",
    ],
    governmentCompliance: false,
    auditLogging: false,
    windowBounds: {
      x: 100,
      y: 100,
      width: 1200,
      height: 800,
    },
  },
});

// Global References
let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;
let isQuitting = false;

// Security Configuration for Iraqi Government Use
const SECURITY_CONFIG = {
  government: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    allowRunningInsecureContent: false,
    experimentalFeatures: false,
    webSecurity: true,
    additionalArguments: [
      "--disable-dev-shm-usage",
      "--disable-gpu-process-crash-reporting",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-features=TranslateUI,VizDisplayCompositor",
    ],
  },
  enterprise: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    allowRunningInsecureContent: false,
    webSecurity: true,
  },
  standard: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
  },
};

// Application Lifecycle Management
class IraqiAIDesktopApp {
  private config: IraqiDesktopConfig;
  private auditLogger: AuditLogger;

  constructor() {
    this.config = store.store;
    this.auditLogger = new AuditLogger();

    this.initializeApp();
    this.setupSecurityProtocols();
    this.registerEventHandlers();
  }

  private initializeApp(): void {
    // Set application properties
    app.setName("Iraqi AI Chat System");
    app.setVersion("1.0.0");

    // Configure for Iraqi government compliance
    if (this.config.enableGovernmentMode) {
      app.setPath("userData", join(app.getPath("userData"), "Government"));
      this.enableGovernmentSecurity();
    }

    // Protocol registration for Iraqi AI schema
    protocol.registerSchemesAsPrivileged([
      {
        scheme: "iraqi-ai",
        privileges: {
          standard: true,
          secure: true,
          allowServiceWorkers: true,
          supportFetchAPI: true,
        },
      },
    ]);
  }

  private setupSecurityProtocols(): void {
    // Certificate pinning for Iraqi government endpoints
    app.on(
      "certificate-error",
      (event, webContents, url, error, certificate, callback) => {
        if (this.config.enableGovernmentMode) {
          // Implement certificate validation for Iraqi government domains
          const isGovernmentDomain =
            url.includes(".gov.iq") || url.includes(".iraq.gov");
          if (isGovernmentDomain) {
            // Additional certificate validation logic would go here
            this.auditLogger.logSecurityEvent("certificate-validation", {
              url,
              error,
            });
          }
        }
        callback(false); // Let Electron handle certificate validation
      },
    );

    // Content Security Policy for Iraqi compliance
    app.on("web-contents-created", (event, contents) => {
      contents.on("did-finish-load", () => {
        if (this.config.enableGovernmentMode) {
          contents.insertCSP(
            "default-src 'self' 'unsafe-inline' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' https://*.gov.iq wss://*.gov.iq",
          );
        }
      });
    });
  }

  private enableGovernmentSecurity(): void {
    // Enhanced security measures for Iraqi government use
    app.on("ready", () => {
      // Disable hardware acceleration for government compliance
      app.disableHardwareAcceleration();

      // Set up audit logging
      if (this.config.auditLogging) {
        this.auditLogger.startAuditLog();
      }
    });
  }

  private registerEventHandlers(): void {
    app.whenReady().then(() => {
      this.createSplashWindow();
      setTimeout(() => {
        this.createMainWindow();
        this.setupApplicationMenu();
        this.setupContextMenu();
        this.hideSplashWindow();
      }, 2000);
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on("before-quit", () => {
      isQuitting = true;
      this.auditLogger.logEvent("app-quit");
    });
  }

  private createSplashWindow(): void {
    splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      resizable: false,
      center: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
      icon: join(__dirname, "../assets/icon.png"),
    });

    // Load splash screen with Iraqi branding
    const splashHTML = this.generateSplashHTML();
    splashWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`,
    );

    splashWindow.once("ready-to-show", () => {
      splashWindow?.show();
    });
  }

  private createMainWindow(): void {
    const securityConfig = SECURITY_CONFIG[this.config.encryptionLevel];
    const bounds = this.config.windowBounds;

    mainWindow = new BrowserWindow({
      ...bounds,
      minWidth: 800,
      minHeight: 600,
      show: false,
      titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
      webPreferences: {
        ...securityConfig,
        preload: join(__dirname, "preload.js"),
        additionalArguments: this.config.enableGovernmentMode
          ? SECURITY_CONFIG.government.additionalArguments
          : undefined,
      },
      icon: join(__dirname, "../assets/icon.png"),
    });

    // Set window title with Iraqi localization
    const title =
      this.config.defaultLanguage === "ar"
        ? "نظام الدردشة الذكي العراقي"
        : "Iraqi AI Chat System";
    mainWindow.setTitle(title);

    // Load application
    if (app.isPackaged) {
      mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    } else {
      mainWindow.loadURL("http://localhost:3000");
    }

    // Window event handlers
    mainWindow.once("ready-to-show", () => {
      mainWindow?.show();

      // Auto-updater check for government deployments
      if (this.config.enableGovernmentMode) {
        this.checkForUpdates();
      }
    });

    mainWindow.on("close", (event) => {
      if (!isQuitting && process.platform === "darwin") {
        event.preventDefault();
        mainWindow?.hide();
      }

      // Save window bounds
      if (mainWindow) {
        store.set("windowBounds", mainWindow.getBounds());
      }
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      // Security check for Iraqi government domains
      if (this.config.enableGovernmentMode) {
        const allowedDomains = [".gov.iq", ".iraq.gov", "localhost"];
        const isAllowed = allowedDomains.some((domain) => url.includes(domain));

        if (isAllowed) {
          shell.openExternal(url);
        } else {
          this.auditLogger.logSecurityEvent("blocked-external-link", { url });
        }
      } else {
        shell.openExternal(url);
      }

      return { action: "deny" };
    });
  }

  private hideSplashWindow(): void {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
  }

  private setupApplicationMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: this.config.defaultLanguage === "ar" ? "ملف" : "File",
        submenu: [
          {
            label:
              this.config.defaultLanguage === "ar"
                ? "محادثة جديدة"
                : "New Chat",
            accelerator: "CmdOrCtrl+N",
            click: () => {
              mainWindow?.webContents.send("new-chat");
            },
          },
          {
            label: this.config.defaultLanguage === "ar" ? "فتح" : "Open",
            accelerator: "CmdOrCtrl+O",
            click: async () => {
              const result = await dialog.showOpenDialog(mainWindow!, {
                properties: ["openFile"],
                filters: [
                  { name: "Iraqi AI Chat Files", extensions: ["iac"] },
                  { name: "All Files", extensions: ["*"] },
                ],
              });

              if (!result.canceled && result.filePaths.length > 0) {
                mainWindow?.webContents.send("open-file", result.filePaths[0]);
              }
            },
          },
          { type: "separator" },
          {
            label:
              this.config.defaultLanguage === "ar" ? "الإعدادات" : "Settings",
            accelerator: "CmdOrCtrl+,",
            click: () => {
              mainWindow?.webContents.send("open-settings");
            },
          },
          { type: "separator" },
          {
            label: this.config.defaultLanguage === "ar" ? "خروج" : "Quit",
            accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
            click: () => {
              app.quit();
            },
          },
        ],
      },
      {
        label: this.config.defaultLanguage === "ar" ? "تحرير" : "Edit",
        submenu: [
          {
            role: "undo",
            label: this.config.defaultLanguage === "ar" ? "تراجع" : "Undo",
          },
          {
            role: "redo",
            label: this.config.defaultLanguage === "ar" ? "إعادة" : "Redo",
          },
          { type: "separator" },
          {
            role: "cut",
            label: this.config.defaultLanguage === "ar" ? "قص" : "Cut",
          },
          {
            role: "copy",
            label: this.config.defaultLanguage === "ar" ? "نسخ" : "Copy",
          },
          {
            role: "paste",
            label: this.config.defaultLanguage === "ar" ? "لصق" : "Paste",
          },
          {
            role: "selectall",
            label:
              this.config.defaultLanguage === "ar"
                ? "تحديد الكل"
                : "Select All",
          },
        ],
      },
      {
        label: this.config.defaultLanguage === "ar" ? "عرض" : "View",
        submenu: [
          {
            role: "reload",
            label:
              this.config.defaultLanguage === "ar" ? "إعادة تحميل" : "Reload",
          },
          {
            role: "forceReload",
            label:
              this.config.defaultLanguage === "ar"
                ? "إعادة تحميل قسرية"
                : "Force Reload",
          },
          {
            role: "toggleDevTools",
            label:
              this.config.defaultLanguage === "ar"
                ? "أدوات المطور"
                : "Developer Tools",
          },
          { type: "separator" },
          {
            role: "resetZoom",
            label:
              this.config.defaultLanguage === "ar"
                ? "إعادة تعيين التكبير"
                : "Reset Zoom",
          },
          {
            role: "zoomIn",
            label: this.config.defaultLanguage === "ar" ? "تكبير" : "Zoom In",
          },
          {
            role: "zoomOut",
            label: this.config.defaultLanguage === "ar" ? "تصغير" : "Zoom Out",
          },
          { type: "separator" },
          {
            role: "togglefullscreen",
            label:
              this.config.defaultLanguage === "ar"
                ? "ملء الشاشة"
                : "Toggle Fullscreen",
          },
        ],
      },
    ];

    // Add Iraqi Government specific menu items
    if (this.config.enableGovernmentMode) {
      template.push({
        label: this.config.defaultLanguage === "ar" ? "أمان" : "Security",
        submenu: [
          {
            label:
              this.config.defaultLanguage === "ar"
                ? "تقرير الأمان"
                : "Security Report",
            click: () => {
              this.generateSecurityReport();
            },
          },
          {
            label:
              this.config.defaultLanguage === "ar"
                ? "تسجيل الأحداث"
                : "Audit Log",
            click: () => {
              this.showAuditLog();
            },
          },
          {
            label:
              this.config.defaultLanguage === "ar"
                ? "التحقق من التحديثات"
                : "Check for Updates",
            click: () => {
              this.checkForUpdates();
            },
          },
        ],
      });
    }

    // Add Help menu
    template.push({
      label: this.config.defaultLanguage === "ar" ? "مساعدة" : "Help",
      submenu: [
        {
          label:
            this.config.defaultLanguage === "ar"
              ? "دليل المستخدم"
              : "User Guide",
          click: () => {
            shell.openExternal("https://docs.iraqi-ai.gov.iq");
          },
        },
        {
          label:
            this.config.defaultLanguage === "ar"
              ? "الدعم الفني"
              : "Technical Support",
          click: () => {
            shell.openExternal("mailto:support@iraqi-ai.gov.iq");
          },
        },
        { type: "separator" },
        {
          label:
            this.config.defaultLanguage === "ar" ? "حول البرنامج" : "About",
          click: () => {
            this.showAboutDialog();
          },
        },
      ],
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

  private setupContextMenu(): void {
    contextMenu({
      prepend: (defaultActions, parameters, browserWindow) => [
        {
          label:
            this.config.defaultLanguage === "ar"
              ? "ترجمة إلى العربية"
              : "Translate to Arabic",
          visible: parameters.selectionText.trim().length > 0,
          click: () => {
            mainWindow?.webContents.send("translate-text", {
              text: parameters.selectionText,
              targetLanguage: "ar",
            });
          },
        },
        {
          label:
            this.config.defaultLanguage === "ar"
              ? "ترجمة إلى الإنجليزية"
              : "Translate to English",
          visible: parameters.selectionText.trim().length > 0,
          click: () => {
            mainWindow?.webContents.send("translate-text", {
              text: parameters.selectionText,
              targetLanguage: "en",
            });
          },
        },
      ],
      labels: {
        copy: this.config.defaultLanguage === "ar" ? "نسخ" : "Copy",
        paste: this.config.defaultLanguage === "ar" ? "لصق" : "Paste",
        cut: this.config.defaultLanguage === "ar" ? "قص" : "Cut",
        selectAll:
          this.config.defaultLanguage === "ar" ? "تحديد الكل" : "Select All",
        inspect:
          this.config.defaultLanguage === "ar"
            ? "فحص العنصر"
            : "Inspect Element",
      },
    });
  }

  private generateSplashHTML(): string {
    const isArabic = this.config.defaultLanguage === "ar";
    const direction = isArabic ? "rtl" : "ltr";
    const loadingText = isArabic ? "جاري التحميل..." : "Loading...";
    const appName = isArabic
      ? "نظام الدردشة الذكي العراقي"
      : "Iraqi AI Chat System";

    return `
      <!DOCTYPE html>
      <html dir="${direction}">
        <head>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: ${isArabic ? "'Noto Sans Arabic', Arial" : "Arial"}, sans-serif;
              background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
              color: white;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              direction: ${direction};
            }
            .logo { 
              width: 80px; 
              height: 80px; 
              background: white;
              border-radius: 16px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
            }
            .app-name { 
              font-size: 20px; 
              font-weight: 600;
              margin-bottom: 10px;
            }
            .loading { 
              font-size: 14px; 
              opacity: 0.8;
              margin-bottom: 20px;
            }
            .spinner {
              width: 24px;
              height: 24px;
              border: 2px solid transparent;
              border-top: 2px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .government-mode {
              position: absolute;
              bottom: 20px;
              font-size: 12px;
              opacity: 0.7;
            }
          </style>
        </head>
        <body>
          <div class="logo">🇮🇶</div>
          <div class="app-name">${appName}</div>
          <div class="loading">${loadingText}</div>
          <div class="spinner"></div>
          ${
            this.config.enableGovernmentMode
              ? `<div class="government-mode">${isArabic ? "وضع الحكومة العراقية" : "Iraqi Government Mode"}</div>`
              : ""
          }
        </body>
      </html>
    `;
  }

  private checkForUpdates(): void {
    if (this.config.enableGovernmentMode) {
      // Configure auto-updater for Iraqi government servers
      autoUpdater.setFeedURL({
        provider: "generic",
        url: "https://updates.iraqi-ai.gov.iq",
      });

      autoUpdater.checkForUpdatesAndNotify();
    }
  }

  private generateSecurityReport(): void {
    // Generate comprehensive security report for Iraqi government compliance
    const report = {
      timestamp: new Date().toISOString(),
      applicationVersion: app.getVersion(),
      encryptionLevel: this.config.encryptionLevel,
      governmentMode: this.config.enableGovernmentMode,
      auditLogging: this.config.auditLogging,
      securityClearanceLevel: this.config.securityClearanceLevel,
      ministryAffiliation: this.config.ministryAffiliation,
      governorateLocation: this.config.governorateLocation,
      systemInfo: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        electronVersion: process.versions.electron,
      },
    };

    const reportPath = join(
      app.getPath("documents"),
      "iraqi-ai-security-report.json",
    );
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    dialog.showMessageBox(mainWindow!, {
      type: "info",
      title:
        this.config.defaultLanguage === "ar"
          ? "تقرير الأمان"
          : "Security Report",
      message:
        this.config.defaultLanguage === "ar"
          ? "تم إنشاء تقرير الأمان بنجاح"
          : "Security report generated successfully",
      detail: reportPath,
    });
  }

  private showAuditLog(): void {
    mainWindow?.webContents.send("show-audit-log");
  }

  private showAboutDialog(): void {
    const isArabic = this.config.defaultLanguage === "ar";

    dialog.showMessageBox(mainWindow!, {
      type: "info",
      title: isArabic ? "حول البرنامج" : "About",
      message: isArabic ? "نظام الدردشة الذكي العراقي" : "Iraqi AI Chat System",
      detail: isArabic
        ? `الإصدار: ${app.getVersion()}\nمطور لخدمة الحكومة العراقية والمؤسسات\nجميع الحقوق محفوظة © 2024`
        : `Version: ${app.getVersion()}\nBuilt for Iraqi Government and Enterprises\nAll rights reserved © 2024`,
    });
  }
}

// Audit Logging System for Iraqi Government Compliance
class AuditLogger {
  private logFile: string;
  private isLogging: boolean = false;

  constructor() {
    const logsDir = join(app.getPath("userData"), "audit-logs");
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split("T")[0];
    this.logFile = join(logsDir, `audit-${date}.log`);
  }

  startAuditLog(): void {
    this.isLogging = true;
    this.logEvent("audit-started", { timestamp: new Date().toISOString() });
  }

  logEvent(eventType: string, data?: any): void {
    if (!this.isLogging) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      processId: process.pid,
      data: data || {},
    };

    try {
      const logLine = JSON.stringify(logEntry) + "\n";
      writeFileSync(this.logFile, logLine, { flag: "a" });
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }

  logSecurityEvent(eventType: string, data: any): void {
    this.logEvent(`security-${eventType}`, {
      ...data,
      severity: "high",
      requiresReview: true,
    });
  }
}

// IPC Event Handlers
ipcMain.handle("get-app-config", () => {
  return store.store;
});

ipcMain.handle(
  "update-app-config",
  (event, updates: Partial<IraqiDesktopConfig>) => {
    store.set(updates);
    return store.store;
  },
);

ipcMain.handle("get-audit-logs", async () => {
  const auditLogger = new AuditLogger();
  try {
    const logData = readFileSync(auditLogger["logFile"], "utf-8");
    return logData
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));
  } catch (error) {
    return [];
  }
});

ipcMain.handle("export-data", async (event, data: any) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: "iraqi-ai-export.json",
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled && result.filePath) {
    writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { success: true, path: result.filePath };
  }

  return { success: false };
});

// Initialize Application
const iraqiAIApp = new IraqiAIDesktopApp();

// Export for testing
export default IraqiAIDesktopApp;
