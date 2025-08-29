/**
 * Iraqi AI Chat System Production Deployment Package
 * Entry point for comprehensive production deployment orchestration
 * 
 * This package provides complete deployment orchestration for the Iraqi AI Chat System including:
 * - Component Health Monitoring: Real-time health checks for all Iraqi AI components
 * - Performance Metrics Collection: Prometheus metrics for cultural validation performance
 * - Cultural Intelligence Monitoring: Specialized metrics for Islamic compliance and Iraqi cultural appropriateness
 * - Auto-scaling Configuration: Intelligent scaling based on cultural processing load
 * - Error Alerting: Comprehensive alerting for cultural compliance violations
 * - Deployment Validation: End-to-end validation of Iraqi cultural intelligence features
 * 
 * Production Targets:
 * - System Uptime: >99.9% with cultural intelligence preserved
 * - Health Check Response: <100ms for component health validation
 * - Cultural Validation Monitoring: Real-time Islamic compliance tracking
 * - Performance Metrics: <200ms cultural validation, <300ms Arabic NLP processing
 * - Auto-scaling: Based on cultural processing load and Arabic text volume
 * - Error Detection: <5s detection of cultural compliance violations
 * 
 * @author Iraqi AI Development Team
 * @version 1.0.0
 * @license MIT
 */

// ========================================================================================
// CORE EXPORTS
// ========================================================================================

// Orchestration
export {
  IraqiDeploymentOrchestrator
} from './orchestration/iraqi-deployment-orchestrator.js';

// Types
export type {
  DeploymentEnvironment,
  ComponentHealthStatus,
  IraqiDeploymentConfig
} from './orchestration/iraqi-deployment-orchestrator.js';

// ========================================================================================
// CONVENIENCE EXPORTS
// ========================================================================================

/**
 * Default Iraqi Deployment Configuration
 * Production-optimized configuration for Iraqi cultural intelligence monitoring
 */
export const DEFAULT_IRAQI_DEPLOYMENT_CONFIG: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig = {
  environment: 'production',
  
  components: {
    cultural_engine: {
      enabled: true,
      timeout_ms: 200,                     // 200ms for cultural validation
      performance_threshold: 90,           // 90% performance threshold
      islamic_compliance_threshold: 98     // 98% Islamic compliance required
    },
    
    arabic_nlp: {
      enabled: true,
      timeout_ms: 300,                     // 300ms for Arabic NLP processing
      accuracy_threshold: 90,              // 90% overall accuracy
      dialect_recognition_threshold: 85    // 85% Iraqi dialect recognition
    },
    
    professional_validator: {
      enabled: true,
      timeout_ms: 500,                     // 500ms for professional validation
      accuracy_threshold: 95,              // 95% professional accuracy
      compliance_threshold: 90             // 90% regulatory compliance
    },
    
    cultural_learning: {
      enabled: true,
      timeout_ms: 200,                     // 200ms for ML inference
      inference_threshold: 90,             // 90% prediction accuracy
      learning_rate_threshold: 85          // 85% learning effectiveness
    }
  },
  
  monitoring: {
    health_check_interval: 30000,          // 30s health check interval
    performance_monitoring: true,          // Enable performance monitoring
    cultural_metrics_collection: true,     // Enable cultural metrics
    error_alerting: true                   // Enable error alerting
  },
  
  scaling: {
    auto_scaling: true,                    // Enable auto-scaling
    min_instances: 2,                      // Minimum 2 instances for HA
    max_instances: 10,                     // Maximum 10 instances
    cpu_threshold: 70,                     // Scale at 70% CPU
    memory_threshold: 80                   // Scale at 80% memory
  }
};

/**
 * Staging Iraqi Deployment Configuration
 * Staging environment configuration with relaxed thresholds for testing
 */
