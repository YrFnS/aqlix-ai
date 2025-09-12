/**
 * Iraqi AI Workspace Routing Utilities
 * Enhanced chatbot-ui routing structure with Arabic locale and Iraqi professional domains
 * Supports pattern: /[locale]/[workspaceid]/[feature]
 */

import { NextRequest } from 'next/server';

// ====================== Types & Interfaces ======================

export type SupportedLocale = 'ar' | 'ar-IQ' | 'en' | 'en-US';
export type ProfessionalDomain = 'personal' | 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
export type WorkspaceFeature = 'chat' | 'documents' | 'settings' | 'members' | 'analytics' | 'compliance';

export interface WorkspaceRoute {
  locale: SupportedLocale;
  workspaceId: string;
  feature?: WorkspaceFeature;
  subFeature?: string;
  params?: Record<string, string>;
}

export interface IraqiRouteConfig {
  locale: SupportedLocale;
  rtlMode: boolean;
  culturalCompliance: boolean;
  dialectPreference: 'baghdad' | 'basra' | 'mosul' | 'general';
  professionalContext?: ProfessionalDomain;
  isAuthRequired: boolean;
  culturalValidationRequired: boolean;
}

export interface RoutePermissions {
  workspaceAccess: boolean;
  featureAccess: boolean;
  culturallyApproved: boolean;
  professionallyAuthorized: boolean;
  requiresIslamicCompliance: boolean;
}

// ====================== Route Patterns ======================

export const WORKSPACE_ROUTE_PATTERNS = {
  // Workspace root: /ar/ws_123
  WORKSPACE_ROOT: /^\/([a-z]{2}(?:-[A-Z]{2})?)\/([a-zA-Z0-9_-]+)$/,
  
  // Feature routes: /ar/ws_123/chat
  WORKSPACE_FEATURE: /^\/([a-z]{2}(?:-[A-Z]{2})?)\/([a-zA-Z0-9_-]+)\/([a-z]+)$/,
  
  // Sub-feature routes: /ar/ws_123/settings/members
  WORKSPACE_SUB_FEATURE: /^\/([a-z]{2}(?:-[A-Z]{2})?)\/([a-zA-Z0-9_-]+)\/([a-z]+)\/([a-z]+)$/,
  
  // API routes: /api/workspace/ws_123/chat
  API_WORKSPACE: /^\/api\/workspace\/([a-zA-Z0-9_-]+)\/([a-z]+)$/,
  
  // Cultural validation routes: /ar/ws_123/compliance/validate
  CULTURAL_VALIDATION: /^\/([a-z]{2}(?:-[A-Z]{2})?)\/([a-zA-Z0-9_-]+)\/compliance\/([a-z]+)$/
};

export const PROFESSIONAL_DOMAIN_ROUTES = {
  legal: {
    baseRoute: 'legal',
    features: ['consultations', 'cases', 'documents', 'clients', 'court-calendar', 'legal-research'],
    culturalRequirements: ['islamic-jurisprudence', 'iraqi-civil-law', 'professional-ethics']
  },
  medical: {
    baseRoute: 'medical',
    features: ['patients', 'appointments', 'diagnoses', 'prescriptions', 'medical-records', 'telemedicine'],
    culturalRequirements: ['islamic-medical-ethics', 'patient-privacy', 'halal-medications']
  },
  educational: {
    baseRoute: 'education',
    features: ['courses', 'students', 'assessments', 'curriculum', 'research', 'academic-calendar'],
    culturalRequirements: ['islamic-education', 'arabic-language-support', 'cultural-sensitivity']
  },
  business: {
    baseRoute: 'business',
    features: ['projects', 'clients', 'invoicing', 'reports', 'team', 'marketplace'],
    culturalRequirements: ['halal-business-practices', 'islamic-finance', 'cultural-marketing']
  },
  engineering: {
    baseRoute: 'engineering',
    features: ['projects', 'blueprints', 'calculations', 'specifications', 'quality-assurance', 'safety'],
    culturalRequirements: ['iraqi-building-codes', 'environmental-compliance', 'safety-standards']
  }
};

// ====================== Route Parser ======================

export class IraqiWorkspaceRouter {
  private static instance: IraqiWorkspaceRouter;
  private routeCache = new Map<string, WorkspaceRoute>();
  private permissionCache = new Map<string, RoutePermissions>();

  static getInstance(): IraqiWorkspaceRouter {
    if (!IraqiWorkspaceRouter.instance) {
      IraqiWorkspaceRouter.instance = new IraqiWorkspaceRouter();
    }
    return IraqiWorkspaceRouter.instance;
  }

  // ====================== Route Parsing ======================

  parseRoute(pathname: string): WorkspaceRoute | null {
    // Check cache first
    if (this.routeCache.has(pathname)) {
      return this.routeCache.get(pathname)!;
    }

    let route: WorkspaceRoute | null = null;

    // Try different route patterns
    if (WORKSPACE_ROUTE_PATTERNS.WORKSPACE_SUB_FEATURE.test(pathname)) {
      const match = pathname.match(WORKSPACE_ROUTE_PATTERNS.WORKSPACE_SUB_FEATURE);
      if (match) {
        route = {
          locale: match[1] as SupportedLocale,
          workspaceId: match[2],
          feature: match[3] as WorkspaceFeature,
          subFeature: match[4]
        };
      }
    } else if (WORKSPACE_ROUTE_PATTERNS.WORKSPACE_FEATURE.test(pathname)) {
      const match = pathname.match(WORKSPACE_ROUTE_PATTERNS.WORKSPACE_FEATURE);
      if (match) {
        route = {
          locale: match[1] as SupportedLocale,
          workspaceId: match[2],
          feature: match[3] as WorkspaceFeature
        };
      }
    } else if (WORKSPACE_ROUTE_PATTERNS.WORKSPACE_ROOT.test(pathname)) {
      const match = pathname.match(WORKSPACE_ROUTE_PATTERNS.WORKSPACE_ROOT);
      if (match) {
        route = {
          locale: match[1] as SupportedLocale,
          workspaceId: match[2]
        };
      }
    } else if (WORKSPACE_ROUTE_PATTERNS.CULTURAL_VALIDATION.test(pathname)) {
      const match = pathname.match(WORKSPACE_ROUTE_PATTERNS.CULTURAL_VALIDATION);
      if (match) {
        route = {
          locale: match[1] as SupportedLocale,
          workspaceId: match[2],
          feature: 'compliance',
          subFeature: match[3]
        };
      }
    }

    // Cache the result
    if (route) {
      this.routeCache.set(pathname, route);
    }

    return route;
  }

  // ====================== Route Generation ======================

  generateWorkspaceUrl(workspaceId: string, locale: SupportedLocale = 'ar', feature?: WorkspaceFeature, subFeature?: string): string {
    let url = `/${locale}/${workspaceId}`;
    
    if (feature) {
      url += `/${feature}`;
    }
    
    if (subFeature) {
      url += `/${subFeature}`;
    }
    
    return url;
  }

  generateProfessionalDomainUrl(
    workspaceId: string, 
    domain: ProfessionalDomain, 
    feature: string,
    locale: SupportedLocale = 'ar'
  ): string {
    const domainConfig = PROFESSIONAL_DOMAIN_ROUTES[domain];
    return `/${locale}/${workspaceId}/${domainConfig.baseRoute}/${feature}`;
  }

  generateApiUrl(workspaceId: string, endpoint: string): string {
    return `/api/workspace/${workspaceId}/${endpoint}`;
  }

  generateCulturalValidationUrl(
    workspaceId: string, 
    validationType: string,
    locale: SupportedLocale = 'ar'
  ): string {
    return `/${locale}/${workspaceId}/compliance/${validationType}`;
  }

  // ====================== Route Configuration ======================

  getRouteConfig(route: WorkspaceRoute): IraqiRouteConfig {
    const isArabic = route.locale.startsWith('ar');
    const dialectMap = {
      'ar': 'general',
      'ar-IQ': 'general'
    };

    return {
      locale: route.locale,
      rtlMode: isArabic,
      culturalCompliance: true,
      dialectPreference: dialectMap[route.locale as keyof typeof dialectMap] || 'general',
      isAuthRequired: route.feature !== 'compliance',
      culturalValidationRequired: route.feature === 'chat' || route.feature === 'documents'
    };
  }

  getProfessionalContext(route: WorkspaceRoute): ProfessionalDomain | null {
    if (!route.feature) return null;

    // Check if feature belongs to a professional domain
    for (const [domain, config] of Object.entries(PROFESSIONAL_DOMAIN_ROUTES)) {
      if (route.feature === config.baseRoute || config.features.includes(route.feature)) {
        return domain as ProfessionalDomain;
      }
    }

    return null;
  }

  // ====================== Permission Checking ======================

  async checkRoutePermissions(route: WorkspaceRoute, userId: string): Promise<RoutePermissions> {
    const cacheKey = `${route.workspaceId}-${route.feature}-${userId}`;
    
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!;
    }

    // Simulate permission checking - in real implementation, check database
    const permissions: RoutePermissions = {
      workspaceAccess: await this.checkWorkspaceAccess(route.workspaceId, userId),
      featureAccess: await this.checkFeatureAccess(route.workspaceId, route.feature, userId),
      culturallyApproved: await this.checkCulturalApproval(route.workspaceId, userId),
      professionallyAuthorized: await this.checkProfessionalAuthorization(route, userId),
      requiresIslamicCompliance: this.requiresIslamicCompliance(route)
    };

