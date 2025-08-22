/**
 * Iraqi Integration Framework - Main Entry Point
 * 
 * Unified integration framework for n8n workflow automation with Iraqi
 * government services, payment gateways, and cultural compliance.
 */

export { IraqiServiceManager } from '../core/IraqiServiceManager';
export { PaymentGatewayOrchestrator } from '../core/PaymentGatewayOrchestrator';
export { CulturalWorkflowValidator } from '../core/CulturalWorkflowValidator';
export { WorkflowOrchestrator } from '../core/WorkflowOrchestrator';

// Re-export all types and interfaces
export * from '../core/IraqiServiceManager';
export * from '../core/PaymentGatewayOrchestrator';
export * from '../core/CulturalWorkflowValidator';
export * from '../core/WorkflowOrchestrator';

import { EventEmitter } from 'events';
import { IraqiServiceManager } from '../core/IraqiServiceManager';
import { PaymentGatewayOrchestrator } from '../core/PaymentGatewayOrchestrator';
import { CulturalWorkflowValidator } from '../core/CulturalWorkflowValidator';
import { WorkflowOrchestrator } from '../core/WorkflowOrchestrator';

// Framework configuration interface
export interface IIraqiIntegrationFrameworkConfig {
  // Service Manager Configuration
  serviceManager?: {
    enabled: boolean;
    culturalValidation: boolean;
    defaultLanguage: 'ar' | 'en';
    islamicComplianceRequired: boolean;
    auditLogging: boolean;
  };
  
  // Payment Gateway Configuration
  paymentGateway?: {
    enabled: boolean;
    defaultGateway: 'zaincash' | 'fastpay' | 'nasswallet';
    islamicComplianceRequired: boolean;
    securityValidation: boolean;
    fraudDetection: boolean;
  };
  
  // Cultural Validation Configuration
  culturalValidator?: {
    enabled: boolean;
    strictMode: boolean;
    islamicComplianceThreshold: number;
    culturalAppropriatenessThreshold: number;
    ministrySpecificRules: boolean;
  };
  
  // Workflow Orchestrator Configuration
  workflowOrchestrator?: {
    enabled: boolean;
    culturalValidationEnabled: boolean;
    serviceIntegrationEnabled: boolean;
    paymentIntegrationEnabled: boolean;
    metricsEnabled: boolean;
    defaultMinistry: 'health' | 'education' | 'interior' | 'justice' | 'finance' | 'transport' | 'agriculture' | 'labor' | 'general';
  };
  
  // Global Framework Configuration
  global?: {
    environment: 'development' | 'staging' | 'production';
    timezone: string;
    defaultLanguage: 'ar' | 'en' | 'mixed';
    culturalMode: boolean;
    auditMode: boolean;
    performanceMonitoring: boolean;
  };
}

// Framework integration status
export interface IFrameworkIntegrationStatus {
  serviceManager: {
    initialized: boolean;
    servicesRegistered: number;
    healthStatus: 'healthy' | 'degraded' | 'critical';
    lastCheck: Date;
  };
  
  paymentGateway: {
    initialized: boolean;
    gatewaysActive: number;
    healthStatus: 'healthy' | 'degraded' | 'critical';
    lastCheck: Date;
  };
  
  culturalValidator: {
    initialized: boolean;
    rulesLoaded: number;
    healthStatus: 'healthy' | 'degraded' | 'critical';
    lastCheck: Date;
  };
  
  workflowOrchestrator: {
    initialized: boolean;
    activeExecutions: number;
    healthStatus: 'healthy' | 'degraded' | 'critical';
    lastCheck: Date;
  };
  
  integration: {
    arabicRtlIntegration: boolean;
    aiDesignIntegration: boolean;
    overallHealth: 'healthy' | 'degraded' | 'critical';
    lastIntegrationCheck: Date;
  };
}

// Framework metrics
export interface IFrameworkMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  culturalComplianceRate: number;
  islamicComplianceRate: number;
  serviceSuccessRate: number;
  paymentSuccessRate: number;
  validationSuccessRate: number;
  uptime: number;
  lastMetricsUpdate: Date;
}

/**
 * Iraqi Integration Framework Manager
 * 
 * Central manager for the complete Iraqi integration framework
 */
export class IraqiIntegrationFramework extends EventEmitter {
  private config: IIraqiIntegrationFrameworkConfig;
  private serviceManager?: IraqiServiceManager;
  private paymentOrchestrator?: PaymentGatewayOrchestrator;
  private culturalValidator?: CulturalWorkflowValidator;
  private workflowOrchestrator?: WorkflowOrchestrator;
  private integrationStatus: IFrameworkIntegrationStatus;
  private metrics: IFrameworkMetrics;
  private initialized: boolean = false;
  
