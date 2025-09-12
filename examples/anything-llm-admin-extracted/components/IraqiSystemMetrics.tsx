/**
 * Iraqi System Metrics and Analytics Dashboard
 * Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Real-time Iraqi-specific system metrics
 * - Professional domain analytics
 * - Cultural compliance metrics
 * - Arabic content analytics
 * - Payment gateway performance (ZainCash, FastPay, NassWallet)
 * - Geographic usage patterns across Iraqi cities
 * - Performance optimization insights
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  MessageSquare,
  FileText,
  Building,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Globe,
  Clock,
  Shield,
  Zap,
  Database,
  Server,
  Wifi,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import {
  SystemMetrics,
  ProfessionalDomain,
  UserRole,
  IraqiOrganization
} from '../types/admin';

interface IraqiSystemMetricsProps {
  className?: string;
  showArabicLabels?: boolean;
  refreshInterval?: number;
}

interface ExtendedSystemMetrics extends SystemMetrics {
  // Geographic data
  cityUsage: Record<string, {
    users: number;
    conversations: number;
    growth: number;
  }>;
  
  // Payment analytics
  paymentGateways: Record<'zaincash' | 'fastpay' | 'nasswallet' | 'bank_transfer', {
    transactions: number;
    successRate: number;
    averageAmount: number;
    growth: number;
  }>;
  
  // Network performance by Iraqi ISPs
  ispPerformance: Record<string, {
    avgLatency: number;
    throughput: number;
    uptime: number;
  }>;
  
  // Content analytics
  contentMetrics: {
    totalMessages: number;
    arabicMessages: number;
    englishMessages: number;
    mixedLanguageMessages: number;
    dialectDistribution: Record<string, number>;
    professionalContentRatio: number;
  };
  
  // Cultural compliance trends
  complianceTrends: {
    timestamp: string;
    islamicCompliance: number;
    politicalNeutrality: number;
    culturalSensitivity: number;
  }[];
}

// Iraqi cities with Arabic names
const IRAQI_CITIES = {
  'Baghdad': 'بغداد',
  'Basra': 'البصرة',
  'Erbil': 'أربيل',
  'Mosul': 'الموصل',
  'Najaf': 'النجف',
  'Karbala': 'كربلاء',
  'Sulaymaniyah': 'السليمانية',
  'Duhok': 'دهوك',
  'Ramadi': 'الرمادي',
  'Fallujah': 'الفلوجة',
  'Tikrit': 'تكريت',
  'Samarra': 'سامراء'
};

// Color schemes for charts
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  warning: '#ef4444',
  info: '#6366f1',
  success: '#22c55e'
};

const DOMAIN_COLORS: Record<ProfessionalDomain, string> = {
  legal: '#3b82f6',
  medical: '#10b981',
  educational: '#8b5cf6',
  business: '#f59e0b',
  engineering: '#6b7280',
  government: '#06b6d4',
  general: '#64748b'
};

export const IraqiSystemMetrics: React.FC<IraqiSystemMetricsProps> = ({
  className,
  showArabicLabels = false,
  refreshInterval = 60000 // 1 minute
}) => {
  const [metrics, setMetrics] = useState<ExtendedSystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load system metrics
  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/metrics/system?range=${timeRange}`);
      const data = await response.json();
      
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh metrics
  useEffect(() => {
    loadMetrics();
    
    const interval = setInterval(loadMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [timeRange, refreshInterval]);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Get trend icon
  const getTrendIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  // Get health status color
  const getHealthColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">
          {showArabicLabels ? 'تحميل المقاييس...' : 'Loading metrics...'}
        </span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <p className="text-gray-600">
          {showArabicLabels ? 'فشل في تحميل المقاييس' : 'Failed to load metrics'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {showArabicLabels ? 'مقاييس النظام العراقي' : 'Iraqi System Metrics'}
          </h1>
          <p className="text-gray-600 mt-1">
            {showArabicLabels 
              ? `آخر تحديث: ${lastUpdated.toLocaleString('ar-IQ')}`
              : `Last updated: ${lastUpdated.toLocaleString()}`
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">{showArabicLabels ? 'ساعة واحدة' : '1 Hour'}</SelectItem>
              <SelectItem value="24h">{showArabicLabels ? '24 ساعة' : '24 Hours'}</SelectItem>
              <SelectItem value="7d">{showArabicLabels ? '7 أيام' : '7 Days'}</SelectItem>
              <SelectItem value="30d">{showArabicLabels ? '30 يوم' : '30 Days'}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadMetrics} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              {getTrendIcon(5.2)}
            </div>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalUsers)}</div>
            <div className="text-sm text-gray-600">
              {showArabicLabels ? 'إجمالي المستخدمين' : 'Total Users'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              {getTrendIcon(12.4)}
            </div>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalConversations)}</div>
            <div className="text-sm text-gray-600">
              {showArabicLabels ? 'المحادثات' : 'Conversations'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              {getTrendIcon(8.1)}
            </div>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalDocuments)}</div>
            <div className="text-sm text-gray-600">
              {showArabicLabels ? 'الوثائق' : 'Documents'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{metrics.culturalComplianceRate}%</div>
            <div className="text-sm text-gray-600">
              {showArabicLabels ? 'الامتثال الثقافي' : 'Cultural Compliance'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold">{metrics.arabicContentPercentage}%</div>
            <div className="text-sm text-gray-600">
              {showArabicLabels ? 'المحتوى العربي' : 'Arabic Content'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <div className={getHealthColor(metrics.averageResponseTime, { good: 200, warning: 500 })}>
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <div className="text-sm text-gray-600">
              {showArabicLabels ? 'زمن الاستجابة' : 'Response Time'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{showArabicLabels ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="geographic">{showArabicLabels ? 'جغرافي' : 'Geographic'}</TabsTrigger>
          <TabsTrigger value="domains">{showArabicLabels ? 'المجالات' : 'Domains'}</TabsTrigger>
          <TabsTrigger value="payments">{showArabicLabels ? 'المدفوعات' : 'Payments'}</TabsTrigger>
          <TabsTrigger value="performance">{showArabicLabels ? 'الأداء' : 'Performance'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{showArabicLabels ? 'نشاط المستخدمين' : 'User Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.complianceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="islamicCompliance"
                      stackId="1"
                      stroke={CHART_COLORS.success}
                      fill={CHART_COLORS.success}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cultural Compliance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>{showArabicLabels ? 'اتجاهات الامتثال' : 'Compliance Trends'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.complianceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="islamicCompliance"
                      stroke={CHART_COLORS.success}
                      name={showArabicLabels ? 'الامتثال الإسلامي' : 'Islamic Compliance'}
                    />
                    <Line
                      type="monotone"
                      dataKey="politicalNeutrality"
                      stroke={CHART_COLORS.info}
                      name={showArabicLabels ? 'الحياد السياسي' : 'Political Neutrality'}
                    />
                    <Line
                      type="monotone"
                      dataKey="culturalSensitivity"
                      stroke={CHART_COLORS.accent}
                      name={showArabicLabels ? 'الحساسية الثقافية' : 'Cultural Sensitivity'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* System Health Status */}
          <Card>
            <CardHeader>
              <CardTitle>{showArabicLabels ? 'صحة النظام' : 'System Health'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {showArabicLabels ? 'قاعدة البيانات' : 'Database'}
                    </span>
                    <Badge className={metrics.databaseHealth === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {metrics.databaseHealth}
                    </Badge>
                  </div>
                  <Progress value={metrics.databaseHealth === 'healthy' ? 100 : 50} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {showArabicLabels ? 'التخزين المؤقت' : 'Cache'}
                    </span>
                    <Badge className={metrics.cacheHealth === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {metrics.cacheHealth}
                    </Badge>
                  </div>
                  <Progress value={metrics.cacheHealth === 'healthy' ? 100 : 75} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {showArabicLabels ? 'استخدام التخزين' : 'Storage Usage'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {metrics.storageUsage.percentage}%
                    </span>
                  </div>
                  <Progress value={metrics.storageUsage.percentage} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* City Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{showArabicLabels ? 'الاستخدام حسب المدينة' : 'Usage by City'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(metrics.cityUsage).map(([city, data]) => ({
                    city: showArabicLabels ? IRAQI_CITIES[city as keyof typeof IRAQI_CITIES] || city : city,
                    users: data.users,
                    conversations: data.conversations
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill={CHART_COLORS.primary} name={showArabicLabels ? 'المستخدمون' : 'Users'} />
                    <Bar dataKey="conversations" fill={CHART_COLORS.secondary} name={showArabicLabels ? 'المحادثات' : 'Conversations'} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ISP Performance */}
            <Card>
              <CardHeader>
                <CardTitle>{showArabicLabels ? 'أداء مزودي الإنترنت' : 'ISP Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.ispPerformance).map(([isp, performance]) => (
                    <div key={isp} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{isp}</span>
                        <Badge className={performance.uptime > 99 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {performance.uptime}% {showArabicLabels ? 'وقت التشغيل' : 'uptime'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">
                            {showArabicLabels ? 'زمن الاستجابة:' : 'Latency:'}
                          </span>
                          <span className="ml-1 font-medium">{performance.avgLatency}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {showArabicLabels ? 'السرعة:' : 'Throughput:'}
                          </span>
                          <span className="ml-1 font-medium">{performance.throughput} Mbps</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Professional Domains Tab */}
        <TabsContent value="domains" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Usage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{showArabicLabels ? 'توزيع المجالات المهنية' : 'Professional Domain Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(metrics.professionalDomainUsage).map(([domain, data]) => ({
                        name: showArabicLabels ? getDomainArabicName(domain as ProfessionalDomain) : domain,
                        value: data.users,
                        fill: DOMAIN_COLORS[domain as ProfessionalDomain]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {Object.entries(metrics.professionalDomainUsage).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DOMAIN_COLORS[entry[0] as ProfessionalDomain]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Domain Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>{showArabicLabels ? 'أداء المجالات المهنية' : 'Domain Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.professionalDomainUsage).map(([domain, data]) => (
                    <div key={domain} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">
                          {showArabicLabels ? getDomainArabicName(domain as ProfessionalDomain) : domain}
                        </span>
                        <Badge className={data.complianceRate > 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {data.complianceRate}% {showArabicLabels ? 'امتثال' : 'compliance'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">
                            {showArabicLabels ? 'المستخدمون:' : 'Users:'}
                          </span>
                          <span className="ml-1 font-medium">{formatNumber(data.users)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {showArabicLabels ? 'المحادثات:' : 'Conversations:'}
                          </span>
                          <span className="ml-1 font-medium">{formatNumber(data.conversations)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {showArabicLabels ? 'الوثائق:' : 'Documents:'}
                          </span>
                          <span className="ml-1 font-medium">{formatNumber(data.documents)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.paymentGateways).map(([gateway, data]) => (
              <Card key={gateway}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    {getTrendIcon(data.growth)}
                  </div>
                  <div className="text-lg font-bold">{data.successRate}%</div>
                  <div className="text-sm text-gray-600 capitalize">{gateway}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatNumber(data.transactions)} {showArabicLabels ? 'معاملة' : 'transactions'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{showArabicLabels ? 'أداء بوابات الدفع' : 'Payment Gateway Performance'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(metrics.paymentGateways).map(([gateway, data]) => ({
                  gateway: gateway.toUpperCase(),
                  successRate: data.successRate,
                  transactions: data.transactions,
                  avgAmount: data.averageAmount
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gateway" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="successRate" fill={CHART_COLORS.success} name={showArabicLabels ? 'معدل النجاح' : 'Success Rate'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  <div className={getHealthColor(metrics.systemUptime, { good: 99.5, warning: 99 })}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{metrics.systemUptime}%</div>
                <div className="text-sm text-gray-600">
                  {showArabicLabels ? 'وقت التشغيل' : 'System Uptime'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div className={getHealthColor(1000 - metrics.averageResponseTime, { good: 800, warning: 500 })}>
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
                <div className="text-sm text-gray-600">
                  {showArabicLabels ? 'متوسط الاستجابة' : 'Avg Response'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  <div className={getHealthColor(100 - metrics.errorRate, { good: 99, warning: 95 })}>
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{metrics.errorRate}%</div>
                <div className="text-sm text-gray-600">
                  {showArabicLabels ? 'معدل الأخطاء' : 'Error Rate'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{formatNumber(metrics.apiCallsPerMinute)}</div>
                <div className="text-sm text-gray-600">
                  {showArabicLabels ? 'استدعاءات API/دقيقة' : 'API Calls/min'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
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
    general: 'عام'
  };
  return arabicNames[domain] || domain;
};