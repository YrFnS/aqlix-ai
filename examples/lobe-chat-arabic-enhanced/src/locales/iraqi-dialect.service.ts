/**
 * Iraqi Dialect Translation Service
 * Comprehensive Iraqi Arabic dialect support with professional domain integration
 * Supports Baghdad, Basra, Mosul, Southern, and Kurdish-Arabic dialects
 */

import { createContext, useContext } from 'react';

// Types
export interface IraqiDialectConfig {
  primaryDialect: IraqiDialect;
  fallbackDialect: IraqiDialect;
  professionalDomain?: ProfessionalDomain;
  formalityLevel: 'casual' | 'formal' | 'official';
  culturalContext: CulturalContext;
  governorate?: IraqiGovernorate;
}

export type IraqiDialect = 
  | 'baghdad' 
  | 'basra' 
  | 'mosul' 
  | 'southern' 
  | 'kurdish-arabic' 
  | 'standard';

export type ProfessionalDomain = 
  | 'legal' | 'medical' | 'educational' | 'business' 
  | 'engineering' | 'government' | 'religious' | 'cultural';

export type IraqiGovernorate = 
  | 'baghdad' | 'basra' | 'nineveh' | 'erbil' | 'sulaymaniyah' 
  | 'najaf' | 'karbala' | 'babylon' | 'wasit' | 'maysan'
  | 'qadisiyyah' | 'muthanna' | 'anbar' | 'saladin' | 'kirkuk'
  | 'duhok' | 'diyala' | 'thi-qar';

export interface CulturalContext {
  islamicCompliance: boolean;
  professionalStandards: boolean;
  familyRespect: boolean;
  elderlyRespect: boolean;
  genderSensitivity: boolean;
  tribalAwareness: boolean;
}

export interface DialectTranslation {
  key: string;
  standard: string;
  dialects: {
    [K in IraqiDialect]: string;
  };
  professional?: {
    [K in ProfessionalDomain]?: string;
  };
  cultural?: {
    formal?: string;
    casual?: string;
    respectful?: string;
  };
  context?: string[];
  usage?: string;
  examples?: string[];
}

// Comprehensive Iraqi Dialect Translations
const IRAQI_TRANSLATIONS: { [key: string]: DialectTranslation } = {
  // Greetings and Common Expressions
  'greeting.hello': {
    key: 'greeting.hello',
    standard: 'مرحباً',
    dialects: {
      'baghdad': 'شلونك',
      'basra': 'شلونكم',
      'mosul': 'شلون حالك',
      'southern': 'شلونك حبيبي',
      'kurdish-arabic': 'چونيت',
      'standard': 'السلام عليكم'
    },
    professional: {
      'government': 'السلام عليكم ورحمة الله',
      'legal': 'أهلاً وسهلاً بكم',
      'medical': 'مرحباً بكم في العيادة',
      'educational': 'مرحباً بالطلاب الأعزاء'
    },
    cultural: {
      formal: 'السلام عليكم ورحمة الله وبركاته',
      casual: 'هلا والله',
      respectful: 'أهلاً وسهلاً بكم'
    },
    context: ['meeting', 'phone', 'formal', 'casual'],
    usage: 'Used for greeting people in different social contexts'
  },

  'greeting.how_are_you': {
    key: 'greeting.how_are_you',
    standard: 'كيف حالك؟',
    dialects: {
      'baghdad': 'شكو ماكو؟',
      'basra': 'شلون الأحوال؟',
      'mosul': 'كيفك؟',
      'southern': 'شلونك وشلون الصحة؟',
      'kurdish-arabic': 'چونيت براكەم؟',
      'standard': 'كيف حالكم؟'
    },
    professional: {
      'medical': 'كيف تشعر اليوم؟',
      'legal': 'كيف يمكنني مساعدتكم؟',
      'educational': 'كيف دراستكم؟'
    },
    cultural: {
      formal: 'كيف صحتكم وأحوالكم؟',
      casual: 'شكو ماكو؟',
      respectful: 'كيف حالكم وحال الأهل؟'
    }
  },

  'greeting.goodbye': {
    key: 'greeting.goodbye',
    standard: 'وداعاً',
    dialects: {
      'baghdad': 'خوش',
      'basra': 'الله وياكم',
      'mosul': 'مع السلامة',
      'southern': 'الله يحفظكم',
      'kurdish-arabic': 'ماڵەوە',
      'standard': 'إلى اللقاء'
    },
    cultural: {
      formal: 'بارك الله فيكم',
      casual: 'يلله خوش',
      respectful: 'الله يحفظكم ويحميكم'
    }
  },

  // Time and Date
  'time.now': {
    key: 'time.now',
    standard: 'الآن',
    dialects: {
      'baghdad': 'هسه',
      'basra': 'هسة',
      'mosul': 'هسا',
      'southern': 'هسة',
      'kurdish-arabic': 'ئێستا',
      'standard': 'الآن'
    }
  },

  'time.today': {
    key: 'time.today',
    standard: 'اليوم',
    dialects: {
      'baghdad': 'اليوم',
      'basra': 'هاي يوم',
      'mosul': 'هاد اليوم',
      'southern': 'هذا اليوم',
      'kurdish-arabic': 'ئەمڕۆ',
      'standard': 'اليوم'
    }
  },

  'time.tomorrow': {
    key: 'time.tomorrow',
    standard: 'غداً',
    dialects: {
      'baghdad': 'باچر',
      'basra': 'بكرة',
      'mosul': 'بكرا',
      'southern': 'بكرة',
      'kurdish-arabic': 'بەيانی',
      'standard': 'غداً'
    }
  },

  // Questions and Interrogatives
  'question.what': {
    key: 'question.what',
    standard: 'ماذا',
    dialects: {
      'baghdad': 'شنو',
      'basra': 'شنو',
      'mosul': 'شو',
      'southern': 'شنو',
      'kurdish-arabic': 'چی',
      'standard': 'ما'
    }
  },

  'question.where': {
    key: 'question.where',
    standard: 'أين',
    dialects: {
      'baghdad': 'وين',
      'basra': 'وين',
      'mosul': 'وين',
      'southern': 'وين',
      'kurdish-arabic': 'لەکوێ',
      'standard': 'أين'
    }
  },

  'question.when': {
    key: 'question.when',
    standard: 'متى',
    dialects: {
      'baghdad': 'شوكت',
      'basra': 'متى',
      'mosul': 'إمتى',
      'southern': 'متى',
      'kurdish-arabic': 'كەي',
      'standard': 'متى'
    }
  },

  'question.why': {
    key: 'question.why',
    standard: 'لماذا',
    dialects: {
      'baghdad': 'ليش',
      'basra': 'ليش',
      'mosul': 'ليش',
      'southern': 'ليش',
      'kurdish-arabic': 'بۆچی',
      'standard': 'لماذا'
    }
  },

  // Family and Social Terms
  'family.father': {
    key: 'family.father',
    standard: 'الوالد',
    dialects: {
      'baghdad': 'ابويه',
      'basra': 'ابو',
      'mosul': 'بابا',
      'southern': 'ابويه',
      'kurdish-arabic': 'باوک',
      'standard': 'والد'
    },
    cultural: {
      respectful: 'الوالد الكريم',
      casual: 'بابا'
    }
  },

  'family.mother': {
    key: 'family.mother',
    standard: 'الوالدة',
    dialects: {
      'baghdad': 'امي',
      'basra': 'يما',
      'mosul': 'ماما',
      'southern': 'امي',
      'kurdish-arabic': 'دایک',
      'standard': 'والدة'
    },
    cultural: {
      respectful: 'الوالدة الكريمة',
      casual: 'ماما'
    }
  },

  'family.brother': {
    key: 'family.brother',
    standard: 'الأخ',
    dialects: {
      'baghdad': 'اخويه',
      'basra': 'اخو',
      'mosul': 'اخ',
      'southern': 'اخويه',
      'kurdish-arabic': 'برا',
      'standard': 'أخ'
    }
  },

  'family.sister': {
    key: 'family.sister',
    standard: 'الأخت',
    dialects: {
      'baghdad': 'اختي',
      'basra': 'خيتو',
      'mosul': 'اخت',
      'southern': 'اختي',
      'kurdish-arabic': 'خوشک',
      'standard': 'أخت'
    }
  },

  // Professional Terms - Legal Domain
  'legal.court': {
    key: 'legal.court',
    standard: 'المحكمة',
    dialects: {
      'baghdad': 'المحكمة',
      'basra': 'المحكمة',
      'mosul': 'المحكمة',
      'southern': 'المحكمة',
      'kurdish-arabic': 'دادگاه',
      'standard': 'المحكمة'
    },
    professional: {
      'legal': 'محكمة البداءة العراقية',
      'government': 'المحكمة الاتحادية العليا'
    }
  },

  'legal.lawyer': {
    key: 'legal.lawyer',
    standard: 'المحامي',
    dialects: {
      'baghdad': 'المحامي',
      'basra': 'الوكيل',
      'mosul': 'المحامي',
      'southern': 'المحامي',
      'kurdish-arabic': 'پارێزکار',
      'standard': 'محام'
    },
    professional: {
      'legal': 'المحامي المرافع',
      'government': 'مستشار قانوني'
    }
  },

  // Professional Terms - Medical Domain
  'medical.doctor': {
    key: 'medical.doctor',
    standard: 'الطبيب',
    dialects: {
      'baghdad': 'الدكتور',
      'basra': 'الحكيم',
      'mosul': 'الدكتور',
      'southern': 'الدكتور',
      'kurdish-arabic': 'دکتۆر',
      'standard': 'طبيب'
    },
    professional: {
      'medical': 'الطبيب الاستشاري',
      'government': 'طبيب الصحة العامة'
    },
    cultural: {
      respectful: 'الدكتور المحترم'
    }
  },

  'medical.hospital': {
    key: 'medical.hospital',
    standard: 'المستشفى',
    dialects: {
      'baghdad': 'المستشفى',
      'basra': 'البيمارستان',
      'mosul': 'المستشفى',
      'southern': 'المستشفى',
      'kurdish-arabic': 'نەخۆشخانە',
      'standard': 'مستشفى'
    },
    professional: {
      'medical': 'المستشفى التخصصي',
      'government': 'مستشفى الصحة العامة'
    }
  },

  // Professional Terms - Educational Domain
  'education.teacher': {
    key: 'education.teacher',
    standard: 'المدرس',
    dialects: {
      'baghdad': 'المعلم',
      'basra': 'الاستاذ',
      'mosul': 'المدرس',
      'southern': 'المعلم',
      'kurdish-arabic': 'مامۆستا',
      'standard': 'مدرس'
    },
    professional: {
      'educational': 'الأستاذ المحاضر',
      'government': 'مدرس أول'
    },
    cultural: {
      respectful: 'الأستاذ المحترم'
    }
  },

  'education.student': {
    key: 'education.student',
    standard: 'الطالب',
    dialects: {
      'baghdad': 'الطالب',
      'basra': 'التلميذ',
      'mosul': 'الطالب',
      'southern': 'الطالب',
      'kurdish-arabic': 'قوتابی',
      'standard': 'طالب'
    },
    professional: {
      'educational': 'الطالب الجامعي',
      'government': 'الطالب المتفوق'
    }
  },

  'education.university': {
    key: 'education.university',
    standard: 'الجامعة',
    dialects: {
      'baghdad': 'الجامعة',
      'basra': 'الجامعة',
      'mosul': 'الجامعة',
      'southern': 'الجامعة',
      'kurdish-arabic': 'زانکۆ',
      'standard': 'جامعة'
    },
    professional: {
      'educational': 'الجامعة الحكومية',
      'government': 'مؤسسة التعليم العالي'
    }
  },

  // Technology Terms
  'tech.computer': {
    key: 'tech.computer',
    standard: 'الحاسوب',
    dialects: {
      'baghdad': 'الكمبيوتر',
      'basra': 'الجهاز',
      'mosul': 'الحاسوب',
      'southern': 'الكمبيوتر',
      'kurdish-arabic': 'کۆمپیوتەر',
      'standard': 'حاسوب'
    },
    professional: {
      'engineering': 'نظام الحاسوب',
      'business': 'الحاسب الآلي'
    }
  },

  'tech.internet': {
    key: 'tech.internet',
    standard: 'الإنترنت',
    dialects: {
      'baghdad': 'النت',
      'basra': 'الانترنيت',
      'mosul': 'الإنترنت',
      'southern': 'النت',
      'kurdish-arabic': 'ئینتەرنێت',
      'standard': 'الشبكة العنكبوتية'
    }
  },

  // Business Terms
  'business.money': {
    key: 'business.money',
    standard: 'المال',
    dialects: {
      'baghdad': 'الفلوس',
      'basra': 'البيسة',
      'mosul': 'المصاري',
      'southern': 'الفلوس',
      'kurdish-arabic': 'پارە',
      'standard': 'مال'
    },
    professional: {
      'business': 'رأس المال',
      'legal': 'الأموال المتداولة'
    }
  },

  'business.work': {
    key: 'business.work',
    standard: 'العمل',
    dialects: {
      'baghdad': 'الشغل',
      'basra': 'الدوام',
      'mosul': 'الشغل',
      'southern': 'الشغل',
      'kurdish-arabic': 'کار',
      'standard': 'عمل'
    },
    professional: {
      'business': 'العمل التجاري',
      'government': 'الوظيفة الحكومية'
    }
  },

  // Food and Dining
  'food.eat': {
    key: 'food.eat',
    standard: 'أكل',
    dialects: {
      'baghdad': 'اكل',
      'basra': 'طعام',
      'mosul': 'اكل',
      'southern': 'اكل',
      'kurdish-arabic': 'خواردن',
      'standard': 'طعام'
    }
  },

  'food.rice': {
    key: 'food.rice',
    standard: 'الأرز',
    dialects: {
      'baghdad': 'تمن',
      'basra': 'رز',
      'mosul': 'رز',
      'southern': 'تمن',
      'kurdish-arabic': 'برنج',
      'standard': 'أرز'
    }
  },

  // Emotions and Responses
  'emotion.good': {
    key: 'emotion.good',
    standard: 'جيد',
    dialects: {
      'baghdad': 'زين',
      'basra': 'حلو',
      'mosul': 'منيح',
      'southern': 'زين',
      'kurdish-arabic': 'باش',
      'standard': 'حسن'
    }
  },

  'emotion.bad': {
    key: 'emotion.bad',
    standard: 'سيء',
    dialects: {
      'baghdad': 'مو زين',
      'basra': 'مو حلو',
      'mosul': 'مو منيح',
      'southern': 'مو زين',
      'kurdish-arabic': 'خراپ',
      'standard': 'سيء'
    }
  },

  'emotion.happy': {
    key: 'emotion.happy',
    standard: 'سعيد',
    dialects: {
      'baghdad': 'فرحان',
      'basra': 'مسرور',
      'mosul': 'فرحان',
      'southern': 'فرحان',
      'kurdish-arabic': 'شاد',
      'standard': 'مسرور'
    }
  },

  // Affirmatives and Negatives
  'response.yes': {
    key: 'response.yes',
    standard: 'نعم',
    dialects: {
      'baghdad': 'ايه',
      'basra': 'نعم',
      'mosul': 'اي',
      'southern': 'ايه',
      'kurdish-arabic': 'بەڵێ',
      'standard': 'نعم'
    }
  },

  'response.no': {
    key: 'response.no',
    standard: 'لا',
    dialects: {
      'baghdad': 'لا',
      'basra': 'كلا',
      'mosul': 'لا',
      'southern': 'لا',
      'kurdish-arabic': 'نەخێر',
      'standard': 'كلا'
    }
  },

  // Common Expressions
  'expression.thank_you': {
    key: 'expression.thank_you',
    standard: 'شكراً',
    dialects: {
      'baghdad': 'شكراً',
      'basra': 'مشكور',
      'mosul': 'يسلمو',
      'southern': 'الله يعطيك العافية',
      'kurdish-arabic': 'سوپاس',
      'standard': 'جزاك الله خيراً'
    },
    cultural: {
      formal: 'بارك الله فيكم',
      casual: 'مشكور',
      respectful: 'جزاكم الله خيراً'
    }
  },

  'expression.welcome': {
    key: 'expression.welcome',
    standard: 'أهلاً وسهلاً',
    dialects: {
      'baghdad': 'هلا والله',
      'basra': 'اهلين',
      'mosul': 'مرحبا',
      'southern': 'هلا والله',
      'kurdish-arabic': 'بەخێربێیت',
      'standard': 'أهلاً وسهلاً'
    },
    cultural: {
      formal: 'أهلاً وسهلاً بكم',
      casual: 'هلا والله'
    }
  },

  'expression.excuse_me': {
    key: 'expression.excuse_me',
    standard: 'عفواً',
    dialects: {
      'baghdad': 'عفواً',
      'basra': 'سموحة',
      'mosul': 'معذرة',
      'southern': 'اعذرني',
      'kurdish-arabic': 'ببورە',
      'standard': 'المعذرة'
    }
  },

  'expression.god_willing': {
    key: 'expression.god_willing',
    standard: 'إن شاء الله',
    dialects: {
      'baghdad': 'انشالله',
      'basra': 'ان شاء الله',
      'mosul': 'انشالله',
      'southern': 'انشالله',
      'kurdish-arabic': 'ئینشاڵڵا',
      'standard': 'بإذن الله'
    },
    cultural: {
      formal: 'بإذن الله تعالى',
      casual: 'انشالله'
    }
  },

  // Places and Locations
  'place.home': {
    key: 'place.home',
    standard: 'البيت',
    dialects: {
      'baghdad': 'البيت',
      'basra': 'الدار',
      'mosul': 'البيت',
      'southern': 'الدار',
      'kurdish-arabic': 'ماڵ',
      'standard': 'المنزل'
    }
  },

  'place.school': {
    key: 'place.school',
    standard: 'المدرسة',
    dialects: {
      'baghdad': 'المدرسة',
      'basra': 'المدرسة',
      'mosul': 'المدرسة',
      'southern': 'المدرسة',
      'kurdish-arabic': 'قوتابخانە',
      'standard': 'المدرسة'
    }
  },

  'place.market': {
    key: 'place.market',
    standard: 'السوق',
    dialects: {
      'baghdad': 'الباصة',
      'basra': 'السوق',
      'mosul': 'السوق',
      'southern': 'السوق',
      'kurdish-arabic': 'بازاڕ',
      'standard': 'السوق'
    }
  }
};

// Regional Dialect Characteristics
const DIALECT_CHARACTERISTICS = {
  baghdad: {
    name: 'لهجة بغدادية',
    nameEn: 'Baghdadi Dialect',
    region: 'وسط العراق',
    speakers: '8+ million',
    characteristics: [
      'Use of شلونك for how are you',
      'شكو ماكو for what\'s up',
      'هسه for now',
      'Soft pronunciation',
      'Persian and Turkish loanwords'
    ],
    commonPhrases: {
      'how_are_you': 'شكو ماكو؟',
      'whats_new': 'شنو الجديد؟',
      'goodbye': 'خوش',
      'thank_you': 'شكراً',
      'good': 'زين'
    }
  },

  basra: {
    name: 'لهجة بصراوية',
    nameEn: 'Basrawi Dialect',
    region: 'جنوب العراق',
    speakers: '3+ million',
    characteristics: [
      'Use of شلونكم for greetings',
      'البيسة for money',
      'Gulf Arabic influence',
      'Maritime terminology',
      'Distinctive intonation'
    ],
    commonPhrases: {
      'how_are_you': 'شلون الأحوال؟',
      'money': 'البيسة',
      'home': 'الدار',
      'good': 'حلو',
      'thank_you': 'مشكور'
    }
  },

  mosul: {
    name: 'لهجة موصلية',
    nameEn: 'Moslawi Dialect',
    region: 'شمال العراق',
    speakers: '2+ million',
    characteristics: [
      'Syrian Arabic influence',
      'Kurdish loanwords',
      'Distinctive قاف pronunciation',
      'Ancient Mesopotamian elements',
      'Mountain dialect features'
    ],
    commonPhrases: {
      'how_are_you': 'كيفك؟',
      'good': 'منيح',
      'yes': 'اي',
      'thank_you': 'يسلمو',
      'excuse_me': 'معذرة'
    }
  },

  southern: {
    name: 'لهجة جنوبية',
    nameEn: 'Southern Iraqi Dialect',
    region: 'المحافظات الجنوبية',
    speakers: '4+ million',
    characteristics: [
      'Bedouin Arabic elements',
      'Marsh Arabic influence',
      'Religious terminology',
      'Traditional expressions',
      'Tribal vocabulary'
    ],
    commonPhrases: {
      'how_are_you': 'شلونك وشلون الصحة؟',
      'thank_you': 'الله يعطيك العافية',
      'goodbye': 'الله يحفظكم',
      'home': 'الدار',
      'good': 'زين'
    }
  },

  'kurdish-arabic': {
    name: 'عربي كردي',
    nameEn: 'Kurdish-Arabic',
    region: 'إقليم كردستان العراق',
    speakers: '1+ million',
    characteristics: [
      'Kurdish substrate influence',
      'Bilingual code-switching',
      'Persian loanwords',
      'Unique sound system',
      'Cultural adaptation'
    ],
    commonPhrases: {
      'hello': 'چونيت',
      'goodbye': 'ماڵەوە',
      'thank_you': 'سوپاس',
      'yes': 'بەڵێ',
      'no': 'نەخێر'
    }
  },

  standard: {
    name: 'العربية الفصحى',
    nameEn: 'Standard Arabic',
    region: 'العراق - رسمي',
    speakers: 'All educated speakers',
    characteristics: [
      'Formal and official contexts',
      'Media and education',
      'Religious contexts',
      'Government documents',
      'Inter-dialectal communication'
    ],
    commonPhrases: {
      'greeting': 'السلام عليكم',
      'thank_you': 'جزاكم الله خيراً',
      'goodbye': 'إلى اللقاء',
      'yes': 'نعم',
      'no': 'كلا'
    }
  }
};

