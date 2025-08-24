import type { ComponentInspectorConfig } from '../types';

/**
 * ConfigManager - Configuration management for Component Inspector
 * 
 * Handles configuration merging, validation, and defaults for:
 * - Cultural settings and validation rules
 * - Performance targets and optimization settings  
 * - Accessibility standards and requirements
 * - Security and privacy configurations
 * - Caching strategies and TTL settings
 */
export class ConfigManager {
  private defaultConfig: ComponentInspectorConfig;

  constructor() {
    this.defaultConfig = this.createDefaultConfig();
  }

  /**
   * Merge user config with defaults
   */
  merge(userConfig?: Partial<ComponentInspectorConfig>): ComponentInspectorConfig {
    if (!userConfig) {
      return this.defaultConfig;
    }

    return {
      cultural: {
        ...this.defaultConfig.cultural,
        ...userConfig.cultural,
        validation: {
          ...this.defaultConfig.cultural.validation,
          ...userConfig.cultural?.validation
        },
        language: {
          ...this.defaultConfig.cultural.language,
          ...userConfig.cultural?.language
        },
        patterns: {
          ...this.defaultConfig.cultural.patterns,
          ...userConfig.cultural?.patterns
        }
      },
      performance: {
        ...this.defaultConfig.performance,
        ...userConfig.performance,
        targets: {
          ...this.defaultConfig.performance.targets,
          ...userConfig.performance?.targets
        },
        arabic: {
          ...this.defaultConfig.performance.arabic,
          ...userConfig.performance?.arabic
        },
        profiling: {
          ...this.defaultConfig.performance.profiling,
          ...userConfig.performance?.profiling
        }
      },
      accessibility: {
        ...this.defaultConfig.accessibility,
        ...userConfig.accessibility,
        standards: {
          ...this.defaultConfig.accessibility.standards,
          ...userConfig.accessibility?.standards
        },
        testing: {
          ...this.defaultConfig.accessibility.testing,
          ...userConfig.accessibility?.testing
        }
      },
      security: {
        ...this.defaultConfig.security,
        ...userConfig.security
      },
      caching: {
        ...this.defaultConfig.caching,
        ...userConfig.caching
      }
    };
  }

  /**
   * Validate configuration
   */
  validate(config: ComponentInspectorConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate cultural config
    if (!config.cultural.language.primary) {
      errors.push('Cultural language primary is required');
    }

    // Validate performance targets
    if (config.performance.targets.renderTime < 1) {
      errors.push('Performance render time target must be at least 1ms');
    }

    if (config.performance.targets.accessibility < 80) {
      warnings.push('Accessibility target below 80% may not meet government standards');
    }

    // Validate accessibility standards
    if (config.accessibility.standards.wcag !== 'AA' && config.accessibility.standards.wcag !== 'AAA') {
      warnings.push('WCAG level should be AA or AAA for government compliance');
    }

    // Validate caching config
    if (config.caching.enabled && config.caching.ttl < 60) {
      warnings.push('Cache TTL below 60 seconds may cause excessive cache churn');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get ministry-specific config overrides
   */
  getMinistryConfig(ministry: string): Partial<ComponentInspectorConfig> {
    const ministryConfigs: Record<string, Partial<ComponentInspectorConfig>> = {
      interior: {
        cultural: {
          validation: {
            islamicCompliance: true,
            governmentStandards: true,
            ministrySpecific: 'interior'
          }
        },
        security: {
          dataProtection: true,
          governmentCompliance: true,
          privacyValidation: true
        },
        accessibility: {
          standards: {
            wcag: 'AAA',
            iraqiGovernment: true,
            rtlCompliance: true
          }
        }
      },
      health: {
        cultural: {
          validation: {
            islamicCompliance: true,
            governmentStandards: true,
            ministrySpecific: 'health'
          }
        },
        accessibility: {
          standards: {
            wcag: 'AAA', // Medical grade accessibility
            iraqiGovernment: true,
            rtlCompliance: true
          },
          testing: {
            automated: true,
            screenReaderTesting: true,
            keyboardNavigation: true
          }
        },
        performance: {
          targets: {
            renderTime: 12, // Faster for medical emergencies
            bundleSize: '80kb',
            accessibility: 98
          }
        }
      },
      education: {
        cultural: {
          validation: {
            islamicCompliance: true,
            governmentStandards: true,
            ministrySpecific: 'education'
          },
          language: {
            primary: 'ar-IQ',
            fallback: 'en-US',
            rtlOptimization: true
          }
        },
        accessibility: {
          standards: {
            wcag: 'AA',
            iraqiGovernment: true,
            rtlCompliance: true
          }
        }
      },
      justice: {
        cultural: {
          validation: {
            islamicCompliance: true,
            governmentStandards: true,
            ministrySpecific: 'justice'
          }
        },
        security: {
          dataProtection: true,
          governmentCompliance: true,
          privacyValidation: true
        },
        accessibility: {
          standards: {
            wcag: 'AAA', // Legal documents require highest accessibility
            iraqiGovernment: true,
            rtlCompliance: true
          }
        }
      }
    };

    return ministryConfigs[ministry] || {};
  }

  private createDefaultConfig(): ComponentInspectorConfig {
    return {
      cultural: {
        validation: {
          islamicCompliance: true,
          governmentStandards: true,
          ministrySpecific: undefined
        },
        language: {
          primary: 'ar-IQ',
          fallback: 'en-US',
          rtlOptimization: true
        },
        patterns: {
          detectGovernmentPatterns: true,
          enforceIslamicDesign: true,
          validateCulturalContent: true
        }
      },
      performance: {
        targets: {
          renderTime: 16, // 60fps target
          bundleSize: '100kb',
          accessibility: 95
        },
        arabic: {
          fontOptimization: true,
          rtlProfiling: true,
          mixedContentAnalysis: true
        },
        profiling: {
          enableRealTime: true,
          sampleRate: 0.1, // 10% sampling
          metricsCollection: ['render-time', 'memory-usage', 'rtl-performance']
        }
      },
      accessibility: {
        standards: {
          wcag: 'AA',
          iraqiGovernment: true,
          rtlCompliance: true
        },
        testing: {
          automated: true,
          screenReaderTesting: true,
          keyboardNavigation: true
        }
      },
      security: {
        dataProtection: true,
        governmentCompliance: true,
        privacyValidation: true
      },
      caching: {
        enabled: true,
        ttl: 3600, // 1 hour
        strategies: ['memory', 'disk']
      }
    };
  }
}
