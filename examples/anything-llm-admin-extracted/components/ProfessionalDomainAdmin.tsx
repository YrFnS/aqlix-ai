/**
 * Professional Domain Administration Interface
 * Enhanced for Iraqi AI Chat System
 *
 * Features:
 * - Iraqi professional domain management (legal, medical, educational, business, engineering, government)
 * - Domain-specific user role assignments
 * - Professional compliance monitoring
 * - Domain expert management
 * - Knowledge base administration per domain
 * - Iraqi professional standards integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Scale,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Wrench,
  Building,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Award,
  Shield,
  TrendingUp,
} from 'lucide-react';
import {
  ProfessionalDomain,
  IraqiUser,
  UserRole,
  CulturalComplianceLevel,
  AdminPermissions,
} from '../types/admin';

interface ProfessionalDomainAdminProps {
  className?: string;
  showArabicLabels?: boolean;
}

interface DomainExpert {
  id: string;
  userId: string;
  user: IraqiUser;
  domain: ProfessionalDomain;
  certifications: string[];
  specializations: string[];
  experienceYears: number;
  complianceScore: number;
  status: 'active' | 'inactive' | 'under_review';
  assignedAt: Date;
  lastActivity: Date;
}

interface DomainSettings {
  domain: ProfessionalDomain;
  enabled: boolean;
  complianceLevel: CulturalComplianceLevel;
  expertRequirements: {
    minExperienceYears: number;
    requiredCertifications: string[];
    complianceThreshold: number;
  };
  knowledgeBaseSize: number;
  activeUsers: number;
  monthlyInteractions: number;
}

interface DomainKnowledgeBase {
  id: string;
  domain: ProfessionalDomain;
  title: string;
  arabicTitle?: string;
  description: string;
  documentCount: number;
  lastUpdated: Date;
  complianceStatus: 'compliant' | 'needs_review' | 'non_compliant';
  contributors: string[];
}

// Domain configuration with Iraqi-specific details
const DOMAIN_CONFIG: Record<
  ProfessionalDomain,
  {
    name: string;
    arabicName: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    arabicDescription: string;
    iraqiStandards: string[];
    requiredCompliance: CulturalComplianceLevel;
  }
> = {
  legal: {
    name: 'Legal',
    arabicName: 'قانوني',
    icon: <Scale className="w-5 h-5" />,
    color: 'text-blue-600',
    description: 'Iraqi legal system, courts, and jurisprudence',
    arabicDescription: 'النظام القانوني العراقي والمحاكم والفقه',
    iraqiStandards: ['Iraqi Civil Code', 'Commercial Law', 'Personal Status Law', 'Criminal Law'],
    requiredCompliance: 'strict',
  },
  medical: {
    name: 'Medical',
    arabicName: 'طبي',
    icon: <Stethoscope className="w-5 h-5" />,
    color: 'text-green-600',
    description: 'Iraqi healthcare system and medical practices',
    arabicDescription: 'النظام الصحي العراقي والممارسات الطبية',
    iraqiStandards: [
      'Iraqi Medical Association',
      'Ministry of Health Guidelines',
      'Medical Ethics Code',
    ],
    requiredCompliance: 'strict',
  },
  educational: {
    name: 'Educational',
    arabicName: 'تعليمي',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-purple-600',
    description: 'Iraqi education system and academic standards',
    arabicDescription: 'النظام التعليمي العراقي والمعايير الأكاديمية',
    iraqiStandards: [
      'Ministry of Education Curriculum',
      'Higher Education Standards',
      'Teacher Certification',
    ],
    requiredCompliance: 'moderate',
  },
  business: {
    name: 'Business',
    arabicName: 'تجاري',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'text-orange-600',
    description: 'Iraqi business practices and commercial law',
    arabicDescription: 'الممارسات التجارية العراقية والقانون التجاري',
    iraqiStandards: ['Commercial Registration Law', 'Investment Law', 'Banking Regulations'],
    requiredCompliance: 'moderate',
  },
  engineering: {
    name: 'Engineering',
    arabicName: 'هندسي',
    icon: <Wrench className="w-5 h-5" />,
    color: 'text-gray-600',
    description: 'Iraqi engineering standards and construction codes',
    arabicDescription: 'المعايير الهندسية العراقية وقوانين البناء',
    iraqiStandards: [
      'Iraqi Building Code',
      'Engineering Syndicate Standards',
      'Safety Regulations',
    ],
    requiredCompliance: 'flexible',
  },
  government: {
    name: 'Government',
    arabicName: 'حكومي',
    icon: <Building className="w-5 h-5" />,
    color: 'text-indigo-600',
    description: 'Iraqi government services and administrative procedures',
    arabicDescription: 'الخدمات الحكومية العراقية والإجراءات الإدارية',
    iraqiStandards: ['Administrative Law', 'Public Service Code', 'Government Procedures Manual'],
    requiredCompliance: 'strict',
  },
  general: {
    name: 'General',
    arabicName: 'عام',
    icon: <Users className="w-5 h-5" />,
    color: 'text-gray-500',
    description: 'General Iraqi cultural and social context',
    arabicDescription: 'السياق الثقافي والاجتماعي العراقي العام',
    iraqiStandards: ['Cultural Norms', 'Social Etiquette', 'Islamic Values'],
    requiredCompliance: 'moderate',
  },
};

export const ProfessionalDomainAdmin: React.FC<ProfessionalDomainAdminProps> = ({
  className,
  showArabicLabels = false,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<ProfessionalDomain>('legal');
  const [domainSettings, setDomainSettings] = useState<Record<ProfessionalDomain, DomainSettings>>(
    {} as any
  );
  const [domainExperts, setDomainExperts] = useState<DomainExpert[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<DomainKnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpertDialog, setShowAddExpertDialog] = useState(false);

  // Load domain data
  const loadDomainData = async () => {
    try {
      setLoading(true);

      const [settingsResponse, expertsResponse, knowledgeResponse] = await Promise.all([
        fetch('/api/admin/domains/settings'),
        fetch(`/api/admin/domains/${selectedDomain}/experts`),
        fetch(`/api/admin/domains/${selectedDomain}/knowledge-bases`),
      ]);

      const settingsData = await settingsResponse.json();
      const expertsData = await expertsResponse.json();
      const knowledgeData = await knowledgeResponse.json();

      setDomainSettings(settingsData);
      setDomainExperts(expertsData);
      setKnowledgeBases(knowledgeData);
    } catch (error) {
      console.error('Failed to load domain data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomainData();
  }, [selectedDomain]);

  // Get domain configuration
  const domainConfig = DOMAIN_CONFIG[selectedDomain];
  const currentSettings = domainSettings[selectedDomain];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
        return 'text-green-600 bg-green-50';
      case 'inactive':
      case 'needs_review':
        return 'text-yellow-600 bg-yellow-50';
      case 'under_review':
      case 'non_compliant':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Update domain expert status
  const updateExpertStatus = async (expertId: string, status: DomainExpert['status']) => {
    try {
      await fetch(`/api/admin/domains/experts/${expertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      await loadDomainData();
    } catch (error) {
      console.error('Failed to update expert status:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {showArabicLabels ? 'إدارة المجالات المهنية' : 'Professional Domain Administration'}
          </h1>
          <p className="text-gray-600 mt-1">
            {showArabicLabels
              ? 'إدارة المجالات المهنية العراقية والخبراء المختصين'
              : 'Manage Iraqi professional domains and specialized experts'}
          </p>
        </div>
        <Button onClick={loadDomainData} disabled={loading}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
          {showArabicLabels ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {/* Domain Selection */}
      <Card>
        <CardHeader>
          <CardTitle>
            {showArabicLabels ? 'اختر المجال المهني' : 'Select Professional Domain'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(DOMAIN_CONFIG).map(([domain, config]) => (
              <Button
                key={domain}
                variant={selectedDomain === domain ? 'default' : 'outline'}
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => setSelectedDomain(domain as ProfessionalDomain)}
              >
                <div className={config.color}>{config.icon}</div>
                <span className="text-xs mt-1">
                  {showArabicLabels ? config.arabicName : config.name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Domain Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={domainConfig.color}>{domainConfig.icon}</div>
            {showArabicLabels ? domainConfig.arabicName : domainConfig.name}
            {showArabicLabels ? ' - نظرة عامة' : ' Domain Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{currentSettings?.activeUsers || 0}</div>
              <div className="text-sm text-gray-600">
                {showArabicLabels ? 'المستخدمون النشطون' : 'Active Users'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{domainExperts.length}</div>
              <div className="text-sm text-gray-600">
                {showArabicLabels ? 'الخبراء المختصون' : 'Domain Experts'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{currentSettings?.knowledgeBaseSize || 0}</div>
              <div className="text-sm text-gray-600">
                {showArabicLabels ? 'قواعد المعرفة' : 'Knowledge Bases'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{currentSettings?.monthlyInteractions || 0}</div>
              <div className="text-sm text-gray-600">
                {showArabicLabels ? 'التفاعلات الشهرية' : 'Monthly Interactions'}
              </div>
            </div>
          </div>

          <Alert>
            <BookOpen className="w-4 h-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">
                {showArabicLabels ? 'المعايير العراقية:' : 'Iraqi Standards:'}
              </div>
              <div className="text-sm">{domainConfig.iraqiStandards.join(' • ')}</div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Domain Management Tabs */}
      <Tabs defaultValue="experts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experts">{showArabicLabels ? 'الخبراء' : 'Experts'}</TabsTrigger>
          <TabsTrigger value="knowledge">{showArabicLabels ? 'المعرفة' : 'Knowledge'}</TabsTrigger>
          <TabsTrigger value="settings">{showArabicLabels ? 'الإعدادات' : 'Settings'}</TabsTrigger>
        </TabsList>

        {/* Domain Experts Tab */}
        <TabsContent value="experts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {showArabicLabels ? 'خبراء المجال المختصون' : 'Domain Experts'}
            </h3>
            <Dialog open={showAddExpertDialog} onOpenChange={setShowAddExpertDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {showArabicLabels ? 'إضافة خبير' : 'Add Expert'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {showArabicLabels ? 'إضافة خبير جديد' : 'Add New Domain Expert'}
                  </DialogTitle>
                  <DialogDescription>
                    {showArabicLabels
                      ? 'قم بتعيين مستخدم كخبير مختص في هذا المجال المهني'
                      : 'Assign a user as a specialist expert for this professional domain'}
                  </DialogDescription>
                </DialogHeader>
                {/* Add expert form would go here */}
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{showArabicLabels ? 'الخبير' : 'Expert'}</TableHead>
                    <TableHead>{showArabicLabels ? 'التخصصات' : 'Specializations'}</TableHead>
                    <TableHead>{showArabicLabels ? 'الخبرة' : 'Experience'}</TableHead>
                    <TableHead>{showArabicLabels ? 'الامتثال' : 'Compliance'}</TableHead>
                    <TableHead>{showArabicLabels ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead>{showArabicLabels ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domainExperts.map(expert => (
                    <TableRow key={expert.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expert.user.fullName}</div>
                          <div className="text-sm text-gray-600">{expert.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {expert.specializations.slice(0, 2).map(spec => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {expert.specializations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{expert.specializations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{expert.experienceYears}</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {showArabicLabels ? 'سنوات' : 'years'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-sm font-medium ${
                              expert.complianceScore >= 90
                                ? 'text-green-600'
                                : expert.complianceScore >= 70
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {expert.complianceScore}%
                          </div>
                          {expert.complianceScore >= 90 ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : expert.complianceScore >= 70 ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expert.status)}>
                          {expert.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {expert.status === 'under_review' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateExpertStatus(expert.id, 'active')}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateExpertStatus(expert.id, 'inactive')}
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {showArabicLabels ? 'قواعد المعرفة المتخصصة' : 'Domain Knowledge Bases'}
            </h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {showArabicLabels ? 'إضافة قاعدة معرفة' : 'Add Knowledge Base'}
            </Button>
          </div>

          <div className="grid gap-4">
            {knowledgeBases.map(kb => (
              <Card key={kb.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {showArabicLabels ? kb.arabicTitle || kb.title : kb.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{kb.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          {kb.documentCount} {showArabicLabels ? 'وثيقة' : 'documents'}
                        </span>
                        <span className="text-sm">
                          <Users className="w-4 h-4 inline mr-1" />
                          {kb.contributors.length} {showArabicLabels ? 'مساهم' : 'contributors'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {showArabicLabels ? 'آخر تحديث:' : 'Updated:'}{' '}
                          {kb.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={getStatusColor(kb.complianceStatus)}>
                        {kb.complianceStatus.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">
            {showArabicLabels ? 'إعدادات المجال' : 'Domain Settings'}
          </h3>

          {currentSettings && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {showArabicLabels ? 'متطلبات الخبراء' : 'Expert Requirements'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      {showArabicLabels ? 'الحد الأدنى لسنوات الخبرة' : 'Minimum Experience Years'}
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.expertRequirements.minExperienceYears}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {showArabicLabels ? 'عتبة الامتثال' : 'Compliance Threshold'}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={currentSettings.expertRequirements.complianceThreshold}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {showArabicLabels ? 'مستوى الامتثال المطلوب' : 'Required Compliance Level'}
                    </label>
                    <Select value={currentSettings.complianceLevel}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">
                          {showArabicLabels ? 'صارم' : 'Strict'}
                        </SelectItem>
                        <SelectItem value="moderate">
                          {showArabicLabels ? 'معتدل' : 'Moderate'}
                        </SelectItem>
                        <SelectItem value="flexible">
                          {showArabicLabels ? 'مرن' : 'Flexible'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {showArabicLabels ? 'الشهادات المطلوبة' : 'Required Certifications'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentSettings.expertRequirements.requiredCertifications.map(
                      (cert, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span>{cert}</span>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      )
                    )}
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      {showArabicLabels ? 'إضافة شهادة' : 'Add Certification'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
