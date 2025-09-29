/**
 * Iraqi Professional Organization Templates
 * Specialized templates for Iraqi professional organizations (law firms, hospitals, schools, government)
 */

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Users,
  Building,
  Briefcase,
  GraduationCap,
  Shield,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// Types for Iraqi Organizations
export interface IraqiOrganization {
  id: string;
  name: string;
  nameArabic: string;
  type: OrganizationType;
  region: IraqiRegion;
  contactInfo: ContactInfo;
  complianceLevel: ComplianceLevel;
  specializations: string[];
  teamStructure: TeamStructure;
  workflows: WorkflowTemplate[];
  billingConfig: BillingConfiguration;
}

export enum OrganizationType {
  LAW_FIRM = "law_firm",
  MEDICAL_PRACTICE = "medical_practice",
  EDUCATIONAL_INSTITUTION = "educational_institution",
  GOVERNMENT_ENTITY = "government_entity",
  BUSINESS_CONSULTANCY = "business_consultancy",
  ENGINEERING_FIRM = "engineering_firm",
}

export enum IraqiRegion {
  BAGHDAD = "baghdad",
  BASRA = "basra",
  ERBIL = "erbil",
  NAJAF = "najaf",
  MOSUL = "mosul",
  KARBALA = "karbala",
  SULAYMANIYAH = "sulaymaniyah",
  ANBAR = "anbar",
}

export enum ComplianceLevel {
  BASIC = "basic",
  PROFESSIONAL = "professional",
  GOVERNMENT = "government",
  ISLAMIC = "islamic",
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  addressArabic: string;
  website?: string;
  licenseNumber?: string;
}

interface TeamStructure {
  partners: number;
  associates: number;
  support_staff: number;
  interns: number;
  roles: OrganizationRole[];
}

interface OrganizationRole {
  title: string;
  titleArabic: string;
  permissions: string[];
  level: "senior" | "mid" | "junior" | "support";
}

interface WorkflowTemplate {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  steps: WorkflowStep[];
  estimatedDuration: string;
  requiredRoles: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  nameArabic: string;
  type: "review" | "approval" | "processing" | "communication" | "billing";
  assignedRole?: string;
  aiAgent?: string;
  duration: string;
}

interface BillingConfiguration {
  preferredGateway: "zaincash" | "fastpay" | "nasswallet";
  billingCycle: "monthly" | "quarterly" | "annual";
  invoiceLanguage: "arabic" | "english" | "both";
  taxCompliance: boolean;
  autoPayment: boolean;
}

// Law Firm Template
export const IraqiLawFirmTemplate: IraqiOrganization = {
  id: "law_firm_template",
  name: "Al-Adala Law Firm",
  nameArabic: "مكتب العدالة للمحاماة",
  type: OrganizationType.LAW_FIRM,
  region: IraqiRegion.BAGHDAD,
  contactInfo: {
    phone: "+964-770-123-4567",
    email: "info@adalawfirm.iq",
    address: "Al-Karrada District, Baghdad",
    addressArabic: "منطقة الكرادة، بغداد",
    website: "https://adalawfirm.iq",
    licenseNumber: "LAW-BGD-2024-001",
  },
  complianceLevel: ComplianceLevel.PROFESSIONAL,
  specializations: [
    "Civil Law - القانون المدني",
    "Commercial Law - القانون التجاري",
    "Family Law - قانون الأحوال الشخصية",
    "Criminal Law - القانون الجزائي",
    "Real Estate Law - قانون العقارات",
  ],
  teamStructure: {
    partners: 3,
    associates: 8,
    support_staff: 5,
    interns: 2,
    roles: [
      {
        title: "Senior Partner",
        titleArabic: "شريك أول",
        permissions: [
          "full_access",
          "client_management",
          "case_approval",
          "billing_approval",
        ],
        level: "senior",
      },
      {
        title: "Associate Lawyer",
        titleArabic: "محامي مشارك",
        permissions: [
          "case_management",
          "client_communication",
          "document_preparation",
        ],
        level: "mid",
      },
      {
        title: "Legal Assistant",
        titleArabic: "مساعد قانوني",
        permissions: [
          "document_processing",
          "appointment_scheduling",
          "research",
        ],
        level: "support",
      },
    ],
  },
  workflows: [
    {
      id: "client_intake",
      name: "Client Intake Process",
      nameArabic: "عملية استقبال العميل",
      description: "Initial client consultation and case evaluation",
      estimatedDuration: "2-3 hours",
      requiredRoles: ["Senior Partner", "Associate Lawyer"],
      steps: [
        {
          id: "consultation",
          name: "Initial Consultation",
          nameArabic: "الاستشارة الأولية",
          type: "review",
          assignedRole: "Associate Lawyer",
          aiAgent: "legal-intake-agent",
          duration: "1 hour",
        },
        {
          id: "case_evaluation",
          name: "Case Merit Evaluation",
          nameArabic: "تقييم جدارة القضية",
          type: "review",
          assignedRole: "Senior Partner",
          duration: "30 minutes",
        },
        {
          id: "contract_preparation",
          name: "Service Agreement",
          nameArabic: "إعداد اتفاقية الخدمة",
          type: "processing",
          assignedRole: "Legal Assistant",
          aiAgent: "contract-generator-agent",
          duration: "1 hour",
        },
      ],
    },
    {
      id: "case_management",
      name: "Case Management Workflow",
      nameArabic: "سير عمل إدارة القضايا",
      description: "Complete case lifecycle management",
      estimatedDuration: "2-12 months",
      requiredRoles: ["Senior Partner", "Associate Lawyer", "Legal Assistant"],
      steps: [
        {
          id: "research",
          name: "Legal Research",
          nameArabic: "البحث القانوني",
          type: "processing",
          assignedRole: "Associate Lawyer",
          aiAgent: "legal-research-agent",
          duration: "2-5 days",
        },
        {
          id: "document_prep",
          name: "Document Preparation",
          nameArabic: "إعداد الوثائق",
          type: "processing",
          assignedRole: "Legal Assistant",
          aiAgent: "document-generator-agent",
          duration: "1-3 days",
        },
        {
          id: "court_filing",
          name: "Court Filing",
          nameArabic: "تقديم الدعوى للمحكمة",
          type: "processing",
          assignedRole: "Associate Lawyer",
          duration: "1 day",
        },
        {
          id: "billing",
          name: "Time Tracking & Billing",
          nameArabic: "تتبع الوقت والفوترة",
          type: "billing",
          assignedRole: "Legal Assistant",
          aiAgent: "billing-agent",
          duration: "Ongoing",
        },
      ],
    },
  ],
  billingConfig: {
    preferredGateway: "zaincash",
    billingCycle: "monthly",
    invoiceLanguage: "both",
    taxCompliance: true,
    autoPayment: false,
  },
};

