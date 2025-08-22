/**
 * Ministry Template Manager for Iraqi AI Design Generation
 * 
 * Manages government-specific design templates and branding standards
 */

import { EventEmitter } from 'events';
import { IBrandingElements, IMinistryTemplate } from './RTLComponentGenerator';

// Ministry template interfaces
export interface IMinistryConfig {
  name: string;
  arabicName: string;
  code: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  officialWebsite: string;
  designStandards: IDesignStandards;
  componentTemplates: Map<string, IComponentTemplate>;
}

export interface IDesignStandards {
  typography: IMinistryTypography;
  colorPalette: IColorPalette;
  spacing: ISpacingStandards;
  iconography: IIconographyStandards;
  layout: ILayoutStandards;
  accessibility: IAccessibilityStandards;
}

export interface IMinistryTypography {
  primaryFont: string;
  secondaryFont: string;
  arabicFont: string;
  englishFont: string;
  headingSizes: string[];
  bodySize: string;
  lineHeight: number;
  letterSpacing: string;
}

export interface IColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ISpacingStandards {
  baseUnit: number; // in rem
  componentSpacing: number[];
  sectionSpacing: number[];
  containerPadding: string;
  gridGutter: string;
}

export interface IIconographyStandards {
  iconSet: string;
  iconSizes: number[];
  iconColor: string;
  iconStyle: 'outline' | 'filled' | 'mixed';
}

export interface ILayoutStandards {
  maxWidth: string;
  breakpoints: { [key: string]: string };
  gridColumns: number;
  sidebarWidth: string;
  headerHeight: string;
}

export interface IAccessibilityStandards {
  colorContrast: number;
  fontSize: {
    minimum: string;
    maximum: string;
  };
  focusIndicator: string;
  screenReaderSupport: boolean;
}

export interface IComponentTemplate {
  id: string;
  name: string;
  type: string;
  structure: string;
  styles: string;
  props: ITemplateProperty[];
  variants: ITemplateVariant[];
  culturalFeatures: string[];
  accessibilityFeatures: string[];
}

export interface ITemplateProperty {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
  arabicLabel?: string;
}

export interface ITemplateVariant {
  name: string;
  description: string;
  modifiers: { [key: string]: string };
  useCase: string;
}

export interface IMinistryComplianceValidation {
  brandingCompliance: number;
  colorCompliance: number;
  typographyCompliance: number;
  layoutCompliance: number;
  accessibilityCompliance: number;
  overallCompliance: number;
  issues: IComplianceIssue[];
  recommendations: string[];
}

export interface IComplianceIssue {
  category: 'branding' | 'color' | 'typography' | 'layout' | 'accessibility';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  solution: string;
  ministrySpecific: boolean;
}

export interface IMinistryTemplateOptions {
  enforceStandards: boolean;
  enableCustomization: boolean;
  cacheTemplates: boolean;
  validateCompliance: boolean;
}

/**
 * Ministry Template Manager
 * 
 * Manages Iraqi government ministry design templates and standards
 */
export class MinistryTemplateManager extends EventEmitter {
  private readonly options: IMinistryTemplateOptions;
  private readonly ministryConfigs: Map<string, IMinistryConfig> = new Map();
  private readonly templateCache: Map<string, IComponentTemplate> = new Map();
  private readonly complianceRules: Map<string, any> = new Map();
  
  constructor(options: Partial<IMinistryTemplateOptions> = {}) {
    super();
    
    this.options = {
      enforceStandards: options.enforceStandards ?? true,
      enableCustomization: options.enableCustomization ?? true,
      cacheTemplates: options.cacheTemplates ?? true,
      validateCompliance: options.validateCompliance ?? true
    };
    
    // Initialize ministry configurations
    this.loadMinistryConfigurations();
    this.loadComplianceRules();
  }
  
  /**
   * Get template for specific ministry and component type
   */
  async getTemplate(ministry: string, componentType: string): Promise<IMinistryTemplate> {
    const cacheKey = `${ministry}_${componentType}`;
    
    if (this.options.cacheTemplates && this.templateCache.has(cacheKey)) {
      const cachedTemplate = this.templateCache.get(cacheKey)!;
      this.emit('templateLoaded', { ministry, componentType, cached: true });
      return this.convertToMinistryTemplate(cachedTemplate, ministry);
    }
    
    try {
      const ministryConfig = this.ministryConfigs.get(ministry);
      if (!ministryConfig) {
        throw new Error(`Ministry configuration not found: ${ministry}`);
      }
      
      const componentTemplate = ministryConfig.componentTemplates.get(componentType) ||
                               this.createDefaultTemplate(componentType, ministryConfig);
      
      // Cache the template
      if (this.options.cacheTemplates) {
        this.templateCache.set(cacheKey, componentTemplate);
      }
      
      const ministryTemplate = this.convertToMinistryTemplate(componentTemplate, ministry);
      
      this.emit('templateLoaded', { 
        ministry, 
        componentType, 
        cached: false, 
        template: ministryTemplate 
      });
      
      return ministryTemplate;
      
    } catch (error) {
      this.emit('templateError', { 
        ministry, 
        componentType, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }
  
  /**
   * Validate component compliance with ministry standards
   */
  async validateCompliance(
    componentCode: string,
    styleCode: string,
    ministry: string
  ): Promise<IMinistryComplianceValidation> {
    if (!this.options.validateCompliance) {
      return this.createMinimalComplianceResult();
    }
    
    const ministryConfig = this.ministryConfigs.get(ministry);
    if (!ministryConfig) {
      throw new Error(`Ministry configuration not found: ${ministry}`);
    }
    
    const issues: IComplianceIssue[] = [];
    
    // Validate branding compliance
    const brandingCompliance = this.validateBrandingCompliance(
      componentCode, 
      styleCode, 
      ministryConfig, 
      issues
    );
    
    // Validate color compliance
    const colorCompliance = this.validateColorCompliance(
      styleCode, 
      ministryConfig.designStandards.colorPalette, 
      issues
    );
    
    // Validate typography compliance
    const typographyCompliance = this.validateTypographyCompliance(
      styleCode, 
      ministryConfig.designStandards.typography, 
      issues
    );
    
    // Validate layout compliance
    const layoutCompliance = this.validateLayoutCompliance(
      componentCode, 
      ministryConfig.designStandards.layout, 
      issues
    );
    
    // Validate accessibility compliance
    const accessibilityCompliance = this.validateAccessibilityCompliance(
      componentCode, 
      styleCode, 
      ministryConfig.designStandards.accessibility, 
      issues
    );
    
    // Calculate overall compliance
    const overallCompliance = Math.round(
      (brandingCompliance * 0.25) + 
      (colorCompliance * 0.20) + 
      (typographyCompliance * 0.20) + 
      (layoutCompliance * 0.15) + 
      (accessibilityCompliance * 0.20)
    );
    
    // Generate recommendations
    const recommendations = this.generateComplianceRecommendations(issues, overallCompliance);
    
    const result = {
      brandingCompliance,
      colorCompliance,
      typographyCompliance,
      layoutCompliance,
      accessibilityCompliance,
      overallCompliance,
      issues,
      recommendations
    };
    
    this.emit('complianceValidated', { ministry, result });
    
    return result;
  }
  
  /**
   * Get available templates for ministry
   */
  async getAvailableTemplates(ministry: string): Promise<string[]> {
    const ministryConfig = this.ministryConfigs.get(ministry);
    if (!ministryConfig) {
      return [];
    }
    
    return Array.from(ministryConfig.componentTemplates.keys());
  }
  
  /**
   * Add custom template for ministry
   */
  async addCustomTemplate(
    ministry: string, 
    template: IComponentTemplate
  ): Promise<void> {
    const ministryConfig = this.ministryConfigs.get(ministry);
    if (!ministryConfig) {
      throw new Error(`Ministry configuration not found: ${ministry}`);
    }
    
    if (!this.options.enableCustomization) {
      throw new Error('Template customization is disabled');
    }
    
    ministryConfig.componentTemplates.set(template.type, template);
    
    this.emit('templateAdded', { ministry, template: template.type });
  }
  
  /**
   * Get ministry design standards
   */
  getDesignStandards(ministry: string): IDesignStandards | null {
    const ministryConfig = this.ministryConfigs.get(ministry);
    return ministryConfig ? ministryConfig.designStandards : null;
  }
  
  /**
   * Get total templates across all ministries
   */
  getTotalTemplates(): number {
    let total = 0;
    this.ministryConfigs.forEach(config => {
      total += config.componentTemplates.size;
    });
    return total;
  }
  
  /**
   * Get template manager analytics
   */
  getAnalytics(): ITemplateManagerAnalytics {
    return {
      totalMinistries: this.ministryConfigs.size,
      totalTemplates: this.getTotalTemplates(),
      cacheSize: this.templateCache.size,
      averageCompliance: this.calculateAverageCompliance(),
      popularTemplates: this.getPopularTemplates()
    };
  }
  
  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
    this.emit('cacheCleared');
  }
  
  /**
   * Private helper methods
   */
  
  private convertToMinistryTemplate(
    template: IComponentTemplate, 
    ministry: string
  ): IMinistryTemplate {
    const ministryConfig = this.ministryConfigs.get(ministry)!;
    
    return {
      id: template.id,
      ministryName: ministry,
      componentType: template.type,
      baseStructure: template.structure,
      culturalPatterns: template.culturalFeatures,
      brandingElements: this.createBrandingElements(ministryConfig),
      rtlOptimizations: this.getRTLOptimizations(template)
    };
  }
  
  private createBrandingElements(config: IMinistryConfig): IBrandingElements {
    return {
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      accentColor: config.accentColor,
      logoPlacement: 'header-left',
      typography: {
        arabicFont: config.designStandards.typography.arabicFont,
        englishFont: config.designStandards.typography.englishFont,
        headingSize: config.designStandards.typography.headingSizes[0],
        bodySize: config.designStandards.typography.bodySize,
        lineHeight: config.designStandards.typography.lineHeight,
        letterSpacing: config.designStandards.typography.letterSpacing
      },
      iconSet: config.designStandards.iconography.iconSet
    };
  }
  
  private getRTLOptimizations(template: IComponentTemplate): string[] {
    const baseOptimizations = [
      'dir="rtl"',
      'text-align: right',
      'margin-inline-start instead of margin-left',
      'padding-inline-start instead of padding-left'
    ];
    
    return [...baseOptimizations, ...template.culturalFeatures];
  }
  
  private createDefaultTemplate(
    componentType: string, 
    ministryConfig: IMinistryConfig
  ): IComponentTemplate {
    return {
      id: `default_${componentType}_${ministryConfig.code}`,
      name: `Default ${componentType}`,
      type: componentType,
      structure: this.getDefaultStructure(componentType),
      styles: this.getDefaultStyles(componentType, ministryConfig),
      props: this.getDefaultProps(componentType),
      variants: this.getDefaultVariants(componentType),
      culturalFeatures: [
        'Arabic RTL support',
        'Islamic design principles',
        'Iraqi cultural patterns',
        'Ministry branding'
      ],
      accessibilityFeatures: [
        'WCAG 2.1 AA compliance',
        'Arabic screen reader support',
        'RTL keyboard navigation',
        'High contrast support'
      ]
    };
  }
  
  private validateBrandingCompliance(
    code: string, 
    styles: string, 
    config: IMinistryConfig, 
    issues: IComplianceIssue[]
  ): number {
    let score = 100;
    
    // Check for ministry colors
    if (!styles.includes(config.primaryColor)) {
      issues.push({
        category: 'branding',
        severity: 'major',
        description: 'Ministry primary color not used',
        solution: `Use ${config.primaryColor} as primary color`,
        ministrySpecific: true
      });
      score -= 25;
    }
    
    // Check for logo placement
    if (!code.includes('logo') && !code.includes('brand')) {
      issues.push({
        category: 'branding',
        severity: 'minor',
        description: 'No ministry branding elements found',
        solution: 'Add ministry logo or branding elements',
        ministrySpecific: true
      });
      score -= 15;
    }
    
    return Math.max(0, score);
  }
  
  private validateColorCompliance(
    styles: string, 
    colorPalette: IColorPalette, 
    issues: IComplianceIssue[]
  ): number {
    let score = 100;
    
    // Check for approved colors
    const approvedColors = [
      ...colorPalette.primary,
      ...colorPalette.secondary,
      ...colorPalette.accent,
      ...colorPalette.neutral
    ];
    
    const colorMatches = styles.match(/#[0-9a-fA-F]{6}/g) || [];
    const unapprovedColors = colorMatches.filter(color => 
      !approvedColors.includes(color.toLowerCase())
    );
    
    if (unapprovedColors.length > 0) {
      issues.push({
        category: 'color',
        severity: 'minor',
        description: `Unapproved colors found: ${unapprovedColors.join(', ')}`,
        solution: 'Use colors from approved ministry palette',
        ministrySpecific: true
      });
      score -= 10 * unapprovedColors.length;
    }
    
    return Math.max(0, score);
  }
  
  private validateTypographyCompliance(
    styles: string, 
    typography: IMinistryTypography, 
    issues: IComplianceIssue[]
  ): number {
    let score = 100;
    
    // Check for approved fonts
    if (!styles.includes(typography.arabicFont)) {
      issues.push({
        category: 'typography',
        severity: 'major',
        description: 'Ministry Arabic font not used',
        solution: `Use ${typography.arabicFont} for Arabic text`,
        ministrySpecific: true
      });
      score -= 20;
    }
    
    // Check for proper line height
    if (!styles.includes(`line-height: ${typography.lineHeight}`)) {
      issues.push({
        category: 'typography',
        severity: 'minor',
        description: 'Ministry line height standards not followed',
        solution: `Set line-height to ${typography.lineHeight}`,
        ministrySpecific: true
      });
      score -= 10;
    }
    
    return Math.max(0, score);
  }
  
  private validateLayoutCompliance(
    code: string, 
    layout: ILayoutStandards, 
    issues: IComplianceIssue[]
  ): number {
    let score = 100;
    
    // Check for max width compliance
    if (!code.includes(layout.maxWidth)) {
      issues.push({
        category: 'layout',
        severity: 'minor',
        description: 'Layout max-width not following ministry standards',
        solution: `Use max-width: ${layout.maxWidth}`,
        ministrySpecific: true
      });
      score -= 15;
    }
    
    return Math.max(0, score);
  }
  
  private validateAccessibilityCompliance(
    code: string, 
    styles: string, 
    accessibility: IAccessibilityStandards, 
    issues: IComplianceIssue[]
  ): number {
    let score = 100;
    
    // Check for ARIA labels
    if (!code.includes('aria-label') && !code.includes('aria-describedby')) {
      issues.push({
        category: 'accessibility',
        severity: 'major',
        description: 'Missing ARIA labels for accessibility',
        solution: 'Add proper ARIA labels to interactive elements',
        ministrySpecific: false
      });
      score -= 25;
    }
    
    // Check for minimum font size
    const fontSizeMatch = styles.match(/font-size:\s*(\d+(?:\.\d+)?)(px|rem|em)/);
    if (fontSizeMatch) {
      const size = parseFloat(fontSizeMatch[1]);
      const unit = fontSizeMatch[2];
      
      if (unit === 'px' && size < 16) {
        issues.push({
          category: 'accessibility',
          severity: 'major',
          description: 'Font size below accessibility minimum',
          solution: 'Use minimum 16px font size',
          ministrySpecific: false
        });
        score -= 20;
      }
    }
    
    return Math.max(0, score);
  }
  
  private generateComplianceRecommendations(
    issues: IComplianceIssue[], 
    overallScore: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (overallScore < 90) {
      recommendations.push('Review component against ministry design standards');
    }
    
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push('Address critical compliance issues immediately');
    }
    
    const brandingIssues = issues.filter(i => i.category === 'branding');
    if (brandingIssues.length > 0) {
      recommendations.push('Ensure proper ministry branding implementation');
    }
    
    const accessibilityIssues = issues.filter(i => i.category === 'accessibility');
    if (accessibilityIssues.length > 0) {
      recommendations.push('Improve accessibility compliance for Arabic users');
    }
    
    return recommendations;
  }
  
  private createMinimalComplianceResult(): IMinistryComplianceValidation {
    return {
      brandingCompliance: 100,
      colorCompliance: 100,
      typographyCompliance: 100,
      layoutCompliance: 100,
      accessibilityCompliance: 100,
      overallCompliance: 100,
      issues: [],
      recommendations: []
    };
  }
  
  private loadMinistryConfigurations(): void {
    // Health Ministry Configuration
    this.loadHealthMinistryConfig();
    
    // Education Ministry Configuration
    this.loadEducationMinistryConfig();
    
    // Interior Ministry Configuration
    this.loadInteriorMinistryConfig();
    
    // Justice Ministry Configuration
    this.loadJusticeMinistryConfig();
    
    // General Government Configuration
    this.loadGeneralGovernmentConfig();
  }
  
  private loadHealthMinistryConfig(): void {
    const healthConfig: IMinistryConfig = {
      name: 'Ministry of Health',
      arabicName: 'وزارة الصحة',
      code: 'health',
      primaryColor: '#2D5A27', // Medical green
      secondaryColor: '#4A90A4', // Medical blue
      accentColor: '#F4A460', // Iraqi gold
      logoUrl: '/assets/logos/health-ministry.png',
      officialWebsite: 'https://moh.gov.iq',
      designStandards: {
        typography: {
          primaryFont: 'Amiri',
          secondaryFont: 'Inter',
          arabicFont: 'Amiri',
          englishFont: 'Inter',
          headingSizes: ['2rem', '1.5rem', '1.25rem'],
          bodySize: '1rem',
          lineHeight: 1.6,
          letterSpacing: 'normal'
        },
        colorPalette: {
          primary: ['#2D5A27', '#3A7233', '#478A3F'],
          secondary: ['#4A90A4', '#5BA0B4', '#6CB0C4'],
          accent: ['#F4A460', '#F6B373', '#F8C286'],
          neutral: ['#333333', '#666666', '#999999', '#CCCCCC'],
          success: '#28A745',
          warning: '#FFC107',
          error: '#DC3545',
          info: '#17A2B8'
        },
        spacing: {
          baseUnit: 1,
          componentSpacing: [0.5, 1, 1.5, 2, 3],
          sectionSpacing: [2, 3, 4, 6],
          containerPadding: '1rem',
          gridGutter: '1.5rem'
        },
        iconography: {
          iconSet: 'heroicons',
          iconSizes: [16, 20, 24, 32],
          iconColor: '#2D5A27',
          iconStyle: 'outline'
        },
        layout: {
          maxWidth: '1200px',
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px'
          },
          gridColumns: 12,
          sidebarWidth: '256px',
          headerHeight: '64px'
        },
        accessibility: {
          colorContrast: 4.5,
          fontSize: {
            minimum: '16px',
            maximum: '24px'
          },
          focusIndicator: '2px solid #2D5A27',
          screenReaderSupport: true
        }
      },
      componentTemplates: new Map()
    };
    
    // Add health-specific templates
    this.addHealthTemplates(healthConfig);
    
    this.ministryConfigs.set('health', healthConfig);
  }
  
  private loadEducationMinistryConfig(): void {
    const educationConfig: IMinistryConfig = {
      name: 'Ministry of Education',
      arabicName: 'وزارة التربية',
      code: 'education',
      primaryColor: '#1E3A8A', // Education blue
      secondaryColor: '#059669', // Learning green
      accentColor: '#F59E0B', // Academic gold
      logoUrl: '/assets/logos/education-ministry.png',
      officialWebsite: 'https://moedu.gov.iq',
      designStandards: this.createStandardDesignConfig('#1E3A8A'),
      componentTemplates: new Map()
    };
    
    this.addEducationTemplates(educationConfig);
    this.ministryConfigs.set('education', educationConfig);
  }
  
  private loadInteriorMinistryConfig(): void {
    const interiorConfig: IMinistryConfig = {
      name: 'Ministry of Interior',
      arabicName: 'وزارة الداخلية',
      code: 'interior',
      primaryColor: '#1F2937', // Security dark
      secondaryColor: '#374151', // Professional gray
      accentColor: '#EF4444', // Alert red
      logoUrl: '/assets/logos/interior-ministry.png',
      officialWebsite: 'https://moi.gov.iq',
      designStandards: this.createStandardDesignConfig('#1F2937'),
      componentTemplates: new Map()
    };
    
    this.addInteriorTemplates(interiorConfig);
    this.ministryConfigs.set('interior', interiorConfig);
  }
  
  private loadJusticeMinistryConfig(): void {
    const justiceConfig: IMinistryConfig = {
      name: 'Ministry of Justice',
      arabicName: 'وزارة العدل',
      code: 'justice',
      primaryColor: '#7C2D12', // Justice brown
      secondaryColor: '#1E40AF', // Legal blue
      accentColor: '#F59E0B', // Justice gold
      logoUrl: '/assets/logos/justice-ministry.png',
      officialWebsite: 'https://moj.gov.iq',
      designStandards: this.createStandardDesignConfig('#7C2D12'),
      componentTemplates: new Map()
    };
    
    this.addJusticeTemplates(justiceConfig);
    this.ministryConfigs.set('justice', justiceConfig);
  }
  
  private loadGeneralGovernmentConfig(): void {
    const generalConfig: IMinistryConfig = {
      name: 'General Government',
      arabicName: 'الحكومة العامة',
      code: 'general',
      primaryColor: '#059669', // Iraqi green
      secondaryColor: '#1E40AF', // Government blue
      accentColor: '#F59E0B', // Iraqi gold
      logoUrl: '/assets/logos/iraq-government.png',
      officialWebsite: 'https://gov.iq',
      designStandards: this.createStandardDesignConfig('#059669'),
      componentTemplates: new Map()
    };
    
    this.addGeneralTemplates(generalConfig);
    this.ministryConfigs.set('general', generalConfig);
  }
  
  private createStandardDesignConfig(primaryColor: string): IDesignStandards {
    return {
      typography: {
        primaryFont: 'Amiri',
        secondaryFont: 'Inter',
        arabicFont: 'Amiri',
        englishFont: 'Inter',
        headingSizes: ['2rem', '1.5rem', '1.25rem'],
        bodySize: '1rem',
        lineHeight: 1.6,
        letterSpacing: 'normal'
      },
      colorPalette: {
        primary: [primaryColor],
        secondary: ['#6B7280'],
        accent: ['#F59E0B'],
        neutral: ['#333333', '#666666', '#999999', '#CCCCCC'],
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8'
      },
      spacing: {
        baseUnit: 1,
        componentSpacing: [0.5, 1, 1.5, 2, 3],
        sectionSpacing: [2, 3, 4, 6],
        containerPadding: '1rem',
        gridGutter: '1.5rem'
      },
      iconography: {
        iconSet: 'heroicons',
        iconSizes: [16, 20, 24, 32],
        iconColor: primaryColor,
        iconStyle: 'outline'
      },
      layout: {
        maxWidth: '1200px',
        breakpoints: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        },
        gridColumns: 12,
        sidebarWidth: '256px',
        headerHeight: '64px'
      },
      accessibility: {
        colorContrast: 4.5,
        fontSize: {
          minimum: '16px',
          maximum: '24px'
        },
        focusIndicator: `2px solid ${primaryColor}`,
        screenReaderSupport: true
      }
    };
  }
  
