/**
 * Ministry and Professional Domain Type Definitions
 * Supporting Iraqi government ministries and professional services
 */

// Core Ministry Types
export interface MinistryConfiguration {
  id: string;
  name: string;
  arabicName: string;
  englishName: string;
  
  // Ministry identification
  code: string; // e.g., 'MOH', 'MOE', 'MOI', 'MOJ'
  type: 'service' | 'regulatory' | 'security' | 'economic' | 'social';
  level: 'federal' | 'regional' | 'local';
  
  // Organizational structure
  structure: {
    departments: MinistryDepartment[];
    divisions: MinistryDivision[];
    offices: MinistryOffice[];
    regions?: MinistryRegion[];
  };
  
  // Security and compliance
  security: {
    clearanceRequired: boolean;
    minimumLevel: 'public' | 'internal' | 'confidential' | 'secret' | 'top-secret';
    backgroundCheckRequired: boolean;
    islamicComplianceRequired: boolean;
    culturalSensitivityRequired: boolean;
  };
  
  // Operational parameters
  operations: {
    businessHours: { start: string; end: string };
    timezone: string;
    weekendDays: string[];
    publicHolidays: string[];
    ramadanSchedule?: { start: string; end: string };
    prayerTimeAccommodations: boolean;
  };
  
  // Cultural and linguistic requirements
  cultural: {
    arabicMandatory: boolean;
    englishRequired: boolean;
    dialectPreference: 'baghdadi' | 'standard' | 'mixed';
    islamicComplianceLevel: 'basic' | 'standard' | 'strict';
    culturalSensitivityLevel: 'standard' | 'high' | 'maximum';
  };
  
  // Contact and location
  contact: {
    headquarters: MinistryLocation;
    regionalOffices: MinistryLocation[];
    emergencyContact?: string;
    publicServiceNumber?: string;
  };
}

export interface MinistryDepartment {
  id: string;
  name: string;
  arabicName: string;
  code: string;
  
  // Department specifics
  responsibilities: string[];
  arabicResponsibilities?: string[];
  serviceTypes: ServiceType[];
  
  // Staff and structure
  leadership: {
    director: string;
    deputyDirector?: string;
    departmentHead?: string;
  };
  
  // Operational details
  operations: {
    publicFacing: boolean;
    citizenServices: boolean;
    emergencyServices: boolean;
    businessHours?: { start: string; end: string };
  };
  
  // Security and access
  security: {
    accessLevel: 'public' | 'restricted' | 'classified';
    clearanceRequired: boolean;
    visitorAccess: boolean;
  };
}

export interface MinistryDivision {
  id: string;
  name: string;
  arabicName: string;
  departmentId: string;
  
  // Division details
  specialization: string;
  arabicSpecialization?: string;
  serviceAreas: string[];
  
  // Staff structure
  staff: {
    supervisor: string;
    specialists: number;
    technicians: number;
    support: number;
  };
  
  // Service delivery
  services: {
    direct: boolean;
    online: boolean;
    mobile: boolean;
    multilingual: boolean;
  };
}

export interface MinistryOffice {
  id: string;
  name: string;
  arabicName: string;
  type: 'headquarters' | 'regional' | 'district' | 'local' | 'field';
  
  // Location details
  location: MinistryLocation;
  
  // Service capabilities
  capabilities: {
    citizenServices: boolean;
    documentProcessing: boolean;
    emergencyResponse: boolean;
    onlineServices: boolean;
  };
  
  // Operating schedule
  schedule: {
    standardHours: { start: string; end: string };
    emergencyHours?: { start: string; end: string };
    weekendService: boolean;
    holidayService: boolean;
  };
}

export interface MinistryRegion {
  id: string;
  name: string;
  arabicName: string;
  governorate: string;
  
  // Geographic coverage
  coverage: {
    cities: string[];
    districts: string[];
    population: number;
    area: number; // km²
  };
  
  // Regional characteristics
  characteristics: {
    predominantDialect: 'baghdadi' | 'basri' | 'moslawi' | 'kurdish' | 'mixed';
    tribalConsiderations: boolean;
    securityLevel: 'normal' | 'elevated' | 'high' | 'critical';
    economicProfile: 'agricultural' | 'industrial' | 'commercial' | 'oil' | 'mixed';
  };
  
  // Service delivery
  serviceDelivery: {
    physicalOffices: number;
    mobileUnits: number;
    onlineServiceAdoption: number; // percentage
    citizenSatisfaction: number; // 0-100
  };
}

export interface MinistryLocation {
  address: string;
  arabicAddress: string;
  city: string;
  governorate: string;
  postalCode?: string;
  coordinates: { lat: number; lng: number };
  
  // Accessibility
  accessibility: {
    publicTransport: boolean;
    parking: boolean;
    disabilityAccess: boolean;
    securityPerimeter: boolean;
  };
  
  // Contact details
  contact: {
    phone: string;
    email?: string;
    website?: string;
    socialMedia?: Record<string, string>;
  };
}

// Service Type Definitions
export interface ServiceType {
  id: string;
  name: string;
  arabicName: string;
  category: ServiceCategory;
  
