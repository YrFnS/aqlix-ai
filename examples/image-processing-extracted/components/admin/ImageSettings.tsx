'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Globe, 
  Zap, 
  DollarSign, 
  Users,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Languages,
  Cpu,
  Clock,
  BarChart3,
  Lock,
  Unlock,
  Info
} from 'lucide-react';

// Types
interface ImageSettingsConfig {
  // OpenAI Configuration
  openai: {
    apiKey: string;
    organization?: string;
    endpoint: string;
    enabledModels: string[];
    rateLimits: {
      'dall-e-2': { rpm: number; rph: number };
      'dall-e-3': { rpm: number; rph: number };
    };
  };
  
  // Iraqi Cultural Settings
  cultural: {
    enableValidation: boolean;
    islamicComplianceRequired: boolean;
    minimumCulturalScore: number;
    allowedProfessionalDomains: string[];
    blockedTermsAr: string[];
    blockedTermsEn: string[];
    culturalValidationEndpoint?: string;
  };
  
  // Arabic Language Settings
  arabic: {
    enableRtlLayout: boolean;
    defaultDialect: 'iraqi' | 'msa' | 'gulf' | 'levantine';
    enableDialectDetection: boolean;
    enableMixedLanguageSupport: boolean;
    arabicFontFamily: string;
    textDirection: 'auto' | 'ltr' | 'rtl';
  };
  
  // Usage & Limits
  usage: {
    maxImagesPerUser: number;
    maxImagesPerSession: number;
    maxCreditsPerUser: number;
    maxCreditsPerSession: number;
    resetPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly';
    enableUsageTracking: boolean;
  };
  
  // Quality & Performance
  quality: {
    defaultSize: string;
    defaultQuality: 'standard' | 'hd';
    defaultStyle: 'vivid' | 'natural';
    enableImageOptimization: boolean;
    compressionQuality: number;
    thumbnailSize: number;
    cacheExpirationHours: number;
  };
  
