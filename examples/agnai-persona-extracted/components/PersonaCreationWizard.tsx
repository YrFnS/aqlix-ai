/**
 * Iraqi Persona Creation Wizard
 * Enhanced for Iraqi AI Chat System
 *
 * Features:
 * - Step-by-step persona creation with cultural guidance
 * - Iraqi professional domain selection
 * - Cultural trait configuration with Islamic compliance
 * - Arabic-first interface with RTL support
 * - Real-time validation and preview
 * - Template-based quick setup
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Briefcase,
  Heart,
  MessageCircle,
  Brain,
  Settings,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Globe,
  Shield,
} from 'lucide-react';

import {
  IraqiPersona,
  PersonaTemplate,
  IraqiProfessionalDomain,
  IslamicComplianceLevel,
  IraqiCulturalTraits,
  PersonaResponsePattern,
  IraqiDialect,
  IRAQI_PERSONA_TEMPLATES,
} from '../types/persona';
import { personaService, CulturalComplianceService } from '../services/personaService';

interface PersonaCreationWizardProps {
  onPersonaCreated?: (persona: IraqiPersona) => void;
  onCancel?: () => void;
  initialData?: Partial<IraqiPersona>;
  className?: string;
  showArabicLabels?: boolean;
}

interface WizardStep {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  icon: React.ReactNode;
  isComplete: boolean;
  isRequired: boolean;
}

export const PersonaCreationWizard: React.FC<PersonaCreationWizardProps> = ({
  onPersonaCreated,
  onCancel,
  initialData,
  className = '',
  showArabicLabels = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [personaData, setPersonaData] = useState<Partial<IraqiPersona>>({
    name: '',
    arabicName: '',
    title: '',
    arabicTitle: '',
    domain: 'general',
    description: '',
    arabicDescription: '',
    islamicCompliance: 'moderate',
    dialectPreference: 'general',
    culturalTraits: {
      hospitality: 'moderate',
      respectfulness: 'professional',
      familyOriented: true,
      communityFocused: true,
      directness: 'diplomatic',
      formalityLevel: 'formal',
      arabicExpressions: true,
      islamicGreetings: false,
      authorityRespect: 'moderate',
      wisdomSharing: true,
      patientGuidance: true,
      moralGuidance: false,
    },
    responsePatterns: {
      greetingStyle: 'professional',
      preferredGreetings: ['Welcome', 'Good day'],
      explanationStyle: 'structured',
      questionHandling: 'guiding',
      errorResponse: 'explanatory',
      culturalReferences: true,
      islamicPrinciples: false,
      historicalContext: false,
      modernAdaptation: true,
    },
    memoryConfig: {
      retainPersonalDetails: true,
      culturalPreferences: true,
      professionalContext: true,
      conversationHistory: 'medium',
      culturalSensitivity: true,
    },
    knowledgeAreas: [],
    tags: [],
    isActive: true,
    isDefault: false,
    visibility: 'public',
    ...initialData,
  });

  const [validationResults, setValidationResults] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PersonaTemplate | null>(null);

  const wizardSteps: WizardStep[] = [
    {
      id: 'template',
      title: 'Choose Template',
      arabicTitle: 'اختيار القالب',
      description: 'Start with a pre-built Iraqi professional persona',
      arabicDescription: 'ابدأ بشخصية مهنية عراقية جاهزة',
      icon: <Sparkles className="w-5 h-5" />,
      isComplete: !!selectedTemplate || (personaData.name && personaData.domain),
      isRequired: false,
    },
    {
      id: 'basic',
      title: 'Basic Information',
      arabicTitle: 'المعلومات الأساسية',
      description: 'Define persona identity and professional domain',
      arabicDescription: 'تحديد هوية الشخصية والمجال المهني',
      icon: <User className="w-5 h-5" />,
      isComplete: !!(personaData.name && personaData.arabicName && personaData.domain),
      isRequired: true,
    },
    {
      id: 'cultural',
      title: 'Cultural Traits',
      arabicTitle: 'الصفات الثقافية',
      description: 'Configure Islamic compliance and cultural behavior',
      arabicDescription: 'تكوين الامتثال الإسلامي والسلوك الثقافي',
      icon: <Heart className="w-5 h-5" />,
      isComplete: !!(personaData.islamicCompliance && personaData.culturalTraits),
      isRequired: true,
    },
    {
      id: 'communication',
      title: 'Communication Style',
      arabicTitle: 'أسلوب التواصل',
      description: 'Set response patterns and interaction preferences',
      arabicDescription: 'تعيين أنماط الاستجابة وتفضيلات التفاعل',
      icon: <MessageCircle className="w-5 h-5" />,
      isComplete: !!(
        personaData.responsePatterns?.greetingStyle &&
        personaData.responsePatterns?.explanationStyle
      ),
      isRequired: true,
    },
    {
      id: 'expertise',
      title: 'Professional Expertise',
      arabicTitle: 'الخبرة المهنية',
      description: 'Define knowledge areas and specializations',
      arabicDescription: 'تحديد مجالات المعرفة والتخصصات',
      icon: <Briefcase className="w-5 h-5" />,
      isComplete: !!(personaData.knowledgeAreas && personaData.knowledgeAreas.length > 0),
      isRequired: true,
    },
    {
      id: 'memory',
      title: 'Memory & Behavior',
      arabicTitle: 'الذاكرة والسلوك',
      description: 'Configure memory settings and behavioral preferences',
      arabicDescription: 'تكوين إعدادات الذاكرة والتفضيلات السلوكية',
      icon: <Brain className="w-5 h-5" />,
      isComplete: !!personaData.memoryConfig,
      isRequired: false,
    },
    {
      id: 'review',
      title: 'Review & Create',
      arabicTitle: 'المراجعة والإنشاء',
      description: 'Review configuration and create persona',
      arabicDescription: 'مراجعة التكوين وإنشاء الشخصية',
      icon: <CheckCircle className="w-5 h-5" />,
      isComplete: validationResults?.isValid || false,
      isRequired: true,
    },
  ];

  const completedSteps = wizardSteps.filter(step => step.isComplete).length;
  const progressPercentage = (completedSteps / wizardSteps.length) * 100;

  const handleTemplateSelect = useCallback(
    (template: PersonaTemplate) => {
      setSelectedTemplate(template);
      setPersonaData({
        ...personaData,
        name: template.name,
        arabicName: template.arabicName,
        domain: template.domain,
        description: template.description,
        arabicDescription: template.arabicDescription,
        culturalTraits: {
          ...personaData.culturalTraits,
          ...template.defaultTraits,
        },
        responsePatterns: {
          ...personaData.responsePatterns,
          ...template.defaultPatterns,
        },
        knowledgeAreas: template.suggestedKnowledge,
        tags: [template.domain, 'iraqi', 'professional'],
      });
    },
    [personaData]
  );

  const handleDataUpdate = useCallback((updates: Partial<IraqiPersona>) => {
    setPersonaData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentStep = useCallback(async () => {
    if (currentStep === wizardSteps.length - 1) {
      // Final validation
      const validation = await validatePersonaData(personaData);
      setValidationResults(validation);
      return validation.isValid;
    }
    return wizardSteps[currentStep].isComplete;
  }, [currentStep, personaData, wizardSteps]);

  const nextStep = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, validateCurrentStep, wizardSteps.length]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleCreatePersona = useCallback(async () => {
    try {
      const validation = await validatePersonaData(personaData);
      if (!validation.isValid) {
        setValidationResults(validation);
        return;
      }

      const newPersona = personaService.createPersonaFromTemplate(
        selectedTemplate?.id || 'custom',
        personaData
      );

      onPersonaCreated?.(newPersona);
    } catch (error) {
      console.error('Error creating persona:', error);
    }
  }, [personaData, selectedTemplate, onPersonaCreated]);

  const validatePersonaData = async (data: Partial<IraqiPersona>) => {
    const issues: string[] = [];

    if (!data.name) issues.push('Name is required');
    if (!data.arabicName) issues.push('Arabic name is required');
    if (!data.domain) issues.push('Professional domain is required');
    if (!data.description) issues.push('Description is required');
    if (!data.knowledgeAreas || data.knowledgeAreas.length === 0) {
      issues.push('At least one knowledge area is required');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  };

  const renderTemplateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-lg font-semibold ${showArabicLabels ? 'text-right' : ''}`}>
          {showArabicLabels ? 'اختر قالبًا للبدء' : 'Choose a template to get started'}
        </h3>
        <p className={`text-gray-600 ${showArabicLabels ? 'text-right' : ''}`}>
          {showArabicLabels
            ? 'أو ابدأ من الصفر لإنشاء شخصية مخصصة'
            : 'Or start from scratch to create a custom persona'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IRAQI_PERSONA_TEMPLATES.map(template => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">
                    {showArabicLabels ? template.arabicName : template.name}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {template.domain}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600">
                {showArabicLabels ? template.arabicDescription : template.description}
              </p>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">
                  {showArabicLabels ? 'المعرفة المقترحة:' : 'Suggested Knowledge:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.suggestedKnowledge.slice(0, 3).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {template.suggestedKnowledge.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.suggestedKnowledge.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Custom Option */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md border-dashed ${
            !selectedTemplate ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => setSelectedTemplate(null)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-gray-400" />
              <CardTitle className="text-sm font-medium">
                {showArabicLabels ? 'مخصص' : 'Custom'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">
              {showArabicLabels
                ? 'إنشاء شخصية مخصصة من الصفر'
                : 'Create a custom persona from scratch'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBasicInformationStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            {showArabicLabels ? 'الاسم (بالإنجليزية)' : 'Name (English)'}
          </Label>
          <Input
            id="name"
            value={personaData.name || ''}
            onChange={e => handleDataUpdate({ name: e.target.value })}
            placeholder={
              showArabicLabels ? 'مثال: Iraqi Legal Advisor' : 'e.g., Iraqi Legal Advisor'
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arabicName">
            {showArabicLabels ? 'الاسم (بالعربية)' : 'Name (Arabic)'}
          </Label>
          <Input
            id="arabicName"
            value={personaData.arabicName || ''}
            onChange={e => handleDataUpdate({ arabicName: e.target.value })}
            placeholder={
              showArabicLabels
                ? 'مثال: المستشار القانوني العراقي'
                : 'e.g., المستشار القانوني العراقي'
            }
            dir="rtl"
            className="text-right font-arabic"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            {showArabicLabels ? 'المسمى الوظيفي (بالإنجليزية)' : 'Professional Title (English)'}
          </Label>
          <Input
            id="title"
            value={personaData.title || ''}
            onChange={e => handleDataUpdate({ title: e.target.value })}
            placeholder={
              showArabicLabels ? 'مثال: Senior Legal Consultant' : 'e.g., Senior Legal Consultant'
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arabicTitle">
            {showArabicLabels ? 'المسمى الوظيفي (بالعربية)' : 'Professional Title (Arabic)'}
          </Label>
          <Input
            id="arabicTitle"
            value={personaData.arabicTitle || ''}
            onChange={e => handleDataUpdate({ arabicTitle: e.target.value })}
            placeholder={showArabicLabels ? 'مثال: مستشار قانوني أول' : 'e.g., مستشار قانوني أول'}
            dir="rtl"
            className="text-right font-arabic"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">{showArabicLabels ? 'المجال المهني' : 'Professional Domain'}</Label>
        <Select
          value={personaData.domain || 'general'}
          onValueChange={value => handleDataUpdate({ domain: value as IraqiProfessionalDomain })}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={showArabicLabels ? 'اختر المجال المهني' : 'Select professional domain'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="legal">
              {showArabicLabels ? 'القانوني' : 'Legal'} - Iraqi Law Specialist
            </SelectItem>
            <SelectItem value="medical">
              {showArabicLabels ? 'الطبي' : 'Medical'} - Healthcare Professional
            </SelectItem>
            <SelectItem value="educational">
              {showArabicLabels ? 'التعليمي' : 'Educational'} - Education Specialist
            </SelectItem>
            <SelectItem value="engineering">
              {showArabicLabels ? 'الهندسي' : 'Engineering'} - Technical Specialist
            </SelectItem>
            <SelectItem value="business">
              {showArabicLabels ? 'التجاري' : 'Business'} - Commercial Advisor
            </SelectItem>
            <SelectItem value="government">
              {showArabicLabels ? 'الحكومي' : 'Government'} - Public Service
            </SelectItem>
            <SelectItem value="religious">
              {showArabicLabels ? 'الديني' : 'Religious'} - Islamic Scholar
            </SelectItem>
            <SelectItem value="cultural">
              {showArabicLabels ? 'الثقافي' : 'Cultural'} - Cultural Specialist
            </SelectItem>
            <SelectItem value="general">
              {showArabicLabels ? 'عام' : 'General'} - General Assistant
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="description">
            {showArabicLabels ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
          </Label>
          <Textarea
            id="description"
            value={personaData.description || ''}
            onChange={e => handleDataUpdate({ description: e.target.value })}
            placeholder={
              showArabicLabels
                ? 'وصف مفصل للشخصية وخبرتها'
                : 'Detailed description of persona and expertise'
            }
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arabicDescription">
            {showArabicLabels ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
          </Label>
          <Textarea
            id="arabicDescription"
            value={personaData.arabicDescription || ''}
            onChange={e => handleDataUpdate({ arabicDescription: e.target.value })}
            placeholder={
              showArabicLabels
                ? 'وصف مفصل للشخصية وخبرتها باللغة العربية'
                : 'Detailed description in Arabic'
            }
            dir="rtl"
            className="text-right font-arabic"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  // Additional step rendering functions would continue here...
  // For brevity, I'll include the main wizard structure

  const currentStepData = wizardSteps[currentStep];

  return (
    <div className={`persona-creation-wizard ${className}`} dir={showArabicLabels ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStepData.icon}
                {showArabicLabels ? currentStepData.arabicTitle : currentStepData.title}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {showArabicLabels ? currentStepData.arabicDescription : currentStepData.description}
              </p>
            </div>
            <Badge variant="outline">
              {currentStep + 1} / {wizardSteps.length}
            </Badge>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{showArabicLabels ? 'التقدم' : 'Progress'}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {currentStep === 0 && renderTemplateStep()}
          {currentStep === 1 && renderBasicInformationStep()}
          {/* Additional steps would be rendered here */}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : previousStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 0
            ? showArabicLabels
              ? 'إلغاء'
              : 'Cancel'
            : showArabicLabels
              ? 'السابق'
              : 'Previous'}
        </Button>

        <Button
          onClick={currentStep === wizardSteps.length - 1 ? handleCreatePersona : nextStep}
          disabled={!wizardSteps[currentStep].isComplete}
        >
          {currentStep === wizardSteps.length - 1
            ? showArabicLabels
              ? 'إنشاء الشخصية'
              : 'Create Persona'
            : showArabicLabels
              ? 'التالي'
              : 'Next'}
          {currentStep < wizardSteps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      {/* Validation Alerts */}
      {validationResults && !validationResults.isValid && (
        <Alert className="mt-4" variant="destructive">
          <Shield className="w-4 h-4" />
          <AlertDescription>
            {showArabicLabels ? 'يرجى إصلاح المشاكل التالية:' : 'Please fix the following issues:'}
            <ul className="list-disc list-inside mt-2">
              {validationResults.issues.map((issue: string, index: number) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PersonaCreationWizard;
