/**
 * Enhanced Knowledge Plugin Architecture for Iraqi AI Chat System
 * Extracted from Botpress/plugins/knowledge/plugin.definition.ts
 * Enhanced with Iraqi professional domain knowledge and cultural context
 */

import { PluginDefinition } from "@botpress/client";
import { z } from "zod";

// Iraqi professional knowledge domains
const IraqiProfessionalDomains = {
  LEGAL: "iraqi_legal",
  MEDICAL: "iraqi_medical",
  EDUCATIONAL: "iraqi_educational",
  GOVERNMENT: "iraqi_government",
  FINANCE: "iraqi_finance",
  ENGINEERING: "iraqi_engineering",
  RELIGIOUS: "iraqi_religious",
  CULTURAL: "iraqi_cultural",
} as const;

// Knowledge source types with Iraqi context
const IraqiKnowledgeSources = {
  GOVERNMENT_DOCS: "gov_documents",
  LEGAL_CODES: "legal_codes",
  MEDICAL_PROTOCOLS: "medical_protocols",
  EDUCATIONAL_CURRICULUM: "educational_curriculum",
  CULTURAL_GUIDELINES: "cultural_guidelines",
  RELIGIOUS_REFERENCES: "religious_references",
  PROFESSIONAL_STANDARDS: "professional_standards",
  REGIONAL_KNOWLEDGE: "regional_knowledge",
} as const;

// Enhanced knowledge entry schema
const iraqiKnowledgeEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  arabicTitle: z.string().optional(),
  content: z.string(),
  arabicContent: z.string().optional(),

  // Iraqi professional context
  domain: z.enum([
    IraqiProfessionalDomains.LEGAL,
    IraqiProfessionalDomains.MEDICAL,
    IraqiProfessionalDomains.EDUCATIONAL,
    IraqiProfessionalDomains.GOVERNMENT,
    IraqiProfessionalDomains.FINANCE,
    IraqiProfessionalDomains.ENGINEERING,
    IraqiProfessionalDomains.RELIGIOUS,
    IraqiProfessionalDomains.CULTURAL,
  ]),

  sourceType: z.enum([
    IraqiKnowledgeSources.GOVERNMENT_DOCS,
    IraqiKnowledgeSources.LEGAL_CODES,
    IraqiKnowledgeSources.MEDICAL_PROTOCOLS,
    IraqiKnowledgeSources.EDUCATIONAL_CURRICULUM,
    IraqiKnowledgeSources.CULTURAL_GUIDELINES,
    IraqiKnowledgeSources.RELIGIOUS_REFERENCES,
    IraqiKnowledgeSources.PROFESSIONAL_STANDARDS,
    IraqiKnowledgeSources.REGIONAL_KNOWLEDGE,
  ]),

  // Cultural and compliance metadata
  culturalMetadata: z.object({
    islamicCompliance: z.enum(["strict", "moderate", "flexible", "neutral"]),
    culturalSensitivity: z.enum(["high", "medium", "low"]),
    sectarianNeutral: z.boolean().default(true),
    regionalRelevance: z.array(
      z.enum(["baghdad", "basra", "mosul", "erbil", "najaf", "karbala", "all"]),
    ),
    professionalAccuracy: z.enum([
      "verified",
      "reviewed",
      "draft",
      "unverified",
    ]),
    lastCulturalReview: z.string().datetime().optional(),
  }),

  // Professional validation
  professionalValidation: z.object({
    reviewedBy: z.string().optional(),
    reviewDate: z.string().datetime().optional(),
    accuracyScore: z.number().min(0).max(1).optional(),
    sourceAuthority: z.enum([
      "government",
      "academic",
      "professional_body",
      "expert",
      "community",
    ]),
    verificationStatus: z.enum(["verified", "pending", "disputed", "outdated"]),
    expertEndorsements: z.array(z.string()).default([]),
  }),

  // Language and accessibility
  language: z.enum(["arabic", "english", "mixed"]),
  readabilityLevel: z.enum(["basic", "intermediate", "advanced", "expert"]),
  accessibility: z.object({
    screenReaderFriendly: z.boolean().default(true),
    simpleLanguage: z.boolean().default(false),
    visualAids: z.boolean().default(false),
    audioAvailable: z.boolean().default(false),
  }),

  // Versioning and updates
  version: z.string().default("1.0"),
  lastUpdated: z.string().datetime(),
  updateFrequency: z.enum([
    "static",
    "annual",
    "quarterly",
    "monthly",
    "weekly",
    "real_time",
  ]),

  // Search and categorization
  keywords: z.array(z.string()),
  arabicKeywords: z.array(z.string()),
  tags: z.array(z.string()),
  category: z.string(),
  subcategory: z.string().optional(),

  // Usage and analytics
  usageStats: z.object({
    accessCount: z.number().default(0),
    lastAccessed: z.string().datetime().optional(),
    avgUserRating: z.number().min(0).max(5).optional(),
    userFeedback: z.array(z.string()).default([]),
  }),

  // Content structure
  contentStructure: z.object({
    hasSteps: z.boolean().default(false),
    hasList: z.boolean().default(false),
    hasTable: z.boolean().default(false),
    hasFormula: z.boolean().default(false),
    hasLegalCitations: z.boolean().default(false),
    hasMedicalTerminology: z.boolean().default(false),
  }),
});

