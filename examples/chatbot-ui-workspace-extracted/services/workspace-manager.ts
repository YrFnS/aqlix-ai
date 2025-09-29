/**
 * Iraqi AI Workspace Management Service
 * Enhanced chatbot-ui extraction with Iraqi professional domains
 * Supports legal, medical, educational, business, and engineering workspaces
 */

import { Redis } from "ioredis";
import { z } from "zod";

// ====================== Types & Interfaces ======================

export type ProfessionalDomain =
  | "personal"
  | "legal"
  | "medical"
  | "educational"
  | "business"
  | "engineering";
export type WorkspaceVisibility = "private" | "organization" | "public";
export type IraqiDialect = "baghdad" | "basra" | "mosul" | "general";
export type WorkspaceStatus =
  | "active"
  | "suspended"
  | "archived"
  | "pending_approval";

export interface IraqiCulturalSettings {
  enableIslamicCompliance: boolean;
  strictnessLevel: "basic" | "standard" | "strict";
  prayerTimeReminders: boolean;
  halalContentFilter: boolean;
  politicalNeutralityMode: boolean;
  sectarianContentFilter: boolean;
  culturalSensitivityLevel: "low" | "medium" | "high" | "maximum";
}

export interface IraqiWorkspace {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  type: ProfessionalDomain;
  ownerId: string;
  organizationId?: string;
  visibility: WorkspaceVisibility;

  // Iraqi-specific settings
  culturalSettings: IraqiCulturalSettings;
  arabicSupport: boolean;
  dialectPreference: IraqiDialect;
  rtlLayout: boolean;

  // Professional domain settings
  professionalLicenseNumber?: string;
  organizationRegistration?: string;
  complianceRequirements: string[];
  specializations: string[];

  // Workspace configuration
  maxMembers: number;
  allowGuestAccess: boolean;
  fileUploadEnabled: boolean;
  maxFileSize: number; // In MB
  allowedFileTypes: string[];

  // Timestamps and status
  status: WorkspaceStatus;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;

  // Usage statistics
  totalMessages: number;
  totalFiles: number;
  storageUsed: number; // In MB
  activeMembers: number;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "editor" | "viewer" | "guest";
  permissions: string[];
  invitedBy: string;
  joinedAt: Date;
  lastActiveAt: Date;
  culturalComplianceLevel: number; // 0-100
  arabicProficiency: "none" | "basic" | "intermediate" | "advanced" | "native";
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  inviterUserId: string;
  inviteeEmail: string;
  role: string;
  status: "pending" | "accepted" | "declined" | "expired";
  culturalOnboardingRequired: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// ====================== Validation Schemas ======================

const IraqiCulturalSettingsSchema = z.object({
  enableIslamicCompliance: z.boolean(),
  strictnessLevel: z.enum(["basic", "standard", "strict"]),
  prayerTimeReminders: z.boolean(),
  halalContentFilter: z.boolean(),
  politicalNeutralityMode: z.boolean(),
  sectarianContentFilter: z.boolean(),
  culturalSensitivityLevel: z.enum(["low", "medium", "high", "maximum"]),
});

const WorkspaceCreateSchema = z.object({
  name: z.string().min(1).max(100),
  nameAr: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  descriptionAr: z.string().max(500).optional(),
  type: z.enum([
    "personal",
    "legal",
    "medical",
    "educational",
    "business",
    "engineering",
  ]),
  visibility: z.enum(["private", "organization", "public"]),
  culturalSettings: IraqiCulturalSettingsSchema,
  arabicSupport: z.boolean(),
  dialectPreference: z.enum(["baghdad", "basra", "mosul", "general"]),
  professionalLicenseNumber: z.string().optional(),
  organizationRegistration: z.string().optional(),
  complianceRequirements: z.array(z.string()),
  specializations: z.array(z.string()),
});

// ====================== Iraqi Workspace Manager Service ======================

export class IraqiWorkspaceManager {
  private redis: Redis;
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly MAX_WORKSPACES_PER_USER = {
    personal: 5,
    legal: 10,
    medical: 10,
    educational: 15,
    business: 20,
    engineering: 15,
  };

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  // ====================== Workspace Creation ======================

