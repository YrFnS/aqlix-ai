// Shared TypeScript types for Iraqi Persona Management
// Ensures cultural compliance, RTL support, and professional domain integration

export interface Persona {
  id: string;
  name: string; // Arabic primary name
  englishName: string; // English fallback
  description: string; // Arabic description with cultural context
  domain: string; // e.g., 'legal', 'medical' (professional/organization)
  traits?: PersonaTraits[]; // Associated traits
  dialectSupport: boolean; // Iraqi dialect compatibility
  culturalValidation: 'pass' | 'warning' | 'fail'; // From validation service
  lastUsed?: Date;
  syncStatus?: 'pending' | 'synced' | 'conflict'; // For offline
  memoryContext?: any; // Applied memory from service
}

export interface PersonaTraits {
  id: string;
  name: string; // Arabic
  englishName: string;
  description: string;
  culturalWeight: number; // 0-100 for validation
  domainSpecific: boolean; // Professional domain tie-in
}

export interface CulturalValidationResult {
  score: number; // 0-100, <85 triggers resend
  issues: string[]; // Cultural/Islamic compliance issues
  isCompliant: boolean;
  recommendations?: string[]; // Suggestions for resend
}

// Service response types (assumed)
export interface ServiceResponse<T> {
  data: T;
  validation: CulturalValidationResult;
  offlineCached?: boolean;
}