// Medical Practice Template
export const IraqiMedicalPracticeTemplate: IraqiOrganization = {
  id: "medical_practice_template",
  name: "Al-Shifa Medical Center",
  nameArabic: "مركز الشفاء الطبي",
  type: OrganizationType.MEDICAL_PRACTICE,
  region: IraqiRegion.BAGHDAD,
  contactInfo: {
    phone: "+964-771-987-6543",
    email: "info@shifamedical.iq",
    address: "Medical City, Baghdad",
    addressArabic: "المدينة الطبية، بغداد",
    licenseNumber: "MED-BGD-2024-015",
  },
  complianceLevel: ComplianceLevel.PROFESSIONAL,
  specializations: [
    "Internal Medicine - الطب الباطني",
    "Cardiology - أمراض القلب",
    "Pediatrics - طب الأطفال",
    "Orthopedics - جراحة العظام",
    "Emergency Medicine - طب الطوارئ",
  ],
  teamStructure: {
    partners: 5,
    associates: 12,
    support_staff: 20,
    interns: 4,
    roles: [
      {
        title: "Chief Physician",
        titleArabic: "طبيب رئيس",
        permissions: [
          "full_access",
          "patient_care",
          "staff_management",
          "billing_oversight",
        ],
        level: "senior",
      },
      {
        title: "Specialist Doctor",
        titleArabic: "طبيب اختصاص",
        permissions: ["patient_care", "diagnosis", "treatment_planning"],
        level: "mid",
      },
      {
        title: "Nurse",
        titleArabic: "ممرض/ممرضة",
        permissions: [
          "patient_care",
          "medication_administration",
          "vital_monitoring",
        ],
        level: "support",
      },
      {
        title: "Medical Assistant",
        titleArabic: "مساعد طبي",
        permissions: [
          "appointment_scheduling",
          "patient_records",
          "administrative_tasks",
        ],
        level: "support",
      },
    ],
  },
  workflows: [
    {
      id: "patient_registration",
      name: "Patient Registration",
      nameArabic: "تسجيل المريض",
      description: "New patient intake and medical history collection",
      estimatedDuration: "30-45 minutes",
      requiredRoles: ["Medical Assistant", "Nurse"],
      steps: [
        {
          id: "intake",
          name: "Patient Information Collection",
          nameArabic: "جمع معلومات المريض",
          type: "processing",
          assignedRole: "Medical Assistant",
          aiAgent: "patient-intake-agent",
          duration: "15 minutes",
        },
        {
          id: "insurance_verification",
          name: "Insurance Verification",
          nameArabic: "التحقق من التأمين",
          type: "processing",
          assignedRole: "Medical Assistant",
          aiAgent: "insurance-verification-agent",
          duration: "10 minutes",
        },
        {
          id: "medical_history",
          name: "Medical History Review",
          nameArabic: "مراجعة التاريخ الطبي",
          type: "review",
          assignedRole: "Nurse",
          duration: "15 minutes",
        },
      ],
    },
    {
      id: "appointment_management",
      name: "Appointment Management",
      nameArabic: "إدارة المواعيد",
      description: "Scheduling and managing patient appointments",
      estimatedDuration: "Ongoing",
      requiredRoles: ["Medical Assistant"],
      steps: [
        {
          id: "scheduling",
          name: "Appointment Scheduling",
          nameArabic: "جدولة المواعيد",
          type: "processing",
          assignedRole: "Medical Assistant",
          aiAgent: "appointment-scheduler-agent",
          duration: "5 minutes per appointment",
        },
        {
          id: "reminder",
          name: "Appointment Reminders",
          nameArabic: "تذكير بالمواعيد",
          type: "communication",
          aiAgent: "reminder-agent",
          duration: "Automated",
        },
        {
          id: "follow_up",
          name: "Post-Visit Follow-up",
          nameArabic: "المتابعة بعد الزيارة",
          type: "communication",
          aiAgent: "followup-agent",
          duration: "10 minutes",
        },
      ],
    },
  ],
  billingConfig: {
    preferredGateway: "fastpay",
    billingCycle: "monthly",
    invoiceLanguage: "both",
    taxCompliance: true,
    autoPayment: true,
  },
};

// Educational Institution Template
export const IraqiEducationalInstitutionTemplate: IraqiOrganization = {
  id: "educational_institution_template",
  name: "Al-Mustaqbal University",
  nameArabic: "جامعة المستقبل",
  type: OrganizationType.EDUCATIONAL_INSTITUTION,
  region: IraqiRegion.BAGHDAD,
  contactInfo: {
    phone: "+964-772-555-1234",
    email: "admin@mustaqbal.edu.iq",
    address: "Jadriya District, Baghdad",
    addressArabic: "منطقة الجادرية، بغداد",
    website: "https://mustaqbal.edu.iq",
    licenseNumber: "EDU-BGD-2024-007",
  },
  complianceLevel: ComplianceLevel.GOVERNMENT,
  specializations: [
    "Computer Science - علوم الحاسوب",
    "Engineering - الهندسة",
    "Business Administration - إدارة الأعمال",
    "Medicine - الطب",
    "Law - القانون",
  ],
  teamStructure: {
    partners: 2, // Deans
    associates: 150, // Faculty
    support_staff: 80,
    interns: 20, // Research assistants
    roles: [
      {
        title: "Dean",
        titleArabic: "عميد",
        permissions: [
          "full_access",
          "academic_oversight",
          "budget_management",
          "staff_hiring",
        ],
        level: "senior",
      },
      {
        title: "Professor",
        titleArabic: "أستاذ",
        permissions: [
          "course_management",
          "student_evaluation",
          "research_supervision",
        ],
        level: "senior",
      },
      {
        title: "Assistant Professor",
        titleArabic: "أستاذ مساعد",
        permissions: ["teaching", "student_evaluation", "research"],
        level: "mid",
      },
      {
        title: "Administrative Staff",
        titleArabic: "موظف إداري",
        permissions: ["student_services", "record_management", "scheduling"],
        level: "support",
      },
    ],
  },
  workflows: [
    {
      id: "student_enrollment",
      name: "Student Enrollment Process",
      nameArabic: "عملية تسجيل الطلاب",
      description: "Complete student admission and enrollment workflow",
      estimatedDuration: "1-2 weeks",
      requiredRoles: ["Administrative Staff", "Dean"],
      steps: [
        {
          id: "application_review",
          name: "Application Review",
          nameArabic: "مراجعة الطلب",
          type: "review",
          assignedRole: "Administrative Staff",
          aiAgent: "application-review-agent",
          duration: "2-3 days",
        },
        {
          id: "entrance_exam",
          name: "Entrance Examination",
          nameArabic: "امتحان القبول",
          type: "processing",
          assignedRole: "Professor",
          duration: "1 day",
        },
        {
          id: "admission_approval",
          name: "Admission Approval",
          nameArabic: "موافقة القبول",
          type: "approval",
          assignedRole: "Dean",
          duration: "1-2 days",
        },
        {
          id: "registration",
          name: "Course Registration",
          nameArabic: "تسجيل المواد",
          type: "processing",
          assignedRole: "Administrative Staff",
          aiAgent: "course-registration-agent",
          duration: "1 day",
        },
      ],
    },
  ],
  billingConfig: {
    preferredGateway: "nasswallet",
    billingCycle: "quarterly",
    invoiceLanguage: "both",
    taxCompliance: true,
    autoPayment: false,
  },
};