// Context for the dialect system
export const IraqiDialectContext = createContext<{
  config: IraqiDialectConfig;
  updateConfig: (config: Partial<IraqiDialectConfig>) => void;
  translate: (key: string, options?: TranslationOptions) => string;
  getDialectInfo: (dialect: IraqiDialect) => any;
  getSupportedDialects: () => IraqiDialect[];
  validateDialectSupport: (key: string, dialect: IraqiDialect) => boolean;
} | null>(null);

export interface TranslationOptions {
  dialect?: IraqiDialect;
  domain?: ProfessionalDomain;
  formality?: 'casual' | 'formal' | 'official';
  cultural?: 'formal' | 'casual' | 'respectful';
  fallback?: boolean;
}

export class IraqiDialectService {
  private config: IraqiDialectConfig;
  private translations: typeof IRAQI_TRANSLATIONS = IRAQI_TRANSLATIONS;

  constructor(config: IraqiDialectConfig) {
    this.config = config;
  }

  /**
   * Translate a key to Iraqi dialect
   */
  translate(key: string, options: TranslationOptions = {}): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }

    const dialect = options.dialect || this.config.primaryDialect;
    const domain = options.domain || this.config.professionalDomain;
    const formality = options.formality || this.config.formalityLevel;

    // Professional domain translation
    if (domain && translation.professional?.[domain]) {
      return translation.professional[domain];
    }

    // Cultural context translation
    if (options.cultural && translation.cultural?.[options.cultural]) {
      return translation.cultural[options.cultural];
    }

    // Formality-based translation
    if (formality === 'official' && translation.cultural?.formal) {
      return translation.cultural.formal;
    }

    // Dialect-specific translation
    if (translation.dialects[dialect]) {
      return translation.dialects[dialect];
    }

    // Fallback to primary dialect
    if (options.fallback !== false && translation.dialects[this.config.fallbackDialect]) {
      return translation.dialects[this.config.fallbackDialect];
    }

    // Final fallback to standard Arabic
    return translation.standard;
  }

  /**
   * Get dialect information
   */
  getDialectInfo(dialect: IraqiDialect) {
    return DIALECT_CHARACTERISTICS[dialect] || null;
  }

  /**
   * Get all supported dialects
   */
  getSupportedDialects(): IraqiDialect[] {
    return ['baghdad', 'basra', 'mosul', 'southern', 'kurdish-arabic', 'standard'];
  }

  /**
   * Validate if a key supports specific dialect
   */
  validateDialectSupport(key: string, dialect: IraqiDialect): boolean {
    const translation = this.translations[key];
    return translation && translation.dialects[dialect] !== undefined;
  }

  /**
   * Get translation statistics
   */
  getTranslationStats() {
    const totalKeys = Object.keys(this.translations).length;
    const dialectStats: { [K in IraqiDialect]: number } = {} as any;

    this.getSupportedDialects().forEach(dialect => {
      dialectStats[dialect] = Object.values(this.translations).filter(
        t => t.dialects[dialect]
      ).length;
    });

    return {
      totalKeys,
      dialectCoverage: dialectStats,
      professionalDomains: Object.values(this.translations).filter(
        t => t.professional
      ).length,
      culturalVariants: Object.values(this.translations).filter(
        t => t.cultural
      ).length
    };
  }

  /**
   * Add custom translation
   */
  addTranslation(key: string, translation: DialectTranslation) {
    this.translations[key] = translation;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<IraqiDialectConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): IraqiDialectConfig {
    return { ...this.config };
  }

  /**
   * Detect dialect from text (basic implementation)
   */
  detectDialect(text: string): { dialect: IraqiDialect; confidence: number } {
    const dialectScores: { [K in IraqiDialect]: number } = {
      'baghdad': 0,
      'basra': 0, 
      'mosul': 0,
      'southern': 0,
      'kurdish-arabic': 0,
      'standard': 0
    };

    // Check for dialect-specific phrases
    Object.entries(DIALECT_CHARACTERISTICS).forEach(([dialect, info]) => {
      Object.values(info.commonPhrases).forEach(phrase => {
        if (text.includes(phrase)) {
          dialectScores[dialect as IraqiDialect] += 2;
        }
      });
    });

    // Find highest scoring dialect
    const bestDialect = Object.entries(dialectScores).reduce((best, [dialect, score]) => 
      score > best.score ? { dialect: dialect as IraqiDialect, score } : best,
      { dialect: 'standard' as IraqiDialect, score: 0 }
    );

    return {
      dialect: bestDialect.dialect,
      confidence: Math.min((bestDialect.score / 5) * 100, 100)
    };
  }

  /**
   * Get appropriate greeting for context
   */
  getContextualGreeting(context: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    relationship?: 'formal' | 'casual' | 'family';
    domain?: ProfessionalDomain;
  }): string {
    if (context.domain) {
      return this.translate('greeting.hello', { 
        domain: context.domain,
        formality: 'formal'
      });
    }

    if (context.relationship === 'formal') {
      return this.translate('greeting.hello', { 
        cultural: 'formal' 
      });
    }

    return this.translate('greeting.hello');
  }
}

export default IraqiDialectService;

// Hook for using the dialect service
export const useIraqiDialect = () => {
  const context = useContext(IraqiDialectContext);
  if (!context) {
    throw new Error('useIraqiDialect must be used within IraqiDialectProvider');
  }
  return context;
};