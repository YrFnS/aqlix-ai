/**
 * Cultural Compliance Monitoring Dashboard
 * Enhanced for Iraqi AI Chat System
 *
 * Features:
 * - Real-time Islamic compliance monitoring
 * - Political neutrality tracking
 * - Cultural sensitivity alerts
 * - Professional domain compliance
 * - Arabic content validation
 * - Automated compliance reporting
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Download,
  RefreshCw,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Globe,
  Star,
} from 'lucide-react';
import {
  ComplianceAlert,
  ComplianceReport,
  SystemMetrics,
  ProfessionalDomain,
  CulturalComplianceLevel,
} from '../types/admin';

interface ComplianceMonitoringDashboardProps {
  className?: string;
  refreshInterval?: number; // milliseconds
  showArabicLabels?: boolean;
}

interface ComplianceMetrics {
  overallScore: number;
  islamicCompliance: {
    score: number;
    violations: number;
    trend: 'up' | 'down' | 'stable';
  };
  politicalNeutrality: {
    score: number;
    alerts: number;
    trend: 'up' | 'down' | 'stable';
  };
  culturalSensitivity: {
    score: number;
    flags: number;
    trend: 'up' | 'down' | 'stable';
  };
  professionalDomains: Record<
    ProfessionalDomain,
    {
      score: number;
      issues: number;
    }
  >;
}

export const ComplianceMonitoringDashboard: React.FC<ComplianceMonitoringDashboardProps> = ({
  className,
  refreshInterval = 30000, // 30 seconds
  showArabicLabels = false,
}) => {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [recentReports, setRecentReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load compliance data
  const loadComplianceData = async () => {
    try {
      setLoading(true);

      // Simulate API calls - replace with actual API endpoints
      const [metricsResponse, alertsResponse, reportsResponse] = await Promise.all([
        fetch('/api/admin/compliance/metrics'),
        fetch('/api/admin/compliance/alerts?status=active'),
        fetch('/api/admin/compliance/reports?limit=5'),
      ]);

      const metricsData = await metricsResponse.json();
      const alertsData = await alertsResponse.json();
      const reportsData = await reportsResponse.json();

      setMetrics(metricsData);
      setAlerts(alertsData);
      setRecentReports(reportsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    loadComplianceData();

    const interval = setInterval(loadComplianceData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Generate compliance report
  const generateReport = async (type: ComplianceReport['reportType']) => {
    try {
      const response = await fetch('/api/admin/compliance/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        await loadComplianceData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  // Get severity color for alerts
  const getSeverityColor = (severity: ComplianceAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">
          {showArabicLabels ? 'تحميل بيانات الامتثال...' : 'Loading compliance data...'}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {showArabicLabels ? 'مراقبة الامتثال الثقافي' : 'Cultural Compliance Monitoring'}
          </h1>
          <p className="text-gray-600 mt-1">
            {showArabicLabels
              ? `آخر تحديث: ${lastUpdated.toLocaleString('ar-IQ')}`
              : `Last updated: ${lastUpdated.toLocaleString()}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadComplianceData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {showArabicLabels ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => generateReport('cultural')}>
            <Download className="w-4 h-4 mr-2" />
            {showArabicLabels ? 'إنشاء تقرير' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Overall Compliance Score */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {showArabicLabels ? 'النتيجة الإجمالية للامتثال' : 'Overall Compliance Score'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(metrics.overallScore)}`}>
                {metrics.overallScore}%
              </div>
              <Progress value={metrics.overallScore} className="mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div
                    className={`text-xl font-semibold ${getScoreColor(metrics.islamicCompliance.score)}`}
                  >
                    {metrics.islamicCompliance.score}%
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    {getTrendIcon(metrics.islamicCompliance.trend)}
                    {showArabicLabels ? 'الامتثال الإسلامي' : 'Islamic Compliance'}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-xl font-semibold ${getScoreColor(metrics.politicalNeutrality.score)}`}
                  >
                    {metrics.politicalNeutrality.score}%
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    {getTrendIcon(metrics.politicalNeutrality.trend)}
                    {showArabicLabels ? 'الحياد السياسي' : 'Political Neutrality'}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-xl font-semibold ${getScoreColor(metrics.culturalSensitivity.score)}`}
                  >
                    {metrics.culturalSensitivity.score}%
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    {getTrendIcon(metrics.culturalSensitivity.trend)}
                    {showArabicLabels ? 'الحساسية الثقافية' : 'Cultural Sensitivity'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {showArabicLabels ? 'التنبيهات النشطة' : 'Active Alerts'}
              <Badge variant="outline">{alerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{alert.title}</div>
                        <div className="text-sm mt-1">{alert.description}</div>
                        <div className="text-xs mt-2 text-gray-600">
                          {showArabicLabels ? 'المتأثرون:' : 'Affected:'} {alert.affectedUsers}{' '}
                          users, {alert.affectedContent} content items
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge variant="outline" className="capitalize">
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {alert.type}
                        </Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
              {alerts.length > 5 && (
                <Button variant="outline" className="w-full">
                  {showArabicLabels
                    ? `عرض جميع ${alerts.length} التنبيهات`
                    : `View All ${alerts.length} Alerts`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Domain Compliance */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {showArabicLabels ? 'امتثال المجالات المهنية' : 'Professional Domain Compliance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(metrics.professionalDomains).map(([domain, data]) => (
                <Card key={domain} className="p-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${getScoreColor(data.score)}`}>
                      {data.score}%
                    </div>
                    <div className="text-sm text-gray-600 capitalize mb-2">
                      {showArabicLabels
                        ? getDomainArabicName(domain as ProfessionalDomain)
                        : domain}
                    </div>
                    {data.issues > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {data.issues} {showArabicLabels ? 'مشاكل' : 'issues'}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Compliance Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {showArabicLabels ? 'التقارير الأخيرة' : 'Recent Reports'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.map(report => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-semibold capitalize">
                      {report.reportType} Compliance Report
                    </div>
                    <div className="text-sm text-gray-600">
                      {showArabicLabels ? 'تم الإنشاء:' : 'Generated:'}{' '}
                      {report.generatedAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-sm font-medium ${getScoreColor(report.overallScore)}`}>
                        {showArabicLabels ? 'النتيجة:' : 'Score:'} {report.overallScore}%
                      </span>
                      {report.violations > 0 && (
                        <span className="text-sm text-red-600">
                          {report.violations} {showArabicLabels ? 'انتهاكات' : 'violations'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {report.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {showArabicLabels ? 'لا توجد تقارير متاحة' : 'No reports available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {showArabicLabels ? 'إجراءات سريعة' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => generateReport('islamic')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <Star className="w-6 h-6 mb-2" />
              <span className="text-sm">
                {showArabicLabels ? 'تقرير إسلامي' : 'Islamic Report'}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => generateReport('political')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <Globe className="w-6 h-6 mb-2" />
              <span className="text-sm">
                {showArabicLabels ? 'تقرير سياسي' : 'Political Report'}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => generateReport('cultural')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">
                {showArabicLabels ? 'تقرير ثقافي' : 'Cultural Report'}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => generateReport('professional')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <MessageSquare className="w-6 h-6 mb-2" />
              <span className="text-sm">
                {showArabicLabels ? 'تقرير مهني' : 'Professional Report'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get Arabic domain names
const getDomainArabicName = (domain: ProfessionalDomain): string => {
  const arabicNames: Record<ProfessionalDomain, string> = {
    legal: 'قانوني',
    medical: 'طبي',
    educational: 'تعليمي',
    business: 'تجاري',
    engineering: 'هندسي',
    government: 'حكومي',
    general: 'عام',
  };
  return arabicNames[domain] || domain;
};