  async createWorkspace(
    ownerId: string,
    workspaceData: z.infer<typeof WorkspaceCreateSchema>,
  ): Promise<IraqiWorkspace> {
    // Validate input data
    const validatedData = WorkspaceCreateSchema.parse(workspaceData);

    // Check workspace limits
    const userWorkspaces = await this.getUserWorkspaces(ownerId);
    const typeCount = userWorkspaces.filter(
      (w) => w.type === validatedData.type,
    ).length;

    if (typeCount >= this.MAX_WORKSPACES_PER_USER[validatedData.type]) {
      throw new Error(
        `Maximum ${validatedData.type} workspaces (${this.MAX_WORKSPACES_PER_USER[validatedData.type]}) reached`,
      );
    }

    // Generate workspace ID
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create workspace object
    const workspace: IraqiWorkspace = {
      id: workspaceId,
      name: validatedData.name,
      nameAr: validatedData.nameAr,
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

      // Professional settings
      professionalLicenseNumber: validatedData.professionalLicenseNumber,
      organizationRegistration: validatedData.organizationRegistration,
      complianceRequirements: validatedData.complianceRequirements,
      specializations: validatedData.specializations,

      // Default configuration
      maxMembers: this.getDefaultMaxMembers(validatedData.type),
      allowGuestAccess:
        validatedData.type === "business" ||
        validatedData.type === "educational",
      fileUploadEnabled: true,
      maxFileSize: this.getDefaultMaxFileSize(validatedData.type),
      allowedFileTypes: this.getDefaultAllowedFileTypes(validatedData.type),

      // Status and timestamps
      status: this.requiresApproval(validatedData.type)
        ? "pending_approval"
        : "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),

      // Usage stats
      totalMessages: 0,
      totalFiles: 0,
      storageUsed: 0,
      activeMembers: 1,
    };

    // Store workspace in database (simulate with Redis)
    await this.redis.hset(`workspace:${workspaceId}`, workspace);

    // Add to user's workspace list
    await this.redis.sadd(`user:${ownerId}:workspaces`, workspaceId);

    // Add owner as workspace member
    await this.addMember(workspaceId, {
      userId: ownerId,
      role: "owner",
      permissions: ["all"],
      culturalComplianceLevel: 100,
      arabicProficiency: "native",
    });

    // Cache the workspace
    await this.cacheWorkspace(workspace);

    // Validate cultural compliance if required
    if (workspace.culturalSettings.enableIslamicCompliance) {
      await this.validateWorkspaceCulturalCompliance(workspace);
    }

    return workspace;
  }

  // ====================== Workspace Retrieval ======================