    // Cache permissions for 5 minutes
    this.permissionCache.set(cacheKey, permissions);
    setTimeout(() => this.permissionCache.delete(cacheKey), 5 * 60 * 1000);

    return permissions;
  }

  private async checkWorkspaceAccess(workspaceId: string, userId: string): Promise<boolean> {
    // Simulate database check
    return true; // Simplified
  }

  private async checkFeatureAccess(workspaceId: string, feature: WorkspaceFeature | undefined, userId: string): Promise<boolean> {
    if (!feature) return true;

    // Check if user has access to specific features
    const restrictedFeatures = ['settings', 'members', 'compliance'];
    if (restrictedFeatures.includes(feature)) {
      // Check if user is workspace admin/owner
      return true; // Simplified
    }

    return true;
  }

  private async checkCulturalApproval(workspaceId: string, userId: string): Promise<boolean> {
    // Check user's cultural compliance score
    return true; // Simplified
  }

  private async checkProfessionalAuthorization(route: WorkspaceRoute, userId: string): Promise<boolean> {
    const professionalContext = this.getProfessionalContext(route);
    
    if (!professionalContext) return true;

    // For professional domains, check if user has required credentials
    const professionalDomains = ['legal', 'medical'];
    if (professionalDomains.includes(professionalContext)) {
      // Check professional license/certification
      return true; // Simplified
    }

    return true;
  }

  private requiresIslamicCompliance(route: WorkspaceRoute): boolean {
    const complianceRequiredFeatures = ['chat', 'documents', 'compliance'];
    return route.feature ? complianceRequiredFeatures.includes(route.feature) : false;
  }

  // ====================== Locale Management ======================

  getSupportedLocales(): SupportedLocale[] {
    return ['ar', 'ar-IQ', 'en', 'en-US'];
  }

  getDefaultLocale(): SupportedLocale {
    return 'ar';
  }

  getLocaleDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
    return locale.startsWith('ar') ? 'rtl' : 'ltr';
  }

  getLocalizedWorkspaceTitle(workspaceName: string, workspaceNameAr: string | undefined, locale: SupportedLocale): string {
    if (locale.startsWith('ar')) {
      return workspaceNameAr || workspaceName;
    }
    return workspaceName;
  }

  // ====================== URL Validation ======================

  isValidWorkspaceId(workspaceId: string): boolean {
    // Validate workspace ID format
    const workspaceIdPattern = /^ws_[0-9]+_[a-zA-Z0-9]{9}$/;
    return workspaceIdPattern.test(workspaceId);
  }

  isValidLocale(locale: string): locale is SupportedLocale {
    return this.getSupportedLocales().includes(locale as SupportedLocale);
  }

  isValidFeature(feature: string): feature is WorkspaceFeature {
    const validFeatures: WorkspaceFeature[] = ['chat', 'documents', 'settings', 'members', 'analytics', 'compliance'];
    return validFeatures.includes(feature as WorkspaceFeature);
  }

  // ====================== Request Helpers ======================

  extractRouteFromRequest(request: NextRequest): WorkspaceRoute | null {
    return this.parseRoute(request.nextUrl.pathname);
  }

  getPreferredLocale(request: NextRequest): SupportedLocale {
    // Try to get locale from URL first
    const route = this.extractRouteFromRequest(request);
    if (route && this.isValidLocale(route.locale)) {
      return route.locale;
    }

    // Fall back to Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      if (acceptLanguage.includes('ar')) return 'ar-IQ';
      if (acceptLanguage.includes('en')) return 'en-US';
    }

    return this.getDefaultLocale();
  }

  // ====================== Breadcrumb Generation ======================

  generateBreadcrumbs(route: WorkspaceRoute): Array<{ label: string; labelAr: string; url: string; isActive: boolean }> {
    const breadcrumbs = [];

    // Workspace root
    breadcrumbs.push({
      label: 'Workspace',
      labelAr: 'مساحة العمل',
      url: this.generateWorkspaceUrl(route.workspaceId, route.locale),
      isActive: !route.feature
    });

    // Feature level
    if (route.feature) {
      const featureLabels = {
        chat: { en: 'Chat', ar: 'المحادثة' },
        documents: { en: 'Documents', ar: 'المستندات' },
        settings: { en: 'Settings', ar: 'الإعدادات' },
        members: { en: 'Members', ar: 'الأعضاء' },
        analytics: { en: 'Analytics', ar: 'التحليلات' },
        compliance: { en: 'Compliance', ar: 'الامتثال' }
      };

      const featureLabel = featureLabels[route.feature];
      breadcrumbs.push({
        label: featureLabel.en,
        labelAr: featureLabel.ar,
        url: this.generateWorkspaceUrl(route.workspaceId, route.locale, route.feature),
        isActive: !route.subFeature
      });
    }

    // Sub-feature level
    if (route.subFeature) {
      breadcrumbs.push({
        label: route.subFeature.charAt(0).toUpperCase() + route.subFeature.slice(1),
        labelAr: route.subFeature, // Would need translation mapping
        url: this.generateWorkspaceUrl(route.workspaceId, route.locale, route.feature, route.subFeature),
        isActive: true
      });
    }

    return breadcrumbs;
  }

  // ====================== Professional Domain Routing ======================

  getProfessionalDomainRoutes(domain: ProfessionalDomain): Array<{
    feature: string;
    label: string;
    labelAr: string;
    culturalRequirements: string[];
  }> {
    const domainConfig = PROFESSIONAL_DOMAIN_ROUTES[domain];
    const labels = {
      // Legal
      consultations: { en: 'Consultations', ar: 'الاستشارات' },
      cases: { en: 'Cases', ar: 'القضايا' },
      clients: { en: 'Clients', ar: 'العملاء' },
      'court-calendar': { en: 'Court Calendar', ar: 'جدول المحكمة' },
      'legal-research': { en: 'Legal Research', ar: 'البحث القانوني' },
      
      // Medical
      patients: { en: 'Patients', ar: 'المرضى' },
      appointments: { en: 'Appointments', ar: 'المواعيد' },
      diagnoses: { en: 'Diagnoses', ar: 'التشخيصات' },
      prescriptions: { en: 'Prescriptions', ar: 'الوصفات الطبية' },
      'medical-records': { en: 'Medical Records', ar: 'السجلات الطبية' },
      telemedicine: { en: 'Telemedicine', ar: 'الطب عن بُعد' },
      
      // Educational
      courses: { en: 'Courses', ar: 'الدورات' },
      students: { en: 'Students', ar: 'الطلاب' },
      assessments: { en: 'Assessments', ar: 'التقييمات' },
      curriculum: { en: 'Curriculum', ar: 'المنهج' },
      research: { en: 'Research', ar: 'البحث' },
      'academic-calendar': { en: 'Academic Calendar', ar: 'التقويم الأكاديمي' },
      
      // Business
      projects: { en: 'Projects', ar: 'المشاريع' },
      invoicing: { en: 'Invoicing', ar: 'إصدار الفواتير' },
      reports: { en: 'Reports', ar: 'التقارير' },
      team: { en: 'Team', ar: 'الفريق' },
      marketplace: { en: 'Marketplace', ar: 'السوق' },
      
      // Engineering
      blueprints: { en: 'Blueprints', ar: 'المخططات' },
      calculations: { en: 'Calculations', ar: 'الحسابات' },
      specifications: { en: 'Specifications', ar: 'المواصفات' },
      'quality-assurance': { en: 'Quality Assurance', ar: 'ضمان الجودة' },
      safety: { en: 'Safety', ar: 'السلامة' }
    };

    return domainConfig.features.map(feature => {
      const label = labels[feature as keyof typeof labels] || { en: feature, ar: feature };
      return {
        feature,
        label: label.en,
        labelAr: label.ar,
        culturalRequirements: domainConfig.culturalRequirements
      };
    });
  }

  // ====================== Route Middleware Helpers ======================

  createRouteMiddleware() {
    return async (request: NextRequest) => {
      const route = this.extractRouteFromRequest(request);
      
      if (!route) {
        return new Response('Invalid route', { status: 400 });
      }

      // Validate workspace ID format
      if (!this.isValidWorkspaceId(route.workspaceId)) {
        return new Response('Invalid workspace ID', { status: 400 });
      }

      // Validate locale
      if (!this.isValidLocale(route.locale)) {
        // Redirect to preferred locale
        const preferredLocale = this.getPreferredLocale(request);
        const redirectUrl = request.nextUrl.pathname.replace(`/${route.locale}/`, `/${preferredLocale}/`);
        return Response.redirect(new URL(redirectUrl, request.url));
      }

      // Add route information to request headers for downstream use
      const response = Response.next();
      response.headers.set('x-workspace-id', route.workspaceId);
      response.headers.set('x-locale', route.locale);
      response.headers.set('x-rtl-mode', this.getLocaleDirection(route.locale) === 'rtl' ? 'true' : 'false');
      
      if (route.feature) {
        response.headers.set('x-feature', route.feature);
      }
      
      if (route.subFeature) {
        response.headers.set('x-sub-feature', route.subFeature);
      }

      return response;
    };
  }

  // ====================== Cache Management ======================

  clearCache(): void {
    this.routeCache.clear();
    this.permissionCache.clear();
  }

  getCacheStats(): {
    routeCacheSize: number;
    permissionCacheSize: number;
  } {
    return {
      routeCacheSize: this.routeCache.size,
      permissionCacheSize: this.permissionCache.size
    };
  }
}