// Government Entity Template
export const IraqiGovernmentEntityTemplate: IraqiOrganization = {
  id: "government_entity_template",
  name: "Ministry of Digital Transformation",
  nameArabic: "وزارة التحول الرقمي",
  type: OrganizationType.GOVERNMENT_ENTITY,
  region: IraqiRegion.BAGHDAD,
  contactInfo: {
    phone: "+964-770-900-1000",
    email: "info@digitaltransformation.gov.iq",
    address: "Government District, Baghdad",
    addressArabic: "المنطقة الحكومية، بغداد",
    website: "https://digitaltransformation.gov.iq",
    licenseNumber: "GOV-BGD-2024-001",
  },
  complianceLevel: ComplianceLevel.GOVERNMENT,
  specializations: [
    "Digital Services - الخدمات الرقمية",
    "E-Government - الحكومة الإلكترونية",
    "Cybersecurity - الأمن السيبراني",
    "Data Management - إدارة البيانات",
    "Public Services - الخدمات العامة",
  ],
  teamStructure: {
    partners: 1, // Minister
    associates: 50, // Directors
    support_staff: 200,
    interns: 10,
    roles: [
      {
        title: "Minister",
        titleArabic: "وزير",
        permissions: [
          "full_access",
          "policy_making",
          "budget_approval",
          "strategic_planning",
        ],
        level: "senior",
      },
      {
        title: "Director General",
        titleArabic: "مدير عام",
        permissions: [
          "department_management",
          "staff_oversight",
          "project_approval",
        ],
        level: "senior",
      },
      {
        title: "Department Head",
        titleArabic: "رئيس قسم",
        permissions: ["team_management", "project_execution", "reporting"],
        level: "mid",
      },
      {
        title: "Civil Servant",
        titleArabic: "موظف حكومي",
        permissions: [
          "service_delivery",
          "document_processing",
          "citizen_support",
        ],
        level: "support",
      },
    ],
  },
  workflows: [
    {
      id: "citizen_service_request",
      name: "Citizen Service Request",
      nameArabic: "طلب خدمة المواطن",
      description:
        "Processing citizen service requests through digital platforms",
      estimatedDuration: "3-7 days",
      requiredRoles: ["Civil Servant", "Department Head"],
      steps: [
        {
          id: "request_intake",
          name: "Service Request Intake",
          nameArabic: "استقبال طلب الخدمة",
          type: "processing",
          assignedRole: "Civil Servant",
          aiAgent: "service-intake-agent",
          duration: "30 minutes",
        },
        {
          id: "document_verification",
          name: "Document Verification",
          nameArabic: "التحقق من الوثائق",
          type: "review",
          assignedRole: "Civil Servant",
          aiAgent: "document-verification-agent",
          duration: "1-2 hours",
        },
        {
          id: "processing",
          name: "Request Processing",
          nameArabic: "معالجة الطلب",
          type: "processing",
          assignedRole: "Department Head",
          duration: "2-5 days",
        },
        {
          id: "approval",
          name: "Final Approval",
          nameArabic: "الموافقة النهائية",
          type: "approval",
          assignedRole: "Department Head",
          duration: "1 day",
        },
      ],
    },
  ],
  billingConfig: {
    preferredGateway: "zaincash",
    billingCycle: "annual",
    invoiceLanguage: "arabic",
    taxCompliance: true,
    autoPayment: true,
  },
};

// React Component for Organization Template Selector
export const IraqiOrganizationTemplateSelector: React.FC<{
  onSelect: (template: IraqiOrganization) => void;
}> = ({ onSelect }) => {
  const templates = [
    {
      template: IraqiLawFirmTemplate,
      icon: <Briefcase className="h-8 w-8" />,
      color: "bg-blue-500",
    },
    {
      template: IraqiMedicalPracticeTemplate,
      icon: <Shield className="h-8 w-8" />,
      color: "bg-green-500",
    },
    {
      template: IraqiEducationalInstitutionTemplate,
      icon: <GraduationCap className="h-8 w-8" />,
      color: "bg-purple-500",
    },
    {
      template: IraqiGovernmentEntityTemplate,
      icon: <Building className="h-8 w-8" />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map(({ template, icon, color }) => (
        <Card
          key={template.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm text-right" dir="rtl">
                  {template.nameArabic}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{template.region}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>
                  {template.teamStructure.partners +
                    template.teamStructure.associates +
                    template.teamStructure.support_staff}{" "}
                  team members
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {template.specializations.slice(0, 2).map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {spec.split(" - ")[0]}
                  </Badge>
                ))}
                {template.specializations.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.specializations.length - 2} more
                  </Badge>
                )}
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => onSelect(template)}
              >
                Select Template / اختر القالب
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IraqiOrganizationTemplateSelector;
