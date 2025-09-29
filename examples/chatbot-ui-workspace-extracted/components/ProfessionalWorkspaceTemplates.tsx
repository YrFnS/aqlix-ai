/**
 * Iraqi Professional Domain Workspace Templates
 * Pre-configured workspace templates for Iraqi professional domains
 * Legal, Medical, Educational, Business, and Engineering specializations
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Scale,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Wrench,
  Shield,
  FileText,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

// ====================== Types ======================

interface ProfessionalTemplate {
  id: string;
  type: "legal" | "medical" | "educational" | "business" | "engineering";
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<any>;
  features: string[];
  featuresAr: string[];
  culturalRequirements: string[];
  culturalRequirementsAr: string[];
  specializations: Array<{
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    requirements: string[];
  }>;
  defaultSettings: {
    maxMembers: number;
    maxFileSize: number;
    allowedFileTypes: string[];
    culturalStrictness: "standard" | "strict";
    requiresLicense: boolean;
    complianceLevel: "high" | "maximum";
  };
  estimatedSetupTime: number; // minutes
  popularity: number; // 1-5 stars
  isRecommended: boolean;
}

interface TemplateSelectionProps {
  onSelectTemplate: (template: ProfessionalTemplate) => void;
  locale: "ar" | "en";
  userType?: "individual" | "organization";
}

// ====================== Template Data ======================

const PROFESSIONAL_TEMPLATES: ProfessionalTemplate[] = [
  {
    id: "legal-general",
    type: "legal",
    name: "General Legal Practice",
    nameAr: "الممارسة القانونية العامة",
    description:
      "Comprehensive legal workspace for Iraqi law practitioners covering civil, commercial, and family law.",
    descriptionAr:
      "مساحة عمل قانونية شاملة للممارسين القانونيين العراقيين تغطي القانون المدني والتجاري وقانون الأسرة.",
    icon: Scale,
    features: [
      "Case management and tracking",
      "Client consultation scheduling",
      "Legal document templates (Iraqi format)",
      "Court calendar integration",
      "Fee calculation and invoicing",
      "Legal research database access",
    ],
    featuresAr: [
      "إدارة ومتابعة القضايا",
      "جدولة استشارات العملاء",
      "قوالب الوثائق القانونية (النسق العراقي)",
      "تكامل جدول المحكمة",
      "حساب الأتعاب وإصدار الفواتير",
      "الوصول إلى قاعدة بيانات البحث القانوني",
    ],
    culturalRequirements: [
      "Islamic jurisprudence compliance",
      "Iraqi civil law adherence",
      "Professional ethics standards",
      "Confidentiality protocols",
      "Court procedure compliance",
    ],
    culturalRequirementsAr: [
      "الامتثال للفقه الإسلامي",
      "الالتزام بالقانون المدني العراقي",
      "معايير الأخلاق المهنية",
      "بروتوكولات السرية",
      "الامتثال لإجراءات المحكمة",
    ],
    specializations: [
      {
        id: "civil-law",
        name: "Civil Law",
        nameAr: "القانون المدني",
        description: "Contracts, property rights, and civil disputes",
        descriptionAr: "العقود وحقوق الملكية والنزاعات المدنية",
        requirements: [
          "Iraqi Bar Association membership",
          "Civil law certification",
        ],
      },
      {
        id: "commercial-law",
        name: "Commercial Law",
        nameAr: "القانون التجاري",
        description: "Business formation, commercial disputes, and trade law",
        descriptionAr: "تكوين الأعمال والنزاعات التجارية وقانون التجارة",
        requirements: [
          "Commercial law license",
          "Business registration expertise",
        ],
      },
      {
        id: "family-law",
        name: "Family Law",
        nameAr: "قانون الأسرة",
        description: "Marriage, divorce, inheritance, and family matters",
        descriptionAr: "الزواج والطلاق والميراث وشؤون الأسرة",
        requirements: ["Family law specialization", "Islamic law knowledge"],
      },
    ],
    defaultSettings: {
      maxMembers: 25,
      maxFileSize: 500,
      allowedFileTypes: ["pdf", "doc", "docx", "txt", "rtf", "html", "xml"],
      culturalStrictness: "strict",
      requiresLicense: true,
      complianceLevel: "maximum",
    },
    estimatedSetupTime: 15,
    popularity: 5,
    isRecommended: true,
  },
  {
    id: "medical-clinic",
    type: "medical",
    name: "Medical Clinic Practice",
    nameAr: "ممارسة العيادة الطبية",
    description:
      "Complete medical practice management for Iraqi healthcare providers and clinics.",
    descriptionAr:
      "إدارة شاملة للممارسة الطبية لمقدمي الرعاية الصحية والعيادات العراقية.",
    icon: Stethoscope,
    features: [
      "Patient record management",
      "Appointment scheduling",
      "Prescription management",
      "Medical imaging integration",
      "Telemedicine support",
      "Insurance claim processing",
    ],
    featuresAr: [
      "إدارة سجلات المرضى",
      "جدولة المواعيد",
      "إدارة الوصفات الطبية",
      "تكامل التصوير الطبي",
      "دعم الطب عن بُعد",
      "معالجة مطالبات التأمين",
    ],
    culturalRequirements: [
      "Islamic medical ethics compliance",
      "Patient privacy protection",
      "Halal medication guidelines",
      "Gender-sensitive care protocols",
      "Religious accommodation procedures",
    ],
    culturalRequirementsAr: [
      "الامتثال لأخلاقيات الطب الإسلامية",
      "حماية خصوصية المريض",
      "إرشادات الأدوية الحلال",
      "بروتوكولات الرعاية الحساسة للجنس",
      "إجراءات التكيف الديني",
    ],
    specializations: [
      {
        id: "general-medicine",
        name: "General Medicine",
        nameAr: "الطب العام",
        description: "Primary care and general medical practice",
        descriptionAr: "الرعاية الأولية والممارسة الطبية العامة",
        requirements: ["Medical license", "Primary care certification"],
      },
      {
        id: "pediatrics",
        name: "Pediatrics",
        nameAr: "طب الأطفال",
        description: "Specialized care for infants, children, and adolescents",
        descriptionAr: "رعاية متخصصة للرضع والأطفال والمراهقين",
        requirements: [
          "Pediatric specialization",
          "Child healthcare certification",
        ],
      },
      {
        id: "internal-medicine",
        name: "Internal Medicine",
        nameAr: "الطب الباطني",
        description: "Adult disease prevention, diagnosis, and treatment",
        descriptionAr: "الوقاية من أمراض البالغين وتشخيصها وعلاجها",
        requirements: [
          "Internal medicine board certification",
          "Adult care specialization",
        ],
      },
    ],
    defaultSettings: {
      maxMembers: 20,
      maxFileSize: 200,
      allowedFileTypes: [
        "pdf",
        "doc",
        "docx",
        "dcm",
        "nii",
        "jpg",
        "png",
        "tiff",
      ],
      culturalStrictness: "strict",
      requiresLicense: true,
      complianceLevel: "maximum",
    },
    estimatedSetupTime: 20,
    popularity: 5,
    isRecommended: true,
  },
  {
    id: "educational-institution",
    type: "educational",
    name: "Educational Institution",
    nameAr: "المؤسسة التعليمية",
    description:
      "Comprehensive educational management for Iraqi schools, universities, and training centers.",
    descriptionAr:
      "إدارة تعليمية شاملة للمدارس والجامعات ومراكز التدريب العراقية.",
    icon: GraduationCap,
    features: [
      "Course curriculum management",
      "Student enrollment and tracking",
      "Grade and assessment recording",
      "Parent-teacher communication",
      "Academic calendar planning",
      "Library resource management",
    ],
    featuresAr: [
      "إدارة مناهج الدورات",
      "تسجيل ومتابعة الطلاب",
      "تسجيل الدرجات والتقييمات",
      "التواصل بين الأهل والمعلمين",
      "تخطيط التقويم الأكاديمي",
      "إدارة موارد المكتبة",
    ],
    culturalRequirements: [
      "Islamic education principles",
      "Arabic language preservation",
      "Cultural sensitivity in curriculum",
      "Religious holiday accommodations",
      "Gender-appropriate learning environments",
    ],
    culturalRequirementsAr: [
      "مبادئ التعليم الإسلامي",
      "المحافظة على اللغة العربية",
      "الحساسية الثقافية في المنهج",
      "التكيف مع الأعياد الدينية",
      "بيئات التعلم المناسبة للجنس",
    ],
    specializations: [
      {
        id: "primary-education",
        name: "Primary Education",
        nameAr: "التعليم الابتدائي",
        description: "Elementary school management and curriculum",
        descriptionAr: "إدارة ومنهج المدرسة الابتدائية",
        requirements: [
          "Education ministry certification",
          "Primary teaching qualification",
        ],
      },
      {
        id: "higher-education",
        name: "Higher Education",
        nameAr: "التعليم العالي",
        description: "University and college administration",
        descriptionAr: "إدارة الجامعة والكلية",
        requirements: [
          "Higher education license",
          "Academic administration certification",
        ],
      },
      {
        id: "vocational-training",
        name: "Vocational Training",
        nameAr: "التدريب المهني",
        description: "Professional skills and trade education",
        descriptionAr: "المهارات المهنية والتعليم التجاري",
        requirements: [
          "Vocational training certification",
          "Industry expertise",
        ],
      },
    ],
    defaultSettings: {
      maxMembers: 100,
      maxFileSize: 100,
      allowedFileTypes: [
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "mp4",
        "mp3",
      ],
      culturalStrictness: "standard",
      requiresLicense: false,
      complianceLevel: "high",
    },
    estimatedSetupTime: 25,
    popularity: 4,
    isRecommended: false,
  },
  {
    id: "business-enterprise",
    type: "business",
    name: "Business Enterprise",
    nameAr: "المؤسسة التجارية",
    description:
      "Complete business management solution for Iraqi companies and startups.",
    descriptionAr: "حل إدارة الأعمال الكامل للشركات العراقية والشركات الناشئة.",
    icon: Briefcase,
    features: [
      "Project management and tracking",
      "Client relationship management",
      "Invoice and payment processing",
      "Team collaboration tools",
      "Financial reporting and analytics",
      "Marketing campaign management",
    ],
    featuresAr: [
      "إدارة ومتابعة المشاريع",
      "إدارة علاقات العملاء",
      "معالجة الفواتير والدفعات",
      "أدوات التعاون الجماعي",
      "التقارير المالية والتحليلات",
      "إدارة الحملات التسويقية",
    ],
    culturalRequirements: [
      "Halal business practices",
      "Islamic finance compliance",
      "Cultural marketing sensitivity",
      "Prayer time accommodations",
      "Ethical business conduct",
    ],
    culturalRequirementsAr: [
      "ممارسات الأعمال الحلال",
      "الامتثال للتمويل الإسلامي",
      "حساسية التسويق الثقافية",
      "التكيف مع أوقات الصلاة",
      "السلوك التجاري الأخلاقي",
    ],
    specializations: [
      {
        id: "small-business",
        name: "Small Business",
        nameAr: "الأعمال الصغيرة",
        description: "Management tools for small enterprises and startups",
        descriptionAr: "أدوات إدارة للمؤسسات الصغيرة والشركات الناشئة",
        requirements: ["Business registration", "SME certification"],
      },
      {
        id: "trading-company",
        name: "Trading Company",
        nameAr: "شركة تجارية",
        description: "Import/export and wholesale business management",
        descriptionAr: "إدارة أعمال الاستيراد/التصدير والجملة",
        requirements: ["Trading license", "Import/export certification"],
      },
      {
        id: "service-provider",
        name: "Service Provider",
        nameAr: "مقدم الخدمات",
        description: "Professional services and consulting businesses",
        descriptionAr: "الخدمات المهنية وأعمال الاستشارات",
        requirements: [
          "Service provider license",
          "Professional certification",
        ],
      },
    ],
    defaultSettings: {
      maxMembers: 50,
      maxFileSize: 200,
      allowedFileTypes: [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "csv",
      ],
      culturalStrictness: "standard",
      requiresLicense: false,
      complianceLevel: "high",
    },
    estimatedSetupTime: 18,
    popularity: 4,
    isRecommended: true,
  },
  {
    id: "engineering-firm",
    type: "engineering",
    name: "Engineering Firm",
    nameAr: "شركة هندسية",
    description:
      "Professional engineering practice management for Iraqi engineering firms and consultancies.",
    descriptionAr:
      "إدارة الممارسة الهندسية المهنية للشركات الهندسية والاستشارات العراقية.",
    icon: Wrench,
    features: [
      "Project design and management",
      "Technical specification creation",
      "Blueprint and CAD file management",
      "Quality assurance protocols",
      "Safety compliance tracking",
      "Client consultation scheduling",
    ],
    featuresAr: [
      "تصميم وإدارة المشاريع",
      "إنشاء المواصفات التقنية",
      "إدارة ملفات المخططات والكاد",
      "بروتوكولات ضمان الجودة",
      "متابعة الامتثال للسلامة",
      "جدولة استشارات العملاء",
    ],
    culturalRequirements: [
      "Iraqi building codes compliance",
      "Environmental impact considerations",
      "Safety standards adherence",
      "Professional ethics guidelines",
      "Cultural heritage preservation",
    ],
    culturalRequirementsAr: [
      "الامتثال لقوانين البناء العراقية",
      "اعتبارات التأثير البيئي",
      "الالتزام بمعايير السلامة",
      "إرشادات الأخلاق المهنية",
      "المحافظة على التراث الثقافي",
    ],
    specializations: [
      {
        id: "civil-engineering",
        name: "Civil Engineering",
        nameAr: "الهندسة المدنية",
        description: "Infrastructure, construction, and urban planning",
        descriptionAr: "البنية التحتية والإنشاءات والتخطيط الحضري",
        requirements: ["Civil engineering license", "Construction expertise"],
      },
      {
        id: "mechanical-engineering",
        name: "Mechanical Engineering",
        nameAr: "الهندسة الميكانيكية",
        description: "Machinery design, manufacturing, and maintenance",
        descriptionAr: "تصميم الآلات والتصنيع والصيانة",
        requirements: [
          "Mechanical engineering certification",
          "Manufacturing experience",
        ],
      },
      {
        id: "electrical-engineering",
        name: "Electrical Engineering",
        nameAr: "الهندسة الكهربائية",
        description: "Electrical systems design and power management",
        descriptionAr: "تصميم الأنظمة الكهربائية وإدارة الطاقة",
        requirements: [
          "Electrical engineering license",
          "Power systems certification",
        ],
      },
    ],
    defaultSettings: {
      maxMembers: 30,
      maxFileSize: 1000,
      allowedFileTypes: [
        "pdf",
        "doc",
        "docx",
        "dwg",
        "dxf",
        "step",
        "iges",
        "stl",
        "obj",
      ],
      culturalStrictness: "standard",
      requiresLicense: true,
      complianceLevel: "high",
    },
    estimatedSetupTime: 22,
    popularity: 4,
    isRecommended: false,
  },
];

// ====================== Component ======================

export default function ProfessionalWorkspaceTemplates({
  onSelectTemplate,
  locale = "ar",
  userType = "individual",
}: TemplateSelectionProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const isRTL = locale === "ar";

  const text = {
    ar: {
      title: "قوالب مساحات العمل المهنية",
      subtitle: "اختر من قوالب محددة مسبقًا مصممة للمهن العراقية",
      filterAll: "الكل",
      filterLegal: "قانوني",
      filterMedical: "طبي",
      filterEducational: "تعليمي",
      filterBusiness: "تجاري",
      filterEngineering: "هندسي",
      recommended: "موصى به",
      popular: "شائع",
      features: "الميزات",
      culturalRequirements: "المتطلبات الثقافية",
      specializations: "التخصصات",
      setupTime: "وقت الإعداد",
      minutes: "دقيقة",
      members: "عضو كحد أقصى",
      fileSize: "ميجابايت حد أقصى للملف",
      selectTemplate: "اختيار القالب",
      viewDetails: "عرض التفاصيل",
      hideDetails: "إخفاء التفاصيل",
      requiresLicense: "يتطلب ترخيص مهني",
      highCompliance: "امتثال عالي",
      maxCompliance: "امتثال أقصى",
      individual: "فردي",
      organization: "منظمة",
    },
    en: {
      title: "Professional Workspace Templates",
      subtitle:
        "Choose from pre-configured templates designed for Iraqi professions",
      filterAll: "All",
      filterLegal: "Legal",
      filterMedical: "Medical",
      filterEducational: "Educational",
      filterBusiness: "Business",
      filterEngineering: "Engineering",
      recommended: "Recommended",
      popular: "Popular",
      features: "Features",
      culturalRequirements: "Cultural Requirements",
      specializations: "Specializations",
      setupTime: "Setup Time",
      minutes: "minutes",
      members: "max members",
      fileSize: "MB max file size",
      selectTemplate: "Select Template",
      viewDetails: "View Details",
      hideDetails: "Hide Details",
      requiresLicense: "Requires Professional License",
      highCompliance: "High Compliance",
      maxCompliance: "Maximum Compliance",
      individual: "Individual",
      organization: "Organization",
    },
  };

  const t = text[locale];

  // Filter templates based on selected type
  const filteredTemplates =
    selectedType === "all"
      ? PROFESSIONAL_TEMPLATES
      : PROFESSIONAL_TEMPLATES.filter(
          (template) => template.type === selectedType,
        );

  // Sort templates by recommendation and popularity
  const sortedTemplates = filteredTemplates.sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return b.popularity - a.popularity;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderTemplate = (template: ProfessionalTemplate) => {
    const IconComponent = template.icon;
    const isExpanded = showDetails === template.id;

    return (
      <Card
        key={template.id}
        className="relative hover:shadow-lg transition-shadow"
      >
        {template.isRecommended && (
          <Badge
            className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} bg-green-500`}
          >
            {t.recommended}
          </Badge>
        )}

        <CardHeader>
          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <CardTitle className={`text-lg ${isRTL ? "font-arabic" : ""}`}>
                {locale === "ar" ? template.nameAr : template.name}
              </CardTitle>
              <div
                className={`flex items-center gap-2 mt-1 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex ${isRTL ? "flex-row-reverse" : ""}`}>
                  {renderStars(template.popularity)}
                </div>
                <Badge variant="outline" className={isRTL ? "font-arabic" : ""}>
                  {t.popular}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p
            className={`text-gray-600 ${isRTL ? "text-right font-arabic" : ""}`}
          >
            {locale === "ar" ? template.descriptionAr : template.description}
          </p>

          <div
            className={`flex items-center justify-between text-sm text-gray-500 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={isRTL ? "font-arabic" : ""}>
                <Users className="h-4 w-4 inline mr-1" />
                {template.defaultSettings.maxMembers} {t.members}
              </span>
              <span className={isRTL ? "font-arabic" : ""}>
                <FileText className="h-4 w-4 inline mr-1" />
                {template.defaultSettings.maxFileSize} {t.fileSize}
              </span>
              <span className={isRTL ? "font-arabic" : ""}>
                ⏱️ {template.estimatedSetupTime} {t.minutes}
              </span>
            </div>
          </div>

          <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}>
            {template.defaultSettings.requiresLicense && (
              <Badge
                variant="secondary"
                className={`text-xs ${isRTL ? "font-arabic" : ""}`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {t.requiresLicense}
              </Badge>
            )}
            <Badge
              variant={
                template.defaultSettings.complianceLevel === "maximum"
                  ? "default"
                  : "secondary"
              }
              className={`text-xs ${isRTL ? "font-arabic" : ""}`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {template.defaultSettings.complianceLevel === "maximum"
                ? t.maxCompliance
                : t.highCompliance}
            </Badge>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h4
                  className={`font-semibold mb-2 ${isRTL ? "text-right font-arabic" : ""}`}
                >
                  {t.features}
                </h4>
                <ul
                  className={`text-sm text-gray-600 space-y-1 ${isRTL ? "text-right font-arabic" : ""}`}
                >
                  {(locale === "ar"
                    ? template.featuresAr
                    : template.features
                  ).map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className={`font-semibold mb-2 ${isRTL ? "text-right font-arabic" : ""}`}
                >
                  {t.culturalRequirements}
                </h4>
                <ul
                  className={`text-sm text-gray-600 space-y-1 ${isRTL ? "text-right font-arabic" : ""}`}
                >
                  {(locale === "ar"
                    ? template.culturalRequirementsAr
                    : template.culturalRequirements
                  ).map((req, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Shield className="h-3 w-3 text-blue-500 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className={`font-semibold mb-2 ${isRTL ? "text-right font-arabic" : ""}`}
                >
                  {t.specializations}
                </h4>
                <div
                  className={`grid grid-cols-1 gap-2 ${isRTL ? "text-right" : ""}`}
                >
                  {template.specializations.map((spec) => (
                    <div key={spec.id} className="bg-gray-50 p-3 rounded-lg">
                      <h5
                        className={`font-medium ${isRTL ? "font-arabic" : ""}`}
                      >
                        {locale === "ar" ? spec.nameAr : spec.name}
                      </h5>
                      <p
                        className={`text-sm text-gray-600 mt-1 ${isRTL ? "font-arabic" : ""}`}
                      >
                        {locale === "ar"
                          ? spec.descriptionAr
                          : spec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              onClick={() => onSelectTemplate(template)}
              className={`flex-1 ${isRTL ? "font-arabic" : ""}`}
            >
              {t.selectTemplate}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDetails(isExpanded ? null : template.id)}
              className={isRTL ? "font-arabic" : ""}
            >
              {isExpanded ? t.hideDetails : t.viewDetails}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div
      className={`max-w-6xl mx-auto p-6 ${isRTL ? "font-arabic" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`text-center mb-8 ${isRTL ? "text-right" : ""}`}>
        <h1 className={`text-3xl font-bold mb-2 ${isRTL ? "font-arabic" : ""}`}>
          {t.title}
        </h1>
        <p className={`text-gray-600 ${isRTL ? "font-arabic" : ""}`}>
          {t.subtitle}
        </p>
      </div>

      {/* User Type Alert */}
      <Alert className="mb-6">
        <Users className="h-4 w-4" />
        <AlertDescription className={isRTL ? "text-right font-arabic" : ""}>
          {locale === "ar"
            ? `نوع المستخدم الحالي: ${userType === "individual" ? "فردي" : "منظمة"}`
            : `Current user type: ${userType === "individual" ? "Individual" : "Organization"}`}
        </AlertDescription>
      </Alert>

      {/* Filter Buttons */}
      <div
        className={`flex flex-wrap gap-2 mb-6 ${isRTL ? "justify-end" : ""}`}
      >
        {[
          { key: "all", label: t.filterAll, labelAr: t.filterAll },
          { key: "legal", label: t.filterLegal, labelAr: t.filterLegal },
          { key: "medical", label: t.filterMedical, labelAr: t.filterMedical },
          {
            key: "educational",
            label: t.filterEducational,
            labelAr: t.filterEducational,
          },
          {
            key: "business",
            label: t.filterBusiness,
            labelAr: t.filterBusiness,
          },
          {
            key: "engineering",
            label: t.filterEngineering,
            labelAr: t.filterEngineering,
          },
        ].map((filter) => (
          <Button
            key={filter.key}
            variant={selectedType === filter.key ? "default" : "outline"}
            onClick={() => setSelectedType(filter.key)}
            className={isRTL ? "font-arabic" : ""}
          >
            {locale === "ar" ? filter.labelAr : filter.label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedTemplates.map(renderTemplate)}
      </div>

      {/* Empty State */}
      {sortedTemplates.length === 0 && (
        <div className={`text-center py-12 ${isRTL ? "text-right" : ""}`}>
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3
            className={`text-lg font-semibold text-gray-600 mb-2 ${isRTL ? "font-arabic" : ""}`}
          >
            {locale === "ar" ? "لا توجد قوالب متاحة" : "No templates available"}
          </h3>
          <p className={`text-gray-500 ${isRTL ? "font-arabic" : ""}`}>
            {locale === "ar"
              ? "جرب تغيير الفلتر لرؤية المزيد من القوالب"
              : "Try changing the filter to see more templates"}
          </p>
        </div>
      )}
    </div>
  );
}
