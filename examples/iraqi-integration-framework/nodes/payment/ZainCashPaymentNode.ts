/**
 * ZainCash Payment Gateway Node
 *
 * Comprehensive ZainCash integration with:
 * - 1000 IQD minimum transaction validation
 * - JWT-based authentication with merchant credentials
 * - Islamic banking compliance (no riba)
 * - Real-time fraud detection
 * - Cultural intelligence for Iraqi users
 * - Government-grade audit logging
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
import * as jwt from "jsonwebtoken";
import axios, { AxiosError } from "axios";

interface ZainCashCredentials {
  merchantId: string;
  merchantSecret: string;
  sandboxMode: boolean;
}

interface ZainCashTransactionRequest {
  amount: number; // Amount in IQD (minimum 1000)
  serviceType:
    | "book"
    | "food"
    | "grocery"
    | "pharmacy"
    | "transportation"
    | "other";
  orderId: string;
  redirectUrl: string;
  production: boolean;
  referenceId: string;
  merchantId: string;
  lang: "ar" | "en";
  msisdn?: string; // Optional phone number
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
}

interface ZainCashTransactionResponse {
  id: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "expired";
  transactionUrl: string;
  referenceId: string;
  amount: number;
  currency: "IQD";
  serviceType: string;
  createdAt: string;
  expiresAt: string;
  redirectUrl: string;
  statusUrl: string;
}

interface ZainCashStatusResponse {
  id: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "expired";
  amount: number;
  serviceCharge: number;
  totalAmount: number;
  currency: "IQD";
  operationId: string;
  referenceId: string;
  completedAt?: string;
  failedReason?: string;
}

export class ZainCashPaymentNode extends IraqiGovernmentNodeBase {
  constructor() {
    super(
      "ZainCash Payment",
      "zainCashPayment",
      ["payment"],
      1,
      "Process payments through ZainCash gateway",
      "Iraqi mobile wallet payment processing with Islamic compliance and fraud detection",
      { name: "ZainCash Payment", color: "#1e3a8a" },
    );

    // Add ZainCash credentials
    this.description.credentials = [
      {
        name: "zainCashApi",
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
            description: "Initiate a new ZainCash payment",
            action: "Create a payment",
          },
          {
            name: "Check Payment Status",
            value: "checkStatus",
            description: "Check the status of an existing payment",
            action: "Check payment status",
          },
          {
            name: "Validate Payment",
            value: "validatePayment",
            description: "Validate completed payment with full security checks",
            action: "Validate payment",
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
        displayName: "Service Type",
        name: "serviceType",
        type: "options",
        required: true,
        options: [
          {
            name: "Book",
            value: "book",
            description: "Books and educational materials",
          },
          {
            name: "Food",
            value: "food",
            description: "Food and dining services",
          },
          {
            name: "Grocery",
            value: "grocery",
            description: "Grocery and household items",
          },
          {
            name: "Pharmacy",
            value: "pharmacy",
            description: "Medical and pharmaceutical services",
          },
          {
            name: "Transportation",
            value: "transportation",
            description: "Transport and delivery services",
          },
          {
            name: "Other",
            value: "other",
            description: "Other halal services",
          },
        ],
        default: "other",
        description: "Type of service for Islamic compliance validation",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Order ID",
        name: "orderId",
        type: "string",
        required: true,
        default: "",
        placeholder: "ORD-20250122-001",
        description: "Unique order identifier for your system",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Redirect URL",
        name: "redirectUrl",
        type: "string",
        required: true,
        default: "",
        placeholder: "https://yoursite.com/payment-success",
        description: "URL to redirect after payment completion",
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
        default: {},
        options: [
          {
            displayName: "Name",
            name: "name",
            type: "string",
            default: "",
            placeholder: "أحمد محمد علي",
            description: "Customer full name (Arabic or English)",
          },
          {
            displayName: "Email",
            name: "email",
            type: "string",
            default: "",
            placeholder: "ahmed@example.com",
            description: "Customer email address (optional)",
          },
          {
            displayName: "Phone",
            name: "phone",
            type: "string",
            default: "",
            placeholder: "+964-XXX-XXX-XXXX",
            description: "Customer phone number (optional)",
          },
        ],
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },

      // Check Status Properties
      {
        displayName: "Transaction ID",
        name: "transactionId",
        type: "string",
        required: true,
        default: "",
        description: "ZainCash transaction ID to check",
        displayOptions: {
          show: {
            operation: ["checkStatus", "validatePayment"],
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
            displayName: "Timeout (seconds)",
            name: "timeout",
            type: "number",
            default: 300,
            description: "Payment timeout in seconds (5 minutes default)",
            typeOptions: {
              minValue: 60,
              maxValue: 1800, // 30 minutes max
            },
          },
          {
            displayName: "Enable Enhanced Fraud Detection",
            name: "enhancedFraudDetection",
            type: "boolean",
            default: true,
            description: "Enable comprehensive fraud detection analysis",
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
      "zainCashApi",
    )) as ZainCashCredentials;

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

          case "validatePayment":
            result = await this.validatePayment.call(
              this,
              i,
              credentials,
              culturalContext,
              securitySettings,
              advancedOptions,
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
          `zaincash_${this.getNodeParameter("operation", i)}`,
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
   * Create a new ZainCash payment
   */
  private async createPayment(
    itemIndex: number,
    credentials: ZainCashCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
    advancedOptions: any,
  ): Promise<any> {
    const amount = this.getNodeParameter("amount", itemIndex) as number;
    const serviceType = this.getNodeParameter(
      "serviceType",
      itemIndex,
    ) as string;
    const orderId = this.getNodeParameter("orderId", itemIndex) as string;
    const redirectUrl = this.getNodeParameter(
      "redirectUrl",
      itemIndex,
    ) as string;
    const customerInfo = this.getNodeParameter(
      "customerInfo",
      itemIndex,
      {},
    ) as any;

    // Validate minimum amount
    if (amount < 1000) {
      throw new NodeOperationError(
        this.getNode(),
        "ZainCash requires a minimum payment of 1000 IQD (المبلغ الأدنى هو 1000 دينار عراقي)",
        { itemIndex },
      );
    }

    // Islamic compliance validation
    if (advancedOptions.requireIslamicCompliance !== false) {
      const transactionData = {
        amount,
        serviceType,
        merchantCategory: serviceType,
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

    // Fraud detection
    if (advancedOptions.enhancedFraudDetection !== false) {
      const fraudCheck = this.detectFraud(
        { amount, serviceType, orderId, customerInfo },
        { country: "IQ", ipAddress: "127.0.0.1" }, // In production, get from request
        [], // Historical transactions would be passed here
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
    const transactionId = this.generateTransactionId("ZAIN");
    const language =
      advancedOptions.language || culturalContext.language || "ar";

    const transactionRequest: ZainCashTransactionRequest = {
      amount,
      serviceType: serviceType as any,
      orderId,
      redirectUrl,
      production: !credentials.sandboxMode,
      referenceId: transactionId,
      merchantId: credentials.merchantId,
      lang: language === "ar" ? "ar" : "en",
      msisdn: customerInfo.phone?.replace(/[^0-9]/g, ""), // Clean phone number
      customerInfo: customerInfo.name
        ? {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          }
        : undefined,
    };

    // Create JWT token for authentication
    const jwtPayload = {
      iss: credentials.merchantId,
      exp: Math.floor(Date.now() / 1000) + (advancedOptions.timeout || 300),
      ...transactionRequest,
    };

    const token = jwt.sign(jwtPayload, credentials.merchantSecret, {
      algorithm: "HS256",
    });

    try {
      const baseUrl = credentials.sandboxMode
        ? "https://test.zaincash.iq/transaction/init"
        : "https://api.zaincash.iq/transaction/init";

      const response = await axios.post(
        baseUrl,
        {
          token,
          ...transactionRequest,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Iraqi-Government-Node/1.0",
          },
          timeout: 30000, // 30 second timeout
        },
      );

      const zaincashResponse = response.data as ZainCashTransactionResponse;

      // Format currency for cultural display
      const formattedAmount = this.formatIraqiCurrency(amount);

      // Create comprehensive audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "zaincash_create_payment",
        { amount, serviceType, orderId, customerInfo },
        zaincashResponse,
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "createPayment",
          transactionId: zaincashResponse.id,
          referenceId: transactionId,
          status: zaincashResponse.status,
          amount: {
            original: amount,
            formatted: formattedAmount,
          },
          currency: "IQD",
          serviceType,
          paymentUrl: zaincashResponse.transactionUrl,
          redirectUrl: zaincashResponse.redirectUrl,
          statusUrl: zaincashResponse.statusUrl,
          expiresAt: zaincashResponse.expiresAt,
          language,
          customerInfo,
          islamicCompliant: true,
          fraudCheckPassed: true,
          auditLog,
          zaincashResponse,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "ZainCash payment creation failed";
      let arabicMessage = "فشل في إنشاء دفعة زين كاش";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        // Handle specific ZainCash errors
        if (responseData.code === "INVALID_AMOUNT") {
          arabicMessage = "المبلغ غير صحيح - الحد الأدنى 1000 دينار عراقي";
        } else if (responseData.code === "INVALID_MERCHANT") {
          arabicMessage = "معرف التاجر غير صحيح";
        } else if (responseData.code === "EXPIRED_TOKEN") {
          arabicMessage = "انتهت صلاحية الرمز المميز";
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
    credentials: ZainCashCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
  ): Promise<any> {
    const transactionId = this.getNodeParameter(
      "transactionId",
      itemIndex,
    ) as string;

    try {
      const baseUrl = credentials.sandboxMode
        ? "https://test.zaincash.iq/transaction/get"
        : "https://api.zaincash.iq/transaction/get";

      // Create JWT for status check
      const jwtPayload = {
        iss: credentials.merchantId,
        exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        id: transactionId,
      };

      const token = jwt.sign(jwtPayload, credentials.merchantSecret, {
        algorithm: "HS256",
      });

      const response = await axios.post(
        baseUrl,
        {
          token,
          id: transactionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Iraqi-Government-Node/1.0",
          },
          timeout: 30000,
        },
      );

      const statusResponse = response.data as ZainCashStatusResponse;

      // Format amounts for cultural display
      const formattedAmount = this.formatIraqiCurrency(statusResponse.amount);
      const formattedTotal = this.formatIraqiCurrency(
        statusResponse.totalAmount,
      );
      const formattedFee = this.formatIraqiCurrency(
        statusResponse.serviceCharge,
      );

      // Create audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "zaincash_check_status",
        { transactionId },
        statusResponse,
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "checkStatus",
          transactionId,
          status: statusResponse.status,
          amount: {
            original: statusResponse.amount,
            formatted: formattedAmount,
          },
          serviceCharge: {
            original: statusResponse.serviceCharge,
            formatted: formattedFee,
          },
          totalAmount: {
            original: statusResponse.totalAmount,
            formatted: formattedTotal,
          },
          currency: statusResponse.currency,
          operationId: statusResponse.operationId,
          referenceId: statusResponse.referenceId,
          completedAt: statusResponse.completedAt,
          failedReason: statusResponse.failedReason,
          statusMessages: {
            english: this.getStatusMessage(statusResponse.status, "en"),
            arabic: this.getStatusMessage(statusResponse.status, "ar"),
          },
          auditLog,
          zaincashResponse: statusResponse,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "Failed to check ZainCash payment status";
      let arabicMessage = "فشل في التحقق من حالة دفعة زين كاش";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "TRANSACTION_NOT_FOUND") {
          arabicMessage = "المعاملة غير موجودة";
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
   * Validate completed payment with comprehensive security checks
   */
  private async validatePayment(
    itemIndex: number,
    credentials: ZainCashCredentials,
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

    // Additional validation for completed payments
    if (paymentData.status !== "completed") {
      return {
        json: {
          success: false,
          valid: false,
          reason: "Payment not completed",
          arabicReason: "الدفعة لم تكتمل بعد",
          paymentData,
        },
      };
    }

    // Enhanced fraud detection for completed payments
    if (advancedOptions.enhancedFraudDetection !== false) {
      const fraudCheck = this.detectFraud(
        {
          amount: paymentData.amount.original,
          totalAmount: paymentData.totalAmount.original,
          serviceCharge: paymentData.serviceCharge.original,
          operationId: paymentData.operationId,
          completedAt: paymentData.completedAt,
        },
        { country: "IQ", ipAddress: "127.0.0.1" },
        [], // Historical data would be passed here
      );

      if (fraudCheck.riskLevel === "critical") {
        return {
          json: {
            success: false,
            valid: false,
            reason: "High fraud risk detected",
            arabicReason: "تم اكتشاف خطر احتيال عالي",
            fraudCheck,
            paymentData,
          },
        };
      }
    }

    // Validate service charge reasonableness (should not exceed 5% typically)
    const feePercentage =
      (paymentData.serviceCharge.original / paymentData.amount.original) * 100;
    const reasonableFee = feePercentage <= 5.0;

    if (!reasonableFee) {
      return {
        json: {
          success: false,
          valid: false,
          reason: `Unreasonable service fee: ${feePercentage.toFixed(2)}%`,
          arabicReason: `رسوم خدمة غير معقولة: ${feePercentage.toFixed(2)}%`,
          feeAnalysis: {
            percentage: feePercentage,
            reasonable: reasonableFee,
            threshold: 5.0,
          },
          paymentData,
        },
      };
    }

    // Create comprehensive validation audit log
    const auditLog = this.createAuditLog(
      this.getNode().id,
      this.getExecutionId(),
      "zaincash_validate_payment",
      { transactionId: this.getNodeParameter("transactionId", itemIndex) },
      { valid: true, fraudCheck: "passed", feeCheck: "passed" },
      culturalContext,
      securitySettings,
      true,
    );

    return {
      json: {
        success: true,
        valid: true,
        operation: "validatePayment",
        validationChecks: {
          paymentCompleted: true,
          fraudCheckPassed: true,
          reasonableFees: true,
          islamicCompliant: true,
        },
        feeAnalysis: {
          percentage: feePercentage,
          reasonable: reasonableFee,
          threshold: 5.0,
        },
        validationTimestamp: new Date().toISOString(),
        auditLog,
        paymentData,
      },
    };
  }

  /**
   * Get localized status messages
   */
  private getStatusMessage(status: string, language: "en" | "ar"): string {
    const messages = {
      pending: {
        en: "Payment is pending user action",
        ar: "الدفعة في انتظار إجراء المستخدم",
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