  // Service characteristics
  characteristics: {
    complexity: 'simple' | 'moderate' | 'complex';
    duration: string; // estimated completion time
    cost: number; // IQD
    documentsRequired: string[];
    arabicDocumentsRequired?: string[];
  };
  
  // Delivery methods
  delivery: {
    inPerson: boolean;
    online: boolean;
    mobile: boolean;
    phone: boolean;
    mail: boolean;
  };
  
  // Requirements and eligibility
  requirements: {
    citizenshipRequired: boolean;
    residencyRequired: boolean;
    ageRequirements?: { min?: number; max?: number };
    documentationRequired: string[];
    feesRequired: boolean;
  };
  
  // Cultural and religious considerations
  cultural: {
    genderSpecificService: boolean;
    islamicComplianceRequired: boolean;
    culturalSensitivityRequired: boolean;
    languagePreferences: string[];
  };
  
  // Service quality metrics
  quality: {
    averageProcessingTime: number; // days
    citizenSatisfactionScore: number; // 0-100
    completionRate: number; // percentage
    errorRate: number; // percentage
  };
}

export type ServiceCategory = 
  | 'identity-documents'
  | 'civil-registration'
  | 'business-licensing'
  | 'health-services'
  | 'education-services'
  | 'legal-services'
  | 'social-services'
  | 'security-services'
  | 'emergency-services'
  | 'information-services';

// Specific Ministry Configurations
export interface HealthMinistryConfig extends MinistryConfiguration {
  healthSpecific: {
    hospitalNetworks: HealthFacility[];
    specializedCenters: SpecializedHealthCenter[];
    emergencyServices: EmergencyHealthService[];
    
    // Health system parameters
    systemParameters: {
      patientPrivacyLevel: 'standard' | 'enhanced' | 'maximum';
      familyConsentRequired: boolean;
      genderSeparatedServices: boolean;
      islamicMedicalEthics: boolean;
      traditionalMedicineIntegration: boolean;
    };
    
    // Public health initiatives
    publicHealth: {
      vaccinationPrograms: string[];
      maternalHealth: boolean;
      childHealth: boolean;
      elderlycare: boolean;
      mentalHealth: boolean;
      chronicDiseaseManagement: boolean;
    };
  };
}

export interface EducationMinistryConfig extends MinistryConfiguration {
  educationSpecific: {
    institutions: EducationalInstitution[];
    programs: EducationalProgram[];
    
    // Educational system parameters
    systemParameters: {
      curriculumStandards: 'national' | 'international' | 'mixed';
      languageOfInstruction: 'arabic' | 'kurdish' | 'bilingual';
      islamicEducationRequired: boolean;
      genderSeparatedEducation: boolean;
      specialNeedsSupport: boolean;
    };
    
    // Student services
    studentServices: {
      scholarships: boolean;
      financialAid: boolean;
      transportaiton: boolean;
      meals: boolean;
      healthServices: boolean;
      counseling: boolean;
    };
  };
}

export interface InteriorMinistryConfig extends MinistryConfiguration {
  interiorSpecific: {
    securityServices: SecurityService[];
    civilServices: CivilService[];
    emergencyServices: EmergencyService[];
    
    // Security and public safety
    security: {
      policeStations: number;
      emergencyResponseTime: number; // minutes
      communityPolicing: boolean;
      tribalLiaison: boolean;
      culturalMediation: boolean;
    };
    
    // Civil administration
    civilAdministration: {
      citizenshipServices: boolean;
      residencyPermits: boolean;
      travelDocuments: boolean;
      civilRegistration: boolean;
      legalDocumentation: boolean;
    };
  };
}

export interface JusticeMinistryConfig extends MinistryConfiguration {
  justiceSpecific: {
    courts: JudiciaryFacility[];
    legalServices: LegalService[];
    correctionalFacilities: CorrectionalFacility[];
    
    // Legal system parameters
    legalSystem: {
      islamicJurisprudence: boolean;
      civilLaw: boolean;
      customaryLaw: boolean;
      tribalMeditation: boolean;
      familyCourtSpecialization: boolean;
    };
    
    // Justice delivery
    justiceDelivery: {
      courtInterpreting: boolean;
      legalAid: boolean;
      mediation: boolean;
      arbitration: boolean;
      restorative: boolean;
    };
  };
}

// Supporting facility and service types
export interface HealthFacility {
  id: string;
  name: string;
  arabicName: string;
  type: 'hospital' | 'clinic' | 'health-center' | 'specialized-center';
  level: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  location: MinistryLocation;
  capacity: number;
  specializations: string[];
  emergencyServices: boolean;
}

export interface SpecializedHealthCenter {
  id: string;
  name: string;
  arabicName: string;
  specialization: string;
  services: string[];
  location: MinistryLocation;
  capacity: number;
  islamicComplianceLevel: 'standard' | 'certified';
}

export interface EmergencyHealthService {
  id: string;
  name: string;
  type: 'ambulance' | 'emergency-room' | 'trauma-center' | 'poison-control';
  coverage: string[];
  responseTime: number; // minutes
  availability: '24/7' | 'business-hours' | 'on-call';
}

