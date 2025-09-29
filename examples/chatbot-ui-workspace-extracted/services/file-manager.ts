/**
 * Iraqi AI Workspace File Management Service
 * Enhanced chatbot-ui extraction with workspace isolation and cultural compliance
 * Supports Arabic file names, cultural validation, and professional domain file types
 */

import { Redis } from "ioredis";
import crypto from "crypto";
import path from "path";
import { z } from "zod";

// ====================== Types & Interfaces ======================

export type FileType =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "data";
export type FileStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "error"
  | "quarantined"
  | "culturally_flagged";
export type AccessLevel = "private" | "workspace" | "organization" | "public";

export interface FileMetadata {
  id: string;
  workspaceId: string;
  uploaderId: string;
  originalName: string;
  originalNameAr?: string;
  displayName: string;
  displayNameAr?: string;

  // File properties
  fileType: FileType;
  mimeType: string;
  size: number; // In bytes
  extension: string;
  hash: string; // SHA-256 hash for deduplication

  // Storage information
  storagePath: string;
  bucketName: string;
  isEncrypted: boolean;
  encryptionKey?: string;

  // Access and permissions
  accessLevel: AccessLevel;
  allowedRoles: string[];
  downloadCount: number;
  isSharedExternally: boolean;
  shareableLink?: string;
  shareExpiry?: Date;

  // Cultural and professional compliance
  culturalComplianceScore: number;
  islamicComplianceChecked: boolean;
  containsArabicText: boolean;
  professionalDomainTags: string[];
  contentCategories: string[];

  // Processing status
  status: FileStatus;
  processingProgress: number; // 0-100
  errorMessage?: string;
  virusScanPassed: boolean;
  thumbnailGenerated: boolean;
  textExtracted: boolean;

  // Timestamps
  uploadedAt: Date;
  lastAccessedAt: Date;
  lastModifiedAt: Date;
  expiresAt?: Date;

  // Metadata
  description?: string;
  descriptionAr?: string;
  tags: string[];
  customMetadata: Record<string, any>;
}

export interface FileUploadRequest {
  workspaceId: string;
  uploaderId: string;
  originalName: string;
  originalNameAr?: string;
  fileBuffer: Buffer;
  mimeType: string;
  accessLevel: AccessLevel;
  description?: string;
  descriptionAr?: string;
  tags?: string[];
  customMetadata?: Record<string, any>;
}

export interface FileSearchQuery {
  workspaceId: string;
  userId: string;
  query?: string;
  fileType?: FileType;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  professionalDomain?: string;
  culturallyCompliant?: boolean;
  arabicContent?: boolean;
  limit?: number;
  offset?: number;
}

export interface WorkspaceStorageStats {
  totalFiles: number;
  totalSize: number;
  sizeByType: Record<FileType, number>;
  culturallyFlaggedFiles: number;
  arabicFiles: number;
  encryptedFiles: number;
  storageQuota: number;
  storageUsedPercentage: number;
}

// ====================== Validation Schemas ======================

const FileUploadSchema = z.object({
  workspaceId: z.string().min(1),
  uploaderId: z.string().min(1),
  originalName: z.string().min(1).max(255),
  originalNameAr: z.string().max(255).optional(),
  mimeType: z.string().min(1),
  accessLevel: z.enum(["private", "workspace", "organization", "public"]),
  description: z.string().max(1000).optional(),
  descriptionAr: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  customMetadata: z.record(z.any()).optional(),
});

// ====================== Iraqi Workspace File Manager ======================

