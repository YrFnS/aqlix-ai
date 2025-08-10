/**
 * Enhanced Browser Automation Integration for Iraqi AI Chat System
 * Extracted from Botpress/integrations/browser/integration.definition.ts
 * Enhanced with Iraqi government website automation and Arabic form handling
 */

import { IntegrationDefinition } from '@botpress/client';
import { z } from 'zod';

// Iraqi government website categories
const IraqiGovSites = {
  EDUCATION: 'education',
  HEALTH: 'health',
  LEGAL: 'legal',
  MUNICIPAL: 'municipal',
  FEDERAL: 'federal',
  PROVINCIAL: 'provincial'
} as const;

// Iraqi form field types
const IraqiFormFields = {
  ARABIC_NAME: 'arabic_name',
  ENGLISH_NAME: 'english_name',
  NATIONAL_ID: 'national_id',
  PHONE_IRAQI: 'phone_iraqi',
  ADDRESS_IRAQ: 'address_iraq',
  PROFESSION: 'profession',
  EDUCATION_LEVEL: 'education_level',
  CIVIL_STATUS: 'civil_status',
  RELIGION: 'religion'
} as const;

// Enhanced browser automation schemas
const iraqiWebsiteSchema = z.object({
  url: z.string().url(),
  category: z.enum([
    IraqiGovSites.EDUCATION, 
    IraqiGovSites.HEALTH, 
    IraqiGovSites.LEGAL, 
    IraqiGovSites.MUNICIPAL, 
    IraqiGovSites.FEDERAL, 
    IraqiGovSites.PROVINCIAL
  ]),
  language: z.enum(['arabic', 'english', 'mixed']).default('arabic'),
  rtlSupport: z.boolean().default(true),
  requiresAuth: z.boolean().default(false),
  formComplexity: z.enum(['simple', 'medium', 'complex']).default('medium')
});

const iraqiFormDataSchema = z.object({
  personalInfo: z.object({
    arabicFirstName: z.string().optional(),
    arabicLastName: z.string().optional(),
    englishFirstName: z.string().optional(),
    englishLastName: z.string().optional(),
    nationalId: z.string().regex(/^\d{12}$/, 'رقم الهوية يجب أن يكون 12 رقم').optional(), // National ID must be 12 digits
    phoneNumber: z.string().regex(/^(\+964|0)(77|78|79|75|73)\d{8}$/, 'رقم الهاتف العراقي غير صحيح').optional(), // Invalid Iraqi phone number
    email: z.string().email('البريد الإلكتروني غير صحيح').optional(), // Invalid email
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    gender: z.enum(['male', 'female', 'ذكر', 'أنثى']).optional(),
    civilStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'أعزب', 'متزوج', 'مطلق', 'أرمل']).optional(),
    religion: z.enum(['muslim', 'christian', 'other', 'مسلم', 'مسيحي', 'أخرى']).optional()
  }),
  
  addressInfo: z.object({
    governorate: z.string().optional(), // محافظة
    district: z.string().optional(),    // قضاء
    subDistrict: z.string().optional(), // ناحية
    neighborhood: z.string().optional(), // حي
    street: z.string().optional(),       // شارع
    houseNumber: z.string().optional(),  // رقم الدار
    zipCode: z.string().optional()
  }),
  
  professionalInfo: z.object({
    occupation: z.string().optional(),
    employer: z.string().optional(),
    workAddress: z.string().optional(),
    educationLevel: z.enum([
      'primary', 'secondary', 'diploma', 'bachelor', 'master', 'phd',
      'ابتدائية', 'ثانوية', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه'
    ]).optional(),
    specialization: z.string().optional()
  }),
  
  customFields: z.record(z.string()).optional()
});

