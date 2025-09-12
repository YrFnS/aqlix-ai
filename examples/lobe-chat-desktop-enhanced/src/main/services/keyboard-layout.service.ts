/**
 * Iraqi AI Chat Desktop - Keyboard Layout Service
 * Comprehensive Iraqi keyboard layout support with Arabic input methods
 */

import { BrowserWindow, globalShortcut } from 'electron';
import Store from 'electron-store';
import { EventEmitter } from 'events';

// Types
interface KeyboardLayout {
  id: string;
  name: string;
  nameAr: string;
  country: string;
  language: string;
  script: 'arabic' | 'latin' | 'mixed';
  layout: KeyMapping;
  inputMethod?: InputMethodConfig;
  culturalFeatures?: CulturalKeyboardFeatures;
}

interface KeyMapping {
  [key: string]: KeyDefinition;
}

interface KeyDefinition {
  default: string;
  shift?: string;
  altgr?: string;
  shiftAltgr?: string;
  deadKey?: boolean;
  combining?: boolean;
}

interface InputMethodConfig {
  type: 'transliteration' | 'phonetic' | 'direct' | 'smart';
  engine: string;
  rules: TransliterationRule[];
  enablePredictiveText: boolean;
  enableAutoCorrect: boolean;
  enableDialectSupport: boolean;
  supportedDialects: IraqiDialect[];
}

interface TransliterationRule {
  input: string | RegExp;
  output: string;
  context?: 'start' | 'middle' | 'end' | 'anywhere';
  dialect?: IraqiDialect;
  priority: number;
}

interface CulturalKeyboardFeatures {
  prayerTimeShortcuts: boolean;
  islamicSymbols: boolean;
  governorateNames: boolean;
  commonPhrases: boolean;
  professionalTerms: Record<string, string[]>;
}

interface KeyboardConfig {
  currentLayout: string;
  enableLayoutSwitching: boolean;
  layoutSwitchKey: string;
  enableInputMethodEditor: boolean;
  inputMethodSettings: InputMethodSettings;
  culturalFeatures: boolean;
  shortcuts: KeyboardShortcuts;
}

interface InputMethodSettings {
  autoConversion: boolean;
  showCandidates: boolean;
  candidateCount: number;
  enableLearning: boolean;
  dialectPreference: IraqiDialect;
  mixedLanguageSupport: boolean;
}

interface KeyboardShortcuts {
  switchLayout: string;
  toggleArabic: string;
  switchDialect: string;
  insertDate: string;
  insertTime: string;
  toggleDiacritics: string;
  professionalMode: Record<string, string>;
}

type IraqiDialect = 
  | 'baghdadi' | 'basrawi' | 'moslawi' | 'southern' 
  | 'kurdish_arab' | 'standard';

export class KeyboardLayoutService extends EventEmitter {
  private store: Store;
  private config: KeyboardConfig;
  private layouts: Map<string, KeyboardLayout>;
  private currentLayout: KeyboardLayout | null = null;
  private inputBuffer: string = '';
  private candidateWindow: BrowserWindow | null = null;
  private mainWindow: BrowserWindow;
  
  constructor(mainWindow: BrowserWindow) {
    super();
    
    this.mainWindow = mainWindow;
    this.store = new Store({
      name: 'keyboard-layouts',
      defaults: {
        config: this.getDefaultConfig(),
        userDictionary: {},
        learnedPatterns: {},
        shortcuts: {},
        layoutPreferences: {}
      }
    });
    
    this.config = this.store.get('config') as KeyboardConfig;
    this.layouts = new Map();
    
    this.initialize();
  }
  