  private addHealthTemplates(config: IMinistryConfig): void {
    config.componentTemplates.set('patient-form', this.createPatientFormTemplate());
    config.componentTemplates.set('medical-card', this.createMedicalCardTemplate());
    config.componentTemplates.set('appointment-scheduler', this.createAppointmentTemplate());
  }
  
  private addEducationTemplates(config: IMinistryConfig): void {
    config.componentTemplates.set('student-card', this.createStudentCardTemplate());
    config.componentTemplates.set('grade-display', this.createGradeDisplayTemplate());
    config.componentTemplates.set('course-enrollment', this.createCourseEnrollmentTemplate());
  }
  
  private addInteriorTemplates(config: IMinistryConfig): void {
    config.componentTemplates.set('citizen-form', this.createCitizenFormTemplate());
    config.componentTemplates.set('document-viewer', this.createDocumentViewerTemplate());
    config.componentTemplates.set('service-request', this.createServiceRequestTemplate());
  }
  
  private addJusticeTemplates(config: IMinistryConfig): void {
    config.componentTemplates.set('case-card', this.createCaseCardTemplate());
    config.componentTemplates.set('legal-form', this.createLegalFormTemplate());
    config.componentTemplates.set('court-schedule', this.createCourtScheduleTemplate());
  }
  
