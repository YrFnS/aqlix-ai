/**
 * Enhanced LLM Interface Standards for Iraqi AI Chat System
 * Extracted from Botpress/interfaces/llm/interface.definition.ts
 * Enhanced with Iraqi cultural context and professional domain integration
 */

import { InterfaceDefinition } from '@botpress/client';
import { z } from 'zod';

// Iraqi AI model preferences
const IraqiAIModels = {
  CULTURAL_AWARE: 'iraqi_cultural_aware',
  ARABIC_OPTIMIZED: 'arabic_optimized',
  PROFESSIONAL_LEGAL: 'iraqi_legal_specialist',
  PROFESSIONAL_MEDICAL: 'iraqi_medical_specialist',
  PROFESSIONAL_EDUCATIONAL: 'iraqi_educational_specialist',
  GENERAL_PURPOSE: 'general_iraqi'
} as const;

// Iraqi context types
const IraqiContextTypes = {
  CULTURAL: 'cultural_context',
  PROFESSIONAL: 'professional_context',
  REGIONAL: 'regional_context',
  LINGUISTIC: 'linguistic_context',
  RELIGIOUS: 'religious_context'
} as const;

// Enhanced message schema with Iraqi context
const iraqiLlmMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  
  // Iraqi language context
  language: z.enum(['arabic', 'english', 'mixed']).optional(),
  dialect: z.enum(['iraqi', 'standard_arabic', 'gulf', 'levantine']).optional(),
  rtlText: z.boolean().default(false),
  
  // Cultural context
  culturalContext: z.object({
    islamicCompliance: z.enum(['strict', 'moderate', 'flexible']).default('moderate'),
    culturalSensitivity: z.enum(['high', 'medium', 'low']).default('medium'),
    sectarianNeutrality: z.boolean().default(true),
    regionalRelevance: z.array(z.enum(['baghdad', 'basra', 'mosul', 'erbil', 'najaf', 'karbala'])).optional()
  }).optional(),
  
  // Professional context
  professionalContext: z.object({
    domain: z.enum(['legal', 'medical', 'educational', 'government', 'finance', 'engineering']).optional(),
    expertise: z.enum(['basic', 'intermediate', 'advanced', 'expert']).default('basic'),
    confidentialityLevel: z.enum(['public', 'professional', 'confidential']).default('public'),
    requiresDisclaimer: z.boolean().default(false),
    professionalStandards: z.array(z.string()).optional()
  }).optional(),
  
  // Message metadata
  metadata: z.object({
    timestamp: z.string().datetime(),
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    messageId: z.string().optional(),
    parentMessageId: z.string().optional(),
    culturalValidated: z.boolean().default(false),
    professionalReviewed: z.boolean().default(false)
  }).optional()
});

// Enhanced completion options
const iraqiCompletionOptionsSchema = z.object({
  // Model selection
  model: z.string(),
  preferredModels: z.array(z.string()).optional(), // Fallback models
  
  // Iraqi AI optimizations
  iraqiOptimizations: z.object({
    enableCulturalValidation: z.boolean().default(true),
    enableArabicOptimization: z.boolean().default(true),
    enableProfessionalContext: z.boolean().default(false),
    culturalComplianceLevel: z.enum(['strict', 'moderate', 'flexible']).default('moderate'),
    dialectPreference: z.enum(['iraqi', 'standard_arabic', 'user_preference']).default('user_preference')
  }).optional(),
  
  // Generation parameters
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(1000),
  topP: z.number().min(0).max(1).default(1),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
  
  // Response formatting
  responseFormat: z.object({
    type: z.enum(['text', 'json', 'structured']).default('text'),
    language: z.enum(['arabic', 'english', 'mixed', 'auto']).default('auto'),
    includeMetadata: z.boolean().default(true),
    includeCulturalNotes: z.boolean().default(false),
    includeDisclaimer: z.boolean().default(false)
  }).optional(),
  
  // Safety and filtering
  safetySettings: z.object({
    enableContentFiltering: z.boolean().default(true),
    enableCulturalFiltering: z.boolean().default(true),
    blockInappropriateContent: z.boolean().default(true),
    allowReligiousDiscussion: z.boolean().default(true),
    allowProfessionalAdvice: z.boolean().default(false)
  }).optional(),
  
  // Performance and reliability
  performance: z.object({
    timeout: z.number().default(30000), // 30 seconds
    retryAttempts: z.number().min(0).max(5).default(3),
    enableCaching: z.boolean().default(true),
    enableStreaming: z.boolean().default(false)
  }).optional()
});

