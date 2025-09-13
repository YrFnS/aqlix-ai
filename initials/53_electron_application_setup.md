# Electron Application Setup for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Electron desktop application framework** with Node.js integration, IPC communication, and cross-platform desktop deployment, optimized for Iraqi AI chat system with Arabic RTL support and cultural compliance.

**Specific technologies:** Electron 28+, Node.js, IPC (Inter-Process Communication), native menu systems, window management, Arabic window titles, RTL menu layouts, and desktop application packaging.

---

## TEMPLATE PURPOSE:

**Comprehensive Electron desktop application foundation** for the Iraqi AI Chat System that provides native desktop experience with full offline capabilities and cultural integration.

**Developers should be able to:** Set up Electron main process, configure renderer processes, implement IPC communication, create native menus with Arabic support, manage application lifecycle, and package for cross-platform distribution.

---

## CORE FEATURES:

**Essential Electron desktop application infrastructure:**

- **Main Process Setup:** Electron main process with window management and lifecycle control
- **Renderer Process Configuration:** Secure renderer processes with web content isolation
- **IPC Communication:** Bidirectional communication between main and renderer processes
- **Arabic Window Management:** RTL window titles and Arabic menu layouts
- **Native Menu Integration:** Context menus and application menus with cultural adaptation
- **Cross-Platform Packaging:** Windows, macOS, and Linux distribution packages

---

## EXAMPLES TO INCLUDE:

**Working Electron application examples:**

- **Main Process Setup:** Application initialization with window management
- **Renderer Process Integration:** Secure web content loading with Node.js access
- **IPC Message Handling:** Communication patterns for desktop-web integration
- **Arabic Menu System:** Native menus with RTL support and Islamic context
- **Window State Management:** Persistent window positioning and size management
- **Application Lifecycle:** Proper startup, shutdown, and update handling

---

## DOCUMENTATION TO RESEARCH:

**Electron desktop application documentation:**

- **Electron Main Process:** https://www.electronjs.org/docs/latest/tutorial/main-process - Main process architecture
- **Renderer Process:** https://www.electronjs.org/docs/latest/tutorial/renderer-process - Renderer process security
- **IPC Communication:** https://www.electronjs.org/docs/latest/tutorial/ipc - Inter-process communication
- **Menu System:** https://www.electronjs.org/docs/latest/api/menu - Native menu integration
- **App Packaging:** https://www.electronjs.org/docs/latest/tutorial/application-distribution - Distribution and packaging

---

## DEVELOPMENT PATTERNS:

**Electron application architecture patterns:**

- **Process Isolation:** Secure separation between main and renderer processes
- **IPC Message Patterns:** Request-response, event broadcasting, and data streaming
- **Window Management:** Multi-window applications with state persistence
- **Security Hardening:** Content Security Policy, node integration, and context isolation
- **Arabic Localization:** RTL layout management and cultural menu organization
- **Performance Optimization:** Memory management, process spawning, and resource cleanup

---

## SECURITY & BEST PRACTICES:

**Electron application security considerations:**

- **Context Isolation:** Secure renderer processes with limited Node.js access
- **Content Security Policy:** XSS protection and resource loading restrictions
- **Node.js Integration:** Minimal Node.js exposure to renderer processes
- **File System Security:** Sandboxed file access and validation
- **Cultural Data Protection:** Secure handling of Arabic content and Islamic expressions
- **Update Security:** Signed updates and verification processes

---

## COMMON GOTCHAS:

**Electron development challenges:**

- **Memory Management:** Renderer process memory leaks and cleanup
- **Security Vulnerabilities:** Node.js integration security risks
- **Arabic Font Rendering:** Cross-platform Arabic font compatibility
- **Window State Persistence:** Proper window positioning across system restarts
- **IPC Performance:** Efficient data transfer between processes
- **Platform-Specific Behavior:** macOS, Windows, and Linux differences

---

## VALIDATION REQUIREMENTS:

**Electron application validation:**

