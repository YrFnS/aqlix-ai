/**
 * Iraqi AI Enhanced Multi-Workspace Management Service
 * Comprehensive workspace system with Iraqi cultural compliance and professional domain support
 * Enhanced from chatbot-ui with advanced features for Iraqi organizations
 */

import { Redis } from 'ioredis';
import { z } from 'zod';
import { EventEmitter } from 'events';

// Types
export type ProfessionalDomain = 
  | 'personal' | 'legal' | 'medical' | 'educational' 
  | 'business' | 'engineering' | 'government';

export type WorkspaceVisibility = 'private' | 'organization' | 'public' | 'government';
export type IraqiDialect = 'baghdadi' | 'basrawi' | 'moslawi' | 'southern' | 'kurdish_arab' | 'standard';
export type WorkspaceStatus = 'active' | 'suspended' | 'archived' | 'pending_approval' | 'under_review';
export type CulturalSensitivityLevel = 'low' | 'medium' | 'high' | 'maximum';
export type ComplianceStrictness = 'basic' | 'standard' | 'strict' | 'maximum';

export interface IraqiGovernorate {
  code: string;
  nameEn: string;
  nameAr: string;
  region: 'north' | 'center' | 'south';
}

export interface IraqiCulturalSettings {
  enableIslamicCompliance: boolean;
  strictnessLevel: ComplianceStrictness;
  prayerTimeReminders: boolean;
  hijriCalendarSupport: boolean;
  halalContentFilter: boolean;
  politicalNeutralityMode: boolean;
  sectarianContentFilter: boolean;
  culturalSensitivityLevel: CulturalSensitivityLevel;
  ramadanMode?: boolean;
  emergencyMode?: boolean;
  governmentMode?: boolean;
}

export interface WorkspaceLimits {
  maxMembers: number;
  maxFiles: number;
  maxFileSize: number; // MB
  maxStorageSize: number; // MB
  maxMessagesPerDay: number;
  rateLimitEnabled: boolean;
}

export interface IraqiWorkspace {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  avatar?: string;
  
  // Core properties
  type: ProfessionalDomain;
  ownerId: string;
  organizationId?: string;
  visibility: WorkspaceVisibility;
  
  // Iraqi-specific settings
  culturalSettings: IraqiCulturalSettings;
  arabicSupport: boolean;
  dialectPreference: IraqiDialect;
  rtlLayout: boolean;
  governorate?: IraqiGovernorate;
  
  // Professional domain settings
  professionalLicenseNumber?: string;
  organizationRegistration?: string;
  complianceRequirements: string[];
  specializations: string[];
  certificationLevel?: 'basic' | 'standard' | 'expert' | 'master';
  
  // Workspace configuration
  limits: WorkspaceLimits;
  allowGuestAccess: boolean;
  fileUploadEnabled: boolean;
  allowedFileTypes: string[];
  
  // Security settings
  encryptionEnabled: boolean;
  auditLoggingEnabled: boolean;
  twoFactorRequired: boolean;
  ipWhitelistEnabled: boolean;
  allowedIpRanges?: string[];
  
  // Status and metadata
  status: WorkspaceStatus;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
  archivedAt?: Date;
  
  // Usage statistics
  totalMessages: number;
  totalFiles: number;
  storageUsed: number; // MB
  activeMembers: number;
  monthlyActiveUsers: number;
  culturalComplianceScore: number; // 0-100
  
  // Features and integrations
  enabledFeatures: string[];
  integrations: WorkspaceIntegration[];
  customFields?: Record<string, any>;
  
  // Billing and subscription
  subscriptionTier?: 'free' | 'basic' | 'professional' | 'enterprise' | 'government';
  billingCycle?: 'monthly' | 'yearly';
  subscriptionExpiresAt?: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest' | 'consultant';
  permissions: string[];
  invitedBy: string;
  joinedAt: Date;
  lastActiveAt: Date;
  
  // Iraqi-specific member properties
  culturalComplianceLevel: number; // 0-100
  arabicProficiency: 'none' | 'basic' | 'intermediate' | 'advanced' | 'native';
  professionalCertifications: string[];
  governorate?: IraqiGovernorate;
  
  // Security and access
  accessLevel: 'read' | 'write' | 'admin' | 'owner';
  ipRestrictions?: string[];
  sessionTimeout?: number; // minutes
  lastLoginAt?: Date;
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  suspendedUntil?: Date;
  suspensionReason?: string;
}

export interface WorkspaceIntegration {
  id: string;
  type: 'payment' | 'calendar' | 'document' | 'communication' | 'analytics';
  service: 'zaincash' | 'fastpay' | 'nasswallet' | 'google_calendar' | 'outlook' | 'teams';
  enabled: boolean;
  config: Record<string, any>;
  lastSync?: Date;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  inviterUserId: string;
  inviteeEmail: string;
  role: string;
  permissions: string[];
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  culturalOnboardingRequired: boolean;
  professionalVerificationRequired: boolean;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
  message?: string;
  messageAr?: string;
}

export interface WorkspaceTemplate {
  id: string;
  name: string;
  nameAr: string;
  type: ProfessionalDomain;
  description: string;
  descriptionAr: string;
  features: string[];
  culturalSettings: IraqiCulturalSettings;
  limits: WorkspaceLimits;
  requiredCertifications?: string[];
  estimatedSetupTime: number; // minutes
}

// Validation Schemas
const IraqiGovernorateSchema = z.object({
  code: z.string(),
  nameEn: z.string(),
  nameAr: z.string(),
  region: z.enum(['north', 'center', 'south'])
});