  private getDefaultConfig(): KeyboardConfig {
    return {
      currentLayout: 'iraqi-arabic',
      enableLayoutSwitching: true,
      layoutSwitchKey: 'Alt+Shift',
      enableInputMethodEditor: true,
      inputMethodSettings: {
        autoConversion: true,
        showCandidates: true,
        candidateCount: 5,
        enableLearning: true,
        dialectPreference: 'baghdadi',
        mixedLanguageSupport: true
      },
      culturalFeatures: true,
      shortcuts: {
        switchLayout: 'Alt+Shift',
        toggleArabic: 'Ctrl+Shift+A',
        switchDialect: 'Ctrl+Shift+D',
        insertDate: 'Ctrl+Shift+T',
        insertTime: 'Ctrl+Shift+I',
        toggleDiacritics: 'Ctrl+Shift+H',
        professionalMode: {
          legal: 'Ctrl+Alt+L',
          medical: 'Ctrl+Alt+M',
          educational: 'Ctrl+Alt+E',
          government: 'Ctrl+Alt+G'
        }
      }
    };
  }
  
  private async initialize(): Promise<void> {
    try {
      // Load keyboard layouts
      await this.loadKeyboardLayouts();
      
      // Set initial layout
      await this.setLayout(this.config.currentLayout);
      
      // Register global shortcuts
      this.registerShortcuts();
      
      // Set up input method editor
      if (this.config.enableInputMethodEditor) {
        this.initializeInputMethodEditor();
      }
      
      console.log('KeyboardLayoutService initialized successfully');
      this.emit('initialized', { currentLayout: this.currentLayout?.id });
      
    } catch (error) {
      console.error('Failed to initialize KeyboardLayoutService:', error);
      this.emit('error', { error: error.message });
    }
  }
  
  private async loadKeyboardLayouts(): Promise<void> {
    // Iraqi Arabic Standard Layout (QWERTY-based)
    this.layouts.set('iraqi-arabic', {
      id: 'iraqi-arabic',
      name: 'Iraqi Arabic',
      nameAr: 'العربية العراقية',
      country: 'Iraq',
      language: 'Arabic',
      script: 'arabic',
      layout: this.getIraqiArabicLayout(),
      inputMethod: {
        type: 'transliteration',
        engine: 'iraqi-transliteration',
        rules: this.getIraqiTransliterationRules(),
        enablePredictiveText: true,
        enableAutoCorrect: true,
        enableDialectSupport: true,
        supportedDialects: ['baghdadi', 'basrawi', 'moslawi', 'southern', 'standard']
      },
      culturalFeatures: {
        prayerTimeShortcuts: true,
        islamicSymbols: true,
        governorateNames: true,
        commonPhrases: true,
        professionalTerms: this.getProfessionalTerms()
      }
    });
    
    // Iraqi Arabic Phonetic Layout
    this.layouts.set('iraqi-phonetic', {
      id: 'iraqi-phonetic',
      name: 'Iraqi Arabic Phonetic',
      nameAr: 'العربية العراقية الصوتية',
      country: 'Iraq',
      language: 'Arabic',
      script: 'arabic',
      layout: this.getPhoneticLayout(),
      inputMethod: {
        type: 'phonetic',
        engine: 'phonetic-input',
        rules: this.getPhoneticRules(),
        enablePredictiveText: true,
        enableAutoCorrect: true,
        enableDialectSupport: true,
        supportedDialects: ['baghdadi', 'basrawi', 'moslawi', 'southern']
      }
    });
    
    // Kurdish (Sorani) Layout for Iraqi Kurdistan
    this.layouts.set('kurdish-sorani', {
      id: 'kurdish-sorani',
      name: 'Kurdish Sorani',
      nameAr: 'الكردية السورانية',
      country: 'Iraq',
      language: 'Kurdish',
      script: 'arabic',
      layout: this.getKurdishSoraniLayout(),
      inputMethod: {
        type: 'direct',
        engine: 'kurdish-input',
        rules: [],
        enablePredictiveText: false,
        enableAutoCorrect: false,
        enableDialectSupport: false,
        supportedDialects: []
      }
    });
    
    // English (Iraqi) Layout with Arabic shortcuts
    this.layouts.set('english-iraqi', {
      id: 'english-iraqi',
      name: 'English (Iraqi)',
      nameAr: 'الإنجليزية (العراقية)',
      country: 'Iraq',
      language: 'English',
      script: 'mixed',
      layout: this.getEnglishIraqiLayout(),
      inputMethod: {
        type: 'smart',
        engine: 'mixed-language',
        rules: this.getMixedLanguageRules(),
        enablePredictiveText: true,
        enableAutoCorrect: true,
        enableDialectSupport: false,
        supportedDialects: []
      },
      culturalFeatures: {
        prayerTimeShortcuts: true,
        islamicSymbols: false,
        governorateNames: true,
        commonPhrases: false,
        professionalTerms: this.getEnglishProfessionalTerms()
      }
    });
  }
  