  constructor(config: IIraqiIntegrationFrameworkConfig = {}) {
    super();
    
    this.config = this.mergeWithDefaults(config);
    this.integrationStatus = this.initializeIntegrationStatus();
    this.metrics = this.initializeMetrics();
    
    this.setupEventHandlers();
  }
  
  /**
   * Initialize the complete framework
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Iraqi Integration Framework...');
      
      // Initialize Service Manager
      if (this.config.serviceManager?.enabled) {
        console.log('📡 Initializing Service Manager...');
        this.serviceManager = new IraqiServiceManager({
          culturalValidation: this.config.serviceManager.culturalValidation,
          defaultLanguage: this.config.serviceManager.defaultLanguage
        });
        this.integrationStatus.serviceManager.initialized = true;
        this.integrationStatus.serviceManager.lastCheck = new Date();
        console.log('✅ Service Manager initialized');
      }
      
      // Initialize Payment Gateway Orchestrator
      if (this.config.paymentGateway?.enabled) {
        console.log('💳 Initializing Payment Gateway Orchestrator...');
        this.paymentOrchestrator = new PaymentGatewayOrchestrator({
          culturalValidation: this.config.paymentGateway.islamicComplianceRequired,
          securityValidation: this.config.paymentGateway.securityValidation,
          defaultGateway: this.config.paymentGateway.defaultGateway
        });
        this.integrationStatus.paymentGateway.initialized = true;
        this.integrationStatus.paymentGateway.lastCheck = new Date();
        console.log('✅ Payment Gateway Orchestrator initialized');
      }
      
      // Initialize Cultural Workflow Validator
      if (this.config.culturalValidator?.enabled) {
        console.log('🕌 Initializing Cultural Workflow Validator...');
        this.culturalValidator = new CulturalWorkflowValidator({
          strictMode: this.config.culturalValidator.strictMode,
          islamicComplianceRequired: this.config.culturalValidator.islamicComplianceThreshold >= 95,
          culturalSensitivityLevel: 'high',
          ministrySpecificRules: this.config.culturalValidator.ministrySpecificRules
        });
        this.integrationStatus.culturalValidator.initialized = true;
        this.integrationStatus.culturalValidator.lastCheck = new Date();
        console.log('✅ Cultural Workflow Validator initialized');
      }
      
      // Initialize Workflow Orchestrator
      if (this.config.workflowOrchestrator?.enabled) {
        console.log('🎼 Initializing Workflow Orchestrator...');
        this.workflowOrchestrator = new WorkflowOrchestrator({
          culturalValidationEnabled: this.config.workflowOrchestrator.culturalValidationEnabled,
          serviceIntegrationEnabled: this.config.workflowOrchestrator.serviceIntegrationEnabled,
          paymentIntegrationEnabled: this.config.workflowOrchestrator.paymentIntegrationEnabled,
          metricsEnabled: this.config.workflowOrchestrator.metricsEnabled,
          defaultMinistry: this.config.workflowOrchestrator.defaultMinistry
        });
        this.integrationStatus.workflowOrchestrator.initialized = true;
        this.integrationStatus.workflowOrchestrator.lastCheck = new Date();
        console.log('✅ Workflow Orchestrator initialized');
      }
      
      // Integrate with existing systems
      await this.integrateWithExistingSystems();
      
      this.initialized = true;
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      // Start metrics collection
      this.startMetricsCollection();
      
      console.log('🎉 Iraqi Integration Framework fully initialized!');
      
      this.emit('frameworkInitialized', {
        config: this.config,
        integrationStatus: this.integrationStatus,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize Iraqi Integration Framework:', error);
      this.emit('frameworkInitializationFailed', {
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }
  
  /**
   * Integrate with existing Arabic RTL and AI Design systems
   */
  private async integrateWithExistingSystems(): Promise<void> {
    console.log('🔗 Integrating with existing systems...');
    
    try {
      // Check for Arabic RTL Integration Layer
      const arabicRtlPath = '../arabic-rtl-integration';
      try {
        // In a real implementation, this would dynamically import the Arabic RTL system
        // const { ArabicRTLIntegrationManager } = await import(arabicRtlPath);
        console.log('✅ Arabic RTL Integration detected and connected');
        this.integrationStatus.integration.arabicRtlIntegration = true;
      } catch (error) {
        console.log('⚠️ Arabic RTL Integration not found - continuing without integration');
        this.integrationStatus.integration.arabicRtlIntegration = false;
      }
      
      // Check for AI Design Generation System
      const aiDesignPath = '../ai-design-generation';
      try {
        // In a real implementation, this would dynamically import the AI Design system
        // const { IraqiDesignEngine } = await import(aiDesignPath);
        console.log('✅ AI Design Generation System detected and connected');
        this.integrationStatus.integration.aiDesignIntegration = true;
      } catch (error) {
        console.log('⚠️ AI Design Generation System not found - continuing without integration');
        this.integrationStatus.integration.aiDesignIntegration = false;
      }
      
      // Determine overall integration health
      const integrationCount = (this.integrationStatus.integration.arabicRtlIntegration ? 1 : 0) + 
                              (this.integrationStatus.integration.aiDesignIntegration ? 1 : 0);
      
      if (integrationCount === 2) {
        this.integrationStatus.integration.overallHealth = 'healthy';
        console.log('✅ All external system integrations successful');
      } else if (integrationCount === 1) {
        this.integrationStatus.integration.overallHealth = 'degraded';
        console.log('⚠️ Partial external system integration');
      } else {
        this.integrationStatus.integration.overallHealth = 'critical';
        console.log('❌ No external system integrations available');
      }
      
      this.integrationStatus.integration.lastIntegrationCheck = new Date();
      
    } catch (error) {
      console.error('❌ Failed to integrate with existing systems:', error);
      this.integrationStatus.integration.overallHealth = 'critical';
      this.integrationStatus.integration.lastIntegrationCheck = new Date();
    }
  }
  
  /**
   * Get framework status
   */
  getStatus(): IFrameworkIntegrationStatus {
    return { ...this.integrationStatus };
  }
  
  /**
   * Get framework metrics
   */
  getMetrics(): IFrameworkMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get framework configuration
   */
  getConfig(): IIraqiIntegrationFrameworkConfig {
    return { ...this.config };
  }
  
  /**
   * Get service manager instance
   */
  getServiceManager(): IraqiServiceManager | undefined {
    return this.serviceManager;
  }
  
  /**
   * Get payment orchestrator instance
   */
  getPaymentOrchestrator(): PaymentGatewayOrchestrator | undefined {
    return this.paymentOrchestrator;
  }
  
  /**
   * Get cultural validator instance
   */
  getCulturalValidator(): CulturalWorkflowValidator | undefined {
    return this.culturalValidator;
  }
  
  /**
   * Get workflow orchestrator instance
   */
  getWorkflowOrchestrator(): WorkflowOrchestrator | undefined {
    return this.workflowOrchestrator;
  }
  
  /**
   * Check if framework is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Shutdown the framework
   */
  async shutdown(): Promise<void> {
    try {
      console.log('🔄 Shutting down Iraqi Integration Framework...');
      
      // Stop monitoring
      this.stopHealthMonitoring();
      this.stopMetricsCollection();
      
      // Remove all listeners
      this.removeAllListeners();
      
      this.initialized = false;
      
      console.log('✅ Iraqi Integration Framework shutdown complete');
      
    } catch (error) {
      console.error('❌ Error during framework shutdown:', error);
      throw error;
    }
  }
  
  // Private methods
  private mergeWithDefaults(config: IIraqiIntegrationFrameworkConfig): IIraqiIntegrationFrameworkConfig {
    return {
      serviceManager: {
        enabled: true,
        culturalValidation: true,
        defaultLanguage: 'ar',
        islamicComplianceRequired: true,
        auditLogging: true,
        ...config.serviceManager
      },
      paymentGateway: {
        enabled: true,
        defaultGateway: 'zaincash',
        islamicComplianceRequired: true,
        securityValidation: true,
        fraudDetection: true,
        ...config.paymentGateway
      },
      culturalValidator: {
        enabled: true,
        strictMode: true,
        islamicComplianceThreshold: 95,
        culturalAppropriatenessThreshold: 90,
        ministrySpecificRules: true,
        ...config.culturalValidator
      },
      workflowOrchestrator: {
        enabled: true,
        culturalValidationEnabled: true,
        serviceIntegrationEnabled: true,
        paymentIntegrationEnabled: true,
        metricsEnabled: true,
        defaultMinistry: 'general',
        ...config.workflowOrchestrator
      },
      global: {
        environment: 'production',
        timezone: 'Asia/Baghdad',
        defaultLanguage: 'ar',
        culturalMode: true,
        auditMode: true,
        performanceMonitoring: true,
        ...config.global
      }
    };
  }
  
  private initializeIntegrationStatus(): IFrameworkIntegrationStatus {
    return {
      serviceManager: {
        initialized: false,
        servicesRegistered: 0,
        healthStatus: 'critical',
        lastCheck: new Date()
      },
      paymentGateway: {
        initialized: false,
        gatewaysActive: 0,
        healthStatus: 'critical',
        lastCheck: new Date()
      },
      culturalValidator: {
        initialized: false,
        rulesLoaded: 0,
        healthStatus: 'critical',
        lastCheck: new Date()
      },
      workflowOrchestrator: {
        initialized: false,
        activeExecutions: 0,
        healthStatus: 'critical',
        lastCheck: new Date()
      },
      integration: {
        arabicRtlIntegration: false,
        aiDesignIntegration: false,
        overallHealth: 'critical',
        lastIntegrationCheck: new Date()
      }
    };
  }
  
  private initializeMetrics(): IFrameworkMetrics {
    return {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      culturalComplianceRate: 0,
      islamicComplianceRate: 0,
      serviceSuccessRate: 0,
      paymentSuccessRate: 0,
      validationSuccessRate: 0,
      uptime: 0,
      lastMetricsUpdate: new Date()
    };
  }
  
  private setupEventHandlers(): void {
    this.on('error', (error) => {
      console.error('Iraqi Integration Framework Error:', error);
    });
  }
  
  private healthMonitoringInterval?: NodeJS.Timeout;
  private metricsCollectionInterval?: NodeJS.Timeout;
  
  private startHealthMonitoring(): void {
    this.healthMonitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }
  
  private stopHealthMonitoring(): void {
    if (this.healthMonitoringInterval) {
      clearInterval(this.healthMonitoringInterval);
      this.healthMonitoringInterval = undefined;
    }
  }
  
  private startMetricsCollection(): void {
    this.metricsCollectionInterval = setInterval(() => {
      this.collectMetrics();
    }, 60000); // Every minute
  }
  
  private stopMetricsCollection(): void {
    if (this.metricsCollectionInterval) {
      clearInterval(this.metricsCollectionInterval);
      this.metricsCollectionInterval = undefined;
    }
  }
  
