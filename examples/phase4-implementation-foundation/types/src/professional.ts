import { z } from "zod";
import { IraqiCulturalContextSchema } from "./cultural.js";

// Professional Domain Types - Based on extracted professional domain patterns
export const ProfessionalDomainEnum = z.enum([
  "legal",
  "medical",
  "educational",
  "business",
  "government",
  "technology",
  "finance",
  "engineering",
  "agriculture",
  "healthcare",
  "energy",
  "telecommunications",
  "transportation",
  "manufacturing",
  "general",
]);

export type ProfessionalDomain = z.infer<typeof ProfessionalDomainEnum>;

// Iraqi Professional Standards Schema
export const IraqiProfessionalStandardsSchema = z.object({
  domain: ProfessionalDomainEnum,
  regulatoryBody: z.string().optional(),
  licenseRequired: z.boolean().default(false),
  islamicComplianceRequired: z.boolean().default(true),
  arabicLanguageRequired: z.boolean().default(true),
  culturalSensitivityRequired: z.boolean().default(true),
  professionalEthicsCode: z.string().optional(),
  continuingEducationRequired: z.boolean().default(false),
  minimumQualifications: z.array(z.string()).default([]),
  certificationAuthorities: z.array(z.string()).default([]),
});

export type IraqiProfessionalStandards = z.infer<
  typeof IraqiProfessionalStandardsSchema
>;

// Legal Domain Specific Types
export const IraqiLegalDomainSchema = z.object({
  legalSystem: z.enum(["civil_law", "islamic_law", "mixed"]).default("mixed"),
  jurisdictions: z
    .array(z.enum(["federal", "regional", "local"]))
    .default(["federal"]),
  practiceAreas: z
    .array(
      z.enum([
        "civil_law",
        "commercial_law",
        "criminal_law",
        "family_law",
        "administrative_law",
        "constitutional_law",
        "international_law",
        "islamic_jurisprudence",
        "property_law",
        "labor_law",
      ]),
    )
    .default([]),
  barAssociationMember: z.boolean().default(false),
  islamicLawQualification: z.boolean().default(false),
  arabicLegalTerminology: z.boolean().default(true),
  courtSystem: z.enum(["federal", "regional", "specialized"]).optional(),
});

export type IraqiLegalDomain = z.infer<typeof IraqiLegalDomainSchema>;

// Medical Domain Specific Types
export const IraqiMedicalDomainSchema = z.object({
  medicalSystem: z.enum(["public", "private", "mixed"]).default("mixed"),
  specializations: z
    .array(
      z.enum([
        "general_medicine",
        "surgery",
        "pediatrics",
        "cardiology",
        "neurology",
        "psychiatry",
        "dermatology",
        "ophthalmology",
        "orthopedics",
        "gynecology",
        "emergency_medicine",
        "radiology",
        "pathology",
        "anesthesiology",
        "family_medicine",
      ]),
    )
    .default([]),
  medicalCouncilRegistration: z.boolean().default(false),
  islamicMedicalEthics: z.boolean().default(true),
  arabicMedicalTerminology: z.boolean().default(true),
  hospitalAffiliations: z.array(z.string()).default([]),
  emergencyMedicine: z.boolean().default(false),
});

export type IraqiMedicalDomain = z.infer<typeof IraqiMedicalDomainSchema>;

// Educational Domain Specific Types
export const IraqiEducationalDomainSchema = z.object({
  educationLevel: z
    .array(
      z.enum([
        "kindergarten",
        "primary",
        "intermediate",
        "secondary",
        "vocational",
        "university",
        "postgraduate",
        "professional",
      ]),
    )
    .default([]),
  curriculum: z
    .enum(["iraqi_national", "international", "islamic", "mixed"])
    .default("iraqi_national"),
  teachingLanguages: z
    .array(z.enum(["arabic", "kurdish", "english"]))
    .default(["arabic"]),
  islamicStudies: z.boolean().default(true),
  arabicLanguageInstruction: z.boolean().default(true),
  teachingLicense: z.boolean().default(false),
  ministryApproval: z.boolean().default(false),
  accreditation: z.string().optional(),
});