  private getIraqiArabicLayout(): KeyMapping {
    return {
      // First row
      '`': { default: 'ذ', shift: 'ّ' },
      '1': { default: '١', shift: '!' },
      '2': { default: '٢', shift: '@' },
      '3': { default: '٣', shift: '#' },
      '4': { default: '٤', shift: '$' },
      '5': { default: '٥', shift: '%' },
      '6': { default: '٦', shift: '^' },
      '7': { default: '٧', shift: '&' },
      '8': { default: '٨', shift: '*' },
      '9': { default: '٩', shift: ')' },
      '0': { default: '٠', shift: '(' },
      '-': { default: '-', shift: '_' },
      '=': { default: '=', shift: '+' },
      
      // Second row  
      'q': { default: 'ض', shift: 'َ' },
      'w': { default: 'ص', shift: 'ً' },
      'e': { default: 'ث', shift: 'ُ' },
      'r': { default: 'ق', shift: 'ٌ' },
      't': { default: 'ف', shift: 'لا' },
      'y': { default: 'غ', shift: 'إ' },
      'u': { default: 'ع', shift: ''', altgr: '٪' },
      'i': { default: 'ه', shift: '÷' },
      'o': { default: 'خ', shift: '×' },
      'p': { default: 'ح', shift: '؛' },
      '[': { default: 'ج', shift: '<' },
      ']': { default: 'د', shift: '>' },
      '\\': { default: '\\', shift: '|' },
      
      // Third row
      'a': { default: 'ش', shift: 'ِ' },
      's': { default: 'س', shift: 'ٍ' },
      'd': { default: 'ي', shift: ']' },
      'f': { default: 'ب', shift: '[' },
      'g': { default: 'ل', shift: 'لأ' },
      'h': { default: 'ا', shift: 'أ' },
      'j': { default: 'ت', shift: 'ـ' },
      'k': { default: 'ن', shift: '،' },
      'l': { default: 'م', shift: '/' },
      ';': { default: 'ك', shift: ':' },
      '\'': { default: 'ط', shift: '"' },
      
      // Fourth row
      'z': { default: 'ئ', shift: '~' },
      'x': { default: 'ء', shift: 'ْ' },
      'c': { default: 'ؤ', shift: '}' },
      'v': { default: 'ر', shift: '{' },
      'b': { default: 'لا', shift: 'لآ' },
      'n': { default: 'ى', shift: 'آ' },
      'm': { default: 'ة', shift: ''' },
      ',': { default: 'و', shift: ',' },
      '.': { default: 'ز', shift: '.' },
      '/': { default: 'ظ', shift: '؟' },
      
      // Space bar
      ' ': { default: ' ', shift: ' ' }
    };
  }
  