- **Application Startup:** <3s cold start time with proper error handling
- **Arabic Display:** Correct RTL rendering across all desktop platforms
- **Cultural Compliance:** 100% Islamic compliance for menu items and window titles
- **Memory Usage:** <200MB baseline memory footprint
- **Cross-Platform Testing:** Consistent behavior across Windows, macOS, Linux

---

## INTEGRATION FOCUS:

**Electron application integration points:**

- **Web Application:** Seamless integration with Next.js web interface
- **Voice System:** Desktop-optimized voice recognition and synthesis
- **File System:** Native file operations with cultural validation
- **Native APIs:** Operating system integration for enhanced functionality

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System Electron considerations:**

- **Focus on Arabic desktop experience** - native RTL menus and window management
- **Islamic compliance integration** - culturally appropriate desktop notifications
- **Professional domain support** - desktop workflows for Iraqi legal, medical, educational use
- **Offline-first approach** - comprehensive desktop functionality without internet dependency

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features  
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because Electron requires desktop development expertise, IPC communication patterns, and security considerations while remaining accessible to web developers.

---

## IMPLEMENTATION EXAMPLES:

### Electron Main Process

```typescript
// src-electron/main.ts
import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'
import { Task } from '../lib/task-delegation'

interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  maximized: boolean
  fullscreen: boolean
}

interface IraqiDesktopConfig {
  culturalValidation: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  enableVoiceFeatures: boolean
  enableOfflineMode: boolean
  arabicInterfaceDirection: 'rtl' | 'auto'
}

class IraqiAIDesktopApp {
  private mainWindow: BrowserWindow | null = null
  private windowState: WindowState = {
    width: 1200,
    height: 800,
    maximized: false,
    fullscreen: false
  }
  private config: IraqiDesktopConfig = {
    culturalValidation: true,
    enableVoiceFeatures: true,
    enableOfflineMode: true,
    arabicInterfaceDirection: 'rtl'
  }

  constructor() {
    this.initializeApp()
  }

  private initializeApp(): void {
    // Handle app ready
    app.whenReady().then(() => {
      this.createMainWindow()
      this.setupApplicationMenu()
      this.setupIpcHandlers()
      this.validateCulturalCompliance()

      // macOS specific - recreate window when dock icon clicked
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow()
        }
      })
    })

    // Handle window close
    app.on('window-all-closed', () => {
      // macOS specific - keep app running when windows closed
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // Handle second instance (single instance enforcement)
    app.on('second-instance', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore()
        }
        this.mainWindow.focus()
      }
    })
  }

  private async createMainWindow(): Promise<void> {
    try {
      // Restore previous window state
      await this.restoreWindowState()

      // Create the browser window with cultural settings
      this.mainWindow = new BrowserWindow({
        x: this.windowState.x,
        y: this.windowState.y,
        width: this.windowState.width,
        height: this.windowState.height,
        minWidth: 800,
        minHeight: 600,
        title: 'نظام الذكاء الاصطناعي العراقي / Iraqi AI Chat System',
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
        frame: true,
        show: false, // Don't show until ready
        webPreferences: {
          contextIsolation: true, // Enable context isolation for security
          enableRemoteModule: false, // Disable remote module for security
          nodeIntegration: false, // Disable node integration in renderer
          preload: join(__dirname, 'preload.js'), // Preload script for secure IPC
          webSecurity: true, // Enable web security
          allowRunningInsecureContent: false,
          experimentalFeatures: false
        },
        icon: this.getApplicationIcon()
      })

      // Load the web application
      const isDevelopment = process.env.NODE_ENV === 'development'
      const url = isDevelopment 
        ? 'http://localhost:3000'
        : `file://${join(__dirname, '../web/index.html')}`

      await this.mainWindow.loadURL(url)

      // Setup window event handlers
      this.setupWindowEventHandlers()

      // Show window when ready
      this.mainWindow.once('ready-to-show', () => {
        if (this.mainWindow) {
          if (this.windowState.maximized) {
            this.mainWindow.maximize()
          }
          if (this.windowState.fullscreen) {
            this.mainWindow.setFullScreen(true)
          }
          this.mainWindow.show()
          
          // Focus for accessibility
          this.mainWindow.focus()
        }
      })

      // Setup Arabic RTL support
      await this.configureArabicSupport()

    } catch (error) {
      console.error('Failed to create main window:', error)
      await this.handleWindowCreationError(error)
    }
  }

  private setupWindowEventHandlers(): void {
    if (!this.mainWindow) return

    // Save window state on resize/move
    this.mainWindow.on('resize', () => this.saveWindowState())
    this.mainWindow.on('move', () => this.saveWindowState())
    this.mainWindow.on('maximize', () => this.saveWindowState())
    this.mainWindow.on('unmaximize', () => this.saveWindowState())
    this.mainWindow.on('enter-full-screen', () => this.saveWindowState())
    this.mainWindow.on('leave-full-screen', () => this.saveWindowState())

    // Handle window close
    this.mainWindow.on('close', async (event) => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        event.preventDefault()
        await this.handleWindowClose()
      }
    })

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })

    // Handle navigation
    this.mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl)
      
      // Allow only same-origin navigation
      if (parsedUrl.origin !== 'http://localhost:3000' && 
          parsedUrl.protocol !== 'file:') {
        event.preventDefault()
      }
    })
  }

  private async configureArabicSupport(): Promise<void> {
    if (!this.mainWindow) return

    try {
      // Configure RTL support
      await this.mainWindow.webContents.executeJavaScript(`
        document.documentElement.setAttribute('dir', '${this.config.arabicInterfaceDirection}');
        document.documentElement.setAttribute('lang', 'ar-IQ');
        
        // Add Arabic font fallbacks
        const style = document.createElement('style');
        style.textContent = \`
          body {
            font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', 'Dubai', 'Tahoma', sans-serif;
            direction: ${this.config.arabicInterfaceDirection};
          }
          .font-arabic {
            font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', 'Dubai', 'Tahoma', sans-serif;
          }
        \`;
        document.head.appendChild(style);
      `)

      console.log('Arabic RTL support configured successfully')
    } catch (error) {
      console.error('Failed to configure Arabic support:', error)
    }
  }

  private async setupApplicationMenu(): Promise<void> {
    const template = await this.createMenuTemplate()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  private async createMenuTemplate(): Promise<Electron.MenuItemConstructorOptions[]> {
    // Cultural validation for menu items
    const culturalTask = new Task({
      subagent_type: 'iraqi-cultural-validator',
      description: 'Validate desktop menu items for cultural appropriateness',
      prompt: `Validate these desktop application menu items for Iraqi cultural compliance:
      
      Menu Structure:
      - File menu with New, Open, Save, Recent files
      - Edit menu with Cut, Copy, Paste, Undo, Redo
      - View menu with Zoom, Full Screen, Developer Tools
      - Tools menu with Voice Recognition, Audio Recording, Settings
      - Help menu with Documentation, About, Keyboard Shortcuts
      
      Professional Domain: ${this.config.professionalDomain || 'general'}
      
      Requirements:
      - Ensure culturally appropriate menu labels
      - Validate Islamic compliance for all menu items
      - Provide Arabic translations for menu labels
      - Check professional domain appropriateness
      
      Return validated menu structure with Arabic labels.`
    })

    let menuLabels
    try {
      const culturalResult = await culturalTask.execute()
      menuLabels = culturalResult.menuLabels || this.getDefaultMenuLabels()
    } catch (error) {
      console.error('Cultural menu validation failed:', error)
      menuLabels = this.getDefaultMenuLabels()
    }

    const isMac = process.platform === 'darwin'
    
    const template: Electron.MenuItemConstructorOptions[] = [
      // macOS app menu
      ...(isMac ? [{
        label: menuLabels.app.label,
        submenu: [
          {
            label: menuLabels.app.about,
            role: 'about' as const
          },
          { type: 'separator' as const },
          {
            label: menuLabels.app.services,
            role: 'services' as const,
            submenu: []
          },
          { type: 'separator' as const },
          {
            label: menuLabels.app.hide,
            accelerator: 'Command+H',
            role: 'hide' as const
          },
          {
            label: menuLabels.app.hideOthers,
            accelerator: 'Command+Shift+H',
            role: 'hideothers' as const
          },
          {
            label: menuLabels.app.unhide,
            role: 'unhide' as const
          },
          { type: 'separator' as const },
          {
            label: menuLabels.app.quit,
            accelerator: 'Command+Q',
            click: () => app.quit()
          }
        ]
      }] : []),

      // File menu
      {
        label: menuLabels.file.label,
        submenu: [
          {
            label: menuLabels.file.newChat,
            accelerator: 'CmdOrCtrl+N',
            click: () => this.handleMenuAction('new-chat')
          },
          {
            label: menuLabels.file.openChat,
            accelerator: 'CmdOrCtrl+O',
            click: () => this.handleMenuAction('open-chat')
          },
          {
            label: menuLabels.file.saveChat,
            accelerator: 'CmdOrCtrl+S',
            click: () => this.handleMenuAction('save-chat')
          },
          { type: 'separator' as const },
          {
            label: menuLabels.file.exportChat,
            submenu: [
              {
                label: menuLabels.file.exportPDF,
                click: () => this.handleMenuAction('export-pdf')
              },
              {
                label: menuLabels.file.exportText,
                click: () => this.handleMenuAction('export-text')
              }
            ]
          },
          { type: 'separator' as const },
          {
            label: menuLabels.file.recentChats,
            submenu: [
              {
                label: menuLabels.file.clearRecent,
                click: () => this.handleMenuAction('clear-recent')
              }
            ]
          },
          ...(!isMac ? [
            { type: 'separator' as const },
            {
              label: menuLabels.file.exit,
              accelerator: 'Alt+F4',
              click: () => app.quit()
            }
          ] : [])
        ]
      },

      // Edit menu
      {
        label: menuLabels.edit.label,
        submenu: [
          {
            label: menuLabels.edit.undo,
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo' as const
          },
          {
            label: menuLabels.edit.redo,
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo' as const
          },
          { type: 'separator' as const },
          {
            label: menuLabels.edit.cut,
            accelerator: 'CmdOrCtrl+X',
            role: 'cut' as const
          },
          {
            label: menuLabels.edit.copy,
            accelerator: 'CmdOrCtrl+C',
            role: 'copy' as const
          },
          {
            label: menuLabels.edit.paste,
            accelerator: 'CmdOrCtrl+V',
            role: 'paste' as const
          },
          {
            label: menuLabels.edit.selectAll,
            accelerator: 'CmdOrCtrl+A',
            role: 'selectAll' as const
          },
          { type: 'separator' as const },
          {
            label: menuLabels.edit.preferences,
            accelerator: 'CmdOrCtrl+,',
            click: () => this.handleMenuAction('preferences')
          }
        ]
      },

      // View menu
      {
        label: menuLabels.view.label,
        submenu: [
          {
            label: menuLabels.view.reload,
            accelerator: 'CmdOrCtrl+R',
            click: () => this.mainWindow?.webContents.reload()
          },
          {
            label: menuLabels.view.forceReload,
            accelerator: 'CmdOrCtrl+Shift+R',
            click: () => this.mainWindow?.webContents.reloadIgnoringCache()
          },
          { type: 'separator' as const },
          {
            label: menuLabels.view.zoomIn,
            accelerator: 'CmdOrCtrl+Plus',
            click: () => this.adjustZoom(0.1)
          },
          {
            label: menuLabels.view.zoomOut,
            accelerator: 'CmdOrCtrl+-',
            click: () => this.adjustZoom(-0.1)
          },
          {
            label: menuLabels.view.resetZoom,
            accelerator: 'CmdOrCtrl+0',
            click: () => this.resetZoom()
          },
          { type: 'separator' as const },
          {
            label: menuLabels.view.fullScreen,
            accelerator: isMac ? 'Ctrl+Command+F' : 'F11',
            click: () => this.toggleFullScreen()
          },
          { type: 'separator' as const },
          {
            label: menuLabels.view.developerTools,
            accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click: () => this.mainWindow?.webContents.toggleDevTools()
          }
        ]
      },

      // Tools menu (Iraqi-specific features)
      {
        label: menuLabels.tools.label,
        submenu: [
          {
            label: menuLabels.tools.voiceRecognition,
            accelerator: 'CmdOrCtrl+Shift+V',
            click: () => this.handleMenuAction('voice-recognition'),
            enabled: this.config.enableVoiceFeatures
          },
          {
            label: menuLabels.tools.audioRecording,
            accelerator: 'CmdOrCtrl+Shift+R',
            click: () => this.handleMenuAction('audio-recording'),
            enabled: this.config.enableVoiceFeatures
          },
          { type: 'separator' as const },
          {
            label: menuLabels.tools.prayerTimes,
            click: () => this.handleMenuAction('prayer-times')
          },
          {
            label: menuLabels.tools.islamicCalendar,
            click: () => this.handleMenuAction('islamic-calendar')
          },
          { type: 'separator' as const },
          {
            label: menuLabels.tools.culturalValidation,
            type: 'checkbox' as const,
            checked: this.config.culturalValidation,
            click: () => this.toggleCulturalValidation()
          },
          { type: 'separator' as const },
          ...(this.config.professionalDomain ? [{
            label: menuLabels.tools.professionalTools,
            submenu: this.createProfessionalToolsMenu()
          }] : [])
        ]
      },

      // Help menu
      {
        label: menuLabels.help.label,
        submenu: [
          {
            label: menuLabels.help.userGuide,
            click: () => this.handleMenuAction('user-guide')
          },
          {
            label: menuLabels.help.keyboardShortcuts,
            accelerator: 'CmdOrCtrl+/',
            click: () => this.handleMenuAction('keyboard-shortcuts')
          },
          { type: 'separator' as const },
          {
            label: menuLabels.help.reportIssue,
            click: () => this.handleMenuAction('report-issue')
          },
          {
            label: menuLabels.help.checkUpdates,
            click: () => this.handleMenuAction('check-updates')
          },
          ...(!isMac ? [
            { type: 'separator' as const },
            {
              label: menuLabels.help.about,
              click: () => this.handleMenuAction('about')
            }
          ] : [])
        ]
      }
    ]

    return template
  }

  private getDefaultMenuLabels(): any {
    return {
      app: {
        label: 'نظام الذكاء الاصطناعي العراقي / Iraqi AI Chat',
        about: 'حول البرنامج / About',
        services: 'الخدمات / Services',
        hide: 'إخفاء / Hide',
        hideOthers: 'إخفاء الأخرى / Hide Others',
        unhide: 'إظهار الكل / Show All',
        quit: 'إنهاء / Quit'
      },
      file: {
        label: 'ملف / File',
        newChat: 'محادثة جديدة / New Chat',
        openChat: 'فتح محادثة / Open Chat',
        saveChat: 'حفظ المحادثة / Save Chat',
        exportChat: 'تصدير المحادثة / Export Chat',
        exportPDF: 'تصدير PDF / Export as PDF',
        exportText: 'تصدير نص / Export as Text',
        recentChats: 'المحادثات الأخيرة / Recent Chats',
        clearRecent: 'مسح الأخيرة / Clear Recent',
        exit: 'خروج / Exit'
      },
      edit: {
        label: 'تحرير / Edit',
        undo: 'تراجع / Undo',
        redo: 'إعادة / Redo',
        cut: 'قص / Cut',
        copy: 'نسخ / Copy',
        paste: 'لصق / Paste',
        selectAll: 'تحديد الكل / Select All',
        preferences: 'التفضيلات / Preferences'
      },
      view: {
        label: 'عرض / View',
        reload: 'إعادة تحميل / Reload',
        forceReload: 'فرض إعادة التحميل / Force Reload',
        zoomIn: 'تكبير / Zoom In',
        zoomOut: 'تصغير / Zoom Out',
        resetZoom: 'إعادة تعيين التكبير / Reset Zoom',
        fullScreen: 'ملء الشاشة / Full Screen',
        developerTools: 'أدوات المطور / Developer Tools'
      },
      tools: {
        label: 'أدوات / Tools',
        voiceRecognition: 'التعرف على الصوت / Voice Recognition',
        audioRecording: 'تسجيل الصوت / Audio Recording',
        prayerTimes: 'أوقات الصلاة / Prayer Times',
        islamicCalendar: 'التقويم الهجري / Islamic Calendar',
        culturalValidation: 'التحقق الثقافي / Cultural Validation',
        professionalTools: 'الأدوات المهنية / Professional Tools'
      },
      help: {
        label: 'مساعدة / Help',
        userGuide: 'دليل المستخدم / User Guide',
        keyboardShortcuts: 'اختصارات لوحة المفاتيح / Keyboard Shortcuts',
        reportIssue: 'الإبلاغ عن مشكلة / Report Issue',
        checkUpdates: 'البحث عن تحديثات / Check for Updates',
        about: 'حول البرنامج / About'
      }
    }
  }

  private createProfessionalToolsMenu(): Electron.MenuItemConstructorOptions[] {
    const domain = this.config.professionalDomain
    
    switch (domain) {
      case 'legal':
        return [
          {
            label: 'إملاء قانوني / Legal Dictation',
            click: () => this.handleMenuAction('legal-dictation')
          },
          {
            label: 'قوالب قانونية / Legal Templates',
            click: () => this.handleMenuAction('legal-templates')
          }
        ]
      case 'medical':
        return [
          {
            label: 'ملاحظات طبية / Medical Notes',
            click: () => this.handleMenuAction('medical-notes')
          },
          {
            label: 'قوالب طبية / Medical Templates',
            click: () => this.handleMenuAction('medical-templates')
          }
        ]
      case 'educational':
        return [
          {
            label: 'إنشاء درس / Create Lesson',
            click: () => this.handleMenuAction('create-lesson')
          },
          {
            label: 'تقييم الطلاب / Student Assessment',
            click: () => this.handleMenuAction('student-assessment')
          }
        ]
      default:
        return [
          {
            label: 'أدوات الأعمال / Business Tools',
            click: () => this.handleMenuAction('business-tools')
          }
        ]
    }
  }

  private setupIpcHandlers(): void {
    // Handle cultural validation requests
    ipcMain.handle('validate-cultural-content', async (event, content: string) => {
      try {
        const task = new Task({
          subagent_type: 'iraqi-cultural-validator',
          description: 'Validate content for cultural compliance from desktop app',
          prompt: `Validate this content for Iraqi cultural compliance:
          
          Content: "${content}"
          Professional Domain: ${this.config.professionalDomain || 'general'}
          
          Return cultural validation results.`
        })
        
        return await task.execute()
      } catch (error) {
        console.error('Cultural validation error:', error)
        return { error: 'Cultural validation failed' }
      }
    })

    // Handle window state queries
    ipcMain.handle('get-window-state', () => {
      if (!this.mainWindow) return null
      
      return {
        isMaximized: this.mainWindow.isMaximized(),
        isMinimized: this.mainWindow.isMinimized(),
        isFullScreen: this.mainWindow.isFullScreen(),
        bounds: this.mainWindow.getBounds()
      }
    })

    // Handle application configuration
    ipcMain.handle('get-app-config', () => {
      return {
        ...this.config,
        platform: process.platform,
        version: app.getVersion()
      }
    })

    // Handle file operations
    ipcMain.handle('show-save-dialog', async (event, options) => {
      if (!this.mainWindow) return { canceled: true }
      
      return await dialog.showSaveDialog(this.mainWindow, {
        ...options,
        title: 'حفظ الملف / Save File'
      })
    })

    ipcMain.handle('show-open-dialog', async (event, options) => {
      if (!this.mainWindow) return { canceled: true }
      
      return await dialog.showOpenDialog(this.mainWindow, {
        ...options,
        title: 'فتح الملف / Open File'
      })
    })
  }

  private async handleMenuAction(action: string): Promise<void> {
    if (!this.mainWindow) return

    // Send menu action to renderer process
    this.mainWindow.webContents.send('menu-action', {
      action,
      timestamp: Date.now(),
      culturalValidation: this.config.culturalValidation
    })
  }

  private async validateCulturalCompliance(): Promise<void> {
    if (!this.config.culturalValidation) return

    try {
      const task = new Task({
        subagent_type: 'iraqi-cultural-validator',
        description: 'Validate desktop application cultural compliance',
        prompt: `Validate desktop application setup for Iraqi cultural compliance:
        
        Application: Iraqi AI Chat System Desktop
        Platform: ${process.platform}
        Professional Domain: ${this.config.professionalDomain || 'general'}
        
        Validation Areas:
        - Application name and branding
        - Menu structure and labels
        - Window titles and interface
        - Cultural sensitivity compliance
        
        Return validation results with recommendations.`
      })

      const result = await task.execute()
      
      if (!result.culturallyAppropriate) {
        console.warn('Cultural compliance issues detected:', result.issues)
      }
    } catch (error) {
      console.error('Cultural validation failed:', error)
    }
  }

  // Utility methods
  private async restoreWindowState(): Promise<void> {
    // Implementation would load saved window state from storage
    // For now, using defaults
  }

  private saveWindowState(): void {
    if (!this.mainWindow) return
    
    const bounds = this.mainWindow.getBounds()
    this.windowState = {
      ...bounds,
      maximized: this.mainWindow.isMaximized(),
      fullscreen: this.mainWindow.isFullScreen()
    }
    
    // Save to persistent storage
    // Implementation would save to user data directory
  }

  private async handleWindowClose(): Promise<void> {
    // Save application state
    this.saveWindowState()
    
    // Cleanup resources
    this.mainWindow?.destroy()
    this.mainWindow = null
    
    // Quit application
    app.quit()
  }

  private async handleWindowCreationError(error: any): Promise<void> {
    await dialog.showErrorBox(
      'خطأ في تطبيق سطح المكتب / Desktop Application Error',
      `فشل في إنشاء النافذة الرئيسية: ${error.message}\nFailed to create main window: ${error.message}`
    )
    app.quit()
  }

  private getApplicationIcon(): string {
    // Return platform-specific icon path
    const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png'
    return join(__dirname, '../assets/icons', iconName)
  }

  private adjustZoom(delta: number): void {
    if (!this.mainWindow) return
    
    const currentZoom = this.mainWindow.webContents.getZoomFactor()
    const newZoom = Math.max(0.5, Math.min(3.0, currentZoom + delta))
    this.mainWindow.webContents.setZoomFactor(newZoom)
  }

  private resetZoom(): void {
    if (!this.mainWindow) return
    this.mainWindow.webContents.setZoomFactor(1.0)
  }

  private toggleFullScreen(): void {
    if (!this.mainWindow) return
    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
  }

  private toggleCulturalValidation(): void {
    this.config.culturalValidation = !this.config.culturalValidation
    
    // Notify renderer process
    if (this.mainWindow) {
      this.mainWindow.webContents.send('config-changed', {
        culturalValidation: this.config.culturalValidation
      })
    }
  }
}

