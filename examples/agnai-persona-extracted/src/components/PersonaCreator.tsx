/**
 * Iraqi AI Persona Creator Component
 * Arabic/English persona creation with cultural compliance validation
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  User, 
  Globe, 
  Heart, 
  Shield, 
  Brain, 
  MessageCircle, 
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

import {
  IraqiPersona,
  PersonaCreationRequest,
  IraqiProfessionalDomain,
  IraqiGovernorate,
  PersonaValidationResult,
  ValidationIssue
} from '../types/persona';

interface PersonaCreatorProps {
  onPersonaCreated: (persona: IraqiPersona) => void;
  onCancel: () => void;
  isRTL: boolean;
  language: 'ar' | 'en';
  initialData?: Partial<PersonaCreationRequest>;
  professionalTemplate?: string;
}

interface FormStep {
  id: string;
  title: string;
  titleAr: string;
  icon: React.ReactNode;
  completed: boolean;
  valid: boolean;
}

const PersonaCreator: React.FC<PersonaCreatorProps> = ({
  onPersonaCreated,
  onCancel,
  isRTL,
  language,
  initialData,
  professionalTemplate
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<PersonaValidationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<PersonaCreationRequest>({
    basicInfo: {
      name: '',
      nameArabic: '',
      description: '',
      descriptionArabic: ''
    },
    professionalDomain: 'general',
    governorate: 'baghdad',
    culturalProfile: {
      primaryLanguage: 'bilingual',
      dialectPreference: 'baghdadi',
      formalityLevel: 'semi_formal',
      culturalSensitivity: 95,
      regionalAdaptation: true,
      traditionalValues: true,
      professionalTerminology: true,
      domainSpecificLanguage: true,
      governmentCompliance: true
    },
    islamicCompliance: {
      islamicValuesCompliance: 96,
      halalContentOnly: true,
      respectForIslamicPrinciples: true,
      prayerTimeAwareness: true,
      islamicCalendarIntegration: true,
      ramadanConsiderations: true,
      prohibitedContentFiltering: true,
      islamicEthicsGuidelines: true,
      familyValuesAlignment: true,
      islamicProfessionalEthics: true,
      shariahCompliantAdvice: true,
      islamicBusinessPrinciples: true
    },
    personality: {
      openness: 75,
      conscientiousness: 85,
      extraversion: 70,
      agreeableness: 80,
      neuroticism: 20,
      hospitalityLevel: 90,
      respectForElders: 95,
      familyOrientation: 85,
      communityFocus: 80,
      expertise: 75,
      helpfulness: 90,
      professionalism: 85,
      patience: 80
    },
    communicationStyle: {
      verbosity: 'adaptive',
      explanationDepth: 'intermediate',
      exampleUsage: true,
      indirectCommunication: true,
      respectfulAddress: true,
      contextualGreeting: true,
      professionalTone: true,
      technicalAccuracy: true,
      disclaimerUsage: true,
      arabicPhraseIntegration: true,
      islamicGreetings: true,
      culturalReferences: true
    },
    responsePatterns: {
      introductionStyle: 'warm',
      conclusionStyle: 'offer_help',
      hospitalityExpressions: true,
      blessingIntegration: true,
      respectfulClosing: true,
      expertiseDisclaimer: true,
      referralSuggestions: true,
      followUpOffers: true,
      apologeticTone: true,
      alternativeSuggestions: true,
      escalationProtocol: true
    },
    memorySettings: {
      shortTermMemory: 50,
      longTermMemory: 100,
      contextualMemory: 75,
      personalPreferences: true,
      professionalContext: true,
      culturalAdaptation: true,
      conversationHistory: true,
      arabicTerminology: true,
      professionalRelationships: true,
      culturalSensitivities: true,
      dataRetentionDays: 30,
      sensitiveDataHandling: 'encrypt',
      complianceLogging: true
    },
    tags: []
  });

  // Initialize with template or initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Form steps configuration
  const steps: FormStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      titleAr: 'المعلومات الأساسية',
      icon: <User className="w-5 h-5" />,
      completed: false,
      valid: false
    },
    {
      id: 'professional',
      title: 'Professional Domain',
      titleAr: 'المجال المهني',
      icon: <Globe className="w-5 h-5" />,
      completed: false,
      valid: false
    },
    {
      id: 'cultural',
      title: 'Cultural Profile',
      titleAr: 'الملف الثقافي',
      icon: <Heart className="w-5 h-5" />,
      completed: false,
      valid: false
    },
    {
      id: 'islamic',
      title: 'Islamic Compliance',
      titleAr: 'الامتثال الإسلامي',
      icon: <Shield className="w-5 h-5" />,
      completed: false,
      valid: false
    },
    {
      id: 'personality',
      title: 'Personality Traits',
      titleAr: 'السمات الشخصية',
      icon: <Brain className="w-5 h-5" />,
      completed: false,
      valid: false
    },
    {
      id: 'communication',
      title: 'Communication Style',
      titleAr: 'أسلوب التواصل',
      icon: <MessageCircle className="w-5 h-5" />,
      completed: false,
      valid: false
    },
    {
      id: 'memory',
      title: 'Memory Settings',
      titleAr: 'إعدادات الذاكرة',
      icon: <Settings className="w-5 h-5" />,
      completed: false,
      valid: false
    }
  ];

  // Professional domain options
  const professionalDomains: { value: IraqiProfessionalDomain; label: string; labelAr: string }[] = [
    { value: 'legal', label: 'Legal Professional', labelAr: 'متخصص قانوني' },
    { value: 'medical', label: 'Medical Professional', labelAr: 'متخصص طبي' },
    { value: 'educational', label: 'Educational Professional', labelAr: 'متخصص تعليمي' },
    { value: 'engineering', label: 'Engineering Professional', labelAr: 'مهندس متخصص' },
    { value: 'business', label: 'Business Professional', labelAr: 'متخصص أعمال' },
    { value: 'government', label: 'Government Official', labelAr: 'موظف حكومي' },
    { value: 'religious', label: 'Religious Scholar', labelAr: 'عالم دين' },
    { value: 'cultural', label: 'Cultural Expert', labelAr: 'خبير ثقافي' },
    { value: 'technology', label: 'Technology Professional', labelAr: 'متخصص تقني' },
    { value: 'general', label: 'General Assistant', labelAr: 'مساعد عام' }
  ];

  // Governorate options
  const governorates: { value: IraqiGovernorate; label: string; labelAr: string }[] = [
    { value: 'baghdad', label: 'Baghdad', labelAr: 'بغداد' },
    { value: 'basra', label: 'Basra', labelAr: 'البصرة' },
    { value: 'mosul', label: 'Mosul', labelAr: 'الموصل' },
    { value: 'erbil', label: 'Erbil', labelAr: 'أربيل' },
    { value: 'najaf', label: 'Najaf', labelAr: 'النجف' },
    { value: 'karbala', label: 'Karbala', labelAr: 'كربلاء' },
    { value: 'hillah', label: 'Hillah', labelAr: 'الحلة' },
    { value: 'ramadi', label: 'Ramadi', labelAr: 'الرمادي' },
    { value: 'kirkuk', label: 'Kirkuk', labelAr: 'كركوك' },
    { value: 'dohuk', label: 'Dohuk', labelAr: 'دهوك' },
    { value: 'samarra', label: 'Samarra', labelAr: 'سامراء' },
    { value: 'kut', label: 'Kut', labelAr: 'الكوت' },
    { value: 'amarah', label: 'Amarah', labelAr: 'العمارة' },
    { value: 'nasiriyah', label: 'Nasiriyah', labelAr: 'الناصرية' },
    { value: 'diwaniyah', label: 'Diwaniyah', labelAr: 'الديوانية' }
  ];

  // Form validation
  const validateCurrentStep = useCallback(() => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'basic':
        return formData.basicInfo.name.length > 0 && formData.basicInfo.description.length > 0;
      case 'professional':
        return formData.professionalDomain && formData.governorate;
      case 'cultural':
        return formData.culturalProfile && formData.culturalProfile.culturalSensitivity >= 95;
      case 'islamic':
        return formData.islamicCompliance && formData.islamicCompliance.islamicValuesCompliance >= 96;
      default:
        return true;
    }
  }, [currentStep, formData, steps]);

  // Handle form field changes
  const updateFormField = useCallback((path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  // Validate persona
  const validatePersona = useCallback(async () => {
    setIsLoading(true);
    try {
      // This would call the PersonaService validation
      // For demo, we'll simulate validation
      const result: PersonaValidationResult = {
        isValid: true,
        culturalComplianceScore: formData.culturalProfile?.culturalSensitivity || 95,
        islamicComplianceScore: formData.islamicCompliance?.islamicValuesCompliance || 96,
        professionalAccuracy: 92,
        issues: [],
        suggestions: [
          'Consider adding more specific cultural references for enhanced authenticity',
          'Regional dialect integration could be improved for better user connection'
        ]
      };
      
      setValidationResult(result);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Handle persona creation
  const handleCreatePersona = useCallback(async () => {
    if (!validationResult?.isValid) {
      await validatePersona();
      return;
    }

    setIsLoading(true);
    try {
      // This would call the PersonaService create method
      const persona: IraqiPersona = {
        id: `persona_${Date.now()}`,
        name: formData.basicInfo.name,
        nameArabic: formData.basicInfo.nameArabic,
        description: formData.basicInfo.description,
        descriptionArabic: formData.basicInfo.descriptionArabic,
        professionalDomain: formData.professionalDomain,
        governorate: formData.governorate,
        culturalProfile: formData.culturalProfile!,
        islamicCompliance: formData.islamicCompliance!,
        personality: formData.personality!,
        communicationStyle: formData.communicationStyle!,
        responsePatterns: formData.responsePatterns!,
        memorySettings: formData.memorySettings!,
        contextRetention: {
          sessionScope: true,
          userScope: true,
          domainScope: true,
          culturalScope: true,
          importantTopics: [],
          forgettablePatterns: [],
          contextPriority: 'cultural',
          compressionEnabled: true,
          intelligentSummarization: true,
          contextOptimization: true
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        version: '1.0.0',
        tags: formData.tags || []
      };
      
      onPersonaCreated(persona);
    } catch (error) {
      console.error('Failed to create persona:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validationResult, onPersonaCreated, validatePersona]);

  // Render validation issues
  const renderValidationIssues = (issues: ValidationIssue[]) => {
    if (issues.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
          <span className="text-sm font-medium text-yellow-800">
            {language === 'ar' ? 'مشاكل التحقق' : 'Validation Issues'}
          </span>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          {issues.map((issue, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{language === 'ar' && issue.messageArabic ? issue.messageArabic : issue.message}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {language === 'ar' ? 'اسم الشخصية' : 'Persona Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.basicInfo.name}
                onChange={(e) => updateFormField('basicInfo.name', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : ''}`}
                placeholder={language === 'ar' ? 'أدخل اسم الشخصية' : 'Enter persona name'}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
              </label>
              <input
                type="text"
                value={formData.basicInfo.nameArabic || ''}
                onChange={(e) => updateFormField('basicInfo.nameArabic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-arabic"
                placeholder="أدخل الاسم بالعربية"
                dir="rtl"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {language === 'ar' ? 'وصف الشخصية' : 'Description'} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.basicInfo.description}
                onChange={(e) => updateFormField('basicInfo.description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : ''}`}
                placeholder={language === 'ar' ? 'صف دور وشخصية هذا المساعد' : 'Describe the role and personality of this assistant'}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {language === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
              </label>
              <textarea
                value={formData.basicInfo.descriptionArabic || ''}
                onChange={(e) => updateFormField('basicInfo.descriptionArabic', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-arabic"
                placeholder="صف دور وشخصية هذا المساعد بالعربية"
                dir="rtl"
              />
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {language === 'ar' ? 'المجال المهني' : 'Professional Domain'} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.professionalDomain}
                onChange={(e) => updateFormField('professionalDomain', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {professionalDomains.map(domain => (
                  <option key={domain.value} value={domain.value}>
                    {language === 'ar' ? domain.labelAr : domain.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {language === 'ar' ? 'المحافظة' : 'Governorate'} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.governorate}
                onChange={(e) => updateFormField('governorate', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {governorates.map(gov => (
                  <option key={gov.value} value={gov.value}>
                    {language === 'ar' ? gov.labelAr : gov.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Globe className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  {language === 'ar' ? 'معلومات المجال المهني' : 'Professional Domain Information'}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {language === 'ar' 
                  ? 'سيتم تخصيص هذه الشخصية للمجال المهني المحدد مع المعرفة والمصطلحات المتخصصة.'
                  : 'This persona will be specialized for the selected professional domain with relevant expertise and terminology.'}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {language === 'ar' ? 'محتوى هذه الخطوة قيد التطوير' : 'This step content is under development'}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="w-6 h-6 text-white mr-3" />
            <div>
              <h2 className={`text-xl font-bold text-white ${isRTL ? 'text-right font-arabic' : ''}`}>
                {language === 'ar' ? 'إنشاء شخصية عراقية ذكية' : 'Create Iraqi AI Persona'}
              </h2>
              <p className={`text-blue-100 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {language === 'ar' ? 'تطوير مساعد ذكي مخصص للثقافة العراقية' : 'Develop a culturally-aware Iraqi assistant'}
              </p>
            </div>
          </div>
          
          {validationResult && (
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <CheckCircle className="w-4 h-4 text-green-200 mr-2" />
              <span className="text-sm text-white">
                {Math.round(validationResult.culturalComplianceScore)}% 
                {language === 'ar' ? ' امتثال ثقافي' : ' Cultural'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                  ${index === currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : index < currentStep 
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                  <div className={`text-xs font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  } ${isRTL ? 'text-right font-arabic' : ''}`}>
                    {language === 'ar' ? step.titleAr : step.title}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px bg-gray-300 mx-4 ${isRTL ? 'ml-4 mr-0' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {renderStepContent()}
        {validationResult && renderValidationIssues(validationResult.issues)}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors ${isRTL ? 'flex-row-reverse mr-4' : 'ml-4'}`}
            >
              {showAdvanced ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {language === 'ar' ? 'الإعدادات المتقدمة' : 'Advanced Settings'}
            </button>
          </div>

          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {language === 'ar' ? 'السابق' : 'Previous'}
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!validateCurrentStep()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
              </button>
            ) : (
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button
                  onClick={validatePersona}
                  disabled={isLoading}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    language === 'ar' ? 'تحقق من الصحة' : 'Validate'
                  )}
                </button>
                
                <button
                  onClick={handleCreatePersona}
                  disabled={isLoading || !validationResult?.isValid}
                  className={`flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {language === 'ar' ? 'إنشاء الشخصية' : 'Create Persona'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaCreator;