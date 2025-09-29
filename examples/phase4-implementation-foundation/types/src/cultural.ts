import { z } from "zod";

// Cultural Context Schema - Based on Iraqi AI protocols extraction
export const IraqiCulturalContextSchema = z.object({
  culturalValidation: z.boolean().default(true),
  islamicCompliance: z.boolean().default(true),
  arabicSupport: z.boolean().default(false),
  rtlLayout: z.boolean().default(false),
  dialectSupport: z.enum(["iraqi", "standard", "mixed"]).default("iraqi"),
  professionalDomain: z
    .enum([
      "legal",
      "medical",
      "educational",
      "business",
      "government",
      "technology",
      "finance",
      "general",
    ])
    .optional(),
  culturalScore: z.number().min(0).max(100).default(85),
  islamicScore: z.number().min(0).max(100).default(90),
});

export type IraqiCulturalContext = z.infer<typeof IraqiCulturalContextSchema>;

// Cultural Validation Results
export const CulturalValidationResultSchema = z.object({
  score: z.number().min(0).max(100),
  passed: z.boolean(),
  issues: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  processingTime: z.number().min(0),
  validation_timestamp: z.string().datetime(),
});

export type CulturalValidationResult = z.infer<
  typeof CulturalValidationResultSchema
>;

// Islamic Compliance Results
export const IslamicComplianceResultSchema = z.object({
  score: z.number().min(0).max(100),
  compliant: z.boolean(),
  violations: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  jurisprudenceSchool: z
    .enum(["hanafi", "shafi", "maliki", "hanbali", "general"])
    .default("general"),
  processingTime: z.number().min(0),
  validation_timestamp: z.string().datetime(),
});

export type IslamicComplianceResult = z.infer<
  typeof IslamicComplianceResultSchema
>;

// Political Neutrality Validation
export const PoliticalNeutralityResultSchema = z.object({
  score: z.number().min(0).max(100),
  neutral: z.boolean(),
  concerns: z.array(z.string()).default([]),
  sectarianRisk: z.boolean().default(false),
  tribalRisk: z.boolean().default(false),
  politicalRisk: z.boolean().default(false),
  recommendations: z.array(z.string()).default([]),
});

export type PoliticalNeutralityResult = z.infer<
  typeof PoliticalNeutralityResultSchema
>;

// Unified Cultural Processing Result
export const UnifiedCulturalProcessingResultSchema = z.object({
  culturalValidation: CulturalValidationResultSchema,
  islamicCompliance: IslamicComplianceResultSchema,
  politicalNeutrality: PoliticalNeutralityResultSchema,
  overallScore: z.number().min(0).max(100),
  success: z.boolean(),
  processingTime: z.number().min(0),
});

export type UnifiedCulturalProcessingResult = z.infer<
  typeof UnifiedCulturalProcessingResultSchema
>;

// Cultural Enhancement Configuration
export const CulturalEnhancementConfigSchema = z.object({
  culturalValidation: z.object({
    enabled: z.boolean().default(true),
    strictMode: z.boolean().default(false),
    minimumScore: z.number().min(0).max(100).default(85),
    timeout: z.number().min(0).default(2000),
    cacheEnabled: z.boolean().default(true),
    cacheTtl: z.number().min(0).default(3600),
  }),
  islamicCompliance: z.object({
    enabled: z.boolean().default(true),
    strictMode: z.boolean().default(true),
    minimumScore: z.number().min(0).max(100).default(90),
    jurisprudenceSchool: z
      .enum(["hanafi", "shafi", "maliki", "hanbali", "general"])
      .default("general"),
    auditingEnabled: z.boolean().default(true),
  }),
  politicalNeutrality: z.object({
    enabled: z.boolean().default(true),
    strictMode: z.boolean().default(true),
    minimumScore: z.number().min(0).max(100).default(95),
    auditingEnabled: z.boolean().default(true),
  }),
});

export type CulturalEnhancementConfig = z.infer<
  typeof CulturalEnhancementConfigSchema
>;