  // Security Settings
  security: {
    enableContentFiltering: boolean;
    enableMalwareScanning: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    enableWatermarking: boolean;
    watermarkText: string;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
  
  // Professional Domain Rules
  professional: {
    legal: {
      enabled: boolean;
      requiresApproval: boolean;
      specialInstructions: string;
    };
    medical: {
      enabled: boolean;
      requiresApproval: boolean;
      specialInstructions: string;
    };
    educational: {
      enabled: boolean;
      requiresApproval: boolean;
      specialInstructions: string;
    };
    business: {
      enabled: boolean;
      requiresApproval: boolean;
      specialInstructions: string;
    };
    engineering: {
      enabled: boolean;
      requiresApproval: boolean;
      specialInstructions: string;
    };
  };
}

interface ImageSettingsProps {
  config?: Partial<ImageSettingsConfig>;
  isRtlMode?: boolean;
  onConfigChange?: (config: ImageSettingsConfig) => void;
  onSave?: (config: ImageSettingsConfig) => Promise<boolean>;
  onReset?: () => void;
  readOnly?: boolean;
  className?: string;
}

const defaultConfig: ImageSettingsConfig = {
  openai: {
    apiKey: '',
    endpoint: 'https://api.openai.com/v1',
    enabledModels: ['dall-e-2', 'dall-e-3'],
    rateLimits: {
      'dall-e-2': { rpm: 50, rph: 1000 },
      'dall-e-3': { rpm: 5, rph: 200 }
    }
  },
  cultural: {
    enableValidation: true,
    islamicComplianceRequired: true,
    minimumCulturalScore: 0.85,
    allowedProfessionalDomains: ['general', 'legal', 'medical', 'educational', 'business', 'engineering'],
    blockedTermsAr: ['محتوى غير لائق', 'عنف', 'كراهية'],
    blockedTermsEn: ['inappropriate content', 'violence', 'hate'],
    culturalValidationEndpoint: '/api/v1/cultural/validate'
  },
  arabic: {
    enableRtlLayout: true,
    defaultDialect: 'iraqi',
    enableDialectDetection: true,
    enableMixedLanguageSupport: true,
    arabicFontFamily: 'Noto Sans Arabic',
    textDirection: 'auto'
  },
  usage: {
    maxImagesPerUser: 100,
    maxImagesPerSession: 10,
    maxCreditsPerUser: 50.0,
    maxCreditsPerSession: 5.0,
    resetPeriod: 'daily',
    enableUsageTracking: true
  },
  quality: {
    defaultSize: '1024x1024',
    defaultQuality: 'standard',
    defaultStyle: 'natural',
    enableImageOptimization: true,
    compressionQuality: 85,
    thumbnailSize: 200,
    cacheExpirationHours: 24
  },
  security: {
    enableContentFiltering: true,
    enableMalwareScanning: true,
    maxFileSize: 4 * 1024 * 1024, // 4MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    enableWatermarking: false,
    watermarkText: 'Iraqi AI Chat System',
    logLevel: 'info'
  },
  professional: {
    legal: {
      enabled: true,
      requiresApproval: true,
      specialInstructions: 'Legal content must comply with Iraqi law and Islamic jurisprudence'
    },
    medical: {
      enabled: true,
      requiresApproval: true,
      specialInstructions: 'Medical content must be reviewed by qualified professionals'
    },
    educational: {
      enabled: true,
      requiresApproval: false,
      specialInstructions: 'Educational content should support Iraqi curriculum standards'
    },
    business: {
      enabled: true,
      requiresApproval: false,
      specialInstructions: 'Business content must respect Islamic commercial principles'
    },
    engineering: {
      enabled: true,
      requiresApproval: false,
      specialInstructions: 'Engineering content should follow Iraqi technical standards'
    }
  }
};

export const ImageSettings: React.FC<ImageSettingsProps> = ({
  config,
  isRtlMode = false,
  onConfigChange,
  onSave,
  onReset,
  readOnly = false,
  className = ''
}) => {
  // State Management
  const [settings, setSettings] = useState<ImageSettingsConfig>({
    ...defaultConfig,
    ...config
  });
  
  const [activeTab, setActiveTab] = useState<string>('openai');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tab Configuration
  const tabs = [
    { 
      id: 'openai', 
      label: isRtlMode ? 'OpenAI' : 'OpenAI', 
      icon: Zap,
      description: isRtlMode ? 'إعدادات API والنماذج' : 'API and model settings'
    },
    { 
      id: 'cultural', 
      label: isRtlMode ? 'الثقافة' : 'Cultural', 
      icon: Shield,
      description: isRtlMode ? 'التحقق الثقافي والإسلامي' : 'Cultural and Islamic validation'
    },
    { 
      id: 'arabic', 
      label: isRtlMode ? 'العربية' : 'Arabic', 
      icon: Languages,
      description: isRtlMode ? 'إعدادات اللغة العربية' : 'Arabic language settings'
    },
    { 
      id: 'usage', 
      label: isRtlMode ? 'الاستخدام' : 'Usage', 
      icon: BarChart3,
      description: isRtlMode ? 'حدود الاستخدام والتتبع' : 'Usage limits and tracking'
    },
    { 
      id: 'quality', 
      label: isRtlMode ? 'الجودة' : 'Quality', 
      icon: Settings,
      description: isRtlMode ? 'جودة الصور والأداء' : 'Image quality and performance'
    },
    { 
      id: 'security', 
      label: isRtlMode ? 'الأمان' : 'Security', 
      icon: Lock,
      description: isRtlMode ? 'الأمان وتصفية المحتوى' : 'Security and content filtering'
    },
    { 
      id: 'professional', 
      label: isRtlMode ? 'المهني' : 'Professional', 
      icon: Users,
      description: isRtlMode ? 'إعدادات المجالات المهنية' : 'Professional domain settings'
    }
  ];

  // Update settings
  const updateSettings = useCallback((section: keyof ImageSettingsConfig, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Update nested professional settings
  const updateProfessionalSettings = useCallback((domain: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        [domain]: {
          ...prev.professional[domain as keyof typeof prev.professional],
          [field]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Handle save
  const handleSave = async () => {
    if (readOnly) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const success = await onSave?.(settings);
      if (success !== false) {
        setSaveStatus('success');
        setHasUnsavedChanges(false);
        onConfigChange?.(settings);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (readOnly) return;
    
    const confirmed = window.confirm(
      isRtlMode 
        ? 'هل أنت متأكد من إعادة تعيين جميع الإعدادات؟'
        : 'Are you sure you want to reset all settings?'
    );
    
    if (confirmed) {
      setSettings({ ...defaultConfig, ...config });
      setHasUnsavedChanges(false);
      onReset?.();
    }
  };

  // Professional domains data
  const professionalDomains = [
    { key: 'legal', nameEn: 'Legal', nameAr: 'قانوني', icon: Shield },
    { key: 'medical', nameEn: 'Medical', nameAr: 'طبي', icon: Users },
    { key: 'educational', nameEn: 'Educational', nameAr: 'تعليمي', icon: Globe },
    { key: 'business', nameEn: 'Business', nameAr: 'تجاري', icon: DollarSign },
    { key: 'engineering', nameEn: 'Engineering', nameAr: 'هندسي', icon: Cpu }
  ];

  // RTL-aware classes
  const rtlClass = isRtlMode ? 'rtl' : 'ltr';
  const textAlign = isRtlMode ? 'text-right' : 'text-left';
  const flexDir = isRtlMode ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className={`image-settings ${rtlClass} ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${flexDir}`}>
        <div className={`flex items-center gap-3 ${flexDir}`}>
          <Settings className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isRtlMode ? 'إعدادات الصور' : 'Image Settings'}
            </h2>
            <p className="text-sm text-gray-600">
              {isRtlMode ? 'إعدادات إنتاج وتعديل الصور' : 'Configure image generation and editing'}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={`flex items-center gap-2 ${flexDir}`}>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded text-xs text-yellow-700">
              <AlertTriangle className="w-3 h-3" />
              <span>{isRtlMode ? 'تغييرات غير محفوظة' : 'Unsaved changes'}</span>
            </div>
          )}
          
          {saveStatus === 'success' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded text-xs text-green-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isRtlMode ? 'تم الحفظ' : 'Saved'}</span>
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded text-xs text-red-700">
              <AlertTriangle className="w-3 h-3" />
              <span>{isRtlMode ? 'خطأ في الحفظ' : 'Save failed'}</span>
            </div>
          )}
          
          {!readOnly && (
            <>
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                title={isRtlMode ? 'إعادة تعيين' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isRtlMode ? 'حفظ...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isRtlMode ? 'حفظ' : 'Save'}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${flexDir}`}
                >
                  <Icon className="w-4 h-4" />
                  <div className={`flex-1 ${textAlign}`}>
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* OpenAI Settings */}
          {activeTab === 'openai' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات OpenAI' : 'OpenAI Configuration'}
                </h3>
              </div>

              {/* API Key */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'مفتاح API' : 'API Key'}
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.openai.apiKey}
                    onChange={(e) => updateSettings('openai', 'apiKey', e.target.value)}
                    disabled={readOnly}
                    placeholder="sk-..."
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${textAlign}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'معرف المنظمة (اختياري)' : 'Organization ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={settings.openai.organization || ''}
                  onChange={(e) => updateSettings('openai', 'organization', e.target.value)}
                  disabled={readOnly}
                  placeholder="org-..."
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${textAlign}`}
                />
              </div>

              {/* Endpoint */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'نقطة النهاية' : 'API Endpoint'}
                </label>
                <input
                  type="text"
                  value={settings.openai.endpoint}
                  onChange={(e) => updateSettings('openai', 'endpoint', e.target.value)}
                  disabled={readOnly}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${textAlign}`}
                />
              </div>

              {/* Enabled Models */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'النماذج المفعلة' : 'Enabled Models'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['dall-e-2', 'dall-e-3'].map((model) => (
                    <label key={model} className={`flex items-center gap-2 p-3 border border-gray-200 rounded-lg ${flexDir}`}>
                      <input
                        type="checkbox"
                        checked={settings.openai.enabledModels.includes(model)}
                        onChange={(e) => {
                          const newModels = e.target.checked
                            ? [...settings.openai.enabledModels, model]
                            : settings.openai.enabledModels.filter(m => m !== model);
                          updateSettings('openai', 'enabledModels', newModels);
                        }}
                        disabled={readOnly}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{model.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rate Limits */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-3 ${textAlign}`}>
                  {isRtlMode ? 'حدود المعدل' : 'Rate Limits'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.openai.rateLimits).map(([model, limits]) => (
                    <div key={model} className="p-4 border border-gray-200 rounded-lg">
                      <h4 className={`font-medium text-sm mb-3 ${textAlign}`}>
                        {model.toUpperCase()}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className={`block text-xs text-gray-600 mb-1 ${textAlign}`}>
                            {isRtlMode ? 'طلبات/دقيقة' : 'Requests/minute'}
                          </label>
                          <input
                            type="number"
                            value={limits.rpm}
                            onChange={(e) => updateSettings('openai', 'rateLimits', {
                              ...settings.openai.rateLimits,
                              [model]: { ...limits, rpm: parseInt(e.target.value) }
                            })}
                            disabled={readOnly}
                            min="1"
                            className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs text-gray-600 mb-1 ${textAlign}`}>
                            {isRtlMode ? 'طلبات/ساعة' : 'Requests/hour'}
                          </label>
                          <input
                            type="number"
                            value={limits.rph}
                            onChange={(e) => updateSettings('openai', 'rateLimits', {
                              ...settings.openai.rateLimits,
                              [model]: { ...limits, rph: parseInt(e.target.value) }
                            })}
                            disabled={readOnly}
                            min="1"
                            className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cultural Settings */}
          {activeTab === 'cultural' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات التحقق الثقافي' : 'Cultural Validation Settings'}
                </h3>
              </div>

              {/* Enable Validation */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل التحقق الثقافي' : 'Enable Cultural Validation'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'فحص جميع المحتويات للتوافق الثقافي العراقي'
                      : 'Validate all content for Iraqi cultural compliance'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cultural.enableValidation}
                  onChange={(e) => updateSettings('cultural', 'enableValidation', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Islamic Compliance */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'الامتثال الإسلامي المطلوب' : 'Islamic Compliance Required'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'ضمان توافق جميع المحتويات مع القيم الإسلامية'
                      : 'Ensure all content aligns with Islamic values'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cultural.islamicComplianceRequired}
                  onChange={(e) => updateSettings('cultural', 'islamicComplianceRequired', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Minimum Cultural Score */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'الحد الأدنى للنقاط الثقافية' : 'Minimum Cultural Score'}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.cultural.minimumCulturalScore}
                    onChange={(e) => updateSettings('cultural', 'minimumCulturalScore', parseFloat(e.target.value))}
                    disabled={readOnly}
                    className="w-full"
                  />
                  <div className={`text-sm text-gray-600 ${textAlign}`}>
                    {isRtlMode ? 'القيمة الحالية' : 'Current value'}: {Math.round(settings.cultural.minimumCulturalScore * 100)}%
                  </div>
                </div>
              </div>

              {/* Blocked Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Arabic Blocked Terms */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'المصطلحات المحظورة (عربي)' : 'Blocked Terms (Arabic)'}
                  </label>
                  <textarea
                    value={settings.cultural.blockedTermsAr.join('\n')}
                    onChange={(e) => updateSettings('cultural', 'blockedTermsAr', e.target.value.split('\n').filter(term => term.trim()))}
                    disabled={readOnly}
                    placeholder={isRtlMode ? 'مصطلح واحد في كل سطر' : 'One term per line'}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 text-right font-arabic`}
                    rows={4}
                    style={{ direction: 'rtl' }}
                  />
                </div>

                {/* English Blocked Terms */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'المصطلحات المحظورة (إنجليزي)' : 'Blocked Terms (English)'}
                  </label>
                  <textarea
                    value={settings.cultural.blockedTermsEn.join('\n')}
                    onChange={(e) => updateSettings('cultural', 'blockedTermsEn', e.target.value.split('\n').filter(term => term.trim()))}
                    disabled={readOnly}
                    placeholder="One term per line"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                    rows={4}
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              {/* Cultural Validation Endpoint */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'نقطة نهاية التحقق الثقافي' : 'Cultural Validation Endpoint'}
                </label>
                <input
                  type="text"
                  value={settings.cultural.culturalValidationEndpoint || ''}
                  onChange={(e) => updateSettings('cultural', 'culturalValidationEndpoint', e.target.value)}
                  disabled={readOnly}
                  placeholder="/api/v1/cultural/validate"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                />
              </div>
            </div>
          )}

          {/* Arabic Settings */}
          {activeTab === 'arabic' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات اللغة العربية' : 'Arabic Language Settings'}
                </h3>
              </div>

              {/* RTL Layout */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل التخطيط من اليمين لليسار' : 'Enable RTL Layout'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'تخطيط واجهة المستخدم من اليمين إلى اليسار'
                      : 'Right-to-left user interface layout'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.arabic.enableRtlLayout}
                  onChange={(e) => updateSettings('arabic', 'enableRtlLayout', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Default Dialect */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'اللهجة الافتراضية' : 'Default Dialect'}
                </label>
                <select
                  value={settings.arabic.defaultDialect}
                  onChange={(e) => updateSettings('arabic', 'defaultDialect', e.target.value)}
                  disabled={readOnly}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                >
                  <option value="iraqi">{isRtlMode ? 'عراقي' : 'Iraqi'}</option>
                  <option value="msa">{isRtlMode ? 'عربي فصحى' : 'Modern Standard Arabic'}</option>
                  <option value="gulf">{isRtlMode ? 'خليجي' : 'Gulf'}</option>
                  <option value="levantine">{isRtlMode ? 'شامي' : 'Levantine'}</option>
                </select>
              </div>

              {/* Dialect Detection */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل اكتشاف اللهجة' : 'Enable Dialect Detection'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'اكتشاف اللهجة العربية تلقائياً في النصوص'
                      : 'Automatically detect Arabic dialect in text'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.arabic.enableDialectDetection}
                  onChange={(e) => updateSettings('arabic', 'enableDialectDetection', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Mixed Language Support */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'دعم اللغات المختلطة' : 'Mixed Language Support'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'معالجة النصوص المختلطة عربي-إنجليزي'
                      : 'Handle mixed Arabic-English text'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.arabic.enableMixedLanguageSupport}
                  onChange={(e) => updateSettings('arabic', 'enableMixedLanguageSupport', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Arabic Font Family */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'خط العربية' : 'Arabic Font Family'}
                </label>
                <select
                  value={settings.arabic.arabicFontFamily}
                  onChange={(e) => updateSettings('arabic', 'arabicFontFamily', e.target.value)}
                  disabled={readOnly}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                >
                  <option value="Noto Sans Arabic">Noto Sans Arabic</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Amiri">Amiri</option>
                  <option value="Scheherazade New">Scheherazade New</option>
                  <option value="Tajawal">Tajawal</option>
                </select>
              </div>

              {/* Text Direction */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'اتجاه النص' : 'Text Direction'}
                </label>
                <select
                  value={settings.arabic.textDirection}
                  onChange={(e) => updateSettings('arabic', 'textDirection', e.target.value)}
                  disabled={readOnly}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                >
                  <option value="auto">{isRtlMode ? 'تلقائي' : 'Auto'}</option>
                  <option value="ltr">{isRtlMode ? 'من اليسار لليمين' : 'Left to Right'}</option>
                  <option value="rtl">{isRtlMode ? 'من اليمين لليسار' : 'Right to Left'}</option>
                </select>
              </div>
            </div>
          )}

          {/* Usage Settings */}
          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات حدود الاستخدام' : 'Usage Limits Settings'}
                </h3>
              </div>

              {/* Usage Tracking */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل تتبع الاستخدام' : 'Enable Usage Tracking'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'تتبع استخدام المستخدمين والإحصائيات'
                      : 'Track user usage and statistics'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.usage.enableUsageTracking}
                  onChange={(e) => updateSettings('usage', 'enableUsageTracking', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الحد الأقصى للصور لكل مستخدم' : 'Max Images Per User'}
                  </label>
                  <input
                    type="number"
                    value={settings.usage.maxImagesPerUser}
                    onChange={(e) => updateSettings('usage', 'maxImagesPerUser', parseInt(e.target.value))}
                    disabled={readOnly}
                    min="1"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الحد الأقصى للصور لكل جلسة' : 'Max Images Per Session'}
                  </label>
                  <input
                    type="number"
                    value={settings.usage.maxImagesPerSession}
                    onChange={(e) => updateSettings('usage', 'maxImagesPerSession', parseInt(e.target.value))}
                    disabled={readOnly}
                    min="1"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الحد الأقصى للرصيد لكل مستخدم ($)' : 'Max Credits Per User ($)'}
                  </label>
                  <input
                    type="number"
                    value={settings.usage.maxCreditsPerUser}
                    onChange={(e) => updateSettings('usage', 'maxCreditsPerUser', parseFloat(e.target.value))}
                    disabled={readOnly}
                    min="0"
                    step="0.01"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الحد الأقصى للرصيد لكل جلسة ($)' : 'Max Credits Per Session ($)'}
                  </label>
                  <input
                    type="number"
                    value={settings.usage.maxCreditsPerSession}
                    onChange={(e) => updateSettings('usage', 'maxCreditsPerSession', parseFloat(e.target.value))}
                    disabled={readOnly}
                    min="0"
                    step="0.01"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>
              </div>

              {/* Reset Period */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'فترة إعادة التعيين' : 'Reset Period'}
                </label>
                <select
                  value={settings.usage.resetPeriod}
                  onChange={(e) => updateSettings('usage', 'resetPeriod', e.target.value)}
                  disabled={readOnly}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                >
                  <option value="hourly">{isRtlMode ? 'ساعياً' : 'Hourly'}</option>
                  <option value="daily">{isRtlMode ? 'يومياً' : 'Daily'}</option>
                  <option value="weekly">{isRtlMode ? 'أسبوعياً' : 'Weekly'}</option>
                  <option value="monthly">{isRtlMode ? 'شهرياً' : 'Monthly'}</option>
                </select>
              </div>
            </div>
          )}

          {/* Quality Settings */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات جودة الصور' : 'Image Quality Settings'}
                </h3>
              </div>

              {/* Default Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الحجم الافتراضي' : 'Default Size'}
                  </label>
                  <select
                    value={settings.quality.defaultSize}
                    onChange={(e) => updateSettings('quality', 'defaultSize', e.target.value)}
                    disabled={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  >
                    <option value="256x256">256×256</option>
                    <option value="512x512">512×512</option>
                    <option value="1024x1024">1024×1024</option>
                    <option value="1792x1024">1792×1024</option>
                    <option value="1024x1792">1024×1792</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الجودة الافتراضية' : 'Default Quality'}
                  </label>
                  <select
                    value={settings.quality.defaultQuality}
                    onChange={(e) => updateSettings('quality', 'defaultQuality', e.target.value)}
                    disabled={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  >
                    <option value="standard">{isRtlMode ? 'عادي' : 'Standard'}</option>
                    <option value="hd">{isRtlMode ? 'عالي الدقة' : 'HD'}</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'النمط الافتراضي' : 'Default Style'}
                  </label>
                  <select
                    value={settings.quality.defaultStyle}
                    onChange={(e) => updateSettings('quality', 'defaultStyle', e.target.value)}
                    disabled={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  >
                    <option value="natural">{isRtlMode ? 'طبيعي' : 'Natural'}</option>
                    <option value="vivid">{isRtlMode ? 'حيوي' : 'Vivid'}</option>
                  </select>
                </div>
              </div>

              {/* Image Optimization */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل تحسين الصور' : 'Enable Image Optimization'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'ضغط وتحسين الصور للتخزين والعرض'
                      : 'Compress and optimize images for storage and display'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.quality.enableImageOptimization}
                  onChange={(e) => updateSettings('quality', 'enableImageOptimization', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Optimization Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'جودة الضغط (%)' : 'Compression Quality (%)'}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={settings.quality.compressionQuality}
                      onChange={(e) => updateSettings('quality', 'compressionQuality', parseInt(e.target.value))}
                      disabled={readOnly}
                      className="w-full"
                    />
                    <div className={`text-sm text-gray-600 ${textAlign}`}>
                      {settings.quality.compressionQuality}%
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'حجم المعاينة (px)' : 'Thumbnail Size (px)'}
                  </label>
                  <input
                    type="number"
                    value={settings.quality.thumbnailSize}
                    onChange={(e) => updateSettings('quality', 'thumbnailSize', parseInt(e.target.value))}
                    disabled={readOnly}
                    min="100"
                    max="500"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'انتهاء صلاحية التخزين المؤقت (ساعات)' : 'Cache Expiration (hours)'}
                  </label>
                  <input
                    type="number"
                    value={settings.quality.cacheExpirationHours}
                    onChange={(e) => updateSettings('quality', 'cacheExpirationHours', parseInt(e.target.value))}
                    disabled={readOnly}
                    min="1"
                    max="720"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات الأمان' : 'Security Settings'}
                </h3>
              </div>

              {/* Content Filtering */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل تصفية المحتوى' : 'Enable Content Filtering'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'فحص المحتوى للكشف عن المواد غير المناسبة'
                      : 'Scan content for inappropriate material'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.enableContentFiltering}
                  onChange={(e) => updateSettings('security', 'enableContentFiltering', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* Malware Scanning */}
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                <div>
                  <h4 className={`font-medium ${textAlign}`}>
                    {isRtlMode ? 'تفعيل فحص البرامج الضارة' : 'Enable Malware Scanning'}
                  </h4>
                  <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                    {isRtlMode 
                      ? 'فحص الملفات المرفوعة للبحث عن البرامج الضارة'
                      : 'Scan uploaded files for malware'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.enableMalwareScanning}
                  onChange={(e) => updateSettings('security', 'enableMalwareScanning', e.target.checked)}
                  disabled={readOnly}
                  className="rounded"
                />
              </div>

              {/* File Security */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'الحد الأقصى لحجم الملف (MB)' : 'Max File Size (MB)'}
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxFileSize / (1024 * 1024)}
                    onChange={(e) => updateSettings('security', 'maxFileSize', parseFloat(e.target.value) * 1024 * 1024)}
                    disabled={readOnly}
                    min="0.1"
                    max="10"
                    step="0.1"
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                    {isRtlMode ? 'مستوى السجل' : 'Log Level'}
                  </label>
                  <select
                    value={settings.security.logLevel}
                    onChange={(e) => updateSettings('security', 'logLevel', e.target.value)}
                    disabled={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                  >
                    <option value="error">{isRtlMode ? 'خطأ' : 'Error'}</option>
                    <option value="warn">{isRtlMode ? 'تحذير' : 'Warning'}</option>
                    <option value="info">{isRtlMode ? 'معلومات' : 'Info'}</option>
                    <option value="debug">{isRtlMode ? 'تصحيح' : 'Debug'}</option>
                  </select>
                </div>
              </div>

              {/* Allowed File Types */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {isRtlMode ? 'أنواع الملفات المسموحة' : 'Allowed File Types'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'].map((type) => (
                    <label key={type} className={`flex items-center gap-2 p-2 border border-gray-200 rounded ${flexDir}`}>
                      <input
                        type="checkbox"
                        checked={settings.security.allowedFileTypes.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...settings.security.allowedFileTypes, type]
                            : settings.security.allowedFileTypes.filter(t => t !== type);
                          updateSettings('security', 'allowedFileTypes', newTypes);
                        }}
                        disabled={readOnly}
                        className="rounded"
                      />
                      <span className="text-xs">{type.replace('image/', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Watermarking */}
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${flexDir}`}>
                  <div>
                    <h4 className={`font-medium ${textAlign}`}>
                      {isRtlMode ? 'تفعيل العلامة المائية' : 'Enable Watermarking'}
                    </h4>
                    <p className={`text-sm text-gray-600 mt-1 ${textAlign}`}>
                      {isRtlMode 
                        ? 'إضافة علامة مائية إلى الصور المنتجة'
                        : 'Add watermark to generated images'
                      }
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.enableWatermarking}
                    onChange={(e) => updateSettings('security', 'enableWatermarking', e.target.checked)}
                    disabled={readOnly}
                    className="rounded"
                  />
                </div>

                {settings.security.enableWatermarking && (
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                      {isRtlMode ? 'نص العلامة المائية' : 'Watermark Text'}
                    </label>
                    <input
                      type="text"
                      value={settings.security.watermarkText}
                      onChange={(e) => updateSettings('security', 'watermarkText', e.target.value)}
                      disabled={readOnly}
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${textAlign}`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Settings */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
                  {isRtlMode ? 'إعدادات المجالات المهنية' : 'Professional Domain Settings'}
                </h3>
              </div>

              <div className="space-y-6">
                {professionalDomains.map((domain) => {
                  const Icon = domain.icon;
                  const domainSettings = settings.professional[domain.key as keyof typeof settings.professional];
                  
                  return (
                    <div key={domain.key} className="border border-gray-200 rounded-lg p-6">
                      <div className={`flex items-center gap-3 mb-4 ${flexDir}`}>
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className={`font-medium ${textAlign}`}>
                            {isRtlMode ? domain.nameAr : domain.nameEn}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Enable Domain */}
                        <div className={`flex items-center justify-between ${flexDir}`}>
                          <span className={`text-sm text-gray-700 ${textAlign}`}>
                            {isRtlMode ? 'تفعيل هذا المجال' : 'Enable this domain'}
                          </span>
                          <input
                            type="checkbox"
                            checked={domainSettings.enabled}
                            onChange={(e) => updateProfessionalSettings(domain.key, 'enabled', e.target.checked)}
                            disabled={readOnly}
                            className="rounded"
                          />
                        </div>

                        {/* Requires Approval */}
                        {domainSettings.enabled && (
                          <div className={`flex items-center justify-between ${flexDir}`}>
                            <span className={`text-sm text-gray-700 ${textAlign}`}>
                              {isRtlMode ? 'يتطلب الموافقة' : 'Requires approval'}
                            </span>
                            <input
                              type="checkbox"
                              checked={domainSettings.requiresApproval}
                              onChange={(e) => updateProfessionalSettings(domain.key, 'requiresApproval', e.target.checked)}
                              disabled={readOnly}
                              className="rounded"
                            />
                          </div>
                        )}

                        {/* Special Instructions */}
                        {domainSettings.enabled && (
                          <div>
                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                              {isRtlMode ? 'تعليمات خاصة' : 'Special Instructions'}
                            </label>
                            <textarea
                              value={domainSettings.specialInstructions}
                              onChange={(e) => updateProfessionalSettings(domain.key, 'specialInstructions', e.target.value)}
                              disabled={readOnly}
                              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 resize-none ${textAlign}`}
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;