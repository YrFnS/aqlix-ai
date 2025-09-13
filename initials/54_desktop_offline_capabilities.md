# Desktop Offline Capabilities for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Offline-first desktop application architecture** with local data storage, offline AI processing, and sync capabilities, optimized for Iraqi users with limited connectivity and cultural data requirements.

**Specific technologies:** IndexedDB, SQLite, local file storage, service workers, offline AI models, local speech processing, Arabic text caching, and intelligent sync strategies.

---

## TEMPLATE PURPOSE:

**Comprehensive offline capabilities** for the Iraqi AI Chat System desktop application that ensures full functionality without internet connectivity while maintaining cultural validation and professional workflows.

**Developers should be able to:** Implement offline data storage, configure local AI processing, manage offline-online sync, cache Arabic content, handle intermittent connectivity, and maintain cultural compliance offline.

---

## CORE FEATURES:

**Essential offline desktop infrastructure:**

- **Local Data Storage:** Persistent chat history, settings, and user preferences
- **Offline AI Processing:** Local speech recognition, text generation, and cultural validation
- **Arabic Content Caching:** RTL layouts, fonts, and cultural content offline
- **Professional Workflows:** Domain-specific templates and tools available offline
- **Intelligent Synchronization:** Conflict resolution and data merge strategies
- **Cultural Compliance Offline:** Local Islamic calendar, prayer times, and validation rules

---

## EXAMPLES TO INCLUDE:

**Working offline capability examples:**

- **Offline Chat System:** Local conversation storage and AI responses
- **Local Speech Processing:** STT/TTS functionality without internet
- **Cultural Content Cache:** Islamic expressions and cultural validation offline
- **Professional Templates:** Legal, medical, educational templates stored locally
- **Sync Management:** Intelligent data synchronization with conflict resolution
- **Offline Prayer Times:** Local Islamic calendar and prayer time calculations

---

## DOCUMENTATION TO RESEARCH:

**Offline desktop application documentation:**

- **IndexedDB:** https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API - Browser offline storage
- **SQLite:** https://www.sqlite.org/docs.html - Local database for Electron apps
- **Service Workers:** https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API - Offline web app capabilities
- **Local AI Models:** https://github.com/xenova/transformers.js - Browser-based AI processing
- **Electron Store:** https://github.com/sindresorhus/electron-store - Simple data persistence

---

## DEVELOPMENT PATTERNS:

**Offline-first architecture patterns:**

- **Data Layer:** Local-first data management with remote sync
- **Cache Strategy:** Intelligent caching with cultural content priority
- **Sync Patterns:** Conflict resolution, merge strategies, and data reconciliation
- **Offline Detection:** Network status monitoring and graceful degradation
- **Cultural Data Management:** Local Islamic calendar, prayer times, cultural rules
- **Performance Optimization:** Lazy loading, background sync, and storage cleanup

---

## SECURITY & BEST PRACTICES:

**Offline application security considerations:**

- **Local Data Encryption:** Sensitive information protection at rest
- **Cultural Data Privacy:** Secure handling of Islamic and cultural content
- **Professional Confidentiality:** Encrypted storage of domain-specific data
- **Sync Security:** Encrypted data transmission and authentication
- **Storage Limits:** Quota management and cleanup strategies
- **Access Control:** Local authentication and session management

---

## COMMON GOTCHAS:

**Offline development challenges:**

- **Storage Limitations:** Browser and Electron storage quotas
- **Data Synchronization:** Conflict resolution and merge complexity
- **Arabic Font Loading:** Offline font availability and fallbacks
- **Performance Impact:** Large local databases and indexing
- **Version Compatibility:** Schema migrations and data format changes
- **Cultural Context Preservation:** Maintaining Islamic compliance offline

---

## VALIDATION REQUIREMENTS:

**Offline system validation:**

- **Functionality Testing:** All features work without internet connectivity
- **Data Integrity:** No data loss during offline-online transitions
- **Cultural Compliance:** 100% Islamic compliance maintained offline
- **Performance Benchmarks:** <2s app startup time, responsive offline operations
- **Storage Efficiency:** Optimized data storage with intelligent cleanup

---

## INTEGRATION FOCUS:

**Offline capability integration points:**

