/**
 * Iraqi AI Compliance Monitor Component
 * Cultural and Islamic compliance monitoring with real-time metrics
 *
 * Features:
 * - Real-time compliance scoring
 * - Islamic values monitoring
 * - Cultural appropriateness tracking
 * - Professional standards validation
 * - Arabic content analysis
 * - Violation reporting and resolution
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Clock,
  Users,
  Building2,
  Globe,
  Languages,
  BookOpen,
  Star,
  Heart,
  Moon,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

import {
  ComplianceMetrics,
  CulturalMetrics,
  IraqiProfessionalRole,
  OrganizationType,
  ComplianceLevel,
} from '../types/admin';
import MetricCard from './MetricCard';
import LoadingSpinner from './LoadingSpinner';

interface ComplianceMonitorProps {
  language: 'ar' | 'en';
  isRTL: boolean;
  metrics?: ComplianceMetrics;
  culturalMetrics?: CulturalMetrics;
}

const ComplianceMonitor: React.FC<ComplianceMonitorProps> = ({
  language,
  isRTL,
  metrics,
  culturalMetrics,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'violations' | 'pending' | 'resolved'
  >('all');
  const [violationDetails, setViolationDetails] = useState([]);
  const [complianceTrend, setComplianceTrend] = useState([]);

  // Translations
  const t = {
    ar: {
      complianceMonitoring: 'مراقبة الالتزام الثقافي',
      overallCompliance: 'الالتزام العام',
      islamicCompliance: 'الالتزام الإسلامي',
      culturalAppropriateness: 'الملاءمة الثقافية',
      professionalStandards: 'المعايير المهنية',
      arabicContentCompliance: 'التزام المحتوى العربي',
      rtlInterfaceUsage: 'استخدام واجهة من اليمين لليسار',
      complianceScore: 'درجة الالتزام',
      excellent: 'ممتاز',
      good: 'جيد',
      acceptable: 'مقبول',
      needsImprovement: 'يحتاج تحسين',
      critical: 'حرج',
      complianceTrend: 'اتجاه الالتزام',
      recentViolations: 'المخالفات الحديثة',
      resolvedViolations: 'المخالفات المحلولة',
      pendingReviews: 'المراجعات المعلقة',
      violationType: 'نوع المخالفة',
      severity: 'الخطورة',
      status: 'الحالة',
      dateReported: 'تاريخ الإبلاغ',
      dateResolved: 'تاريخ الحل',
      actions: 'الإجراءات',
      viewDetails: 'عرض التفاصيل',
      resolveViolation: 'حل المخالفة',
      markResolved: 'تمييز كمحلول',
      exportReport: 'تصدير التقرير',
      refresh: 'تحديث',
      filter: 'تصفية',
      search: 'البحث',
      professionalDomains: 'المجالات المهنية',
      organizationTypes: 'أنواع المؤسسات',
      governorateCompliance: 'التزام المحافظات',
      contentFiltering: 'فلترة المحتوى',
      userBehavior: 'سلوك المستخدمين',
      systemHealth: 'صحة النظام',
      recommendations: 'التوصيات',
      complianceByRole: 'الالتزام حسب الدور',
      complianceByOrganization: 'الالتزام حسب المؤسسة',
      monthlyTrend: 'الاتجاه الشهري',
      weeklyTrend: 'الاتجاه الأسبوعي',
      dailyTrend: 'الاتجاه اليومي',
      today: 'اليوم',
      thisWeek: 'هذا الأسبوع',
      thisMonth: 'هذا الشهر',
      thisQuarter: 'هذا الربع',
      allViolations: 'جميع المخالفات',
      activeViolations: 'المخالفات النشطة',
      resolvedViolations: 'المخالفات المحلولة',
      pendingViolations: 'المخالفات المعلقة',
      high: 'عالي',
      medium: 'متوسط',
      low: 'منخفض',
      open: 'مفتوح',
      investigating: 'قيد التحقيق',
      resolved: 'محلول',
      falsePositive: 'إيجابي كاذب',
      contentViolation: 'مخالفة محتوى',
      behaviorViolation: 'مخالفة سلوك',
      languageViolation: 'مخالفة لغوية',
      culturalViolation: 'مخالفة ثقافية',
      religiousViolation: 'مخالفة دينية',
      professionalViolation: 'مخالفة مهنية',
    },
    en: {
      complianceMonitoring: 'Cultural Compliance Monitoring',
      overallCompliance: 'Overall Compliance',
      islamicCompliance: 'Islamic Compliance',
      culturalAppropriateness: 'Cultural Appropriateness',
      professionalStandards: 'Professional Standards',
      arabicContentCompliance: 'Arabic Content Compliance',
      rtlInterfaceUsage: 'RTL Interface Usage',
      complianceScore: 'Compliance Score',
      excellent: 'Excellent',
      good: 'Good',
      acceptable: 'Acceptable',
      needsImprovement: 'Needs Improvement',
      critical: 'Critical',
      complianceTrend: 'Compliance Trend',
      recentViolations: 'Recent Violations',
      resolvedViolations: 'Resolved Violations',
      pendingReviews: 'Pending Reviews',
      violationType: 'Violation Type',
      severity: 'Severity',
      status: 'Status',
      dateReported: 'Date Reported',
      dateResolved: 'Date Resolved',
      actions: 'Actions',
      viewDetails: 'View Details',
      resolveViolation: 'Resolve Violation',
      markResolved: 'Mark Resolved',
      exportReport: 'Export Report',
      refresh: 'Refresh',
      filter: 'Filter',
      search: 'Search',
      professionalDomains: 'Professional Domains',
      organizationTypes: 'Organization Types',
      governorateCompliance: 'Governorate Compliance',
      contentFiltering: 'Content Filtering',
      userBehavior: 'User Behavior',
      systemHealth: 'System Health',
      recommendations: 'Recommendations',
      complianceByRole: 'Compliance by Role',
      complianceByOrganization: 'Compliance by Organization',
      monthlyTrend: 'Monthly Trend',
      weeklyTrend: 'Weekly Trend',
      dailyTrend: 'Daily Trend',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisQuarter: 'This Quarter',
      allViolations: 'All Violations',
      activeViolations: 'Active Violations',
      resolvedViolations: 'Resolved Violations',
      pendingViolations: 'Pending Violations',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      open: 'Open',
      investigating: 'Investigating',
      resolved: 'Resolved',
      falsePositive: 'False Positive',
      contentViolation: 'Content Violation',
      behaviorViolation: 'Behavior Violation',
      languageViolation: 'Language Violation',
      culturalViolation: 'Cultural Violation',
      religiousViolation: 'Religious Violation',
      professionalViolation: 'Professional Violation',
    },
  };

  const translations = t[language];

  // Get compliance status color and label
  const getComplianceStatus = (score: number) => {
    if (score >= 95)
      return {
        label: translations.excellent,
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      };
    if (score >= 85)
      return {
        label: translations.good,
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      };
    if (score >= 70)
      return {
        label: translations.acceptable,
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      };
    if (score >= 50)
      return {
        label: translations.needsImprovement,
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
      };
    return {
      label: translations.critical,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    };
  };

  // Render severity badge
  const renderSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    const severityConfig = {
      low: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      high: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
      critical: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {translations[severity]}
      </span>
    );
  };

  // Render status badge
  const renderStatusBadge = (status: 'open' | 'investigating' | 'resolved' | 'false_positive') => {
    const statusConfig = {
      open: { color: 'bg-red-100 text-red-800', icon: XCircle },
      investigating: { color: 'bg-yellow-100 text-yellow-800', icon: Eye },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      false_positive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {translations[status.replace('_', '').toLowerCase() as keyof typeof translations] || status}
      </span>
    );
  };

  // Mock violation data (would come from API)
  const mockViolations = [
    {
      id: '1',
      type: 'cultural_violation',
      severity: 'high' as const,
      status: 'investigating' as const,
      description: 'Content contains culturally inappropriate references',
      reportedDate: '2025-01-09T10:30:00Z',
      resolvedDate: null,
      userId: 'user-123',
      organizationId: 'org-456',
    },
    {
      id: '2',
      type: 'language_violation',
      severity: 'medium' as const,
      status: 'resolved' as const,
      description: 'Mixed Arabic-English text formatting issues',
      reportedDate: '2025-01-08T14:20:00Z',
      resolvedDate: '2025-01-08T16:45:00Z',
      userId: 'user-789',
      organizationId: 'org-123',
    },
    {
      id: '3',
      type: 'professional_violation',
      severity: 'low' as const,
      status: 'open' as const,
      description: 'Professional terminology inconsistency',
      reportedDate: '2025-01-09T09:15:00Z',
      resolvedDate: null,
      userId: 'user-456',
      organizationId: 'org-789',
    },
  ];

  // Mock compliance trend data
  const complianceTrendData = {
    labels:
      selectedTimeRange === '24h'
        ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        : selectedTimeRange === '7d'
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : selectedTimeRange === '30d'
            ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            : ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: translations.overallCompliance,
        data:
          selectedTimeRange === '24h'
            ? [88, 89, 91, 93, 92, 94]
            : selectedTimeRange === '7d'
              ? [87, 88, 90, 89, 91, 93, 94]
              : selectedTimeRange === '30d'
                ? [85, 88, 91, 94]
                : [82, 87, 94],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: translations.islamicCompliance,
        data:
          selectedTimeRange === '24h'
            ? [92, 93, 94, 95, 94, 96]
            : selectedTimeRange === '7d'
              ? [91, 92, 93, 92, 94, 95, 96]
              : selectedTimeRange === '30d'
                ? [89, 92, 94, 96]
                : [86, 91, 96],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: translations.culturalAppropriateness,
        data:
          selectedTimeRange === '24h'
            ? [85, 87, 88, 90, 89, 91]
            : selectedTimeRange === '7d'
              ? [84, 85, 87, 86, 88, 90, 91]
              : selectedTimeRange === '30d'
                ? [82, 85, 88, 91]
                : [79, 84, 91],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Professional role compliance data
  const professionalRoleData = {
    labels: [
      translations.lawyer || 'Lawyers',
      translations.doctor || 'Doctors',
      translations.teacher || 'Teachers',
      translations.engineer || 'Engineers',
      translations.administrator || 'Administrators',
    ],
    datasets: [
      {
        data: [95, 92, 89, 91, 87],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Cultural metrics radar chart
  const culturalRadarData = {
    labels: [
      translations.arabicContentCompliance,
      translations.rtlInterfaceUsage,
      translations.islamicCompliance,
      translations.culturalAppropriateness,
      translations.professionalStandards,
    ],
    datasets: [
      {
        label: translations.complianceScore,
        data: [
          culturalMetrics?.arabicContentPercentage || 85,
          culturalMetrics?.rtlInterfaceUsageRate * 100 || 92,
          metrics?.islamicComplianceRate || 96,
          metrics?.culturalAppropriateness || 88,
          metrics?.professionalStandardsAdherence || 91,
        ],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" message={translations.complianceMonitoring} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{translations.complianceMonitoring}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor cultural and Islamic compliance across the platform
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={e => setSelectedTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">{translations.today}</option>
            <option value="7d">{translations.thisWeek}</option>
            <option value="30d">{translations.thisMonth}</option>
            <option value="90d">{translations.thisQuarter}</option>
          </select>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            {translations.exportReport}
          </button>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            {translations.refresh}
          </button>
        </div>
      </div>

      {/* Key Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={translations.overallCompliance}
          value={`${Math.round(metrics?.overallComplianceScore || 91)}%`}
          change={2.5}
          icon={Shield}
          color="blue"
          isRTL={isRTL}
          status={getComplianceStatus(metrics?.overallComplianceScore || 91)}
        />

        <MetricCard
          title={translations.islamicCompliance}
          value={`${Math.round(metrics?.islamicComplianceRate || 96)}%`}
          change={1.8}
          icon={Heart}
          color="green"
          isRTL={isRTL}
          status={getComplianceStatus(metrics?.islamicComplianceRate || 96)}
        />

        <MetricCard
          title={translations.culturalAppropriateness}
          value={`${Math.round(metrics?.culturalAppropriateness || 88)}%`}
          change={-0.5}
          icon={Globe}
          color="purple"
          isRTL={isRTL}
          status={getComplianceStatus(metrics?.culturalAppropriateness || 88)}
        />

        <MetricCard
          title={translations.professionalStandards}
          value={`${Math.round(metrics?.professionalStandardsAdherence || 92)}%`}
          change={3.2}
          icon={Star}
          color="orange"
          isRTL={isRTL}
          status={getComplianceStatus(metrics?.professionalStandardsAdherence || 92)}
        />
      </div>

      {/* Violations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title={translations.recentViolations}
          value={metrics?.violationsCount || 12}
          change={-15}
          icon={AlertTriangle}
          color="red"
          isRTL={isRTL}
        />

        <MetricCard
          title={translations.resolvedViolations}
          value={metrics?.resolvedViolationsCount || 8}
          change={25}
          icon={CheckCircle}
          color="green"
          isRTL={isRTL}
        />

        <MetricCard
          title={translations.pendingReviews}
          value={metrics?.pendingReviewsCount || 4}
          change={-30}
          icon={Clock}
          color="yellow"
          isRTL={isRTL}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{translations.complianceTrend}</h3>
          </div>
          <div className="h-64">
            <Line
              data={complianceTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 70,
                    max: 100,
                    ticks: {
                      callback: function (value) {
                        return value + '%';
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Cultural Metrics Radar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {translations.culturalAppropriateness}
            </h3>
          </div>
          <div className="h-64">
            <Radar
              data={culturalRadarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: {
                      display: false,
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    angleLines: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Professional Role Compliance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{translations.complianceByRole}</h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={professionalRoleData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Arabic Content Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {translations.arabicContentCompliance}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{translations.arabicContentCompliance}</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(culturalMetrics?.arabicContentPercentage || 85)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${culturalMetrics?.arabicContentPercentage || 85}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{translations.rtlInterfaceUsage}</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((culturalMetrics?.rtlInterfaceUsageRate || 0.92) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(culturalMetrics?.rtlInterfaceUsageRate || 0.92) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mixed Language Content</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(culturalMetrics?.mixedLanguageContentPercentage || 15)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${culturalMetrics?.mixedLanguageContentPercentage || 15}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Violations Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{translations.recentViolations}</h3>

          <div className="flex items-center space-x-2">
            <select
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">{translations.allViolations}</option>
              <option value="violations">{translations.activeViolations}</option>
              <option value="resolved">{translations.resolvedViolations}</option>
              <option value="pending">{translations.pendingViolations}</option>
            </select>

            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.violationType}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.severity}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.dateReported}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.dateResolved}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.actions}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {mockViolations.map(violation => (
                <tr key={violation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {translations[violation.type as keyof typeof translations] || violation.type}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {violation.description}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderSeverityBadge(violation.severity)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(violation.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(violation.reportedDate).toLocaleDateString(
                      language === 'ar' ? 'ar-IQ' : 'en-US'
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {violation.resolvedDate
                      ? new Date(violation.resolvedDate).toLocaleDateString(
                          language === 'ar' ? 'ar-IQ' : 'en-US'
                        )
                      : '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>

                      {violation.status !== 'resolved' && (
                        <button className="text-green-600 hover:text-green-900">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.recommendations}</h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Improve Arabic Content Processing</p>
              <p className="text-sm text-gray-600">
                Consider implementing advanced Arabic NLP to better handle dialect variations and
                mixed-language content.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Enhance Cultural Filtering</p>
              <p className="text-sm text-gray-600">
                Implement more sophisticated cultural appropriateness detection for professional
                contexts.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">User Training Programs</p>
              <p className="text-sm text-gray-600">
                Develop cultural awareness training for users with lower compliance scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMonitor;