export default {
  name: 'iraqi-llm-interface',
  version: '2.0.0',
  title: 'Iraqi LLM Interface Standards',
  description: 'Enhanced LLM interface with Iraqi cultural context and professional domain support',
  
  entities: {
    // Enhanced message entity
    message: {
      schema: iraqiLlmMessageSchema
    },
    
    // Completion request entity
    completionRequest: {
      schema: z.object({
        messages: z.array(iraqiLlmMessageSchema),
        options: iraqiCompletionOptionsSchema.optional(),
        context: z.object({
          conversationId: z.string().optional(),
          userId: z.string().optional(),
          sessionContext: z.record(z.any()).optional(),
          previousInteractions: z.array(z.string()).optional()
        }).optional()
      })
    },
    
    // Completion response entity
    completionResponse: {
      schema: z.object({
        message: iraqiLlmMessageSchema,
        usage: z.object({
          promptTokens: z.number(),
          completionTokens: z.number(),
          totalTokens: z.number(),
          arabicTokens: z.number().optional(),
          culturalValidationTokens: z.number().optional()
        }),
        
        // Iraqi validation results
        validationResults: z.object({
          culturalValidation: z.object({
            passed: z.boolean(),
            score: z.number().min(0).max(1),
            issues: z.array(z.string()).optional(),
            recommendations: z.array(z.string()).optional()
          }).optional(),
          
          professionalValidation: z.object({
            passed: z.boolean(),
            accuracy: z.number().min(0).max(1),
            requiresDisclaimer: z.boolean(),
            professionalNotes: z.array(z.string()).optional()
          }).optional(),
          
          languageValidation: z.object({
            detectedLanguage: z.string(),
            dialetDetected: z.string().optional(),
            rtlCompliant: z.boolean(),
            arabicQuality: z.number().min(0).max(1).optional()
          }).optional()
        }).optional(),
        
        // Response metadata
        metadata: z.object({
          model: z.string(),
          completionTime: z.number(),
          timestamp: z.string().datetime(),
          requestId: z.string(),
          culturallyEnhanced: z.boolean().default(false),
          professionallyReviewed: z.boolean().default(false)
        }),
        
        // Quality metrics
        quality: z.object({
          overallScore: z.number().min(0).max(1),
          culturalAppropriateness: z.number().min(0).max(1),
          professionalAccuracy: z.number().min(0).max(1),
          linguisticQuality: z.number().min(0).max(1),
          userSatisfactionPrediction: z.number().min(0).max(1).optional()
        }).optional()
      })
    },
    
    // Iraqi cultural context entity
    culturalContext: {
      schema: z.object({
        userId: z.string(),
        preferences: z.object({
          islamicCompliance: z.enum(['strict', 'moderate', 'flexible']),
          culturalSensitivity: z.enum(['high', 'medium', 'low']),
          languagePreference: z.enum(['arabic', 'english', 'mixed']),
          dialectPreference: z.enum(['iraqi', 'standard_arabic']),
          regionalContext: z.enum(['baghdad', 'basra', 'mosul', 'erbil', 'najaf', 'karbala', 'other']),
          professionalDomains: z.array(z.string()).default([])
        }),
        
        validationHistory: z.object({
          totalValidations: z.number().default(0),
          passedValidations: z.number().default(0),
          averageScore: z.number().min(0).max(1).default(0.8),
          lastValidation: z.string().datetime().optional(),
          commonIssues: z.array(z.string()).default([])
        }),
        
        learningProfile: z.object({
          culturalAdaptation: z.number().min(0).max(1).default(0.5),
          professionalExpertise: z.record(z.number()).default({}),
          communicationStyle: z.enum(['formal', 'informal', 'mixed']).default('formal'),
          feedbackHistory: z.array(z.object({
            messageId: z.string(),
            rating: z.number().min(1).max(5),
            feedback: z.string().optional(),
            timestamp: z.string().datetime()
          })).default([])
        })
      })
    },
    
    // Professional domain context entity
    professionalContext: {
      schema: z.object({
        domain: z.enum(['legal', 'medical', 'educational', 'government', 'finance', 'engineering']),
        specialization: z.string().optional(),
        expertiseLevel: z.enum(['basic', 'intermediate', 'advanced', 'expert']),
        
        standards: z.object({
          regulatoryCompliance: z.array(z.string()).default([]),
          professionalEthics: z.array(z.string()).default([]),
          qualityRequirements: z.array(z.string()).default([]),
          documentationStandards: z.array(z.string()).default([])
        }),
        
        validation: z.object({
          requiresExpertReview: z.boolean().default(false),
          minimumAccuracyScore: z.number().min(0).max(1).default(0.8),
          mandatoryDisclaimers: z.array(z.string()).default([]),
          restrictedTopics: z.array(z.string()).default([])
        }),
        
        resources: z.object({
          authorizedSources: z.array(z.string()).default([]),
          expertContacts: z.array(z.object({
            name: z.string(),
            role: z.string(),
            contact: z.string()
          })).default([]),
          referenceDocuments: z.array(z.string()).default([])
        })
      })
    }
  },

  actions: {
    // Generate culturally-aware completion
    generateCompletion: {
      title: 'إنشاء إكمال محسن ثقافياً', // Generate Culturally Enhanced Completion
      description: 'Generate LLM completion with Iraqi cultural context and validation',
      
      input: {
        schema: z.object({
          request: z.object({
            messages: z.array(iraqiLlmMessageSchema),
            options: iraqiCompletionOptionsSchema.optional()
          }),
          culturalContext: z.record(z.any()).optional(),
          professionalContext: z.record(z.any()).optional(),
          validationLevel: z.enum(['basic', 'standard', 'strict']).default('standard')
        })
      },
      
      output: {
        schema: z.object({
          completion: z.string(),
          
          // Enhanced metadata
          metadata: z.object({
            model: z.string(),
            completionTime: z.number(),
            tokenUsage: z.object({
              prompt: z.number(),
              completion: z.number(),
              total: z.number()
            }),
            requestId: z.string(),
            timestamp: z.string().datetime()
          }),
          
          // Iraqi validation results
          validation: z.object({
            cultural: z.object({
              score: z.number().min(0).max(1),
              passed: z.boolean(),
              issues: z.array(z.string()),
              enhancements: z.array(z.string())
            }),
            
            professional: z.object({
              score: z.number().min(0).max(1),
              passed: z.boolean(),
              disclaimerRequired: z.boolean(),
              expertReviewRequired: z.boolean()
            }),
            
            linguistic: z.object({
              language: z.string(),
              dialect: z.string().optional(),
              rtlCompliant: z.boolean(),
              arabicQuality: z.number().min(0).max(1).optional()
            })
          }),
          
          // Quality assessment
          quality: z.object({
            overall: z.number().min(0).max(1),
            relevance: z.number().min(0).max(1),
            accuracy: z.number().min(0).max(1),
            culturalFit: z.number().min(0).max(1),
            professionalStandards: z.number().min(0).max(1)
          }),
          
          // Additional context
          context: z.object({
            culturalNotes: z.array(z.string()).optional(),
            professionalDisclaimers: z.array(z.string()).optional(),
            relatedResources: z.array(z.string()).optional(),
            followUpSuggestions: z.array(z.string()).optional()
          }).optional()
        })
      }
    },

    // Validate cultural appropriateness
    validateCultural: {
      title: 'التحقق من الملاءمة الثقافية', // Validate Cultural Appropriateness
      description: 'Validate content for Iraqi cultural and Islamic appropriateness',
      
      input: {
        schema: z.object({
          content: z.string(),
          contentType: z.enum(['message', 'completion', 'document']),
          validationLevel: z.enum(['basic', 'standard', 'strict']).default('standard'),
          culturalContext: z.record(z.any()).optional(),
          professionalDomain: z.string().optional()
        })
      },
      
      output: {
        schema: z.object({
          validation: z.object({
            passed: z.boolean(),
            overallScore: z.number().min(0).max(1),
            
            checks: z.object({
              islamicCompliance: z.object({
                passed: z.boolean(),
                score: z.number().min(0).max(1),
                issues: z.array(z.string()),
                suggestions: z.array(z.string())
              }),
              
              culturalSensitivity: z.object({
                passed: z.boolean(),
                score: z.number().min(0).max(1),
                issues: z.array(z.string()),
                suggestions: z.array(z.string())
              }),
              
              sectarianNeutrality: z.object({
                passed: z.boolean(),
                score: z.number().min(0).max(1),
                warnings: z.array(z.string()),
                recommendations: z.array(z.string())
              })
            }),
            
            severity: z.enum(['low', 'medium', 'high', 'critical']),
            actionRequired: z.enum(['none', 'minor_edit', 'major_revision', 'expert_review']),
            estimatedFixTime: z.number().optional() // minutes
          }),
          
          recommendations: z.object({
            immediateActions: z.array(z.string()),
            improvementSuggestions: z.array(z.string()),
            alternativeApproaches: z.array(z.string()),
            resourceLinks: z.array(z.string())
          }),
          
          metadata: z.object({
            validationTime: z.number(),
            validator: z.string(),
            timestamp: z.string().datetime(),
            version: z.string()
          })
        })
      }
    },

    // Professional domain review
    reviewProfessional: {
      title: 'مراجعة مهنية متخصصة', // Professional Domain Review
      description: 'Review content for professional accuracy and standards compliance',
      
      input: {
        schema: z.object({
          content: z.string(),
          domain: z.enum(['legal', 'medical', 'educational', 'government', 'finance', 'engineering']),
          expertiseLevel: z.enum(['basic', 'intermediate', 'advanced', 'expert']).default('intermediate'),
          reviewType: z.enum(['accuracy', 'compliance', 'ethics', 'comprehensive']).default('accuracy'),
          requireExpertValidation: z.boolean().default(false)
        })
      },
      
      output: {
        schema: z.object({
          review: z.object({
            passed: z.boolean(),
            accuracyScore: z.number().min(0).max(1),
            complianceScore: z.number().min(0).max(1),
            
            findings: z.object({
              accuracyIssues: z.array(z.object({
                issue: z.string(),
                severity: z.enum(['low', 'medium', 'high', 'critical']),
                suggestion: z.string(),
                source: z.string().optional()
              })),
              
              complianceIssues: z.array(z.object({
                regulation: z.string(),
                violation: z.string(),
                remedy: z.string(),
                mandatory: z.boolean()
              })),
              
              ethicalConcerns: z.array(z.object({
                concern: z.string(),
                impact: z.string(),
                recommendation: z.string()
              }))
            }),
            
            disclaimers: z.array(z.string()),
            expertReviewRequired: z.boolean(),
            confidentialityLevel: z.enum(['public', 'professional', 'confidential'])
          }),
          
          recommendations: z.object({
            immediateChanges: z.array(z.string()),
            bestPractices: z.array(z.string()),
            additionalResources: z.array(z.string()),
            expertContacts: z.array(z.string())
          }),
          
          metadata: z.object({
            reviewer: z.string(),
            reviewTime: z.number(),
            timestamp: z.string().datetime(),
            domain: z.string(),
            version: z.string()
          })
        })
      }
    }
  },

  events: {
    // Completion events
    completionGenerated: {
      schema: z.object({
        requestId: z.string(),
        userId: z.string().optional(),
        model: z.string(),
        tokenCount: z.number(),
        completionTime: z.number(),
        culturalScore: z.number().min(0).max(1),
        professionalScore: z.number().min(0).max(1),
        timestamp: z.string().datetime()
      })
    },

    // Validation events
    culturalValidationFailed: {
      schema: z.object({
        contentId: z.string(),
        userId: z.string().optional(),
        validationType: z.string(),
        score: z.number().min(0).max(1),
        issues: z.array(z.string()),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        timestamp: z.string().datetime()
      })
    },

    professionalReviewRequired: {
      schema: z.object({
        contentId: z.string(),
        domain: z.string(),
        expertiseRequired: z.string(),
        urgency: z.enum(['low', 'medium', 'high', 'urgent']),
        assignedExpert: z.string().optional(),
        timestamp: z.string().datetime()
      })
    },

    // Quality events
    qualityThresholdBreached: {
      schema: z.object({
        metric: z.string(),
        threshold: z.number(),
        actualValue: z.number(),
        contentId: z.string(),
        impact: z.enum(['low', 'medium', 'high', 'critical']),
        timestamp: z.string().datetime()
      })
    }
  }
} as const satisfies InterfaceDefinition;

/**
 * Iraqi AI Chat System LLM Interface Enhancements Applied:
 * 
 * 1. Cultural Context Integration - Islamic compliance, sectarian neutrality, regional relevance
 * 2. Professional Domain Support - Legal, medical, educational, government specialization
 * 3. Arabic Language Optimization - RTL text, dialect recognition, Arabic quality scoring
 * 4. Enhanced Validation Framework - Cultural, professional, and linguistic validation
 * 5. Iraqi AI Model Preferences - Specialized models for different domains and contexts
 * 6. Quality Assessment System - Comprehensive scoring for relevance, accuracy, cultural fit
 * 7. Professional Standards Compliance - Regulatory requirements, ethics, documentation
 * 8. Cultural Learning Profile - User adaptation, communication style, feedback history
 * 9. Safety and Content Filtering - Cultural filtering, inappropriate content blocking
 * 10. Performance Optimization - Timeout settings, retry logic, caching for Iraqi conditions
 * 11. Bilingual Response Support - Arabic-English mixed responses with proper formatting
 * 12. Expert Review Integration - Professional validation, disclaimer requirements, expert contacts
 */