  private getPhoneticLayout(): KeyMapping {
    // Phonetic layout where Arabic letters are positioned based on sound similarity
    return {
      // Consonants based on phonetic similarity
      'b': { default: 'ب' },
      't': { default: 'ت' },
      'th': { default: 'ث' }, // Using digraph for th sound
      'j': { default: 'ج' },
      'h': { default: 'ح' },
      'kh': { default: 'خ' }, // Using digraph for kh sound
      'd': { default: 'د' },
      'dh': { default: 'ذ' }, // Using digraph for dh sound
      'r': { default: 'ر' },
      'z': { default: 'ز' },
      's': { default: 'س' },
      'sh': { default: 'ش' }, // Using digraph for sh sound
      'S': { default: 'ص' }, // Capital for emphatic
      'D': { default: 'ض' }, // Capital for emphatic
      'T': { default: 'ط' }, // Capital for emphatic
      'Z': { default: 'ظ' }, // Capital for emphatic
      '`': { default: 'ع' }, // Using backtick for 'ayn
      'gh': { default: 'غ' }, // Using digraph for gh sound
      'f': { default: 'ف' },
      'q': { default: 'ق' },
      'k': { default: 'ك' },
      'l': { default: 'ل' },
      'm': { default: 'م' },
      'n': { default: 'ن' },
      'w': { default: 'و' },
      'y': { default: 'ي' },
      
      // Vowels and special characters
      'a': { default: 'ا' },
      'i': { default: 'إ' },
      'u': { default: 'أ' },
      'e': { default: 'ة' }, // Ta marbuta
      'o': { default: 'ه' }, // Ha
      
      // Hamza variants
      '\'': { default: 'ء' }, // Hamza
      'A': { default: 'آ' }, // Alif madda
      
      // Numbers (Arabic-Indic)
      '1': { default: '١' },
      '2': { default: '٢' },
      '3': { default: '٣' },
      '4': { default: '٤' },
      '5': { default: '٥' },
      '6': { default: '٦' },
      '7': { default: '٧' },
      '8': { default: '٨' },
      '9': { default: '٩' },
      '0': { default: '٠' }
    };
  }
  
  private getKurdishSoraniLayout(): KeyMapping {
    return {
      // Kurdish Sorani specific letters
      'q': { default: 'ق' },
      'w': { default: 'و' },
      'e': { default: 'ە' }, // Kurdish schwa
      'r': { default: 'ر' },
      't': { default: 'ت' },
      'y': { default: 'ی' }, // Kurdish yeh
      'u': { default: 'ووو' }, // Kurdish long u
      'i': { default: 'ی' },
      'o': { default: 'ۆ' }, // Kurdish o
      'p': { default: 'پ' }, // Kurdish p
      
      'a': { default: 'ا' },
      's': { default: 'س' },
      'd': { default: 'د' },
      'f': { default: 'ف' },
      'g': { default: 'گ' }, // Kurdish g
      'h': { default: 'ه' },
      'j': { default: 'ج' },
      'k': { default: 'ک' }, // Kurdish k
      'l': { default: 'ل' },
      
      'z': { default: 'ز' },
      'x': { default: 'خ' },
      'c': { default: 'چ' }, // Kurdish ch
      'v': { default: 'ڤ' }, // Kurdish v
      'b': { default: 'ب' },
      'n': { default: 'ن' },
      'm': { default: 'م' },
      
      // Kurdish specific diacritics and symbols
      '`': { default: 'ع' },
      ';': { default: 'ژ' }, // Kurdish zh
      '\'': { default: 'ح' },
      '/': { default: 'ڕ' }, // Kurdish rolled r
      ',': { default: 'ڵ' }, // Kurdish ll
      '.': { default: 'ڤ' }, // Kurdish v
      
      // Numbers
      '1': { default: '١' },
      '2': { default: '٢' },
      '3': { default: '٣' },
      '4': { default: '٤' },
      '5': { default: '٥' },
      '6': { default: '٦' },
      '7': { default: '٧' },
      '8': { default: '٨' },
      '9': { default: '٩' },
      '0': { default: '٠' }
    };
  }
  