export interface EducationalInstitution {
  id: string;
  name: string;
  arabicName: string;
  type: 'kindergarten' | 'primary' | 'secondary' | 'university' | 'technical' | 'vocational';
  level: string;
  location: MinistryLocation;
  capacity: number;
  specializations?: string[];
  languageOfInstruction: 'arabic' | 'kurdish' | 'english' | 'bilingual';
}

export interface EducationalProgram {
  id: string;
  name: string;
  arabicName: string;
  type: 'degree' | 'diploma' | 'certificate' | 'training';
  duration: string;
  requirements: string[];
  islamicContent: boolean;
  culturalContent: boolean;
}

export interface SecurityService {
  id: string;
  name: string;
  arabicName: string;
  type: 'police' | 'civil-defense' | 'border' | 'intelligence' | 'emergency';
  jurisdiction: string[];
  capabilities: string[];
  responseTime: number; // minutes
}

export interface CivilService {
  id: string;
  name: string;
  arabicName: string;
  type: 'documentation' | 'registration' | 'licensing' | 'certification';
  processingTime: number; // days
  fees: number; // IQD
  requirements: string[];
  onlineAvailable: boolean;
}

export interface EmergencyService {
  id: string;
  name: string;
  arabicName: string;
  type: 'fire' | 'medical' | 'police' | 'disaster' | 'rescue';
  coverage: string[];
  responseTime: number; // minutes
  equipment: string[];
  trainingLevel: string;
}

export interface JudiciaryFacility {
  id: string;
  name: string;
  arabicName: string;
  type: 'court' | 'tribunal' | 'appeals-court' | 'supreme-court';
  jurisdiction: string[];
  specializations: string[];
  islamicJurisprudence: boolean;
  location: MinistryLocation;
}

export interface LegalService {
  id: string;
  name: string;
  arabicName: string;
  type: 'legal-aid' | 'mediation' | 'arbitration' | 'notary' | 'certification';
  eligibility: string[];
  cost: number; // IQD
  processingTime: number; // days
  islamicLawCompliant: boolean;
}

export interface CorrectionalFacility {
  id: string;
  name: string;
  arabicName: string;
  type: 'prison' | 'detention' | 'rehabilitation' | 'juvenile';
  capacity: number;
  securityLevel: 'minimum' | 'medium' | 'maximum' | 'super-maximum';
  programs: string[];
  location: MinistryLocation;
}

// Ministry Workflow Templates
export interface MinistryWorkflowTemplate {
  id: string;
  name: string;
  arabicName: string;
  ministryId: string;
  departmentId?: string;
  
  // Template categorization
  category: 'citizen-service' | 'internal-process' | 'inter-ministry' | 'emergency' | 'regulatory';
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  
  // Service details
  service: {
    type: ServiceType;
    expectedDuration: string;
    requiredApprovals: string[];
    documentsNeeded: string[];
    fees: number; // IQD
  };
  
  // Cultural and compliance requirements
  compliance: {
    islamicCompliant: boolean;
    culturallyValidated: boolean;
    securityCleared: boolean;
    privacyCompliant: boolean;
    tribalSensitive: boolean;
  };
  
  // Workflow structure
  workflow: {
    nodes: any[]; // Will use IraqiWorkflowNode from workflow.types.ts
    connections: any[]; // Will use IraqiWorkflowConnection
    estimatedSteps: number;
    automationLevel: number; // 0-100 percentage
  };
  
  // Usage and performance metrics
  metrics: {
    adoptionRate: number; // percentage of eligible cases using this template
    successRate: number; // percentage of successful completions
    averageCompletionTime: number; // days
    citizenSatisfaction: number; // 0-100
    costSavings: number; // IQD per use
  };
  
  // Maintenance and updates
  maintenance: {
    lastUpdated: Date;
    version: string;
    updateFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    responsibleDepartment: string;
    reviewSchedule: Date;
  };
}

// Export utility types
export type MinistryType = 'health' | 'education' | 'interior' | 'justice' | 'finance' | 'defense' | 'foreign' | 'agriculture' | 'industry' | 'transport';
export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'secret' | 'top-secret';
export type ComplianceLevel = 'basic' | 'standard' | 'enhanced' | 'maximum';
export type ServiceComplexity = 'simple' | 'moderate' | 'complex' | 'enterprise';
export type CulturalSensitivity = 'standard' | 'high' | 'maximum';

// Ministry configuration factory types
export interface MinistryConfigurationFactory {
  createHealthMinistry(): HealthMinistryConfig;
  createEducationMinistry(): EducationMinistryConfig;
  createInteriorMinistry(): InteriorMinistryConfig;
  createJusticeMinistry(): JusticeMinistryConfig;
  createGenericMinistry(type: MinistryType): MinistryConfiguration;
}

export interface MinistryServiceRegistry {
  getServicesByMinistry(ministryId: string): ServiceType[];
  getServicesByCategory(category: ServiceCategory): ServiceType[];
  getServiceByComplexity(complexity: ServiceComplexity): ServiceType[];
  getCulturallyAppropriateeServices(culturalLevel: CulturalSensitivity): ServiceType[];
}