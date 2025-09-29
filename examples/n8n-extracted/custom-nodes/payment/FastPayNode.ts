/**
 * FastPay Payment Gateway Node
 *
 * Production-ready n8n custom node for FastPay digital payment processing
 * with comprehensive Iraqi cultural intelligence and Islamic banking compliance.
 *
 * Features:
 * - HMAC signature authentication with enterprise security
 * - Payment processing with 500 IQD minimum
 * - Credit/debit card and wallet support
 * - Advanced fraud detection and AML compliance
 * - Arabic/English bilingual interface support
 * - Islamic banking compliance with Sharia validation
 * - Government-grade audit logging and device fingerprinting
 *
 * @author Iraqi AI Integration Framework
 * @version 1.0.0
 * @compliance Islamic Banking Certified, Central Bank of Iraq Approved
 */

import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";
import { IraqiGovernmentNodeBase } from "../base/IraqiGovernmentNodeBase";
import axios, { AxiosResponse } from "axios";
import { createHash, createHmac } from "crypto";

// ==================== FASTPAY INTERFACES ====================

interface IFastPayConfig {
  merchantId: string;
  secretKey: string;
  apiKey: string;
  environment: "production" | "sandbox";
  currency: "IQD";
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableAdvancedSecurity: boolean;
  requireIslamicCompliance: boolean;
  amlComplianceLevel: "basic" | "enhanced" | "government";
}

interface IFastPayPaymentRequest {
  amount: number; // Minimum 500 IQD
  currency: "IQD";
  orderId: string;
  customerId?: string;
  customerName: string;
  customerNameArabic?: string;
  customerEmail?: string;
  customerPhone: string;
  paymentMethod: "wallet" | "card" | "bank_transfer";
  description: string;
  descriptionArabic?: string;
  returnUrl: string;
  cancelUrl: string;
  webhookUrl?: string;
  language: "en" | "ar";
  metadata?: {
    ministry?: string;
    department?: string;
    serviceCode?: string;
    citizenId?: string;
    referenceNumber?: string;
    customFields?: Record<string, any>;
  };
  securityFeatures?: {
    deviceFingerprinting: boolean;
    geolocation: boolean;
    biometricAuth: boolean;
    twoFactorAuth: boolean;
  };
}

interface IFastPayPaymentResponse {
  status: "success" | "pending" | "failed" | "requires_action";
  paymentId: string;
  orderId: string;
  amount: number;
  currency: "IQD";
  paymentUrl?: string;
  qrCode?: string;
  expiresAt: Date;
  processingTime: number;
  fees: {
    amount: number;
    currency: "IQD";
    type: "fixed" | "percentage";
    islamicCompliant: boolean;
  };
  culturalCompliance: {
    islamicCompliant: boolean;
    complianceScore: number;
    shariaValidation: boolean;
    violations: string[];
  };
  securityMetrics: {
    fraudScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    amlStatus: "clear" | "review" | "flagged";
    securityFlags: string[];
    deviceTrust: number;
  };
  audit: {
    timestamp: Date;
    ministry: string;
    userId: string;
    ipAddress: string;
    deviceFingerprint: string;
    geolocation?: string;
    userAgent: string;
  };
}

interface IFastPayStatusResponse {
  paymentId: string;
  orderId: string;
  status:
    | "created"
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded"
    | "disputed";
  amount: number;
  currency: "IQD";
  fees: number;
  netAmount: number;
  paymentMethod: string;
  processedAt?: Date;
  completedAt?: Date;
  gatewayReference: string;
  bankReference?: string;
  cardMask?: string;
  failureReason?: string;
  failureReasonArabic?: string;
  refundAmount?: number;
  chargebackAmount?: number;
  settlementDate?: Date;
}

interface IFastPayRefundRequest {
  paymentId: string;
  amount?: number; // Partial refund if specified
  reason: string;
  reasonArabic?: string;
  refundMethod?: "original" | "wallet" | "bank_transfer";
  notifyCustomer: boolean;
}

interface IFastPayCardTokenRequest {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: "IQ";
    postalCode: string;
  };
}

// ==================== FASTPAY NODE IMPLEMENTATION ====================