// Single instance enforcement
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  new IraqiAIDesktopApp()
}
```

### Preload Script for Secure IPC

```typescript
// src-electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

// Define secure API for renderer process
const electronAPI = {
  // Cultural validation
  validateCulturalContent: (content: string) => 
    ipcRenderer.invoke('validate-cultural-content', content),
  
  // Window management
  getWindowState: () => 
    ipcRenderer.invoke('get-window-state'),
  
  // Application configuration
  getAppConfig: () => 
    ipcRenderer.invoke('get-app-config'),
  
  // File operations
  showSaveDialog: (options: any) => 
    ipcRenderer.invoke('show-save-dialog', options),
  
  showOpenDialog: (options: any) => 
    ipcRenderer.invoke('show-open-dialog', options),
  
  // Event listeners
  onMenuAction: (callback: (action: any) => void) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action))
    return () => ipcRenderer.removeAllListeners('menu-action')
  },
  
  onConfigChanged: (callback: (config: any) => void) => {
    ipcRenderer.on('config-changed', (event, config) => callback(config))
    return () => ipcRenderer.removeAllListeners('config-changed')
  },
  
  // Platform information
  platform: process.platform,
  
  // Version information
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
}

// Expose API to renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type declarations for renderer process
declare global {
  interface Window {
    electronAPI: typeof electronAPI
  }
}
```

### React Integration Hook

```typescript
// src/hooks/useElectronAPI.ts
import { useEffect, useState, useCallback } from 'react'