  private getEnglishIraqiLayout(): KeyMapping {
    // Standard QWERTY layout with Iraqi cultural shortcuts
    return {
      'q': { default: 'q', shift: 'Q', altgr: 'ق' },
      'w': { default: 'w', shift: 'W', altgr: 'و' },
      'e': { default: 'e', shift: 'E', altgr: 'ع' },
      'r': { default: 'r', shift: 'R', altgr: 'ر' },
      't': { default: 't', shift: 'T', altgr: 'ت' },
      'y': { default: 'y', shift: 'Y', altgr: 'ي' },
      'u': { default: 'u', shift: 'U', altgr: 'ؤ' },
      'i': { default: 'i', shift: 'I', altgr: 'ئ' },
      'o': { default: 'o', shift: 'O', altgr: 'ه' },
      'p': { default: 'p', shift: 'P', altgr: 'پ' },
      
      'a': { default: 'a', shift: 'A', altgr: 'ا' },
      's': { default: 's', shift: 'S', altgr: 'س' },
      'd': { default: 'd', shift: 'D', altgr: 'د' },
      'f': { default: 'f', shift: 'F', altgr: 'ف' },
      'g': { default: 'g', shift: 'G', altgr: 'گ' },
      'h': { default: 'h', shift: 'H', altgr: 'ح' },
      'j': { default: 'j', shift: 'J', altgr: 'ج' },
      'k': { default: 'k', shift: 'K', altgr: 'ك' },
      'l': { default: 'l', shift: 'L', altgr: 'ل' },
      
      'z': { default: 'z', shift: 'Z', altgr: 'ز' },
      'x': { default: 'x', shift: 'X', altgr: 'خ' },
      'c': { default: 'c', shift: 'C', altgr: 'چ' },
      'v': { default: 'v', shift: 'V', altgr: 'ڤ' },
      'b': { default: 'b', shift: 'B', altgr: 'ب' },
      'n': { default: 'n', shift: 'N', altgr: 'ن' },
      'm': { default: 'm', shift: 'M', altgr: 'م' },
      
      // Numbers with Arabic-Indic alternatives
      '1': { default: '1', shift: '!', altgr: '١' },
      '2': { default: '2', shift: '@', altgr: '٢' },
      '3': { default: '3', shift: '#', altgr: '٣' },
      '4': { default: '4', shift: '$', altgr: '٤' },
      '5': { default: '5', shift: '%', altgr: '٥' },
      '6': { default: '6', shift: '^', altgr: '٦' },
      '7': { default: '7', shift: '&', altgr: '٧' },
      '8': { default: '8', shift: '*', altgr: '٨' },
      '9': { default: '9', shift: '(', altgr: '٩' },
      '0': { default: '0', shift: ')', altgr: '٠' }
    };
  }
  