  private addGeneralTemplates(config: IMinistryConfig): void {
    config.componentTemplates.set('government-form', this.createGovernmentFormTemplate());
    config.componentTemplates.set('announcement-card', this.createAnnouncementCardTemplate());
    config.componentTemplates.set('contact-form', this.createContactFormTemplate());
  }
  
  private createPatientFormTemplate(): IComponentTemplate {
    return {
      id: 'patient-form-health',
      name: 'Patient Registration Form',
      type: 'patient-form',
      structure: this.getPatientFormStructure(),
      styles: this.getHealthFormStyles(),
      props: [
        { name: 'onSubmit', type: 'function', required: true, description: 'Form submission handler' },
        { name: 'patient', type: 'object', required: false, description: 'Existing patient data' }
      ],
      variants: [
        { name: 'registration', description: 'New patient registration', modifiers: {}, useCase: 'New patient' },
        { name: 'update', description: 'Update patient info', modifiers: {}, useCase: 'Existing patient' }
      ],
      culturalFeatures: [
        'Arabic RTL layout',
        'Islamic name patterns',
        'Iraqi ID validation',
        'Privacy compliance'
      ],
      accessibilityFeatures: [
        'Screen reader support',
        'Keyboard navigation',
        'Error announcements',
        'Field validation'
      ]
    };
  }
  