const IraqiCulturalSettingsSchema = z.object({
  enableIslamicCompliance: z.boolean(),
  strictnessLevel: z.enum(['basic', 'standard', 'strict', 'maximum']),
  prayerTimeReminders: z.boolean(),
  hijriCalendarSupport: z.boolean().default(true),
  halalContentFilter: z.boolean(),
  politicalNeutralityMode: z.boolean(),
  sectarianContentFilter: z.boolean(),
  culturalSensitivityLevel: z.enum(['low', 'medium', 'high', 'maximum']),
  ramadanMode: z.boolean().optional(),
  emergencyMode: z.boolean().optional(),
  governmentMode: z.boolean().optional()
});

const WorkspaceLimitsSchema = z.object({
  maxMembers: z.number().min(1).max(10000),
  maxFiles: z.number().min(0),
  maxFileSize: z.number().min(1), // MB
  maxStorageSize: z.number().min(100), // MB
  maxMessagesPerDay: z.number().min(10),
  rateLimitEnabled: z.boolean()
});

const WorkspaceCreateSchema = z.object({
  name: z.string().min(1).max(100),
  nameAr: z.string().min(1).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  descriptionAr: z.string().max(500).optional(),
  type: z.enum(['personal', 'legal', 'medical', 'educational', 'business', 'engineering', 'government']),
  visibility: z.enum(['private', 'organization', 'public', 'government']),
  culturalSettings: IraqiCulturalSettingsSchema,
  arabicSupport: z.boolean(),
  dialectPreference: z.enum(['baghdadi', 'basrawi', 'moslawi', 'southern', 'kurdish_arab', 'standard']),
  governorate: IraqiGovernorateSchema.optional(),
  professionalLicenseNumber: z.string().optional(),
  organizationRegistration: z.string().optional(),
  complianceRequirements: z.array(z.string()),
  specializations: z.array(z.string()),
  limits: WorkspaceLimitsSchema.optional()
});

export class IraqiWorkspaceManager extends EventEmitter {
  private redis: Redis;
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly SLUG_CACHE_TTL = 86400; // 24 hours
  
  // Workspace limits by type
  private readonly MAX_WORKSPACES_PER_USER = {
    personal: 5,
    legal: 10,
    medical: 10,
    educational: 15,
    business: 20,
    engineering: 15,
    government: 5
  };
  
  // Iraqi Governorates
  private readonly IRAQI_GOVERNORATES: IraqiGovernorate[] = [
    { code: 'BGD', nameEn: 'Baghdad', nameAr: 'بغداد', region: 'center' },
    { code: 'BSR', nameEn: 'Basra', nameAr: 'البصرة', region: 'south' },
    { code: 'MSL', nameEn: 'Mosul', nameAr: 'الموصل', region: 'north' },
    { code: 'ERB', nameEn: 'Erbil', nameAr: 'اربیل', region: 'north' },
    { code: 'NJF', nameEn: 'Najaf', nameAr: 'النجف', region: 'center' },
    { code: 'KRB', nameEn: 'Karbala', nameAr: 'كربلاء', region: 'center' },
    { code: 'SUL', nameEn: 'Sulaymaniyah', nameAr: 'السليمانية', region: 'north' },
    { code: 'DHK', nameEn: 'Dohuk', nameAr: 'دهوك', region: 'north' },
    { code: 'KRK', nameEn: 'Kirkuk', nameAr: 'كركوك', region: 'north' },
    { code: 'ANB', nameEn: 'Anbar', nameAr: 'الأنبار', region: 'center' },
    { code: 'DYL', nameEn: 'Diyala', nameAr: 'ديالى', region: 'center' },
    { code: 'BAB', nameEn: 'Babylon', nameAr: 'بابل', region: 'center' },
    { code: 'WAS', nameEn: 'Wasit', nameAr: 'واسط', region: 'center' },
    { code: 'MAY', nameEn: 'Maysan', nameAr: 'ميسان', region: 'south' },
    { code: 'THI', nameEn: 'Dhi Qar', nameAr: 'ذي قار', region: 'south' },
    { code: 'MUT', nameEn: 'Muthanna', nameAr: 'المثنى', region: 'south' },
    { code: 'QAD', nameEn: 'Qadisiyyah', nameAr: 'القادسية', region: 'center' },
    { code: 'SAL', nameEn: 'Saladin', nameAr: 'صلاح الدين', region: 'center' }
  ];