export const STAGING_IRAQI_DEPLOYMENT_CONFIG: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig = {
  ...DEFAULT_IRAQI_DEPLOYMENT_CONFIG,
  environment: 'staging',
  
  components: {
    cultural_engine: {
      enabled: true,
      timeout_ms: 500,                     // Relaxed timeout for staging
      performance_threshold: 80,           // 80% performance threshold
      islamic_compliance_threshold: 90     // 90% Islamic compliance (relaxed)
    },
    
    arabic_nlp: {
      enabled: true,
      timeout_ms: 600,                     // Relaxed timeout for staging
      accuracy_threshold: 80,              // 80% overall accuracy
      dialect_recognition_threshold: 75    // 75% Iraqi dialect recognition
    },
    
    professional_validator: {
      enabled: true,
      timeout_ms: 1000,                    // Relaxed timeout for staging
      accuracy_threshold: 85,              // 85% professional accuracy
      compliance_threshold: 80             // 80% regulatory compliance
    },
    
    cultural_learning: {
      enabled: true,
      timeout_ms: 500,                     // Relaxed timeout for staging
      inference_threshold: 80,             // 80% prediction accuracy
      learning_rate_threshold: 75          // 75% learning effectiveness
    }
  },
  
  monitoring: {
    health_check_interval: 10000,          // 10s health check interval (more frequent)
    performance_monitoring: true,          // Enable performance monitoring
    cultural_metrics_collection: true,     // Enable cultural metrics
    error_alerting: false                  // Disable alerting in staging
  },
  
  scaling: {
    auto_scaling: false,                   // Disable auto-scaling in staging
    min_instances: 1,                      // Single instance for staging
    max_instances: 3,                      // Maximum 3 instances
    cpu_threshold: 80,                     // Scale at 80% CPU
    memory_threshold: 90                   // Scale at 90% memory
  }
};

/**
 * Development Iraqi Deployment Configuration
 * Development environment configuration for local testing
 */
export const DEVELOPMENT_IRAQI_DEPLOYMENT_CONFIG: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig = {
  environment: 'development',
  
  components: {
    cultural_engine: {
      enabled: true,
      timeout_ms: 1000,                    // 1s timeout for development
      performance_threshold: 70,           // 70% performance threshold
      islamic_compliance_threshold: 80     // 80% Islamic compliance (relaxed)
    },
    
    arabic_nlp: {
      enabled: true,
      timeout_ms: 1500,                    // 1.5s timeout for development
      accuracy_threshold: 70,              // 70% overall accuracy
      dialect_recognition_threshold: 65    // 65% Iraqi dialect recognition
    },
    
    professional_validator: {
      enabled: false,                      // Disabled in development
      timeout_ms: 2000,                    // 2s timeout if enabled
      accuracy_threshold: 70,              // 70% professional accuracy
      compliance_threshold: 70             // 70% regulatory compliance
    },
    
    cultural_learning: {
      enabled: false,                      // Disabled in development
      timeout_ms: 1000,                    // 1s timeout if enabled
      inference_threshold: 70,             // 70% prediction accuracy
      learning_rate_threshold: 65          // 65% learning effectiveness
    }
  },
  
  monitoring: {
    health_check_interval: 5000,           // 5s health check interval
    performance_monitoring: false,         // Disable performance monitoring
    cultural_metrics_collection: false,    // Disable cultural metrics
    error_alerting: false                  // Disable error alerting
  },
  
  scaling: {
    auto_scaling: false,                   // Disable auto-scaling
    min_instances: 1,                      // Single instance
    max_instances: 1,                      // Single instance
    cpu_threshold: 90,                     // High CPU threshold
    memory_threshold: 95                   // High memory threshold
  }
};

// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================

/**
 * Create Iraqi Deployment Orchestrator with environment-specific configuration
 * @param environment Deployment environment
 * @param customConfig Optional custom configuration overrides
 * @returns Configured IraqiDeploymentOrchestrator instance
 */
export function createIraqiDeploymentOrchestrator(
  environment: import('./orchestration/iraqi-deployment-orchestrator.js').DeploymentEnvironment = 'production',
  customConfig?: Partial<import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig>
): import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentOrchestrator {
  // Select base configuration based on environment
  let baseConfig: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig;
  
  switch (environment) {
    case 'production':
      baseConfig = DEFAULT_IRAQI_DEPLOYMENT_CONFIG;
      break;
    case 'staging':
      baseConfig = STAGING_IRAQI_DEPLOYMENT_CONFIG;
      break;
    case 'development':
      baseConfig = DEVELOPMENT_IRAQI_DEPLOYMENT_CONFIG;
      break;
    default:
      baseConfig = DEFAULT_IRAQI_DEPLOYMENT_CONFIG;
  }

  // Merge custom configuration
  const config = {
    ...baseConfig,
    ...customConfig,
    // Deep merge nested objects
    components: {
      ...baseConfig.components,
      ...customConfig?.components,
      cultural_engine: {
        ...baseConfig.components.cultural_engine,
        ...customConfig?.components?.cultural_engine
      },
      arabic_nlp: {
        ...baseConfig.components.arabic_nlp,
        ...customConfig?.components?.arabic_nlp
      },
      professional_validator: {
        ...baseConfig.components.professional_validator,
        ...customConfig?.components?.professional_validator
      },
      cultural_learning: {
        ...baseConfig.components.cultural_learning,
        ...customConfig?.components?.cultural_learning
      }
    },
    monitoring: {
      ...baseConfig.monitoring,
      ...customConfig?.monitoring
    },
    scaling: {
      ...baseConfig.scaling,
      ...customConfig?.scaling
    }
  };

  return new import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentOrchestrator(config);
}

