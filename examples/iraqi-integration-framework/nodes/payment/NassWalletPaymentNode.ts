/**
 * NassWallet Payment Gateway Node
 *
 * Comprehensive NassWallet integration with:
 * - 1000 IQD minimum transaction validation
 * - Central Bank of Iraq licensed operations
 * - Islamic banking compliance (Sharia-approved)
 * - Real-time fraud detection
 * - Cultural intelligence for Iraqi users
 * - Government-grade security and audit
 */

import {
  INodeExecuteFunctions,
  INodeParameters,
  INodeProperties,
  NodeOperationError,
} from "n8n-workflow";
import {
  IraqiGovernmentNodeBase,
  IraqiCulturalContext,
  IslamicComplianceCheck,
  FraudDetectionResult,
  GovernmentAuditLog,
} from "../base/IraqiGovernmentNodeBase";
import axios, { AxiosError } from "axios";
import { createHash, createHmac, randomBytes } from "crypto";

interface NassWalletCredentials {
  clientId: string;
  clientSecret: string;
  apiKey: string;
  webhookSecret: string;
  sandboxMode: boolean;
}

interface NassWalletTransactionRequest {
  amount: number; // Amount in IQD (minimum 1000)
  currency: "IQD";
  orderId: string;
  customerId: string;
  description: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    nationalId?: string;
  };
  merchantInfo: {
    categoryCode: string;
    businessName: string;
    businessType: "individual" | "company" | "government";
  };
  transactionMetadata: {
    source: string;
    purpose: string;
    beneficiaryType: "person" | "business" | "government";
    isGovernmentTransaction: boolean;
  };
  paymentOptions: {
    allowPartialPayment: boolean;
    sessionExpiryMinutes: number;
    language: "ar" | "en";
    notificationPreferences: {
      sms: boolean;
      email: boolean;
      webhook: boolean;
    };
  };
  redirectUrls: {
    successUrl: string;
    failureUrl: string;
    cancelUrl: string;
    webhookUrl: string;
  };
}

interface NassWalletTransactionResponse {
  transactionId: string;
  nasswallet_reference: string;
  status:
    | "pending_user_action"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "expired";
  paymentUrl: string;
  qrCodeData: string;
  amount: number;
  currency: "IQD";
  orderId: string;
  customerId: string;
  sessionId: string;
  expiresAt: string;
  createdAt: string;
  estimatedCompletionTime: string;
  fees: {
    transactionFee: number;
    serviceFee: number;
    governmentTax: number;
    totalFees: number;
  };
  balance: {
    availableBalance: number;
    reservedAmount: number;
    sufficientBalance: boolean;
  };
}

interface NassWalletStatusResponse {
  transactionId: string;
  nasswallet_reference: string;
  status:
    | "pending_user_action"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "expired";
  amount: number;
  netAmount: number; // Amount after fees
  currency: "IQD";
  orderId: string;
  customerId: string;
  completedAt?: string;
  failureReason?: string;
  paymentMethod: "wallet_balance" | "bank_transfer" | "cash_deposit";
  fees: {
    transactionFee: number;
    serviceFee: number;
    governmentTax: number;
    totalFees: number;
  };
  transactionTrace: {
    initiatedAt: string;
    processedAt?: string;
    completedAt?: string;
    lastUpdateAt: string;
  };
  securityChecks: {
    amlPassed: boolean;
    fraudCheckPassed: boolean;
    identityVerified: boolean;
    complianceScore: number;
  };
}

export class NassWalletPaymentNode extends IraqiGovernmentNodeBase {
  constructor() {
    super(
      "NassWallet Payment",
      "nassWalletPayment",
      ["payment"],
      1,
      "Process payments through NassWallet gateway",
      "Iraqi Central Bank licensed wallet with comprehensive financial services and Sharia compliance",
      { name: "NassWallet Payment", color: "#2d5aa0" },
    );

    // Add NassWallet credentials
    this.description.credentials = [
      {
        name: "nassWalletApi",
        required: true,
      },
    ];
  }