  private getDefaultStructure(componentType: string): string {
    const structures: { [key: string]: string } = {
      'form': 'form with RTL layout and validation',
      'card': 'card with ministry branding',
      'button': 'accessible button with ministry styling',
      'navigation': 'RTL navigation with Arabic support'
    };
    
    return structures[componentType] || 'generic component structure';
  }
  
  private getDefaultStyles(componentType: string, config: IMinistryConfig): string {
    return `
/* ${config.name} ${componentType} Styles */
.${componentType}-${config.code} {
  color: ${config.primaryColor};
  font-family: ${config.designStandards.typography.arabicFont};
  direction: rtl;
  text-align: right;
}
`;
  }
  
  private getDefaultProps(componentType: string): ITemplateProperty[] {
    const commonProps = [
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
      { name: 'id', type: 'string', required: false, description: 'Element ID' }
    ];
    
    if (componentType === 'form') {
      commonProps.push(
        { name: 'onSubmit', type: 'function', required: true, description: 'Form submission handler' }
      );
    }
    
    return commonProps;
  }
  
  private getDefaultVariants(componentType: string): ITemplateVariant[] {
    return [
      { 
        name: 'default', 
        description: `Standard ${componentType}`, 
        modifiers: {}, 
        useCase: 'General purpose' 
      }
    ];
  }
  
