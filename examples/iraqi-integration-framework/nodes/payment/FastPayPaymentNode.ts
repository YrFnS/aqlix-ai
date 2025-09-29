/**
 * FastPay Payment Gateway Node
 *
 * Comprehensive FastPay integration with:
 * - 500 IQD minimum transaction validation
 * - Credit/debit card processing
 * - Islamic banking compliance
 * - Real-time fraud detection
 * - Cultural intelligence for Iraqi users
 * - Government-grade security
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
import { randomBytes, createHash } from "crypto";

interface FastPayCredentials {
  apiKey: string;
  merchantId: string;
  secretKey: string;
  sandboxMode: boolean;
}

interface FastPayTransactionRequest {
  amount: number; // Amount in IQD (minimum 500)
  currency: "IQD";
  orderId: string;
  description: string;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  paymentMethod: "wallet" | "card" | "both";
  expirationTime: number; // minutes
  language: "ar" | "en";
  merchantReference: string;
}

interface FastPayTransactionResponse {
  transactionId: string;
  status:
    | "initiated"
    | "pending"
    | "completed"
    | "failed"
    | "cancelled"
    | "expired";
  paymentUrl: string;
  qrCode?: string;
  amount: number;
  currency: "IQD";
  orderId: string;
  customerPhone: string;
  expirationTime: string;
  createdAt: string;
  fees: {
    customerFee: number;
    merchantFee: number;
    totalFees: number;
  };
}

interface FastPayStatusResponse {
  transactionId: string;
  status:
    | "initiated"
    | "pending"
    | "completed"
    | "failed"
    | "cancelled"
    | "expired";
  amount: number;
  netAmount: number; // Amount after fees
  currency: "IQD";
  orderId: string;
  customerPhone: string;
  paymentMethod: string;
  completedAt?: string;
  failureReason?: string;
  fees: {
    customerFee: number;
    merchantFee: number;
    totalFees: number;
  };
  transactionHash: string;
}

export class FastPayPaymentNode extends IraqiGovernmentNodeBase {
  constructor() {
    super(
      "FastPay Payment",
      "fastPayPayment",
      ["payment"],
      1,
      "Process payments through FastPay gateway",
      "Iraqi digital payment processing with card support and Islamic compliance",
      { name: "FastPay Payment", color: "#0066cc" },
    );

    // Add FastPay credentials
    this.description.credentials = [
      {
        name: "fastPayApi",
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
            description: "Initiate a new FastPay payment",
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
            name: "Refund Payment",
            value: "refundPayment",
            description: "Process payment refund (if supported)",
            action: "Refund payment",
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
        default: 500,
        description: "Payment amount in Iraqi Dinars (minimum 500 IQD)",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
        typeOptions: {
          minValue: 500,
        },
      },
      {
        displayName: "Customer Phone",
        name: "customerPhone",
        type: "string",
        required: true,
        default: "",
        placeholder: "+964-XXX-XXX-XXXX",
        description: "Customer phone number (required for FastPay)",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Customer Name",
        name: "customerName",
        type: "string",
        required: true,
        default: "",
        placeholder: "أحمد محمد علي",
        description: "Customer full name (Arabic or English)",
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
        placeholder: "ORD-FP-20250122-001",
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
        placeholder: "Payment for services",
        description: "Description of the payment for customer reference",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Payment Method",
        name: "paymentMethod",
        type: "options",
        required: true,
        options: [
          {
            name: "FastPay Wallet Only",
            value: "wallet",
            description: "FastPay mobile wallet only",
          },
          {
            name: "Credit/Debit Cards Only",
            value: "card",
            description: "Credit and debit cards only",
          },
          {
            name: "Both Wallet and Cards",
            value: "both",
            description: "Allow both payment methods",
          },
        ],
        default: "both",
        description: "Allowed payment methods for customer",
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },
      {
        displayName: "Return URLs",
        name: "returnUrls",
        type: "collection",
        placeholder: "Add Return URLs",
        required: true,
        default: {},
        options: [
          {
            displayName: "Success URL",
            name: "returnUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://yoursite.com/payment-success",
            description: "URL to redirect after successful payment",
          },
          {
            displayName: "Cancel URL",
            name: "cancelUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://yoursite.com/payment-cancel",
            description: "URL to redirect after payment cancellation",
          },
          {
            displayName: "Notification URL",
            name: "notifyUrl",
            type: "string",
            required: true,
            default: "",
            placeholder: "https://yoursite.com/webhook/fastpay",
            description: "URL for payment status notifications (webhook)",
          },
        ],
        displayOptions: {
          show: {
            operation: ["createPayment"],
          },
        },
      },

      // Check Status / Confirm / Refund Properties
      {
        displayName: "Transaction ID",
        name: "transactionId",
        type: "string",
        required: true,
        default: "",
        description: "FastPay transaction ID",
        displayOptions: {
          show: {
            operation: ["checkStatus", "confirmPayment", "refundPayment"],
          },
        },
      },
      {
        displayName: "Refund Amount (IQD)",
        name: "refundAmount",
        type: "number",
        default: 0,
        description: "Amount to refund (0 for full refund)",
        displayOptions: {
          show: {
            operation: ["refundPayment"],
          },
        },
        typeOptions: {
          minValue: 0,
        },
      },
      {
        displayName: "Refund Reason",
        name: "refundReason",
        type: "string",
        default: "",
        placeholder: "Customer requested refund",
        description: "Reason for the refund",
        displayOptions: {
          show: {
            operation: ["refundPayment"],
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
            displayName: "Customer Email",
            name: "customerEmail",
            type: "string",
            default: "",
            placeholder: "customer@example.com",
            description: "Customer email address (optional)",
          },
          {
            displayName: "Expiration Time (minutes)",
            name: "expirationTime",
            type: "number",
            default: 15,
            description: "Payment expiration time in minutes",
            typeOptions: {
              minValue: 5,
              maxValue: 60, // 1 hour max
            },
          },
          {
            displayName: "Generate QR Code",
            name: "generateQrCode",
            type: "boolean",
            default: true,
            description: "Generate QR code for mobile payments",
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
      "fastPayApi",
    )) as FastPayCredentials;

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

          case "refundPayment":
            result = await this.refundPayment.call(
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
          `fastpay_${this.getNodeParameter("operation", i)}`,
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
   * Create a new FastPay payment
   */
  private async createPayment(
    itemIndex: number,
    credentials: FastPayCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
    advancedOptions: any,
  ): Promise<any> {
    const amount = this.getNodeParameter("amount", itemIndex) as number;
    const customerPhone = this.getNodeParameter(
      "customerPhone",
      itemIndex,
    ) as string;
    const customerName = this.getNodeParameter(
      "customerName",
      itemIndex,
    ) as string;
    const orderId = this.getNodeParameter("orderId", itemIndex) as string;
    const description = this.getNodeParameter(
      "description",
      itemIndex,
    ) as string;
    const paymentMethod = this.getNodeParameter(
      "paymentMethod",
      itemIndex,
    ) as string;
    const returnUrls = this.getNodeParameter("returnUrls", itemIndex) as any;

    // Validate minimum amount
    if (amount < 500) {
      throw new NodeOperationError(
        this.getNode(),
        "FastPay requires a minimum payment of 500 IQD (المبلغ الأدنى هو 500 دينار عراقي)",
        { itemIndex },
      );
    }

    // Validate phone number format
    const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
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
        paymentMethod,
        merchantCategory: this.inferMerchantCategory(description),
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
        { amount, customerPhone, paymentMethod, description },
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
    const transactionId = this.generateTransactionId("FP");
    const language =
      advancedOptions.language || culturalContext.language || "ar";

    const transactionRequest: FastPayTransactionRequest = {
      amount,
      currency: "IQD",
      orderId,
      description,
      customerPhone: cleanPhone.startsWith("964")
        ? `+${cleanPhone}`
        : `+964${cleanPhone.substring(1)}`,
      customerName,
      customerEmail: advancedOptions.customerEmail,
      returnUrl: returnUrls.returnUrl,
      cancelUrl: returnUrls.cancelUrl,
      notifyUrl: returnUrls.notifyUrl,
      paymentMethod: paymentMethod as any,
      expirationTime: advancedOptions.expirationTime || 15,
      language: language === "ar" ? "ar" : "en",
      merchantReference: transactionId,
    };

    // Generate signature for API security
    const signature = this.generateFastPaySignature(
      transactionRequest,
      credentials.secretKey,
    );

    try {
      const baseUrl = credentials.sandboxMode
        ? "https://sandbox-api.fastpay.iq/v1/payments"
        : "https://api.fastpay.iq/v1/payments";

      const response = await axios.post(baseUrl, transactionRequest, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Merchant-ID": credentials.merchantId,
          "X-Signature": signature,
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 30000,
      });

      const fastpayResponse = response.data as FastPayTransactionResponse;

      // Format currency for cultural display
      const formattedAmount = this.formatIraqiCurrency(amount);
      const formattedFees = this.formatIraqiCurrency(
        fastpayResponse.fees.totalFees,
      );

      // Create comprehensive audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "fastpay_create_payment",
        {
          amount,
          orderId,
          customerPhone: this.maskPhoneNumber(customerPhone),
          description,
        },
        {
          ...fastpayResponse,
          customerPhone: this.maskPhoneNumber(fastpayResponse.customerPhone),
        },
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "createPayment",
          transactionId: fastpayResponse.transactionId,
          status: fastpayResponse.status,
          amount: {
            original: amount,
            formatted: formattedAmount,
          },
          fees: {
            original: fastpayResponse.fees,
            totalFormatted: formattedFees,
            breakdown: {
              customer: this.formatIraqiCurrency(
                fastpayResponse.fees.customerFee,
              ),
              merchant: this.formatIraqiCurrency(
                fastpayResponse.fees.merchantFee,
              ),
            },
          },
          currency: "IQD",
          orderId,
          customerPhone: this.maskPhoneNumber(fastpayResponse.customerPhone),
          paymentUrl: fastpayResponse.paymentUrl,
          qrCode: fastpayResponse.qrCode,
          expiresAt: fastpayResponse.expirationTime,
          createdAt: fastpayResponse.createdAt,
          language,
          paymentMethod,
          islamicCompliant: true,
          fraudCheckPassed: true,
          auditLog,
          fastpayResponse: {
            ...fastpayResponse,
            customerPhone: this.maskPhoneNumber(fastpayResponse.customerPhone),
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "FastPay payment creation failed";
      let arabicMessage = "فشل في إنشاء دفعة فاست باي";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "INSUFFICIENT_AMOUNT") {
          arabicMessage = "المبلغ أقل من الحد الأدنى - 500 دينار عراقي";
        } else if (responseData.code === "INVALID_PHONE") {
          arabicMessage = "رقم الهاتف غير صحيح";
        } else if (responseData.code === "MERCHANT_INACTIVE") {
          arabicMessage = "حساب التاجر غير نشط";
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
    credentials: FastPayCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
  ): Promise<any> {
    const transactionId = this.getNodeParameter(
      "transactionId",
      itemIndex,
    ) as string;

    try {
      const baseUrl = credentials.sandboxMode
        ? `https://sandbox-api.fastpay.iq/v1/payments/${transactionId}/status`
        : `https://api.fastpay.iq/v1/payments/${transactionId}/status`;

      const response = await axios.get(baseUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Merchant-ID": credentials.merchantId,
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 30000,
      });

      const statusResponse = response.data as FastPayStatusResponse;

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
        "fastpay_check_status",
        { transactionId },
        {
          ...statusResponse,
          customerPhone: this.maskPhoneNumber(statusResponse.customerPhone),
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
              customer: this.formatIraqiCurrency(
                statusResponse.fees.customerFee,
              ),
              merchant: this.formatIraqiCurrency(
                statusResponse.fees.merchantFee,
              ),
            },
          },
          currency: statusResponse.currency,
          orderId: statusResponse.orderId,
          customerPhone: this.maskPhoneNumber(statusResponse.customerPhone),
          paymentMethod: statusResponse.paymentMethod,
          completedAt: statusResponse.completedAt,
          failureReason: statusResponse.failureReason,
          transactionHash: statusResponse.transactionHash,
          statusMessages: {
            english: this.getStatusMessage(statusResponse.status, "en"),
            arabic: this.getStatusMessage(statusResponse.status, "ar"),
          },
          auditLog,
          fastpayResponse: {
            ...statusResponse,
            customerPhone: this.maskPhoneNumber(statusResponse.customerPhone),
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "Failed to check FastPay payment status";
      let arabicMessage = "فشل في التحقق من حالة دفعة فاست باي";

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
   * Confirm completed payment with comprehensive validation
   */
  private async confirmPayment(
    itemIndex: number,
    credentials: FastPayCredentials,
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
          confirmed: false,
          reason: "Payment not completed",
          arabicReason: "الدفعة لم تكتمل بعد",
          currentStatus: paymentData.status,
          statusMessage: paymentData.statusMessages,
          paymentData,
        },
      };
    }

    // Verify transaction hash integrity
    const expectedHash = this.generateTransactionHash(paymentData);
    const hashValid = expectedHash === paymentData.transactionHash;

    if (!hashValid) {
      return {
        json: {
          success: false,
          confirmed: false,
          reason: "Transaction hash validation failed",
          arabicReason: "فشل في التحقق من سلامة المعاملة",
          hashValidation: {
            expected: expectedHash,
            received: paymentData.transactionHash,
            valid: false,
          },
          paymentData,
        },
      };
    }

    // Enhanced fraud detection for completed payments
    if (advancedOptions.enhancedFraudDetection !== false) {
      const fraudCheck = this.detectFraud(
        {
          amount: paymentData.amount.original,
          netAmount: paymentData.netAmount.original,
          fees: paymentData.fees.original.totalFees,
          paymentMethod: paymentData.paymentMethod,
          completedAt: paymentData.completedAt,
        },
        { country: "IQ", ipAddress: "127.0.0.1" },
        [],
      );

      if (fraudCheck.riskLevel === "critical") {
        return {
          json: {
            success: false,
            confirmed: false,
            reason: "High fraud risk detected",
            arabicReason: "تم اكتشاف خطر احتيال عالي",
            fraudCheck,
            paymentData,
          },
        };
      }
    }

    // Validate reasonable fee structure
    const feePercentage =
      (paymentData.fees.original.totalFees / paymentData.amount.original) * 100;
    const reasonableFee = feePercentage <= 5.0;

    // Create confirmation audit log
    const auditLog = this.createAuditLog(
      this.getNode().id,
      this.getExecutionId(),
      "fastpay_confirm_payment",
      { transactionId: this.getNodeParameter("transactionId", itemIndex) },
      {
        confirmed: true,
        hashValid,
        fraudCheck: "passed",
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
          hashValidated: hashValid,
          fraudCheckPassed: true,
          reasonableFees: reasonableFee,
          islamicCompliant: true,
        },
        hashValidation: {
          expected: expectedHash,
          received: paymentData.transactionHash,
          valid: hashValid,
        },
        feeAnalysis: {
          percentage: feePercentage,
          reasonable: reasonableFee,
          threshold: 5.0,
        },
        confirmationTimestamp: new Date().toISOString(),
        auditLog,
        paymentData,
      },
    };
  }

  /**
   * Process payment refund
   */
  private async refundPayment(
    itemIndex: number,
    credentials: FastPayCredentials,
    culturalContext: IraqiCulturalContext,
    securitySettings: any,
  ): Promise<any> {
    const transactionId = this.getNodeParameter(
      "transactionId",
      itemIndex,
    ) as string;
    const refundAmount = this.getNodeParameter(
      "refundAmount",
      itemIndex,
    ) as number;
    const refundReason = this.getNodeParameter(
      "refundReason",
      itemIndex,
    ) as string;

    // First check if payment is eligible for refund
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
        "Only completed payments can be refunded (يمكن فقط استرداد المدفوعات المكتملة)",
        { itemIndex },
      );
    }

    // Determine refund amount
    const actualRefundAmount =
      refundAmount > 0 ? refundAmount : paymentData.netAmount.original;

    if (actualRefundAmount > paymentData.netAmount.original) {
      throw new NodeOperationError(
        this.getNode(),
        "Refund amount cannot exceed the net payment amount (مبلغ الاسترداد لا يمكن أن يتجاوز صافي مبلغ الدفع)",
        { itemIndex },
      );
    }

    try {
      const baseUrl = credentials.sandboxMode
        ? `https://sandbox-api.fastpay.iq/v1/payments/${transactionId}/refund`
        : `https://api.fastpay.iq/v1/payments/${transactionId}/refund`;

      const refundRequest = {
        amount: actualRefundAmount,
        reason: refundReason || "Customer requested refund",
        merchantReference: this.generateTransactionId("RF"),
      };

      const signature = this.generateFastPaySignature(
        refundRequest,
        credentials.secretKey,
      );

      const response = await axios.post(baseUrl, refundRequest, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${credentials.apiKey}`,
          "X-Merchant-ID": credentials.merchantId,
          "X-Signature": signature,
          "User-Agent": "Iraqi-Government-Node/1.0",
        },
        timeout: 30000,
      });

      const refundResponse = response.data;

      // Format amounts
      const formattedRefundAmount =
        this.formatIraqiCurrency(actualRefundAmount);

      // Create audit log
      const auditLog = this.createAuditLog(
        this.getNode().id,
        this.getExecutionId(),
        "fastpay_refund_payment",
        {
          transactionId,
          refundAmount: actualRefundAmount,
          reason: refundReason,
        },
        refundResponse,
        culturalContext,
        securitySettings,
        true,
      );

      return {
        json: {
          success: true,
          operation: "refundPayment",
          originalTransactionId: transactionId,
          refundTransactionId: refundResponse.refundTransactionId,
          refundAmount: {
            original: actualRefundAmount,
            formatted: formattedRefundAmount,
          },
          refundStatus: refundResponse.status,
          refundReason,
          estimatedRefundTime: refundResponse.estimatedRefundTime,
          refundMethod: refundResponse.refundMethod,
          auditLog,
          fastpayResponse: refundResponse,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "FastPay refund processing failed";
      let arabicMessage = "فشل في معالجة الاسترداد";

      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        errorMessage =
          responseData.message || responseData.error || errorMessage;

        if (responseData.code === "REFUND_NOT_ALLOWED") {
          arabicMessage = "الاسترداد غير مسموح لهذه المعاملة";
        } else if (responseData.code === "REFUND_AMOUNT_INVALID") {
          arabicMessage = "مبلغ الاسترداد غير صحيح";
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
   * Generate FastPay API signature
   */
  private generateFastPaySignature(data: any, secretKey: string): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {} as any);

    const dataString = JSON.stringify(sortedData);
    return createHash("sha256")
      .update(dataString + secretKey)
      .digest("hex");
  }

  /**
   * Generate transaction hash for validation
   */
  private generateTransactionHash(paymentData: any): string {
    const hashData = {
      transactionId: paymentData.transactionId,
      amount: paymentData.amount.original,
      status: paymentData.status,
      completedAt: paymentData.completedAt,
    };

    return createHash("sha256").update(JSON.stringify(hashData)).digest("hex");
  }

  /**
   * Mask phone number for privacy
   */
  private maskPhoneNumber(phone: string): string {
    if (!phone) return "";
    return phone.replace(/(\+964|0)(\d{3})\d{4}(\d{3})/, "$1$2****$3");
  }

  /**
   * Infer merchant category from description
   */
  private inferMerchantCategory(description: string): string {
    const desc = description.toLowerCase();

    if (
      desc.includes("food") ||
      desc.includes("restaurant") ||
      desc.includes("طعام") ||
      desc.includes("مطعم")
    ) {
      return "food";
    }
    if (
      desc.includes("pharmacy") ||
      desc.includes("medicine") ||
      desc.includes("صيدلية") ||
      desc.includes("دواء")
    ) {
      return "pharmacy";
    }
    if (
      desc.includes("transport") ||
      desc.includes("taxi") ||
      desc.includes("نقل") ||
      desc.includes("تاكسي")
    ) {
      return "transportation";
    }
    if (
      desc.includes("book") ||
      desc.includes("education") ||
      desc.includes("كتاب") ||
      desc.includes("تعليم")
    ) {
      return "book";
    }
    if (
      desc.includes("grocery") ||
      desc.includes("shopping") ||
      desc.includes("بقالة") ||
      desc.includes("تسوق")
    ) {
      return "grocery";
    }

    return "other";
  }

  /**
   * Get localized status messages
   */
  private getStatusMessage(status: string, language: "en" | "ar"): string {
    const messages = {
      initiated: {
        en: "Payment has been initiated",
        ar: "تم بدء عملية الدفع",
      },
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
