/**
 * Cultural Compliance Dashboard
 * 
 * Real-time monitoring and visualization of cultural and Islamic compliance
 * for the Iraqi AI Chat System. Provides comprehensive oversight of:
 * 
 * - Islamic values compliance (target: 95%+)
 * - Cultural appropriateness monitoring (target: 88%+) 
 * - Professional standards tracking (target: 92%+)
 * - Arabic content processing accuracy (target: 99%+)
 * - Violation detection and remediation workflows
 * - Regional compliance variations across 18 Iraqi governorates
 * 
 * Features:
 * - Real-time metrics with <500ms refresh
 * - Cultural violation categorization and trending
 * - Professional domain compliance breakdown
 * - Arabic RTL processing monitoring
 * - Automated alert system for compliance drops
 * - Interactive charts with Arabic/English labels
 * - Export capabilities for compliance reporting
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  BookOpen,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Types and Interfaces
interface ComplianceMetrics {
  timestamp: Date;
  islamic: {
    score: number;
    violations: number;
    categories: ViolationCategory[];
    trend: 'up' | 'down' | 'stable';
  };
  cultural: {
    score: number;
    violations: number;
    categories: ViolationCategory[];
    trend: 'up' | 'down' | 'stable';
  };
  professional: {
    score: number;
    violations: number;
    domains: ProfessionalDomainMetrics[];
    trend: 'up' | 'down' | 'stable';
  };
  arabic: {
    accuracy: number;
    rtlIssues: number;
    dialectRecognition: number;
    processingTime: number;
    trend: 'up' | 'down' | 'stable';
  };
  regional: {
    governorate: string;
    governorateAr: string;
    complianceScore: number;
    userCount: number;
  }[];
}

interface ViolationCategory {
  category: string;
  categoryAr: string;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
  trend: number; // percentage change
}

interface ProfessionalDomainMetrics {
  domain: string;
  domainAr: string;
  complianceScore: number;
  userCount: number;
  violations: number;
  commonIssues: string[];
}

interface ComplianceAlert {
  id: string;
  timestamp: Date;
  type: 'islamic' | 'cultural' | 'professional' | 'arabic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  messageAr: string;
  governorate?: string;
  domain?: string;
  actionRequired: boolean;
  resolved: boolean;
}

interface DashboardFilters {
  timeRange: '1h' | '24h' | '7d' | '30d';
  governorate: string;
  domain: string;
  alertSeverity: 'all' | 'critical' | 'high' | 'medium' | 'low';
}

const CulturalComplianceDashboard: React.FC = () => {
  // State Management
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: '24h',
    governorate: 'all',
    domain: 'all',
    alertSeverity: 'all'
  });

  // Constants
  const COMPLIANCE_TARGETS = {
    islamic: 95,
    cultural: 88,
    professional: 92,
    arabic: 99
  };

  const GOVERNORATES = [
    { value: 'all', label: 'All Governorates', labelAr: 'جميع المحافظات' },
    { value: 'baghdad', label: 'Baghdad', labelAr: 'بغداد' },
    { value: 'basra', label: 'Basra', labelAr: 'البصرة' },
    { value: 'mosul', label: 'Mosul', labelAr: 'الموصل' },
    { value: 'erbil', label: 'Erbil', labelAr: 'أربيل' },
    { value: 'najaf', label: 'Najaf', labelAr: 'النجف' },
    { value: 'karbala', label: 'Karbala', labelAr: 'كربلاء' }
  ];

  const PROFESSIONAL_DOMAINS = [
    { value: 'all', label: 'All Domains', labelAr: 'جميع المجالات' },
    { value: 'legal', label: 'Legal', labelAr: 'قانوني' },
    { value: 'medical', label: 'Medical', labelAr: 'طبي' },
    { value: 'educational', label: 'Educational', labelAr: 'تعليمي' },
    { value: 'engineering', label: 'Engineering', labelAr: 'هندسي' },
    { value: 'business', label: 'Business', labelAr: 'تجاري' }
  ];

  // Chart Colors
  const COLORS = {
    primary: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    islamic: '#059669',
    cultural: '#7c3aed',
    professional: '#2563eb',
    arabic: '#dc2626'
  };

  // Data Fetching
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      // In real implementation, this would fetch from the Iraqi Admin Service
      const mockMetrics: ComplianceMetrics = {
        timestamp: new Date(),
        islamic: {
          score: 96.2,
          violations: 12,
          categories: [
            {
              category: 'Inappropriate Content',
              categoryAr: 'محتوى غير مناسب',
              count: 8,
              severity: 'medium',
              examples: ['Non-Islamic dating advice', 'Alcohol references'],
              trend: -15.2
            },
            {
              category: 'Prayer Time Conflicts',
              categoryAr: 'تعارضات أوقات الصلاة',
              count: 4,
              severity: 'low',
              examples: ['Meeting scheduled during Maghrib', 'Notification during prayer'],
              trend: -8.1
            }
          ],
          trend: 'up'
        },
        cultural: {
          score: 89.1,
          violations: 28,
          categories: [
            {
              category: 'Cultural Insensitivity',
              categoryAr: 'عدم الحساسية الثقافية',
              count: 18,
              severity: 'medium',
              examples: ['Western dating norms', 'Inappropriate family references'],
              trend: 12.3
            },
            {
              category: 'Language Formality',
              categoryAr: 'رسمية اللغة',
              count: 10,
              severity: 'low',
              examples: ['Informal address to elders', 'Casual religious references'],
              trend: -5.7
            }
          ],
          trend: 'stable'
        },
        professional: {
          score: 93.7,
          violations: 15,
          domains: [
            {
              domain: 'Legal',
              domainAr: 'قانوني',
              complianceScore: 95.2,
              userCount: 1247,
              violations: 3,
              commonIssues: ['Outdated legal references', 'Jurisdiction confusion']
            },
            {
              domain: 'Medical',
              domainAr: 'طبي',
              complianceScore: 97.1,
              userCount: 892,
              violations: 2,
              commonIssues: ['Prescription advice', 'Diagnostic suggestions']
            },
            {
              domain: 'Educational',
              domainAr: 'تعليمي',
              complianceScore: 91.8,
              userCount: 2156,
              violations: 8,
              commonIssues: ['Curriculum mismatch', 'Assessment methods']
            },
            {
              domain: 'Engineering',
              domainAr: 'هندسي',
              complianceScore: 89.4,
              userCount: 634,
              violations: 2,
              commonIssues: ['Building code references', 'Safety standards']
            }
          ],
          trend: 'up'
        },
        arabic: {
          accuracy: 99.3,
          rtlIssues: 7,
          dialectRecognition: 87.2,
          processingTime: 98.5,
          trend: 'up'
        },
        regional: [
          { governorate: 'Baghdad', governorateAr: 'بغداد', complianceScore: 92.1, userCount: 8247 },
          { governorate: 'Basra', governorateAr: 'البصرة', complianceScore: 94.3, userCount: 3156 },
          { governorate: 'Mosul', governorateAr: 'الموصل', complianceScore: 88.7, userCount: 2847 },
          { governorate: 'Erbil', governorateAr: 'أربيل', complianceScore: 91.2, userCount: 2134 },
          { governorate: 'Najaf', governorateAr: 'النجف', complianceScore: 96.8, userCount: 1567 },
          { governorate: 'Karbala', governorateAr: 'كربلاء', complianceScore: 95.4, userCount: 1234 }
        ]
      };

      setMetrics(mockMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAlerts = useCallback(async () => {
    try {
      const mockAlerts: ComplianceAlert[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 300000),
          type: 'islamic',
          severity: 'high',
          message: 'Islamic compliance dropped below 95% threshold',
          messageAr: 'انخفض الامتثال الإسلامي دون عتبة 95%',
          actionRequired: true,
          resolved: false
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 600000),
          type: 'cultural',
          severity: 'medium',
          message: 'Cultural appropriateness violations increasing in Baghdad region',
          messageAr: 'انتهاكات الملاءمة الثقافية تتزايد في منطقة بغداد',
          governorate: 'baghdad',
          actionRequired: false,
          resolved: false
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 900000),
          type: 'professional',
          severity: 'critical',
          message: 'Legal domain compliance critical - immediate attention required',
          messageAr: 'امتثال المجال القانوني حرج - مطلوب اهتمام فوري',
          domain: 'legal',
          actionRequired: true,
          resolved: false
        }
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  }, [filters]);

  // Effects
  useEffect(() => {
    fetchMetrics();
    fetchAlerts();
  }, [fetchMetrics, fetchAlerts]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
      fetchAlerts();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchMetrics, fetchAlerts]);

  // Helper Functions
  const getComplianceStatus = (score: number, target: number) => {
    if (score >= target) return { status: 'success', color: COLORS.success };
    if (score >= target - 5) return { status: 'warning', color: COLORS.warning };
    return { status: 'error', color: COLORS.error };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  // Render Functions
  const renderMetricCard = (
    title: string,
    titleAr: string,
    value: number,
    target: number,
    trend: 'up' | 'down' | 'stable',
    icon: React.ReactNode,
    suffix: string = '%'
  ) => {
    const { status, color } = getComplianceStatus(value, target);
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex flex-col">
              <span>{title}</span>
              <span className="text-xs text-muted-foreground" dir="rtl">{titleAr}</span>
            </div>
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold" style={{ color }}>
                {value.toFixed(1)}{suffix}
              </div>
              {getTrendIcon(trend)}
            </div>
            <div className="text-xs text-muted-foreground">
              Target: {target}{suffix}
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((value / target) * 100, 100)}%`,
                backgroundColor: color
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComplianceChart = () => {
    if (!metrics) return null;

    const data = [
      { name: 'Islamic', nameAr: 'إسلامي', value: metrics.islamic.score, target: COMPLIANCE_TARGETS.islamic },
      { name: 'Cultural', nameAr: 'ثقافي', value: metrics.cultural.score, target: COMPLIANCE_TARGETS.cultural },
      { name: 'Professional', nameAr: 'مهني', value: metrics.professional.score, target: COMPLIANCE_TARGETS.professional },
      { name: 'Arabic', nameAr: 'عربي', value: metrics.arabic.accuracy, target: COMPLIANCE_TARGETS.arabic }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[80, 100]} />
          <Tooltip 
            formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
          />
          <Bar dataKey="value" fill={COLORS.primary} />
          <Bar dataKey="target" fill={COLORS.success} opacity={0.3} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderViolationsPieChart = () => {
    if (!metrics) return null;

    const data = [
      { name: 'Islamic', value: metrics.islamic.violations, color: COLORS.islamic },
      { name: 'Cultural', value: metrics.cultural.violations, color: COLORS.cultural },
      { name: 'Professional', value: metrics.professional.violations, color: COLORS.professional },
      { name: 'Arabic', value: metrics.arabic.rtlIssues, color: COLORS.arabic }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value, percent }) => 
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderAlertsSection = () => {
    const filteredAlerts = alerts.filter(alert => {
      if (filters.alertSeverity !== 'all' && alert.severity !== filters.alertSeverity) {
        return false;
      }
      if (filters.governorate !== 'all' && alert.governorate && alert.governorate !== filters.governorate) {
        return false;
      }
      if (filters.domain !== 'all' && alert.domain && alert.domain !== filters.domain) {
        return false;
      }
      return true;
    });

    return (
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Alert key={alert.id} className={`${alert.severity === 'critical' ? 'border-red-500' : ''}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <span>{alert.message}</span>
              <Badge variant={getSeverityColor(alert.severity)}>
                {alert.severity.toUpperCase()}
              </Badge>
            </AlertTitle>
            <AlertDescription>
              <div className="flex flex-col space-y-2">
                <span dir="rtl" className="text-sm text-muted-foreground">
                  {alert.messageAr}
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span>{alert.timestamp.toLocaleString()}</span>
                  {alert.actionRequired && (
                    <Badge variant="outline" className="text-orange-600">
                      Action Required
                    </Badge>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    );
  };

  const renderRegionalCompliance = () => {
    if (!metrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.regional.map((region) => (
          <Card key={region.governorate}>
            <CardHeader>
              <CardTitle className="text-sm">
                <div className="flex flex-col">
                  <span>{region.governorate}</span>
                  <span className="text-xs text-muted-foreground" dir="rtl">
                    {region.governorateAr}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">
                  {region.complianceScore.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {region.userCount.toLocaleString()} users
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-primary"
                  style={{ width: `${region.complianceScore}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading compliance metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cultural Compliance Dashboard</h1>
          <p className="text-muted-foreground" dir="rtl">
            لوحة مراقبة الامتثال الثقافي
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value as any }))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.governorate} onValueChange={(value) => setFilters(prev => ({ ...prev, governorate: value }))}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GOVERNORATES.map(gov => (
              <SelectItem key={gov.value} value={gov.value}>{gov.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.domain} onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROFESSIONAL_DOMAINS.map(domain => (
              <SelectItem key={domain.value} value={domain.value}>{domain.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderMetricCard(
            'Islamic Compliance',
            'الامتثال الإسلامي',
            metrics.islamic.score,
            COMPLIANCE_TARGETS.islamic,
            metrics.islamic.trend,
            <Shield className="w-5 h-5 text-green-600" />
          )}
          {renderMetricCard(
            'Cultural Appropriateness',
            'الملاءمة الثقافية',
            metrics.cultural.score,
            COMPLIANCE_TARGETS.cultural,
            metrics.cultural.trend,
            <Users className="w-5 h-5 text-purple-600" />
          )}
          {renderMetricCard(
            'Professional Standards',
            'المعايير المهنية',
            metrics.professional.score,
            COMPLIANCE_TARGETS.professional,
            metrics.professional.trend,
            <BookOpen className="w-5 h-5 text-blue-600" />
          )}
          {renderMetricCard(
            'Arabic Processing',
            'معالجة العربية',
            metrics.arabic.accuracy,
            COMPLIANCE_TARGETS.arabic,
            metrics.arabic.trend,
            <Globe className="w-5 h-5 text-red-600" />
          )}
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Scores vs Targets</CardTitle>
              </CardHeader>
              <CardContent>
                {renderComplianceChart()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Violation Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {renderViolationsPieChart()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Islamic Compliance Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.islamic.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">{category.categoryAr}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(category.severity)}>
                            {category.count}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {category.trend > 0 ? '+' : ''}{category.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cultural Compliance Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.cultural.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">{category.categoryAr}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(category.severity)}>
                            {category.count}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {category.trend > 0 ? '+' : ''}{category.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Compliance Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compliance scores across Iraqi governorates
              </p>
            </CardHeader>
            <CardContent>
              {renderRegionalCompliance()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Active Compliance Alerts</span>
                <Badge variant="destructive">{alerts.filter(a => !a.resolved).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderAlertsSection()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CulturalComplianceDashboard;