  private loadComplianceRules(): void {
    // Load ministry-specific compliance rules
    this.complianceRules.set('color-accessibility', {
      rule: 'Color contrast must meet WCAG AA standards',
      minimumRatio: 4.5
    });
    
    this.complianceRules.set('arabic-font', {
      rule: 'Arabic text must use approved Arabic fonts',
      approvedFonts: ['Amiri', 'Noto Sans Arabic', 'Cairo']
    });
    
    this.complianceRules.set('rtl-layout', {
      rule: 'All Arabic content must have RTL layout support',
      required: true
    });
  }
  
  private calculateAverageCompliance(): number {
    // This would be calculated from actual compliance validations
    return 95; // Placeholder
  }
  
  private getPopularTemplates(): string[] {
    // This would be based on usage analytics
    return ['form', 'card', 'button']; // Placeholder
  }
  
  private getPatientFormStructure(): string {
    return 'Patient registration form with medical fields';
  }
  
  private getHealthFormStyles(): string {
    return '/* Health ministry form styles */';
  }
  
  private createMedicalCardTemplate(): IComponentTemplate {
    return {
      id: 'medical-card-health',
      name: 'Medical Information Card',
      type: 'medical-card',
      structure: 'Medical information display card',
      styles: '/* Medical card styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createAppointmentTemplate(): IComponentTemplate {
    return {
      id: 'appointment-scheduler-health',
      name: 'Appointment Scheduler',
      type: 'appointment-scheduler',
      structure: 'Appointment booking interface',
      styles: '/* Appointment styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createStudentCardTemplate(): IComponentTemplate {
    return {
      id: 'student-card-education',
      name: 'Student Information Card',
      type: 'student-card',
      structure: 'Student information display',
      styles: '/* Student card styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createGradeDisplayTemplate(): IComponentTemplate {
    return {
      id: 'grade-display-education',
      name: 'Grade Display Component',
      type: 'grade-display',
      structure: 'Academic grade display',
      styles: '/* Grade display styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createCourseEnrollmentTemplate(): IComponentTemplate {
    return {
      id: 'course-enrollment-education',
      name: 'Course Enrollment Form',
      type: 'course-enrollment',
      structure: 'Course registration form',
      styles: '/* Course enrollment styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createCitizenFormTemplate(): IComponentTemplate {
    return {
      id: 'citizen-form-interior',
      name: 'Citizen Service Form',
      type: 'citizen-form',
      structure: 'Citizen service request form',
      styles: '/* Citizen form styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createDocumentViewerTemplate(): IComponentTemplate {
    return {
      id: 'document-viewer-interior',
      name: 'Document Viewer',
      type: 'document-viewer',
      structure: 'Document display interface',
      styles: '/* Document viewer styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createServiceRequestTemplate(): IComponentTemplate {
    return {
      id: 'service-request-interior',
      name: 'Service Request Form',
      type: 'service-request',
      structure: 'Government service request',
      styles: '/* Service request styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createCaseCardTemplate(): IComponentTemplate {
    return {
      id: 'case-card-justice',
      name: 'Legal Case Card',
      type: 'case-card',
      structure: 'Legal case information display',
      styles: '/* Case card styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createLegalFormTemplate(): IComponentTemplate {
    return {
      id: 'legal-form-justice',
      name: 'Legal Document Form',
      type: 'legal-form',
      structure: 'Legal document input form',
      styles: '/* Legal form styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createCourtScheduleTemplate(): IComponentTemplate {
    return {
      id: 'court-schedule-justice',
      name: 'Court Schedule Display',
      type: 'court-schedule',
      structure: 'Court hearing schedule',
      styles: '/* Court schedule styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createGovernmentFormTemplate(): IComponentTemplate {
    return {
      id: 'government-form-general',
      name: 'General Government Form',
      type: 'government-form',
      structure: 'Generic government form',
      styles: '/* Government form styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createAnnouncementCardTemplate(): IComponentTemplate {
    return {
      id: 'announcement-card-general',
      name: 'Government Announcement Card',
      type: 'announcement-card',
      structure: 'Official announcement display',
      styles: '/* Announcement card styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
  
  private createContactFormTemplate(): IComponentTemplate {
    return {
      id: 'contact-form-general',
      name: 'Government Contact Form',
      type: 'contact-form',
      structure: 'Government contact form',
      styles: '/* Contact form styles */',
      props: [],
      variants: [],
      culturalFeatures: [],
      accessibilityFeatures: []
    };
  }
}

// Supporting interfaces
export interface ITemplateManagerAnalytics {
  totalMinistries: number;
  totalTemplates: number;
  cacheSize: number;
  averageCompliance: number;
  popularTemplates: string[];
}

// Default export
export default MinistryTemplateManager;