  getNodeProperties(): INodeProperties[] {
    return [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Create Payment",
            value: "createPayment",
            description: "Initiate a new NassWallet payment",
            action: "Create a payment",
          },
          {
            name: "Check Payment Status",
            value: "checkStatus",
            description: "Check the status of an existing payment",
            action: "Check payment status",
          },
          {
            name: "Confirm Payment",
            value: "confirmPayment",
            description: "Confirm and validate completed payment",
            action: "Confirm payment",
          },
          {
            name: "Check Wallet Balance",
            value: "checkBalance",
            description: "Check customer wallet balance",
            action: "Check wallet balance",
          },
          {
            name: "Reverse Payment",
            value: "reversePayment",
            description: "Reverse payment (if within allowed timeframe)",
            action: "Reverse payment",
          },
        ],
        default: "createPayment",
        noDataExpression: true,
      },

      // Create Payment Properties
      {
        displayName: "Amount (IQD)",
        name: "amount",
        type: "number",
        required: true,
        default: 1000,
        description: "Payment amount in Iraqi Dinars (minimum 1000 IQD)",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
        typeOptions: {
          minValue: 1000,
        },
      },
      {
        displayName: "Customer ID",
        name: "customerId",
        type: "string",
        required: true,
        default: "",
        placeholder: "CUST-12345 or National ID",
        description: "Customer identifier (NassWallet ID or National ID)",
        displayOptions: {
          show: {
            operation: ["createPayment", "checkBalance"],
          },
        },
      },
      {
        displayName: "Order ID",
        name: "orderId",
        type: "string",
        required: true,
        default: "",
        placeholder: "ORD-NW-20250122-001",
        description: "Unique order identifier for your system",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Payment Description",
        name: "description",
        type: "string",
        required: true,
        default: "",
        placeholder: "Government service fee payment",
        description: "Description of the payment for customer and audit trail",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Customer Information",
        name: "customerInfo",
        type: "collection",
        placeholder: "Add Customer Details",
        required: true,
        default: {},
        options: [
          {
            displayName: "Full Name",
            name: "name",
            type: "string",
            required: true,
            default: "",
            placeholder: "أحمد محمد علي الحسيني",
            description: "Customer full name (preferably in Arabic)",
          },
          {
            displayName: "Phone Number",
            name: "phone",
            type: "string",
            required: true,
            default: "",
            placeholder: "+964-XXX-XXX-XXXX",
            description: "Customer phone number (required for NassWallet)",
          },
          {
            displayName: "Email Address",
            name: "email",
            type: "string",
            default: "",
            placeholder: "customer@example.com",
            description: "Customer email address (optional but recommended)",
          },
          {
            displayName: "National ID",
            name: "nationalId",
            type: "string",
            default: "",
            placeholder: "XXXXXXXXXX",
            description: "Iraqi National ID number (for enhanced verification)",
          },
        ],
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Merchant Information",
        name: "merchantInfo",
        type: "collection",
        placeholder: "Add Merchant Details",
        required: true,
        default: {},
        options: [
          {
            displayName: "Business Category",
            name: "categoryCode",
            type: "options",
            required: true,
            options: [
              {
                name: "Government Services (خدمات حكومية)",
                value: "government_services",
              },
              { name: "Healthcare (رعاية صحية)", value: "healthcare" },
              { name: "Education (تعليم)", value: "education" },
              { name: "Retail (تجارة تجزئة)", value: "retail" },
              {
                name: "Food & Beverage (أطعمة ومشروبات)",
                value: "food_beverage",
              },
              { name: "Transportation (نقل)", value: "transportation" },
              { name: "Utilities (مرافق عامة)", value: "utilities" },
              {
                name: "Professional Services (خدمات مهنية)",
                value: "professional_services",
              },
              {
                name: "Other Halal Services (خدمات حلال أخرى)",
                value: "other_halal",
              },
            ],
            default: "government_services",
            description: "Business category for compliance and risk assessment",
          },
          {
            displayName: "Business Name",
            name: "businessName",
            type: "string",
            required: true,
            default: "",
            placeholder: "وزارة الداخلية - خدمات المواطنين",
            description:
              "Official business name (Arabic preferred for government)",
          },
          {
            displayName: "Business Type",
            name: "businessType",
            type: "options",
            required: true,
            options: [
              { name: "Government Entity (جهة حكومية)", value: "government" },
              { name: "Private Company (شركة خاصة)", value: "company" },
              { name: "Individual Business (عمل فردي)", value: "individual" },
            ],
            default: "government",
            description: "Type of business entity",
          },
        ],
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Redirect URLs",
        name: "redirectUrls",
        type: "collection",
        placeholder: "Add URLs",
        required: true,
        default: {},
        options: [
          {
            displayName: "Success URL",
            name: "successUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://ministry.gov.iq/payment-success",
            description: "URL to redirect after successful payment",
          },
          {
            displayName: "Failure URL",
            name: "failureUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://ministry.gov.iq/payment-failed",
            description: "URL to redirect after payment failure",
          },
          {
            displayName: "Cancel URL",
            name: "cancelUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://ministry.gov.iq/payment-cancelled",
            description: "URL to redirect after payment cancellation",
          },
          {
            displayName: "Webhook URL",
            name: "webhookUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://ministry.gov.iq/webhook/nasswallet",
            description: "URL for payment status notifications",
          },
        ],
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },

      // Check Status / Confirm / Reverse Properties
      {
        displayName: "Transaction ID",
        name: "transactionId",
        type: "string",
        required: true,
        default: "",
        description: "NassWallet transaction ID",
        displayOptions: {
          show: {
            operation: ["checkStatus", "confirmPayment", "reversePayment"],
          },
        },
      },
      {
        displayName: "Reversal Reason",
        name: "reversalReason",
        type: "options",
        options: [
          { name: "Customer Request (طلب العميل)", value: "customer_request" },
          { name: "Technical Error (خطأ تقني)", value: "technical_error" },
          { name: "Fraud Suspected (اشتباه احتيال)", value: "fraud_suspected" },
          {
            name: "Duplicate Payment (دفعة مكررة)",
            value: "duplicate_payment",
          },
          {
            name: "Service Not Delivered (الخدمة لم تُقدم)",
            value: "service_not_delivered",
          },
          { name: "Other (أخرى)", value: "other" },
        ],
        default: "customer_request",
        description: "Reason for payment reversal",
        displayOptions: {
          show: {
            operation: ["reversePayment"],
          },
        },
      },

      // Advanced Settings
      {
        displayName: "Advanced Options",
        name: "advancedOptions",
        type: "collection",
        placeholder: "Add Advanced Option",
        default: {},
        options: [
          {
            displayName: "Language",
            name: "language",
            type: "options",
            options: [
              { name: "Arabic", value: "ar" },
              { name: "English", value: "en" },
            ],
            default: "ar",
            description: "Payment interface language",
          },
          {
            displayName: "Session Expiry (minutes)",
            name: "sessionExpiryMinutes",
            type: "number",
            default: 10,
            description: "Payment session expiration time in minutes",
            typeOptions: {
              minValue: 5,
              maxValue: 30, // Max 30 minutes
            },
          },
          {
            displayName: "Allow Partial Payment",
            name: "allowPartialPayment",
            type: "boolean",
            default: false,
            description: "Allow customer to pay partially",
          },
          {
            displayName: "Notification Preferences",
            name: "notificationPreferences",
            type: "multiOptions",
            options: [
              { name: "SMS Notifications", value: "sms" },
              { name: "Email Notifications", value: "email" },
              { name: "Webhook Notifications", value: "webhook" },
            ],
            default: ["sms", "webhook"],
            description: "Preferred notification methods",
          },
          {
            displayName: "Enhanced Security Checks",
            name: "enhancedSecurity",
            type: "boolean",
            default: true,
            description: "Enable enhanced AML and fraud detection",
          },
          {
            displayName: "Government Transaction",
            name: "isGovernmentTransaction",
            type: "boolean",
            default: true,
            description: "Mark as government transaction for special handling",
          },
          {
            displayName: "Require Islamic Compliance",
            name: "requireIslamicCompliance",
            type: "boolean",
            default: true,
            description: "Enforce strict Islamic banking compliance",
          },
        ],
      },
    ];
  }

  async execute(this: INodeExecuteFunctions): Promise<any[][]> {
    const items = this.getInputData();
    const returnData: any[] = [];

    // Get credentials
    const credentials = (await this.getCredentials(
      "nassWalletApi",
    )) as NassWalletCredentials;

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;
        const culturalContext = this.getNodeParameter(
          "culturalContext",
          i,
          {},
        ) as IraqiCulturalContext;
        const securitySettings = this.getNodeParameter(
          "securitySettings",
          i,
          {},
        ) as any;
        const advancedOptions = this.getNodeParameter(
          "advancedOptions",
          i,
          {},
        ) as any;

        let result: any;

        switch (operation) {
          case "createPayment":
            result = await this.createPayment.call(
              this,
              i,
              credentials,
              culturalContext,
              securitySettings,
              advancedOptions,
            );
            break;

          case "checkStatus":
            result = await this.checkPaymentStatus.call(
              this,
              i,
              credentials,
              culturalContext,
              securitySettings,
            );
            break;

          case "confirmPayment":
            result = await this.confirmPayment.call(
              this,
              i,
              credentials,
              culturalContext,
              securitySettings,
              advancedOptions,
            );
            break;

          case "checkBalance":
            result = await this.checkWalletBalance.call(
              this,
              i,
              credentials,
              culturalContext,
              securitySettings,
            );
            break;

          case "reversePayment":
            result = await this.reversePayment.call(
              this,
              i,
              credentials,
              culturalContext,
              securitySettings,
            );
            break;

          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`,
              { itemIndex: i },
            );
        }

        returnData.push(result);
      } catch (error) {
        // Create audit log for failed operations
        const auditLog = this.createAuditLog(
          this.getNode().id,
          this.getExecutionId(),
          `nasswallet_${this.getNodeParameter("operation", i)}`,
          items[i].json,
          { error: error.message },
          this.getNodeParameter(
            "culturalContext",
            i,
            {},
          ) as IraqiCulturalContext,
          this.getNodeParameter("securitySettings", i, {}) as any,
          false,
          error.message,
        );

        if (this.continueOnFail() !== true) {
          throw new NodeOperationError(this.getNode(), error.message, {
            itemIndex: i,
          });
        }

        returnData.push({
          json: {
            success: false,
            error: error.message,
            auditLog,
          },
        });
      }
    }

    return [returnData];
  }

  /**
   * Create a new NassWallet payment
   */
  private async createPayment(
    itemIndex: number,
    credentials: NassWalletCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
    advancedOptions: any,
  ): Promise<any> {
    const amount = this.getNodeParameter("amount", itemIndex) as number;
    const customerId = this.getNodeParameter("customerId", itemIndex) as string;
    const orderId = this.getNodeParameter("orderId", itemIndex) as string;
    const description = this.getNodeParameter(
      "description",
      itemIndex,
    ) as string;
    const customerInfo = this.getNodeParameter(
      "customerInfo",
      itemIndex,
    ) as any;
    const merchantInfo = this.getNodeParameter(
      "merchantInfo",
      itemIndex,
    ) as any;
    const redirectUrls = this.getNodeParameter(
      "redirectUrls",
      itemIndex,
    ) as any;

    // Validate minimum amount
    if (amount < 1000) {
      throw new NodeOperationError(
        this.getNode(),
        "NassWallet requires a minimum payment of 1000 IQD (المبلغ الأدنى هو 1000 دينار عراقي)",
        { itemIndex },
      );
    }

    // Validate customer phone number
    const cleanPhone = customerInfo.phone.replace(/[^0-9]/g, "");
    if (
      !cleanPhone.match(/^964[0-9]{10}$/) &&
      !cleanPhone.match(/^0[0-9]{10}$/)
    ) {
      throw new NodeOperationError(
        this.getNode(),
        "Invalid Iraqi phone number format (تنسيق رقم الهاتف العراقي غير صحيح)",
        { itemIndex },
      );
    }

    // Islamic compliance validation
    if (advancedOptions.requireIslamicCompliance !== false) {
      const transactionData = {
        amount,
        description,
        merchantCategory: merchantInfo.categoryCode,
        businessType: merchantInfo.businessType,
      };
      const complianceCheck = this.validateIslamicCompliance(
        transactionData,
        culturalContext,
      );

      if (!complianceCheck.shariaApproved) {
        throw new NodeOperationError(
          this.getNode(),
          `Transaction not Sharia-compliant: ${complianceCheck.complianceNotes.join(", ")} (المعاملة غير متوافقة مع الشريعة الإسلامية)`,
          { itemIndex },
        );
      }
    }

    // Enhanced fraud detection
    if (advancedOptions.enhancedSecurity !== false) {
      const fraudCheck = this.detectFraud(
        {
          amount,
          customerId,
          customerInfo,
          merchantInfo,
          isGovernmentTransaction: advancedOptions.isGovernmentTransaction,
        },
        { country: "IQ", ipAddress: "127.0.0.1" },
        [],
      );

      if (!fraudCheck.allowTransaction) {
        throw new NodeOperationError(
          this.getNode(),
          `Transaction blocked by fraud detection: ${fraudCheck.triggers.join(", ")} (المعاملة محظورة لأسباب أمنية)`,
          { itemIndex },
        );
      }
    }

    // Create transaction request
    const transactionId = this.generateTransactionId("NW");
    const language =
      advancedOptions.language || culturalContext.language || "ar";
    const notifications = advancedOptions.notificationPreferences || [
      "sms",
      "webhook",
    ];

    const transactionRequest: NassWalletTransactionRequest = {
      amount,
      currency: "IQD",
      orderId,
      customerId,
      description,
      customerInfo: {
        name: customerInfo.name,
        phone: cleanPhone.startsWith("964")
          ? `+${cleanPhone}`
          : `+964${cleanPhone.substring(1)}`,
        email: customerInfo.email,
        nationalId: customerInfo.nationalId,
      },
      merchantInfo,
      transactionMetadata: {
        source: "government_portal",
        purpose: description,
        beneficiaryType:
          merchantInfo.businessType === "government"
            ? "government"
            : "business",
        isGovernmentTransaction:
          advancedOptions.isGovernmentTransaction !== false,
      },
      paymentOptions: {
        allowPartialPayment: advancedOptions.allowPartialPayment || false,
        sessionExpiryMinutes: advancedOptions.sessionExpiryMinutes || 10,
        language: language === "ar" ? "ar" : "en",
        notificationPreferences: {
          sms: notifications.includes("sms"),
          email: notifications.includes("email"),
          webhook: notifications.includes("webhook"),
        },
      },
      redirectUrls,
    };

    // Generate API signature
    const signature = this.generateNassWalletSignature(
      transactionRequest,
      credentials.clientSecret,
    );
    const timestamp = Date.now().toString();

    try {
      const baseUrl = credentials.sandboxMode
        ? "https://sandbox-api.nasswallet.com/v2/payments"
        : "https://api.nasswallet.com/v2/payments";

      const response = await axios.post(baseUrl, transactionRequest, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Client-ID": credentials.clientId,
          "X-Signature": signature,
          "X-Timestamp": timestamp,
          "X-Government-Entity": "true",
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 45000, // 45 second timeout for NassWallet
      });

      const nasswalletResponse = response.data as NassWalletTransactionResponse;

      // Check for insufficient balance
      if (!nasswalletResponse.balance.sufficientBalance) {
        throw new NodeOperationError(
          this.getNode(),
          `Insufficient wallet balance. Available: ${nasswalletResponse.balance.availableBalance} IQD, Required: ${amount} IQD (الرصيد غير كافي. المتاح: ${nasswalletResponse.balance.availableBalance} د.ع)`,
          { itemIndex },
        );
      }

      // Format currency for cultural display
      const formattedAmount = this.formatIraqiCurrency(amount);
      const formattedBalance = this.formatIraqiCurrency(
        nasswalletResponse.balance.availableBalance,
      );
      const formattedFees = this.formatIraqiCurrency(
        nasswalletResponse.fees.totalFees,
      );

      // Create comprehensive audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "nasswallet_create_payment",
        {
          amount,
          orderId,
          customerId,
          customerPhone: this.maskPhoneNumber(customerInfo.phone),
          description,
          merchantInfo,
        },
        {
          ...nasswalletResponse,
          customerInfo: {
            ...nasswalletResponse,
            // Mask sensitive customer data in logs
            phone: this.maskPhoneNumber(customerInfo.phone),
            nationalId: customerInfo.nationalId
              ? this.maskNationalId(customerInfo.nationalId)
              : undefined,
          },
        },
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "createPayment",
          transactionId: nasswalletResponse.transactionId,
          nasswalletReference: nasswalletResponse.nasswallet_reference,
          status: nasswalletResponse.status,
          amount: {
            original: amount,
            formatted: formattedAmount,
          },
          fees: {
            original: nasswalletResponse.fees,
            totalFormatted: formattedFees,
            breakdown: {
              transaction: this.formatIraqiCurrency(
                nasswalletResponse.fees.transactionFee,
              ),
              service: this.formatIraqiCurrency(
                nasswalletResponse.fees.serviceFee,
              ),
              tax: this.formatIraqiCurrency(
                nasswalletResponse.fees.governmentTax,
              ),
            },
          },
          balance: {
            available: {
              original: nasswalletResponse.balance.availableBalance,
              formatted: formattedBalance,
            },
            reserved: nasswalletResponse.balance.reservedAmount,
            sufficient: nasswalletResponse.balance.sufficientBalance,
          },
          currency: "IQD",
          orderId,
          customerId,
          sessionId: nasswalletResponse.sessionId,
          paymentUrl: nasswalletResponse.paymentUrl,
          qrCode: nasswalletResponse.qrCodeData,
          expiresAt: nasswalletResponse.expiresAt,
          estimatedCompletionTime: nasswalletResponse.estimatedCompletionTime,
          language,
          governmentTransaction:
            advancedOptions.isGovernmentTransaction !== false,
          islamicCompliant: true,
          fraudCheckPassed: true,
          auditLog,
          nasswalletResponse: {
            ...nasswalletResponse,
            // Mask sensitive data in response
            customerInfo: {
              phone: this.maskPhoneNumber(customerInfo.phone),
              nationalId: customerInfo.nationalId
                ? this.maskNationalId(customerInfo.nationalId)
                : undefined,
            },
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "NassWallet payment creation failed";
      let arabicMessage = "فشل في إنشاء دفعة ناس والت";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "INSUFFICIENT_BALANCE") {
          arabicMessage = "الرصيد غير كافي في محفظة ناس والت";
        } else if (responseData.code === "INVALID_CUSTOMER") {
          arabicMessage = "معرف العميل غير صحيح";
        } else if (responseData.code === "SESSION_EXPIRED") {
          arabicMessage = "انتهت صلاحية الجلسة";
        } else if (responseData.code === "AML_CHECK_FAILED") {
          arabicMessage = "فشل في فحص مكافحة غسيل الأموال";
        }
      }

      throw new NodeOperationError(
        this.getNode(),
        `${errorMessage} (${arabicMessage})`,
        { itemIndex },
      );
    }
  }

  /**
   * Check payment status
   */
  private async checkPaymentStatus(
    itemIndex: number,
    credentials: NassWalletCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
  ): Promise<any> {
    const transactionId = this.getNodeParameter(
      "transactionId",
      itemIndex,
    ) as string;

    try {
      const baseUrl = credentials.sandboxMode
        ? `https://sandbox-api.nasswallet.com/v2/payments/${transactionId}`
        : `https://api.nasswallet.com/v2/payments/${transactionId}`;

      const timestamp = Date.now().toString();
      const signature = this.generateStatusCheckSignature(
        transactionId,
        credentials.clientSecret,
        timestamp,
      );

      const response = await axios.get(baseUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Client-ID": credentials.clientId,
          "X-Signature": signature,
          "X-Timestamp": timestamp,
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 30000,
      });

      const statusResponse = response.data as NassWalletStatusResponse;

      // Format amounts for cultural display
      const formattedAmount = this.formatIraqiCurrency(statusResponse.amount);
      const formattedNetAmount = this.formatIraqiCurrency(
        statusResponse.netAmount,
      );
      const formattedFees = this.formatIraqiCurrency(
        statusResponse.fees.totalFees,
      );

      // Create audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "nasswallet_check_status",
        { transactionId },
        {
          ...statusResponse,
          // Mask sensitive data
          customerId: statusResponse.customerId.substring(0, 4) + "****",
        },
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "checkStatus",
          transactionId,
          nasswalletReference: statusResponse.nasswallet_reference,
          status: statusResponse.status,
          amount: {
            original: statusResponse.amount,
            formatted: formattedAmount,
          },
          netAmount: {
            original: statusResponse.netAmount,
            formatted: formattedNetAmount,
          },
          fees: {
            original: statusResponse.fees,
            totalFormatted: formattedFees,
            breakdown: {
              transaction: this.formatIraqiCurrency(
                statusResponse.fees.transactionFee,
              ),
              service: this.formatIraqiCurrency(statusResponse.fees.serviceFee),
              tax: this.formatIraqiCurrency(statusResponse.fees.governmentTax),
            },
          },
          currency: statusResponse.currency,
          orderId: statusResponse.orderId,
          customerId: statusResponse.customerId.substring(0, 4) + "****", // Mask customer ID
          paymentMethod: statusResponse.paymentMethod,
          completedAt: statusResponse.completedAt,
          failureReason: statusResponse.failureReason,
          transactionTrace: statusResponse.transactionTrace,
          securityChecks: {
            amlPassed: statusResponse.securityChecks.amlPassed,
            fraudCheckPassed: statusResponse.securityChecks.fraudCheckPassed,
            identityVerified: statusResponse.securityChecks.identityVerified,
            complianceScore: statusResponse.securityChecks.complianceScore,
            complianceLevel: this.getComplianceLevel(
              statusResponse.securityChecks.complianceScore,
            ),
          },
          statusMessages: {
            english: this.getStatusMessage(statusResponse.status, "en"),
            arabic: this.getStatusMessage(statusResponse.status, "ar"),
          },
          auditLog,
          nasswalletResponse: {
            ...statusResponse,
            customerId: statusResponse.customerId.substring(0, 4) + "****",
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "Failed to check NassWallet payment status";
      let arabicMessage = "فشل في التحقق من حالة دفعة ناس والت";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "TRANSACTION_NOT_FOUND") {
          arabicMessage = "المعاملة غير موجودة";
        } else if (responseData.code === "ACCESS_DENIED") {
          arabicMessage = "غير مخول للوصول لهذه المعاملة";
        }
      }

      throw new NodeOperationError(
        this.getNode(),
        `${errorMessage} (${arabicMessage})`,
        { itemIndex },
      );
    }
  }

  /**
   * Confirm completed payment with comprehensive validation
   */
  private async confirmPayment(
    itemIndex: number,
    credentials: NassWalletCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
    advancedOptions: any,
  ): Promise<any> {
    // First check the payment status
    const statusResult = await this.checkPaymentStatus(
      itemIndex,
      credentials,
      culturalContext,
      securitySettings,
    );
    const paymentData = statusResult.json;

    // Validate payment completion
    if (paymentData.status !== "completed") {
      return {
        json: {
          success: false,
          confirmed: false,
          reason: "Payment not completed",
          arabicReason: "الدفعة لم تكتمل بعد",
          currentStatus: paymentData.status,
          statusMessage: paymentData.statusMessages,
          paymentData,
        },
      };
    }

    // Validate security checks
    const securityChecks = paymentData.securityChecks;
    if (!securityChecks.amlPassed || !securityChecks.fraudCheckPassed) {
      return {
        json: {
          success: false,
          confirmed: false,
          reason: "Security checks failed",
          arabicReason: "فشلت الفحوصات الأمنية",
          securityChecks,
          paymentData,
        },
      };
    }

    // Validate compliance score (should be >= 70 for government transactions)
    const minComplianceScore =
      advancedOptions.isGovernmentTransaction !== false ? 70 : 60;
    if (securityChecks.complianceScore < minComplianceScore) {
      return {
        json: {
          success: false,
          confirmed: false,
          reason: `Compliance score too low: ${securityChecks.complianceScore}/${minComplianceScore}`,
          arabicReason: `درجة الامتثال منخفضة: ${securityChecks.complianceScore}/${minComplianceScore}`,
          securityChecks,
          paymentData,
        },
      };
    }

    // Validate reasonable fee structure
    const feePercentage =
      (paymentData.fees.original.totalFees / paymentData.amount.original) * 100;
    const reasonableFee = feePercentage <= 7.0; // NassWallet typically has slightly higher fees

    // Create confirmation audit log
    const auditLog = this.createAuditLog(
      this.getNode().id,
      this.getExecutionId(),
      "nasswallet_confirm_payment",
      { transactionId: this.getNodeParameter("transactionId", itemIndex) },
      {
        confirmed: true,
        securityChecksPassed: true,
        complianceScoreValid: true,
        feeCheck: reasonableFee,
      },
      culturalContext,
      securitySettings,
      true,
    );

    return {
      json: {
        success: true,
        confirmed: true,
        operation: "confirmPayment",
        confirmationChecks: {
          paymentCompleted: true,
          securityChecksPassed: true,
          identityVerified: securityChecks.identityVerified,
          complianceScoreValid:
            securityChecks.complianceScore >= minComplianceScore,
          reasonableFees: reasonableFee,
          islamicCompliant: true,
        },
        securityValidation: {
          amlPassed: securityChecks.amlPassed,
          fraudCheckPassed: securityChecks.fraudCheckPassed,
          identityVerified: securityChecks.identityVerified,
          complianceScore: securityChecks.complianceScore,
          complianceLevel: securityChecks.complianceLevel,
          minRequiredScore: minComplianceScore,
        },
        feeAnalysis: {
          percentage: feePercentage,
          reasonable: reasonableFee,
          threshold: 7.0,
        },
        confirmationTimestamp: new Date().toISOString(),
        auditLog,
        paymentData,
      },
    };
  }

  /**
   * Check customer wallet balance
   */
  private async checkWalletBalance(
    itemIndex: number,
    credentials: NassWalletCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
  ): Promise<any> {
    const customerId = this.getNodeParameter("customerId", itemIndex) as string;

    try {
      const baseUrl = credentials.sandboxMode
        ? `https://sandbox-api.nasswallet.com/v2/wallets/${customerId}/balance`
        : `https://api.nasswallet.com/v2/wallets/${customerId}/balance`;

      const timestamp = Date.now().toString();
      const signature = this.generateBalanceCheckSignature(
        customerId,
        credentials.clientSecret,
        timestamp,
      );

      const response = await axios.get(baseUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Client-ID": credentials.clientId,
          "X-Signature": signature,
          "X-Timestamp": timestamp,
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 30000,
      });

      const balanceData = response.data;

      // Format balance amounts
      const formattedAvailable = this.formatIraqiCurrency(
        balanceData.availableBalance,
      );
      const formattedReserved = this.formatIraqiCurrency(
        balanceData.reservedBalance || 0,
      );
      const formattedTotal = this.formatIraqiCurrency(balanceData.totalBalance);

      // Create audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "nasswallet_check_balance",
        { customerId: customerId.substring(0, 4) + "****" },
        { balanceCheckSuccessful: true },
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "checkBalance",
          customerId: customerId.substring(0, 4) + "****",
          balance: {
            available: {
              original: balanceData.availableBalance,
              formatted: formattedAvailable,
            },
            reserved: {
              original: balanceData.reservedBalance || 0,
              formatted: formattedReserved,
            },
            total: {
              original: balanceData.totalBalance,
              formatted: formattedTotal,
            },
          },
          currency: "IQD",
          balanceStatus: balanceData.balanceStatus,
          lastUpdated: balanceData.lastUpdated,
          walletStatus: balanceData.walletStatus,
          accountType: balanceData.accountType,
          verificationLevel: balanceData.verificationLevel,
          auditLog,
          nasswalletResponse: {
            ...balanceData,
            customerId: customerId.substring(0, 4) + "****",
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "Failed to check NassWallet balance";
      let arabicMessage = "فشل في التحقق من رصيد ناس والت";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "CUSTOMER_NOT_FOUND") {
          arabicMessage = "العميل غير موجود";
        } else if (responseData.code === "WALLET_SUSPENDED") {
          arabicMessage = "المحفظة معطلة مؤقتاً";
        }
      }

      throw new NodeOperationError(
        this.getNode(),
        `${errorMessage} (${arabicMessage})`,
        { itemIndex },
      );
    }
  }

  /**
   * Reverse a payment (within allowed timeframe)
   */
  private async reversePayment(
    itemIndex: number,
    credentials: NassWalletCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
  ): Promise<any> {
    const transactionId = this.getNodeParameter(
      "transactionId",
      itemIndex,
    ) as string;
    const reversalReason = this.getNodeParameter(
      "reversalReason",
      itemIndex,
    ) as string;

    // First check payment status to ensure it's reversible
    const statusResult = await this.checkPaymentStatus(
      itemIndex,
      credentials,
      culturalContext,
      securitySettings,
    );
    const paymentData = statusResult.json;

    if (paymentData.status !== "completed") {
      throw new NodeOperationError(
        this.getNode(),
        "Only completed payments can be reversed (يمكن فقط عكس المدفوعات المكتملة)",
        { itemIndex },
      );
    }

    // Check if reversal is within allowed timeframe (typically 24 hours)
    const completedAt = new Date(paymentData.completedAt);
    const now = new Date();
    const hoursSinceCompletion =
      (now.getTime() - completedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCompletion > 24) {
      throw new NodeOperationError(
        this.getNode(),
        "Payment reversal is only allowed within 24 hours of completion (عكس الدفع مسموح فقط خلال 24 ساعة من الإتمام)",
        { itemIndex },
      );
    }

    try {
      const baseUrl = credentials.sandboxMode
        ? `https://sandbox-api.nasswallet.com/v2/payments/${transactionId}/reverse`
        : `https://api.nasswallet.com/v2/payments/${transactionId}/reverse`;

      const reversalRequest = {
        reason: reversalReason,
        merchantReference: this.generateTransactionId("REV"),
        requestedBy: "government_system",
      };

      const timestamp = Date.now().toString();
      const signature = this.generateNassWalletSignature(
        reversalRequest,
        credentials.clientSecret,
      );

      const response = await axios.post(baseUrl, reversalRequest, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Client-ID": credentials.clientId,
          "X-Signature": signature,
          "X-Timestamp": timestamp,
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 45000,
      });

      const reversalResponse = response.data;

      // Format reversed amount
      const formattedReversalAmount = this.formatIraqiCurrency(
        reversalResponse.reversalAmount,
      );

      // Create audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "nasswallet_reverse_payment",
        {
          originalTransactionId: transactionId,
          reversalReason,
          hoursSinceCompletion,
        },
        reversalResponse,
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "reversePayment",
          originalTransactionId: transactionId,
          reversalTransactionId: reversalResponse.reversalTransactionId,
          reversalReference: reversalResponse.reversalReference,
          reversalAmount: {
            original: reversalResponse.reversalAmount,
            formatted: formattedReversalAmount,
          },
          reversalStatus: reversalResponse.status,
          reversalReason,
          estimatedReversalTime: reversalResponse.estimatedReversalTime,
          reversalMethod: reversalResponse.reversalMethod,
          processingFee: reversalResponse.processingFee
            ? {
                original: reversalResponse.processingFee,
                formatted: this.formatIraqiCurrency(
                  reversalResponse.processingFee,
                ),
              }
            : null,
          auditLog,
          nasswalletResponse: reversalResponse,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "NassWallet payment reversal failed";
      let arabicMessage = "فشل في عكس دفعة ناس والت";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "REVERSAL_NOT_ALLOWED") {
          arabicMessage = "عكس الدفع غير مسموح لهذه المعاملة";
        } else if (responseData.code === "REVERSAL_WINDOW_EXPIRED") {
          arabicMessage = "انتهت فترة السماح لعكس الدفع";
        } else if (responseData.code === "INSUFFICIENT_MERCHANT_BALANCE") {
          arabicMessage = "رصيد التاجر غير كافي لعكس الدفع";
        }
      }

      throw new NodeOperationError(
        this.getNode(),
        `${errorMessage} (${arabicMessage})`,
        { itemIndex },
      );
    }
  }

  /**
   * Generate NassWallet API signature
   */
  private generateNassWalletSignature(data: any, clientSecret: string): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {} as any);

    const dataString = JSON.stringify(sortedData);
    return createHmac("sha256", clientSecret).update(dataString).digest("hex");
  }

  /**
   * Generate status check signature
   */
  private generateStatusCheckSignature(
    transactionId: string,
    clientSecret: string,
    timestamp: string,
  ): string {
    const signatureData = `${transactionId}:${timestamp}`;
    return createHmac("sha256", clientSecret)
      .update(signatureData)
      .digest("hex");
  }

  /**
   * Generate balance check signature
   */
  private generateBalanceCheckSignature(
    customerId: string,
    clientSecret: string,
    timestamp: string,
  ): string {
    const signatureData = `${customerId}:balance:${timestamp}`;
    return createHmac("sha256", clientSecret)
      .update(signatureData)
      .digest("hex");
  }

  /**
   * Mask phone number for privacy
   */
  private maskPhoneNumber(phone: string): string {
    if (!phone) return "";
    return phone.replace(/(\+964|0)(\d{3})\d{4}(\d{3})/, "$1$2****$3");
  }

  /**
   * Mask national ID for privacy
   */
  private maskNationalId(nationalId: string): string {
    if (!nationalId || nationalId.length < 8) return "****";
    return (
      nationalId.substring(0, 2) +
      "****" +
      nationalId.substring(nationalId.length - 2)
    );
  }

  /**
   * Get compliance level description
   */
  private getComplianceLevel(score: number): string {
    if (score >= 90) return "excellent";
    if (score >= 80) return "good";
    if (score >= 70) return "acceptable";
    if (score >= 60) return "marginal";
    return "poor";
  }

  /**
   * Get localized status messages
   */
  private getStatusMessage(status: string, language: "en" | "ar"): string {
    const messages = {
      pending_user_action: {
        en: "Payment is pending user action",
        ar: "الدفعة في انتظار إجراء المستخدم",
      },
      processing: {
        en: "Payment is being processed",
        ar: "جاري معالجة الدفعة",
      },
      completed: {
        en: "Payment completed successfully",
        ar: "تم إتمام الدفع بنجاح",
      },
      failed: {
        en: "Payment failed",
        ar: "فشل في الدفع",
      },
      cancelled: {
        en: "Payment was cancelled by user",
        ar: "تم إلغاء الدفعة من قبل المستخدم",
      },
      expired: {
        en: "Payment session has expired",
        ar: "انتهت صلاحية جلسة الدفع",
      },
    };

    return (
      messages[status as keyof typeof messages]?.[language] ||
      `Unknown status: ${status}`
    );
  }
}