export default {
  name: 'iraqi-browser-automation',
  version: '2.0.0',
  title: 'Iraqi Browser Automation Integration',
  description: 'Enhanced browser automation for Iraqi government websites and Arabic forms',
  icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png',
  readme: 'docs/readme.md',
  
  configuration: {
    schema: z.object({
      // Browser configuration
      browserSettings: z.object({
        headless: z.boolean().default(true),
        slowMo: z.number().default(0), // Slow motion for Iraqi websites
        defaultTimeout: z.number().default(30000), // 30 seconds for slow Iraqi sites
        viewport: z.object({
          width: z.number().default(1366),
          height: z.number().default(768)
        }),
        userAgent: z.string().default('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      }),
      
      // Iraqi website specific settings
      iraqiWebsiteSettings: z.object({
        enableArabicKeyboard: z.boolean().default(true),
        rtlFormHandling: z.boolean().default(true),
        governmentSiteOptimization: z.boolean().default(true),
        captchaSolving: z.enum(['manual', 'service', 'disabled']).default('manual'),
        networkOptimization: z.boolean().default(true), // For slow Iraqi internet
        autoRetry: z.object({
          enabled: z.boolean().default(true),
          maxAttempts: z.number().default(3),
          delayBetweenAttempts: z.number().default(5000)
        })
      }),
      
      // Form automation settings
      formAutomation: z.object({
        enableSmartFill: z.boolean().default(true),
        validateBeforeSubmit: z.boolean().default(true),
        saveFormProgress: z.boolean().default(true),
        handleDynamicFields: z.boolean().default(true),
        arabicTextInput: z.object({
          enabled: z.boolean().default(true),
          fontSupport: z.boolean().default(true),
          rtlAlignment: z.boolean().default(true)
        })
      }),
      
      // Security and privacy
      security: z.object({
        enablePrivateMode: z.boolean().default(true),
        clearCookiesAfterSession: z.boolean().default(true),
        enableProxy: z.boolean().default(false),
        proxyConfig: z.object({
          server: z.string().optional(),
          username: z.string().optional(),
          password: z.string().optional()
        }).optional(),
        dataEncryption: z.boolean().default(true)
      }),
      
      // Performance optimization for Iraqi internet
      performanceSettings: z.object({
        enableImageBlocking: z.boolean().default(false),
        enableCSSBlocking: z.boolean().default(false),
        enableJSOptimization: z.boolean().default(true),
        connectionTimeout: z.number().default(60000), // 60 seconds for slow connections
        pageLoadTimeout: z.number().default(90000),   // 90 seconds for government sites
        networkIdle: z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']).default('networkidle2')
      })
    })
  },

  channels: {
    browser: {
      messages: {
        // Form submission results
        form_submitted: {
          schema: z.object({
            websiteUrl: z.string().url(),
            formId: z.string(),
            submissionId: z.string(),
            status: z.enum(['success', 'failed', 'pending', 'requires_verification']),
            submittedData: z.record(z.any()),
            confirmationNumber: z.string().optional(),
            errors: z.array(z.string()).optional(),
            timestamp: z.string().datetime(),
            processingTime: z.number(),
            screenshotUrl: z.string().url().optional()
          })
        },
        
        // Website interaction results
        interaction_result: {
          schema: z.object({
            action: z.string(),
            selector: z.string().optional(),
            success: z.boolean(),
            result: z.any(),
            errorMessage: z.string().optional(),
            timestamp: z.string().datetime(),
            pageUrl: z.string().url(),
            screenshotUrl: z.string().url().optional()
          })
        },
        
        // Iraqi government site status
        gov_site_status: {
          schema: z.object({
            siteUrl: z.string().url(),
            category: z.enum([
              IraqiGovSites.EDUCATION, 
              IraqiGovSites.HEALTH, 
              IraqiGovSites.LEGAL, 
              IraqiGovSites.MUNICIPAL, 
              IraqiGovSites.FEDERAL, 
              IraqiGovSites.PROVINCIAL
            ]),
            status: z.enum(['online', 'offline', 'slow', 'maintenance', 'error']),
            responseTime: z.number(),
            lastChecked: z.string().datetime(),
            serviceAvailability: z.object({
              formsWorking: z.boolean(),
              authWorking: z.boolean(),
              downloadsWorking: z.boolean(),
              searchWorking: z.boolean()
            })
          })
        }
      }
    }
  },

  actions: {
    // Navigate to Iraqi government website
    navigateToGovSite: {
      title: 'الانتقال إلى موقع حكومي', // Navigate to Government Site
      description: 'Navigate to Iraqi government website with optimized settings',
      
      input: {
        schema: iraqiWebsiteSchema.extend({
          waitForElement: z.string().optional(),
          waitTime: z.number().default(5000),
          takeScreenshot: z.boolean().default(true)
        })
      },
      
      output: {
        schema: z.object({
          success: z.boolean(),
          url: z.string(),
          title: z.string(),
          isArabic: z.boolean(),
          hasRtlSupport: z.boolean(),
          formElements: z.array(z.object({
            id: z.string().optional(),
            name: z.string().optional(),
            type: z.string(),
            label: z.string().optional(),
            required: z.boolean(),
            arabicLabel: z.string().optional()
          })),
          loadTime: z.number(),
          screenshotUrl: z.string().optional(),
          errors: z.array(z.string()).optional()
        })
      }
    },

    // Fill Iraqi government form
    fillIraqiForm: {
      title: 'ملء النموذج العراقي', // Fill Iraqi Form
      description: 'Automatically fill Iraqi government forms with cultural validation',
      
      input: {
        schema: z.object({
          websiteUrl: z.string().url(),
          formData: iraqiFormDataSchema,
          formSelectors: z.record(z.string()).optional(), // Custom selectors mapping
          submitForm: z.boolean().default(false),
          validateBeforeSubmit: z.boolean().default(true),
          waitForConfirmation: z.boolean().default(true),
          saveProgress: z.boolean().default(true)
        })
      },
      
      output: {
        schema: z.object({
          success: z.boolean(),
          filledFields: z.array(z.string()),
          skippedFields: z.array(z.string()),
          errors: z.array(z.object({
            field: z.string(),
            error: z.string(),
            arabicError: z.string().optional()
          })),
          validationResults: z.object({
            requiredFieldsMissing: z.array(z.string()),
            invalidFormats: z.array(z.string()),
            culturalValidation: z.object({
              passed: z.boolean(),
              issues: z.array(z.string())
            })
          }),
          submissionResult: z.object({
            submitted: z.boolean(),
            confirmationNumber: z.string().optional(),
            nextSteps: z.array(z.string()).optional()
          }).optional(),
          processingTime: z.number(),
          screenshotsUrls: z.array(z.string()).optional()
        })
      }
    },

    // Check Iraqi government service status
    checkGovServiceStatus: {
      title: 'فحص حالة الخدمة الحكومية', // Check Government Service Status
      description: 'Check availability and status of Iraqi government online services',
      
      input: {
        schema: z.object({
          services: z.array(z.object({
            name: z.string(),
            url: z.string().url(),
            category: z.enum([
              IraqiGovSites.EDUCATION, 
              IraqiGovSites.HEALTH, 
              IraqiGovSites.LEGAL, 
              IraqiGovSites.MUNICIPAL, 
              IraqiGovSites.FEDERAL, 
              IraqiGovSites.PROVINCIAL
            ]),
            expectedElements: z.array(z.string()).optional()
          })),
          deepCheck: z.boolean().default(false),
          timeout: z.number().default(30000)
        })
      },
      
      output: {
        schema: z.object({
          overallStatus: z.enum(['healthy', 'degraded', 'down']),
          services: z.array(z.object({
            name: z.string(),
            url: z.string(),
            status: z.enum(['online', 'offline', 'slow', 'maintenance', 'error']),
            responseTime: z.number(),
            availability: z.object({
              website: z.boolean(),
              forms: z.boolean(),
              authentication: z.boolean(),
              downloads: z.boolean(),
              search: z.boolean()
            }),
            errors: z.array(z.string()).optional(),
            lastChecked: z.string().datetime()
          })),
          recommendations: z.array(z.string()),
          nextCheckSuggested: z.string().datetime()
        })
      }
    },

    // Extract data from Iraqi documents/forms
    extractIraqiDocumentData: {
      title: 'استخراج بيانات الوثائق العراقية', // Extract Iraqi Document Data
      description: 'Extract and structure data from Iraqi government documents and forms',
      
      input: {
        schema: z.object({
          documentUrl: z.string().url(),
          documentType: z.enum(['certificate', 'license', 'permit', 'application', 'report']),
          language: z.enum(['arabic', 'english', 'mixed']),
          extractionRules: z.object({
            personalInfo: z.boolean().default(true),
            officialNumbers: z.boolean().default(true),
            dates: z.boolean().default(true),
            addresses: z.boolean().default(true),
            signatures: z.boolean().default(false)
          }),
          ocrSettings: z.object({
            enableArabicOCR: z.boolean().default(true),
            confidenceThreshold: z.number().default(0.8)
          }).optional()
        })
      },
      
      output: {
        schema: z.object({
          extractedData: z.object({
            personalInfo: z.record(z.string()).optional(),
            documentNumbers: z.record(z.string()).optional(),
            dates: z.record(z.string()).optional(),
            addresses: z.record(z.string()).optional(),
            officialSeals: z.array(z.string()).optional(),
            customFields: z.record(z.string()).optional()
          }),
          confidence: z.number().min(0).max(1),
          language: z.string(),
          processingTime: z.number(),
          quality: z.object({
            imageQuality: z.number().min(0).max(1),
            textClarity: z.number().min(0).max(1),
            structureRecognition: z.number().min(0).max(1)
          }),
          issues: z.array(z.string()).optional()
        })
      }
    },

    // Interact with Iraqi banking websites
    interactWithIraqiBankSite: {
      title: 'التفاعل مع مواقع البنوك العراقية', // Interact with Iraqi Bank Sites
      description: 'Safely interact with Iraqi banking websites for account information',
      
      input: {
        schema: z.object({
          bankUrl: z.string().url(),
          action: z.enum(['check_balance', 'view_statement', 'check_services', 'get_rates']),
          authMethod: z.enum(['otp', 'biometric', 'card', 'manual']),
          securitySettings: z.object({
            enableScreenshotBlocking: z.boolean().default(true),
            enableDataEncryption: z.boolean().default(true),
            clearDataAfter: z.boolean().default(true)
          }),
          timeout: z.number().default(60000)
        })
      },
      
      output: {
        schema: z.object({
          success: z.boolean(),
          action: z.string(),
          result: z.record(z.any()).optional(),
          securityStatus: z.object({
            connectionSecure: z.boolean(),
            certificateValid: z.boolean(),
            dataEncrypted: z.boolean()
          }),
          processingTime: z.number(),
          warnings: z.array(z.string()).optional(),
          nextSteps: z.array(z.string()).optional()
        })
      }
    }
  },

  events: {
    // Form submission events
    formSubmissionStarted: {
      schema: z.object({
        websiteUrl: z.string(),
        formId: z.string(),
        userId: z.string(),
        timestamp: z.string().datetime()
      })
    },
    
    formSubmissionCompleted: {
      schema: z.object({
        websiteUrl: z.string(),
        formId: z.string(),
        userId: z.string(),
        success: z.boolean(),
        confirmationNumber: z.string().optional(),
        timestamp: z.string().datetime(),
        processingTime: z.number()
      })
    },

    // Website status events
    govSiteDown: {
      schema: z.object({
        siteUrl: z.string(),
        siteName: z.string(),
        category: z.string(),
        downtime: z.number(),
        affectedServices: z.array(z.string()),
        timestamp: z.string().datetime()
      })
    },

    govSiteRestored: {
      schema: z.object({
        siteUrl: z.string(),
        siteName: z.string(),
        category: z.string(),
        downtimeDuration: z.number(),
        timestamp: z.string().datetime()
      })
    },

    // Security events
    securityViolationDetected: {
      schema: z.object({
        siteUrl: z.string(),
        violationType: z.enum(['certificate', 'malware', 'phishing', 'suspicious']),
        description: z.string(),
        riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
        timestamp: z.string().datetime(),
        actionTaken: z.string()
      })
    }
  },

  states: {
    // Browser session state
    browserSession: {
      type: 'user',
      schema: z.object({
        active: z.boolean().default(false),
        currentUrl: z.string().optional(),
        sessionId: z.string(),
        startTime: z.string().datetime(),
        lastActivity: z.string().datetime(),
        pagesVisited: z.array(z.string()).default([]),
        formsCompleted: z.number().default(0)
      })
    },

    // Iraqi government sites monitoring
    govSitesStatus: {
      type: 'integration',
      schema: z.record(z.object({
        status: z.enum(['online', 'offline', 'slow', 'maintenance']),
        lastChecked: z.string().datetime(),
        responseTime: z.number(),
        uptime: z.number().default(0),
        downtimeEvents: z.array(z.object({
          start: z.string().datetime(),
          end: z.string().datetime().optional(),
          duration: z.number().optional()
        })).default([])
      }))
    },

    // Form automation history
    formHistory: {
      type: 'user',
      schema: z.object({
        completedForms: z.array(z.object({
          websiteUrl: z.string(),
          formType: z.string(),
          completedAt: z.string().datetime(),
          success: z.boolean(),
          confirmationNumber: z.string().optional()
        })).default([]),
        savedData: z.record(z.string()).default({}),
        preferences: z.object({
          autoFill: z.boolean().default(true),
          saveProgress: z.boolean().default(true),
          enableNotifications: z.boolean().default(true)
        })
      })
    }
  }
} as const satisfies IntegrationDefinition;

/**
 * Iraqi AI Chat System Browser Automation Enhancements Applied:
 * 
 * 1. Iraqi Government Site Optimization - Education, health, legal, municipal website support
 * 2. Arabic Form Handling - RTL text input, Arabic keyboard support, font rendering
 * 3. Iraqi Personal Data Schema - National ID, phone, address, profession validation
 * 4. Network Optimization - Slow connection handling, extended timeouts for Iraqi internet
 * 5. Cultural Form Validation - Islamic compliance, Iraqi cultural norms validation
 * 6. Government Service Monitoring - Real-time status checking for Iraqi online services
 * 7. Document Data Extraction - Arabic OCR, Iraqi document structure recognition
 * 8. Banking Integration - Secure interaction with Iraqi banking websites
 * 9. Multi-language Support - Arabic, English, mixed content handling
 * 10. Security Enhancements - Data encryption, screenshot blocking, session cleanup
 * 11. Performance Optimization - Image/CSS blocking options for slow connections
 * 12. Progress Saving - Form completion tracking and resume functionality
 */