/**
 * Payment Gateway Orchestrator - Iraqi Payment Integration
 * 
 * Manages ZainCash, FastPay, and NassWallet payment gateways with
 * intelligent routing, failover, and cultural compliance.
 */

import { EventEmitter } from 'events';

// Core payment interfaces
export interface IPaymentGateway {
  id: string;
  name: string;
  nameArabic: string;
  provider: PaymentProvider;
  supportedCurrencies: Currency[];
  minimumAmount: number;
  maximumAmount: number;
  configuration: IPaymentConfig;
  features: IPaymentFeatures;
  compliance: IPaymentCompliance;
  status: GatewayStatus;
}

export interface IPaymentRequest {
  id: string;
  amount: number;
  currency: Currency;
  description: string;
  descriptionArabic: string;
  customer: ICustomerInfo;
  merchant: IMerchantInfo;
  culturalContext: ICulturalPaymentContext;
  preferredGateway?: PaymentProvider;
  fallbackGateways?: PaymentProvider[];
  metadata: IPaymentMetadata;
  timestamp: Date;
}

export interface IPaymentResponse {
  id: string;
  requestId: string;
  gatewayUsed: PaymentProvider;
  status: PaymentStatus;
  transactionId?: string;
  gatewayTransactionId?: string;
  amount: number;
  currency: Currency;
  fees: IPaymentFees;
  culturalValidation: ICulturalPaymentValidation;
  securityValidation: ISecurityValidation;
  processingTime: number;
  timestamp: Date;
  redirectUrl?: string;
  webhookData?: any;
  error?: IPaymentError;
}

export interface ICustomerInfo {
  id: string;
  name: string;
  nameArabic: string;
  phone: string;
  email?: string;
  nationalId?: string;
  governorate: IraqiGovernorate;
  paymentHistory: IPaymentHistory;
  preferences: ICustomerPaymentPreferences;
  verificationStatus: IVerificationStatus;
}

export interface IMerchantInfo {
  id: string;
  name: string;
  nameArabic: string;
  businessType: BusinessType;
  ministry?: MinistryType;
  licenseNumber: string;
  contactInfo: IMerchantContact;
  compliance: IMerchantCompliance;
}

export interface ICulturalPaymentContext {
  language: 'ar' | 'en' | 'mixed';
  religiousContext: boolean;
  businessContext: BusinessContext;
  urgencyLevel: 'normal' | 'urgent' | 'emergency';
  culturalSensitivity: 'low' | 'medium' | 'high';
  islamicComplianceRequired: boolean;
}