  constructor(redisUrl: string) {
    super();
    this.redis = new Redis(redisUrl);
    this.setupEventHandlers();
  }
  
  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      console.log('Iraqi Workspace Manager connected to Redis');
      this.emit('connected');
    });
    
    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
      this.emit('error', error);
    });
  }

  // ====================== Workspace Creation ======================

  async createWorkspace(ownerId: string, workspaceData: z.infer<typeof WorkspaceCreateSchema>): Promise<IraqiWorkspace> {
    // Validate input data
    const validatedData = WorkspaceCreateSchema.parse(workspaceData);
    
    // Check if slug is available
    if (await this.isSlugTaken(validatedData.slug)) {
      throw new Error('Workspace slug is already taken');
    }
    
    // Check workspace limits
    const userWorkspaces = await this.getUserWorkspaces(ownerId);
    const typeCount = userWorkspaces.filter(w => w.type === validatedData.type).length;
    
    if (typeCount >= this.MAX_WORKSPACES_PER_USER[validatedData.type]) {
      throw new Error(`Maximum ${validatedData.type} workspaces (${this.MAX_WORKSPACES_PER_USER[validatedData.type]}) reached`);
    }

    // Generate workspace ID
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get default limits if not provided
    const limits = validatedData.limits || this.getDefaultLimits(validatedData.type);

    // Create workspace object
    const workspace: IraqiWorkspace = {
      id: workspaceId,
      name: validatedData.name,
      nameAr: validatedData.nameAr,
      slug: validatedData.slug,
      description: validatedData.description,
      descriptionAr: validatedData.descriptionAr,
      type: validatedData.type,
      ownerId,
      visibility: validatedData.visibility,
      
      // Iraqi-specific settings
      culturalSettings: validatedData.culturalSettings,
      arabicSupport: validatedData.arabicSupport,
      dialectPreference: validatedData.dialectPreference,
      rtlLayout: validatedData.arabicSupport,
      governorate: validatedData.governorate,
      
      // Professional settings
      professionalLicenseNumber: validatedData.professionalLicenseNumber,
      organizationRegistration: validatedData.organizationRegistration,
      complianceRequirements: validatedData.complianceRequirements,
      specializations: validatedData.specializations,
      certificationLevel: this.inferCertificationLevel(validatedData.specializations),
      
      // Configuration
      limits,
      allowGuestAccess: this.getAllowGuestAccess(validatedData.type, validatedData.visibility),
      fileUploadEnabled: true,
      allowedFileTypes: this.getDefaultAllowedFileTypes(validatedData.type),
      
      // Security settings
      encryptionEnabled: this.requiresEncryption(validatedData.type),
      auditLoggingEnabled: this.requiresAuditLogging(validatedData.type),
      twoFactorRequired: this.requiresTwoFactor(validatedData.type),
      ipWhitelistEnabled: validatedData.type === 'government',
      
      // Status and timestamps
      status: this.requiresApproval(validatedData.type) ? 'pending_approval' : 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      
      // Usage stats
      totalMessages: 0,
      totalFiles: 0,
      storageUsed: 0,
      activeMembers: 1,
      monthlyActiveUsers: 1,
      culturalComplianceScore: 85, // Default score
      
      // Features and integrations
      enabledFeatures: this.getDefaultFeatures(validatedData.type),
      integrations: [],
      
      // Subscription
      subscriptionTier: this.getDefaultSubscriptionTier(validatedData.type),
      billingCycle: 'monthly'
    };

    // Store workspace in Redis
    await this.redis.hset(`workspace:${workspaceId}`, this.serializeWorkspace(workspace));
    
    // Reserve slug
    await this.redis.setex(`slug:${validatedData.slug}`, this.SLUG_CACHE_TTL, workspaceId);
    
    // Add to user's workspace list
    await this.redis.sadd(`user:${ownerId}:workspaces`, workspaceId);
    
    // Add to type index
    await this.redis.sadd(`workspaces:type:${validatedData.type}`, workspaceId);
    
    // Add to visibility index
    await this.redis.sadd(`workspaces:visibility:${validatedData.visibility}`, workspaceId);
    
    // Add owner as workspace member
    await this.addMember(workspaceId, {
      userId: ownerId,
      role: 'owner',
      permissions: ['all'],
      culturalComplianceLevel: 100,
      arabicProficiency: 'native',
      accessLevel: 'owner'
    });

    // Cache the workspace
    await this.cacheWorkspace(workspace);

    // Validate cultural compliance if required
    if (workspace.culturalSettings.enableIslamicCompliance) {
      await this.validateWorkspaceCulturalCompliance(workspace);
    }

    // Emit event
    this.emit('workspaceCreated', {
      workspaceId: workspace.id,
      ownerId,
      type: workspace.type,
      culturalSettings: workspace.culturalSettings
    });

    return workspace;
  }

  // ====================== Workspace Retrieval ======================

  async getWorkspace(workspaceId: string): Promise<IraqiWorkspace | null> {
    // Try cache first
    const cached = await this.redis.get(`cache:workspace:${workspaceId}`);
    if (cached) {
      return this.deserializeWorkspace(JSON.parse(cached));
    }

    // Get from database
    const workspaceData = await this.redis.hgetall(`workspace:${workspaceId}`);
    if (!workspaceData || Object.keys(workspaceData).length === 0) {
      return null;
    }

    const workspace = this.deserializeWorkspace(workspaceData);
    
    // Update cache
    await this.cacheWorkspace(workspace);
    
    // Update last accessed timestamp
    await this.updateLastAccessed(workspaceId);
    
    return workspace;
  }

  async getWorkspaceBySlug(slug: string): Promise<IraqiWorkspace | null> {
    const workspaceId = await this.redis.get(`slug:${slug}`);
    if (!workspaceId) {
      return null;
    }
    
    return this.getWorkspace(workspaceId);
  }

  async getUserWorkspaces(userId: string, filters?: {
    type?: ProfessionalDomain;
    status?: WorkspaceStatus;
    visibility?: WorkspaceVisibility;
  }): Promise<IraqiWorkspace[]> {
    const workspaceIds = await this.redis.smembers(`user:${userId}:workspaces`);
    let workspaces = await Promise.all(
      workspaceIds.map(id => this.getWorkspace(id))
    );
    
    // Filter out null results
    workspaces = workspaces.filter(Boolean) as IraqiWorkspace[];
    
    // Apply filters
    if (filters) {
      if (filters.type) {
        workspaces = workspaces.filter(w => w.type === filters.type);
      }
      if (filters.status) {
        workspaces = workspaces.filter(w => w.status === filters.status);
      }
      if (filters.visibility) {
        workspaces = workspaces.filter(w => w.visibility === filters.visibility);
      }
    }
    
    // Sort by last accessed
    workspaces.sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime());
    
    return workspaces;
  }

  async getWorkspacesByType(type: ProfessionalDomain, options?: {
    visibility?: WorkspaceVisibility[];
    limit?: number;
    offset?: number;
  }): Promise<IraqiWorkspace[]> {
    const workspaceIds = await this.redis.smembers(`workspaces:type:${type}`);
    let workspaces = await Promise.all(
      workspaceIds.map(id => this.getWorkspace(id))
    );
    
    workspaces = workspaces.filter(Boolean) as IraqiWorkspace[];
    
    // Filter by visibility
    if (options?.visibility) {
      workspaces = workspaces.filter(w => options.visibility!.includes(w.visibility));
    }
    
    // Sort by creation date (newest first)
    workspaces.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Apply pagination
    if (options?.offset || options?.limit) {
      const offset = options.offset || 0;
      const limit = options.limit || 50;
      workspaces = workspaces.slice(offset, offset + limit);
    }
    
    return workspaces;
  }

  // ====================== Workspace Management ======================

  async updateWorkspace(workspaceId: string, updates: Partial<IraqiWorkspace>, userId: string): Promise<IraqiWorkspace> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Check permissions
    if (!await this.canUserEditWorkspace(userId, workspaceId)) {
      throw new Error('Insufficient permissions to edit workspace');
    }

    // Handle slug changes
    if (updates.slug && updates.slug !== workspace.slug) {
      if (await this.isSlugTaken(updates.slug)) {
        throw new Error('New slug is already taken');
      }
      
      // Remove old slug mapping
      await this.redis.del(`slug:${workspace.slug}`);
      
      // Add new slug mapping
      await this.redis.setex(`slug:${updates.slug}`, this.SLUG_CACHE_TTL, workspaceId);
    }

    // Apply updates
    const updatedWorkspace: IraqiWorkspace = {
      ...workspace,
      ...updates,
      updatedAt: new Date()
    };

    // Validate cultural settings if updated
    if (updates.culturalSettings) {
      IraqiCulturalSettingsSchema.parse(updates.culturalSettings);
      await this.validateWorkspaceCulturalCompliance(updatedWorkspace);
    }

    // Store updates
    await this.redis.hset(`workspace:${workspaceId}`, this.serializeWorkspace(updatedWorkspace));
    
    // Update cache
    await this.cacheWorkspace(updatedWorkspace);
    
    // Update indexes if type changed
    if (updates.type && updates.type !== workspace.type) {
      await this.redis.srem(`workspaces:type:${workspace.type}`, workspaceId);
      await this.redis.sadd(`workspaces:type:${updates.type}`, workspaceId);
    }
    
    // Update visibility index if changed
    if (updates.visibility && updates.visibility !== workspace.visibility) {
      await this.redis.srem(`workspaces:visibility:${workspace.visibility}`, workspaceId);
      await this.redis.sadd(`workspaces:visibility:${updates.visibility}`, workspaceId);
    }

    // Emit event
    this.emit('workspaceUpdated', {
      workspaceId,
      userId,
      changes: Object.keys(updates)
    });

    return updatedWorkspace;
  }

  async archiveWorkspace(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Only owner can archive workspace
    if (workspace.ownerId !== userId) {
      throw new Error('Only workspace owner can archive workspace');
    }

    await this.updateWorkspace(workspaceId, {
      status: 'archived',
      archivedAt: new Date()
    }, userId);

    this.emit('workspaceArchived', { workspaceId, userId });
    
    return true;
  }

  async deleteWorkspace(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Only owner can delete workspace
    if (workspace.ownerId !== userId) {
      throw new Error('Only workspace owner can delete workspace');
    }

    // Remove all members
    const members = await this.getWorkspaceMembers(workspaceId);
    await Promise.all(
      members.map(member => this.removeMember(workspaceId, member.userId))
    );

    // Clean up data
    await Promise.all([
      this.redis.del(`workspace:${workspaceId}`),
      this.redis.del(`workspace:${workspaceId}:files`),
      this.redis.del(`workspace:${workspaceId}:invitations`),
      this.redis.del(`slug:${workspace.slug}`),
      this.redis.del(`cache:workspace:${workspaceId}`),
      this.redis.srem(`user:${userId}:workspaces`, workspaceId),
      this.redis.srem(`workspaces:type:${workspace.type}`, workspaceId),
      this.redis.srem(`workspaces:visibility:${workspace.visibility}`, workspaceId)
    ]);

    this.emit('workspaceDeleted', { workspaceId, userId });

    return true;
  }

  // ====================== Member Management ======================

  async addMember(workspaceId: string, memberData: {
    userId: string;
    role: string;
    permissions: string[];
    culturalComplianceLevel: number;
    arabicProficiency: string;
    accessLevel: string;
    professionalCertifications?: string[];
    governorate?: IraqiGovernorate;
  }): Promise<WorkspaceMember> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Check member limits
    if (workspace.activeMembers >= workspace.limits.maxMembers) {
      throw new Error('Workspace member limit reached');
    }

    const member: WorkspaceMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workspaceId,
      userId: memberData.userId,
      role: memberData.role as any,
      permissions: memberData.permissions,
      invitedBy: workspace.ownerId,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      culturalComplianceLevel: memberData.culturalComplianceLevel,
      arabicProficiency: memberData.arabicProficiency as any,
      professionalCertifications: memberData.professionalCertifications || [],
      governorate: memberData.governorate,
      accessLevel: memberData.accessLevel as any,
      status: 'active'
    };

    // Store member
    await this.redis.hset(`workspace:${workspaceId}:member:${memberData.userId}`, this.serializeMember(member));
    
    // Add to user's workspace list
    await this.redis.sadd(`user:${memberData.userId}:workspaces`, workspaceId);
    
    // Update workspace member count
    await this.redis.hincrby(`workspace:${workspaceId}`, 'activeMembers', 1);

    this.emit('memberAdded', { workspaceId, userId: memberData.userId, role: memberData.role });

    return member;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const pattern = `workspace:${workspaceId}:member:*`;
    const keys = await this.redis.keys(pattern);
    
    const members = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redis.hgetall(key);
        return this.deserializeMember(data);
      })
    );

    return members.sort((a, b) => {
      // Sort by role priority: owner, admin, editor, viewer, guest
      const rolePriority = { owner: 5, admin: 4, editor: 3, viewer: 2, guest: 1, consultant: 1 };
      return (rolePriority[b.role] || 0) - (rolePriority[a.role] || 0);
    });
  }

  async updateMember(workspaceId: string, userId: string, updates: Partial<WorkspaceMember>, updatedBy: string): Promise<WorkspaceMember> {
    const memberData = await this.redis.hgetall(`workspace:${workspaceId}:member:${userId}`);
    if (!memberData) {
      throw new Error('Member not found');
    }

    // Check permissions
    if (!await this.canUserEditWorkspace(updatedBy, workspaceId)) {
      throw new Error('Insufficient permissions to update member');
    }

    const member = this.deserializeMember(memberData);
    const updatedMember: WorkspaceMember = {
      ...member,
      ...updates
    };

    await this.redis.hset(`workspace:${workspaceId}:member:${userId}`, this.serializeMember(updatedMember));

    this.emit('memberUpdated', { workspaceId, userId, updatedBy, changes: Object.keys(updates) });

    return updatedMember;
  }

  async removeMember(workspaceId: string, userId: string, removedBy?: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Can't remove owner
    if (workspace.ownerId === userId) {
      throw new Error('Cannot remove workspace owner');
    }

    // Remove member data
    await this.redis.del(`workspace:${workspaceId}:member:${userId}`);
    
    // Remove from user's workspace list
    await this.redis.srem(`user:${userId}:workspaces`, workspaceId);
    
    // Update workspace member count
    await this.redis.hincrby(`workspace:${workspaceId}`, 'activeMembers', -1);

    this.emit('memberRemoved', { workspaceId, userId, removedBy });

    return true;
  }

  // ====================== Permission Management ======================

  async canUserAccessWorkspace(userId: string, workspaceId: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) return false;

    // Owner always has access
    if (workspace.ownerId === userId) return true;

    // Check if user is a member
    const memberExists = await this.redis.exists(`workspace:${workspaceId}:member:${userId}`);
    if (memberExists) return true;

    // Check if workspace allows guest access
    if (workspace.allowGuestAccess && (workspace.visibility === 'public' || workspace.visibility === 'organization')) {
      return true;
    }

    return false;
  }

  async canUserEditWorkspace(userId: string, workspaceId: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) return false;

    // Owner can always edit
    if (workspace.ownerId === userId) return true;

    // Check member permissions
    const memberData = await this.redis.hgetall(`workspace:${workspaceId}:member:${userId}`);
    if (!memberData) return false;

    const member = this.deserializeMember(memberData);
    return member.role === 'admin' || member.role === 'editor';
  }

  async getUserPermissions(userId: string, workspaceId: string): Promise<string[]> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) return [];

    // Owner has all permissions
    if (workspace.ownerId === userId) {
      return ['all', 'read', 'write', 'admin', 'invite', 'delete', 'manage_members', 'manage_settings'];
    }

    // Get member permissions
    const memberData = await this.redis.hgetall(`workspace:${workspaceId}:member:${userId}`);
    if (!memberData) {
      return workspace.allowGuestAccess ? ['read'] : [];
    }

    const member = this.deserializeMember(memberData);
    return member.permissions;
  }

  // ====================== Cultural Compliance ======================

  private async validateWorkspaceCulturalCompliance(workspace: IraqiWorkspace): Promise<void> {
    const { culturalSettings } = workspace;
    
    // Validate Islamic compliance
    if (culturalSettings.enableIslamicCompliance) {
      // Check workspace name for inappropriate content
      if (await this.containsInappropriateContent(workspace.name, 'en')) {
        throw new Error('Workspace name contains culturally inappropriate content');
      }
      
      if (workspace.nameAr && await this.containsInappropriateContent(workspace.nameAr, 'ar')) {
        throw new Error('Arabic workspace name contains culturally inappropriate content');
      }
    }

    // Validate professional domain compliance
    if (['legal', 'medical', 'government'].includes(workspace.type)) {
      if (!workspace.professionalLicenseNumber) {
        throw new Error(`${workspace.type} workspaces require professional license number`);
      }
    }
  }

  private async containsInappropriateContent(text: string, language: 'ar' | 'en'): Promise<boolean> {
    // This would call the iraqi-cultural-validator agent in production
    const inappropriateKeywords = {
      ar: ['محتوى غير مناسب', 'كلمات مسيئة', 'محتوى محظور'],
      en: ['inappropriate', 'offensive', 'banned']
    };

    const keywords = inappropriateKeywords[language];
    return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  }

  // ====================== Workspace Templates ======================

  getWorkspaceTemplates(): WorkspaceTemplate[] {
    return [
      {
        id: 'legal_firm',
        name: 'Law Firm',
        nameAr: 'مكتب محاماة',
        type: 'legal',
        description: 'Complete legal practice management',
        descriptionAr: 'إدارة شاملة للممارسة القانونية',
        features: [
          'case_management', 'client_consultation', 'document_templates',
          'court_calendar', 'billing', 'legal_research'
        ],
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: 'strict',
          prayerTimeReminders: true,
          hijriCalendarSupport: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: 'maximum'
        },
        limits: {
          maxMembers: 25,
          maxFiles: 10000,
          maxFileSize: 500,
          maxStorageSize: 50000,
          maxMessagesPerDay: 1000,
          rateLimitEnabled: true
        },
        requiredCertifications: ['Iraqi Bar Association Membership'],
        estimatedSetupTime: 30
      },
      {
        id: 'medical_clinic',
        name: 'Medical Clinic',
        nameAr: 'عيادة طبية',
        type: 'medical',
        description: 'Comprehensive healthcare management',
        descriptionAr: 'إدارة شاملة للرعاية الصحية',
        features: [
          'patient_records', 'appointment_scheduling', 'prescription_management',
          'medical_imaging', 'telemedicine', 'insurance_claims'
        ],
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: 'strict',
          prayerTimeReminders: true,
          hijriCalendarSupport: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: false,
          culturalSensitivityLevel: 'high'
        },
        limits: {
          maxMembers: 20,
          maxFiles: 15000,
          maxFileSize: 200,
          maxStorageSize: 100000,
          maxMessagesPerDay: 800,
          rateLimitEnabled: true
        },
        requiredCertifications: ['Iraqi Medical Association License'],
        estimatedSetupTime: 45
      }
    ];
  }

  async createWorkspaceFromTemplate(templateId: string, ownerId: string, customization: {
    name: string;
    nameAr: string;
    slug: string;
    governorate?: IraqiGovernorate;
    professionalLicenseNumber?: string;
  }): Promise<IraqiWorkspace> {
    const template = this.getWorkspaceTemplates().find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const workspaceData = {
      name: customization.name,
      nameAr: customization.nameAr,
      slug: customization.slug,
      type: template.type,
      visibility: 'organization' as WorkspaceVisibility,
      culturalSettings: template.culturalSettings,
      arabicSupport: true,
      dialectPreference: 'standard' as IraqiDialect,
      governorate: customization.governorate,
      professionalLicenseNumber: customization.professionalLicenseNumber,
      complianceRequirements: template.requiredCertifications || [],
      specializations: [],
      limits: template.limits
    };

    return this.createWorkspace(ownerId, workspaceData);
  }

  // ====================== Utility Methods ======================

  private async isSlugTaken(slug: string): Promise<boolean> {
    const exists = await this.redis.exists(`slug:${slug}`);
    return exists === 1;
  }

  private async updateLastAccessed(workspaceId: string): Promise<void> {
    await this.redis.hset(`workspace:${workspaceId}`, 'lastAccessedAt', new Date().toISOString());
  }

  private async cacheWorkspace(workspace: IraqiWorkspace): Promise<void> {
    await this.redis.setex(
      `cache:workspace:${workspace.id}`,
      this.CACHE_TTL,
      JSON.stringify(this.serializeWorkspace(workspace))
    );
  }

  private getAllowGuestAccess(type: ProfessionalDomain, visibility: WorkspaceVisibility): boolean {
    if (visibility === 'private') return false;
    if (type === 'government') return false;
    return ['business', 'educational'].includes(type);
  }

  private requiresEncryption(type: ProfessionalDomain): boolean {
    return ['legal', 'medical', 'government'].includes(type);
  }

  private requiresAuditLogging(type: ProfessionalDomain): boolean {
    return ['legal', 'medical', 'government'].includes(type);
  }

  private requiresTwoFactor(type: ProfessionalDomain): boolean {
    return ['government'].includes(type);
  }

  private requiresApproval(type: ProfessionalDomain): boolean {
    return ['legal', 'medical', 'government'].includes(type);
  }

  private getDefaultLimits(type: ProfessionalDomain): WorkspaceLimits {
    const limits = {
      personal: { maxMembers: 5, maxFiles: 1000, maxFileSize: 50, maxStorageSize: 5000, maxMessagesPerDay: 200, rateLimitEnabled: true },
      legal: { maxMembers: 25, maxFiles: 10000, maxFileSize: 500, maxStorageSize: 50000, maxMessagesPerDay: 1000, rateLimitEnabled: true },
      medical: { maxMembers: 20, maxFiles: 15000, maxFileSize: 200, maxStorageSize: 100000, maxMessagesPerDay: 800, rateLimitEnabled: true },
      educational: { maxMembers: 100, maxFiles: 20000, maxFileSize: 100, maxStorageSize: 200000, maxMessagesPerDay: 2000, rateLimitEnabled: true },
      business: { maxMembers: 50, maxFiles: 8000, maxFileSize: 200, maxStorageSize: 80000, maxMessagesPerDay: 1500, rateLimitEnabled: true },
      engineering: { maxMembers: 30, maxFiles: 12000, maxFileSize: 1000, maxStorageSize: 150000, maxMessagesPerDay: 1200, rateLimitEnabled: true },
      government: { maxMembers: 15, maxFiles: 25000, maxFileSize: 1000, maxStorageSize: 500000, maxMessagesPerDay: 500, rateLimitEnabled: true }
    };
    return limits[type];
  }

  private getDefaultAllowedFileTypes(type: ProfessionalDomain): string[] {
    const common = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    const typeSpecific = {
      personal: [...common, 'jpg', 'png', 'gif'],
      legal: [...common, 'html', 'xml', 'odt'],
      medical: [...common, 'dcm', 'nii', 'jpg', 'png', 'tiff', 'dicom'],
      educational: [...common, 'ppt', 'pptx', 'xls', 'xlsx', 'mp4', 'mp3', 'avi', 'mov'],
      business: [...common, 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'json'],
      engineering: [...common, 'dwg', 'dxf', 'step', 'iges', 'stl', 'obj', 'cad'],
      government: [...common, 'html', 'xml', 'csv', 'json', 'zip']
    };
    return typeSpecific[type];
  }

  private getDefaultFeatures(type: ProfessionalDomain): string[] {
    const features = {
      personal: ['chat', 'file_sharing', 'basic_analytics'],
      legal: ['chat', 'case_management', 'document_templates', 'calendar_integration', 'billing', 'audit_logs'],
      medical: ['chat', 'patient_records', 'appointment_scheduling', 'telemedicine', 'prescription_management', 'hipaa_compliance'],
      educational: ['chat', 'course_management', 'student_tracking', 'grading', 'calendar_integration', 'collaboration_tools'],
      business: ['chat', 'project_management', 'crm_integration', 'invoicing', 'team_collaboration', 'analytics'],
      engineering: ['chat', 'project_management', 'cad_integration', 'version_control', 'technical_documentation', 'safety_compliance'],
      government: ['chat', 'document_management', 'approval_workflows', 'audit_trails', 'compliance_reporting', 'security_controls']
    };
    return features[type];
  }

  private getDefaultSubscriptionTier(type: ProfessionalDomain): 'free' | 'basic' | 'professional' | 'enterprise' | 'government' {
    const tiers = {
      personal: 'free' as const,
      legal: 'professional' as const,
      medical: 'professional' as const,
      educational: 'basic' as const,
      business: 'professional' as const,
      engineering: 'professional' as const,
      government: 'government' as const
    };
    return tiers[type];
  }

  private inferCertificationLevel(specializations: string[]): 'basic' | 'standard' | 'expert' | 'master' {
    if (specializations.length === 0) return 'basic';
    if (specializations.length <= 2) return 'standard';
    if (specializations.length <= 4) return 'expert';
    return 'master';
  }

  private serializeWorkspace(workspace: IraqiWorkspace): Record<string, string> {
    return {
      ...workspace,
      culturalSettings: JSON.stringify(workspace.culturalSettings),
      limits: JSON.stringify(workspace.limits),
      complianceRequirements: JSON.stringify(workspace.complianceRequirements),
      specializations: JSON.stringify(workspace.specializations),
      allowedFileTypes: JSON.stringify(workspace.allowedFileTypes),
      enabledFeatures: JSON.stringify(workspace.enabledFeatures),
      integrations: JSON.stringify(workspace.integrations),
      customFields: workspace.customFields ? JSON.stringify(workspace.customFields) : '',
      governorate: workspace.governorate ? JSON.stringify(workspace.governorate) : '',
      allowedIpRanges: workspace.allowedIpRanges ? JSON.stringify(workspace.allowedIpRanges) : '',
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
      lastAccessedAt: workspace.lastAccessedAt.toISOString(),
      archivedAt: workspace.archivedAt?.toISOString() || '',
      subscriptionExpiresAt: workspace.subscriptionExpiresAt?.toISOString() || ''
    };
  }

  private deserializeWorkspace(data: any): IraqiWorkspace {
    return {
      ...data,
      culturalSettings: typeof data.culturalSettings === 'string' 
        ? JSON.parse(data.culturalSettings) 
        : data.culturalSettings,
      limits: typeof data.limits === 'string'
        ? JSON.parse(data.limits)
        : data.limits,
      complianceRequirements: typeof data.complianceRequirements === 'string'
        ? JSON.parse(data.complianceRequirements)
        : data.complianceRequirements,
      specializations: typeof data.specializations === 'string'
        ? JSON.parse(data.specializations)
        : data.specializations,
      allowedFileTypes: typeof data.allowedFileTypes === 'string'
        ? JSON.parse(data.allowedFileTypes)
        : data.allowedFileTypes,
      enabledFeatures: typeof data.enabledFeatures === 'string'
        ? JSON.parse(data.enabledFeatures)
        : data.enabledFeatures,
      integrations: typeof data.integrations === 'string'
        ? JSON.parse(data.integrations)
        : data.integrations,
      customFields: data.customFields && typeof data.customFields === 'string'
        ? JSON.parse(data.customFields)
        : data.customFields,
      governorate: data.governorate && typeof data.governorate === 'string'
        ? JSON.parse(data.governorate)
        : data.governorate,
      allowedIpRanges: data.allowedIpRanges && typeof data.allowedIpRanges === 'string'
        ? JSON.parse(data.allowedIpRanges)
        : data.allowedIpRanges,
      // Convert string dates back to Date objects
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      lastAccessedAt: new Date(data.lastAccessedAt),
      archivedAt: data.archivedAt ? new Date(data.archivedAt) : undefined,
      subscriptionExpiresAt: data.subscriptionExpiresAt ? new Date(data.subscriptionExpiresAt) : undefined,
      // Convert string numbers back to numbers
      totalMessages: Number(data.totalMessages) || 0,
      totalFiles: Number(data.totalFiles) || 0,
      storageUsed: Number(data.storageUsed) || 0,
      activeMembers: Number(data.activeMembers) || 0,
      monthlyActiveUsers: Number(data.monthlyActiveUsers) || 0,
      culturalComplianceScore: Number(data.culturalComplianceScore) || 85,
      // Convert string booleans back to booleans
      arabicSupport: data.arabicSupport === 'true',
      rtlLayout: data.rtlLayout === 'true',
      allowGuestAccess: data.allowGuestAccess === 'true',
      fileUploadEnabled: data.fileUploadEnabled === 'true',
      encryptionEnabled: data.encryptionEnabled === 'true',
      auditLoggingEnabled: data.auditLoggingEnabled === 'true',
      twoFactorRequired: data.twoFactorRequired === 'true',
      ipWhitelistEnabled: data.ipWhitelistEnabled === 'true'
    };
  }

  private serializeMember(member: WorkspaceMember): Record<string, string> {
    return {
      ...member,
      permissions: JSON.stringify(member.permissions),
      professionalCertifications: JSON.stringify(member.professionalCertifications),
      governorate: member.governorate ? JSON.stringify(member.governorate) : '',
      ipRestrictions: member.ipRestrictions ? JSON.stringify(member.ipRestrictions) : '',
      joinedAt: member.joinedAt.toISOString(),
      lastActiveAt: member.lastActiveAt.toISOString(),
      lastLoginAt: member.lastLoginAt?.toISOString() || '',
      suspendedUntil: member.suspendedUntil?.toISOString() || '',
      sessionTimeout: member.sessionTimeout?.toString() || '',
      culturalComplianceLevel: member.culturalComplianceLevel.toString()
    };
  }

  private deserializeMember(data: any): WorkspaceMember {
    return {
      ...data,
      permissions: typeof data.permissions === 'string'
        ? JSON.parse(data.permissions)
        : data.permissions,
      professionalCertifications: typeof data.professionalCertifications === 'string'
        ? JSON.parse(data.professionalCertifications)
        : data.professionalCertifications,
      governorate: data.governorate && typeof data.governorate === 'string'
        ? JSON.parse(data.governorate)
        : data.governorate,
      ipRestrictions: data.ipRestrictions && typeof data.ipRestrictions === 'string'
        ? JSON.parse(data.ipRestrictions)
        : data.ipRestrictions,
      joinedAt: new Date(data.joinedAt),
      lastActiveAt: new Date(data.lastActiveAt),
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      suspendedUntil: data.suspendedUntil ? new Date(data.suspendedUntil) : undefined,
      sessionTimeout: data.sessionTimeout ? Number(data.sessionTimeout) : undefined,
      culturalComplianceLevel: Number(data.culturalComplianceLevel) || 0
    };
  }

  // ====================== Analytics ======================

  async getWorkspaceAnalytics(workspaceId: string): Promise<{
    totalMessages: number;
    totalFiles: number;
    storageUsed: number;
    activeMembers: number;
    monthlyActiveUsers: number;
    culturalComplianceScore: number;
    arabicUsagePercentage: number;
    professionalDomainActivity: Record<string, number>;
    governorateDistribution: Record<string, number>;
  }> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const members = await this.getWorkspaceMembers(workspaceId);
    
    // Calculate governorate distribution
    const governorateDistribution: Record<string, number> = {};
    members.forEach(member => {
      if (member.governorate) {
        const key = member.governorate.nameEn;
        governorateDistribution[key] = (governorateDistribution[key] || 0) + 1;
      }
    });

    return {
      totalMessages: workspace.totalMessages,
      totalFiles: workspace.totalFiles,
      storageUsed: workspace.storageUsed,
      activeMembers: workspace.activeMembers,
      monthlyActiveUsers: workspace.monthlyActiveUsers,
      culturalComplianceScore: workspace.culturalComplianceScore,
      arabicUsagePercentage: await this.calculateArabicUsagePercentage(workspaceId),
      professionalDomainActivity: await this.getProfessionalDomainActivity(workspaceId),
      governorateDistribution
    };
  }

  private async calculateArabicUsagePercentage(workspaceId: string): Promise<number> {
    // Simulate Arabic usage calculation
    return Math.floor(Math.random() * 60) + 30; // 30-90
  }

  private async getProfessionalDomainActivity(workspaceId: string): Promise<Record<string, number>> {
    // Simulate professional domain activity
    return {
      consultation: 45,
      documentation: 30,
      collaboration: 20,
      training: 5
    };
  }

  // ====================== Public Helper Methods ======================

  getIraqiGovernorates(): IraqiGovernorate[] {
    return [...this.IRAQI_GOVERNORATES];
  }

  getGovernorateByCode(code: string): IraqiGovernorate | undefined {
    return this.IRAQI_GOVERNORATES.find(g => g.code === code);
  }

  async getWorkspaceCount(filters?: {
    type?: ProfessionalDomain;
    status?: WorkspaceStatus;
    visibility?: WorkspaceVisibility;
  }): Promise<number> {
    let count = 0;
    
    if (filters?.type) {
      count = await this.redis.scard(`workspaces:type:${filters.type}`);
    } else if (filters?.visibility) {
      count = await this.redis.scard(`workspaces:visibility:${filters.visibility}`);
    } else {
      // Get all workspace keys and count them
      const keys = await this.redis.keys('workspace:ws_*');
      count = keys.length;
    }
    
    return count;
  }

  // ====================== Cleanup Methods ======================

  async destroy(): Promise<void> {
    await this.redis.quit();
    this.removeAllListeners();
  }
}