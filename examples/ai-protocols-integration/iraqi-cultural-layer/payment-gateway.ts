/**
 * Iraqi Payment Gateway Integration
 *
 * Provides secure integration with major Iraqi payment gateways including
 * ZainCash, FastPay, and NassWallet with Islamic financial compliance.
 *
 * Features:
 * - Multi-gateway support with intelligent routing
 * - Islamic financial compliance validation
 * - Real-time transaction monitoring
 * - Fraud detection and security measures
 * - Iraqi Dinar (IQD) currency handling
 */

export interface PaymentGatewayConfig {
  zainCash: {
    enabled: boolean;
    apiKey: string;
    merchantId: string;
    minAmount: number; // 1000 IQD
    maxAmount: number; // 1000000 IQD
  };
  fastPay: {
    enabled: boolean;
    apiKey: string;
    merchantId: string;
    minAmount: number; // 500 IQD
    maxAmount: number; // 500000 IQD
  };
  nassWallet: {
    enabled: boolean;
    apiKey: string;
    merchantId: string;
    minAmount: number; // 1000 IQD
    maxAmount: number; // 2000000 IQD
  };
  defaultGateway: "zainCash" | "fastPay" | "nassWallet";
  fallbackOrder: ("zainCash" | "fastPay" | "nassWallet")[];
}

export interface PaymentRequest {
  amount: number; // In Iraqi Dinar (IQD)
  currency: "IQD";
  description: string;
  customerPhone: string; // Iraqi mobile format
  customerName: string;
  orderId: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  paymentUrl?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  amount: number;
  currency: "IQD";
  gateway: string;
  timestamp: Date;
  errors?: string[];
}

export interface PaymentValidationResult {
  isValid: boolean;
  islamicCompliant: boolean;
  securityScore: number;
  issues: string[];
  recommendations: string[];
}

/**
 * Iraqi Payment Gateway Integration System
 *
 * Manages secure payment processing across Iraqi financial institutions
 * with full Islamic compliance validation.
 */
export class IraqiPaymentGateway {
  private config: PaymentGatewayConfig;
  private readonly islamicFinanceRules: IslamicFinanceRules;
  private transactionCount = 0;
  private fraudDetector: FraudDetector;

