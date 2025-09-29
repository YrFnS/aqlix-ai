/**
 * Iraqi Payment Gateway Integration for Rate Limiting
 * Enhanced integration for ZainCash, FastPay, and NassWallet
 *
 * Features:
 * - Subscription tier management
 * - Payment verification for quota upgrades
 * - Iraqi Dinar (IQD) pricing
 * - Professional domain billing
 * - Real-time payment status updates
 */

export interface IraqiPaymentGatewayConfig {
  zaincash: {
    apiKey: string;
    merchantId: string;
    secretKey: string;
    baseUrl: string;
    webhookSecret: string;
    transactionFee: number; // Percentage
  };
  fastpay: {
    apiKey: string;
    merchantCode: string;
    privateKey: string;
    baseUrl: string;
    webhookUrl: string;
    transactionFee: number;
  };
  nasswallet: {
    apiKey: string;
    storeId: string;
    authToken: string;
    baseUrl: string;
    callbackUrl: string;
    transactionFee: number;
  };
}

export interface PaymentSubscription {
  userId: string;
  subscriptionId: string;
  tier: "trial" | "basic" | "premium" | "organization";
  paymentGateway: "zaincash" | "fastpay" | "nasswallet";
  amountIQD: number;
  currency: "IQD";
  status: "pending" | "active" | "expired" | "cancelled" | "failed";
  billingCycle: "monthly" | "yearly";
  nextBillingDate: Date;
  createdAt: Date;
  updatedAt: Date;
  professionalDomain?:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "engineering";
  quotaConfigId: string;
}

export interface PaymentTransactionRecord {
  transactionId: string;
  userId: string;
  subscriptionId?: string;
  gateway: "zaincash" | "fastpay" | "nasswallet";
  type: "subscription" | "overage" | "upgrade" | "professional_bonus";
  amountIQD: number;
  feeIQD: number;
  netAmountIQD: number;
  status: "pending" | "completed" | "failed" | "refunded";
  gatewayTransactionId: string;
  gatewayResponse?: any;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

export class IraqiPaymentGatewayIntegration {
  private config: IraqiPaymentGatewayConfig;
  private redis: any; // Redis client

  constructor(config: IraqiPaymentGatewayConfig, redis: any) {
    this.config = config;
    this.redis = redis;
  }