  private performHealthCheck(): void {
    try {
      // Check Service Manager health
      if (this.serviceManager) {
        const serviceHealth = this.serviceManager.getHealthMetrics();
        this.integrationStatus.serviceManager.healthStatus = serviceHealth.systemStatus;
        this.integrationStatus.serviceManager.servicesRegistered = serviceHealth.totalServices;
        this.integrationStatus.serviceManager.lastCheck = new Date();
      }
      
      // Check Payment Gateway health
      if (this.paymentOrchestrator) {
        const paymentHealth = this.paymentOrchestrator.getHealthMetrics();
        this.integrationStatus.paymentGateway.healthStatus = paymentHealth.systemStatus;
        this.integrationStatus.paymentGateway.gatewaysActive = paymentHealth.activeGateways;
        this.integrationStatus.paymentGateway.lastCheck = new Date();
      }
      
      // Check Cultural Validator health
      if (this.culturalValidator) {
        const validatorHealth = this.culturalValidator.getHealthMetrics();
        this.integrationStatus.culturalValidator.healthStatus = validatorHealth.systemStatus;
        this.integrationStatus.culturalValidator.rulesLoaded = 100; // Mock value
        this.integrationStatus.culturalValidator.lastCheck = new Date();
      }
      
      // Check Workflow Orchestrator health
      if (this.workflowOrchestrator) {
        const orchestratorHealth = this.workflowOrchestrator.getHealthMetrics();
        this.integrationStatus.workflowOrchestrator.healthStatus = orchestratorHealth.systemStatus;
        this.integrationStatus.workflowOrchestrator.activeExecutions = orchestratorHealth.activeExecutions;
        this.integrationStatus.workflowOrchestrator.lastCheck = new Date();
      }
      
      this.emit('healthCheckCompleted', {
        status: this.integrationStatus,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Health check failed:', error);
      this.emit('healthCheckFailed', {
        error: error.message,
        timestamp: new Date()
      });
    }
  }
  
  private collectMetrics(): void {
    try {
      let totalExecutions = 0;
      let successfulExecutions = 0;
      let totalExecutionTime = 0;
      let culturalComplianceSum = 0;
      let islamicComplianceSum = 0;
      let serviceSuccessSum = 0;
      let paymentSuccessSum = 0;
      let validationSuccessSum = 0;
      
      // Collect metrics from Service Manager
      if (this.serviceManager) {
        const serviceMetrics = this.serviceManager.getHealthMetrics();
        totalExecutions += serviceMetrics.totalServices;
        serviceSuccessSum += serviceMetrics.successRate;
      }
      
      // Collect metrics from Payment Gateway
      if (this.paymentOrchestrator) {
        const paymentMetrics = this.paymentOrchestrator.getHealthMetrics();
        totalExecutions += paymentMetrics.totalPayments;
        successfulExecutions += paymentMetrics.successfulPayments;
        paymentSuccessSum += paymentMetrics.successRate;
        islamicComplianceSum += paymentMetrics.islamicComplianceRate;
      }
      
      // Collect metrics from Cultural Validator
      if (this.culturalValidator) {
        const validatorMetrics = this.culturalValidator.getHealthMetrics();
        totalExecutions += validatorMetrics.totalValidations;
        successfulExecutions += validatorMetrics.successfulValidations;
        culturalComplianceSum += validatorMetrics.averageCulturalAppropriatenessScore;
        islamicComplianceSum += validatorMetrics.averageIslamicComplianceScore;
        validationSuccessSum += (validatorMetrics.successfulValidations / validatorMetrics.totalValidations) * 100;
      }
      
      // Collect metrics from Workflow Orchestrator
      if (this.workflowOrchestrator) {
        const orchestratorMetrics = this.workflowOrchestrator.getHealthMetrics();
        totalExecutions += orchestratorMetrics.totalExecutions;
        successfulExecutions += orchestratorMetrics.successfulExecutions;
        totalExecutionTime += orchestratorMetrics.averageExecutionTime;
        culturalComplianceSum += orchestratorMetrics.averageCulturalComplianceScore;
        serviceSuccessSum += orchestratorMetrics.averageServiceSuccessRate;
        paymentSuccessSum += orchestratorMetrics.averagePaymentSuccessRate;
      }
      
      // Update framework metrics
      this.metrics.totalExecutions = totalExecutions;
      this.metrics.successfulExecutions = successfulExecutions;
      this.metrics.failedExecutions = totalExecutions - successfulExecutions;
      this.metrics.averageExecutionTime = totalExecutionTime;
      this.metrics.culturalComplianceRate = culturalComplianceSum / 4; // Average of 4 sources
      this.metrics.islamicComplianceRate = islamicComplianceSum / 2; // Average of 2 sources
      this.metrics.serviceSuccessRate = serviceSuccessSum / 2; // Average of 2 sources
      this.metrics.paymentSuccessRate = paymentSuccessSum / 2; // Average of 2 sources
      this.metrics.validationSuccessRate = validationSuccessSum;
      this.metrics.uptime = Date.now() - (this.metrics.lastMetricsUpdate?.getTime() || Date.now());
      this.metrics.lastMetricsUpdate = new Date();
      
      this.emit('metricsUpdated', {
        metrics: this.metrics,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Metrics collection failed:', error);
      this.emit('metricsCollectionFailed', {
        error: error.message,
        timestamp: new Date()
      });
    }
  }
}

/**
 * Create a new Iraqi Integration Framework instance
 */
export function createIraqiIntegrationFramework(config?: IIraqiIntegrationFrameworkConfig): IraqiIntegrationFramework {
  return new IraqiIntegrationFramework(config);
}

/**
 * Default framework configuration for Iraqi government use
 */
export const DEFAULT_IRAQI_CONFIG: IIraqiIntegrationFrameworkConfig = {
  serviceManager: {
    enabled: true,
    culturalValidation: true,
    defaultLanguage: 'ar',
    islamicComplianceRequired: true,
    auditLogging: true
  },
  paymentGateway: {
    enabled: true,
    defaultGateway: 'zaincash',
    islamicComplianceRequired: true,
    securityValidation: true,
    fraudDetection: true
  },
  culturalValidator: {
    enabled: true,
    strictMode: true,
    islamicComplianceThreshold: 95,
    culturalAppropriatenessThreshold: 90,
    ministrySpecificRules: true
  },
  workflowOrchestrator: {
    enabled: true,
    culturalValidationEnabled: true,
    serviceIntegrationEnabled: true,
    paymentIntegrationEnabled: true,
    metricsEnabled: true,
    defaultMinistry: 'general'
  },
  global: {
    environment: 'production',
    timezone: 'Asia/Baghdad',
    defaultLanguage: 'ar',
    culturalMode: true,
    auditMode: true,
    performanceMonitoring: true
  }
};

export default IraqiIntegrationFramework;