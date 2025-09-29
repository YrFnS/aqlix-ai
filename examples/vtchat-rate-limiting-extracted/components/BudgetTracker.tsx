/**
 * Budget Tracking Component
 * Shows spending, costs, and budget alerts for Iraqi AI Chat System
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
  PieChart,
  CreditCard,
  ArrowUp,
} from "lucide-react";

export interface BudgetStatus {
  dailySpent: number;
  monthlySpent: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  currency: "IQD";
  percentageUsed: {
    daily: number;
    monthly: number;
  };
  requestCosts: {
    chat: number;
    translation: number;
    cultural_validation: number;
    image_generation: number;
    professional_query: number;
  };
  warningLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  paymentGateway?: "zaincash" | "fastpay" | "nasswallet";
  nextBillingDate: Date;
  subscriptionTier: "trial" | "basic" | "premium" | "organization";
}

interface BudgetTrackerProps {
  userId: string;
  status?: BudgetStatus;
  showArabic?: boolean;
  isRTL?: boolean;
  onAddFunds?: () => void;
  onUpgrade?: () => void;
  refreshInterval?: number;
}

export function BudgetTracker({
  userId,
  status,
  showArabic = false,
  isRTL = false,
  onAddFunds,
  onUpgrade,
  refreshInterval = 60000, // 1 minute
}: BudgetTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<BudgetStatus | null>(
    status || null,
  );
  const [loading, setLoading] = useState(!status);
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "monthly">(
    "daily",
  );

  useEffect(() => {
    if (!status) {
      fetchBudgetStatus();
    }

    const interval = setInterval(fetchBudgetStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [userId, refreshInterval]);

  const fetchBudgetStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budget/status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data);
      }
    } catch (error) {
      console.error("Error fetching budget status:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(showArabic ? "ar-IQ" : "en-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWarningColor = (level?: string) => {
    switch (level) {
      case "CRITICAL":
        return "border-red-500 bg-red-50";
      case "HIGH":
        return "border-orange-500 bg-orange-50";
      case "MEDIUM":
        return "border-yellow-500 bg-yellow-50";
      case "LOW":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-green-500 bg-green-50";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPaymentGatewayIcon = (gateway?: string) => {
    switch (gateway) {
      case "zaincash":
        return "💳";
      case "fastpay":
        return "⚡";
      case "nasswallet":
        return "🏦";
      default:
        return "💰";
    }
  };

  const getDaysUntilBilling = (nextBillingDate: Date) => {
    const now = new Date();
    const billing = new Date(nextBillingDate);
    const diffTime = billing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading && !currentStatus) {
    return (
      <Card className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
        <CardHeader>
          <div className="animate-pulse bg-gray-200 h-6 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="animate-pulse bg-gray-200 h-8 rounded w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStatus) {
    return (
      <Card className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {showArabic
              ? "لا يمكن تحميل معلومات الميزانية"
              : "Unable to load budget information"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentSpent =
    selectedPeriod === "daily"
      ? currentStatus.dailySpent
      : currentStatus.monthlySpent;
  const currentLimit =
    selectedPeriod === "daily"
      ? currentStatus.dailyLimit
      : currentStatus.monthlyLimit;
  const currentRemaining =
    selectedPeriod === "daily"
      ? currentStatus.dailyRemaining
      : currentStatus.monthlyRemaining;
  const currentPercentage =
    selectedPeriod === "daily"
      ? currentStatus.percentageUsed.daily
      : currentStatus.percentageUsed.monthly;

  return (
    <div
      className={`space-y-6 ${isRTL ? "text-right font-arabic" : "text-left"}`}
    >
      {/* Main Budget Overview */}
      <Card
        className={
          currentStatus.warningLevel
            ? getWarningColor(currentStatus.warningLevel)
            : ""
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {showArabic ? "نظرة عامة على الميزانية" : "Budget Overview"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedPeriod === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("daily")}
            >
              {showArabic ? "يومي" : "Daily"}
            </Button>
            <Button
              variant={selectedPeriod === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("monthly")}
            >
              {showArabic ? "شهري" : "Monthly"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Budget Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {formatCurrency(currentSpent)}
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {showArabic ? "من" : "of"} {formatCurrency(currentLimit)}
                </div>
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(currentRemaining)}{" "}
                  {showArabic ? "متبقي" : "remaining"}
                </div>
              </div>
            </div>

            <Progress
              value={currentPercentage}
              className="h-4"
              indicatorClassName={getProgressColor(currentPercentage)}
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {currentPercentage.toFixed(1)}% {showArabic ? "مستخدم" : "used"}
              </span>
              <span>
                {selectedPeriod === "daily"
                  ? showArabic
                    ? "يتجدد كل يوم"
                    : "Resets daily"
                  : showArabic
                    ? "يتجدد شهرياً"
                    : "Resets monthly"}
              </span>
            </div>
          </div>

          {/* Warning Messages */}
          {currentStatus.warningLevel &&
            ["HIGH", "CRITICAL"].includes(currentStatus.warningLevel) && (
              <div className="p-4 bg-orange-100 border border-orange-300 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-800">
                      {currentStatus.warningLevel === "CRITICAL"
                        ? showArabic
                          ? "تحذير حرج: الميزانية شبه منتهية!"
                          : "Critical Warning: Budget Nearly Exhausted!"
                        : showArabic
                          ? "تحذير: استهلاك عالي للميزانية"
                          : "Warning: High Budget Usage"}
                    </p>
                    <p className="text-xs text-orange-700">
                      {showArabic
                        ? "أضف المزيد من الأموال أو قم بترقية خطتك لتجنب انقطاع الخدمة"
                        : "Add more funds or upgrade your plan to avoid service interruption"}
                    </p>
                    <div className="flex gap-2">
                      {onAddFunds && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onAddFunds}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          {showArabic ? "إضافة أموال" : "Add Funds"}
                        </Button>
                      )}
                      {onUpgrade && (
                        <Button size="sm" onClick={onUpgrade}>
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {showArabic ? "ترقية الخطة" : "Upgrade Plan"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Request Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            {showArabic
              ? "تفصيل التكاليف حسب نوع الطلب"
              : "Cost Breakdown by Request Type"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(currentStatus.requestCosts).map(([type, cost]) => {
              const labels = {
                chat: showArabic ? "محادثة" : "Chat",
                translation: showArabic ? "ترجمة" : "Translation",
                cultural_validation: showArabic
                  ? "تحقق ثقافي"
                  : "Cultural Validation",
                image_generation: showArabic ? "إنتاج صور" : "Image Generation",
                professional_query: showArabic
                  ? "استفسار مهني"
                  : "Professional Query",
              };

              return (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      {labels[type as keyof typeof labels]}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(cost)}{" "}
                    {showArabic ? "لكل طلب" : "per request"}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subscription & Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {showArabic
              ? "معلومات الاشتراك والدفع"
              : "Subscription & Billing Info"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {showArabic ? "الخطة الحالية:" : "Current Plan:"}
              </span>
              <Badge className="capitalize">
                {currentStatus.subscriptionTier}
              </Badge>
            </div>

            {currentStatus.paymentGateway && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {showArabic ? "بوابة الدفع:" : "Payment Gateway:"}
                </span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {getPaymentGatewayIcon(currentStatus.paymentGateway)}
                  {currentStatus.paymentGateway === "zaincash" && "ZainCash"}
                  {currentStatus.paymentGateway === "fastpay" && "FastPay"}
                  {currentStatus.paymentGateway === "nasswallet" &&
                    "NassWallet"}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {showArabic ? "التجديد التالي:" : "Next Billing:"}
              </span>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {new Date(currentStatus.nextBillingDate).toLocaleDateString(
                    showArabic ? "ar-IQ" : "en-IQ",
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getDaysUntilBilling(currentStatus.nextBillingDate)}{" "}
                  {showArabic ? "أيام متبقية" : "days remaining"}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(currentStatus.dailySpent)}
                  </div>
                  <div className="text-xs text-blue-700">
                    {showArabic ? "إنفاق اليوم" : "Today's Spending"}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(currentStatus.monthlySpent)}
                  </div>
                  <div className="text-xs text-green-700">
                    {showArabic ? "إنفاق الشهر" : "Month's Spending"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3">
        {onAddFunds && (
          <Button variant="outline" className="flex-1" onClick={onAddFunds}>
            <CreditCard className="h-4 w-4 mr-2" />
            {showArabic ? "إضافة أموال" : "Add Funds"}
          </Button>
        )}
        {onUpgrade && (
          <Button className="flex-1" onClick={onUpgrade}>
            <TrendingUp className="h-4 w-4 mr-2" />
            {showArabic ? "ترقية الخطة" : "Upgrade Plan"}
          </Button>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-xs text-muted-foreground text-center">
        {showArabic
          ? "يتم تحديث البيانات كل دقيقة. جميع الأسعار بالدينار العراقي (د.ع)."
          : "Data updates every minute. All prices in Iraqi Dinar (IQD)."}
      </div>
    </div>
  );
}