export type IraqiEducationalDomain = z.infer<
  typeof IraqiEducationalDomainSchema
>;

// Government/Public Sector Domain Types
export const IraqiGovernmentDomainSchema = z.object({
  governmentLevel: z.enum(["federal", "regional", "provincial", "local"]),
  ministry: z
    .enum([
      "interior",
      "defense",
      "foreign_affairs",
      "finance",
      "oil",
      "electricity",
      "health",
      "education",
      "justice",
      "agriculture",
      "transportation",
      "communications",
      "labor",
      "trade",
      "planning",
      "water_resources",
      "culture",
      "tourism",
      "youth_sports",
      "science_technology",
    ])
    .optional(),
  securityClearance: z
    .enum(["public", "restricted", "confidential", "secret"])
    .default("public"),
  publicServiceRank: z.string().optional(),
  islamicValuesAlignment: z.boolean().default(true),
  bilingualism: z
    .array(z.enum(["arabic", "kurdish", "english"]))
    .default(["arabic"]),
  politicalNeutrality: z.boolean().default(true),
});

export type IraqiGovernmentDomain = z.infer<typeof IraqiGovernmentDomainSchema>;

// Professional Expertise Schema
export const ProfessionalExpertiseSchema = z.object({
  domain: ProfessionalDomainEnum,
  expertiseLevel: z
    .enum(["entry", "junior", "mid", "senior", "expert", "master"])
    .default("mid"),
  yearsExperience: z.number().min(0).default(0),
  specializations: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  licenses: z.array(z.string()).default([]),
  culturalCompetency: z.number().min(0).max(100).default(85),
  islamicKnowledge: z.number().min(0).max(100).default(85),
  arabicProficiency: z
    .enum(["native", "fluent", "intermediate", "basic", "none"])
    .default("fluent"),
  englishProficiency: z
    .enum(["native", "fluent", "intermediate", "basic", "none"])
    .default("intermediate"),
});

export type ProfessionalExpertise = z.infer<typeof ProfessionalExpertiseSchema>;

// Professional Consultation Request Schema
export const ProfessionalConsultationRequestSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string(),
  userId: z.string().optional(),
  domain: ProfessionalDomainEnum,
  query: z.string(),
  urgency: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  language: z.enum(["arabic", "english", "mixed"]).default("arabic"),
  culturalContext: IraqiCulturalContextSchema.optional(),
  islamicComplianceRequired: z.boolean().default(true),
  professionalStandardsRequired: z.boolean().default(true),
  confidentialityLevel: z
    .enum(["public", "private", "confidential"])
    .default("private"),
  expectedResponseTime: z.number().min(0).default(300000), // 5 minutes default
  createdAt: z.string().datetime(),
  requestedBy: z.string().optional(),
  attachments: z.array(z.string()).default([]),
});

export type ProfessionalConsultationRequest = z.infer<
  typeof ProfessionalConsultationRequestSchema
>;

// Professional Consultation Response Schema
export const ProfessionalConsultationResponseSchema = z.object({
  id: z.string().uuid(),
  requestId: z.string(),
  domain: ProfessionalDomainEnum,
  response: z.string(),
  confidence: z.number().min(0).max(100),
  culturalValidation: z.object({
    passed: z.boolean(),
    score: z.number().min(0).max(100),
    issues: z.array(z.string()).default([]),
  }),
  islamicCompliance: z.object({
    compliant: z.boolean(),
    score: z.number().min(0).max(100),
    violations: z.array(z.string()).default([]),
  }),
  professionalStandardsMet: z.boolean(),
  disclaimers: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  followUpRequired: z.boolean().default(false),
  referrals: z.array(z.string()).default([]),
  processingTime: z.number().min(0),
  createdAt: z.string().datetime(),
  respondedBy: z.string().optional(),
});

export type ProfessionalConsultationResponse = z.infer<
  typeof ProfessionalConsultationResponseSchema
>;