  // Islamic finance principles for payment validation
  private readonly islamicFinanceRules: IslamicFinanceRules = {
    prohibited: [
      "ربا",
      "فوائد",
      "قمار",
      "ميسر",
      "غرر",
      "usury",
      "interest",
      "gambling",
      "speculation",
    ],
    required: [
      "موافقة",
      "شفافية",
      "عدالة",
      "أمانة",
      "consent",
      "transparency",
      "fairness",
      "trust",
    ],
    complianceFactors: {
      transparency: 0.3,
      fairness: 0.25,
      consent: 0.25,
      trust: 0.2,
    },
  };

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.fraudDetector = new FraudDetector();
    console.info("Iraqi Payment Gateway initialized with Islamic compliance");
  }

  /**
   * Process payment with Iraqi gateway integration
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Validate request for Islamic compliance
    const validation = await this.validatePayment(request);
    if (!validation.isValid || !validation.islamicCompliant) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        amount: request.amount,
        currency: "IQD",
        gateway: "validation_failed",
        timestamp: new Date(),
        errors: validation.issues,
      };
    }

    // Select optimal gateway
    const gateway = await this.selectOptimalGateway(request);

    try {
      // Process with selected gateway
      const result = await this.processWithGateway(request, gateway);

      // Log transaction for monitoring
      this.logTransaction(request, result);

      return result;
    } catch (error) {
      console.error(`Payment processing failed with ${gateway}:`, error);

      // Try fallback gateways
      return await this.processWithFallback(request);
    }
  }

  /**
   * Validate payment for Islamic compliance
   */
  private async validatePayment(
    request: PaymentRequest,
  ): Promise<PaymentValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let securityScore = 100;

    // Amount validation
    if (request.amount <= 0) {
      issues.push("Invalid payment amount");
      securityScore -= 30;
    }

    // Currency validation
    if (request.currency !== "IQD") {
      issues.push("Only Iraqi Dinar (IQD) is supported");
      securityScore -= 20;
    }

    // Islamic compliance validation
    const islamicCompliance = await this.validateIslamicCompliance(request);
    if (!islamicCompliance.compliant) {
      issues.push(...islamicCompliance.violations);
      securityScore -= 25;
    }

    // Fraud detection
    const fraudRisk = await this.fraudDetector.assessRisk(request);
    if (fraudRisk.score > 0.7) {
      issues.push("High fraud risk detected");
      securityScore -= 40;
      recommendations.push("Additional verification required");
    }

    // Phone number validation (Iraqi format)
    if (!this.validateIraqiPhone(request.customerPhone)) {
      issues.push("Invalid Iraqi phone number format");
      securityScore -= 10;
      recommendations.push("Use format: +964XXXXXXXXX");
    }

    return {
      isValid: issues.length === 0,
      islamicCompliant: islamicCompliance.compliant,
      securityScore: Math.max(0, securityScore),
      issues,
      recommendations,
    };
  }

  /**
   * Validate Islamic financial compliance
   */
  private async validateIslamicCompliance(request: PaymentRequest): Promise<{
    compliant: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    // Check for prohibited elements
    const description = request.description.toLowerCase();
    const metadata = JSON.stringify(request.metadata || {}).toLowerCase();
    const combinedText = `${description} ${metadata}`;

    for (const prohibited of this.islamicFinanceRules.prohibited) {
      if (combinedText.includes(prohibited)) {
        violations.push(`Contains prohibited element: ${prohibited}`);
      }
    }

    // Validate transaction purpose
    if (this.containsGamblingTerms(combinedText)) {
      violations.push(
        "Transaction appears to involve gambling (prohibited in Islam)",
      );
    }

    if (this.containsInterestTerms(combinedText)) {
      violations.push(
        "Transaction appears to involve interest/usury (prohibited in Islam)",
      );
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  }

  /**
   * Select optimal payment gateway based on amount and availability
   */
  private async selectOptimalGateway(request: PaymentRequest): Promise<string> {
    const amount = request.amount;

    // Check gateway availability and limits
    const availableGateways: { name: string; score: number }[] = [];

    // ZainCash evaluation
    if (
      this.config.zainCash.enabled &&
      amount >= this.config.zainCash.minAmount &&
      amount <= this.config.zainCash.maxAmount
    ) {
      const status = await this.checkGatewayHealth("zainCash");
      availableGateways.push({ name: "zainCash", score: status.score });
    }

    // FastPay evaluation
    if (
      this.config.fastPay.enabled &&
      amount >= this.config.fastPay.minAmount &&
      amount <= this.config.fastPay.maxAmount
    ) {
      const status = await this.checkGatewayHealth("fastPay");
      availableGateways.push({ name: "fastPay", score: status.score });
    }

    // NassWallet evaluation
    if (
      this.config.nassWallet.enabled &&
      amount >= this.config.nassWallet.minAmount &&
      amount <= this.config.nassWallet.maxAmount
    ) {
      const status = await this.checkGatewayHealth("nassWallet");
      availableGateways.push({ name: "nassWallet", score: status.score });
    }

    // Select best available gateway
    if (availableGateways.length === 0) {
      throw new Error("No available payment gateways for this amount");
    }

    // Sort by score and return best
    availableGateways.sort((a, b) => b.score - a.score);
    return availableGateways[0].name;
  }

  /**
   * Process payment with specific gateway
   */
  private async processWithGateway(
    request: PaymentRequest,
    gateway: string,
  ): Promise<PaymentResponse> {
    this.transactionCount++;

    switch (gateway) {
      case "zainCash":
        return await this.processZainCash(request);
      case "fastPay":
        return await this.processFastPay(request);
      case "nassWallet":
        return await this.processNassWallet(request);
      default:
        throw new Error(`Unsupported gateway: ${gateway}`);
    }
  }

  /**
   * ZainCash payment processing
   */
  private async processZainCash(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // ZainCash API integration
    const payload = {
      amount: request.amount,
      currency: "IQD",
      orderId: request.orderId,
      description: request.description,
      customerPhone: request.customerPhone,
      returnUrl: request.returnUrl,
      merchantId: this.config.zainCash.merchantId,
    };

    // Simulate API call (replace with actual ZainCash API)
    const response = await this.callZainCashAPI(payload);

    return {
      success: response.success,
      transactionId: response.transactionId || `zc_${Date.now()}`,
      paymentUrl: response.paymentUrl,
      status: response.status || "pending",
      amount: request.amount,
      currency: "IQD",
      gateway: "zainCash",
      timestamp: new Date(),
      errors: response.errors,
    };
  }

  /**
   * FastPay payment processing
   */
  private async processFastPay(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // FastPay API integration
    const payload = {
      amount: request.amount,
      currency: "IQD",
      orderId: request.orderId,
      description: request.description,
      customerPhone: request.customerPhone,
      returnUrl: request.returnUrl,
      merchantId: this.config.fastPay.merchantId,
    };

    // Simulate API call (replace with actual FastPay API)
    const response = await this.callFastPayAPI(payload);

    return {
      success: response.success,
      transactionId: response.transactionId || `fp_${Date.now()}`,
      paymentUrl: response.paymentUrl,
      status: response.status || "pending",
      amount: request.amount,
      currency: "IQD",
      gateway: "fastPay",
      timestamp: new Date(),
      errors: response.errors,
    };
  }

  /**
   * NassWallet payment processing
   */
  private async processNassWallet(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // NassWallet API integration
    const payload = {
      amount: request.amount,
      currency: "IQD",
      orderId: request.orderId,
      description: request.description,
      customerPhone: request.customerPhone,
      returnUrl: request.returnUrl,
      merchantId: this.config.nassWallet.merchantId,
    };

    // Simulate API call (replace with actual NassWallet API)
    const response = await this.callNassWalletAPI(payload);

    return {
      success: response.success,
      transactionId: response.transactionId || `nw_${Date.now()}`,
      paymentUrl: response.paymentUrl,
      status: response.status || "pending",
      amount: request.amount,
      currency: "IQD",
      gateway: "nassWallet",
      timestamp: new Date(),
      errors: response.errors,
    };
  }

  /**
   * Process with fallback gateways
   */
  private async processWithFallback(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    for (const gateway of this.config.fallbackOrder) {
      try {
        const result = await this.processWithGateway(request, gateway);
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.warn(`Fallback gateway ${gateway} failed:`, error);
      }
    }

    return {
      success: false,
      transactionId: "",
      status: "failed",
      amount: request.amount,
      currency: "IQD",
      gateway: "all_failed",
      timestamp: new Date(),
      errors: ["All payment gateways failed"],
    };
  }

  /**
   * Check gateway health and performance
   */
  private async checkGatewayHealth(
    gateway: string,
  ): Promise<{ score: number }> {
    // Simulate health check (implement actual health monitoring)
    const baseScore = 85;
    const randomVariance = Math.random() * 30 - 15; // -15 to +15
    const score = Math.max(0, Math.min(100, baseScore + randomVariance));

    return { score };
  }

  /**
   * Validate Iraqi phone number format
   */
  private validateIraqiPhone(phone: string): boolean {
    // Iraqi phone formats: +964XXXXXXXXX or 07XXXXXXXX
    const iraqiPhoneRegex = /^(\+964|0?7)[0-9]{9}$/;
    return iraqiPhoneRegex.test(phone);
  }

  /**
   * Check for gambling-related terms
   */
  private containsGamblingTerms(text: string): boolean {
    const gamblingTerms = [
      "قمار",
      "ميسر",
      "رهان",
      "يانصيب",
      "gambling",
      "betting",
      "lottery",
      "casino",
    ];
    return gamblingTerms.some((term) => text.includes(term));
  }

  /**
   * Check for interest/usury terms
   */
  private containsInterestTerms(text: string): boolean {
    const interestTerms = [
      "ربا",
      "فوائد",
      "interest",
      "usury",
      "loan interest",
    ];
    return interestTerms.some((term) => text.includes(term));
  }

  /**
   * Log transaction for monitoring
   */
  private logTransaction(
    request: PaymentRequest,
    response: PaymentResponse,
  ): void {
    console.info("Payment transaction logged:", {
      orderId: request.orderId,
      amount: request.amount,
      gateway: response.gateway,
      status: response.status,
      timestamp: response.timestamp,
    });
  }

  // Placeholder API methods (replace with actual implementations)
  private async callZainCashAPI(payload: any): Promise<any> {
    // Replace with actual ZainCash API integration
    return {
      success: true,
      transactionId: `zc_${Date.now()}`,
      status: "pending",
    };
  }

  private async callFastPayAPI(payload: any): Promise<any> {
    // Replace with actual FastPay API integration
    return {
      success: true,
      transactionId: `fp_${Date.now()}`,
      status: "pending",
    };
  }

  private async callNassWalletAPI(payload: any): Promise<any> {
    // Replace with actual NassWallet API integration
    return {
      success: true,
      transactionId: `nw_${Date.now()}`,
      status: "pending",
    };
  }

  /**
   * Get payment gateway statistics
   */
  getGatewayStats() {
    return {
      totalTransactions: this.transactionCount,
      enabledGateways: {
        zainCash: this.config.zainCash.enabled,
        fastPay: this.config.fastPay.enabled,
        nassWallet: this.config.nassWallet.enabled,
      },
      defaultGateway: this.config.defaultGateway,
      islamicCompliance: true,
    };
  }
}

// Supporting interfaces and classes
interface IslamicFinanceRules {
  prohibited: string[];
  required: string[];
  complianceFactors: {
    transparency: number;
    fairness: number;
    consent: number;
    trust: number;
  };
}

class FraudDetector {
  async assessRisk(
    request: PaymentRequest,
  ): Promise<{ score: number; factors: string[] }> {
    // Implement fraud detection logic
    return { score: Math.random() * 0.3, factors: [] }; // Low risk simulation
  }
}