  private getIraqiTransliterationRules(): TransliterationRule[] {
    return [
      // Common Iraqi greetings and phrases
      { input: 'salam', output: 'سلام', context: 'anywhere', priority: 10 },
      { input: 'shlonak', output: 'شلونك', dialect: 'baghdadi', priority: 9 },
      { input: 'shlong', output: 'شلونگ', dialect: 'basrawi', priority: 9 },
      { input: 'maku', output: 'ماكو', dialect: 'baghdadi', priority: 8 },
      { input: 'kulish', output: 'كلش', dialect: 'baghdadi', priority: 8 },
      { input: 'wiya', output: 'ويا', dialect: 'baghdadi', priority: 7 },
      { input: 'hassa', output: 'هسا', dialect: 'baghdadi', priority: 7 },
      
      // Standard Arabic transliteration
      { input: 'allah', output: 'الله', context: 'anywhere', priority: 10 },
      { input: 'bismillah', output: 'بسم الله', context: 'anywhere', priority: 10 },
      { input: 'inshallah', output: 'إن شاء الله', context: 'anywhere', priority: 10 },
      { input: 'mashallah', output: 'ما شاء الله', context: 'anywhere', priority: 10 },
      { input: 'alhamdulillah', output: 'الحمد لله', context: 'anywhere', priority: 10 },
      
      // Iraqi governorates
      { input: 'baghdad', output: 'بغداد', priority: 8 },
      { input: 'basra', output: 'البصرة', priority: 8 },
      { input: 'mosul', output: 'الموصل', priority: 8 },
      { input: 'erbil', output: 'اربیل', priority: 8 },
      { input: 'najaf', output: 'النجف', priority: 8 },
      { input: 'karbala', output: 'كربلاء', priority: 8 },
      
      // Professional terms
      { input: 'doctor', output: 'دكتور', priority: 6 },
      { input: 'engineer', output: 'مهندس', priority: 6 },
      { input: 'lawyer', output: 'محامي', priority: 6 },
      { input: 'teacher', output: 'استاذ', priority: 6 },
      { input: 'government', output: 'حكومة', priority: 6 },
      { input: 'university', output: 'جامعة', priority: 6 },
      { input: 'hospital', output: 'مستشفى', priority: 6 },
      { input: 'school', output: 'مدرسة', priority: 6 },
      
      // Basic Arabic letters (single character transliteration)
      { input: 'a', output: 'ا', priority: 1 },
      { input: 'b', output: 'ب', priority: 1 },
      { input: 't', output: 'ت', priority: 1 },
      { input: 'th', output: 'ث', priority: 2 },
      { input: 'j', output: 'ج', priority: 1 },
      { input: 'H', output: 'ح', priority: 1 },
      { input: 'kh', output: 'خ', priority: 2 },
      { input: 'd', output: 'د', priority: 1 },
      { input: 'dh', output: 'ذ', priority: 2 },
      { input: 'r', output: 'ر', priority: 1 },
      { input: 'z', output: 'ز', priority: 1 },
      { input: 's', output: 'س', priority: 1 },
      { input: 'sh', output: 'ش', priority: 2 },
      { input: 'S', output: 'ص', priority: 1 },
      { input: 'D', output: 'ض', priority: 1 },
      { input: 'T', output: 'ط', priority: 1 },
      { input: 'Z', output: 'ظ', priority: 1 },
      { input: '3', output: 'ع', priority: 1 },
      { input: 'gh', output: 'غ', priority: 2 },
      { input: 'f', output: 'ف', priority: 1 },
      { input: 'q', output: 'ق', priority: 1 },
      { input: 'k', output: 'ك', priority: 1 },
      { input: 'l', output: 'ل', priority: 1 },
      { input: 'm', output: 'م', priority: 1 },
      { input: 'n', output: 'ن', priority: 1 },
      { input: 'h', output: 'ه', priority: 1 },
      { input: 'w', output: 'و', priority: 1 },
      { input: 'y', output: 'ي', priority: 1 }
    ];
  }
  
  private getPhoneticRules(): TransliterationRule[] {
    return [
      // Similar to transliteration rules but with phonetic focus
      // This would be a more comprehensive phonetic mapping system
      { input: /^(.*?)([aeiou])\2/, output: '$1$2ّ', priority: 5 }, // Gemination
      { input: /([^aeiou])([aeiou])$/, output: '$1$2ه', context: 'end', priority: 3 }, // Final vowel + h
    ];
  }
  
  private getMixedLanguageRules(): TransliterationRule[] {
    return [
      // Smart detection and conversion for mixed language input
      { input: /\b(hello|hi|hey)\b/i, output: 'مرحبا', priority: 7 },
      { input: /\bthank you\b/i, output: 'شكرا', priority: 7 },
      { input: /\bplease\b/i, output: 'من فضلك', priority: 7 },
      { input: /\byes\b/i, output: 'نعم', priority: 6 },
      { input: /\bno\b/i, output: 'لا', priority: 6 },
      { input: /\bgood morning\b/i, output: 'صباح الخير', priority: 8 },
      { input: /\bgood evening\b/i, output: 'مساء الخير', priority: 8 }
    ];
  }
  