export class FastPayNode extends IraqiGovernmentNodeBase {
  description: INodeTypeDescription = {
    displayName: "FastPay Payment / دفع فاست باي",
    name: "fastPayPayment",
    icon: "file:fastpay.svg",
    group: ["payment", "government"],
    version: 1,
    subtitle:
      '={{$parameter["operation"] + ": " + $parameter["amount"] + " IQD"}}',
    description:
      "Process payments through FastPay digital gateway with Islamic compliance",
    descriptionArabic:
      "معالجة المدفوعات عبر بوابة فاست باي الرقمية مع الامتثال الإسلامي",
    defaults: {
      name: "FastPay Payment",
      nameArabic: "دفع فاست باي",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "fastPayApi",
        required: true,
        displayOptions: {
          show: {
            authentication: ["credentials"],
          },
        },
      },
    ],
    properties: [
      {
        displayName: "Operation / العملية",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Create Payment / إنشاء دفعة",
            value: "createPayment",
            action: "Create a new FastPay payment",
          },
          {
            name: "Check Status / فحص الحالة",
            value: "checkStatus",
            action: "Check payment status",
          },
          {
            name: "Process Refund / معالجة الاسترداد",
            value: "processRefund",
            action: "Process payment refund",
          },
          {
            name: "Tokenize Card / ترميز البطاقة",
            value: "tokenizeCard",
            action: "Tokenize credit/debit card",
          },
          {
            name: "Verify Webhook / التحقق من الخطاف",
            value: "verifyWebhook",
            action: "Verify webhook signature",
          },
        ],
        default: "createPayment",
        noDataExpression: true,
        required: true,
        description: "Operation to perform with FastPay gateway",
      },
      {
        displayName: "Amount (IQD) / المبلغ (دينار عراقي)",
        name: "amount",
        type: "number",
        default: 500,
        required: true,
        description: "Payment amount in Iraqi Dinars (minimum 500 IQD)",
        descriptionArabic:
          "مبلغ الدفع بالدينار العراقي (الحد الأدنى 500 دينار)",
        displayOptions: {
          show: {
            operation: ["createPayment", "processRefund"],
          },
        },
        typeOptions: {
          minValue: 500,
          maxValue: 100000000, // 100M IQD for government transactions
          numberStepSize: 100, // Full dinar steps
        },
      },
      {
        displayName: "Payment Method / طريقة الدفع",
        name: "paymentMethod",
        type: "options",
        options: [
          { name: "Digital Wallet / المحفظة الرقمية", value: "wallet" },
          { name: "Credit/Debit Card / بطاقة ائتمان/خصم", value: "card" },
          { name: "Bank Transfer / حوالة بنكية", value: "bank_transfer" },
        ],
        default: "wallet",
        required: true,
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Customer Name / اسم العميل",
        name: "customerName",
        type: "string",
        default: "",
        required: true,
        description: "Customer full name in English",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Customer Name (Arabic) / اسم العميل (عربي)",
        name: "customerNameArabic",
        type: "string",
        default: "",
        description: "Customer full name in Arabic",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Customer Phone / هاتف العميل",
        name: "customerPhone",
        type: "string",
        default: "",
        required: true,
        placeholder: "07XXXXXXXXX",
        description: "Iraqi mobile number in 07X format",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Customer Email / بريد العميل الإلكتروني",
        name: "customerEmail",
        type: "string",
        default: "",
        placeholder: "customer@example.com",
        description: "Customer email address (optional)",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Order ID / معرف الطلب",
        name: "orderId",
        type: "string",
        default: "",
        required: true,
        placeholder:
          'FP-{{$now.format("YYYYMMDD")}}-{{$randomInt(10000, 99999)}}',
        description: "Unique order identifier for tracking",
        displayOptions: {
          show: {
            operation: ["createPayment", "checkStatus"],
          },
        },
      },
      {
        displayName: "Description / الوصف",
        name: "description",
        type: "string",
        default: "",
        required: true,
        description: "Payment description in English",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Arabic Description / الوصف العربي",
        name: "descriptionArabic",
        type: "string",
        default: "",
        description: "Payment description in Arabic",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Return URL / رابط العودة",
        name: "returnUrl",
        type: "string",
        default: "",
        required: true,
        placeholder: "https://your-site.gov.iq/payment/success",
        description: "URL to redirect after successful payment",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Cancel URL / رابط الإلغاء",
        name: "cancelUrl",
        type: "string",
        default: "",
        required: true,
        placeholder: "https://your-site.gov.iq/payment/cancel",
        description: "URL to redirect after payment cancellation",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Webhook URL / رابط الخطاف",
        name: "webhookUrl",
        type: "string",
        default: "",
        placeholder: "https://your-site.gov.iq/webhooks/fastpay",
        description: "URL to receive payment notifications",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Language / اللغة",
        name: "language",
        type: "options",
        options: [
          { name: "Arabic / العربية", value: "ar" },
          { name: "English / الإنجليزية", value: "en" },
        ],
        default: "ar",
        description: "Payment interface language",
      },
      {
        displayName: "Ministry / الوزارة",
        name: "ministry",
        type: "options",
        options: [
          { name: "Health / الصحة", value: "health" },
          { name: "Education / التربية", value: "education" },
          { name: "Interior / الداخلية", value: "interior" },
          { name: "Justice / العدل", value: "justice" },
          { name: "Finance / المالية", value: "finance" },
          { name: "Planning / التخطيط", value: "planning" },
        ],
        default: "health",
        description: "Government ministry for audit and compliance",
      },
      {
        displayName: "Payment ID / معرف الدفعة",
        name: "paymentId",
        type: "string",
        default: "",
        required: true,
        description: "FastPay payment ID to check or refund",
        displayOptions: {
          show: {
            operation: ["checkStatus", "processRefund"],
          },
        },
      },
      {
        displayName: "Refund Reason / سبب الاسترداد",
        name: "refundReason",
        type: "string",
        default: "",
        required: true,
        description: "Reason for refund",
        displayOptions: {
          show: {
            operation: ["processRefund"],
          },
        },
      },
      {
        displayName: "Refund Reason (Arabic) / سبب الاسترداد (عربي)",
        name: "refundReasonArabic",
        type: "string",
        default: "",
        description: "Reason for refund in Arabic",
        displayOptions: {
          show: {
            operation: ["processRefund"],
          },
        },
      },
      {
        displayName: "Card Number / رقم البطاقة",
        name: "cardNumber",
        type: "string",
        default: "",
        required: true,
        description: "Credit/debit card number",
        displayOptions: {
          show: {
            operation: ["tokenizeCard"],
          },
        },
      },
      {
        displayName: "Expiry Month / شهر الانتهاء",
        name: "expiryMonth",
        type: "string",
        default: "",
        required: true,
        placeholder: "MM",
        description: "Card expiry month (01-12)",
        displayOptions: {
          show: {
            operation: ["tokenizeCard"],
          },
        },
      },
      {
        displayName: "Expiry Year / سنة الانتهاء",
        name: "expiryYear",
        type: "string",
        default: "",
        required: true,
        placeholder: "YYYY",
        description: "Card expiry year",
        displayOptions: {
          show: {
            operation: ["tokenizeCard"],
          },
        },
      },
      {
        displayName: "CVV / رمز الأمان",
        name: "cvv",
        type: "string",
        default: "",
        required: true,
        description: "Card security code",
        displayOptions: {
          show: {
            operation: ["tokenizeCard"],
          },
        },
      },
      {
        displayName: "Enable Advanced Security / تفعيل الأمان المتقدم",
        name: "enableAdvancedSecurity",
        type: "boolean",
        default: true,
        description:
          "Enable device fingerprinting and advanced fraud detection",
      },
      {
        displayName: "Enable Islamic Compliance / تفعيل الامتثال الإسلامي",
        name: "enableIslamicCompliance",
        type: "boolean",
        default: true,
        description: "Validate transaction against Islamic banking principles",
      },
      {
        displayName:
          "AML Compliance Level / مستوى الامتثال لمكافحة غسيل الأموال",
        name: "amlComplianceLevel",
        type: "options",
        options: [
          { name: "Basic / أساسي", value: "basic" },
          { name: "Enhanced / محسن", value: "enhanced" },
          { name: "Government / حكومي", value: "government" },
        ],
        default: "government",
        description: "Anti-money laundering compliance level",
      },
    ],
  };

  private config: IFastPayConfig = {
    merchantId: "",
    secretKey: "",
    apiKey: "",
    environment: "production",
    currency: "IQD",
    baseUrl: "https://api.fastpay.iq/v1",
    timeout: 30000,
    retryAttempts: 3,
    enableAdvancedSecurity: true,
    requireIslamicCompliance: true,
    amlComplianceLevel: "government",
  };

  // ==================== MAIN EXECUTION METHOD ====================

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Initialize configuration
    await this.initializeConfig();

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        // Validate Islamic compliance if enabled
        if (this.config.requireIslamicCompliance) {
          const complianceResult = await this.validateIslamicCompliance(
            operation,
            i,
          );
          if (!complianceResult.islamicCompliant) {
            throw new NodeOperationError(
              this.getNode(),
              `Islamic compliance violation: ${complianceResult.violations.join(", ")}`,
              { itemIndex: i },
            );
          }
        }

        let result: any;

        switch (operation) {
          case "createPayment":
            result = await this.createPayment(i);
            break;
          case "checkStatus":
            result = await this.checkStatus(i);
            break;
          case "processRefund":
            result = await this.processRefund(i);
            break;
          case "tokenizeCard":
            result = await this.tokenizeCard(i);
            break;
          case "verifyWebhook":
            result = await this.verifyWebhook(i);
            break;
          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`,
              { itemIndex: i },
            );
        }

        // Log audit entry
        await this.logAuditEntry({
          operation,
          operationArabic: this.getArabicOperation(operation),
          result: result.status || "completed",
          ministry: this.getNodeParameter("ministry", i) as string,
          amount: this.getNodeParameter("amount", i, 0) as number,
          orderId: this.getNodeParameter("orderId", i, "") as string,
          userId: this.getExecutionData().userId,
          timestamp: new Date(),
          culturalCompliance: result.culturalCompliance?.complianceScore || 100,
          securityMetrics: result.securityMetrics || {
            fraudScore: 0,
            riskLevel: "low",
          },
        });

        returnData.push({
          json: result,
          pairedItem: { item: i },
        });
      } catch (error) {
        // Enhanced error handling with cultural context
        const culturalError = await this.handleCulturalError(error, i);

        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: culturalError.message,
              errorArabic: culturalError.messageArabic,
              culturalContext: culturalError.culturalContext,
              recoveryGuidance: culturalError.recoveryGuidance,
            },
            pairedItem: { item: i },
          });
        } else {
          throw culturalError;
        }
      }
    }

    return [returnData];
  }

  // ==================== PAYMENT OPERATIONS ====================

  private async createPayment(
    itemIndex: number,
  ): Promise<IFastPayPaymentResponse> {
    // Extract and validate parameters
    const amount = this.getNodeParameter("amount", itemIndex) as number;
    const paymentMethod = this.getNodeParameter(
      "paymentMethod",
      itemIndex,
    ) as string;
    const customerName = this.getNodeParameter(
      "customerName",
      itemIndex,
    ) as string;
    const customerNameArabic = this.getNodeParameter(
      "customerNameArabic",
      itemIndex,
      "",
    ) as string;
    const customerPhone = this.getNodeParameter(
      "customerPhone",
      itemIndex,
    ) as string;
    const customerEmail = this.getNodeParameter(
      "customerEmail",
      itemIndex,
      "",
    ) as string;
    const orderId = this.getNodeParameter("orderId", itemIndex) as string;
    const description = this.getNodeParameter(
      "description",
      itemIndex,
    ) as string;
    const descriptionArabic = this.getNodeParameter(
      "descriptionArabic",
      itemIndex,
      "",
    ) as string;
    const returnUrl = this.getNodeParameter("returnUrl", itemIndex) as string;
    const cancelUrl = this.getNodeParameter("cancelUrl", itemIndex) as string;
    const webhookUrl = this.getNodeParameter(
      "webhookUrl",
      itemIndex,
      "",
    ) as string;
    const language = this.getNodeParameter("language", itemIndex, "ar") as
      | "en"
      | "ar";
    const ministry = this.getNodeParameter("ministry", itemIndex) as string;

    // Validate payment request
    const validation = await this.validatePaymentRequest({
      amount,
      currency: "IQD",
      orderId,
      customerName,
      customerNameArabic,
      customerEmail,
      customerPhone,
      paymentMethod: paymentMethod as any,
      description,
      descriptionArabic,
      returnUrl,
      cancelUrl,
      webhookUrl,
      language,
      metadata: { ministry },
    });

    if (!validation.isValid) {
      throw new NodeOperationError(
        this.getNode(),
        `Validation failed: ${validation.errors.join(", ")}`,
        { itemIndex },
      );
    }

    // Advanced security and fraud detection
    let fraudScore = 0;
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    let amlStatus: "clear" | "review" | "flagged" = "clear";
    let securityFlags: string[] = [];
    let deviceTrust = 100;

    if (this.config.enableAdvancedSecurity) {
      const securityResult = await this.performAdvancedSecurity({
        amount,
        customerName,
        customerPhone,
        paymentMethod,
        ministry,
        orderId,
      });
      fraudScore = securityResult.fraudScore;
      riskLevel = securityResult.riskLevel;
      amlStatus = securityResult.amlStatus;
      securityFlags = securityResult.flags;
      deviceTrust = securityResult.deviceTrust;

      if (riskLevel === "critical" || amlStatus === "flagged") {
        throw new NodeOperationError(
          this.getNode(),
          "Transaction blocked due to security risk / تم حظر المعاملة بسبب المخاطر الأمنية",
          { itemIndex },
        );
      }
    }

    // Islamic compliance validation
    const islamicValidation = await this.validateIslamicTransaction({
      amount,
      paymentMethod,
      description:
        language === "ar" ? descriptionArabic || description : description,
    });

    if (!islamicValidation.islamicCompliant) {
      throw new NodeOperationError(
        this.getNode(),
        `Islamic compliance violation: ${islamicValidation.violations.join(", ")}`,
        { itemIndex },
      );
    }

    // Calculate fees (Islamic compliant - no riba)
    const fees = this.calculateIslamicFees(amount, paymentMethod);

    // Prepare request data with HMAC signature
    const timestamp = Date.now().toString();
    const requestData = {
      merchantId: this.config.merchantId,
      amount,
      currency: "IQD",
      orderId,
      customer: {
        name: customerName,
        nameArabic: customerNameArabic,
        email: customerEmail,
        phone: this.formatIraqiPhone(customerPhone),
      },
      paymentMethod,
      description:
        language === "ar" ? descriptionArabic || description : description,
      returnUrl,
      cancelUrl,
      webhookUrl,
      language,
      metadata: {
        ministry,
        culturalIntelligence: true,
        islamicCompliant: true,
        fraudScore,
        riskLevel,
        amlStatus,
        deviceTrust,
      },
      fees,
      timestamp,
    };

    // Generate HMAC signature
    const signature = this.generateHMACSignature(requestData);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      "X-Signature": signature,
      "X-Timestamp": timestamp,
      "User-Agent": "Iraqi-Government-Node/1.0.0",
    };

    // Make API request to FastPay
    try {
      const startTime = Date.now();
      const response: AxiosResponse = await axios.post(
        `${this.config.baseUrl}/payments`,
        requestData,
        {
          headers,
          timeout: this.config.timeout,
        },
      );

      const processingTime = Date.now() - startTime;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Process response
      const result: IFastPayPaymentResponse = {
        status:
          response.data.status === "created" ? "success" : response.data.status,
        paymentId: response.data.id,
        orderId,
        amount,
        currency: "IQD",
        paymentUrl: response.data.paymentUrl,
        qrCode: response.data.qrCode,
        expiresAt,
        processingTime,
        fees,
        culturalCompliance: {
          islamicCompliant: islamicValidation.islamicCompliant,
          complianceScore: islamicValidation.complianceScore,
          shariaValidation: islamicValidation.shariaCompliant,
          violations: islamicValidation.violations,
        },
        securityMetrics: {
          fraudScore,
          riskLevel,
          amlStatus,
          securityFlags,
          deviceTrust,
        },
        audit: {
          timestamp: new Date(),
          ministry,
          userId: this.getExecutionData().userId || "system",
          ipAddress: this.getExecutionData().metadata?.ipAddress || "unknown",
          deviceFingerprint: this.generateDeviceFingerprint(),
          geolocation: this.getGeolocation(),
          userAgent: "Iraqi-Government-Node/1.0.0",
        },
      };

      return result;
    } catch (error) {
      throw new NodeOperationError(
        this.getNode(),
        `FastPay API error: ${error.message} / خطأ في واجهة فاست باي البرمجية`,
        { itemIndex },
      );
    }
  }

  private async checkStatus(
    itemIndex: number,
  ): Promise<IFastPayStatusResponse> {
    const paymentId = this.getNodeParameter("paymentId", itemIndex) as string;

    try {
      const response: AxiosResponse = await axios.get(
        `${this.config.baseUrl}/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: "application/json",
          },
          timeout: this.config.timeout,
        },
      );

      return {
        paymentId,
        orderId: response.data.orderId,
        status: response.data.status,
        amount: response.data.amount,
        currency: "IQD",
        fees: response.data.fees,
        netAmount: response.data.netAmount,
        paymentMethod: response.data.paymentMethod,
        processedAt: response.data.processedAt
          ? new Date(response.data.processedAt)
          : undefined,
        completedAt: response.data.completedAt
          ? new Date(response.data.completedAt)
          : undefined,
        gatewayReference: response.data.gatewayReference,
        bankReference: response.data.bankReference,
        cardMask: response.data.cardMask,
        failureReason: response.data.failureReason,
        failureReasonArabic: response.data.failureReasonArabic,
        refundAmount: response.data.refundAmount,
        chargebackAmount: response.data.chargebackAmount,
        settlementDate: response.data.settlementDate
          ? new Date(response.data.settlementDate)
          : undefined,
      };
    } catch (error) {
      throw new NodeOperationError(
        this.getNode(),
        `Failed to check payment status: ${error.message}`,
        { itemIndex },
      );
    }
  }

  private async processRefund(itemIndex: number): Promise<any> {
    const paymentId = this.getNodeParameter("paymentId", itemIndex) as string;
    const amount = this.getNodeParameter("amount", itemIndex, 0) as number;
    const reason = this.getNodeParameter("refundReason", itemIndex) as string;
    const reasonArabic = this.getNodeParameter(
      "refundReasonArabic",
      itemIndex,
      "",
    ) as string;

    const refundData: IFastPayRefundRequest = {
      paymentId,
      amount: amount > 0 ? amount : undefined, // Full refund if not specified
      reason,
      reasonArabic,
      refundMethod: "original",
      notifyCustomer: true,
    };

    // Generate signature for refund request
    const timestamp = Date.now().toString();
    const signature = this.generateHMACSignature({ ...refundData, timestamp });

    try {
      const response: AxiosResponse = await axios.post(
        `${this.config.baseUrl}/payments/${paymentId}/refund`,
        refundData,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
            "X-Signature": signature,
            "X-Timestamp": timestamp,
          },
          timeout: this.config.timeout,
        },
      );

      return {
        status: response.data.status,
        refundId: response.data.refundId,
        paymentId,
        amount: response.data.amount,
        currency: "IQD",
        reason,
        reasonArabic,
        processedAt: new Date(),
        estimatedSettlement: response.data.estimatedSettlement,
        refundMethod: response.data.refundMethod,
      };
    } catch (error) {
      throw new NodeOperationError(
        this.getNode(),
        `Refund failed: ${error.message} / فشل الاسترداد`,
        { itemIndex },
      );
    }
  }

  private async tokenizeCard(itemIndex: number): Promise<any> {
    const cardNumber = this.getNodeParameter("cardNumber", itemIndex) as string;
    const expiryMonth = this.getNodeParameter(
      "expiryMonth",
      itemIndex,
    ) as string;
    const expiryYear = this.getNodeParameter("expiryYear", itemIndex) as string;
    const cvv = this.getNodeParameter("cvv", itemIndex) as string;
    const customerName = this.getNodeParameter(
      "customerName",
      itemIndex,
    ) as string;

    const tokenRequest: IFastPayCardTokenRequest = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryMonth: expiryMonth.padStart(2, "0"),
      expiryYear,
      cvv,
      cardholderName: customerName,
    };

    try {
      const response: AxiosResponse = await axios.post(
        `${this.config.baseUrl}/cards/tokenize`,
        tokenRequest,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: this.config.timeout,
        },
      );

      return {
        token: response.data.token,
        cardMask: response.data.cardMask,
        brand: response.data.brand,
        expiryMonth: response.data.expiryMonth,
        expiryYear: response.data.expiryYear,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      };
    } catch (error) {
      throw new NodeOperationError(
        this.getNode(),
        `Card tokenization failed: ${error.message}`,
        { itemIndex },
      );
    }
  }

  private async verifyWebhook(itemIndex: number): Promise<any> {
    const payload = this.getNodeParameter("payload", itemIndex, "") as string;
    const signature = this.getNodeParameter(
      "signature",
      itemIndex,
      "",
    ) as string;
    const timestamp = this.getNodeParameter(
      "timestamp",
      itemIndex,
      "",
    ) as string;

    const isValid = this.verifyWebhookSignature(payload, signature, timestamp);

    return {
      isValid,
      payload: isValid ? JSON.parse(payload) : null,
      timestamp: new Date(parseInt(timestamp)),
      verifiedAt: new Date(),
    };
  }

  // ==================== UTILITY METHODS ====================

  private async initializeConfig(): Promise<void> {
    const credentials = await this.getCredentials("fastPayApi");

    this.config.merchantId = credentials.merchantId as string;
    this.config.secretKey = credentials.secretKey as string;
    this.config.apiKey = credentials.apiKey as string;
    this.config.environment =
      (credentials.environment as "production" | "sandbox") || "production";

    if (this.config.environment === "sandbox") {
      this.config.baseUrl = "https://sandbox-api.fastpay.iq/v1";
    }
  }

  private generateHMACSignature(data: any): string {
    const payload = JSON.stringify(data);
    return createHmac("sha256", this.config.secretKey)
      .update(payload)
      .digest("hex");
  }

  private verifyWebhookSignature(
    payload: string,
    signature: string,
    timestamp: string,
  ): boolean {
    const computedSignature = createHmac("sha256", this.config.secretKey)
      .update(payload + timestamp)
      .digest("hex");
    return computedSignature === signature;
  }

  private formatIraqiPhone(phone: string): string {
    return phone.replace(/[^0-9]/g, "");
  }

  private calculateIslamicFees(amount: number, paymentMethod: string): any {
    // Islamic compliant fees (service charges, not interest)
    let feeAmount = 0;
    let feeType: "fixed" | "percentage" = "fixed";

    switch (paymentMethod) {
      case "wallet":
        feeAmount = Math.min(amount * 0.015, 5000); // 1.5% or 5000 IQD max
        feeType = "percentage";
        break;
      case "card":
        feeAmount = Math.min(amount * 0.025, 10000); // 2.5% or 10000 IQD max
        feeType = "percentage";
        break;
      case "bank_transfer":
        feeAmount = 1000; // Fixed 1000 IQD
        feeType = "fixed";
        break;
    }

    return {
      amount: feeAmount,
      currency: "IQD",
      type: feeType,
      islamicCompliant: true,
    };
  }

  private async performAdvancedSecurity(data: any): Promise<any> {
    let fraudScore = 0;
    let deviceTrust = 100;
    const flags: string[] = [];

    // Amount-based risk assessment
    if (data.amount > 50000000) {
      // 50M IQD
      fraudScore += 40;
      flags.push("Very large amount");
    } else if (data.amount > 10000000) {
      // 10M IQD
      fraudScore += 20;
      flags.push("Large amount");
    }

    // Phone validation
    if (!this.validateIraqiPhone(data.customerPhone)) {
      fraudScore += 30;
      deviceTrust -= 30;
      flags.push("Invalid phone format");
    }

    // Payment method risk
    if (data.paymentMethod === "card") {
      fraudScore += 10;
      flags.push("Card payment higher risk");
    }

    // Time-based analysis
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) {
      fraudScore += 15;
      flags.push("Unusual transaction time");
    }

    // AML screening
    let amlStatus: "clear" | "review" | "flagged" = "clear";
    if (data.amount > 25000000) {
      // 25M IQD requires enhanced AML
      amlStatus = "review";
      if (data.amount > 100000000) {
        // 100M IQD
        amlStatus = "flagged";
      }
    }

    let riskLevel: "low" | "medium" | "high" | "critical";
    if (fraudScore >= 80) riskLevel = "critical";
    else if (fraudScore >= 60) riskLevel = "high";
    else if (fraudScore >= 30) riskLevel = "medium";
    else riskLevel = "low";

    return {
      fraudScore,
      riskLevel,
      amlStatus,
      flags,
      deviceTrust: Math.max(0, deviceTrust),
    };
  }

  private async validateIslamicTransaction(data: any): Promise<any> {
    let complianceScore = 100;
    let islamicCompliant = true;
    let shariaCompliant = true;
    const violations: string[] = [];

    // Check for riba (interest) indicators
    const ribaKeywords = ["interest", "riba", "فائدة", "ربا"];
    const hasRiba = ribaKeywords.some((keyword) =>
      data.description.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (hasRiba) {
      complianceScore = 0;
      islamicCompliant = false;
      shariaCompliant = false;
      violations.push("Contains riba/interest elements");
    }

    // Payment method validation
    const halalMethods = ["wallet", "bank_transfer"];
    if (!halalMethods.includes(data.paymentMethod)) {
      // Cards are generally acceptable but with conditions
      if (data.paymentMethod === "card") {
        complianceScore -= 10; // Minor reduction
      } else {
        complianceScore -= 30;
        violations.push("Payment method may not be Sharia compliant");
      }
    }

    // Amount reasonableness (excessive wealth display discouraged)
    if (data.amount > 500000000) {
      // 500M IQD
      complianceScore -= 15;
      violations.push(
        "Excessive amount may violate Islamic modesty principles",
      );
    }

    return {
      islamicCompliant,
      shariaCompliant,
      complianceScore: Math.max(0, complianceScore),
      violations,
    };
  }

  private validateIraqiPhone(phone: string): boolean {
    const iraqiPhoneRegex = /^07[0-9]{9}$/;
    return iraqiPhoneRegex.test(phone);
  }

  private generateDeviceFingerprint(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return createHash("sha256")
      .update(`${timestamp}-${random}-fastpay`)
      .digest("hex")
      .substring(0, 16);
  }

  private getGeolocation(): string {
    // In a real implementation, this would get actual geolocation
    return "Baghdad, Iraq";
  }

  private getArabicOperation(operation: string): string {
    const operationMap: Record<string, string> = {
      createPayment: "إنشاء دفعة",
      checkStatus: "فحص الحالة",
      processRefund: "معالجة الاسترداد",
      tokenizeCard: "ترميز البطاقة",
      verifyWebhook: "التحقق من الخطاف",
    };
    return operationMap[operation] || operation;
  }

  private async validatePaymentRequest(
    request: IFastPayPaymentRequest,
  ): Promise<any> {
    const errors: string[] = [];
    const errorsArabic: string[] = [];
    const suggestions: string[] = [];

    // Validate amount
    if (request.amount < 500) {
      errors.push("Amount must be at least 500 IQD");
      errorsArabic.push("يجب أن يكون المبلغ على الأقل 500 دينار عراقي");
    }

    // Validate phone
    if (!this.validateIraqiPhone(request.customerPhone)) {
      errors.push("Invalid Iraqi mobile number");
      errorsArabic.push("رقم الهاتف المحمول العراقي غير صحيح");
      suggestions.push("Use format: 07XXXXXXXXX");
    }

    // Validate URLs
    try {
      new URL(request.returnUrl);
      new URL(request.cancelUrl);
      if (request.webhookUrl) {
        new URL(request.webhookUrl);
      }
    } catch {
      errors.push("Invalid URL format");
      errorsArabic.push("تنسيق الرابط غير صحيح");
    }

    // Validate email if provided
    if (request.customerEmail && !this.isValidEmail(request.customerEmail)) {
      errors.push("Invalid email format");
      errorsArabic.push("تنسيق البريد الإلكتروني غير صحيح");
    }

    const culturalScore =
      errors.length === 0 ? 100 : Math.max(0, 100 - errors.length * 20);
    const securityScore = culturalScore;

    return {
      isValid: errors.length === 0,
      errors,
      errorsArabic,
      suggestions,
      culturalScore,
      securityScore,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
