/**
 * Iraqi Government Node Base Class
 * 
 * Comprehensive base class for all Iraqi government service nodes with:
 * - Cultural intelligence integration
 * - Islamic banking compliance validation
 * - Government-grade audit logging
 * - Real-time fraud detection
 * - Currency handling (IQD) with proper formatting
 * - Arabic RTL support
 */

import { INode, INodeExecuteFunctions, INodeParameters, INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { createHmac, randomBytes } from 'crypto';

export interface IraqiCulturalContext {
  language: 'ar' | 'en' | 'mixed';
  dialect: 'iraqi' | 'standard' | 'auto';
  islamicCompliance: boolean;
  governmentStandard: boolean;
  audienceType: 'citizen' | 'ministry' | 'business' | 'mixed';
}

export interface IslamicComplianceCheck {
  ribaFree: boolean;
  halalCompliant: boolean;
  shariaApproved: boolean;
  complianceScore: number; // 0-100
  complianceNotes: string[];
}

export interface IraqiCurrencyFormatting {
  amount: number;
  currency: 'IQD' | 'USD';
  formatted: string;
  arabicNumerals: string;
  westernNumerals: string;
  exchangeRate?: number;
  exchangeRateAge?: number; // minutes
}

export interface GovernmentAuditLog {
  nodeId: string;
  executionId: string;
  timestamp: Date;
  action: string;
  userId?: string;
  citizenId?: string;
  ministryDepartment?: string;
  dataClassification: 'public' | 'internal' | 'confidential' | 'secret';
  accessLevel: 'citizen' | 'employee' | 'supervisor' | 'director' | 'minister';
  ipAddress: string;
  userAgent?: string;
  requestData: any;
  responseData: any;
  success: boolean;
  errorMessage?: string;
  culturalValidation: boolean;
  islamicCompliance: boolean;
  securityScore: number; // 0-100
}

export interface FraudDetectionResult {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  recommendations: string[];
  requiresManualReview: boolean;
  allowTransaction: boolean;
}

export abstract class IraqiGovernmentNodeBase implements INodeType {
  description: INodeTypeDescription;

  constructor(
    public displayName: string,
    public name: string,
    public group: Array<'cultural' | 'payment' | 'government' | 'security'>,
    public version: number = 1,
    public subtitle: string = '',
    public description_text: string = '',
    public defaults: { name: string; color: string } = { name: displayName, color: '#1f4e79' }
  ) {
    this.description = {
      displayName,
      name,
      group,
      version,
      subtitle,
      description: description_text,
      defaults,
      inputs: ['main'],
      outputs: ['main'],
      credentials: [],
      properties: this.getBaseProperties().concat(this.getNodeProperties()),
    };
  }

  /**
   * Base properties common to all Iraqi government nodes
   */
  private getBaseProperties(): INodeProperties[] {
    return [
      {
        displayName: 'Cultural Context',
        name: 'culturalContext',
        type: 'collection',
        placeholder: 'Add Cultural Settings',
        default: {},
        options: [
          {
            displayName: 'Language',
            name: 'language',
            type: 'options',
            options: [
              { name: 'Arabic', value: 'ar' },
              { name: 'English', value: 'en' },
              { name: 'Mixed (Arabic/English)', value: 'mixed' },
            ],
            default: 'ar',
            description: 'Primary language for processing and responses'
          },
          {
            displayName: 'Arabic Dialect',
            name: 'dialect',
            type: 'options',
            options: [
              { name: 'Iraqi Dialect', value: 'iraqi' },
              { name: 'Modern Standard Arabic', value: 'standard' },
              { name: 'Auto-detect', value: 'auto' },
            ],
            default: 'iraqi',
            description: 'Arabic dialect preference for text processing'
          },
          {
            displayName: 'Islamic Compliance Required',
            name: 'islamicCompliance',
            type: 'boolean',
            default: true,
            description: 'Enforce Islamic banking and content compliance'
          },
          {
            displayName: 'Government Standard Compliance',
            name: 'governmentStandard',
            type: 'boolean',
            default: true,
            description: 'Enforce Iraqi government technical standards'
          },
          {
            displayName: 'Audience Type',
            name: 'audienceType',
            type: 'options',
            options: [
              { name: 'Citizens', value: 'citizen' },
              { name: 'Ministry Staff', value: 'ministry' },
              { name: 'Businesses', value: 'business' },
              { name: 'Mixed Audience', value: 'mixed' },
            ],
            default: 'citizen',
            description: 'Target audience for cultural adaptation'
          },
        ],
      },
      {
        displayName: 'Security & Audit',
        name: 'securitySettings',
        type: 'collection',
        placeholder: 'Add Security Settings',
        default: {},
        options: [
          {
            displayName: 'Enable Fraud Detection',
            name: 'fraudDetection',
            type: 'boolean',
            default: true,
            description: 'Enable real-time fraud detection analysis'
          },
          {
            displayName: 'Audit Logging Level',
            name: 'auditLevel',
            type: 'options',
            options: [
              { name: 'Basic', value: 'basic' },
              { name: 'Detailed', value: 'detailed' },
              { name: 'Comprehensive', value: 'comprehensive' },
            ],
            default: 'detailed',
            description: 'Level of audit logging detail'
          },
          {
            displayName: 'Data Classification',
            name: 'dataClassification',
            type: 'options',
            options: [
              { name: 'Public', value: 'public' },
              { name: 'Internal', value: 'internal' },
              { name: 'Confidential', value: 'confidential' },
              { name: 'Secret', value: 'secret' },
            ],
            default: 'internal',
            description: 'Government data classification level'
          },
          {
            displayName: 'Ministry Department',
            name: 'ministryDepartment',
            type: 'string',
            default: '',
            placeholder: 'e.g., Health Ministry - Patient Services',
            description: 'Ministry department for audit trail'
          },
        ],
      },
    ];
  }

  /**
   * Abstract method for node-specific properties
   * Must be implemented by each payment gateway node
   */
  abstract getNodeProperties(): INodeProperties[];

  /**
   * Abstract method for node execution logic
   * Must be implemented by each payment gateway node
   */
  abstract execute(this: INodeExecuteFunctions): Promise<any[][]>;

  /**
   * Validate Islamic banking compliance for financial operations
   */
  protected validateIslamicCompliance(
    transactionData: any,
    context: IraqiCulturalContext
  ): IslamicComplianceCheck {
    const complianceChecks: string[] = [];
    let complianceScore = 100;

    // Check for riba (interest) compliance
    const ribaFree = this.checkRibaCompliance(transactionData);
    if (!ribaFree) {
      complianceChecks.push('Transaction involves prohibited interest (riba)');
      complianceScore -= 50;
    }

    // Check for halal business practices
    const halalCompliant = this.checkHalalCompliance(transactionData);
    if (!halalCompliant) {
      complianceChecks.push('Transaction involves non-halal business practices');
      complianceScore -= 30;
    }

    // Check for gambling/speculation (maysir)
    const speculationFree = this.checkSpeculationCompliance(transactionData);
    if (!speculationFree) {
      complianceChecks.push('Transaction involves prohibited speculation (maysir)');
      complianceScore -= 40;
    }

    // Check for uncertainty (gharar)
    const uncertaintyFree = this.checkUncertaintyCompliance(transactionData);
    if (!uncertaintyFree) {
      complianceChecks.push('Transaction involves prohibited uncertainty (gharar)');
      complianceScore -= 20;
    }

    return {
      ribaFree,
      halalCompliant,
      shariaApproved: complianceScore >= 80,
      complianceScore: Math.max(0, complianceScore),
      complianceNotes: complianceChecks,
    };
  }

  /**
   * Check for riba (interest) compliance
   */
  private checkRibaCompliance(transactionData: any): boolean {
    // Check for interest charges, late fees, or percentage-based charges
    const interestIndicators = [
      'interest', 'apr', 'annual_percentage_rate', 'late_fee_percentage',
      'compound_interest', 'interest_rate', 'financing_charge'
    ];

    const dataString = JSON.stringify(transactionData).toLowerCase();
    return !interestIndicators.some(indicator => dataString.includes(indicator));
  }

  /**
   * Check for halal business compliance
   */
  private checkHalalCompliance(transactionData: any): boolean {
    // Check for prohibited business categories
    const prohibitedCategories = [
      'alcohol', 'gambling', 'adult_entertainment', 'pork_products',
      'conventional_banking_interest', 'lottery', 'casino', 'tobacco_wholesale'
    ];

    const merchantCategory = transactionData.merchant_category_code?.toLowerCase() || '';
    const description = transactionData.description?.toLowerCase() || '';
    
    return !prohibitedCategories.some(category => 
      merchantCategory.includes(category) || description.includes(category)
    );
  }

  /**
   * Check for speculation (maysir) compliance
   */
  private checkSpeculationCompliance(transactionData: any): boolean {
    const speculationIndicators = [
      'lottery', 'gambling', 'betting', 'speculation', 'derivative_trading',
      'forex_speculation', 'cryptocurrency_gambling', 'binary_options'
    ];

    const dataString = JSON.stringify(transactionData).toLowerCase();
    return !speculationIndicators.some(indicator => dataString.includes(indicator));
  }

  /**
   * Check for uncertainty (gharar) compliance
   */
  private checkUncertaintyCompliance(transactionData: any): boolean {
    // Check for excessive uncertainty in transaction terms
    const uncertaintyIndicators = [
      'undefined_delivery_date', 'uncertain_quantity', 'conditional_pricing',
      'variable_unknown_terms', 'speculative_delivery'
    ];

    const dataString = JSON.stringify(transactionData).toLowerCase();
    return !uncertaintyIndicators.some(indicator => dataString.includes(indicator));
  }

  /**
   * Format Iraqi currency with cultural preferences
   */
  protected formatIraqiCurrency(
    amount: number,
    currency: 'IQD' | 'USD' = 'IQD',
    showBothNumerals: boolean = true,
    exchangeRate?: number
  ): IraqiCurrencyFormatting {
    // Convert to IQD if needed
    const iqdAmount = currency === 'USD' && exchangeRate ? amount * exchangeRate : amount;
    
    // Format with thousand separators
    const formatted = new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(iqdAmount);

    // Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
    const arabicNumerals = this.convertToArabicNumerals(iqdAmount.toLocaleString('en-US'));
    
    // Western numerals (0123456789)
    const westernNumerals = iqdAmount.toLocaleString('en-US');

    return {
      amount: iqdAmount,
      currency: 'IQD',
      formatted: showBothNumerals ? `${westernNumerals} (${arabicNumerals}) د.ع` : formatted,
      arabicNumerals: `${arabicNumerals} د.ع`,
      westernNumerals: `${westernNumerals} د.ع`,
      exchangeRate,
      exchangeRateAge: exchangeRate ? 0 : undefined,
    };
  }

  /**
   * Convert Western numerals to Arabic-Indic numerals
   */
  private convertToArabicNumerals(westernNumber: string): string {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return westernNumber.replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit)]);
  }

  /**
   * Real-time fraud detection analysis
   */
  protected detectFraud(
    transactionData: any,
    userContext: any,
    historicalData?: any[]
  ): FraudDetectionResult {
    let riskScore = 0;
    const triggers: string[] = [];
    const recommendations: string[] = [];

    // Amount-based risk assessment
    if (transactionData.amount > 5000000) { // > 5M IQD
      riskScore += 30;
      triggers.push('High-value transaction');
      recommendations.push('Verify transaction purpose and user identity');
    }

    // Velocity checks
    if (historicalData && historicalData.length > 10) {
      const recentTransactions = historicalData.filter(tx => 
        new Date(tx.timestamp) > new Date(Date.now() - 60000) // Last minute
      );
      
      if (recentTransactions.length > 3) {
        riskScore += 40;
        triggers.push('High transaction velocity');
        recommendations.push('Implement transaction cooling period');
      }
    }

    // Geographic risk assessment
    if (userContext.country && userContext.country !== 'IQ') {
      riskScore += 25;
      triggers.push('Transaction from outside Iraq');
      recommendations.push('Verify user location and identity');
    }

    // Time-based risk
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) {
      riskScore += 10;
      triggers.push('Unusual transaction time');
    }

    // Pattern analysis
    if (this.detectUnusualPatterns(transactionData, historicalData)) {
      riskScore += 35;
      triggers.push('Unusual transaction pattern detected');
      recommendations.push('Manual review recommended');
    }

    const riskLevel = this.calculateRiskLevel(riskScore);

    return {
      riskScore: Math.min(100, riskScore),
      riskLevel,
      triggers,
      recommendations,
      requiresManualReview: riskScore >= 70,
      allowTransaction: riskScore < 85,
    };
  }

  /**
   * Detect unusual transaction patterns
   */
  private detectUnusualPatterns(transactionData: any, historicalData?: any[]): boolean {
    if (!historicalData || historicalData.length < 5) return false;

    // Check for round number patterns (potential money laundering)
    const isRoundNumber = transactionData.amount % 100000 === 0; // Multiples of 100K IQD
    
    // Check for repeated exact amounts
    const exactMatches = historicalData.filter(tx => tx.amount === transactionData.amount);
    const hasRepeatedAmounts = exactMatches.length >= 3;

    // Check for structured transactions (just under reporting thresholds)
    const isStructuredAmount = transactionData.amount >= 9900000 && transactionData.amount < 10000000; // Just under 10M IQD

    return isRoundNumber || hasRepeatedAmounts || isStructuredAmount;
  }

  /**
   * Calculate risk level from risk score
   */
  private calculateRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    if (score < 85) return 'high';
    return 'critical';
  }

  /**
   * Create comprehensive government audit log
   */
  protected createAuditLog(
    nodeId: string,
    executionId: string,
    action: string,
    requestData: any,
    responseData: any,
    context: IraqiCulturalContext,
    securitySettings: any,
    success: boolean,
    errorMessage?: string
  ): GovernmentAuditLog {
    return {
      nodeId,
      executionId,
      timestamp: new Date(),
      action,
      userId: requestData.userId,
      citizenId: requestData.citizenId,
      ministryDepartment: securitySettings.ministryDepartment || 'Unknown',
      dataClassification: securitySettings.dataClassification || 'internal',
      accessLevel: this.determineAccessLevel(requestData),
      ipAddress: requestData.ipAddress || 'unknown',
      userAgent: requestData.userAgent,
      requestData: this.sanitizeAuditData(requestData, securitySettings.dataClassification),
      responseData: this.sanitizeAuditData(responseData, securitySettings.dataClassification),
      success,
      errorMessage,
      culturalValidation: this.validateCulturalContent(requestData, context),
      islamicCompliance: context.islamicCompliance ? this.validateIslamicCompliance(requestData, context).shariaApproved : true,
      securityScore: this.calculateSecurityScore(requestData, responseData),
    };
  }

  /**
   * Determine user access level from request data
   */
  private determineAccessLevel(requestData: any): 'citizen' | 'employee' | 'supervisor' | 'director' | 'minister' {
    const accessLevel = requestData.accessLevel?.toLowerCase();
    
    if (['minister', 'وزير'].includes(accessLevel)) return 'minister';
    if (['director', 'مدير', 'مدير_عام'].includes(accessLevel)) return 'director';
    if (['supervisor', 'مشرف', 'رئيس_قسم'].includes(accessLevel)) return 'supervisor';
    if (['employee', 'موظف', 'staff'].includes(accessLevel)) return 'employee';
    
    return 'citizen';
  }

  /**
   * Sanitize audit data based on classification level
   */
  private sanitizeAuditData(data: any, classification: string): any {
    if (!data) return null;

    const sanitized = { ...data };
    
    // Remove sensitive fields based on classification
    if (classification === 'public') {
      delete sanitized.citizenId;
      delete sanitized.personalDetails;
      delete sanitized.financialInfo;
    }
    
    if (classification === 'internal' || classification === 'public') {
      delete sanitized.nationalSecurityInfo;
      delete sanitized.classifiedDocuments;
    }

    // Always remove authentication tokens and passwords
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.apiKey;
    delete sanitized.privateKey;

    return sanitized;
  }

  /**
   * Validate cultural content appropriateness
   */
  private validateCulturalContent(data: any, context: IraqiCulturalContext): boolean {
    if (!context.islamicCompliance && !context.governmentStandard) return true;

    // Simple cultural validation - in production, this would use AI models
    const content = JSON.stringify(data).toLowerCase();
    
    // Check for culturally inappropriate content
    const inappropriate = ['alcohol', 'pork', 'gambling', 'adult_content'];
    const hasInappropriate = inappropriate.some(term => content.includes(term));

    // Check for respectful language patterns
    const respectfulIndicators = ['please', 'thank_you', 'respect', 'من_فضلك', 'شكراً'];
    const hasRespectful = respectfulIndicators.some(term => content.includes(term));

    return !hasInappropriate || hasRespectful;
  }

  /**
   * Calculate security score for the transaction
   */
  private calculateSecurityScore(requestData: any, responseData: any): number {
    let score = 100;

    // Check for security headers
    if (!requestData.headers?.['user-agent']) score -= 10;
    if (!requestData.ipAddress) score -= 15;
    
    // Check for proper authentication
    if (!requestData.userId && !requestData.citizenId) score -= 20;
    
    // Check for data encryption
    if (requestData.encrypted !== true) score -= 25;
    
    // Check for proper error handling
    if (responseData.error && responseData.sensitiveData) score -= 30;

    return Math.max(0, score);
  }

  /**
   * Generate secure transaction ID
   */
  protected generateTransactionId(prefix: string = 'IRQ'): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(8).toString('hex');
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Create HMAC signature for secure communications
   */
  protected createHmacSignature(data: string, secret: string): string {
    return createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Validate HMAC signature
   */
  protected validateHmacSignature(data: string, signature: string, secret: string): boolean {
    const expectedSignature = this.createHmacSignature(data, secret);
    return signature === expectedSignature;
  }
}