export default {
  name: "iraqi-knowledge-base",
  version: "2.0.0",
  title: "Iraqi Professional Knowledge Base Plugin",
  description:
    "Enhanced knowledge management for Iraqi professional domains with cultural validation",
  icon: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png",
  readme: "docs/readme.md",

  configuration: {
    schema: z.object({
      // Knowledge base settings
      knowledgeBase: z.object({
        enableMultiDomainSupport: z.boolean().default(true),
        enableCulturalValidation: z.boolean().default(true),
        enableProfessionalValidation: z.boolean().default(true),
        enableArabicSearch: z.boolean().default(true),
        enableSemanticSearch: z.boolean().default(true),
        maxResultsPerQuery: z.number().default(10),
        relevanceThreshold: z.number().min(0).max(1).default(0.7),
      }),

      // Iraqi professional domains
      professionalDomains: z.object({
        legal: z.object({
          enabled: z.boolean().default(true),
          includeCivilLaw: z.boolean().default(true),
          includeCriminalLaw: z.boolean().default(true),
          includeCommercialLaw: z.boolean().default(true),
          includePersonalStatusLaw: z.boolean().default(true),
          includeIslamicLaw: z.boolean().default(true),
          requireLegalDisclaimer: z.boolean().default(true),
        }),
        medical: z.object({
          enabled: z.boolean().default(true),
          includeGeneralMedicine: z.boolean().default(true),
          includeSpecializedMedicine: z.boolean().default(true),
          includePharmacology: z.boolean().default(true),
          includePublicHealth: z.boolean().default(true),
          requireMedicalDisclaimer: z.boolean().default(true),
          enableSymptomChecker: z.boolean().default(false),
        }),
        educational: z.object({
          enabled: z.boolean().default(true),
          includePrimaryCurriculum: z.boolean().default(true),
          includeSecondaryCurriculum: z.boolean().default(true),
          includeHigherEducation: z.boolean().default(true),
          includeVocationalTraining: z.boolean().default(true),
          includeTeacherResources: z.boolean().default(true),
        }),
        government: z.object({
          enabled: z.boolean().default(true),
          includeFederalProcedures: z.boolean().default(true),
          includeProvincialProcedures: z.boolean().default(true),
          includeMunicipalProcedures: z.boolean().default(true),
          includePublicServices: z.boolean().default(true),
          includeCitizenRights: z.boolean().default(true),
        }),
      }),

      // Cultural validation settings
      culturalValidation: z.object({
        enableIslamicCompliance: z.boolean().default(true),
        islamicComplianceLevel: z
          .enum(["strict", "moderate", "flexible"])
          .default("moderate"),
        enableSectarianNeutrality: z.boolean().default(true),
        enableCulturalSensitivity: z.boolean().default(true),
        requireCulturalReview: z.boolean().default(false),
        culturalReviewers: z.array(z.string()).default([]),
      }),

      // Language and localization
      language: z.object({
        enableArabicContent: z.boolean().default(true),
        enableEnglishContent: z.boolean().default(true),
        enableMixedContent: z.boolean().default(true),
        preferredLanguage: z
          .enum(["arabic", "english", "user_preference"])
          .default("user_preference"),
        enableTranslation: z.boolean().default(true),
        enableDialectRecognition: z.boolean().default(true),
        supportedDialects: z
          .array(z.string())
          .default(["iraqi", "standard_arabic"]),
      }),

      // Professional validation
      professionalValidation: z.object({
        requireExpertReview: z.boolean().default(false),
        enablePeerReview: z.boolean().default(true),
        minimumAccuracyScore: z.number().min(0).max(1).default(0.8),
        enableSourceVerification: z.boolean().default(true),
        enableUpdateTracking: z.boolean().default(true),
        expertValidators: z
          .array(
            z.object({
              domain: z.string(),
              expertId: z.string(),
              credentials: z.string(),
              active: z.boolean(),
            }),
          )
          .default([]),
      }),
    }),
  },

  actions: {
    // Query Iraqi knowledge base
    queryKnowledgeBase: {
      title: "البحث في قاعدة المعرفة", // Search Knowledge Base
      description:
        "Query Iraqi professional knowledge base with cultural validation",

      input: {
        schema: z.object({
          query: z.string().min(3, "الاستعلام قصير جداً"), // Query too short
          language: z
            .enum(["arabic", "english", "mixed", "auto"])
            .default("auto"),
          domain: z
            .enum([
              IraqiProfessionalDomains.LEGAL,
              IraqiProfessionalDomains.MEDICAL,
              IraqiProfessionalDomains.EDUCATIONAL,
              IraqiProfessionalDomains.GOVERNMENT,
              IraqiProfessionalDomains.FINANCE,
              IraqiProfessionalDomains.ENGINEERING,
              IraqiProfessionalDomains.RELIGIOUS,
              IraqiProfessionalDomains.CULTURAL,
              "all",
            ])
            .default("all"),

          filters: z
            .object({
              culturalCompliance: z
                .enum(["strict", "moderate", "flexible"])
                .optional(),
              regionalRelevance: z
                .enum([
                  "baghdad",
                  "basra",
                  "mosul",
                  "erbil",
                  "najaf",
                  "karbala",
                  "all",
                ])
                .optional(),
              accuracyLevel: z
                .enum(["verified", "reviewed", "all"])
                .default("all"),
              lastUpdated: z
                .enum(["week", "month", "quarter", "year", "all"])
                .default("all"),
              contentType: z.array(z.string()).optional(),
            })
            .optional(),

          searchOptions: z
            .object({
              enableSemanticSearch: z.boolean().default(true),
              enableFuzzySearch: z.boolean().default(true),
              maxResults: z.number().min(1).max(50).default(10),
              relevanceThreshold: z.number().min(0).max(1).default(0.7),
              includeRelated: z.boolean().default(true),
            })
            .optional(),
        }),
      },

      output: {
        schema: z.object({
          results: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              arabicTitle: z.string().optional(),
              snippet: z.string(),
              arabicSnippet: z.string().optional(),
              domain: z.string(),
              sourceType: z.string(),
              relevanceScore: z.number().min(0).max(1),
              culturalCompliance: z.string(),
              professionalAccuracy: z.string(),
              lastUpdated: z.string().datetime(),
              url: z.string().optional(),
              metadata: z.object({
                readabilityLevel: z.string(),
                language: z.string(),
                hasDisclaimer: z.boolean(),
                expertReviewed: z.boolean(),
              }),
            }),
          ),

          totalResults: z.number(),
          searchTime: z.number(),
          query: z.string(),
          language: z.string(),
          domain: z.string(),
          appliedFilters: z.record(z.any()),

          suggestions: z
            .object({
              relatedQueries: z.array(z.string()),
              alternativeTerms: z.array(z.string()),
              domainSuggestions: z.array(z.string()),
            })
            .optional(),

          culturalNotes: z.array(z.string()).optional(),
          disclaimers: z.array(z.string()).optional(),
        }),
      },
    },

    // Add knowledge entry
    addKnowledgeEntry: {
      title: "إضافة مدخل معرفي", // Add Knowledge Entry
      description: "Add new entry to Iraqi knowledge base with validation",

      input: {
        schema: iraqiKnowledgeEntrySchema
          .omit({
            id: true,
            usageStats: true,
            lastUpdated: true,
          })
          .extend({
            authorId: z.string(),
            sourceUrl: z.string().url().optional(),
            attachments: z.array(z.string()).optional(),
            requiresReview: z.boolean().default(true),
          }),
      },

      output: {
        schema: z.object({
          success: z.boolean(),
          entryId: z.string(),
          validationResults: z.object({
            culturalValidation: z.object({
              passed: z.boolean(),
              score: z.number().min(0).max(1),
              issues: z.array(z.string()),
              recommendations: z.array(z.string()),
            }),
            professionalValidation: z.object({
              passed: z.boolean(),
              accuracy: z.number().min(0).max(1),
              sourceVerified: z.boolean(),
              expertReviewRequired: z.boolean(),
            }),
            contentQuality: z.object({
              readabilityScore: z.number().min(0).max(1),
              completenessScore: z.number().min(0).max(1),
              structureScore: z.number().min(0).max(1),
            }),
          }),
          status: z.enum(["published", "pending_review", "requires_revision"]),
          nextSteps: z.array(z.string()).optional(),
          reviewAssignedTo: z.string().optional(),
        }),
      },
    },

    // Update knowledge entry
    updateKnowledgeEntry: {
      title: "تحديث المدخل المعرفي", // Update Knowledge Entry
      description: "Update existing knowledge base entry with change tracking",

      input: {
        schema: z.object({
          entryId: z.string(),
          updates: iraqiKnowledgeEntrySchema.partial(),
          updateReason: z.string(),
          authorId: z.string(),
          majorUpdate: z.boolean().default(false), // Increment version if true
        }),
      },

      output: {
        schema: z.object({
          success: z.boolean(),
          entryId: z.string(),
          newVersion: z.string(),
          changesSummary: z.array(z.string()),
          validationRequired: z.boolean(),
          reviewStatus: z.enum([
            "approved",
            "pending",
            "requires_expert_review",
          ]),
          affectedUsers: z.number().optional(), // Users who bookmarked this entry
        }),
      },
    },

    // Validate cultural compliance
    validateCulturalCompliance: {
      title: "التحقق من الالتزام الثقافي", // Validate Cultural Compliance
      description: "Validate content for Iraqi cultural and Islamic compliance",

      input: {
        schema: z.object({
          content: z.string(),
          domain: z.string(),
          complianceLevel: z
            .enum(["strict", "moderate", "flexible"])
            .default("moderate"),
          checkIslamicCompliance: z.boolean().default(true),
          checkCulturalSensitivity: z.boolean().default(true),
          checkSectarianNeutrality: z.boolean().default(true),
        }),
      },

      output: {
        schema: z.object({
          overallCompliance: z.boolean(),
          complianceScore: z.number().min(0).max(1),

          checks: z.object({
            islamicCompliance: z.object({
              passed: z.boolean(),
              score: z.number().min(0).max(1),
              issues: z.array(z.string()),
              recommendations: z.array(z.string()),
            }),
            culturalSensitivity: z.object({
              passed: z.boolean(),
              score: z.number().min(0).max(1),
              issues: z.array(z.string()),
              recommendations: z.array(z.string()),
            }),
            sectarianNeutrality: z.object({
              passed: z.boolean(),
              score: z.number().min(0).max(1),
              potentialIssues: z.array(z.string()),
              suggestions: z.array(z.string()),
            }),
          }),

          overallRecommendations: z.array(z.string()),
          requiredChanges: z.array(z.string()),
          severity: z.enum(["low", "medium", "high", "critical"]),
          reviewRequired: z.boolean(),
        }),
      },
    },

    // Get domain expertise
    getDomainExpertise: {
      title: "الحصول على الخبرة المجالية", // Get Domain Expertise
      description:
        "Get specialized knowledge for specific Iraqi professional domain",

      input: {
        schema: z.object({
          domain: z.enum([
            IraqiProfessionalDomains.LEGAL,
            IraqiProfessionalDomains.MEDICAL,
            IraqiProfessionalDomains.EDUCATIONAL,
            IraqiProfessionalDomains.GOVERNMENT,
            IraqiProfessionalDomains.FINANCE,
            IraqiProfessionalDomains.ENGINEERING,
            IraqiProfessionalDomains.RELIGIOUS,
            IraqiProfessionalDomains.CULTURAL,
          ]),
          specificArea: z.string().optional(),
          experienceLevel: z
            .enum(["beginner", "intermediate", "advanced", "expert"])
            .default("intermediate"),
          language: z.enum(["arabic", "english", "mixed"]).default("arabic"),
        }),
      },

      output: {
        schema: z.object({
          domain: z.string(),
          expertise: z.object({
            overview: z.string(),
            arabicOverview: z.string().optional(),
            keyAreas: z.array(z.string()),
            expertContacts: z.array(
              z.object({
                name: z.string(),
                specialization: z.string(),
                credentials: z.string(),
                contactInfo: z.string().optional(),
              }),
            ),
            resources: z.array(
              z.object({
                title: z.string(),
                type: z.enum(["document", "website", "course", "reference"]),
                url: z.string().optional(),
                description: z.string(),
              }),
            ),
            commonQuestions: z.array(
              z.object({
                question: z.string(),
                arabicQuestion: z.string().optional(),
                answer: z.string(),
                arabicAnswer: z.string().optional(),
              }),
            ),
            legalFramework: z.array(z.string()).optional(),
            culturalConsiderations: z.array(z.string()).optional(),
            professionalStandards: z.array(z.string()).optional(),
          }),
        }),
      },
    },
  },

  events: {
    // Knowledge base events
    knowledgeEntryAdded: {
      schema: z.object({
        entryId: z.string(),
        domain: z.string(),
        title: z.string(),
        authorId: z.string(),
        timestamp: z.string().datetime(),
        requiresReview: z.boolean(),
      }),
    },

    knowledgeEntryUpdated: {
      schema: z.object({
        entryId: z.string(),
        domain: z.string(),
        changes: z.array(z.string()),
        newVersion: z.string(),
        authorId: z.string(),
        timestamp: z.string().datetime(),
      }),
    },

    culturalViolationDetected: {
      schema: z.object({
        entryId: z.string(),
        violationType: z.enum([
          "islamic_non_compliance",
          "cultural_insensitivity",
          "sectarian_bias",
        ]),
        severity: z.enum(["low", "medium", "high", "critical"]),
        description: z.string(),
        timestamp: z.string().datetime(),
        reviewRequired: z.boolean(),
      }),
    },

    expertReviewRequested: {
      schema: z.object({
        entryId: z.string(),
        domain: z.string(),
        expertId: z.string(),
        reason: z.string(),
        urgency: z.enum(["low", "medium", "high"]),
        timestamp: z.string().datetime(),
      }),
    },
  },

  states: {
    // Knowledge base statistics
    knowledgeStats: {
      type: "integration",
      schema: z.object({
        totalEntries: z.number().default(0),
        entriesByDomain: z.record(z.number()).default({}),
        entriesByLanguage: z.record(z.number()).default({}),
        qualityStats: z.object({
          averageAccuracyScore: z.number().default(0),
          averageCulturalScore: z.number().default(0),
          expertReviewedEntries: z.number().default(0),
          pendingReviews: z.number().default(0),
        }),
        usageStats: z.object({
          totalQueries: z.number().default(0),
          popularDomains: z.record(z.number()).default({}),
          averageResponseTime: z.number().default(0),
          userSatisfactionScore: z.number().default(0),
        }),
        lastUpdated: z.string().datetime(),
      }),
    },

    // Domain expertise state
    domainExperts: {
      type: "integration",
      schema: z.record(
        z.object({
          expertId: z.string(),
          name: z.string(),
          specializations: z.array(z.string()),
          credentials: z.string(),
          reviewCount: z.number().default(0),
          averageRating: z.number().default(0),
          active: z.boolean().default(true),
          lastActive: z.string().datetime(),
        }),
      ),
    },

    // User knowledge preferences
    userPreferences: {
      type: "user",
      schema: z.object({
        preferredLanguage: z
          .enum(["arabic", "english", "mixed"])
          .default("arabic"),
        preferredDomains: z.array(z.string()).default([]),
        culturalComplianceLevel: z
          .enum(["strict", "moderate", "flexible"])
          .default("moderate"),
        bookmarkedEntries: z.array(z.string()).default([]),
        queryHistory: z
          .array(
            z.object({
              query: z.string(),
              domain: z.string(),
              timestamp: z.string().datetime(),
              satisfied: z.boolean().optional(),
            }),
          )
          .default([]),
        notifications: z.object({
          newEntriesInDomain: z.boolean().default(true),
          expertReviewCompleted: z.boolean().default(true),
          culturalUpdates: z.boolean().default(true),
        }),
      }),
    },
  },
} as const satisfies PluginDefinition;

/**
 * Iraqi AI Chat System Knowledge Plugin Enhancements Applied:
 *
 * 1. Iraqi Professional Domains - Legal, medical, educational, government, finance specialization
 * 2. Cultural Validation Framework - Islamic compliance, sectarian neutrality, cultural sensitivity
 * 3. Professional Validation System - Expert review, accuracy scoring, source verification
 * 4. Bilingual Knowledge Support - Arabic and English content with proper metadata
 * 5. Domain Expertise Management - Specialized knowledge areas with expert contacts
 * 6. Regional Knowledge Context - Baghdad, Basra, Mosul, Erbil regional relevance
 * 7. Cultural Compliance Checking - Automated and manual cultural appropriateness validation
 * 8. Professional Standards Integration - Iraqi professional body standards and requirements
 * 9. Source Authority Tracking - Government, academic, professional body verification
 * 10. Update and Version Control - Change tracking, professional review workflows
 * 11. User Preference Management - Personalized cultural and professional settings
 * 12. Analytics and Quality Metrics - Usage tracking, satisfaction scoring, quality measurement
 */