/**
 * Get deployment configuration for environment
 * @param environment Target deployment environment
 * @returns Environment-specific deployment configuration
 */
export function getDeploymentConfig(
  environment: import('./orchestration/iraqi-deployment-orchestrator.js').DeploymentEnvironment
): import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig {
  switch (environment) {
    case 'production':
      return DEFAULT_IRAQI_DEPLOYMENT_CONFIG;
    case 'staging':
      return STAGING_IRAQI_DEPLOYMENT_CONFIG;
    case 'development':
      return DEVELOPMENT_IRAQI_DEPLOYMENT_CONFIG;
    default:
      throw new Error(`Unknown deployment environment: ${environment}`);
  }
}

/**
 * Validate deployment configuration
 * @param config Deployment configuration to validate
 * @returns Validation result with any issues found
 */
export function validateDeploymentConfig(
  config: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentConfig
): {
  valid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Validate component timeouts
  if (config.components.cultural_engine.enabled && config.components.cultural_engine.timeout_ms > 500) {
    issues.push('Cultural engine timeout exceeds recommended 500ms');
    recommendations.push('Consider optimizing cultural validation for better user experience');
  }

  if (config.components.arabic_nlp.enabled && config.components.arabic_nlp.timeout_ms > 600) {
    issues.push('Arabic NLP timeout exceeds recommended 600ms');
    recommendations.push('Consider optimizing Arabic processing pipeline');
  }

  // Validate thresholds
  if (config.components.cultural_engine.islamic_compliance_threshold < 95 && config.environment === 'production') {
    issues.push('Islamic compliance threshold below 95% for production environment');
    recommendations.push('Maintain high Islamic compliance standards in production');
  }

  if (config.components.arabic_nlp.dialect_recognition_threshold < 80 && config.environment === 'production') {
    issues.push('Iraqi dialect recognition threshold below 80% for production');
    recommendations.push('Improve dialect recognition accuracy for better user experience');
  }

  // Validate scaling configuration
  if (config.scaling.auto_scaling && config.scaling.min_instances < 2 && config.environment === 'production') {
    issues.push('Minimum instances less than 2 for production auto-scaling');
    recommendations.push('Use at least 2 instances for high availability in production');
  }

  // Validate monitoring
  if (!config.monitoring.cultural_metrics_collection && config.environment === 'production') {
    recommendations.push('Enable cultural metrics collection for production monitoring');
  }

  return {
    valid: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Generate health check endpoint handler
 * @param orchestrator Iraqi Deployment Orchestrator instance
 * @returns Express.js compatible health check handler
 */
export function createHealthCheckHandler(
  orchestrator: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentOrchestrator
) {
  return async (req: any, res: any) => {
    try {
      const health = await orchestrator.getSystemHealth();
      
      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'degraded' ? 206 : 500;
      
      res.status(statusCode).json({
        status: health.status,
        timestamp: health.timestamp,
        overall_score: health.overall_score,
        cultural_intelligence_score: health.cultural_intelligence_score,
        components: health.components.reduce((acc, component) => {
          acc[component.component] = {
            status: component.status,
            response_time: component.response_time,
            performance_score: component.performance_score,
            cultural_compliance: component.cultural_compliance
          };
          return acc;
        }, {} as Record<string, any>)
      });
      
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date()
      });
    }
  };
}

/**
 * Generate Prometheus metrics endpoint handler
 * @param orchestrator Iraqi Deployment Orchestrator instance
 * @returns Express.js compatible metrics handler
 */
