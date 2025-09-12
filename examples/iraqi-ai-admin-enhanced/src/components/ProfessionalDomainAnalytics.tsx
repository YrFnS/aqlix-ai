/**
 * Professional Domain Analytics Component
 * 
 * Comprehensive analytics dashboard for Iraqi professional domains:
 * - Legal: Lawyers, judges, legal assistants (Iraqi court systems)
 * - Medical: Doctors, nurses, medical administrators (Iraqi healthcare)
 * - Educational: Teachers, professors, administrators (Iraqi education system)
 * - Engineering: Engineers, architects, technical specialists
 * - Business: Business professionals, entrepreneurs, consultants
 * - Government: Civil servants, ministry officials, administrators
 * - Religious: Islamic scholars, religious educators, mosque administrators
 * - Cultural: Cultural advisors, heritage specialists, community leaders
 * 
 * Features:
 * - Real-time domain usage analytics with 92%+ compliance target
 * - Professional accuracy tracking per domain
 * - Cultural appropriateness monitoring for each profession
 * - Governorate-based professional distribution
 * - Domain-specific performance metrics
 * - Professional certification tracking
 * - Ethical compliance monitoring
 * - Arabic professional terminology accuracy
 * - Cross-domain interaction analysis
 * - Professional development recommendations
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from '@/components/ui/card';
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
  TabsTrigger,
  Progress
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
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Scale,
  Stethoscope,
  GraduationCap,
  Hammer,
  Briefcase,
  Building2,
  Mosque,
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  MapPin,
  BookOpen,
  Star
} from 'lucide-react';

// Professional Domain Types
export enum ProfessionalDomain {
  LEGAL = 'legal',
  MEDICAL = 'medical',
  EDUCATIONAL = 'educational',
  ENGINEERING = 'engineering',
  BUSINESS = 'business',
  GOVERNMENT = 'government',
  RELIGIOUS = 'religious',
  CULTURAL = 'cultural'
}

// Core Interfaces
export interface DomainAnalytics {
  domain: ProfessionalDomain;
  domainName: string;
  domainNameAr: string;
  icon: React.ReactNode;
  color: string;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    accuracyScore: number;
    satisfactionRating: number;
    complianceScore: number;
    responseTime: number;
    monthlyGrowth: number;
  };
  professionalBreakdown: ProfessionalRole[];
  governorateDistribution: GovernorateDistribution[];
  performanceMetrics: PerformanceMetric[];
  qualityMetrics: QualityMetric[];
  culturalCompliance: CulturalComplianceMetric[];
  recentActivity: ActivityMetric[];
  certifications: CertificationMetric[];
  commonQueries: QueryAnalytic[];
  userSatisfaction: SatisfactionMetric[];
}

export interface ProfessionalRole {
  role: string;
  roleAr: string;
  userCount: number;
  averageExperience: number; // years
  certificationRate: number; // percentage
  satisfactionScore: number;
  accuracyScore: number;
  culturalComplianceScore: number;
}

export interface GovernorateDistribution {
  governorate: string;
  governorateAr: string;
  userCount: number;
  percentage: number;
  averageAccuracy: number;
  regionalSpecialties: string[];
}

export interface PerformanceMetric {
  metric: string;
  metricAr: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  description: string;
  descriptionAr: string;
}

export interface QualityMetric {
  category: string;
  categoryAr: string;
  score: number;
  maxScore: number;
  details: {
    accuracy: number;
    relevance: number;
    completeness: number;
    timeliness: number;
    culturalAppropriatenesss: number;
  };
}

export interface CulturalComplianceMetric {
  aspect: string;
  aspectAr: string;
  score: number;
  target: number;
  violations: number;
  improvements: string[];
  improvementsAr: string[];
}

export interface ActivityMetric {
  timestamp: Date;
  activityType: string;
  activityTypeAr: string;
  userCount: number;
  successRate: number;
  averageTime: number;
}

export interface CertificationMetric {
  certification: string;
  certificationAr: string;
  totalHolders: number;
  verificationRate: number;
  renewalRate: number;
  averageScore: number;
  issuingAuthority: string;
  issuingAuthorityAr: string;
}

export interface QueryAnalytic {
  query: string;
  queryAr: string;
  frequency: number;
  averageAccuracy: number;
  averageResponseTime: number;
  satisfactionScore: number;
  category: string;
  categoryAr: string;
}

export interface SatisfactionMetric {
  period: string;
  overallSatisfaction: number;
  accuracySatisfaction: number;
  speedSatisfaction: number;
  culturalSatisfaction: number;
  recommendationRate: number;
  userRetention: number;
}

const ProfessionalDomainAnalytics: React.FC = () => {
  // State Management
  const [selectedDomain, setSelectedDomain] = useState<ProfessionalDomain>(ProfessionalDomain.LEGAL);
  const [domainAnalytics, setDomainAnalytics] = useState<{ [key in ProfessionalDomain]: DomainAnalytics } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Domain Configuration
  const DOMAIN_CONFIG = {
    [ProfessionalDomain.LEGAL]: {
      name: 'Legal',
      nameAr: 'قانوني',
      icon: <Scale className="w-5 h-5" />,
      color: '#1e40af',
      roles: ['Lawyer', 'Judge', 'Legal Assistant', 'Prosecutor', 'Legal Researcher']
    },
    [ProfessionalDomain.MEDICAL]: {
      name: 'Medical',
      nameAr: 'طبي',
      icon: <Stethoscope className="w-5 h-5" />,
      color: '#dc2626',
      roles: ['Doctor', 'Nurse', 'Pharmacist', 'Medical Administrator', 'Medical Researcher']
    },
    [ProfessionalDomain.EDUCATIONAL]: {
      name: 'Educational',
      nameAr: 'تعليمي',
      icon: <GraduationCap className="w-5 h-5" />,
      color: '#16a34a',
      roles: ['Teacher', 'Professor', 'Principal', 'Educational Administrator', 'Researcher']
    },
    [ProfessionalDomain.ENGINEERING]: {
      name: 'Engineering',
      nameAr: 'هندسي',
      icon: <Hammer className="w-5 h-5" />,
      color: '#ea580c',
      roles: ['Civil Engineer', 'Electrical Engineer', 'Architect', 'Project Manager', 'Technical Specialist']
    },
    [ProfessionalDomain.BUSINESS]: {
      name: 'Business',
      nameAr: 'تجاري',
      icon: <Briefcase className="w-5 h-5" />,
      color: '#7c3aed',
      roles: ['Business Owner', 'Manager', 'Consultant', 'Entrepreneur', 'Business Analyst']
    },
    [ProfessionalDomain.GOVERNMENT]: {
      name: 'Government',
      nameAr: 'حكومي',
      icon: <Building2 className="w-5 h-5" />,
      color: '#0891b2',
      roles: ['Civil Servant', 'Ministry Official', 'Administrator', 'Policy Maker', 'Public Relations']
    },
    [ProfessionalDomain.RELIGIOUS]: {
      name: 'Religious',
      nameAr: 'ديني',
      icon: <Mosque className="w-5 h-5" />,
      color: '#059669',
      roles: ['Islamic Scholar', 'Imam', 'Religious Educator', 'Mosque Administrator', 'Chaplain']
    },
    [ProfessionalDomain.CULTURAL]: {
      name: 'Cultural',
      nameAr: 'ثقافي',
      icon: <Users className="w-5 h-5" />,
      color: '#c2410c',
      roles: ['Cultural Advisor', 'Heritage Specialist', 'Community Leader', 'Cultural Researcher', 'Arts Professional']
    }
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

  // Data Fetching
  const fetchDomainAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate fetching analytics for all domains
      const analytics: { [key in ProfessionalDomain]: DomainAnalytics } = {} as any;
      
      for (const domain of Object.values(ProfessionalDomain)) {
        analytics[domain] = await generateDomainAnalytics(domain);
      }
      
      setDomainAnalytics(analytics);
    } catch (error) {
      console.error('Error fetching domain analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, selectedGovernorate]);

  const generateDomainAnalytics = async (domain: ProfessionalDomain): Promise<DomainAnalytics> => {
    const config = DOMAIN_CONFIG[domain];
    const baseUsers = {
      [ProfessionalDomain.LEGAL]: 1247,
      [ProfessionalDomain.MEDICAL]: 892,
      [ProfessionalDomain.EDUCATIONAL]: 2156,
      [ProfessionalDomain.ENGINEERING]: 634,
      [ProfessionalDomain.BUSINESS]: 1823,
      [ProfessionalDomain.GOVERNMENT]: 987,
      [ProfessionalDomain.RELIGIOUS]: 445,
      [ProfessionalDomain.CULTURAL]: 321
    };

    return {
      domain,
      domainName: config.name,
      domainNameAr: config.nameAr,
      icon: config.icon,
      color: config.color,
      metrics: {
        totalUsers: baseUsers[domain],
        activeUsers: Math.floor(baseUsers[domain] * (0.7 + Math.random() * 0.25)), // 70-95% active
        accuracyScore: 88 + Math.random() * 10, // 88-98%
        satisfactionRating: 4.2 + Math.random() * 0.6, // 4.2-4.8
        complianceScore: 90 + Math.random() * 8, // 90-98%
        responseTime: 150 + Math.random() * 100, // 150-250ms
        monthlyGrowth: -5 + Math.random() * 20 // -5% to +15%
      },
      professionalBreakdown: generateProfessionalBreakdown(config.roles),
      governorateDistribution: generateGovernorateDistribution(),
      performanceMetrics: generatePerformanceMetrics(domain),
      qualityMetrics: generateQualityMetrics(),
      culturalCompliance: generateCulturalComplianceMetrics(domain),
      recentActivity: generateRecentActivity(),
      certifications: generateCertificationMetrics(domain),
      commonQueries: generateCommonQueries(domain),
      userSatisfaction: generateUserSatisfactionMetrics()
    };
  };

  const generateProfessionalBreakdown = (roles: string[]): ProfessionalRole[] => {
    return roles.map(role => ({
      role,
      roleAr: translateRoleToArabic(role),
      userCount: Math.floor(Math.random() * 300) + 50,
      averageExperience: Math.floor(Math.random() * 15) + 3,
      certificationRate: Math.random() * 30 + 60, // 60-90%
      satisfactionScore: 4.0 + Math.random() * 0.8,
      accuracyScore: 85 + Math.random() * 12,
      culturalComplianceScore: 88 + Math.random() * 10
    }));
  };

  const generateGovernorateDistribution = (): GovernorateDistribution[] => {
    const governorates = ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala'];
    const totalUsers = 1000;
    let remainingUsers = totalUsers;
    
    return governorates.map((gov, index) => {
      const userCount = index === governorates.length - 1 
        ? remainingUsers 
        : Math.floor(Math.random() * (remainingUsers / (governorates.length - index))) + 50;
      
      remainingUsers -= userCount;
      
      return {
        governorate: gov,
        governorateAr: translateGovernorateToArabic(gov),
        userCount,
        percentage: (userCount / totalUsers) * 100,
        averageAccuracy: 85 + Math.random() * 12,
        regionalSpecialties: generateRegionalSpecialties(gov)
      };
    });
  };

  const generatePerformanceMetrics = (domain: ProfessionalDomain): PerformanceMetric[] => {
    return [
      {
        metric: 'Response Time',
        metricAr: 'وقت الاستجابة',
        value: 180 + Math.random() * 80,
        target: 200,
        trend: Math.random() > 0.5 ? 'down' : 'up',
        unit: 'ms',
        description: 'Average response time for queries',
        descriptionAr: 'متوسط وقت الاستجابة للاستعلامات'
      },
      {
        metric: 'Accuracy Rate',
        metricAr: 'معدل الدقة',
        value: 88 + Math.random() * 10,
        target: 92,
        trend: 'up',
        unit: '%',
        description: 'Accuracy of domain-specific responses',
        descriptionAr: 'دقة الإجابات الخاصة بالمجال'
      },
      {
        metric: 'User Engagement',
        metricAr: 'تفاعل المستخدمين',
        value: 75 + Math.random() * 20,
        target: 85,
        trend: 'stable',
        unit: '%',
        description: 'User engagement with domain features',
        descriptionAr: 'تفاعل المستخدمين مع ميزات المجال'
      },
      {
        metric: 'Cultural Compliance',
        metricAr: 'الامتثال الثقافي',
        value: 90 + Math.random() * 8,
        target: 95,
        trend: 'up',
        unit: '%',
        description: 'Cultural appropriateness score',
        descriptionAr: 'درجة الملاءمة الثقافية'
      }
    ];
  };

  const generateQualityMetrics = (): QualityMetric[] => {
    return [
      {
        category: 'Content Quality',
        categoryAr: 'جودة المحتوى',
        score: 88 + Math.random() * 10,
        maxScore: 100,
        details: {
          accuracy: 90 + Math.random() * 8,
          relevance: 85 + Math.random() * 12,
          completeness: 87 + Math.random() * 10,
          timeliness: 92 + Math.random() * 6,
          culturalAppropriatenesss: 89 + Math.random() * 9
        }
      },
      {
        category: 'User Experience',
        categoryAr: 'تجربة المستخدم',
        score: 85 + Math.random() * 12,
        maxScore: 100,
        details: {
          accuracy: 88 + Math.random() * 10,
          relevance: 90 + Math.random() * 8,
          completeness: 83 + Math.random() * 14,
          timeliness: 87 + Math.random() * 11,
          culturalAppropriatenesss: 91 + Math.random() * 7
        }
      }
    ];
  };

  const generateCulturalComplianceMetrics = (domain: ProfessionalDomain): CulturalComplianceMetric[] => {
    const aspects = [
      { name: 'Islamic Values', nameAr: 'القيم الإسلامية' },
      { name: 'Professional Ethics', nameAr: 'الأخلاق المهنية' },
      { name: 'Cultural Sensitivity', nameAr: 'الحساسية الثقافية' },
      { name: 'Language Formality', nameAr: 'رسمية اللغة' }
    ];

    return aspects.map(aspect => ({
      aspect: aspect.name,
      aspectAr: aspect.nameAr,
      score: 88 + Math.random() * 10,
      target: 95,
      violations: Math.floor(Math.random() * 5),
      improvements: ['Enhanced validation rules', 'Cultural training updates'],
      improvementsAr: ['تحسين قواعد التحقق', 'تحديثات التدريب الثقافي']
    }));
  };

  const generateRecentActivity = (): ActivityMetric[] => {
    const activities = [
      { type: 'Consultations', typeAr: 'استشارات' },
      { type: 'Document Reviews', typeAr: 'مراجعة الوثائق' },
      { type: 'Training Sessions', typeAr: 'جلسات تدريبية' },
      { type: 'Compliance Checks', typeAr: 'فحوصات الامتثال' }
    ];

    return activities.map(activity => ({
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      activityType: activity.type,
      activityTypeAr: activity.typeAr,
      userCount: Math.floor(Math.random() * 200) + 50,
      successRate: 85 + Math.random() * 12,
      averageTime: Math.floor(Math.random() * 300) + 120
    }));
  };

  const generateCertificationMetrics = (domain: ProfessionalDomain): CertificationMetric[] => {
    const certificationsByDomain = {
      [ProfessionalDomain.LEGAL]: [
        { name: 'Iraqi Bar Association', nameAr: 'نقابة المحامين العراقيين' },
        { name: 'Judicial Training Certificate', nameAr: 'شهادة التدريب القضائي' }
      ],
      [ProfessionalDomain.MEDICAL]: [
        { name: 'Iraqi Medical Association', nameAr: 'نقابة الأطباء العراقيين' },
        { name: 'Medical Practice License', nameAr: 'رخصة مزاولة الطب' }
      ],
      [ProfessionalDomain.EDUCATIONAL]: [
        { name: 'Ministry of Education Certificate', nameAr: 'شهادة وزارة التربية' },
        { name: 'Teaching License', nameAr: 'رخصة التدريس' }
      ]
    };

    const domainCerts = certificationsByDomain[domain] || [
      { name: 'Professional Certificate', nameAr: 'شهادة مهنية' }
    ];

    return domainCerts.map(cert => ({
      certification: cert.name,
      certificationAr: cert.nameAr,
      totalHolders: Math.floor(Math.random() * 500) + 100,
      verificationRate: 85 + Math.random() * 12,
      renewalRate: 78 + Math.random() * 15,
      averageScore: 80 + Math.random() * 15,
      issuingAuthority: 'Iraqi Professional Council',
      issuingAuthorityAr: 'المجلس المهني العراقي'
    }));
  };

  const generateCommonQueries = (domain: ProfessionalDomain): QueryAnalytic[] => {
    const queriesByDomain = {
      [ProfessionalDomain.LEGAL]: [
        { query: 'Iraqi contract law', queryAr: 'قانون العقود العراقي' },
        { query: 'Court procedures', queryAr: 'إجراءات المحكمة' },
        { query: 'Legal precedents', queryAr: 'السوابق القضائية' }
      ],
      [ProfessionalDomain.MEDICAL]: [
        { query: 'Medical ethics', queryAr: 'الأخلاق الطبية' },
        { query: 'Treatment protocols', queryAr: 'بروتوكولات العلاج' },
        { query: 'Patient rights', queryAr: 'حقوق المريض' }
      ],
      [ProfessionalDomain.EDUCATIONAL]: [
        { query: 'Curriculum standards', queryAr: 'معايير المناهج' },
        { query: 'Assessment methods', queryAr: 'طرق التقييم' },
        { query: 'Student rights', queryAr: 'حقوق الطلاب' }
      ]
    };

    const domainQueries = queriesByDomain[domain] || [
      { query: 'Professional standards', queryAr: 'المعايير المهنية' }
    ];

    return domainQueries.map(query => ({
      ...query,
      frequency: Math.floor(Math.random() * 1000) + 100,
      averageAccuracy: 85 + Math.random() * 12,
      averageResponseTime: 150 + Math.random() * 100,
      satisfactionScore: 4.0 + Math.random() * 0.8,
      category: 'Professional Inquiry',
      categoryAr: 'استعلام مهني'
    }));
  };

  const generateUserSatisfactionMetrics = (): SatisfactionMetric[] => {
    return [
      {
        period: 'Last 30 days',
        overallSatisfaction: 4.2 + Math.random() * 0.6,
        accuracySatisfaction: 4.1 + Math.random() * 0.7,
        speedSatisfaction: 4.0 + Math.random() * 0.8,
        culturalSatisfaction: 4.3 + Math.random() * 0.5,
        recommendationRate: 80 + Math.random() * 15,
        userRetention: 85 + Math.random() * 10
      }
    ];
  };

  // Helper Functions
  const translateRoleToArabic = (role: string): string => {
    const translations: { [key: string]: string } = {
      'Lawyer': 'محامي',
      'Judge': 'قاضي',
      'Legal Assistant': 'مساعد قانوني',
      'Prosecutor': 'مدعي عام',
      'Doctor': 'طبيب',
      'Nurse': 'ممرض/ممرضة',
      'Pharmacist': 'صيدلي',
      'Teacher': 'معلم/معلمة',
      'Professor': 'أستاذ جامعي',
      'Principal': 'مدير/مديرة',
      'Civil Engineer': 'مهندس مدني',
      'Electrical Engineer': 'مهندس كهربائي',
      'Architect': 'مهندس معماري',
      'Business Owner': 'صاحب عمل',
      'Manager': 'مدير',
      'Consultant': 'مستشار',
      'Civil Servant': 'موظف حكومي',
      'Ministry Official': 'مسؤول وزاري',
      'Islamic Scholar': 'عالم إسلامي',
      'Imam': 'إمام',
      'Cultural Advisor': 'مستشار ثقافي'
    };
    return translations[role] || role;
  };

  const translateGovernorateToArabic = (governorate: string): string => {
    const translations: { [key: string]: string } = {
      'Baghdad': 'بغداد',
      'Basra': 'البصرة',
      'Mosul': 'الموصل',
      'Erbil': 'أربيل',
      'Najaf': 'النجف',
      'Karbala': 'كربلاء'
    };
    return translations[governorate] || governorate;
  };

  const generateRegionalSpecialties = (governorate: string): string[] => {
    const specialties: { [key: string]: string[] } = {
      'Baghdad': ['Government Relations', 'Business Law', 'Academic Research'],
      'Basra': ['Oil Industry', 'Maritime Law', 'International Trade'],
      'Mosul': ['Heritage Preservation', 'Archaeological Law', 'Cultural Studies'],
      'Erbil': ['Regional Governance', 'Kurdish Law', 'Cross-border Commerce'],
      'Najaf': ['Islamic Jurisprudence', 'Religious Education', 'Pilgrimage Services'],
      'Karbala': ['Religious Tourism', 'Islamic Studies', 'Community Services']
    };
    return specialties[governorate] || ['General Practice'];
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  // Effects
  useEffect(() => {
    fetchDomainAnalytics();
  }, [fetchDomainAnalytics]);

  // Render Functions
  const renderDomainOverview = () => {
    if (!domainAnalytics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.values(ProfessionalDomain).map(domain => {
          const analytics = domainAnalytics[domain];
          const config = DOMAIN_CONFIG[domain];
          
          return (
            <Card 
              key={domain}
              className={`cursor-pointer transition-all ${selectedDomain === domain ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
              onClick={() => setSelectedDomain(domain)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div style={{ color: config.color }}>
                      {config.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{config.name}</div>
                      <div className="text-xs text-muted-foreground" dir="rtl">{config.nameAr}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{analytics.metrics.totalUsers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{analytics.metrics.accuracyScore.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={analytics.metrics.accuracyScore} 
                    className="h-1"
                  />
                  <div className="flex justify-between text-sm">
                    <span>Satisfaction</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{analytics.metrics.satisfactionRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderDetailedAnalytics = () => {
    if (!domainAnalytics || !selectedDomain) return null;

    const analytics = domainAnalytics[selectedDomain];
    const config = DOMAIN_CONFIG[selectedDomain];

    return (
      <div className="space-y-6">
        {/* Domain Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div style={{ color: config.color }}>
                {config.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{config.name} Analytics</h2>
                <p className="text-muted-foreground" dir="rtl">{config.nameAr} تحليلات</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: config.color }}>
                  {analytics.metrics.totalUsers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-sm text-muted-foreground" dir="rtl">إجمالي المستخدمين</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.metrics.accuracyScore.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy Score</div>
                <div className="text-sm text-muted-foreground" dir="rtl">درجة الدقة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.metrics.satisfactionRating.toFixed(1)}/5
                </div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
                <div className="text-sm text-muted-foreground" dir="rtl">الرضا</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.metrics.complianceScore.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Compliance</div>
                <div className="text-sm text-muted-foreground" dir="rtl">الامتثال</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performanceMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{metric.metric}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">{metric.metricAr}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold">
                            {metric.value.toFixed(1)}{metric.unit}
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.qualityMetrics.map((quality, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{quality.category}</span>
                          <span className="font-bold">{quality.score.toFixed(1)}/{quality.maxScore}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2" dir="rtl">{quality.categoryAr}</div>
                        <Progress value={quality.score} className="mb-2" />
                        <div className="grid grid-cols-5 gap-2 text-xs">
                          {Object.entries(quality.details).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="font-medium">{value.toFixed(0)}%</div>
                              <div className="text-muted-foreground capitalize">{key.slice(0, 3)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Role Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.professionalBreakdown.map((role, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{role.role}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">{role.roleAr}</div>
                        </div>
                        <Badge variant="secondary">{role.userCount} users</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Experience</div>
                          <div className="font-medium">{role.averageExperience} years</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Certification</div>
                          <div className="font-medium">{role.certificationRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Accuracy</div>
                          <div className="font-medium">{role.accuracyScore.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Satisfaction</div>
                          <div className="font-medium">{role.satisfactionScore.toFixed(1)}/5</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Governorate Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.governorateDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="userCount"
                        nameKey="governorate"
                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      >
                        {analytics.governorateDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.governorateDistribution.map((region, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <div className="font-medium">{region.governorate}</div>
                            <div className="text-sm text-muted-foreground" dir="rtl">{region.governorateAr}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{region.userCount}</div>
                            <div className="text-sm text-muted-foreground">users</div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Accuracy</span>
                          <span>{region.averageAccuracy.toFixed(1)}%</span>
                        </div>
                        <Progress value={region.averageAccuracy} className="mb-2" />
                        <div className="flex flex-wrap gap-1">
                          {region.regionalSpecialties.map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cultural" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Compliance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analytics.culturalCompliance.map((compliance, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="font-semibold">{compliance.aspect}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">{compliance.aspectAr}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {compliance.score.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: {compliance.target}%
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={compliance.score} 
                        className="mb-3" 
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Violations</span>
                          <Badge variant={compliance.violations > 0 ? "destructive" : "secondary"}>
                            {compliance.violations}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Recent Improvements:</div>
                          <div className="space-y-1">
                            {compliance.improvements.map((improvement, idx) => (
                              <div key={idx} className="text-xs text-muted-foreground flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                {improvement}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Satisfaction Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.userSatisfaction.map((satisfaction, index) => (
                    <div key={index} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {satisfaction.overallSatisfaction.toFixed(1)}/5
                          </div>
                          <div className="text-sm text-muted-foreground">Overall</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {satisfaction.recommendationRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Would Recommend</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Accuracy Satisfaction</span>
                            <span className="text-sm">{satisfaction.accuracySatisfaction.toFixed(1)}/5</span>
                          </div>
                          <Progress value={(satisfaction.accuracySatisfaction / 5) * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Speed Satisfaction</span>
                            <span className="text-sm">{satisfaction.speedSatisfaction.toFixed(1)}/5</span>
                          </div>
                          <Progress value={(satisfaction.speedSatisfaction / 5) * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Cultural Satisfaction</span>
                            <span className="text-sm">{satisfaction.culturalSatisfaction.toFixed(1)}/5</span>
                          </div>
                          <Progress value={(satisfaction.culturalSatisfaction / 5) * 100} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.commonQueries.map((query, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{query.query}</div>
                            <div className="text-xs text-muted-foreground" dir="rtl">{query.queryAr}</div>
                          </div>
                          <Badge variant="secondary">{query.frequency}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Accuracy</div>
                            <div className="font-medium">{query.averageAccuracy.toFixed(1)}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Response</div>
                            <div className="font-medium">{query.averageResponseTime.toFixed(0)}ms</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Rating</div>
                            <div className="font-medium">{query.satisfactionScore.toFixed(1)}/5</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading professional domain analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professional Domain Analytics</h1>
          <p className="text-muted-foreground" dir="rtl">
            تحليلات المجالات المهنية
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GOVERNORATES.map(gov => (
              <SelectItem key={gov.value} value={gov.value}>{gov.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {selectedDomain && DOMAIN_CONFIG[selectedDomain].roles.map(role => (
              <SelectItem key={role} value={role.toLowerCase().replace(' ', '-')}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Domain Overview */}
      {renderDomainOverview()}

      {/* Detailed Analytics */}
      {renderDetailedAnalytics()}
    </div>
  );
};

export default ProfessionalDomainAnalytics;