// Utility Functions - Image Processing for Iraqi AI Chat System
// Phase 2: Utilities and Helper Functions

// Arabic text processing utilities
export * from './arabic';

// Cultural validation utilities
export interface CulturalValidationResult {
  score: number;
  compliant: boolean;
  issues: string[];
  recommendations: string[];
  islamicCompliant: boolean;
  professionalAppropriate: boolean;
}

export interface ProfessionalContext {
  domain: 'legal' | 'medical' | 'educational' | 'business' | 'engineering' | 'general';
  requiresApproval: boolean;
  specialInstructions?: string;
  culturalNotes?: string[];
}

/**
 * Validate content for Iraqi cultural appropriateness
 */
export async function validateCulturalContent(
  content: string,
  context?: {
    professionalDomain?: string;
    islamicCompliance?: boolean;
    userId?: string;
  }
): Promise<CulturalValidationResult> {
  const ctx = {
    professionalDomain: 'general',
    islamicCompliance: true,
    ...context
  };

  // Initialize result
  const result: CulturalValidationResult = {
    score: 0.95,
    compliant: true,
    issues: [],
    recommendations: [],
    islamicCompliant: true,
    professionalAppropriate: true
  };

  if (!content || !content.trim()) {
    return result;
  }

  const normalizedContent = content.toLowerCase();

  // Check for inappropriate content
  const inappropriateTerms = [
    'violence', 'عنف', 'hate', 'كراهية', 'discrimination', 'تمييز',
    'terrorism', 'إرهاب', 'extremism', 'تطرف'
  ];

  inappropriateTerms.forEach(term => {
    if (normalizedContent.includes(term.toLowerCase())) {
      result.issues.push(`Contains inappropriate term: ${term}`);
      result.score -= 0.3;
      result.compliant = false;
    }
  });

  // Islamic compliance check
  if (ctx.islamicCompliance) {
    const antiIslamicTerms = ['allah is fake', 'الله مزيف', 'islam is wrong', 'الإسلام خطأ'];
    antiIslamicTerms.forEach(term => {
      if (normalizedContent.includes(term.toLowerCase())) {
        result.issues.push('Content conflicts with Islamic values');
        result.islamicCompliant = false;
        result.score -= 0.5;
        result.compliant = false;
      }
    });

    // Boost for Islamic phrases
    const islamicPhrases = ['bismillah', 'بسم الله', 'inshallah', 'إن شاء الله', 'alhamdulillah', 'الحمد لله'];
    const hasIslamic = islamicPhrases.some(phrase => normalizedContent.includes(phrase.toLowerCase()));
    if (hasIslamic) {
      result.score = Math.min(1.0, result.score + 0.05);
      result.recommendations.push('Contains appropriate Islamic references');
    }
  }

  // Professional domain validation
  if (ctx.professionalDomain !== 'general') {
    const domainKeywords = {
      legal: ['law', 'قانون', 'court', 'محكمة', 'justice', 'عدالة'],
      medical: ['health', 'صحة', 'medicine', 'طب', 'treatment', 'علاج'],
      educational: ['education', 'تعليم', 'learning', 'تعلم', 'knowledge', 'معرفة'],
      business: ['business', 'تجارة', 'commerce', 'تجاري', 'profit', 'ربح'],
      engineering: ['engineering', 'هندسة', 'technical', 'تقني', 'design', 'تصميم']
    };

    const keywords = domainKeywords[ctx.professionalDomain as keyof typeof domainKeywords] || [];
    const hasRelevantKeywords = keywords.some(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    );

    if (!hasRelevantKeywords && content.length > 50) {
      result.recommendations.push(`Consider adding ${ctx.professionalDomain}-relevant terminology`);
      result.score -= 0.05;
    }
  }

  // Final adjustments
  result.score = Math.max(0, Math.min(1, result.score));
  result.compliant = result.score >= 0.8 && result.islamicCompliant;

  return result;
}

/**
 * Get professional context information
 */
export function getProfessionalContext(domain: string): ProfessionalContext {
  const contexts: Record<string, ProfessionalContext> = {
    legal: {
      domain: 'legal',
      requiresApproval: true,
      specialInstructions: 'Legal content must comply with Iraqi law and Islamic jurisprudence',
      culturalNotes: [
        'Reference Iraqi legal system',
        'Respect Islamic legal principles',
        'Use formal Arabic terminology'
      ]
    },
    medical: {
      domain: 'medical',
      requiresApproval: true,
      specialInstructions: 'Medical content must be reviewed by qualified professionals',
      culturalNotes: [
        'Consider Islamic perspectives on health',
        'Respect patient privacy',
        'Use culturally appropriate medical terminology'
      ]
    },
    educational: {
      domain: 'educational',
      requiresApproval: false,
      specialInstructions: 'Educational content should support Iraqi curriculum standards',
      culturalNotes: [
        'Align with Iraqi educational values',
        'Include Islamic educational principles',
        'Use age-appropriate content'
      ]
    },
    business: {
      domain: 'business',
      requiresApproval: false,
      specialInstructions: 'Business content must respect Islamic commercial principles',
      culturalNotes: [
        'Follow halal business practices',
        'Respect Iraqi commercial customs',
        'Consider local economic context'
      ]
    },
    engineering: {
      domain: 'engineering',
      requiresApproval: false,
      specialInstructions: 'Engineering content should follow Iraqi technical standards',
      culturalNotes: [
        'Reference Iraqi engineering standards',
        'Consider local infrastructure',
        'Use metric system and Arabic numerals'
      ]
    },
    general: {
      domain: 'general',
      requiresApproval: false,
      specialInstructions: 'General content should be culturally appropriate for Iraqi users'
    }
  };

  return contexts[domain] || contexts.general;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
  warnings?: string[];
} {
  const warnings: string[] = [];

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${formatFileSize(file.size)}. Maximum: ${formatFileSize(maxSize)}`
    };
  }

  // Size warnings
  if (file.size > 4 * 1024 * 1024) {
    warnings.push('Large file size may affect upload performance');
  }

  return { valid: true, warnings };
}

/**
 * Convert base64 to blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  const byteCharacters = atob(base64.replace(/^data:image\/[a-z]+;base64,/, ''));
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create download from base64
 */
export function downloadBase64Image(
  base64: string, 
  filename: string = 'image.png'
): void {
  const blob = base64ToBlob(base64);
  downloadBlob(blob, filename);
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(
  timestamp: number | Date, 
  locale: string = 'en-US'
): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Estimate processing time
 */
export function estimateProcessingTime(
  operation: 'generation' | 'edit',
  model: string,
  size: string,
  count: number = 1
): number {
  const baseTimes = {
    generation: {
      'dall-e-2': { '256x256': 15, '512x512': 18, '1024x1024': 20 },
      'dall-e-3': { '1024x1024': 30, '1792x1024': 35, '1024x1792': 35 }
    },
    edit: {
      'dall-e-2': { '256x256': 20, '512x512': 25, '1024x1024': 30 }
    }
  };

  const modelTimes = baseTimes[operation]?.[model as keyof typeof baseTimes[typeof operation]];
  if (!modelTimes) return 30; // Default

  const baseTime = modelTimes[size as keyof typeof modelTimes] || 30;
  return Math.round(baseTime * count * (0.8 + Math.random() * 0.4)); // Add some variance
}