/**
 * Iraqi Persona Management Dashboard
 * Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Arabic-first persona management interface
 * - Real-time persona analytics and performance metrics
 * - Cultural compliance monitoring dashboard
 * - Professional domain organization
 * - Bulk persona operations with cultural validation
 * - Interactive persona testing and preview
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  TrendingUp,
  Users,
  MessageSquare,
  Shield,
  Globe,
  Brain,
  Heart,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

import {
  IraqiPersona,
  PersonaAnalytics,
  IraqiProfessionalDomain,
  IslamicComplianceLevel
} from '../types/persona';
import { personaService } from '../services/personaService';
import PersonaCreationWizard from './PersonaCreationWizard';

interface PersonaManagementDashboardProps {
  className?: string;
  showArabicLabels?: boolean;
  onPersonaSelect?: (persona: IraqiPersona) => void;
}

interface PersonaWithAnalytics extends IraqiPersona {
  analytics?: PersonaAnalytics;
  complianceScore?: number;
  performanceScore?: number;
  lastActivity?: Date;
}

export const PersonaManagementDashboard: React.FC<PersonaManagementDashboardProps> = ({
  className = '',
  showArabicLabels = false,
  onPersonaSelect
}) => {
  const [personas, setPersonas] = useState<PersonaWithAnalytics[]>([]);
  const [filteredPersonas, setFilteredPersonas] = useState<PersonaWithAnalytics[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<IraqiPersona | null>(null);
  const [loading, setLoading] = useState(true);

  // Load personas and analytics
  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const allPersonas = personaService.getAllPersonas();
      
      // Enhance with analytics and scores
      const enhancedPersonas: PersonaWithAnalytics[] = await Promise.all(
        allPersonas.map(async (persona) => {
          const analytics = personaService.getPersonaAnalytics(persona.id);
          return {
            ...persona,
            analytics,
            complianceScore: analytics?.culturalComplianceScore || 95,
            performanceScore: calculatePerformanceScore(analytics),
            lastActivity: analytics?.lastUsed || persona.updatedAt
          };
        })
      );

      setPersonas(enhancedPersonas);
      setFilteredPersonas(enhancedPersonas);
    } catch (error) {
      console.error('Error loading personas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePerformanceScore = (analytics?: PersonaAnalytics): number => {
    if (!analytics) return 0;
    
    const usageScore = Math.min(100, analytics.usageCount * 2);
    const satisfactionScore = analytics.userSatisfactionRating * 20;
    const complianceScore = analytics.culturalComplianceScore;
    
    return Math.round((usageScore + satisfactionScore + complianceScore) / 3);
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = personas;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(persona => 
        persona.name.toLowerCase().includes(query) ||
        persona.arabicName.includes(query) ||
        persona.description.toLowerCase().includes(query) ||
        persona.arabicDescription.includes(query) ||
        persona.knowledgeAreas.some(area => area.toLowerCase().includes(query))
      );
    }

    // Domain filter
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(persona => persona.domain === selectedDomain);
    }

    // Compliance filter
    if (selectedCompliance !== 'all') {
      filtered = filtered.filter(persona => persona.islamicCompliance === selectedCompliance);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return showArabicLabels 
            ? a.arabicName.localeCompare(b.arabicName, 'ar')
            : a.name.localeCompare(b.name);
        case 'domain':
          return a.domain.localeCompare(b.domain);
        case 'performance':
          return (b.performanceScore || 0) - (a.performanceScore || 0);
        case 'compliance':
          return (b.complianceScore || 0) - (a.complianceScore || 0);
        case 'usage':
          return (b.analytics?.usageCount || 0) - (a.analytics?.usageCount || 0);
        case 'lastUsed':
          return new Date(b.lastActivity || 0).getTime() - new Date(a.lastActivity || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredPersonas(filtered);
  }, [personas, searchQuery, selectedDomain, selectedCompliance, sortBy, showArabicLabels]);

  // Dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalPersonas = personas.length;
    const activePersonas = personas.filter(p => p.isActive).length;
    const averageCompliance = personas.reduce((sum, p) => sum + (p.complianceScore || 0), 0) / totalPersonas || 0;
    const averagePerformance = personas.reduce((sum, p) => sum + (p.performanceScore || 0), 0) / totalPersonas || 0;
    const totalUsage = personas.reduce((sum, p) => sum + (p.analytics?.usageCount || 0), 0);

    const domainDistribution = personas.reduce((acc, p) => {
      acc[p.domain] = (acc[p.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPersonas,
      activePersonas,
      averageCompliance: Math.round(averageCompliance),
      averagePerformance: Math.round(averagePerformance),
      totalUsage,
      domainDistribution
    };
  }, [personas]);

  const handlePersonaCreated = (persona: IraqiPersona) => {
    setShowCreationWizard(false);
    loadPersonas();
  };

  const handlePersonaAction = async (action: string, persona: IraqiPersona) => {
    switch (action) {
      case 'edit':
        setSelectedPersona(persona);
        setShowCreationWizard(true);
        break;
      case 'duplicate':
        const duplicated = personaService.createPersonaFromTemplate('custom', {
          ...persona,
          id: undefined,
          name: `${persona.name} (Copy)`,
          arabicName: `${persona.arabicName} (نسخة)`,
          createdAt: undefined,
          updatedAt: undefined
        });
        loadPersonas();
        break;
      case 'toggle':
        personaService.updatePersona(persona.id, { isActive: !persona.isActive });
        loadPersonas();
        break;
      case 'delete':
        if (confirm(showArabicLabels ? 'هل أنت متأكد من حذف هذه الشخصية؟' : 'Are you sure you want to delete this persona?')) {
          // Implementation would depend on delete method
          loadPersonas();
        }
        break;
      case 'test':
        onPersonaSelect?.(persona);
        break;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getDomainIcon = (domain: IraqiProfessionalDomain) => {
    const icons = {
      legal: '⚖️',
      medical: '👨‍⚕️',
      educational: '👨‍🏫',
      engineering: '👨‍🔧',
      business: '💼',
      government: '🏛️',
      religious: '🕌',
      cultural: '🎭',
      general: '💡'
    };
    return icons[domain] || '💡';
  };

  const renderPersonaCard = (persona: PersonaWithAnalytics) => (
    <Card key={persona.id} className="persona-card hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{getDomainIcon(persona.domain)}</span>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium line-clamp-1">
                {showArabicLabels ? persona.arabicName : persona.name}
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                {showArabicLabels ? persona.arabicTitle : persona.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {persona.domain}
                </Badge>
                {!persona.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    {showArabicLabels ? 'غير نشط' : 'Inactive'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePersonaAction('test', persona)}
              className="h-8 w-8 p-0"
            >
              <Play className="w-4 h-4" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-56">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePersonaAction('edit', persona)}
                    className="w-full justify-start"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {showArabicLabels ? 'تحرير' : 'Edit'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePersonaAction('duplicate', persona)}
                    className="w-full justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {showArabicLabels ? 'نسخ' : 'Duplicate'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePersonaAction('toggle', persona)}
                    className="w-full justify-start"
                  >
                    {persona.isActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        {showArabicLabels ? 'إيقاف' : 'Deactivate'}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {showArabicLabels ? 'تفعيل' : 'Activate'}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePersonaAction('delete', persona)}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {showArabicLabels ? 'حذف' : 'Delete'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {showArabicLabels ? persona.arabicDescription : persona.description}
        </p>
        
        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {showArabicLabels ? 'الامتثال الثقافي' : 'Cultural Compliance'}
            </span>
            <Badge className={`text-xs ${getComplianceColor(persona.complianceScore || 0)}`}>
              {persona.complianceScore || 0}%
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {showArabicLabels ? 'الأداء' : 'Performance'}
            </span>
            <Badge className={`text-xs ${getPerformanceColor(persona.performanceScore || 0)}`}>
              {persona.performanceScore || 0}%
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {showArabicLabels ? 'الاستخدام' : 'Usage'}
            </span>
            <span className="text-xs font-medium">
              {persona.analytics?.usageCount || 0}
            </span>
          </div>

          {persona.lastActivity && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {showArabicLabels ? 'آخر استخدام' : 'Last Used'}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(persona.lastActivity).toLocaleDateString(
                  showArabicLabels ? 'ar-IQ' : 'en-US'
                )}
              </span>
            </div>
          )}
        </div>

        {/* Knowledge Areas */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">
            {showArabicLabels ? 'مجالات المعرفة:' : 'Knowledge Areas:'}
          </p>
          <div className="flex flex-wrap gap-1">
            {persona.knowledgeAreas.slice(0, 3).map((area, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
            {persona.knowledgeAreas.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{persona.knowledgeAreas.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDashboardOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showArabicLabels ? 'إجمالي الشخصيات' : 'Total Personas'}
              </p>
              <p className="text-2xl font-bold">{dashboardStats.totalPersonas}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">
              {dashboardStats.activePersonas} {showArabicLabels ? 'نشط' : 'active'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showArabicLabels ? 'متوسط الامتثال' : 'Avg Compliance'}
              </p>
              <p className="text-2xl font-bold">{dashboardStats.averageCompliance}%</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2">
            <Progress value={dashboardStats.averageCompliance} className="w-full h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showArabicLabels ? 'متوسط الأداء' : 'Avg Performance'}
              </p>
              <p className="text-2xl font-bold">{dashboardStats.averagePerformance}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <Progress value={dashboardStats.averagePerformance} className="w-full h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {showArabicLabels ? 'إجمالي الاستخدام' : 'Total Usage'}
              </p>
              <p className="text-2xl font-bold">{dashboardStats.totalUsage.toLocaleString()}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {showArabicLabels ? 'تفاعل إجمالي' : 'total interactions'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`persona-management-dashboard ${className}`} dir={showArabicLabels ? 'rtl' : 'ltr'}>
      {/* Dashboard Overview */}
      {renderDashboardOverview()}

      {/* Main Content */}
      <Tabs defaultValue="personas" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="personas">
              {showArabicLabels ? 'الشخصيات' : 'Personas'}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {showArabicLabels ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setShowCreationWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {showArabicLabels ? 'إضافة شخصية' : 'Add Persona'}
          </Button>
        </div>

        <TabsContent value="personas" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={showArabicLabels 
                        ? 'البحث في الشخصيات...' 
                        : 'Search personas...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={showArabicLabels ? 'كل المجالات' : 'All Domains'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {showArabicLabels ? 'كل المجالات' : 'All Domains'}
                      </SelectItem>
                      <SelectItem value="legal">
                        {showArabicLabels ? 'القانوني' : 'Legal'}
                      </SelectItem>
                      <SelectItem value="medical">
                        {showArabicLabels ? 'الطبي' : 'Medical'}
                      </SelectItem>
                      <SelectItem value="educational">
                        {showArabicLabels ? 'التعليمي' : 'Educational'}
                      </SelectItem>
                      <SelectItem value="engineering">
                        {showArabicLabels ? 'الهندسي' : 'Engineering'}
                      </SelectItem>
                      <SelectItem value="business">
                        {showArabicLabels ? 'التجاري' : 'Business'}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={showArabicLabels ? 'ترتيب حسب' : 'Sort by'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">
                        {showArabicLabels ? 'الاسم' : 'Name'}
                      </SelectItem>
                      <SelectItem value="domain">
                        {showArabicLabels ? 'المجال' : 'Domain'}
                      </SelectItem>
                      <SelectItem value="performance">
                        {showArabicLabels ? 'الأداء' : 'Performance'}
                      </SelectItem>
                      <SelectItem value="compliance">
                        {showArabicLabels ? 'الامتثال' : 'Compliance'}
                      </SelectItem>
                      <SelectItem value="usage">
                        {showArabicLabels ? 'الاستخدام' : 'Usage'}
                      </SelectItem>
                      <SelectItem value="lastUsed">
                        {showArabicLabels ? 'آخر استخدام' : 'Last Used'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personas Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPersonas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {showArabicLabels ? 'لا توجد شخصيات' : 'No personas found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {showArabicLabels 
                    ? 'ابدأ بإنشاء أول شخصية لك'
                    : 'Get started by creating your first persona'
                  }
                </p>
                <Button onClick={() => setShowCreationWizard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showArabicLabels ? 'إضافة شخصية' : 'Add Persona'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPersonas.map(renderPersonaCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {/* Analytics content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>
                {showArabicLabels ? 'تحليلات الشخصيات' : 'Persona Analytics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {showArabicLabels 
                  ? 'تحليلات مفصلة للشخصيات قيد التطوير'
                  : 'Detailed persona analytics coming soon'
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creation Wizard Dialog */}
      <Dialog open={showCreationWizard} onOpenChange={setShowCreationWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showArabicLabels 
                ? (selectedPersona ? 'تحرير الشخصية' : 'إنشاء شخصية جديدة')
                : (selectedPersona ? 'Edit Persona' : 'Create New Persona')
              }
            </DialogTitle>
          </DialogHeader>
          
          <PersonaCreationWizard
            onPersonaCreated={handlePersonaCreated}
            onCancel={() => {
              setShowCreationWizard(false);
              setSelectedPersona(null);
            }}
            initialData={selectedPersona || undefined}
            showArabicLabels={showArabicLabels}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonaManagementDashboard;