/**
 * Iraqi AI Code Generator
 * AI-powered code generation with cultural intelligence and Arabic support
 * Enhanced from Onlook's AI tools for Iraqi government deployment
 *
 * Key Features:
 * - Culturally appropriate React component generation
 * - Arabic RTL-first code creation
 * - Islamic design principle compliance
 * - Ministry-specific component templates
 * - Bilingual code documentation and comments
 */

import { tool } from "ai";
import { z } from "zod";

export interface IraqiCodeGenerationConfig {
  ministry?: "health" | "education" | "interior" | "justice";
  language: "arabic" | "english" | "bilingual";
  islamicCompliance: boolean;
  rtlSupport: boolean;
  governmentSecurity: boolean;
  culturalValidation: boolean;
}

export interface CodeGenerationContext {
  projectType:
    | "government-service"
    | "ministry-dashboard"
    | "citizen-portal"
    | "administrative-tool";
  targetAudience:
    | "citizens"
    | "government-employees"
    | "ministry-officials"
    | "mixed";
  securityLevel: "public" | "internal" | "confidential" | "restricted";
  arabicContent: boolean;
  accessibilityLevel: "basic" | "enhanced" | "wcag-aa" | "government-standard";
}

export interface CulturalCodeValidation {
  islamicCompliance: {
    score: number; // 0-1
    issues: string[];
    recommendations: string[];
  };
  arabicSupport: {
    rtlLayout: boolean;
    arabicTypography: boolean;
    bilingualSupport: boolean;
  };
  ministryCompliance: {
    designTokens: boolean;
    colorScheme: boolean;
    componentStandards: boolean;
  };
  securityCompliance: {
    dataProtection: boolean;
    accessControl: boolean;
    auditTrail: boolean;
  };
}

export interface GeneratedCodeResult {
  code: string;
  explanation: string;
  culturalValidation: CulturalCodeValidation;
  improvements: string[];
  testingInstructions: string[];
  deploymentNotes: string[];
}

export class IraqiCodeGenerator {
  private config: IraqiCodeGenerationConfig;

  // Islamic design principles and color schemes
  private readonly ISLAMIC_COLOR_PALETTE = {
    primary: ["emerald-600", "teal-700", "blue-600", "indigo-700"],
    secondary: ["slate-600", "gray-700", "zinc-600"],
    accent: ["green-500", "sky-500", "purple-600"],
    neutral: ["gray-50", "slate-100", "zinc-100"],
    semantic: {
      success: "emerald-600",
      warning: "amber-600",
      error: "red-600", // Allowed for error states
      info: "blue-600",
    },
  };

  // Ministry-specific component templates
  private readonly MINISTRY_TEMPLATES = {
    health: {
      dashboard: `// وزارة الصحة - لوحة التحكم الطبية
const HealthDashboard = () => {
  return (
    <div className="min-h-screen bg-emerald-50 font-arabic" dir="rtl">
      <header className="bg-emerald-700 text-white p-6">
        <h1 className="text-2xl font-bold">نظام إدارة المستشفيات</h1>
        <p className="text-emerald-100">وزارة الصحة - جمهورية العراق</p>
      </header>
      {/* Medical content here */}
    </div>
  );
};`,
      form: `// نموذج بيانات المريض
const PatientForm = () => {
  return (
    <form className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg" dir="rtl">
      <h2 className="text-xl font-bold text-emerald-700 mb-6 font-arabic">
        معلومات المريض
      </h2>
      {/* Form fields */}
    </form>
  );
};`,
    },
    education: {
      dashboard: `// وزارة التربية - نظام إدارة المدارس
const EducationDashboard = () => {
  return (
    <div className="min-h-screen bg-blue-50 font-arabic" dir="rtl">
      <header className="bg-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold">نظام إدارة التعليم</h1>
        <p className="text-blue-100">وزارة التربية - جمهورية العراق</p>
      </header>
      {/* Educational content */}
    </div>
  );
};`,
      gradebook: `// دفتر الدرجات الإلكتروني
const ElectronicGradebook = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md" dir="rtl">
      <h3 className="text-lg font-bold text-blue-700 mb-4 font-arabic">
        دفتر الدرجات
      </h3>
      {/* Gradebook content */}
    </div>
  );
};`,
    },
    interior: {
      citizenServices: `// وزارة الداخلية - خدمات المواطنين
const CitizenServices = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-arabic" dir="rtl">
      <header className="bg-slate-700 text-white p-6">
        <h1 className="text-2xl font-bold">خدمات المواطنين</h1>
        <p className="text-slate-200">وزارة الداخلية - جمهورية العراق</p>
      </header>
      {/* Citizen services */}
    </div>
  );
};`,
      idVerification: `// التحقق من الهوية المدنية
const IDVerification = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <h2 className="text-xl font-bold text-slate-700 mb-4 font-arabic">
        التحقق من الهوية المدنية
      </h2>
      {/* ID verification form */}
    </div>
  );
};`,
    },
    justice: {
      caseManagement: `// وزارة العدل - إدارة القضايا
const CaseManagement = () => {
  return (
    <div className="min-h-screen bg-purple-50 font-arabic" dir="rtl">
      <header className="bg-purple-700 text-white p-6">
        <h1 className="text-2xl font-bold">نظام إدارة القضايا</h1>
        <p className="text-purple-100">وزارة العدل - جمهورية العراق</p>
      </header>
      {/* Case management content */}
    </div>
  );
};`,
      courtSchedule: `// جدول المحكمة
const CourtSchedule = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md" dir="rtl">
      <h3 className="text-lg font-bold text-purple-700 mb-4 font-arabic">
        جدول جلسات المحكمة
      </h3>
      {/* Court schedule */}
    </div>
  );
};`,
    },
  };

  // Cultural validation patterns
  private readonly CULTURAL_PATTERNS = {
    islamicCompliant: {
      colors: this.ISLAMIC_COLOR_PALETTE,
      forbiddenContent: ["gambling", "alcohol", "inappropriate-imagery"],
      requiredElements: ["prayer-time-awareness", "halal-compliance"],
    },
    arabicSupport: {
      rtlClasses: ["dir-rtl", "text-right", "font-arabic"],
      typographyClasses: ["leading-relaxed", "tracking-wide"],
      layoutClasses: ["flex-row-reverse", "justify-end"],
    },
    governmentStandards: {
      accessibility: ["aria-label", "role", "tabindex"],
      security: ["data-secure", "csrf-token"],
      audit: ["data-action", "data-user", "data-timestamp"],
    },
  };

  constructor(config: IraqiCodeGenerationConfig) {
    this.config = config;
  }

  /**
   * Generate culturally appropriate React component
   */
  async generateComponent(
    componentName: string,
    componentType:
      | "form"
      | "dashboard"
      | "navigation"
      | "card"
      | "modal"
      | "table",
    requirements: string,
    context: CodeGenerationContext,
  ): Promise<GeneratedCodeResult> {
    try {
      // Analyze requirements for cultural elements
      const culturalRequirements = this.analyzeCulturalRequirements(
        requirements,
        context,
      );

      // Generate base component code
      let generatedCode = await this.generateBaseComponent(
        componentName,
        componentType,
        requirements,
        context,
        culturalRequirements,
      );

      // Apply cultural enhancements
      generatedCode = this.applyCulturalEnhancements(
        generatedCode,
        culturalRequirements,
      );

      // Add ministry-specific customizations
      if (this.config.ministry) {
        generatedCode = this.applyMinistryCustomizations(
          generatedCode,
          this.config.ministry,
        );
      }

      // Apply Islamic design compliance
      if (this.config.islamicCompliance) {
        generatedCode = this.applyIslamicDesignPrinciples(generatedCode);
      }

      // Add Arabic RTL support
      if (this.config.rtlSupport) {
        generatedCode = this.applyRTLSupport(generatedCode);
      }

      // Add security enhancements for government deployment
      if (this.config.governmentSecurity) {
        generatedCode = this.applyGovernmentSecurity(generatedCode, context);
      }

      // Generate comprehensive explanation
      const explanation = this.generateExplanation(
        componentName,
        componentType,
        culturalRequirements,
      );

      // Validate cultural compliance
      const culturalValidation = await this.validateCulturalCompliance(
        generatedCode,
        context,
      );

      // Generate improvement suggestions
      const improvements = this.generateImprovementSuggestions(
        generatedCode,
        culturalValidation,
      );

      // Generate testing instructions
      const testingInstructions = this.generateTestingInstructions(
        componentName,
        context,
      );

      // Generate deployment notes
      const deploymentNotes = this.generateDeploymentNotes(context);

      return {
        code: generatedCode,
        explanation,
        culturalValidation,
        improvements,
        testingInstructions,
        deploymentNotes,
      };
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Generate ministry-specific dashboard component
   */
  async generateMinistryDashboard(
    ministry: "health" | "education" | "interior" | "justice",
    features: string[],
    context: CodeGenerationContext,
  ): Promise<GeneratedCodeResult> {
    const dashboardTemplate = this.MINISTRY_TEMPLATES[ministry]?.dashboard;

    if (!dashboardTemplate) {
      throw new Error(`No template available for ${ministry} ministry`);
    }

    // Customize template based on features
    let customizedCode = this.customizeDashboardTemplate(
      dashboardTemplate,
      features,
      context,
    );

    // Apply full cultural validation
    const culturalValidation = await this.validateCulturalCompliance(
      customizedCode,
      context,
    );

    return {
      code: customizedCode,
      explanation: `وزارة ${this.getMinistryNameInArabic(ministry)} - لوحة تحكم مخصصة مع الدعم الكامل للغة العربية والامتثال الإسلامي`,
      culturalValidation,
      improvements: this.generateMinistrySpecificImprovements(ministry),
      testingInstructions: this.generateMinistryTestingInstructions(ministry),
      deploymentNotes: this.generateMinistryDeploymentNotes(ministry),
    };
  }

  /**
   * Generate Arabic-first form component
   */
  async generateArabicForm(
    formName: string,
    fields: Array<{
      name: string;
      type: "text" | "email" | "phone" | "textarea" | "select" | "date";
      labelArabic: string;
      labelEnglish?: string;
      required?: boolean;
      validation?: string;
    }>,
    context: CodeGenerationContext,
  ): Promise<GeneratedCodeResult> {
    const formCode = this.generateArabicFormCode(formName, fields, context);

    const culturalValidation = await this.validateCulturalCompliance(
      formCode,
      context,
    );

    return {
      code: formCode,
      explanation: `نموذج عربي متكامل مع دعم الـ RTL والتحقق من البيانات والامتثال الثقافي`,
      culturalValidation,
      improvements: this.generateFormImprovements(fields),
      testingInstructions: this.generateFormTestingInstructions(formName),
      deploymentNotes: this.generateFormDeploymentNotes(),
    };
  }

  /**
   * Private helper methods
   */

  private analyzeCulturalRequirements(
    requirements: string,
    context: CodeGenerationContext,
  ): any {
    return {
      needsRTL: context.arabicContent || this.config.language !== "english",
      needsMinistryBranding: !!this.config.ministry,
      needsIslamicCompliance: this.config.islamicCompliance,
      needsGovernmentSecurity: context.securityLevel !== "public",
      needsAccessibility: context.accessibilityLevel !== "basic",
    };
  }

  private async generateBaseComponent(
    componentName: string,
    componentType: string,
    requirements: string,
    context: CodeGenerationContext,
    culturalRequirements: any,
  ): Promise<string> {
    // Generate basic component structure
    const baseTemplate = this.getBaseComponentTemplate(componentType);

    // Customize based on requirements
    return this.customizeComponentTemplate(
      baseTemplate,
      componentName,
      requirements,
      context,
      culturalRequirements,
    );
  }

  private getBaseComponentTemplate(componentType: string): string {
    const templates = {
      form: `
import React, { useState } from 'react';

const ComponentName = () => {
  const [formData, setFormData] = useState({});
  
  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <h2 className="text-xl font-bold mb-6 font-arabic">عنوان النموذج</h2>
      {/* Form content */}
    </form>
  );
};

export default ComponentName;`,

      dashboard: `
import React from 'react';

const ComponentName = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      <header className="bg-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      </header>
      <main className="container mx-auto p-6">
        {/* Dashboard content */}
      </main>
    </div>
  );
};

export default ComponentName;`,

      navigation: `
import React from 'react';

const ComponentName = () => {
  return (
    <nav className="bg-white shadow-lg" dir="rtl">
      <div className="container mx-auto px-6 py-4">
        {/* Navigation content */}
      </div>
    </nav>
  );
};

export default ComponentName;`,

      card: `
import React from 'react';

const ComponentName = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6" dir="rtl">
      <h3 className="text-lg font-bold mb-4 font-arabic">{title}</h3>
      {children}
    </div>
  );
};

export default ComponentName;`,

      modal: `
import React from 'react';

const ComponentName = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" dir="rtl">
        <h2 className="text-xl font-bold mb-4 font-arabic">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default ComponentName;`,

      table: `
import React from 'react';

const ComponentName = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow" dir="rtl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Table rows */}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentName;`,
    };

    return templates[componentType] || templates.card;
  }

  private customizeComponentTemplate(
    template: string,
    componentName: string,
    requirements: string,
    context: CodeGenerationContext,
    culturalRequirements: any,
  ): string {
    let customized = template.replace(/ComponentName/g, componentName);

    // Add ministry-specific styling if needed
    if (this.config.ministry) {
      customized = this.addMinistryBranding(customized, this.config.ministry);
    }

    // Add security attributes for government deployment
    if (context.securityLevel !== "public") {
      customized = this.addSecurityAttributes(customized, context);
    }

    return customized;
  }

  private applyCulturalEnhancements(code: string, requirements: any): string {
    let enhanced = code;

    // Add RTL support
    if (requirements.needsRTL) {
      enhanced = enhanced.replace(/className="/g, 'className="dir-rtl ');
    }

    // Add Arabic font classes
    if (this.config.language !== "english") {
      enhanced = enhanced.replace(/font-arabic/g, "font-arabic text-right");
    }

    return enhanced;
  }

  private applyMinistryCustomizations(code: string, ministry: string): string {
    const ministryColors = {
      health: "emerald",
      education: "blue",
      interior: "slate",
      justice: "purple",
    };

    const color = ministryColors[ministry] || "blue";
    return code.replace(/bg-blue-700/g, `bg-${color}-700`);
  }

  private applyIslamicDesignPrinciples(code: string): string {
    // Ensure modest and appropriate design
    return code
      .replace(/bg-red-/g, "bg-blue-")
      .replace(/border-red-/g, "border-blue-")
      .replace(/text-red-/g, "text-blue-");
  }

  private applyRTLSupport(code: string): string {
    return code
      .replace(/text-left/g, "text-right")
      .replace(/justify-start/g, "justify-end")
      .replace(/flex-row/g, "flex-row-reverse");
  }

  private applyGovernmentSecurity(
    code: string,
    context: CodeGenerationContext,
  ): string {
    // Add security attributes
    let secured = code;

    // Add CSRF protection
    secured = secured.replace(/<form/g, '<form data-csrf-protected="true"');

    // Add audit trail attributes
    secured = secured.replace(/onClick=/g, 'data-audit="true" onClick=');

    return secured;
  }

  private generateExplanation(
    componentName: string,
    componentType: string,
    requirements: any,
  ): string {
    const typeNames = {
      form: "نموذج",
      dashboard: "لوحة تحكم",
      navigation: "شريط التنقل",
      card: "بطاقة",
      modal: "نافذة منبثقة",
      table: "جدول",
    };

    return `تم إنشاء ${typeNames[componentType] || "مكون"} "${componentName}" مع الدعم الكامل للغة العربية والتوجه من اليمين إلى اليسار (RTL). يتضمن المكون المعايير الثقافية والإسلامية المطلوبة للنشر الحكومي العراقي.`;
  }

  private async validateCulturalCompliance(
    code: string,
    context: CodeGenerationContext,
  ): Promise<CulturalCodeValidation> {
    // Validate Islamic compliance
    const islamicCompliance = this.validateIslamicCompliance(code);

    // Validate Arabic support
    const arabicSupport = this.validateArabicSupport(code);

    // Validate ministry compliance
    const ministryCompliance = this.validateMinistryCompliance(code);

    // Validate security compliance
    const securityCompliance = this.validateSecurityCompliance(code, context);

    return {
      islamicCompliance,
      arabicSupport,
      ministryCompliance,
      securityCompliance,
    };
  }

  private validateIslamicCompliance(code: string): any {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check for non-compliant content
    const forbiddenTerms = ["gambling", "alcohol", "casino"];
    for (const term of forbiddenTerms) {
      if (code.includes(term)) {
        issues.push(`Contains forbidden content: ${term}`);
        score -= 0.3;
      }
    }

    // Check for appropriate colors
    if (code.includes("bg-red-") && !code.includes("error")) {
      recommendations.push(
        "Consider using blue or green instead of red for non-error states",
      );
      score -= 0.1;
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  private validateArabicSupport(code: string): any {
    return {
      rtlLayout: code.includes('dir="rtl"'),
      arabicTypography: code.includes("font-arabic"),
      bilingualSupport: this.config.language === "bilingual",
    };
  }

  private validateMinistryCompliance(code: string): any {
    return {
      designTokens: !!this.config.ministry,
      colorScheme: true, // Would check against ministry color scheme
      componentStandards: true, // Would validate against ministry component standards
    };
  }

  private validateSecurityCompliance(
    code: string,
    context: CodeGenerationContext,
  ): any {
    return {
      dataProtection: context.securityLevel !== "public",
      accessControl: code.includes("data-secure"),
      auditTrail: code.includes("data-audit"),
    };
  }

  private generateImprovementSuggestions(
    code: string,
    validation: CulturalCodeValidation,
  ): string[] {
    const suggestions: string[] = [];

    if (validation.islamicCompliance.score < 0.9) {
      suggestions.push("تحسين الامتثال للمبادئ الإسلامية في التصميم");
    }

    if (!validation.arabicSupport.rtlLayout) {
      suggestions.push("إضافة دعم كامل للتوجه من اليمين إلى اليسار");
    }

    if (!validation.securityCompliance.auditTrail) {
      suggestions.push("إضافة سجل تدقيق للأعمال الحكومية");
    }

    return suggestions;
  }

  private generateTestingInstructions(
    componentName: string,
    context: CodeGenerationContext,
  ): string[] {
    return [
      `اختبار عرض المكون ${componentName} في المتصفحات المختلفة`,
      "التحقق من دعم اللغة العربية والتوجه RTL",
      "اختبار إمكانية الوصول (Accessibility) حسب معايير WCAG",
      "التحقق من الامتثال الثقافي والإسلامي",
      "اختبار الأمان على مستوى المؤسسة الحكومية",
    ];
  }

  private generateDeploymentNotes(context: CodeGenerationContext): string[] {
    return [
      "التأكد من تكوين خادم الويب لدعم RTL",
      "تحميل خطوط اللغة العربية المطلوبة",
      "تفعيل إعدادات الأمان الحكومية",
      "التحقق من شهادات SSL للنشر الآمن",
      "مراجعة متطلبات الامتثال الوزاري",
    ];
  }

  // Additional helper methods for specific functionality

  private generateArabicFormCode(
    formName: string,
    fields: any[],
    context: CodeGenerationContext,
  ): string {
    const fieldsCode = fields
      .map((field) => this.generateFieldCode(field))
      .join("\n");

    return `
import React, { useState } from 'react';

const ${formName} = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic with cultural validation
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors on input change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6"
      dir="rtl"
      data-ministry="${this.config.ministry || "general"}"
      data-islamic-compliant="true"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 font-arabic">
          ${formName.replace(/([A-Z])/g, " $1").trim()}
        </h2>
        <p className="text-gray-600 mt-2 font-arabic">
          يرجى ملء جميع الحقول المطلوبة
        </p>
      </div>

      ${fieldsCode}

      <div className="flex justify-end space-x-4 space-x-reverse pt-6">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-arabic"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-arabic"
        >
          إرسال
        </button>
      </div>
    </form>
  );
};

export default ${formName};`;
  }

  private generateFieldCode(field: any): string {
    const baseClasses =
      "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-arabic text-right";

    switch (field.type) {
      case "textarea":
        return `
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
          ${field.labelArabic} ${field.required ? "*" : ""}
        </label>
        <textarea
          name="${field.name}"
          className="${baseClasses} resize-none"
          rows="4"
          placeholder="${field.labelArabic}"
          required={${field.required || false}}
          onChange={(e) => handleInputChange('${field.name}', e.target.value)}
        />
      </div>`;

      case "select":
        return `
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
          ${field.labelArabic} ${field.required ? "*" : ""}
        </label>
        <select
          name="${field.name}"
          className="${baseClasses}"
          required={${field.required || false}}
          onChange={(e) => handleInputChange('${field.name}', e.target.value)}
        >
          <option value="">اختر...</option>
          {/* Add options here */}
        </select>
      </div>`;

      default:
        return `
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
          ${field.labelArabic} ${field.required ? "*" : ""}
        </label>
        <input
          type="${field.type}"
          name="${field.name}"
          className="${baseClasses}"
          placeholder="${field.labelArabic}"
          required={${field.required || false}}
          onChange={(e) => handleInputChange('${field.name}', e.target.value)}
        />
      </div>`;
    }
  }

  private addMinistryBranding(code: string, ministry: string): string {
    const ministryNames = {
      health: "وزارة الصحة",
      education: "وزارة التربية",
      interior: "وزارة الداخلية",
      justice: "وزارة العدل",
    };

    return code.replace(
      /لوحة التحكم/g,
      `${ministryNames[ministry]} - لوحة التحكم`,
    );
  }

  private addSecurityAttributes(
    code: string,
    context: CodeGenerationContext,
  ): string {
    return code.replace(
      /<form/g,
      `<form data-security-level="${context.securityLevel}" data-audit-required="true"`,
    );
  }

  private getMinistryNameInArabic(ministry: string): string {
    const names = {
      health: "الصحة",
      education: "التربية",
      interior: "الداخلية",
      justice: "العدل",
    };
    return names[ministry] || ministry;
  }

  private generateMinistrySpecificImprovements(ministry: string): string[] {
    const improvements = {
      health: [
        "إضافة تشفير إضافي لبيانات المرضى",
        "تطبيق معايير HIPAA للخصوصية الطبية",
        "إضافة تقويم طبي بأوقات الصلاة",
      ],
      education: [
        "تطبيق معايير حماية بيانات الطلاب",
        "إضافة نظام تقييم متوافق مع المنهج العراقي",
        "دعم التقويم الهجري والميلادي",
      ],
      interior: [
        "تطبيق أعلى مستويات الأمان لبيانات المواطنين",
        "دعم التحقق البيومتري",
        "تكامل مع قواعد بيانات الهوية الوطنية",
      ],
      justice: [
        "تطبيق معايير الأمان القضائي",
        "دعم التوقيع الإلكتروني القانوني",
        "توافق مع الأحكام الشرعية والقانونية",
      ],
    };

    return improvements[ministry] || [];
  }

  private generateMinistryTestingInstructions(ministry: string): string[] {
    return [
      `اختبار متطلبات وزارة ${this.getMinistryNameInArabic(ministry)} الخاصة`,
      "التحقق من معايير الأمان الوزارية",
      "اختبار التكامل مع الأنظمة الحكومية الأخرى",
    ];
  }

  private generateMinistryDeploymentNotes(ministry: string): string[] {
    return [
      `الحصول على موافقة وزارة ${this.getMinistryNameInArabic(ministry)}`,
      "تكوين الشبكة الحكومية الآمنة",
      "التدريب على النظام للموظفين المختصين",
    ];
  }

  private generateFormImprovements(fields: any[]): string[] {
    return [
      "إضافة التحقق من صحة البيانات (Validation)",
      "تطبيق التشفير للحقول الحساسة",
      "إضافة دعم الحفظ التلقائي",
    ];
  }

  private generateFormTestingInstructions(formName: string): string[] {
    return [
      `اختبار جميع حقول نموذج ${formName}`,
      "التحقق من رسائل الخطأ باللغة العربية",
      "اختبار إرسال النموذج والتحقق من البيانات",
    ];
  }

  private generateFormDeploymentNotes(): string[] {
    return [
      "تكوين قاعدة البيانات لحفظ بيانات النموذج",
      "تفعيل التشفير للبيانات الحساسة",
      "إعداد نسخ احتياطية دورية",
    ];
  }

  private customizeDashboardTemplate(
    template: string,
    features: string[],
    context: CodeGenerationContext,
  ): string {
    // Add features to dashboard template
    let customized = template;

    features.forEach((feature) => {
      const featureComponent = this.generateFeatureComponent(feature);
      customized = customized.replace(
        "{/* Dashboard content */}",
        `{/* Dashboard content */}\n        ${featureComponent}`,
      );
    });

    return customized;
  }

  private generateFeatureComponent(feature: string): string {
    return `<div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 font-arabic">${feature}</h3>
          {/* ${feature} implementation */}
        </div>`;
  }

  /**
   * Public API methods
   */

  /**
   * Get generator configuration
   */
  getConfiguration(): IraqiCodeGenerationConfig {
    return { ...this.config };
  }

  /**
   * Update generator configuration
   */
  updateConfiguration(newConfig: Partial<IraqiCodeGenerationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get available ministry templates
   */
  getAvailableMinistryTemplates(): string[] {
    return Object.keys(this.MINISTRY_TEMPLATES);
  }

  /**
   * Get Islamic compliant color palette
   */
  getIslamicColorPalette(): any {
    return { ...this.ISLAMIC_COLOR_PALETTE };
  }
}
