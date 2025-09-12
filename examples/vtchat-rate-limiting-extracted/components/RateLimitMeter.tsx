/**
 * Rate Limit Usage Meter Component
 * Displays current usage with Iraqi-specific styling and Arabic support
 */

'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap, Globe } from 'lucide-react';

export interface RateLimitStatus {
  requests: {
    used: number;
    limit: number;
    resetTime: Date;
    percentage: number;
  };
  translation: {
    used: number;
    limit: number;
    percentage: number;
  };
  professional: {
    used: number;
    limit: number;
    percentage: number;
    domain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  };
  warningLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  subscriptionTier: 'trial' | 'basic' | 'premium' | 'organization';
  paymentGateway?: 'zaincash' | 'fastpay' | 'nasswallet';
}

interface RateLimitMeterProps {
  userId: string;
  status?: RateLimitStatus;
  showArabic?: boolean;
  isRTL?: boolean;
  onUpgradeClick?: () => void;
  refreshInterval?: number;
}

export function RateLimitMeter({
  userId,
  status,
  showArabic = false,
  isRTL = false,
  onUpgradeClick,
  refreshInterval = 30000, // 30 seconds
}: RateLimitMeterProps) {
  const [currentStatus, setCurrentStatus] = useState<RateLimitStatus | null>(status || null);
  const [loading, setLoading] = useState(!status);
  const [timeToReset, setTimeToReset] = useState<string>('');

  useEffect(() => {
    if (!status) {
      fetchRateLimitStatus();
    }
    
    const interval = setInterval(() => {
      fetchRateLimitStatus();
      updateTimeToReset();
    }, refreshInterval);

    const resetTimer = setInterval(updateTimeToReset, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(resetTimer);
    };
  }, [userId, refreshInterval]);

  const fetchRateLimitStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rate-limit/status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data);
      }
    } catch (error) {
      console.error('Error fetching rate limit status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeToReset = () => {
    if (currentStatus?.requests?.resetTime) {
      const now = new Date();
      const reset = new Date(currentStatus.requests.resetTime);
      const diff = reset.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          setTimeToReset(`${hours}h ${minutes}m`);
        } else {
          setTimeToReset(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeToReset('Resetting...');
      }
    }
  };

  const getWarningColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'trial': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'organization': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentGatewayIcon = (gateway?: string) => {
    switch (gateway) {
      case 'zaincash': return '💳 ZainCash';
      case 'fastpay': return '⚡ FastPay';
      case 'nasswallet': return '🏦 NassWallet';
      default: return null;
    }
  };

  const getProfessionalDomainLabel = (domain?: string) => {
    const domains = {
      legal: showArabic ? 'قانوني' : 'Legal',
      medical: showArabic ? 'طبي' : 'Medical',
      educational: showArabic ? 'تعليمي' : 'Educational',
      business: showArabic ? 'أعمال' : 'Business',
      engineering: showArabic ? 'هندسة' : 'Engineering',
    };
    return domain ? domains[domain as keyof typeof domains] : null;
  };

  if (loading && !currentStatus) {
    return (
      <Card className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-200 h-6 rounded"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="animate-pulse bg-gray-200 h-2 rounded w-full"></div>
            <div className="animate-pulse bg-gray-200 h-2 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStatus) {
    return (
      <Card className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {showArabic ? 'لا يمكن تحميل معلومات الحد الأقصى للطلبات' : 'Unable to load rate limit information'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {showArabic ? 'حالة الاستخدام' : 'Usage Status'}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={getSubscriptionBadgeColor(currentStatus.subscriptionTier)}>
            {currentStatus.subscriptionTier.charAt(0).toUpperCase() + currentStatus.subscriptionTier.slice(1)}
          </Badge>
          {currentStatus.warningLevel && (
            <Badge variant="outline" className={getWarningColor(currentStatus.warningLevel)}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {currentStatus.warningLevel}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Requests */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">
                {showArabic ? 'الطلبات العامة' : 'General Requests'}
              </h3>
              <Badge variant="outline" className="text-xs">
                {currentStatus.requests.used.toLocaleString()} / {currentStatus.requests.limit.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeToReset}
            </div>
          </div>
          <Progress 
            value={currentStatus.requests.percentage} 
            className="h-3"
            indicatorClassName={getProgressColor(currentStatus.requests.percentage)}
          />
          <p className="text-xs text-muted-foreground">
            {currentStatus.requests.percentage.toFixed(1)}% {showArabic ? 'مستخدم' : 'used'}
          </p>
        </div>

        {/* Arabic Translation */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <h3 className="text-sm font-medium">
                {showArabic ? 'الترجمة العربية' : 'Arabic Translation'}
              </h3>
              <Badge variant="outline" className="text-xs">
                {currentStatus.translation.used} / {currentStatus.translation.limit}
              </Badge>
            </div>
          </div>
          <Progress 
            value={currentStatus.translation.percentage} 
            className="h-2"
            indicatorClassName={getProgressColor(currentStatus.translation.percentage)}
          />
          <p className="text-xs text-muted-foreground">
            {currentStatus.translation.percentage.toFixed(1)}% {showArabic ? 'مستخدم' : 'used'}
          </p>
        </div>

        {/* Professional Domain (if applicable) */}
        {currentStatus.professional.domain && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">
                  {showArabic ? 'الاستفسارات المهنية' : 'Professional Queries'}
                </h3>
                <Badge className="text-xs bg-blue-100 text-blue-800">
                  {getProfessionalDomainLabel(currentStatus.professional.domain)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentStatus.professional.used} / {currentStatus.professional.limit}
                </Badge>
              </div>
            </div>
            <Progress 
              value={currentStatus.professional.percentage} 
              className="h-2"
              indicatorClassName={getProgressColor(currentStatus.professional.percentage)}
            />
            <p className="text-xs text-muted-foreground">
              {currentStatus.professional.percentage.toFixed(1)}% {showArabic ? 'مستخدم' : 'used'}
            </p>
          </div>
        )}

        {/* Payment Gateway Info */}
        {currentStatus.paymentGateway && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {showArabic ? 'بوابة الدفع:' : 'Payment Gateway:'}
              </div>
              <div className="text-sm font-medium">
                {getPaymentGatewayIcon(currentStatus.paymentGateway)}
              </div>
            </div>
          </div>
        )}

        {/* Warning Messages */}
        {currentStatus.warningLevel && ['HIGH', 'CRITICAL'].includes(currentStatus.warningLevel) && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-800">
                  {currentStatus.warningLevel === 'CRITICAL' 
                    ? (showArabic ? 'تحذير حرج: أنت قريب من الحد الأقصى' : 'Critical Warning: Near Rate Limit')
                    : (showArabic ? 'تحذير: استخدام مرتفع' : 'Warning: High Usage')
                  }
                </p>
                <p className="text-xs text-orange-700">
                  {showArabic 
                    ? 'فكر في ترقية خطتك للحصول على حدود أعلى'
                    : 'Consider upgrading your plan for higher limits'
                  }
                </p>
                {onUpgradeClick && (
                  <button
                    onClick={onUpgradeClick}
                    className="text-xs text-orange-800 underline hover:text-orange-900"
                  >
                    {showArabic ? 'ترقية الآن' : 'Upgrade Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="pt-2 text-xs text-muted-foreground">
          {showArabic 
            ? 'يتم تحديث البيانات كل 30 ثانية. تتم إعادة تعيين الحدود يومياً في منتصف الليل (توقيت بغداد).'
            : 'Data updates every 30 seconds. Limits reset daily at midnight (Baghdad time).'
          }
        </div>
      </CardContent>
    </Card>
  );
}