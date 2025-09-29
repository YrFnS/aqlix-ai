/**
 * Iraqi AI Admin Dashboard - Main Component
 * Enhanced admin interface with Arabic-first design and cultural compliance
 *
 * Features:
 * - RTL/LTR adaptive layout
 * - Iraqi professional role management
 * - Cultural compliance monitoring
 * - Real-time system metrics
 * - Arabic/English bilingual interface
 */

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  Building2,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Settings,
  Download,
  RefreshCw,
  Eye,
  UserPlus,
  Building,
  Bell,
  Calendar,
  BarChart3,
  Map,
  Languages,
} from 'lucide-react';

import {
  SystemMetrics,
  UserMetrics,
  OrganizationMetrics,
  ComplianceMetrics,
  CulturalMetrics,
  IraqiUser,
  IraqiOrganization,
  DashboardWidget,
} from '../types/admin';
import { useAdminData } from '../hooks/useAdminData';
import UserManagement from './UserManagement';
import OrganizationManagement from './OrganizationManagement';
import ComplianceMonitor from './ComplianceMonitor';
import SystemHealth from './SystemHealth';
import AuditLogs from './AuditLogs';
import MetricCard from './MetricCard';
import LoadingSpinner from './LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminDashboardProps {
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
}

const IraqiAdminDashboard: React.FC<AdminDashboardProps> = ({
  language = 'ar',
  onLanguageChange,
}) => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [isRTL, setIsRTL] = useState(language === 'ar');
  const [refreshing, setRefreshing] = useState(false);

  // Custom hook for admin data
  const {
    systemMetrics,
    userMetrics,
    organizationMetrics,
    complianceMetrics,
    culturalMetrics,
    recentUsers,
    recentOrganizations,
    loading,
    error,
    refreshData,
  } = useAdminData(timeRange);

  // Update RTL when language changes
  useEffect(() => {
    setIsRTL(language === 'ar');
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translations
  const t = {
    ar: {
      dashboard: 'لوحة إدارة النظام العراقي',
      overview: 'نظرة عامة',
      users: 'إدارة المستخدمين',
      organizations: 'إدارة المؤسسات',
      compliance: 'مراقبة الالتزام الثقافي',
      system: 'صحة النظام',
      audit: 'سجلات التدقيق',
      settings: 'إعدادات',
      totalUsers: 'إجمالي المستخدمين',
      activeUsers: 'المستخدمون النشطون',
      totalOrganizations: 'إجمالي المؤسسات',
      complianceScore: 'درجة الالتزام',
      systemUptime: 'وقت تشغيل النظام',
      responseTime: 'زمن الاستجابة',
      errorRate: 'معدل الأخطاء',
      culturalCompliance: 'الالتزام الثقافي',
      islamicCompliance: 'الالتزام الإسلامي',
      arabicContent: 'المحتوى العربي',
      professionalDomains: 'المجالات المهنية',
      recentActivity: 'النشاط الأخير',
      newUsers: 'مستخدمون جدد',
      systemHealth: 'صحة النظام',
      refresh: 'تحديث',
      export: 'تصدير',
      viewAll: 'عرض الكل',
      healthy: 'سليم',
      warning: 'تحذير',
      critical: 'حرج',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      retry: 'إعادة المحاولة',
      lawyers: 'المحامون',
      doctors: 'الأطباء',
      teachers: 'المعلمون',
      engineers: 'المهندسون',
      administrators: 'الإداريون',
      managers: 'المدراء',
      analysts: 'المحللون',
      government: 'حكومي',
      ministry: 'وزارة',
      university: 'جامعة',
      hospital: 'مستشفى',
      lawFirm: 'مكتب محاماة',
      engineeringFirm: 'مكتب هندسي',
      ngo: 'منظمة غير ربحية',
      privateCompany: 'شركة خاصة',
      school: 'مدرسة',
      today: 'اليوم',
      thisWeek: 'هذا الأسبوع',
      thisMonth: 'هذا الشهر',
      thisQuarter: 'هذا الربع',
    },
    en: {
      dashboard: 'Iraqi AI Admin Dashboard',
      overview: 'Overview',
      users: 'User Management',
      organizations: 'Organization Management',
      compliance: 'Cultural Compliance',
      system: 'System Health',
      audit: 'Audit Logs',
      settings: 'Settings',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      totalOrganizations: 'Total Organizations',
      complianceScore: 'Compliance Score',
      systemUptime: 'System Uptime',
      responseTime: 'Response Time',
      errorRate: 'Error Rate',
      culturalCompliance: 'Cultural Compliance',
      islamicCompliance: 'Islamic Compliance',
      arabicContent: 'Arabic Content',
      professionalDomains: 'Professional Domains',
      recentActivity: 'Recent Activity',
      newUsers: 'New Users',
      systemHealth: 'System Health',
      refresh: 'Refresh',
      export: 'Export',
      viewAll: 'View All',
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      lawyers: 'Lawyers',
      doctors: 'Doctors',
      teachers: 'Teachers',
      engineers: 'Engineers',
      administrators: 'Administrators',
      managers: 'Managers',
      analysts: 'Analysts',
      government: 'Government',
      ministry: 'Ministry',
      university: 'University',
      hospital: 'Hospital',
      lawFirm: 'Law Firm',
      engineeringFirm: 'Engineering Firm',
      ngo: 'NGO',
      privateCompany: 'Private Company',
      school: 'School',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisQuarter: 'This Quarter',
    },
  };

  const translations = t[language];

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: translations.overview, icon: BarChart3 },
    { id: 'users', label: translations.users, icon: Users },
    { id: 'organizations', label: translations.organizations, icon: Building2 },
    { id: 'compliance', label: translations.compliance, icon: Shield },
    { id: 'system', label: translations.system, icon: Activity },
    { id: 'audit', label: translations.audit, icon: Eye },
    { id: 'settings', label: translations.settings, icon: Settings },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" message={translations.loading} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{translations.error}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {translations.retry}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Title */}
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 ml-2" />
              <h1 className="text-xl font-bold text-gray-900">{translations.dashboard}</h1>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">{translations.today}</option>
                <option value="7d">{translations.thisWeek}</option>
                <option value="30d">{translations.thisMonth}</option>
                <option value="90d">{translations.thisQuarter}</option>
              </select>

              {/* Language Toggle */}
              <button
                onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Languages className="h-4 w-4 mr-2" />
                {language.toUpperCase()}
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {translations.refresh}
              </button>

              {/* Export Button */}
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                {translations.export}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={translations.totalUsers}
                value={systemMetrics?.overview.totalUsers || 0}
                change={userMetrics?.userGrowthRate || 0}
                icon={Users}
                color="blue"
                isRTL={isRTL}
              />
              <MetricCard
                title={translations.activeUsers}
                value={systemMetrics?.overview.activeUsers || 0}
                change={userMetrics?.userRetentionRate || 0}
                icon={Activity}
                color="green"
                isRTL={isRTL}
              />
              <MetricCard
                title={translations.totalOrganizations}
                value={systemMetrics?.overview.totalOrganizations || 0}
                change={organizationMetrics?.organizationGrowthRate || 0}
                icon={Building2}
                color="purple"
                isRTL={isRTL}
              />
              <MetricCard
                title={translations.complianceScore}
                value={`${Math.round(complianceMetrics?.overallComplianceScore || 0)}%`}
                change={0}
                icon={Shield}
                color="orange"
                isRTL={isRTL}
              />
            </div>

            {/* Cultural Compliance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MetricCard
                title={translations.culturalCompliance}
                value={`${Math.round(complianceMetrics?.culturalAppropriateness || 0)}%`}
                change={0}
                icon={Globe}
                color="indigo"
                isRTL={isRTL}
              />
              <MetricCard
                title={translations.islamicCompliance}
                value={`${Math.round(complianceMetrics?.islamicComplianceRate || 0)}%`}
                change={0}
                icon={CheckCircle}
                color="emerald"
                isRTL={isRTL}
              />
              <MetricCard
                title={translations.arabicContent}
                value={`${Math.round(culturalMetrics?.arabicContentPercentage || 0)}%`}
                change={0}
                icon={Languages}
                color="cyan"
                isRTL={isRTL}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.newUsers}</h3>
                <div className="h-64">
                  {/* User growth line chart would go here */}
                  <div className="flex items-center justify-center h-full text-gray-500">
                    User Growth Chart
                  </div>
                </div>
              </div>

              {/* Professional Domain Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {translations.professionalDomains}
                </h3>
                <div className="h-64">
                  {/* Professional domain pie chart would go here */}
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Professional Domain Chart
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{translations.recentActivity}</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  {translations.viewAll}
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentUsers?.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString(
                          language === 'ar' ? 'ar-IQ' : 'en-US'
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && <UserManagement language={language} isRTL={isRTL} />}

        {/* Organization Management Tab */}
        {activeTab === 'organizations' && (
          <OrganizationManagement language={language} isRTL={isRTL} />
        )}

        {/* Compliance Monitoring Tab */}
        {activeTab === 'compliance' && (
          <ComplianceMonitor
            language={language}
            isRTL={isRTL}
            metrics={complianceMetrics}
            culturalMetrics={culturalMetrics}
          />
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && (
          <SystemHealth language={language} isRTL={isRTL} metrics={systemMetrics} />
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && <AuditLogs language={language} isRTL={isRTL} />}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.settings}</h3>
            <p className="text-gray-500">Settings panel coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default IraqiAdminDashboard;