interface ElectronConfig {
  culturalValidation: boolean
  professionalDomain?: string
  enableVoiceFeatures: boolean
  enableOfflineMode: boolean
  arabicInterfaceDirection: 'rtl' | 'auto'
  platform: string
  version: string
}

export function useElectronAPI() {
  const [isElectron, setIsElectron] = useState(false)
  const [config, setConfig] = useState<ElectronConfig | null>(null)
  const [windowState, setWindowState] = useState<any>(null)

  useEffect(() => {
    // Check if running in Electron
    const checkElectron = () => {
      setIsElectron(typeof window !== 'undefined' && !!window.electronAPI)
    }
    
    checkElectron()

    // Load initial configuration
    if (window.electronAPI) {
      window.electronAPI.getAppConfig().then(setConfig)
      window.electronAPI.getWindowState().then(setWindowState)
    }
  }, [])

  // Cultural validation
  const validateCulturalContent = useCallback(async (content: string) => {
    if (!window.electronAPI) return null
    return await window.electronAPI.validateCulturalContent(content)
  }, [])

  // File operations
  const showSaveDialog = useCallback(async (options: any) => {
    if (!window.electronAPI) return { canceled: true }
    return await window.electronAPI.showSaveDialog(options)
  }, [])

  const showOpenDialog = useCallback(async (options: any) => {
    if (!window.electronAPI) return { canceled: true }
    return await window.electronAPI.showOpenDialog(options)
  }, [])

  // Menu action listener
  useEffect(() => {
    if (!window.electronAPI) return

    const cleanup = window.electronAPI.onMenuAction((action) => {
      console.log('Menu action received:', action)
      
      // Handle menu actions
      switch (action.action) {
        case 'new-chat':
          // Handle new chat
          window.location.hash = '#/chat/new'
          break
        case 'voice-recognition':
          // Trigger voice recognition
          document.dispatchEvent(new CustomEvent('electron-voice-recognition'))
          break
        case 'prayer-times':
          // Show prayer times
          window.location.hash = '#/prayer-times'
          break
        // Add more menu action handlers
      }
    })

    return cleanup
  }, [])

  // Configuration change listener
  useEffect(() => {
    if (!window.electronAPI) return

    const cleanup = window.electronAPI.onConfigChanged((newConfig) => {
      setConfig(prev => ({ ...prev, ...newConfig }))
    })

    return cleanup
  }, [])

  return {
    isElectron,
    config,
    windowState,
    validateCulturalContent,
    showSaveDialog,
    showOpenDialog,
    platform: window.electronAPI?.platform,
    versions: window.electronAPI?.versions
  }
}
```

### Package Configuration

```json
// package.json (Electron-specific additions)
{
  "name": "iraqi-ai-chat-desktop",
  "version": "1.0.0",
  "description": "Iraqi AI Chat System Desktop Application",
  "main": "dist-electron/main.js",
  "homepage": "./",
  "scripts": {
    "electron": "electron .",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:3000 && electron .\"",
    "electron:pack": "electron-builder --dir",
    "electron:dist": "electron-builder",
    "build:electron": "npm run build && npm run electron:dist"
  },
  "build": {
    "appId": "com.aqlix.iraqi-ai-chat",
    "productName": "Iraqi AI Chat System",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist-electron/**/*",
      "dist/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    },
    "win": {
      "target": "nsis",
      "publisherName": "AQLIX AI"
    },
    "linux": {
      "target": "AppImage",
      "category": "Office"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.6.4",
    "concurrently": "^8.2.2",
    "wait-on": "^7.0.1"
  }
}
```

---

**This micro-initial provides comprehensive Electron desktop application setup specifically designed for Iraqi AI Chat System integration, with full Arabic RTL support, cultural menu validation, and professional domain desktop workflows.**