  private getProfessionalTerms(): Record<string, string[]> {
    return {
      legal: [
        'قانون', 'محكمة', 'قاضي', 'محامي', 'دعوى', 'حكم', 'استئناف',
        'عقد', 'اتفاقية', 'شهادة', 'براءة', 'حقوق', 'واجبات'
      ],
      medical: [
        'طبيب', 'مريض', 'مستشفى', 'عيادة', 'دواء', 'علاج', 'تشخيص',
        'فحص', 'جراحة', 'تحليل', 'أشعة', 'صحة', 'مرض'
      ],
      educational: [
        'مدرسة', 'جامعة', 'طالب', 'استاذ', 'درس', 'امتحان', 'شهادة',
        'تعليم', 'تعلم', 'كتاب', 'منهج', 'فصل', 'تخرج'
      ],
      government: [
        'حكومة', 'وزارة', 'وزير', 'دائرة', 'موظف', 'خدمة', 'مواطن',
        'هوية', 'جواز', 'رخصة', 'ضريبة', 'قرار', 'تطبيق'
      ]
    };
  }
  
  private getEnglishProfessionalTerms(): Record<string, string[]> {
    return {
      legal: [
        'law', 'court', 'judge', 'lawyer', 'case', 'verdict', 'appeal',
        'contract', 'agreement', 'certificate', 'patent', 'rights', 'duties'
      ],
      medical: [
        'doctor', 'patient', 'hospital', 'clinic', 'medicine', 'treatment', 'diagnosis',
        'examination', 'surgery', 'analysis', 'x-ray', 'health', 'disease'
      ],
      educational: [
        'school', 'university', 'student', 'professor', 'lesson', 'exam', 'certificate',
        'teaching', 'learning', 'book', 'curriculum', 'classroom', 'graduation'
      ],
      government: [
        'government', 'ministry', 'minister', 'department', 'employee', 'service', 'citizen',
        'identity', 'passport', 'license', 'tax', 'decision', 'application'
      ]
    };
  }
  
  private registerShortcuts(): void {
    try {
      // Layout switching
      globalShortcut.register(this.config.shortcuts.switchLayout, () => {
        this.switchToNextLayout();
      });
      
      // Arabic toggle
      globalShortcut.register(this.config.shortcuts.toggleArabic, () => {
        this.toggleArabicInput();
      });
      
      // Dialect switching
      globalShortcut.register(this.config.shortcuts.switchDialect, () => {
        this.switchDialect();
      });
      
      // Date/time insertion
      globalShortcut.register(this.config.shortcuts.insertDate, () => {
        this.insertCurrentDate();
      });
      
      globalShortcut.register(this.config.shortcuts.insertTime, () => {
        this.insertCurrentTime();
      });
      
      // Professional mode shortcuts
      Object.entries(this.config.shortcuts.professionalMode).forEach(([domain, shortcut]) => {
        globalShortcut.register(shortcut, () => {
          this.activateProfessionalMode(domain);
        });
      });
      
    } catch (error) {
      console.error('Failed to register keyboard shortcuts:', error);
    }
  }
  