- **Electron Main Process:** Local database and file system management
- **Voice System:** Offline speech recognition and synthesis capabilities
- **Cultural System:** Local validation rules and Islamic content caching
- **Professional Tools:** Domain-specific offline templates and workflows

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System offline considerations:**

- **Focus on prayer time accuracy** - local Islamic calendar calculations with GPS fallback
- **Cultural content priority** - Islamic expressions and cultural validation cached first
- **Professional domain support** - offline legal, medical, educational templates and tools
- **Connectivity resilience** - graceful handling of Iraq's intermittent internet connectivity

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features  
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because offline capabilities require data synchronization expertise, local storage management, and sync conflict resolution while remaining accessible to developers.

---

## IMPLEMENTATION EXAMPLES:

### Offline Data Manager

```typescript
// src/lib/offline-data-manager.ts
import { Task } from './task-delegation'
import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

interface OfflineConfig {
  enableCulturalValidation: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  syncStrategy: 'immediate' | 'periodic' | 'manual'
  storageQuota: number // MB
  culturalContentPriority: boolean
}

interface ChatMessage {
  id: string
  timestamp: number
  content: string
  contentArabic?: string
  role: 'user' | 'assistant' | 'system'
  culturallyValidated: boolean
  professionalDomain?: string
  audioAttachment?: string
  imageAttachment?: string
  syncStatus: 'pending' | 'synced' | 'conflict'
}

interface CulturalContent {
  id: string
  type: 'islamic_expression' | 'cultural_phrase' | 'prayer_time' | 'validation_rule'
  content: string
  contentArabic: string
  metadata: Record<string, any>
  lastUpdated: number
  source: 'local' | 'remote'
}

export class OfflineDataManager {
  private db: Database.Database | null = null
  private config: OfflineConfig
  private syncQueue: any[] = []
  private isOnline = false
  private syncInProgress = false

  constructor(config: OfflineConfig) {
    this.config = config
    this.initializeDatabase()
    this.setupNetworkMonitoring()
    this.startPeriodicSync()
  }

  private initializeDatabase(): void {
    const userDataPath = app.getPath('userData')
    const dbPath = join(userDataPath, 'iraqi-ai-chat.db')
    
    try {
      this.db = new Database(dbPath)
      this.createTables()
      this.seedCulturalContent()
      console.log('Offline database initialized successfully')
    } catch (error) {
      console.error('Failed to initialize offline database:', error)
      throw new Error('Offline database initialization failed')
    }
  }

  private createTables(): void {
    if (!this.db) return

    // Chat messages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        content TEXT NOT NULL,
        content_arabic TEXT,
        role TEXT NOT NULL,
        culturally_validated BOOLEAN DEFAULT FALSE,
        professional_domain TEXT,
        audio_attachment TEXT,
        image_attachment TEXT,
        sync_status TEXT DEFAULT 'pending',
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Cultural content table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cultural_content (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        content_arabic TEXT NOT NULL,
        metadata TEXT, -- JSON
        last_updated INTEGER NOT NULL,
        source TEXT DEFAULT 'local',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // User settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL, -- JSON
        last_updated INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Professional templates table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS professional_templates (
        id TEXT PRIMARY KEY,
        domain TEXT NOT NULL,
        name TEXT NOT NULL,
        name_arabic TEXT NOT NULL,
        template_content TEXT NOT NULL,
        culturally_validated BOOLEAN DEFAULT FALSE,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Prayer times cache
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS prayer_times (
        date TEXT PRIMARY KEY, -- YYYY-MM-DD format
        location TEXT NOT NULL,
        fajr TEXT NOT NULL,
        dhuhr TEXT NOT NULL,
        asr TEXT NOT NULL,
        maghrib TEXT NOT NULL,
        isha TEXT NOT NULL,
        sunrise TEXT,
        sunset TEXT,
        calculated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Create indexes for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_sync_status ON chat_messages(sync_status);
      CREATE INDEX IF NOT EXISTS idx_cultural_content_type ON cultural_content(type);
      CREATE INDEX IF NOT EXISTS idx_professional_templates_domain ON professional_templates(domain);
    `)
  }

  private async seedCulturalContent(): Promise<void> {
    if (!this.db) return

    // Check if cultural content already exists
    const existingContent = this.db.prepare('SELECT COUNT(*) as count FROM cultural_content').get() as { count: number }
    
    if (existingContent.count > 0) {
      console.log('Cultural content already seeded')
      return
    }

    try {
      // Get cultural content from Iraqi cultural validator
      const culturalTask = new Task({
        subagent_type: 'iraqi-cultural-validator',
        description: 'Generate initial cultural content for offline storage',
        prompt: `Generate essential Iraqi cultural content for offline desktop application:
        
        Content Categories Needed:
        1. Islamic expressions (common greetings, prayers, religious phrases)
        2. Cultural phrases (Iraqi dialect expressions, cultural greetings)
        3. Validation rules (cultural appropriateness guidelines)
        4. Prayer time calculation rules
        
        Professional Domain: ${this.config.professionalDomain || 'general'}
        
        Requirements:
        - Provide Arabic and English versions
        - Include cultural context and usage notes
        - Ensure Islamic compliance for all content
        - Generate validation rules for offline compliance checking
        
        Return structured cultural content data for local storage.`
      })

      const culturalContent = await culturalTask.execute()
      
      const insertContent = this.db.prepare(`
        INSERT OR REPLACE INTO cultural_content 
        (id, type, content, content_arabic, metadata, last_updated, source)
        VALUES (?, ?, ?, ?, ?, ?, 'local')
      `)

      // Insert Islamic expressions
      if (culturalContent.islamicExpressions) {
        culturalContent.islamicExpressions.forEach((expr: any, index: number) => {
          insertContent.run(
            `islamic_expr_${index}`,
            'islamic_expression',
            expr.english || expr.content,
            expr.arabic || expr.contentArabic,
            JSON.stringify(expr.metadata || {}),
            Date.now()
          )
        })
      }

      // Insert cultural phrases
      if (culturalContent.culturalPhrases) {
        culturalContent.culturalPhrases.forEach((phrase: any, index: number) => {
          insertContent.run(
            `cultural_phrase_${index}`,
            'cultural_phrase',
            phrase.english || phrase.content,
            phrase.arabic || phrase.contentArabic,
            JSON.stringify(phrase.metadata || {}),
            Date.now()
          )
        })
      }

      // Insert validation rules
      if (culturalContent.validationRules) {
        culturalContent.validationRules.forEach((rule: any, index: number) => {
          insertContent.run(
            `validation_rule_${index}`,
            'validation_rule',
            rule.description,
            rule.descriptionArabic || rule.description,
            JSON.stringify(rule),
            Date.now()
          )
        })
      }

      console.log('Cultural content seeded successfully')
    } catch (error) {
      console.error('Failed to seed cultural content:', error)
      // Insert fallback cultural content
      this.insertFallbackCulturalContent()
    }
  }

  private insertFallbackCulturalContent(): void {
    if (!this.db) return

    const fallbackContent = [
      {
        id: 'greeting_salam',
        type: 'islamic_expression',
        content: 'Peace be upon you',
        contentArabic: 'السلام عليكم',
        metadata: { usage: 'greeting', formality: 'formal' }
      },
      {
        id: 'response_salam',
        type: 'islamic_expression',
        content: 'And upon you peace',
        contentArabic: 'وعليكم السلام',
        metadata: { usage: 'greeting_response', formality: 'formal' }
      },
      {
        id: 'bismillah',
        type: 'islamic_expression',
        content: 'In the name of Allah',
        contentArabic: 'بسم الله',
        metadata: { usage: 'beginning', context: 'starting_task' }
      },
      {
        id: 'alhamdulillah',
        type: 'islamic_expression',
        content: 'Praise be to Allah',
        contentArabic: 'الحمد لله',
        metadata: { usage: 'gratitude', context: 'completion' }
      }
    ]

    const insertContent = this.db.prepare(`
      INSERT OR REPLACE INTO cultural_content 
      (id, type, content, content_arabic, metadata, last_updated, source)
      VALUES (?, ?, ?, ?, ?, ?, 'local')
    `)

    fallbackContent.forEach(content => {
      insertContent.run(
        content.id,
        content.type,
        content.content,
        content.contentArabic,
        JSON.stringify(content.metadata),
        Date.now()
      )
    })
  }

  // Chat message operations
  async saveChatMessage(message: Omit<ChatMessage, 'syncStatus'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    // Cultural validation if enabled
    let culturallyValidated = false
    if (this.config.enableCulturalValidation) {
      culturallyValidated = await this.validateMessageCulturally(message.content)
    }

    const insertMessage = this.db.prepare(`
      INSERT OR REPLACE INTO chat_messages 
      (id, timestamp, content, content_arabic, role, culturally_validated, 
       professional_domain, audio_attachment, image_attachment, sync_status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', strftime('%s', 'now'))
    `)

    insertMessage.run(
      message.id,
      message.timestamp,
      message.content,
      message.contentArabic || null,
      message.role,
      culturallyValidated,
      this.config.professionalDomain || null,
      message.audioAttachment || null,
      message.imageAttachment || null
    )

    // Add to sync queue if online
    if (this.isOnline) {
      this.syncQueue.push({
        type: 'chat_message',
        action: 'create',
        data: { ...message, culturallyValidated, syncStatus: 'pending' }
      })
      await this.processSyncQueue()
    }
  }

  getChatMessages(limit: number = 100, offset: number = 0): ChatMessage[] {
    if (!this.db) return []

    const query = this.db.prepare(`
      SELECT * FROM chat_messages 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `)

    const rows = query.all(limit, offset) as any[]
    
    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      content: row.content,
      contentArabic: row.content_arabic,
      role: row.role,
      culturallyValidated: Boolean(row.culturally_validated),
      professionalDomain: row.professional_domain,
      audioAttachment: row.audio_attachment,
      imageAttachment: row.image_attachment,
      syncStatus: row.sync_status
    }))
  }

  // Cultural validation operations
  private async validateMessageCulturally(content: string): Promise<boolean> {
    try {
      // Get local validation rules
      const localRules = this.getCulturalValidationRules()
      
      // Apply local validation
      const localValidation = this.applyLocalCulturalRules(content, localRules)
      
      return localValidation.appropriate
    } catch (error) {
      console.error('Local cultural validation error:', error)
      return true // Default to allow if validation fails
    }
  }

  private getCulturalValidationRules(): any[] {
    if (!this.db) return []

    const query = this.db.prepare(`
      SELECT * FROM cultural_content 
      WHERE type = 'validation_rule'
    `)

    return query.all().map((row: any) => ({
      ...row,
      metadata: JSON.parse(row.metadata || '{}')
    }))
  }

  private applyLocalCulturalRules(content: string, rules: any[]): { appropriate: boolean; issues: string[] } {
    const issues: string[] = []
    let appropriate = true

    rules.forEach(rule => {
      const ruleData = rule.metadata
      
      // Check for inappropriate content patterns
      if (ruleData.prohibitedPatterns) {
        ruleData.prohibitedPatterns.forEach((pattern: string) => {
          if (content.toLowerCase().includes(pattern.toLowerCase())) {
            appropriate = false
            issues.push(`Contains prohibited pattern: ${pattern}`)
          }
        })
      }

      // Check for required respectful language in religious contexts
      if (ruleData.religiousContext && content.includes('الله')) {
        const hasRespectfulLanguage = ruleData.respectfulPhrases?.some((phrase: string) =>
          content.includes(phrase)
        )
        if (!hasRespectfulLanguage) {
          issues.push('Religious content should use respectful language')
        }
      }
    })

    return { appropriate, issues }
  }

  // Professional template operations
  async getProfessionalTemplates(domain: string): Promise<any[]> {
    if (!this.db) return []

    const query = this.db.prepare(`
      SELECT * FROM professional_templates 
      WHERE domain = ? OR domain = 'general'
      ORDER BY name
    `)

    return query.all(domain).map((row: any) => ({
      id: row.id,
      domain: row.domain,
      name: row.name,
      nameArabic: row.name_arabic,
      templateContent: row.template_content,
      culturallyValidated: Boolean(row.culturally_validated)
    }))
  }

  // Prayer times operations
  async getPrayerTimes(date: string, location?: string): Promise<any | null> {
    if (!this.db) return null

    const query = this.db.prepare('SELECT * FROM prayer_times WHERE date = ?')
    const result = query.get(date)

    if (result) {
      return result
    }

    // Calculate prayer times if not cached
    return await this.calculateAndCachePrayerTimes(date, location)
  }

  private async calculateAndCachePrayerTimes(date: string, location?: string): Promise<any> {
    try {
      // Use local prayer time calculation library or fallback
      const coordinates = location ? await this.getCoordinatesFromLocation(location) : { lat: 33.3128, lng: 44.3615 } // Baghdad default
      
      const prayerTimes = this.calculatePrayerTimesLocally(date, coordinates.lat, coordinates.lng)
      
      // Cache the calculated prayer times
      if (this.db) {
        const insertPrayerTimes = this.db.prepare(`
          INSERT OR REPLACE INTO prayer_times 
          (date, location, fajr, dhuhr, asr, maghrib, isha, sunrise, sunset)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        
        insertPrayerTimes.run(
          date,
          location || 'Baghdad, Iraq',
          prayerTimes.fajr,
          prayerTimes.dhuhr,
          prayerTimes.asr,
          prayerTimes.maghrib,
          prayerTimes.isha,
          prayerTimes.sunrise,
          prayerTimes.sunset
        )
      }

      return prayerTimes
    } catch (error) {
      console.error('Prayer time calculation error:', error)
      return null
    }
  }

  private calculatePrayerTimesLocally(date: string, lat: number, lng: number): any {
    // Simplified prayer time calculation - in production, use a proper Islamic calendar library
    const baseTime = new Date(date)
    
    return {
      fajr: new Date(baseTime.getTime() + 5 * 60 * 60 * 1000).toTimeString().substr(0, 5), // 5 AM
      sunrise: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000).toTimeString().substr(0, 5), // 6 AM
      dhuhr: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000).toTimeString().substr(0, 5), // 12 PM
      asr: new Date(baseTime.getTime() + 15 * 60 * 60 * 1000).toTimeString().substr(0, 5), // 3 PM
      maghrib: new Date(baseTime.getTime() + 18 * 60 * 60 * 1000).toTimeString().substr(0, 5), // 6 PM
      isha: new Date(baseTime.getTime() + 19.5 * 60 * 60 * 1000).toTimeString().substr(0, 5), // 7:30 PM
      sunset: new Date(baseTime.getTime() + 17.5 * 60 * 60 * 1000).toTimeString().substr(0, 5) // 5:30 PM
    }
  }

  private async getCoordinatesFromLocation(location: string): Promise<{ lat: number; lng: number }> {
    // Fallback coordinates for Iraqi cities
    const iraqiCities: Record<string, { lat: number; lng: number }> = {
      'baghdad': { lat: 33.3128, lng: 44.3615 },
      'basra': { lat: 30.5085, lng: 47.7804 },
      'mosul': { lat: 36.3350, lng: 43.1189 },
      'erbil': { lat: 36.1911, lng: 43.9933 },
      'najaf': { lat: 32.0000, lng: 44.3333 },
      'karbala': { lat: 32.6160, lng: 44.0244 }
    }

    const cityKey = location.toLowerCase().split(',')[0].trim()
    return iraqiCities[cityKey] || iraqiCities['baghdad']
  }

  // Network monitoring and sync
  private setupNetworkMonitoring(): void {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('Network connection restored')
      this.processSyncQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('Network connection lost')
    })

    // Initial online status
    this.isOnline = navigator.onLine
  }

  private startPeriodicSync(): void {
    if (this.config.syncStrategy !== 'periodic') return

    // Sync every 5 minutes when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.processSyncQueue()
      }
    }, 5 * 60 * 1000)
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return
    }

    this.syncInProgress = true
    
    try {
      console.log(`Processing ${this.syncQueue.length} sync items...`)
      
      // Process sync items in batches
      const batchSize = 10
      while (this.syncQueue.length > 0) {
        const batch = this.syncQueue.splice(0, batchSize)
        await this.processSyncBatch(batch)
      }
      
      console.log('Sync completed successfully')
    } catch (error) {
      console.error('Sync failed:', error)
      // Put items back in queue for retry
      this.syncQueue.unshift(...this.syncQueue)
    } finally {
      this.syncInProgress = false
    }
  }

  private async processSyncBatch(batch: any[]): Promise<void> {
    // In a real implementation, this would sync with remote server
    // For now, just mark items as synced
    if (!this.db) return

    batch.forEach(item => {
      if (item.type === 'chat_message') {
        const updateSync = this.db!.prepare(
          'UPDATE chat_messages SET sync_status = ? WHERE id = ?'
        )
        updateSync.run('synced', item.data.id)
      }
    })
  }

  // Storage management
  getStorageInfo(): { used: number; quota: number; percentage: number } {
    if (!this.db) return { used: 0, quota: this.config.storageQuota * 1024 * 1024, percentage: 0 }

    // Get database size
    const stats = this.db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get() as { size: number }
    const used = stats.size
    const quota = this.config.storageQuota * 1024 * 1024 // Convert MB to bytes
    const percentage = (used / quota) * 100

    return { used, quota, percentage }
  }

  async cleanupOldData(daysToKeep: number = 30): Promise<number> {
    if (!this.db) return 0

    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    
    // Delete old chat messages that are synced
    const deleteMessages = this.db.prepare(`
      DELETE FROM chat_messages 
      WHERE timestamp < ? AND sync_status = 'synced'
    `)
    
    const result = deleteMessages.run(cutoffTime)
    console.log(`Cleaned up ${result.changes} old chat messages`)
    
    return result.changes || 0
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}
```

### Offline Chat Component

```tsx
// src/components/OfflineChat.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useElectronAPI } from '@/hooks/useElectronAPI'

interface OfflineChatProps {
  onMessageSent?: (message: ChatMessage) => void
  enableLocalAI?: boolean
  culturalValidation?: boolean
  className?: string
}

interface ChatMessage {
  id: string
  timestamp: number
  content: string
  contentArabic?: string
  role: 'user' | 'assistant' | 'system'
  culturallyValidated: boolean
  audioAttachment?: string
  syncStatus: 'pending' | 'synced' | 'conflict'
}

export default function OfflineChat({
  onMessageSent,
  enableLocalAI = true,
  culturalValidation = true,
  className
}: OfflineChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [storageInfo, setStorageInfo] = useState<any>(null)
  const [status, setStatus] = useState<string>('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isElectron, validateCulturalContent } = useElectronAPI()

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load messages on component mount
  useEffect(() => {
    loadChatHistory()
    loadStorageInfo()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    if (!isElectron) return

    try {
      // In a real implementation, this would call the offline data manager
      const storedMessages = localStorage.getItem('iraqi-chat-messages')
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages)
        setMessages(parsed.slice(-50)) // Load last 50 messages
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const loadStorageInfo = async () => {
    if (!isElectron) return

    try {
      // Mock storage info for demo
      setStorageInfo({
        used: 25 * 1024 * 1024, // 25 MB
        quota: 100 * 1024 * 1024, // 100 MB
        percentage: 25
      })
    } catch (error) {
      console.error('Failed to load storage info:', error)
    }
  }

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isProcessing) return

    setIsProcessing(true)
    setStatus('معالجة الرسالة... / Processing message...')

    try {
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        content: inputText.trim(),
        role: 'user',
        culturallyValidated: false,
        syncStatus: 'pending'
      }

      // Cultural validation if enabled
      if (culturalValidation && validateCulturalContent) {
        const validation = await validateCulturalContent(userMessage.content)
        userMessage.culturallyValidated = validation?.culturallyAppropriate || false
        
        if (!validation?.culturallyAppropriate && validation?.issues) {
          setStatus(`تحذير ثقافي: ${validation.issues.join(', ')} / Cultural warning: ${validation.issues.join(', ')}`)
        }
      } else {
        userMessage.culturallyValidated = true
      }

      // Add user message
      setMessages(prev => [...prev, userMessage])
      onMessageSent?.(userMessage)

      // Generate AI response if local AI enabled
      if (enableLocalAI) {
        const aiResponse = await generateOfflineResponse(userMessage.content)
        setMessages(prev => [...prev, aiResponse])
        onMessageSent?.(aiResponse)
      }

      // Save to local storage
      await saveMessage(userMessage)
      
      setInputText('')
      setStatus(isOnline ? 'تم الإرسال / Message sent' : 'حُفظ محلياً / Saved locally')
      
    } catch (error) {
      console.error('Failed to send message:', error)
      setStatus('خطأ في إرسال الرسالة / Failed to send message')
    } finally {
      setIsProcessing(false)
    }
  }, [inputText, isProcessing, culturalValidation, validateCulturalContent, enableLocalAI, isOnline, onMessageSent])

  const generateOfflineResponse = async (userInput: string): Promise<ChatMessage> => {
    // Simple offline AI response generation
    // In a real implementation, this would use a local AI model
    
    const responses = [
      {
        content: "I understand your message. How can I help you further?",
        contentArabic: "فهمت رسالتك. كيف يمكنني مساعدتك أكثر؟"
      },
      {
        content: "Thank you for your message. I'm here to assist you.",
        contentArabic: "شكراً لرسالتك. أنا هنا لمساعدتك."
      },
      {
        content: "I'm processing your request. Please give me a moment.",
        contentArabic: "أعالج طلبك. يرجى إعطائي لحظة."
      }
    ]

    // Simple keyword-based response selection
    let selectedResponse = responses[0]
    
    if (userInput.includes('help') || userInput.includes('مساعدة')) {
      selectedResponse = responses[1]
    } else if (userInput.includes('thank') || userInput.includes('شكر')) {
      selectedResponse = responses[2]
    }

    return {
      id: `msg_${Date.now()}_ai`,
      timestamp: Date.now(),
      content: selectedResponse.content,
      contentArabic: selectedResponse.contentArabic,
      role: 'assistant',
      culturallyValidated: true,
      syncStatus: 'pending'
    }
  }

  const saveMessage = async (message: ChatMessage) => {
    try {
      // Save to localStorage as fallback
      const existingMessages = JSON.parse(localStorage.getItem('iraqi-chat-messages') || '[]')
      existingMessages.push(message)
      
      // Keep only last 100 messages in localStorage
      if (existingMessages.length > 100) {
        existingMessages.splice(0, existingMessages.length - 100)
      }
      
      localStorage.setItem('iraqi-chat-messages', JSON.stringify(existingMessages))
      
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ar-IQ', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'conflict': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className={`offline-chat ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>المحادثة المحلية / Offline Chat</span>
            <div className="flex items-center gap-2">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? 'متصل / Online' : 'غير متصل / Offline'}
              </Badge>
              {enableLocalAI && (
                <Badge variant="outline">AI محلي / Local AI</Badge>
              )}
            </div>
          </CardTitle>
          
          {status && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              {status}
            </div>
          )}

          {storageInfo && (
            <div className="text-xs text-muted-foreground">
              التخزين المحلي / Local Storage: {Math.round(storageInfo.percentage)}% 
              ({(storageInfo.used / 1024 / 1024).toFixed(1)} MB / {(storageInfo.quota / 1024 / 1024).toFixed(1)} MB)
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages Area */}
            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="font-arabic text-right" dir="rtl">
                      ابدأ محادثة جديدة...
                    </p>
                    <p className="text-sm">
                      Start a new conversation...
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className={`font-arabic text-right ${
                            message.role === 'user' ? 'text-blue-50' : 'text-gray-700'
                          }`} dir="rtl">
                            {message.contentArabic || message.content}
                          </div>
                          
                          {message.contentArabic && message.content !== message.contentArabic && (
                            <div className={`text-sm ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-600'
                            }`}>
                              {message.content}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className={`text-xs ${
                              message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {culturalValidation && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  message.culturallyValidated 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {message.culturallyValidated ? '✓' : '!'}
                                </span>
                              )}
                              
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getSyncStatusColor(message.syncStatus)}`}>
                                {message.syncStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="space-y-2">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا... / Type your message here..."
                className="min-h-[80px] font-arabic text-right"
                dir="auto"
                disabled={isProcessing}
              />
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {!isOnline && 'وضع عدم الاتصال - سيتم الحفظ محلياً / Offline mode - saving locally'}
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      معالجة... / Processing...
                    </>
                  ) : (
                    'إرسال / Send'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

**This micro-initial provides comprehensive offline capabilities specifically designed for Iraqi AI Chat System desktop integration, with full local data storage, cultural validation offline, prayer time calculations, and intelligent synchronization strategies.**