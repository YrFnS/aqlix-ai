/**
 * Iraqi AI Workspace Settings Component
 * Enhanced chatbot-ui settings with cultural compliance and professional domains
 * Supports Arabic RTL, Islamic compliance, and Iraqi professional requirements
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Globe, Users, FileText, Zap, AlertTriangle, Check, X } from 'lucide-react';

// ====================== Types ======================

interface IraqiCulturalSettings {
  enableIslamicCompliance: boolean;
  strictnessLevel: 'basic' | 'standard' | 'strict';
  prayerTimeReminders: boolean;
  halalContentFilter: boolean;
  politicalNeutralityMode: boolean;
  sectarianContentFilter: boolean;
  culturalSensitivityLevel: 'low' | 'medium' | 'high' | 'maximum';
}

interface WorkspaceSettings {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: 'personal' | 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  visibility: 'private' | 'organization' | 'public';
  
  // Iraqi-specific settings
  culturalSettings: IraqiCulturalSettings;
  arabicSupport: boolean;
  dialectPreference: 'baghdad' | 'basra' | 'mosul' | 'general';
  rtlLayout: boolean;
  
  // Professional settings
  professionalLicenseNumber?: string;
  organizationRegistration?: string;
  complianceRequirements: string[];
  specializations: string[];
  
  // Access settings
  maxMembers: number;
  allowGuestAccess: boolean;
  fileUploadEnabled: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

// ====================== Component Props ======================

interface WorkspaceSettingsProps {
  workspaceId: string;
  settings: WorkspaceSettings;
  onSave: (settings: WorkspaceSettings) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  userRole: 'owner' | 'admin' | 'editor' | 'viewer';
  locale: 'ar' | 'en';
}

// ====================== Main Component ======================

export default function WorkspaceSettings({
  workspaceId,
  settings: initialSettings,
  onSave,
  onCancel,
  isLoading = false,
  userRole,
  locale = 'ar'
}: WorkspaceSettingsProps) {
  const [settings, setSettings] = useState<WorkspaceSettings>(initialSettings);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [culturalComplianceScore, setCulturalComplianceScore] = useState<number>(0);
  const [isValidating, setIsValidating] = useState(false);

  const isRTL = locale === 'ar';
  const canEdit = userRole === 'owner' || userRole === 'admin';

  // Text content based on locale
  const text = {
    ar: {
      title: 'إعدادات مساحة العمل',
      basicInfo: 'المعلومات الأساسية',
      culturalCompliance: 'الامتثال الثقافي',
      professionalSettings: 'الإعدادات المهنية',
      accessPermissions: 'أذونات الوصول',
      fileManagement: 'إدارة الملفات',
      workspaceName: 'اسم مساحة العمل',
      workspaceNameAr: 'اسم مساحة العمل بالعربية',
      description: 'الوصف',
      descriptionAr: 'الوصف بالعربية',
      workspaceType: 'نوع مساحة العمل',
      visibility: 'مستوى الرؤية',
      dialectPreference: 'تفضيل اللهجة',
      islamicCompliance: 'الامتثال الإسلامي',
      strictnessLevel: 'مستوى الصرامة',
      prayerReminders: 'تذكيرات الصلاة',
      halalFilter: 'مرشح المحتوى الحلال',
      politicalNeutrality: 'الحياد السياسي',
      sectarianFilter: 'مرشح المحتوى الطائفي',
      culturalSensitivity: 'الحساسية الثقافية',
      licenseNumber: 'رقم الرخصة المهنية',
      orgRegistration: 'تسجيل المنظمة',
      specializations: 'التخصصات',
      maxMembers: 'الحد الأقصى للأعضاء',
      guestAccess: 'وصول الضيوف',
      fileUploads: 'تحميل الملفات',
      maxFileSize: 'الحد الأقصى لحجم الملف (ميجابايت)',
      allowedTypes: 'أنواع الملفات المسموحة',
      save: 'حفظ',
      cancel: 'إلغاء',
      saving: 'جاري الحفظ...',
      validating: 'جاري التحقق من الصحة...',
      complianceScore: 'نقاط الامتثال الثقافي',
      unsavedChanges: 'لديك تغييرات غير محفوظة',
      validationRequired: 'التحقق من الصحة مطلوب للإعدادات المهنية',
      professionalVerification: 'التحقق المهني مطلوب لهذا النوع من مساحة العمل'
    },
    en: {
      title: 'Workspace Settings',
      basicInfo: 'Basic Information',
      culturalCompliance: 'Cultural Compliance',
      professionalSettings: 'Professional Settings',
      accessPermissions: 'Access Permissions',
      fileManagement: 'File Management',
      workspaceName: 'Workspace Name',
      workspaceNameAr: 'Workspace Name (Arabic)',
      description: 'Description',
      descriptionAr: 'Description (Arabic)',
      workspaceType: 'Workspace Type',
      visibility: 'Visibility',
      dialectPreference: 'Dialect Preference',
      islamicCompliance: 'Islamic Compliance',
      strictnessLevel: 'Strictness Level',
      prayerReminders: 'Prayer Reminders',
      halalFilter: 'Halal Content Filter',
      politicalNeutrality: 'Political Neutrality',
      sectarianFilter: 'Sectarian Content Filter',
      culturalSensitivity: 'Cultural Sensitivity',
      licenseNumber: 'Professional License Number',
      orgRegistration: 'Organization Registration',
      specializations: 'Specializations',
      maxMembers: 'Maximum Members',
      guestAccess: 'Guest Access',
      fileUploads: 'File Uploads',
      maxFileSize: 'Maximum File Size (MB)',
      allowedTypes: 'Allowed File Types',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      validating: 'Validating...',
      complianceScore: 'Cultural Compliance Score',
      unsavedChanges: 'You have unsaved changes',
      validationRequired: 'Validation required for professional settings',
      professionalVerification: 'Professional verification required for this workspace type'
    }
  };

  const t = text[locale];

  // ====================== Effects ======================

  useEffect(() => {
    const hasChangesCheck = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setHasChanges(hasChangesCheck);
  }, [settings, initialSettings]);

  useEffect(() => {
    if (settings.culturalSettings.enableIslamicCompliance) {
      calculateCulturalComplianceScore();
    }
  }, [settings.culturalSettings]);

  // ====================== Handlers ======================

  const handleSettingChange = (key: string, value: any) => {
    if (!canEdit) return;

    setSettings(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof WorkspaceSettings],
            [child]: value
          }
        };
      }
      return { ...prev, [key]: value };
    });

    // Clear validation error if field is fixed
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const calculateCulturalComplianceScore = async () => {
    const { culturalSettings } = settings;
    let score = 0;

    // Base score for enabling compliance
    if (culturalSettings.enableIslamicCompliance) score += 30;
    
    // Strictness level scoring
    const strictnessScores = { basic: 10, standard: 20, strict: 30 };
    score += strictnessScores[culturalSettings.strictnessLevel];

    // Feature scoring
    if (culturalSettings.prayerTimeReminders) score += 10;
    if (culturalSettings.halalContentFilter) score += 15;
    if (culturalSettings.politicalNeutralityMode) score += 10;
    if (culturalSettings.sectarianContentFilter) score += 15;

    // Cultural sensitivity scoring
    const sensitivityScores = { low: 5, medium: 10, high: 15, maximum: 20 };
    score += sensitivityScores[culturalSettings.culturalSensitivityLevel];

    // Professional domain bonus
    if (settings.type === 'legal' || settings.type === 'medical') score += 10;

    setCulturalComplianceScore(Math.min(score, 100));
  };

  const validateSettings = async (): Promise<boolean> => {
    setIsValidating(true);
    const errors: Record<string, string> = {};

    // Basic validation
    if (!settings.name.trim()) {
      errors.name = locale === 'ar' ? 'اسم مساحة العمل مطلوب' : 'Workspace name is required';
    }

    if (!settings.nameAr.trim() && settings.arabicSupport) {
      errors.nameAr = locale === 'ar' ? 'الاسم العربي مطلوب' : 'Arabic name is required';
    }

    // Professional domain validation
    if (settings.type === 'legal' || settings.type === 'medical') {
      if (!settings.professionalLicenseNumber) {
        errors.professionalLicenseNumber = locale === 'ar' ? 'رقم الرخصة المهنية مطلوب' : 'Professional license number is required';
      }
    }

    // Cultural compliance validation
    if (settings.culturalSettings.enableIslamicCompliance && culturalComplianceScore < 60) {
      errors.culturalCompliance = locale === 'ar' ? 'نقاط الامتثال الثقافي منخفضة جداً' : 'Cultural compliance score is too low';
    }

    // File size validation
    if (settings.maxFileSize > 1000) {
      errors.maxFileSize = locale === 'ar' ? 'الحد الأقصى لحجم الملف كبير جداً' : 'Maximum file size is too large';
    }

    setValidationErrors(errors);
    setIsValidating(false);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    const isValid = await validateSettings();
    if (!isValid) return;

    try {
      await onSave(settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    setValidationErrors({});
    onCancel();
  };

  // ====================== Render Methods ======================

  const renderCulturalComplianceScore = () => {
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreIcon = (score: number) => {
      if (score >= 80) return <Check className="h-4 w-4 text-green-600" />;
      if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      return <X className="h-4 w-4 text-red-600" />;
    };

    return (
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {getScoreIcon(culturalComplianceScore)}
        <span className={`font-semibold ${getScoreColor(culturalComplianceScore)}`}>
          {culturalComplianceScore}/100
        </span>
        <span className="text-sm text-gray-600">
          {t.complianceScore}
        </span>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right font-arabic' : ''}>{t.basicInfo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className={isRTL ? 'text-right font-arabic' : ''}>{t.workspaceName}</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => handleSettingChange('name', e.target.value)}
              disabled={!canEdit}
              className={isRTL ? 'text-right font-arabic' : ''}
            />
            {validationErrors.name && (
              <p className={`text-red-600 text-sm mt-1 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="nameAr" className={isRTL ? 'text-right font-arabic' : ''}>{t.workspaceNameAr}</Label>
            <Input
              id="nameAr"
              value={settings.nameAr}
              onChange={(e) => handleSettingChange('nameAr', e.target.value)}
              disabled={!canEdit}
              className="text-right font-arabic"
              dir="rtl"
            />
            {validationErrors.nameAr && (
              <p className={`text-red-600 text-sm mt-1 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {validationErrors.nameAr}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description" className={isRTL ? 'text-right font-arabic' : ''}>{t.description}</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
              disabled={!canEdit}
              className={isRTL ? 'text-right font-arabic' : ''}
            />
          </div>

          <div>
            <Label htmlFor="descriptionAr" className={isRTL ? 'text-right font-arabic' : ''}>{t.descriptionAr}</Label>
            <Textarea
              id="descriptionAr"
              value={settings.descriptionAr}
              onChange={(e) => handleSettingChange('descriptionAr', e.target.value)}
              disabled={!canEdit}
              className="text-right font-arabic"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.workspaceType}</Label>
            <Select 
              value={settings.type} 
              onValueChange={(value) => handleSettingChange('type', value)}
              disabled={!canEdit}
            >
              <SelectTrigger className={isRTL ? 'text-right font-arabic' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">
                  {locale === 'ar' ? 'شخصي' : 'Personal'}
                </SelectItem>
                <SelectItem value="legal">
                  {locale === 'ar' ? 'قانوني' : 'Legal'}
                </SelectItem>
                <SelectItem value="medical">
                  {locale === 'ar' ? 'طبي' : 'Medical'}
                </SelectItem>
                <SelectItem value="educational">
                  {locale === 'ar' ? 'تعليمي' : 'Educational'}
                </SelectItem>
                <SelectItem value="business">
                  {locale === 'ar' ? 'تجاري' : 'Business'}
                </SelectItem>
                <SelectItem value="engineering">
                  {locale === 'ar' ? 'هندسي' : 'Engineering'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.visibility}</Label>
            <Select 
              value={settings.visibility} 
              onValueChange={(value) => handleSettingChange('visibility', value)}
              disabled={!canEdit}
            >
              <SelectTrigger className={isRTL ? 'text-right font-arabic' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  {locale === 'ar' ? 'خاص' : 'Private'}
                </SelectItem>
                <SelectItem value="organization">
                  {locale === 'ar' ? 'منظمة' : 'Organization'}
                </SelectItem>
                <SelectItem value="public">
                  {locale === 'ar' ? 'عام' : 'Public'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.dialectPreference}</Label>
            <Select 
              value={settings.dialectPreference} 
              onValueChange={(value) => handleSettingChange('dialectPreference', value)}
              disabled={!canEdit}
            >
              <SelectTrigger className={isRTL ? 'text-right font-arabic' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  {locale === 'ar' ? 'عام' : 'General'}
                </SelectItem>
                <SelectItem value="baghdad">
                  {locale === 'ar' ? 'بغداد' : 'Baghdad'}
                </SelectItem>
                <SelectItem value="basra">
                  {locale === 'ar' ? 'البصرة' : 'Basra'}
                </SelectItem>
                <SelectItem value="mosul">
                  {locale === 'ar' ? 'الموصل' : 'Mosul'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCulturalCompliance = () => (
    <Card>
      <CardHeader>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right font-arabic' : ''}`}>
            <Shield className="h-5 w-5" />
            {t.culturalCompliance}
          </CardTitle>
          {settings.culturalSettings.enableIslamicCompliance && renderCulturalComplianceScore()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <Label className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t.islamicCompliance}</Label>
            <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
              {locale === 'ar' ? 'تفعيل مرشحات المحتوى الإسلامية' : 'Enable Islamic content filters'}
            </p>
          </div>
          <Switch
            checked={settings.culturalSettings.enableIslamicCompliance}
            onCheckedChange={(checked) => handleSettingChange('culturalSettings.enableIslamicCompliance', checked)}
            disabled={!canEdit}
          />
        </div>

        {settings.culturalSettings.enableIslamicCompliance && (
          <>
            <div>
              <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.strictnessLevel}</Label>
              <Select 
                value={settings.culturalSettings.strictnessLevel} 
                onValueChange={(value) => handleSettingChange('culturalSettings.strictnessLevel', value)}
                disabled={!canEdit}
              >
                <SelectTrigger className={isRTL ? 'text-right font-arabic' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">
                    {locale === 'ar' ? 'أساسي' : 'Basic'}
                  </SelectItem>
                  <SelectItem value="standard">
                    {locale === 'ar' ? 'معياري' : 'Standard'}
                  </SelectItem>
                  <SelectItem value="strict">
                    {locale === 'ar' ? 'صارم' : 'Strict'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className={isRTL ? 'font-arabic' : ''}>{t.prayerReminders}</Label>
                <Switch
                  checked={settings.culturalSettings.prayerTimeReminders}
                  onCheckedChange={(checked) => handleSettingChange('culturalSettings.prayerTimeReminders', checked)}
                  disabled={!canEdit}
                />
              </div>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className={isRTL ? 'font-arabic' : ''}>{t.halalFilter}</Label>
                <Switch
                  checked={settings.culturalSettings.halalContentFilter}
                  onCheckedChange={(checked) => handleSettingChange('culturalSettings.halalContentFilter', checked)}
                  disabled={!canEdit}
                />
              </div>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className={isRTL ? 'font-arabic' : ''}>{t.politicalNeutrality}</Label>
                <Switch
                  checked={settings.culturalSettings.politicalNeutralityMode}
                  onCheckedChange={(checked) => handleSettingChange('culturalSettings.politicalNeutralityMode', checked)}
                  disabled={!canEdit}
                />
              </div>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className={isRTL ? 'font-arabic' : ''}>{t.sectarianFilter}</Label>
                <Switch
                  checked={settings.culturalSettings.sectarianContentFilter}
                  onCheckedChange={(checked) => handleSettingChange('culturalSettings.sectarianContentFilter', checked)}
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div>
              <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.culturalSensitivity}</Label>
              <Select 
                value={settings.culturalSettings.culturalSensitivityLevel} 
                onValueChange={(value) => handleSettingChange('culturalSettings.culturalSensitivityLevel', value)}
                disabled={!canEdit}
              >
                <SelectTrigger className={isRTL ? 'text-right font-arabic' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    {locale === 'ar' ? 'منخفض' : 'Low'}
                  </SelectItem>
                  <SelectItem value="medium">
                    {locale === 'ar' ? 'متوسط' : 'Medium'}
                  </SelectItem>
                  <SelectItem value="high">
                    {locale === 'ar' ? 'عالي' : 'High'}
                  </SelectItem>
                  <SelectItem value="maximum">
                    {locale === 'ar' ? 'أقصى' : 'Maximum'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {validationErrors.culturalCompliance && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={isRTL ? 'text-right font-arabic' : ''}>
                  {validationErrors.culturalCompliance}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderProfessionalSettings = () => {
    const requiresProfessionalInfo = settings.type === 'legal' || settings.type === 'medical';

    return (
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right font-arabic' : ''}`}>
            <FileText className="h-5 w-5" />
            {t.professionalSettings}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiresProfessionalInfo && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className={isRTL ? 'text-right font-arabic' : ''}>
                {t.professionalVerification}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber" className={isRTL ? 'text-right font-arabic' : ''}>
                {t.licenseNumber}
              </Label>
              <Input
                id="licenseNumber"
                value={settings.professionalLicenseNumber || ''}
                onChange={(e) => handleSettingChange('professionalLicenseNumber', e.target.value)}
                disabled={!canEdit}
                className={isRTL ? 'text-right font-arabic' : ''}
                placeholder={requiresProfessionalInfo ? (locale === 'ar' ? 'مطلوب' : 'Required') : ''}
              />
              {validationErrors.professionalLicenseNumber && (
                <p className={`text-red-600 text-sm mt-1 ${isRTL ? 'text-right font-arabic' : ''}`}>
                  {validationErrors.professionalLicenseNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="orgRegistration" className={isRTL ? 'text-right font-arabic' : ''}>
                {t.orgRegistration}
              </Label>
              <Input
                id="orgRegistration"
                value={settings.organizationRegistration || ''}
                onChange={(e) => handleSettingChange('organizationRegistration', e.target.value)}
                disabled={!canEdit}
                className={isRTL ? 'text-right font-arabic' : ''}
              />
            </div>
          </div>

          <div>
            <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.specializations}</Label>
            <div className={`flex flex-wrap gap-2 mt-2 ${isRTL ? 'justify-end' : ''}`}>
              {settings.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className={isRTL ? 'font-arabic' : ''}>
                  {spec}
                  {canEdit && (
                    <button
                      onClick={() => {
                        const newSpecs = settings.specializations.filter((_, i) => i !== index);
                        handleSettingChange('specializations', newSpecs);
                      }}
                      className={`ml-1 text-red-600 hover:text-red-800 ${isRTL ? 'mr-1 ml-0' : ''}`}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAccessPermissions = () => (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right font-arabic' : ''}`}>
          <Users className="h-5 w-5" />
          {t.accessPermissions}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxMembers" className={isRTL ? 'text-right font-arabic' : ''}>{t.maxMembers}</Label>
            <Input
              id="maxMembers"
              type="number"
              value={settings.maxMembers}
              onChange={(e) => handleSettingChange('maxMembers', parseInt(e.target.value))}
              disabled={!canEdit}
              min="1"
              max="1000"
              className={isRTL ? 'text-right font-arabic' : ''}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Label className={isRTL ? 'font-arabic' : ''}>{t.guestAccess}</Label>
            <Switch
              checked={settings.allowGuestAccess}
              onCheckedChange={(checked) => handleSettingChange('allowGuestAccess', checked)}
              disabled={!canEdit}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFileManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right font-arabic' : ''}`}>
          <FileText className="h-5 w-5" />
          {t.fileManagement}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <Label className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t.fileUploads}</Label>
            <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
              {locale === 'ar' ? 'السماح بتحميل الملفات في هذه المساحة' : 'Allow file uploads in this workspace'}
            </p>
          </div>
          <Switch
            checked={settings.fileUploadEnabled}
            onCheckedChange={(checked) => handleSettingChange('fileUploadEnabled', checked)}
            disabled={!canEdit}
          />
        </div>

        {settings.fileUploadEnabled && (
          <>
            <div>
              <Label htmlFor="maxFileSize" className={isRTL ? 'text-right font-arabic' : ''}>{t.maxFileSize}</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                disabled={!canEdit}
                min="1"
                max="1000"
                className={isRTL ? 'text-right font-arabic' : ''}
              />
              {validationErrors.maxFileSize && (
                <p className={`text-red-600 text-sm mt-1 ${isRTL ? 'text-right font-arabic' : ''}`}>
                  {validationErrors.maxFileSize}
                </p>
              )}
            </div>

            <div>
              <Label className={isRTL ? 'text-right font-arabic' : ''}>{t.allowedTypes}</Label>
              <div className={`flex flex-wrap gap-2 mt-2 ${isRTL ? 'justify-end' : ''}`}>
                {settings.allowedFileTypes.map((type, index) => (
                  <Badge key={index} variant="outline" className={isRTL ? 'font-arabic' : ''}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  // ====================== Main Render ======================

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>{t.title}</h1>
        {hasChanges && (
          <Badge variant="outline" className="text-orange-600">
            {t.unsavedChanges}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className={`grid w-full grid-cols-5 ${isRTL ? 'font-arabic' : ''}`}>
          <TabsTrigger value="basic">{t.basicInfo}</TabsTrigger>
          <TabsTrigger value="cultural">{t.culturalCompliance}</TabsTrigger>
          <TabsTrigger value="professional">{t.professionalSettings}</TabsTrigger>
          <TabsTrigger value="access">{t.accessPermissions}</TabsTrigger>
          <TabsTrigger value="files">{t.fileManagement}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          {renderBasicInfo()}
        </TabsContent>

        <TabsContent value="cultural" className="mt-6">
          {renderCulturalCompliance()}
        </TabsContent>

        <TabsContent value="professional" className="mt-6">
          {renderProfessionalSettings()}
        </TabsContent>

        <TabsContent value="access" className="mt-6">
          {renderAccessPermissions()}
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          {renderFileManagement()}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className={`flex gap-4 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          onClick={handleSave}
          disabled={!canEdit || !hasChanges || isLoading || isValidating}
          className={isRTL ? 'font-arabic' : ''}
        >
          {isLoading ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              {t.saving}
            </>
          ) : isValidating ? (
            <>
              <Shield className="h-4 w-4 mr-2 animate-pulse" />
              {t.validating}
            </>
          ) : (
            t.save
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className={isRTL ? 'font-arabic' : ''}
        >
          {t.cancel}
        </Button>
      </div>

      {/* Validation Errors Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className={isRTL ? 'text-right font-arabic' : ''}>
            {t.validationRequired}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}