  private initializeInputMethodEditor(): void {
    // Initialize IME candidate window
    this.candidateWindow = new BrowserWindow({
      width: 300,
      height: 150,
      show: false,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    
    // Load candidate window content
    this.candidateWindow.loadFile(path.join(__dirname, '../renderer/ime-candidate-window.html'));
  }
  
  /**
   * Public API methods
   */
  
  public async setLayout(layoutId: string): Promise<boolean> {
    const layout = this.layouts.get(layoutId);
    if (!layout) {
      console.error(`Layout not found: ${layoutId}`);
      return false;
    }
    
    this.currentLayout = layout;
    this.config.currentLayout = layoutId;
    this.store.set('config', this.config);
    
    this.emit('layoutChanged', { 
      layout: layout.id, 
      name: layout.name, 
      nameAr: layout.nameAr 
    });
    
    // Notify renderer process
    this.mainWindow.webContents.send('keyboard-layout-changed', {
      layout: layout.id,
      name: layout.name,
      nameAr: layout.nameAr,
      script: layout.script,
      inputMethod: layout.inputMethod?.type
    });
    
    return true;
  }
  
  public switchToNextLayout(): void {
    const layoutIds = Array.from(this.layouts.keys());
    const currentIndex = layoutIds.indexOf(this.config.currentLayout);
    const nextIndex = (currentIndex + 1) % layoutIds.length;
    
    this.setLayout(layoutIds[nextIndex]);
  }
  
  public toggleArabicInput(): void {
    const currentScript = this.currentLayout?.script;
    
    if (currentScript === 'arabic') {
      // Switch to English layout
      this.setLayout('english-iraqi');
    } else {
      // Switch to Arabic layout
      this.setLayout('iraqi-arabic');
    }
  }
  
  public switchDialect(): void {
    if (!this.currentLayout?.inputMethod?.enableDialectSupport) {
      return;
    }
    
    const dialects = this.currentLayout.inputMethod.supportedDialects;
    const currentDialect = this.config.inputMethodSettings.dialectPreference;
    const currentIndex = dialects.indexOf(currentDialect);
    const nextIndex = (currentIndex + 1) % dialects.length;
    
    this.config.inputMethodSettings.dialectPreference = dialects[nextIndex];
    this.store.set('config', this.config);
    
    this.emit('dialectChanged', { dialect: dialects[nextIndex] });
  }
  
  public insertCurrentDate(): void {
    const now = new Date();
    const hijriDate = this.convertToHijri(now);
    const arabicDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${hijriDate}`;
    
    this.insertText(arabicDate);
  }
  
  public insertCurrentTime(): void {
    const now = new Date();
    const time24 = now.toLocaleTimeString('ar-IQ', { hour12: false });
    const time12 = now.toLocaleTimeString('ar-IQ', { hour12: true });
    
    this.insertText(`${time24} (${time12})`);
  }
  
  public activateProfessionalMode(domain: string): void {
    this.emit('professionalModeActivated', { domain });
    
    // Notify renderer process
    this.mainWindow.webContents.send('professional-mode-activated', { domain });
  }
  
  private insertText(text: string): void {
    // Send text to focused input
    this.mainWindow.webContents.send('insert-text', { text });
  }
  
  private convertToHijri(date: Date): string {
    // Simplified Hijri conversion (would use a proper library in production)
    const hijriYear = Math.floor((date.getFullYear() - 622) * 1.030684);
    return `${hijriYear} هـ`;
  }
  
  /**
   * Configuration methods
   */
  
  public getAvailableLayouts(): Array<{id: string; name: string; nameAr: string; script: string}> {
    return Array.from(this.layouts.values()).map(layout => ({
      id: layout.id,
      name: layout.name,
      nameAr: layout.nameAr,
      script: layout.script
    }));
  }
  
  public getCurrentLayout(): KeyboardLayout | null {
    return this.currentLayout;
  }
  
  public updateConfig(newConfig: Partial<KeyboardConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.store.set('config', this.config);
    
    // Re-register shortcuts if they changed
    if (newConfig.shortcuts) {
      globalShortcut.unregisterAll();
      this.registerShortcuts();
    }
    
    this.emit('configUpdated', this.config);
  }
  
  public getConfig(): KeyboardConfig {
    return { ...this.config };
  }
  
  public destroy(): void {
    // Unregister all shortcuts
    globalShortcut.unregisterAll();
    
    // Close candidate window
    if (this.candidateWindow && !this.candidateWindow.isDestroyed()) {
      this.candidateWindow.close();
    }
    
    this.removeAllListeners();
  }
}