export interface IPaymentMetadata {
  serviceType: 'government' | 'commercial' | 'utility' | 'healthcare' | 'education';
  ministry?: MinistryType;
  department?: string;
  referenceNumber: string;
  description: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface IPaymentFees {
  gatewayFee: number;
  processingFee: number;
  governmentTax: number;
  totalFees: number;
  currency: Currency;
  breakdown: IFeeBreakdown[];
}

export interface ICulturalPaymentValidation {
  islamicCompliance: {
    score: number;
    halalStatus: boolean;
    issues: string[];
    recommendations: string[];
  };
  culturalAppropriateness: {
    score: number;
    languageAccuracy: number;
    contextualRelevance: number;
    adjustments: string[];
  };
  governmentCompliance: {
    score: number;
    regulatoryCompliance: boolean;
    auditTrail: boolean;
    dataProtection: boolean;
  };
}

export interface ISecurityValidation {
  fraudScore: number;
  riskLevel: RiskLevel;
  securityChecks: ISecurityCheck[];
  biometricValidation?: boolean;
  deviceFingerprint: string;
  ipGeolocation: string;
  suspiciousActivity: boolean;
}

// Enums and types
export type PaymentProvider = 'zaincash' | 'fastpay' | 'nasswallet';
export type Currency = 'IQD' | 'USD' | 'EUR';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type GatewayStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated';
export type BusinessType = 'government' | 'private' | 'ngo' | 'healthcare' | 'education' | 'retail';
export type BusinessContext = 'government_service' | 'commercial_purchase' | 'utility_payment' | 'healthcare_service' | 'educational_fee';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type IraqiGovernorate = 'baghdad' | 'basra' | 'ninawa' | 'erbil' | 'najaf' | 'karbala' | 'babylon' | 'diyala' | 'anbar' | 'sulaymaniyah' | 'kirkuk' | 'wasit' | 'maysan' | 'dhi_qar' | 'muthanna' | 'qadisiyyah' | 'salah_al_din' | 'duhok';
export type MinistryType = 'health' | 'education' | 'interior' | 'justice' | 'finance' | 'transport' | 'agriculture' | 'labor' | 'general';

export interface IPaymentConfig {
  apiUrl: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  timeout: number;
  retryAttempts: number;
  sandboxMode: boolean;
  rateLimiting: IRateLimiting;
}

export interface IPaymentFeatures {
  instantPayment: boolean;
  scheduledPayment: boolean;
  refundSupport: boolean;
  partialRefund: boolean;
  recurringPayment: boolean;
  multiCurrency: boolean;
  biometricAuth: boolean;
  qrCodePayment: boolean;
}

export interface IPaymentCompliance {
  pciDssCompliant: boolean;
  centralBankApproved: boolean;
  islamicBankingCompliant: boolean;
  dataProtectionCompliant: boolean;
  auditingEnabled: boolean;
  complianceCertificates: string[];
}

export interface IPaymentHistory {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: number;
  averageAmount: number;
  lastTransactionDate: Date;
  riskScore: number;
  trustScore: number;
}

export interface ICustomerPaymentPreferences {
  preferredGateway: PaymentProvider;
  preferredCurrency: Currency;
  language: 'ar' | 'en' | 'mixed';
  biometricAuth: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  culturalMode: boolean;
}

export interface IVerificationStatus {
  phoneVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  biometricVerified: boolean;
  addressVerified: boolean;
  verificationLevel: 'basic' | 'standard' | 'premium';
}

export interface IMerchantContact {
  phone: string;
  email: string;
  address: string;
  addressArabic: string;
  website?: string;
  contactPerson: string;
}

export interface IMerchantCompliance {
  businessLicense: boolean;
  taxRegistration: boolean;
  centralBankLicense: boolean;
  ministryApproval: boolean;
  complianceScore: number;
  lastAuditDate: Date;
}

export interface IFeeBreakdown {
  name: string;
  nameArabic: string;
  amount: number;
  percentage?: number;
  description: string;
  descriptionArabic: string;
}

export interface ISecurityCheck {
  type: string;
  status: 'passed' | 'failed' | 'warning';
  score: number;
  details: string;
  timestamp: Date;
}

export interface IPaymentError {
  code: string;
  message: string;
  messageArabic: string;
  details: string;
  culturalContext: string;
  resolution: string;
  gatewayError?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface IRateLimiting {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

/**
 * Payment Gateway Orchestrator
 * 
 * Intelligent routing and management of Iraqi payment gateways
 */
export class PaymentGatewayOrchestrator extends EventEmitter {
  private gateways: Map<PaymentProvider, IPaymentGateway>;
  private activePayments: Map<string, IPaymentRequest>;
  private paymentHistory: Map<string, IPaymentResponse>;
  private routingRules: IRoutingRule[];
  private performanceMetrics: IPaymentMetrics;
  private culturalValidator: any; // Will integrate with CulturalValidationPipeline
  private securityEngine: any; // Will integrate with security validation
  
  constructor(options: IPaymentOrchestratorOptions = {}) {
    super();
    
    this.gateways = new Map();
    this.activePayments = new Map();
    this.paymentHistory = new Map();
    this.routingRules = [];
    this.performanceMetrics = this.initializeMetrics();
    
    this.initializeGateways(options);
    this.setupRoutingRules();
    this.setupEventHandlers();
  }
  
  /**
   * Register a payment gateway
   */
  async registerGateway(gateway: IPaymentGateway): Promise<void> {
    try {
      // Validate gateway configuration
      await this.validateGatewayConfig(gateway);
      
      // Test gateway connectivity
      await this.testGatewayConnection(gateway);
      
      // Cultural compliance validation
      const culturalValidation = await this.validateGatewayCulturalCompliance(gateway);
      if (!culturalValidation.islamicCompliance.halalStatus) {
        throw new Error(`Gateway ${gateway.id} does not meet Islamic compliance requirements`);
      }
      
      // Register gateway
      this.gateways.set(gateway.provider, gateway);
      
      this.emit('gatewayRegistered', {
        provider: gateway.provider,
        name: gateway.name,
        culturalValidation,
        timestamp: new Date()
      });
      
    } catch (error) {
      this.emit('gatewayRegistrationFailed', {
        provider: gateway.provider,
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }
  
  /**
   * Process payment with intelligent routing
   */
  async processPayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    const startTime = Date.now();
    
    try {
      // Validate payment request
      await this.validatePaymentRequest(request);
      
      // Cultural validation
      const culturalValidation = await this.validatePaymentCulture(request);
      if (!culturalValidation.islamicCompliance.halalStatus) {
        throw new Error('Payment does not meet Islamic compliance requirements');
      }
      
      // Security validation
      const securityValidation = await this.validatePaymentSecurity(request);
      if (securityValidation.riskLevel === 'critical') {
        throw new Error('Payment blocked due to high security risk');
      }
      
      // Select optimal gateway
      const selectedGateway = await this.selectOptimalGateway(request);
      if (!selectedGateway) {
        throw new Error('No suitable payment gateway available');
      }
      
      // Process payment
      this.activePayments.set(request.id, request);
      const response = await this.executePayment(selectedGateway, request);
      
      // Update metrics
      this.updatePaymentMetrics(selectedGateway, response, Date.now() - startTime);
      
      // Store payment history
      this.paymentHistory.set(response.id, response);
      
      this.emit('paymentProcessed', {
        requestId: request.id,
        responseId: response.id,
        gateway: selectedGateway.provider,
        status: response.status,
        amount: response.amount,
        currency: response.currency,
        processingTime: response.processingTime,
        culturalValidation: response.culturalValidation,
        timestamp: new Date()
      });
      
      return response;
      
    } catch (error) {
      const errorResponse: IPaymentResponse = {
        id: `pay_error_${Date.now()}`,
        requestId: request.id,
        gatewayUsed: request.preferredGateway || 'zaincash',
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        fees: { gatewayFee: 0, processingFee: 0, governmentTax: 0, totalFees: 0, currency: request.currency, breakdown: [] },
        culturalValidation: {
          islamicCompliance: { score: 0, halalStatus: false, issues: ['Payment failed'], recommendations: [] },
          culturalAppropriateness: { score: 0, languageAccuracy: 0, contextualRelevance: 0, adjustments: [] },
          governmentCompliance: { score: 0, regulatoryCompliance: false, auditTrail: false, dataProtection: false }
        },
        securityValidation: {
          fraudScore: 0,
          riskLevel: 'high',
          securityChecks: [],
          deviceFingerprint: '',
          ipGeolocation: '',
          suspiciousActivity: true
        },
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'PAYMENT_PROCESSING_ERROR',
          message: error.message,
          messageArabic: this.translateError(error.message),
          details: error.stack || '',
          culturalContext: this.getPaymentErrorContext(request.culturalContext),
          resolution: this.getPaymentErrorResolution(error.message),
          severity: this.getPaymentErrorSeverity(error.message)
        }
      };
      
      this.emit('paymentFailed', {
        requestId: request.id,
        error: error.message,
        gateway: request.preferredGateway,
        amount: request.amount,
        currency: request.currency,
        processingTime: Date.now() - startTime,
        timestamp: new Date()
      });
      
      return errorResponse;
    } finally {
      this.activePayments.delete(request.id);
    }
  }
  
  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<IPaymentResponse | null> {
    return this.paymentHistory.get(paymentId) || null;
  }
  
  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<IPaymentResponse> {
    const originalPayment = this.paymentHistory.get(paymentId);
    if (!originalPayment) {
      throw new Error(`Payment ${paymentId} not found`);
    }
    
    const gateway = this.gateways.get(originalPayment.gatewayUsed);
    if (!gateway) {
      throw new Error(`Gateway ${originalPayment.gatewayUsed} not available for refund`);
    }
    
    if (!gateway.features.refundSupport) {
      throw new Error(`Gateway ${originalPayment.gatewayUsed} does not support refunds`);
    }
    
    const refundAmount = amount || originalPayment.amount;
    if (refundAmount > originalPayment.amount) {
      throw new Error('Refund amount cannot exceed original payment amount');
    }
    
    // Process refund (implementation would depend on gateway API)
    const refundResponse: IPaymentResponse = {
      id: `refund_${Date.now()}`,
      requestId: originalPayment.requestId,
      gatewayUsed: originalPayment.gatewayUsed,
      status: 'completed',
      transactionId: `refund_${originalPayment.transactionId}`,
      amount: -refundAmount,
      currency: originalPayment.currency,
      fees: { gatewayFee: 0, processingFee: 0, governmentTax: 0, totalFees: 0, currency: originalPayment.currency, breakdown: [] },
      culturalValidation: originalPayment.culturalValidation,
      securityValidation: originalPayment.securityValidation,
      processingTime: 200,
      timestamp: new Date()
    };
    
    this.paymentHistory.set(refundResponse.id, refundResponse);
    
    this.emit('paymentRefunded', {
      originalPaymentId: paymentId,
      refundId: refundResponse.id,
      amount: refundAmount,
      currency: originalPayment.currency,
      reason: reason,
      timestamp: new Date()
    });
    
    return refundResponse;
  }
  
  /**
   * Get available gateways for amount
   */
  getAvailableGateways(amount: number, currency: Currency = 'IQD'): IPaymentGateway[] {
    return Array.from(this.gateways.values()).filter(gateway => 
      gateway.status === 'active' &&
      gateway.supportedCurrencies.includes(currency) &&
      amount >= gateway.minimumAmount &&
      amount <= gateway.maximumAmount
    );
  }
  
  /**
   * Get orchestrator health metrics
   */
  getHealthMetrics(): IPaymentHealthMetrics {
    return {
      totalGateways: this.gateways.size,
      activeGateways: this.getActiveGatewayCount(),
      totalPayments: this.performanceMetrics.totalPayments,
      successfulPayments: this.performanceMetrics.successfulPayments,
      failedPayments: this.performanceMetrics.failedPayments,
      averageProcessingTime: this.performanceMetrics.averageProcessingTime,
      successRate: this.performanceMetrics.successRate,
      islamicComplianceRate: this.performanceMetrics.islamicComplianceRate,
      gatewayDistribution: this.getGatewayDistribution(),
      lastHealthCheck: new Date(),
      systemStatus: this.getPaymentSystemStatus()
    };
  }
  
  // Private methods
  private initializeGateways(options: IPaymentOrchestratorOptions): void {
    // Initialize default Iraqi payment gateways
    this.registerDefaultGateways();
  }
  
  private setupRoutingRules(): void {
    this.routingRules = [
      {
        name: 'ZainCash Mobile Preference',
        condition: (req) => req.customer.phone.startsWith('+9647') && req.amount >= 1000,
        gateway: 'zaincash',
        priority: 1
      },
      {
        name: 'FastPay Small Amounts',
        condition: (req) => req.amount >= 500 && req.amount < 50000,
        gateway: 'fastpay',
        priority: 2
      },
      {
        name: 'NassWallet Large Amounts',
        condition: (req) => req.amount >= 1000 && req.culturalContext.businessContext === 'government_service',
        gateway: 'nasswallet',
        priority: 1
      }
    ];
  }
  
  private setupEventHandlers(): void {
    this.on('error', (error) => {
      console.error('Payment Gateway Orchestrator Error:', error);
    });
  }
  
  private async validateGatewayConfig(gateway: IPaymentGateway): Promise<void> {
    if (!gateway.id || !gateway.name || !gateway.provider) {
      throw new Error('Invalid gateway configuration: missing required fields');
    }
    
    if (!gateway.nameArabic) {
      throw new Error('Arabic name is required for cultural compliance');
    }
    
    if (!gateway.compliance.islamicBankingCompliant) {
      throw new Error('Islamic banking compliance is required for Iraqi payment gateways');
    }
  }
  
  private async testGatewayConnection(gateway: IPaymentGateway): Promise<void> {
    // Test gateway connectivity (implementation depends on gateway API)
    // This would make actual API calls to verify the gateway is working
  }
  
  private async validateGatewayCulturalCompliance(gateway: IPaymentGateway): Promise<ICulturalPaymentValidation> {
    return {
      islamicCompliance: {
        score: 95,
        halalStatus: true,
        issues: [],
        recommendations: []
      },
      culturalAppropriateness: {
        score: 90,
        languageAccuracy: 95,
        contextualRelevance: 88,
        adjustments: []
      },
      governmentCompliance: {
        score: 92,
        regulatoryCompliance: true,
        auditTrail: true,
        dataProtection: true
      }
    };
  }
  
  private async validatePaymentRequest(request: IPaymentRequest): Promise<void> {
    if (!request.amount || request.amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    if (!request.customer || !request.customer.phone) {
      throw new Error('Customer information is required');
    }
    
    if (!request.description || !request.descriptionArabic) {
      throw new Error('Payment description in both Arabic and English is required');
    }
  }
  
  private async validatePaymentCulture(request: IPaymentRequest): Promise<ICulturalPaymentValidation> {
    // Cultural validation would be performed here
    return {
      islamicCompliance: {
        score: 95,
        halalStatus: true,
        issues: [],
        recommendations: []
      },
      culturalAppropriateness: {
        score: 90,
        languageAccuracy: 88,
        contextualRelevance: 92,
        adjustments: []
      },
      governmentCompliance: {
        score: 94,
        regulatoryCompliance: true,
        auditTrail: true,
        dataProtection: true
      }
    };
  }
  
  private async validatePaymentSecurity(request: IPaymentRequest): Promise<ISecurityValidation> {
    // Security validation would be performed here
    return {
      fraudScore: 15,
      riskLevel: 'low',
      securityChecks: [
        { type: 'phone_verification', status: 'passed', score: 95, details: 'Phone number verified', timestamp: new Date() },
        { type: 'amount_validation', status: 'passed', score: 90, details: 'Amount within normal range', timestamp: new Date() }
      ],
      deviceFingerprint: 'device_123456',
      ipGeolocation: 'Baghdad, Iraq',
      suspiciousActivity: false
    };
  }
  
  private async selectOptimalGateway(request: IPaymentRequest): Promise<IPaymentGateway | null> {
    // Get available gateways for this amount
    const availableGateways = this.getAvailableGateways(request.amount, request.currency);
    
    if (availableGateways.length === 0) {
      return null;
    }
    
    // Apply routing rules
    const routedGateway = this.applyRoutingRules(request, availableGateways);
    if (routedGateway) {
      return routedGateway;
    }
    
    // Use preferred gateway if available
    if (request.preferredGateway) {
      const preferredGateway = availableGateways.find(g => g.provider === request.preferredGateway);
      if (preferredGateway) {
        return preferredGateway;
      }
    }
    
    // Select based on performance metrics
    return this.selectBestPerformingGateway(availableGateways);
  }
  
  private applyRoutingRules(request: IPaymentRequest, availableGateways: IPaymentGateway[]): IPaymentGateway | null {
    const applicableRules = this.routingRules
      .filter(rule => rule.condition(request))
      .sort((a, b) => a.priority - b.priority);
    
    for (const rule of applicableRules) {
      const gateway = availableGateways.find(g => g.provider === rule.gateway);
      if (gateway) {
        return gateway;
      }
    }
    
    return null;
  }
  
  private selectBestPerformingGateway(gateways: IPaymentGateway[]): IPaymentGateway {
    // For now, return the first available gateway
    // In a real implementation, this would consider performance metrics
    return gateways[0];
  }
  
  private async executePayment(gateway: IPaymentGateway, request: IPaymentRequest): Promise<IPaymentResponse> {
    const startTime = Date.now();
    
    // Mock payment processing (in real implementation, this would call gateway APIs)
    const response: IPaymentResponse = {
      id: `pay_${Date.now()}`,
      requestId: request.id,
      gatewayUsed: gateway.provider,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      gatewayTransactionId: `gtxn_${Date.now()}`,
      amount: request.amount,
      currency: request.currency,
      fees: this.calculateFees(gateway, request),
      culturalValidation: {
        islamicCompliance: { score: 95, halalStatus: true, issues: [], recommendations: [] },
        culturalAppropriateness: { score: 90, languageAccuracy: 88, contextualRelevance: 92, adjustments: [] },
        governmentCompliance: { score: 94, regulatoryCompliance: true, auditTrail: true, dataProtection: true }
      },
      securityValidation: {
        fraudScore: 10,
        riskLevel: 'low',
        securityChecks: [],
        deviceFingerprint: 'device_123456',
        ipGeolocation: 'Baghdad, Iraq',
        suspiciousActivity: false
      },
      processingTime: Date.now() - startTime,
      timestamp: new Date()
    };
    
    return response;
  }
  
  private calculateFees(gateway: IPaymentGateway, request: IPaymentRequest): IPaymentFees {
    const gatewayFee = request.amount * 0.02; // 2% gateway fee
    const processingFee = 500; // 500 IQD processing fee
    const governmentTax = request.amount * 0.005; // 0.5% government tax
    
    return {
      gatewayFee,
      processingFee,
      governmentTax,
      totalFees: gatewayFee + processingFee + governmentTax,
      currency: request.currency,
      breakdown: [
        { name: 'Gateway Fee', nameArabic: 'رسوم البوابة', amount: gatewayFee, percentage: 2, description: 'Payment gateway processing fee', descriptionArabic: 'رسوم معالجة بوابة الدفع' },
        { name: 'Processing Fee', nameArabic: 'رسوم المعالجة', amount: processingFee, description: 'Transaction processing fee', descriptionArabic: 'رسوم معالجة المعاملة' },
        { name: 'Government Tax', nameArabic: 'الضريبة الحكومية', amount: governmentTax, percentage: 0.5, description: 'Government tax on transaction', descriptionArabic: 'الضريبة الحكومية على المعاملة' }
      ]
    };
  }
  
  private updatePaymentMetrics(gateway: IPaymentGateway, response: IPaymentResponse, processingTime: number): void {
    this.performanceMetrics.totalPayments++;
    this.performanceMetrics.totalProcessingTime += processingTime;
    this.performanceMetrics.averageProcessingTime = this.performanceMetrics.totalProcessingTime / this.performanceMetrics.totalPayments;
    
    if (response.status === 'completed') {
      this.performanceMetrics.successfulPayments++;
    } else {
      this.performanceMetrics.failedPayments++;
    }
    
    this.performanceMetrics.successRate = (this.performanceMetrics.successfulPayments / this.performanceMetrics.totalPayments) * 100;
    
    if (response.culturalValidation.islamicCompliance.halalStatus) {
      this.performanceMetrics.islamicCompliantPayments++;
    }
    this.performanceMetrics.islamicComplianceRate = (this.performanceMetrics.islamicCompliantPayments / this.performanceMetrics.totalPayments) * 100;
  }
  
  private translateError(message: string): string {
    const translations: Record<string, string> = {
      'Insufficient funds': 'أموال غير كافية',
      'Invalid card': 'بطاقة غير صالحة',
      'Transaction declined': 'تم رفض المعاملة',
      'Gateway timeout': 'انتهت مهلة البوابة',
      'Invalid amount': 'مبلغ غير صحيح'
    };
    
    return translations[message] || message;
  }
  
  private getPaymentErrorContext(culturalContext: ICulturalPaymentContext): string {
    return `Language: ${culturalContext.language}, Business: ${culturalContext.businessContext}, Religious: ${culturalContext.religiousContext}`;
  }
  
  private getPaymentErrorResolution(message: string): string {
    const resolutions: Record<string, string> = {
      'Insufficient funds': 'Please check your account balance and try again',
      'Invalid card': 'Please verify your payment information',
      'Transaction declined': 'Please contact your bank or try a different payment method',
      'Gateway timeout': 'Please try again in a few minutes'
    };
    
    return resolutions[message] || 'Please contact customer support for assistance';
  }
  
  private getPaymentErrorSeverity(message: string): 'low' | 'medium' | 'high' | 'critical' {
    if (message.includes('timeout') || message.includes('network')) return 'medium';
    if (message.includes('declined') || message.includes('invalid')) return 'high';
    if (message.includes('fraud') || message.includes('security')) return 'critical';
    return 'low';
  }
  
  private getActiveGatewayCount(): number {
    return Array.from(this.gateways.values()).filter(g => g.status === 'active').length;
  }
  
  private getGatewayDistribution(): Record<PaymentProvider, number> {
    const distribution: Record<PaymentProvider, number> = {
      zaincash: 0,
      fastpay: 0,
      nasswallet: 0
    };
    
    for (const payment of this.paymentHistory.values()) {
      if (payment.status === 'completed') {
        distribution[payment.gatewayUsed]++;
      }
    }
    
    return distribution;
  }
  
  private getPaymentSystemStatus(): 'healthy' | 'degraded' | 'critical' {
    if (this.performanceMetrics.successRate > 95 && this.performanceMetrics.averageProcessingTime < 1000) {
      return 'healthy';
    } else if (this.performanceMetrics.successRate > 80 && this.performanceMetrics.averageProcessingTime < 3000) {
      return 'degraded';
    } else {
      return 'critical';
    }
  }
  
  private initializeMetrics(): IPaymentMetrics {
    return {
      totalPayments: 0,
      successfulPayments: 0,
      failedPayments: 0,
      islamicCompliantPayments: 0,
      totalProcessingTime: 0,
      averageProcessingTime: 0,
      successRate: 0,
      islamicComplianceRate: 0
    };
  }
  
  private registerDefaultGateways(): void {
    // Default gateways would be registered here
    // ZainCash, FastPay, NassWallet configurations
  }
}

// Additional interfaces
export interface IPaymentOrchestratorOptions {
  culturalValidation?: boolean;
  securityValidation?: boolean;
  metricsEnabled?: boolean;
  defaultGateway?: PaymentProvider;
}

export interface IPaymentMetrics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  islamicCompliantPayments: number;
  totalProcessingTime: number;
  averageProcessingTime: number;
  successRate: number;
  islamicComplianceRate: number;
}

export interface IPaymentHealthMetrics {
  totalGateways: number;
  activeGateways: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  averageProcessingTime: number;
  successRate: number;
  islamicComplianceRate: number;
  gatewayDistribution: Record<PaymentProvider, number>;
  lastHealthCheck: Date;
  systemStatus: 'healthy' | 'degraded' | 'critical';
}

export interface IRoutingRule {
  name: string;
  condition: (request: IPaymentRequest) => boolean;
  gateway: PaymentProvider;
  priority: number;
}

export default PaymentGatewayOrchestrator;