  /**
   * Create subscription payment with Iraqi gateway
   */
  async createSubscriptionPayment(
    userId: string,
    tier: PaymentSubscription["tier"],
    paymentGateway: PaymentSubscription["paymentGateway"],
    professionalDomain?: PaymentSubscription["professionalDomain"],
  ): Promise<{
    subscriptionId: string;
    paymentUrl: string;
    amountIQD: number;
    expiresAt: Date;
  }> {
    const subscription = await this.createSubscriptionRecord(
      userId,
      tier,
      paymentGateway,
      professionalDomain,
    );

    let paymentUrl: string;

    switch (paymentGateway) {
      case "zaincash":
        paymentUrl = await this.createZainCashPayment(subscription);
        break;
      case "fastpay":
        paymentUrl = await this.createFastPayPayment(subscription);
        break;
      case "nasswallet":
        paymentUrl = await this.createNassWalletPayment(subscription);
        break;
      default:
        throw new Error(`Unsupported payment gateway: ${paymentGateway}`);
    }

    return {
      subscriptionId: subscription.subscriptionId,
      paymentUrl,
      amountIQD: subscription.amountIQD,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  /**
   * Verify payment and activate subscription
   */
  async verifyAndActivateSubscription(
    subscriptionId: string,
    gatewayTransactionId: string,
  ): Promise<{
    success: boolean;
    subscription?: PaymentSubscription;
    quotaConfigId?: string;
  }> {
    try {
      const subscription = await this.getSubscription(subscriptionId);
      if (!subscription) {
        return { success: false };
      }

      // Verify payment with respective gateway
      const verified = await this.verifyPaymentWithGateway(
        subscription.paymentGateway,
        gatewayTransactionId,
        subscription.amountIQD,
      );

      if (!verified) {
        await this.updateSubscriptionStatus(subscriptionId, "failed");
        return { success: false };
      }

      // Activate subscription
      const updatedSubscription =
        await this.activateSubscription(subscriptionId);

      // Apply quota configuration
      const quotaConfigId = await this.applyQuotaConfiguration(
        subscription.userId,
        subscription.tier,
        subscription.professionalDomain,
        subscription.paymentGateway,
      );

      return {
        success: true,
        subscription: updatedSubscription,
        quotaConfigId,
      };
    } catch (error) {
      console.error("Error verifying subscription payment:", error);
      return { success: false };
    }
  }

  /**
   * Process overage payment for quota exceeded users
   */
  async processOveragePayment(
    userId: string,
    overageAmount: number,
    requestType: string,
    paymentGateway: "zaincash" | "fastpay" | "nasswallet",
  ): Promise<{
    transactionId: string;
    paymentUrl: string;
    amountIQD: number;
  }> {
    const feeRate = this.config[paymentGateway].transactionFee;
    const feeAmount = Math.round(overageAmount * feeRate);
    const totalAmount = overageAmount + feeAmount;

    const transaction: PaymentTransactionRecord = {
      transactionId: this.generateTransactionId(),
      userId,
      gateway: paymentGateway,
      type: "overage",
      amountIQD: overageAmount,
      feeIQD: feeAmount,
      netAmountIQD: totalAmount,
      status: "pending",
      gatewayTransactionId: "",
      createdAt: new Date(),
    };

    // Store transaction record
    await this.storeTransactionRecord(transaction);

    // Create payment URL based on gateway
    let paymentUrl: string;
    switch (paymentGateway) {
      case "zaincash":
        paymentUrl = await this.createZainCashOveragePayment(transaction);
        break;
      case "fastpay":
        paymentUrl = await this.createFastPayOveragePayment(transaction);
        break;
      case "nasswallet":
        paymentUrl = await this.createNassWalletOveragePayment(transaction);
        break;
      default:
        throw new Error(`Unsupported payment gateway: ${paymentGateway}`);
    }

    return {
      transactionId: transaction.transactionId,
      paymentUrl,
      amountIQD: totalAmount,
    };
  }

  /**
   * Handle webhook notifications from payment gateways
   */
  async handlePaymentWebhook(
    gateway: "zaincash" | "fastpay" | "nasswallet",
    payload: any,
    signature?: string,
  ): Promise<{
    success: boolean;
    transactionId?: string;
    subscriptionActivated?: boolean;
  }> {
    try {
      // Verify webhook signature
      const isValid = await this.verifyWebhookSignature(
        gateway,
        payload,
        signature,
      );
      if (!isValid) {
        console.error("Invalid webhook signature");
        return { success: false };
      }

      // Parse gateway-specific payload
      const { transactionId, gatewayTransactionId, status, amount } =
        await this.parseWebhookPayload(gateway, payload);

      if (!transactionId) {
        console.error("Missing transaction ID in webhook");
        return { success: false };
      }

      // Update transaction status
      await this.updateTransactionStatus(
        transactionId,
        status,
        gatewayTransactionId,
      );

      // Handle subscription activation if applicable
      let subscriptionActivated = false;
      if (status === "completed") {
        const transaction = await this.getTransactionRecord(transactionId);
        if (transaction?.subscriptionId) {
          await this.verifyAndActivateSubscription(
            transaction.subscriptionId,
            gatewayTransactionId,
          );
          subscriptionActivated = true;
        }
      }

      return {
        success: true,
        transactionId,
        subscriptionActivated,
      };
    } catch (error) {
      console.error("Error handling payment webhook:", error);
      return { success: false };
    }
  }

  /**
   * Get subscription pricing for different tiers
   */
  getSubscriptionPricing(): Record<
    PaymentSubscription["tier"],
    { monthly: number; yearly: number }
  > {
    return {
      trial: { monthly: 0, yearly: 0 },
      basic: { monthly: 35000, yearly: 350000 }, // 35K IQD monthly, 350K yearly (2 months free)
      premium: { monthly: 85000, yearly: 850000 }, // 85K IQD monthly, 850K yearly (2 months free)
      organization: { monthly: 250000, yearly: 2500000 }, // 250K IQD monthly, 2.5M yearly (2 months free)
    };
  }

  /**
   * Get professional domain pricing multipliers
   */
  getProfessionalDomainMultipliers(): Record<string, number> {
    return {
      legal: 1.5, // 50% premium for legal
      medical: 1.8, // 80% premium for medical
      educational: 1.2, // 20% premium for educational (discounted)
      business: 1.4, // 40% premium for business
      engineering: 1.6, // 60% premium for engineering
    };
  }

  // Private methods for gateway-specific implementations

  private async createZainCashPayment(
    subscription: PaymentSubscription,
  ): Promise<string> {
    const { zaincash } = this.config;

    const paymentData = {
      amount: subscription.amountIQD,
      serviceType: "Iraqi AI Chat Subscription",
      msisdn: "", // Will be provided by user
      merchantId: zaincash.merchantId,
      orderId: subscription.subscriptionId,
      redirectUrl: `${process.env.FRONTEND_URL}/payment/success`,
      iat: Math.floor(Date.now() / 1000),
    };

    // Create JWT token with ZainCash secret
    const token = this.createJWTToken(paymentData, zaincash.secretKey);

    return `${zaincash.baseUrl}/transaction/init?token=${token}`;
  }

  private async createFastPayPayment(
    subscription: PaymentSubscription,
  ): Promise<string> {
    const { fastpay } = this.config;

    const paymentData = {
      merchant_code: fastpay.merchantCode,
      amount: subscription.amountIQD,
      currency: "IQD",
      order_id: subscription.subscriptionId,
      description: `Iraqi AI Chat ${subscription.tier} subscription`,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    };

    // Create signature
    const signature = this.createFastPaySignature(
      paymentData,
      fastpay.privateKey,
    );

    const response = await fetch(`${fastpay.baseUrl}/api/v1/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastpay.apiKey}`,
      },
      body: JSON.stringify({ ...paymentData, signature }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(`FastPay payment creation failed: ${result.error}`);
    }

    return result.payment_url;
  }

  private async createNassWalletPayment(
    subscription: PaymentSubscription,
  ): Promise<string> {
    const { nasswallet } = this.config;

    const paymentData = {
      store_id: nasswallet.storeId,
      amount: subscription.amountIQD,
      currency: "IQD",
      transaction_id: subscription.subscriptionId,
      description: `Iraqi AI Chat ${subscription.tier} subscription`,
      callback_url: nasswallet.callbackUrl,
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    };

    const response = await fetch(`${nasswallet.baseUrl}/api/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nasswallet.authToken}`,
        "X-API-Key": nasswallet.apiKey,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(`NassWallet payment creation failed: ${result.message}`);
    }

    return result.payment_url;
  }

  private async createSubscriptionRecord(
    userId: string,
    tier: PaymentSubscription["tier"],
    paymentGateway: PaymentSubscription["paymentGateway"],
    professionalDomain?: PaymentSubscription["professionalDomain"],
  ): Promise<PaymentSubscription> {
    const pricing = this.getSubscriptionPricing();
    const domainMultipliers = this.getProfessionalDomainMultipliers();

    let baseAmount = pricing[tier].monthly;

    // Apply professional domain multiplier
    if (professionalDomain) {
      baseAmount = Math.round(
        baseAmount * domainMultipliers[professionalDomain],
      );
    }

    // Apply payment gateway fee
    const feeRate = this.config[paymentGateway].transactionFee;
    const totalAmount = Math.round(baseAmount + baseAmount * feeRate);

    const subscription: PaymentSubscription = {
      userId,
      subscriptionId: this.generateSubscriptionId(),
      tier,
      paymentGateway,
      amountIQD: totalAmount,
      currency: "IQD",
      status: "pending",
      billingCycle: "monthly",
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      updatedAt: new Date(),
      professionalDomain,
      quotaConfigId: `iraqi-${tier}`,
    };

    // Store in Redis
    await this.redis.set(
      `subscription:${subscription.subscriptionId}`,
      JSON.stringify(subscription),
      "EX",
      86400 * 30, // Expire after 30 days if not activated
    );

    return subscription;
  }

  private async getSubscription(
    subscriptionId: string,
  ): Promise<PaymentSubscription | null> {
    try {
      const data = await this.redis.get(`subscription:${subscriptionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }

  private async updateSubscriptionStatus(
    subscriptionId: string,
    status: PaymentSubscription["status"],
  ): Promise<void> {
    try {
      const subscription = await this.getSubscription(subscriptionId);
      if (subscription) {
        subscription.status = status;
        subscription.updatedAt = new Date();

        await this.redis.set(
          `subscription:${subscriptionId}`,
          JSON.stringify(subscription),
          "EX",
          86400 * 365, // Store for 1 year after activation
        );
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  }

  private async activateSubscription(
    subscriptionId: string,
  ): Promise<PaymentSubscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription.status = "active";
    subscription.updatedAt = new Date();

    // Store active subscription
    await this.redis.set(
      `subscription:${subscriptionId}`,
      JSON.stringify(subscription),
      "EX",
      86400 * 365,
    );

    // Create user subscription mapping
    await this.redis.set(
      `user_subscription:${subscription.userId}`,
      subscriptionId,
      "EX",
      86400 * 365,
    );

    return subscription;
  }

  private async applyQuotaConfiguration(
    userId: string,
    tier: PaymentSubscription["tier"],
    professionalDomain?: PaymentSubscription["professionalDomain"],
    paymentGateway?: PaymentSubscription["paymentGateway"],
  ): Promise<string> {
    const quotaConfigId = `iraqi-${tier}`;

    // This would integrate with the quota service
    // For now, we'll store the configuration mapping
    await this.redis.set(
      `user_quota:${userId}`,
      JSON.stringify({
        configId: quotaConfigId,
        tier,
        professionalDomain,
        paymentGateway,
        activatedAt: new Date().toISOString(),
      }),
      "EX",
      86400 * 365,
    );

    return quotaConfigId;
  }

  private generateSubscriptionId(): string {
    return `iraqi_sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTransactionId(): string {
    return `iraqi_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createJWTToken(payload: any, secret: string): string {
    // Implementation would use a proper JWT library
    // This is a placeholder
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64url",
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );

    // In real implementation, use proper HMAC signing
    const signature = "placeholder_signature";

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private createFastPaySignature(data: any, privateKey: string): string {
    // Implementation would use proper cryptographic signing
    // This is a placeholder
    return "placeholder_signature";
  }

  private async verifyWebhookSignature(
    gateway: string,
    payload: any,
    signature?: string,
  ): Promise<boolean> {
    // Implementation would verify the webhook signature based on gateway
    // This is a placeholder that always returns true for demo
    return true;
  }

  private async parseWebhookPayload(
    gateway: string,
    payload: any,
  ): Promise<{
    transactionId: string;
    gatewayTransactionId: string;
    status: string;
    amount: number;
  }> {
    // Implementation would parse gateway-specific webhook payload
    // This is a placeholder
    return {
      transactionId: payload.order_id || payload.transaction_id,
      gatewayTransactionId: payload.id || payload.txn_id,
      status: payload.status === "success" ? "completed" : "failed",
      amount: payload.amount,
    };
  }

  private async verifyPaymentWithGateway(
    gateway: string,
    gatewayTransactionId: string,
    expectedAmount: number,
  ): Promise<boolean> {
    // Implementation would verify payment with the respective gateway API
    // This is a placeholder that always returns true for demo
    return true;
  }

  private async storeTransactionRecord(
    transaction: PaymentTransactionRecord,
  ): Promise<void> {
    await this.redis.set(
      `transaction:${transaction.transactionId}`,
      JSON.stringify(transaction),
      "EX",
      86400 * 90, // Store for 90 days
    );
  }

  private async getTransactionRecord(
    transactionId: string,
  ): Promise<PaymentTransactionRecord | null> {
    try {
      const data = await this.redis.get(`transaction:${transactionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error fetching transaction record:", error);
      return null;
    }
  }

  private async updateTransactionStatus(
    transactionId: string,
    status: string,
    gatewayTransactionId: string,
  ): Promise<void> {
    const transaction = await this.getTransactionRecord(transactionId);
    if (transaction) {
      transaction.status = status as any;
      transaction.gatewayTransactionId = gatewayTransactionId;
      if (status === "completed") {
        transaction.completedAt = new Date();
      }

      await this.storeTransactionRecord(transaction);
    }
  }

  // Placeholder methods for overage payments
  private async createZainCashOveragePayment(
    transaction: PaymentTransactionRecord,
  ): Promise<string> {
    return `${this.config.zaincash.baseUrl}/overage?txn=${transaction.transactionId}`;
  }

  private async createFastPayOveragePayment(
    transaction: PaymentTransactionRecord,
  ): Promise<string> {
    return `${this.config.fastpay.baseUrl}/overage?txn=${transaction.transactionId}`;
  }

  private async createNassWalletOveragePayment(
    transaction: PaymentTransactionRecord,
  ): Promise<string> {
    return `${this.config.nasswallet.baseUrl}/overage?txn=${transaction.transactionId}`;
  }
}