export function createMetricsHandler(
  orchestrator: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentOrchestrator
) {
  return async (req: any, res: any) => {
    try {
      const register = orchestrator.getMetricsRegistry();
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}

/**
 * Performance benchmark test for Iraqi AI components
 * @param orchestrator Deployment orchestrator instance
 * @returns Benchmark results
 */
export async function runIraqiAIBenchmark(
  orchestrator: import('./orchestration/iraqi-deployment-orchestrator.js').IraqiDeploymentOrchestrator
): Promise<{
  cultural_engine: {
    avg_response_time: number;
    islamic_compliance_score: number;
    cultural_appropriateness_score: number;
  };
  arabic_nlp: {
    avg_processing_time: number;
    dialect_accuracy: number;
    context_extraction_accuracy: number;
  };
  professional_validator: {
    avg_validation_time: number;
    professional_accuracy: number;
    regulatory_compliance: number;
  };
  cultural_learning: {
    avg_inference_time: number;
    prediction_accuracy: number;
    learning_effectiveness: number;
  };
  overall_benchmark: {
    total_test_time: number;
    system_performance_score: number;
    cultural_intelligence_score: number;
  };
}> {
  const startTime = Date.now();
  
  // Run health checks to get component performance
  const health = await orchestrator.getSystemHealth();
  
  // Calculate component-specific metrics
  const components = health.components.reduce((acc, component) => {
    acc[component.component] = component;
    return acc;
  }, {} as Record<string, any>);

  const results = {
    cultural_engine: {
      avg_response_time: components['cultural_engine']?.response_time || 0,
      islamic_compliance_score: components['cultural_engine']?.cultural_compliance || 0,
      cultural_appropriateness_score: components['cultural_engine']?.performance_score || 0
    },
    arabic_nlp: {
      avg_processing_time: components['arabic_nlp']?.response_time || 0,
      dialect_accuracy: components['arabic_nlp']?.cultural_compliance || 0,
      context_extraction_accuracy: components['arabic_nlp']?.performance_score || 0
    },
    professional_validator: {
      avg_validation_time: components['professional_validator']?.response_time || 0,
      professional_accuracy: components['professional_validator']?.performance_score || 0,
      regulatory_compliance: components['professional_validator']?.cultural_compliance || 0
    },
    cultural_learning: {
      avg_inference_time: components['cultural_learning']?.response_time || 0,
      prediction_accuracy: components['cultural_learning']?.performance_score || 0,
      learning_effectiveness: components['cultural_learning']?.cultural_compliance || 0
    },
    overall_benchmark: {
      total_test_time: Date.now() - startTime,
      system_performance_score: health.overall_score,
      cultural_intelligence_score: health.cultural_intelligence_score
    }
  };

  return results;
}

// ========================================================================================
// VERSION INFO
// ========================================================================================

/**
 * Iraqi Deployment System version information
 */
export const VERSION_INFO = {
  version: '1.0.0',
  build_date: '2025-01-28',
  api_version: 'v1',
  compatibility: {
    iraqi_cultural_engine: '^1.0.0',
    iraqi_arabic_nlp: '^1.0.0',
    iraqi_professional_domains: '^1.0.0',
    iraqi_cultural_learning: '^1.0.0',
    node: '>=18.0.0',
    bun: '>=1.0.0',
    docker: '>=20.0.0',
    kubernetes: '>=1.25.0'
  },
  features: {
    health_monitoring: true,
    performance_metrics: true,
    cultural_intelligence_tracking: true,
    auto_scaling: true,
    error_alerting: true,
    prometheus_integration: true,
    docker_support: true,
    kubernetes_support: true
  }
} as const;

/**
 * Get current version of the Iraqi Deployment System
 * @returns Version string
 */
export function getVersion(): string {
  return VERSION_INFO.version;
}

/**
 * Check if a feature is supported in the current version
 * @param feature Feature to check
 * @returns True if feature is supported, false otherwise
 */
export function isFeatureSupported(feature: keyof typeof VERSION_INFO.features): boolean {
  return VERSION_INFO.features[feature];
}

// ========================================================================================
// DEFAULT EXPORT
// ========================================================================================

/**
 * Default export: Iraqi Deployment Orchestrator class
 */
export { IraqiDeploymentOrchestrator as default } from './orchestration/iraqi-deployment-orchestrator.js';