  async getWorkspace(workspaceId: string): Promise<IraqiWorkspace | null> {
    // Try cache first
    const cached = await this.redis.get(`cache:workspace:${workspaceId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get from database
    const workspaceData = await this.redis.hgetall(`workspace:${workspaceId}`);
    if (!workspaceData || Object.keys(workspaceData).length === 0) {
      return null;
    }

    const workspace = this.deserializeWorkspace(workspaceData);

    // Update cache
    await this.cacheWorkspace(workspace);

    return workspace;
  }

  async getUserWorkspaces(userId: string): Promise<IraqiWorkspace[]> {
    const workspaceIds = await this.redis.smembers(`user:${userId}:workspaces`);
    const workspaces = await Promise.all(
      workspaceIds.map((id) => this.getWorkspace(id)),
    );

    return workspaces.filter(Boolean) as IraqiWorkspace[];
  }

  async getWorkspacesByType(
    type: ProfessionalDomain,
    userId?: string,
  ): Promise<IraqiWorkspace[]> {
    if (userId) {
      const userWorkspaces = await this.getUserWorkspaces(userId);
      return userWorkspaces.filter((w) => w.type === type);
    }

    // Get all public workspaces of this type
    const pattern = `workspace:*`;
    const keys = await this.redis.keys(pattern);
    const workspaces = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redis.hgetall(key);
        return this.deserializeWorkspace(data);
      }),
    );

    return workspaces.filter(
      (w) => w.type === type && w.visibility === "public",
    );
  }

  // ====================== Workspace Management ======================

  async updateWorkspace(
    workspaceId: string,
    updates: Partial<IraqiWorkspace>,
    userId: string,
  ): Promise<IraqiWorkspace> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Check permissions
    if (!(await this.canUserEditWorkspace(userId, workspaceId))) {
      throw new Error("Insufficient permissions to edit workspace");
    }

    // Apply updates
    const updatedWorkspace: IraqiWorkspace = {
      ...workspace,
      ...updates,
      updatedAt: new Date(),
    };

    // Validate cultural settings if updated
    if (updates.culturalSettings) {
      IraqiCulturalSettingsSchema.parse(updates.culturalSettings);
      await this.validateWorkspaceCulturalCompliance(updatedWorkspace);
    }

    // Store updates
    await this.redis.hset(`workspace:${workspaceId}`, updatedWorkspace);

    // Update cache
    await this.cacheWorkspace(updatedWorkspace);

    return updatedWorkspace;
  }

  async deleteWorkspace(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Only owner can delete workspace
    if (workspace.ownerId !== userId) {
      throw new Error("Only workspace owner can delete workspace");
    }

    // Remove all members
    const members = await this.getWorkspaceMembers(workspaceId);
    await Promise.all(
      members.map((member) => this.removeMember(workspaceId, member.userId)),
    );

    // Delete workspace files (simulate)
    await this.redis.del(`workspace:${workspaceId}:files`);

    // Delete workspace data
    await this.redis.del(`workspace:${workspaceId}`);

    // Remove from user's workspace list
    await this.redis.srem(`user:${userId}:workspaces`, workspaceId);

    // Clear cache
    await this.redis.del(`cache:workspace:${workspaceId}`);

    return true;
  }

  // ====================== Member Management ======================

  async addMember(
    workspaceId: string,
    memberData: {
      userId: string;
      role: string;
      permissions: string[];
      culturalComplianceLevel: number;
      arabicProficiency: string;
    },
  ): Promise<WorkspaceMember> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
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
    };

    // Store member
    await this.redis.hset(
      `workspace:${workspaceId}:member:${memberData.userId}`,
      member,
    );

    // Add to user's workspace list
    await this.redis.sadd(`user:${memberData.userId}:workspaces`, workspaceId);

    // Update workspace member count
    await this.redis.hincrby(`workspace:${workspaceId}`, "activeMembers", 1);

    return member;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const pattern = `workspace:${workspaceId}:member:*`;
    const keys = await this.redis.keys(pattern);

    const members = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redis.hgetall(key);
        return this.deserializeMember(data);
      }),
    );

    return members;
  }

  async removeMember(workspaceId: string, userId: string): Promise<boolean> {
    // Remove member data
    await this.redis.del(`workspace:${workspaceId}:member:${userId}`);

    // Remove from user's workspace list
    await this.redis.srem(`user:${userId}:workspaces`, workspaceId);

    // Update workspace member count
    await this.redis.hincrby(`workspace:${workspaceId}`, "activeMembers", -1);

    return true;
  }

  // ====================== Permission Management ======================

  async canUserAccessWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) return false;

    // Owner always has access
    if (workspace.ownerId === userId) return true;

    // Check if user is a member
    const memberExists = await this.redis.exists(
      `workspace:${workspaceId}:member:${userId}`,
    );
    if (memberExists) return true;

    // Check if workspace allows guest access
    if (workspace.allowGuestAccess && workspace.visibility === "public") {
      return true;
    }

    return false;
  }

  async canUserEditWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) return false;

    // Owner can always edit
    if (workspace.ownerId === userId) return true;

    // Check member permissions
    const memberData = await this.redis.hgetall(
      `workspace:${workspaceId}:member:${userId}`,
    );
    if (!memberData) return false;

    const member = this.deserializeMember(memberData);
    return member.role === "admin" || member.role === "editor";
  }

  // ====================== Cultural Compliance ======================

  private async validateWorkspaceCulturalCompliance(
    workspace: IraqiWorkspace,
  ): Promise<void> {
    const { culturalSettings } = workspace;

    // Validate Islamic compliance
    if (culturalSettings.enableIslamicCompliance) {
      // Check workspace name for inappropriate content
      if (await this.containsInappropriateContent(workspace.name, "ar")) {
        throw new Error(
          "Workspace name contains culturally inappropriate content",
        );
      }

      if (
        workspace.nameAr &&
        (await this.containsInappropriateContent(workspace.nameAr, "ar"))
      ) {
        throw new Error(
          "Arabic workspace name contains culturally inappropriate content",
        );
      }
    }

    // Validate professional domain compliance
    if (workspace.type === "legal" || workspace.type === "medical") {
      if (!workspace.professionalLicenseNumber) {
        throw new Error(
          `${workspace.type} workspaces require professional license number`,
        );
      }
    }
  }

  private async containsInappropriateContent(
    text: string,
    language: "ar" | "en",
  ): Promise<boolean> {
    // Simulate cultural validation service call
    // In real implementation, this would call the iraqi-cultural-validator agent

    const inappropriateKeywords = {
      ar: ["محتوى غير مناسب", "كلمات مسيئة"],
      en: ["inappropriate", "offensive"],
    };

    const keywords = inappropriateKeywords[language];
    return keywords.some((keyword) =>
      text.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  // ====================== Default Configuration Helpers ======================

  private getDefaultMaxMembers(type: ProfessionalDomain): number {
    const defaults = {
      personal: 5,
      legal: 25,
      medical: 20,
      educational: 100,
      business: 50,
      engineering: 30,
    };
    return defaults[type];
  }

  private getDefaultMaxFileSize(type: ProfessionalDomain): number {
    const defaults = {
      personal: 50, // 50 MB
      legal: 500, // 500 MB (large legal documents)
      medical: 200, // 200 MB (medical images)
      educational: 100, // 100 MB
      business: 200, // 200 MB
      engineering: 1000, // 1 GB (CAD files)
    };
    return defaults[type];
  }

  private getDefaultAllowedFileTypes(type: ProfessionalDomain): string[] {
    const common = ["pdf", "doc", "docx", "txt", "rtf"];
    const typeSpecific = {
      personal: [...common, "jpg", "png", "gif"],
      legal: [...common, "html", "xml"],
      medical: [...common, "dcm", "nii", "jpg", "png", "tiff"],
      educational: [...common, "ppt", "pptx", "xls", "xlsx", "mp4", "mp3"],
      business: [...common, "xls", "xlsx", "ppt", "pptx", "csv"],
      engineering: [...common, "dwg", "dxf", "step", "iges", "stl", "obj"],
    };
    return typeSpecific[type];
  }

  private requiresApproval(type: ProfessionalDomain): boolean {
    return type === "legal" || type === "medical";
  }

  // ====================== Utility Methods ======================

  private async cacheWorkspace(workspace: IraqiWorkspace): Promise<void> {
    await this.redis.setex(
      `cache:workspace:${workspace.id}`,
      this.CACHE_TTL,
      JSON.stringify(workspace),
    );
  }

  private deserializeWorkspace(data: any): IraqiWorkspace {
    return {
      ...data,
      culturalSettings:
        typeof data.culturalSettings === "string"
          ? JSON.parse(data.culturalSettings)
          : data.culturalSettings,
      complianceRequirements:
        typeof data.complianceRequirements === "string"
          ? JSON.parse(data.complianceRequirements)
          : data.complianceRequirements,
      specializations:
        typeof data.specializations === "string"
          ? JSON.parse(data.specializations)
          : data.specializations,
      allowedFileTypes:
        typeof data.allowedFileTypes === "string"
          ? JSON.parse(data.allowedFileTypes)
          : data.allowedFileTypes,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      lastAccessedAt: new Date(data.lastAccessedAt),
    };
  }

  private deserializeMember(data: any): WorkspaceMember {
    return {
      ...data,
      permissions:
        typeof data.permissions === "string"
          ? JSON.parse(data.permissions)
          : data.permissions,
      joinedAt: new Date(data.joinedAt),
      lastActiveAt: new Date(data.lastActiveAt),
    };
  }

  // ====================== Analytics and Statistics ======================

  async getWorkspaceAnalytics(workspaceId: string): Promise<{
    totalMessages: number;
    totalFiles: number;
    storageUsed: number;
    activeMembers: number;
    culturalComplianceScore: number;
    arabicUsagePercentage: number;
    professionalDomainActivity: Record<string, number>;
  }> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Get basic stats from workspace
    const basicStats = {
      totalMessages: workspace.totalMessages,
      totalFiles: workspace.totalFiles,
      storageUsed: workspace.storageUsed,
      activeMembers: workspace.activeMembers,
    };

    // Calculate cultural compliance score
    const culturalComplianceScore =
      await this.calculateCulturalComplianceScore(workspaceId);

    // Calculate Arabic usage percentage
    const arabicUsagePercentage =
      await this.calculateArabicUsagePercentage(workspaceId);

    // Get professional domain activity
    const professionalDomainActivity =
      await this.getProfessionalDomainActivity(workspaceId);

    return {
      ...basicStats,
      culturalComplianceScore,
      arabicUsagePercentage,
      professionalDomainActivity,
    };
  }

  private async calculateCulturalComplianceScore(
    workspaceId: string,
  ): Promise<number> {
    // Simulate cultural compliance calculation
    // In real implementation, this would aggregate compliance scores from messages
    return Math.floor(Math.random() * 20) + 80; // 80-100
  }

  private async calculateArabicUsagePercentage(
    workspaceId: string,
  ): Promise<number> {
    // Simulate Arabic usage calculation
    // In real implementation, this would analyze message languages
    return Math.floor(Math.random() * 60) + 30; // 30-90
  }

  private async getProfessionalDomainActivity(
    workspaceId: string,
  ): Promise<Record<string, number>> {
    // Simulate professional domain activity
    return {
      consultation: 45,
      documentation: 30,
      collaboration: 20,
      training: 5,
    };
  }
}