export class IraqiWorkspaceFileManager {
  private redis: Redis;
  private readonly STORAGE_BASE_PATH =
    process.env.FILE_STORAGE_PATH || "/app/storage";
  private readonly MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB default
  private readonly SUPPORTED_EXTENSIONS = {
    document: [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt", ".html"],
    image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".svg"],
    video: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"],
    audio: [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"],
    archive: [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"],
    code: [".js", ".ts", ".py", ".java", ".cpp", ".c", ".html", ".css"],
    data: [".json", ".xml", ".csv", ".xlsx", ".sql", ".db"],
  };

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  // ====================== File Upload ======================

  async uploadFile(uploadRequest: FileUploadRequest): Promise<FileMetadata> {
    // Validate upload request
    const validatedData = FileUploadSchema.parse(uploadRequest);

    // Check file size limits
    const workspace = await this.getWorkspaceInfo(validatedData.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (uploadRequest.fileBuffer.length > workspace.maxFileSize * 1024 * 1024) {
      throw new Error(
        `File size exceeds workspace limit of ${workspace.maxFileSize}MB`,
      );
    }

    // Check file type permissions
    const extension = path.extname(validatedData.originalName).toLowerCase();
    if (!workspace.allowedFileTypes.includes(extension.replace(".", ""))) {
      throw new Error(`File type ${extension} not allowed in this workspace`);
    }

    // Generate file ID and hash
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileHash = crypto
      .createHash("sha256")
      .update(uploadRequest.fileBuffer)
      .digest("hex");

    // Check for duplicate files
    const existingFile = await this.findFileByHash(
      validatedData.workspaceId,
      fileHash,
    );
    if (existingFile) {
      return existingFile; // Return existing file instead of duplicating
    }

    // Determine file type
    const fileType = this.determineFileType(extension);

    // Generate storage path
    const storagePath = this.generateStoragePath(
      validatedData.workspaceId,
      fileId,
      extension,
    );

    // Create file metadata
    const fileMetadata: FileMetadata = {
      id: fileId,
      workspaceId: validatedData.workspaceId,
      uploaderId: validatedData.uploaderId,
      originalName: validatedData.originalName,
      originalNameAr: validatedData.originalNameAr,
      displayName: validatedData.originalName,
      displayNameAr: validatedData.originalNameAr,

      fileType,
      mimeType: validatedData.mimeType,
      size: uploadRequest.fileBuffer.length,
      extension,
      hash: fileHash,

      storagePath,
      bucketName: `workspace-${validatedData.workspaceId}`,
      isEncrypted: this.shouldEncryptFile(fileType, workspace.type),

      accessLevel: validatedData.accessLevel,
      allowedRoles: this.getDefaultAllowedRoles(validatedData.accessLevel),
      downloadCount: 0,
      isSharedExternally: false,

      culturalComplianceScore: 0, // Will be calculated during processing
      islamicComplianceChecked: false,
      containsArabicText: false,
      professionalDomainTags: [],
      contentCategories: [],

      status: "uploading",
      processingProgress: 0,
      virusScanPassed: false,
      thumbnailGenerated: false,
      textExtracted: false,

      uploadedAt: new Date(),
      lastAccessedAt: new Date(),
      lastModifiedAt: new Date(),

      description: validatedData.description,
      descriptionAr: validatedData.descriptionAr,
      tags: validatedData.tags || [],
      customMetadata: validatedData.customMetadata || {},
    };

    // Store file metadata
    await this.redis.hset(
      `file:${fileId}`,
      this.serializeFileMetadata(fileMetadata),
    );

    // Add to workspace file index
    await this.redis.sadd(
      `workspace:${validatedData.workspaceId}:files`,
      fileId,
    );

    // Add to user's uploaded files
    await this.redis.sadd(`user:${validatedData.uploaderId}:files`, fileId);

    // Start background processing
    await this.processFileAsync(fileId, uploadRequest.fileBuffer);

    return fileMetadata;
  }

  // ====================== File Processing ======================

  private async processFileAsync(
    fileId: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    try {
      // Update status to processing
      await this.updateFileStatus(fileId, "processing", 10);

      // Perform virus scan
      const virusScanResult = await this.performVirusScan(fileBuffer);
      if (!virusScanResult.safe) {
        await this.updateFileStatus(
          fileId,
          "quarantined",
          100,
          "Virus detected",
        );
        return;
      }
      await this.updateFileProgress(fileId, 30);

      // Extract text content
      const textContent = await this.extractTextContent(fileBuffer);
      await this.updateFileProgress(fileId, 50);

      // Detect Arabic content
      const containsArabic = this.detectArabicText(textContent);
      await this.redis.hset(
        `file:${fileId}`,
        "containsArabicText",
        containsArabic.toString(),
      );
      await this.updateFileProgress(fileId, 60);

      // Perform cultural compliance check
      const culturalScore = await this.performCulturalComplianceCheck(
        textContent,
        containsArabic,
      );
      await this.redis.hset(
        `file:${fileId}`,
        "culturalComplianceScore",
        culturalScore.toString(),
      );
      await this.redis.hset(
        `file:${fileId}`,
        "islamicComplianceChecked",
        "true",
      );
      await this.updateFileProgress(fileId, 80);

      // Generate thumbnail if applicable
      const thumbnailGenerated = await this.generateThumbnail(
        fileId,
        fileBuffer,
      );
      await this.redis.hset(
        `file:${fileId}`,
        "thumbnailGenerated",
        thumbnailGenerated.toString(),
      );
      await this.updateFileProgress(fileId, 90);

      // Finalize processing
      await this.redis.hset(`file:${fileId}`, "textExtracted", "true");
      await this.redis.hset(`file:${fileId}`, "virusScanPassed", "true");

      // Check if file should be flagged
      const shouldFlag = culturalScore < 70 || !virusScanResult.safe;
      const finalStatus = shouldFlag ? "culturally_flagged" : "ready";

      await this.updateFileStatus(fileId, finalStatus, 100);
    } catch (error) {
      await this.updateFileStatus(fileId, "error", 100, error.message);
    }
  }

  private async updateFileStatus(
    fileId: string,
    status: FileStatus,
    progress: number,
    errorMessage?: string,
  ): Promise<void> {
    const updates: any = {
      status,
      processingProgress: progress.toString(),
      lastModifiedAt: new Date().toISOString(),
    };

    if (errorMessage) {
      updates.errorMessage = errorMessage;
    }

    await this.redis.hmset(`file:${fileId}`, updates);
  }

  private async updateFileProgress(
    fileId: string,
    progress: number,
  ): Promise<void> {
    await this.redis.hset(
      `file:${fileId}`,
      "processingProgress",
      progress.toString(),
    );
  }

  // ====================== File Retrieval ======================

  async getFile(fileId: string, userId: string): Promise<FileMetadata | null> {
    const fileData = await this.redis.hgetall(`file:${fileId}`);
    if (!fileData || Object.keys(fileData).length === 0) {
      return null;
    }

    const file = this.deserializeFileMetadata(fileData);

    // Check access permissions
    const hasAccess = await this.checkFileAccess(file, userId);
    if (!hasAccess) {
      throw new Error("Access denied to file");
    }

    // Update last accessed time
    await this.redis.hset(
      `file:${fileId}`,
      "lastAccessedAt",
      new Date().toISOString(),
    );

    return file;
  }

  async getWorkspaceFiles(
    workspaceId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{
    files: FileMetadata[];
    total: number;
    hasMore: boolean;
  }> {
    // Check workspace access
    const hasWorkspaceAccess = await this.checkWorkspaceAccess(
      workspaceId,
      userId,
    );
    if (!hasWorkspaceAccess) {
      throw new Error("Access denied to workspace");
    }

    // Get file IDs from workspace
    const fileIds = await this.redis.smembers(`workspace:${workspaceId}:files`);
    const total = fileIds.length;

    // Apply pagination
    const paginatedIds = fileIds.slice(offset, offset + limit);

    // Fetch file metadata
    const files = await Promise.all(
      paginatedIds.map(async (fileId) => {
        const fileData = await this.redis.hgetall(`file:${fileId}`);
        return this.deserializeFileMetadata(fileData);
      }),
    );

    // Filter files based on access permissions
    const accessibleFiles = await Promise.all(
      files.map(async (file) => {
        const hasAccess = await this.checkFileAccess(file, userId);
        return hasAccess ? file : null;
      }),
    );

    const filteredFiles = accessibleFiles.filter(Boolean) as FileMetadata[];

    return {
      files: filteredFiles,
      total,
      hasMore: offset + limit < total,
    };
  }

  async searchFiles(searchQuery: FileSearchQuery): Promise<FileMetadata[]> {
    // Check workspace access
    const hasWorkspaceAccess = await this.checkWorkspaceAccess(
      searchQuery.workspaceId,
      searchQuery.userId,
    );
    if (!hasWorkspaceAccess) {
      throw new Error("Access denied to workspace");
    }

    // Get all workspace files
    const fileIds = await this.redis.smembers(
      `workspace:${searchQuery.workspaceId}:files`,
    );

    // Fetch and filter files
    const allFiles = await Promise.all(
      fileIds.map(async (fileId) => {
        const fileData = await this.redis.hgetall(`file:${fileId}`);
        return this.deserializeFileMetadata(fileData);
      }),
    );

    // Apply filters
    let filteredFiles = allFiles.filter((file) => {
      // Check file access
      if (!this.checkFileAccessSync(file, searchQuery.userId)) return false;

      // File type filter
      if (searchQuery.fileType && file.fileType !== searchQuery.fileType)
        return false;

      // Tags filter
      if (
        searchQuery.tags &&
        !searchQuery.tags.some((tag) => file.tags.includes(tag))
      )
        return false;

      // Date range filter
      if (searchQuery.dateRange) {
        const uploadDate = new Date(file.uploadedAt);
        if (
          uploadDate < searchQuery.dateRange.start ||
          uploadDate > searchQuery.dateRange.end
        )
          return false;
      }

      // Professional domain filter
      if (
        searchQuery.professionalDomain &&
        !file.professionalDomainTags.includes(searchQuery.professionalDomain)
      )
        return false;

      // Cultural compliance filter
      if (searchQuery.culturallyCompliant !== undefined) {
        const isCompliant = file.culturalComplianceScore >= 80;
        if (searchQuery.culturallyCompliant !== isCompliant) return false;
      }

      // Arabic content filter
      if (
        searchQuery.arabicContent !== undefined &&
        file.containsArabicText !== searchQuery.arabicContent
      )
        return false;

      // Text search
      if (searchQuery.query) {
        const query = searchQuery.query.toLowerCase();
        const searchableText = [
          file.displayName,
          file.displayNameAr,
          file.description,
          file.descriptionAr,
          ...file.tags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) return false;
      }

      return true;
    });

    // Apply pagination
    const limit = searchQuery.limit || 50;
    const offset = searchQuery.offset || 0;
    filteredFiles = filteredFiles.slice(offset, offset + limit);

    return filteredFiles;
  }

  // ====================== File Management ======================

  async updateFileMetadata(
    fileId: string,
    updates: Partial<FileMetadata>,
    userId: string,
  ): Promise<FileMetadata> {
    const file = await this.getFile(fileId, userId);
    if (!file) {
      throw new Error("File not found");
    }

    // Check if user can edit file
    const canEdit =
      file.uploaderId === userId ||
      (await this.canUserEditWorkspace(file.workspaceId, userId));
    if (!canEdit) {
      throw new Error("Insufficient permissions to edit file");
    }

    // Apply updates
    const updatedFile: FileMetadata = {
      ...file,
      ...updates,
      lastModifiedAt: new Date(),
    };

    // Store updates
    await this.redis.hmset(
      `file:${fileId}`,
      this.serializeFileMetadata(updatedFile),
    );

    return updatedFile;
  }

  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    const file = await this.getFile(fileId, userId);
    if (!file) {
      throw new Error("File not found");
    }

    // Check if user can delete file
    const canDelete =
      file.uploaderId === userId ||
      (await this.canUserEditWorkspace(file.workspaceId, userId));
    if (!canDelete) {
      throw new Error("Insufficient permissions to delete file");
    }

    // Remove from indexes
    await this.redis.srem(`workspace:${file.workspaceId}:files`, fileId);
    await this.redis.srem(`user:${file.uploaderId}:files`, fileId);

    // Delete file metadata
    await this.redis.del(`file:${fileId}`);

    // TODO: Delete actual file from storage
    // await this.deleteFileFromStorage(file.storagePath);

    return true;
  }

  // ====================== Storage Statistics ======================

  async getWorkspaceStorageStats(
    workspaceId: string,
  ): Promise<WorkspaceStorageStats> {
    const fileIds = await this.redis.smembers(`workspace:${workspaceId}:files`);

    const files = await Promise.all(
      fileIds.map(async (fileId) => {
        const fileData = await this.redis.hgetall(`file:${fileId}`);
        return this.deserializeFileMetadata(fileData);
      }),
    );

    const stats: WorkspaceStorageStats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      sizeByType: {
        document: 0,
        image: 0,
        video: 0,
        audio: 0,
        archive: 0,
        code: 0,
        data: 0,
      },
      culturallyFlaggedFiles: 0,
      arabicFiles: 0,
      encryptedFiles: 0,
      storageQuota: 0,
      storageUsedPercentage: 0,
    };

    // Calculate detailed statistics
    files.forEach((file) => {
      stats.sizeByType[file.fileType] += file.size;
      if (file.culturalComplianceScore < 80) stats.culturallyFlaggedFiles++;
      if (file.containsArabicText) stats.arabicFiles++;
      if (file.isEncrypted) stats.encryptedFiles++;
    });

    // Get workspace quota
    const workspace = await this.getWorkspaceInfo(workspaceId);
    if (workspace) {
      stats.storageQuota = workspace.maxFileSize * 1024 * 1024 * 100; // Assume 100x max file size as quota
      stats.storageUsedPercentage =
        (stats.totalSize / stats.storageQuota) * 100;
    }

    return stats;
  }

  // ====================== Utility Methods ======================

  private determineFileType(extension: string): FileType {
    for (const [type, extensions] of Object.entries(
      this.SUPPORTED_EXTENSIONS,
    )) {
      if (extensions.includes(extension)) {
        return type as FileType;
      }
    }
    return "document"; // Default
  }

  private generateStoragePath(
    workspaceId: string,
    fileId: string,
    extension: string,
  ): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return path.join(
      this.STORAGE_BASE_PATH,
      "workspaces",
      workspaceId,
      year.toString(),
      month,
      `${fileId}${extension}`,
    );
  }

  private shouldEncryptFile(
    fileType: FileType,
    workspaceType: string,
  ): boolean {
    // Encrypt sensitive file types or files in sensitive workspaces
    const sensitiveTypes = ["document", "data"];
    const sensitiveWorkspaces = ["legal", "medical"];
    return (
      sensitiveTypes.includes(fileType) ||
      sensitiveWorkspaces.includes(workspaceType)
    );
  }

  private getDefaultAllowedRoles(accessLevel: AccessLevel): string[] {
    const roleMap = {
      private: ["owner"],
      workspace: ["owner", "admin", "editor", "viewer"],
      organization: ["owner", "admin", "editor", "viewer", "member"],
      public: ["all"],
    };
    return roleMap[accessLevel];
  }

  private async performVirusScan(
    fileBuffer: Buffer,
  ): Promise<{ safe: boolean; threats?: string[] }> {
    // Simulate virus scan - in real implementation, use ClamAV or similar
    return { safe: true };
  }

  private async extractTextContent(fileBuffer: Buffer): Promise<string> {
    // Simulate text extraction - in real implementation, use appropriate libraries
    return "";
  }

  private detectArabicText(content: string): boolean {
    // Simple Arabic text detection
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(content);
  }

  private async performCulturalComplianceCheck(
    content: string,
    isArabic: boolean,
  ): Promise<number> {
    // Simulate cultural compliance check - in real implementation, call iraqi-cultural-validator agent
    return Math.floor(Math.random() * 30) + 70; // 70-100
  }

  private async generateThumbnail(
    fileId: string,
    fileBuffer: Buffer,
  ): Promise<boolean> {
    // Simulate thumbnail generation
    return true;
  }

  private async checkFileAccess(
    file: FileMetadata,
    userId: string,
  ): Promise<boolean> {
    // Owner always has access
    if (file.uploaderId === userId) return true;

    // Check workspace access
    const hasWorkspaceAccess = await this.checkWorkspaceAccess(
      file.workspaceId,
      userId,
    );
    if (!hasWorkspaceAccess) return false;

    // Check access level
    if (file.accessLevel === "public") return true;
    if (file.accessLevel === "private") return file.uploaderId === userId;

    // For workspace and organization levels, check user role
    return true; // Simplified - in real implementation, check user role
  }

  private checkFileAccessSync(file: FileMetadata, userId: string): boolean {
    // Simplified synchronous access check
    return (
      file.uploaderId === userId ||
      file.accessLevel === "public" ||
      file.accessLevel === "workspace"
    );
  }

  private async checkWorkspaceAccess(
    workspaceId: string,
    userId: string,
  ): Promise<boolean> {
    // Check if user has access to workspace
    const userWorkspaces = await this.redis.smembers(
      `user:${userId}:workspaces`,
    );
    return userWorkspaces.includes(workspaceId);
  }

  private async canUserEditWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<boolean> {
    // Check if user can edit workspace (simplified)
    return true;
  }

  private async getWorkspaceInfo(workspaceId: string): Promise<any> {
    // Get workspace information (simplified)
    return {
      maxFileSize: 100,
      allowedFileTypes: Object.values(this.SUPPORTED_EXTENSIONS)
        .flat()
        .map((ext) => ext.replace(".", "")),
      type: "business",
    };
  }

  private async findFileByHash(
    workspaceId: string,
    hash: string,
  ): Promise<FileMetadata | null> {
    const fileIds = await this.redis.smembers(`workspace:${workspaceId}:files`);

    for (const fileId of fileIds) {
      const fileData = await this.redis.hgetall(`file:${fileId}`);
      if (fileData.hash === hash) {
        return this.deserializeFileMetadata(fileData);
      }
    }

    return null;
  }

  private serializeFileMetadata(
    metadata: FileMetadata,
  ): Record<string, string> {
    return {
      ...metadata,
      allowedRoles: JSON.stringify(metadata.allowedRoles),
      professionalDomainTags: JSON.stringify(metadata.professionalDomainTags),
      contentCategories: JSON.stringify(metadata.contentCategories),
      tags: JSON.stringify(metadata.tags),
      customMetadata: JSON.stringify(metadata.customMetadata),
      uploadedAt: metadata.uploadedAt.toISOString(),
      lastAccessedAt: metadata.lastAccessedAt.toISOString(),
      lastModifiedAt: metadata.lastModifiedAt.toISOString(),
      expiresAt: metadata.expiresAt?.toISOString() || "",
      shareExpiry: metadata.shareExpiry?.toISOString() || "",
    };
  }

  private deserializeFileMetadata(data: any): FileMetadata {
    return {
      ...data,
      size: parseInt(data.size),
      downloadCount: parseInt(data.downloadCount),
      culturalComplianceScore: parseFloat(data.culturalComplianceScore),
      processingProgress: parseInt(data.processingProgress),
      isEncrypted: data.isEncrypted === "true",
      islamicComplianceChecked: data.islamicComplianceChecked === "true",
      containsArabicText: data.containsArabicText === "true",
      isSharedExternally: data.isSharedExternally === "true",
      virusScanPassed: data.virusScanPassed === "true",
      thumbnailGenerated: data.thumbnailGenerated === "true",
      textExtracted: data.textExtracted === "true",
      allowedRoles: JSON.parse(data.allowedRoles || "[]"),
      professionalDomainTags: JSON.parse(data.professionalDomainTags || "[]"),
      contentCategories: JSON.parse(data.contentCategories || "[]"),
      tags: JSON.parse(data.tags || "[]"),
      customMetadata: JSON.parse(data.customMetadata || "{}"),
      uploadedAt: new Date(data.uploadedAt),
      lastAccessedAt: new Date(data.lastAccessedAt),
      lastModifiedAt: new Date(data.lastModifiedAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      shareExpiry: data.shareExpiry ? new Date(data.shareExpiry) : undefined,
    };
  }
}
