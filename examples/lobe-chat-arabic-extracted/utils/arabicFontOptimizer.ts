/**
 * Arabic Font Handling and Text Rendering Optimizer
 * Enhanced for Iraqi AI Chat System
 *
 * Features:
 * - Dynamic Arabic font loading with fallbacks
 * - Text rendering optimization for mixed Arabic-English content
 * - Iraqi dialect-specific typography adjustments
 * - Performance optimization for Arabic text processing
 * - Cultural font preferences with Islamic typography principles
 */

export interface ArabicFontConfig {
  primary: string;
  fallbacks: string[];
  weight: string;
  style: string;
  unicodeRange: string;
  display: 'swap' | 'fallback' | 'optional';
}

export interface TextRenderingOptions {
  direction: 'ltr' | 'rtl' | 'auto';
  dialect: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard';
  domain: 'general' | 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  kerning: boolean;
  ligatures: boolean;
  optimization: 'speed' | 'quality' | 'balanced';
}

// Iraqi-Enhanced Arabic Font Stack
export const ARABIC_FONTS: Record<string, ArabicFontConfig> = {
  // Primary Arabic fonts with Islamic typography principles
  notoArabic: {
    primary: 'Noto Sans Arabic',
    fallbacks: ['Dubai', 'Tahoma', 'DejaVu Sans'],
    weight: '400',
    style: 'normal',
    unicodeRange: 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF',
    display: 'swap',
  },

  // Iraqi professional domains font
  amiri: {
    primary: 'Amiri',
    fallbacks: ['Times New Roman', 'serif'],
    weight: '400',
    style: 'normal',
    unicodeRange: 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF',
    display: 'swap',
  },

  // Modern Arabic UI font
  cairo: {
    primary: 'Cairo',
    fallbacks: ['Arial', 'Helvetica Neue', 'sans-serif'],
    weight: '300 700',
    style: 'normal',
    unicodeRange: 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF',
    display: 'swap',
  },

  // Iraqi dialect-specific font for chat
  harmattan: {
    primary: 'Harmattan',
    fallbacks: ['Tahoma', 'Arial Unicode MS'],
    weight: '400',
    style: 'normal',
    unicodeRange: 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF',
    display: 'swap',
  },
};

// Professional domain font preferences
export const DOMAIN_FONTS: Record<string, string> = {
  legal: 'amiri', // Traditional for legal documents
  medical: 'notoArabic', // Clear for medical terminology
  educational: 'cairo', // Modern for educational content
  business: 'notoArabic', // Professional for business
  engineering: 'cairo', // Technical clarity
  general: 'cairo', // Default modern font
};

// Iraqi dialect typography adjustments
export const DIALECT_ADJUSTMENTS: Record<string, Partial<CSSStyleDeclaration>> = {
  iraqi: {
    letterSpacing: '0.02em',
    wordSpacing: '0.1em',
    lineHeight: '1.7',
  },
  baghdad: {
    letterSpacing: '0.015em',
    wordSpacing: '0.08em',
    lineHeight: '1.65',
  },
  basra: {
    letterSpacing: '0.025em',
    wordSpacing: '0.12em',
    lineHeight: '1.75',
  },
  mosul: {
    letterSpacing: '0.02em',
    wordSpacing: '0.09em',
    lineHeight: '1.68',
  },
  standard: {
    letterSpacing: '0.01em',
    wordSpacing: '0.05em',
    lineHeight: '1.6',
  },
};

/**
 * Arabic Font Optimizer Class
 * Handles dynamic font loading, text rendering optimization, and cultural preferences
 */
export class ArabicFontOptimizer {
  private loadedFonts: Set<string> = new Set();
  private fontCache: Map<string, FontFace> = new Map();
  private preloadQueue: string[] = [];

  constructor() {
    this.initializeFontSystem();
  }

  /**
   * Initialize Arabic font system with Iraqi cultural preferences
   */
  private async initializeFontSystem(): Promise<void> {
    // Preload critical Arabic fonts
    await this.preloadCriticalFonts();

    // Set up font display observers for performance
    this.setupFontDisplayObservers();

    // Initialize cultural font preferences
    this.initializeCulturalPreferences();
  }

  /**
   * Preload critical Arabic fonts for Iraqi AI system
   */
  private async preloadCriticalFonts(): Promise<void> {
    const criticalFonts = ['cairo', 'notoArabic'];

    for (const fontKey of criticalFonts) {
      try {
        await this.loadArabicFont(fontKey);
      } catch (error) {
        console.warn(`Failed to preload font ${fontKey}:`, error);
      }
    }
  }

  /**
   * Load Arabic font with fallback handling
   */
  async loadArabicFont(fontKey: string): Promise<FontFace | null> {
    if (this.loadedFonts.has(fontKey)) {
      return this.fontCache.get(fontKey) || null;
    }

    const config = ARABIC_FONTS[fontKey];
    if (!config) {
      console.warn(`Font configuration not found: ${fontKey}`);
      return null;
    }

    try {
      // Create font face with Iraqi-optimized settings
      const fontFace = new FontFace(
        config.primary,
        `url('/fonts/${fontKey}.woff2') format('woff2')`,
        {
          weight: config.weight,
          style: config.style,
          unicodeRange: config.unicodeRange,
          display: config.display,
        }
      );

      await fontFace.load();
      document.fonts.add(fontFace);

      this.fontCache.set(fontKey, fontFace);
      this.loadedFonts.add(fontKey);

      return fontFace;
    } catch (error) {
      console.error(`Failed to load Arabic font ${fontKey}:`, error);
      return null;
    }
  }

  /**
   * Optimize text rendering for Arabic content with Iraqi enhancements
   */
  optimizeTextRendering(element: HTMLElement, options: TextRenderingOptions): void {
    const { direction, dialect, domain, kerning, ligatures, optimization } = options;

    // Apply Arabic font stack
    const fontKey = DOMAIN_FONTS[domain] || 'cairo';
    element.style.fontFamily = this.buildFontStack(fontKey);

    // Apply text direction and cultural adjustments
    element.style.direction =
      direction === 'auto' ? this.detectTextDirection(element.textContent || '') : direction;
    element.style.textAlign = element.style.direction === 'rtl' ? 'right' : 'left';

    // Apply dialect-specific typography
    const dialectAdjustments = DIALECT_ADJUSTMENTS[dialect] || DIALECT_ADJUSTMENTS.standard;
    Object.assign(element.style, dialectAdjustments);

    // Apply rendering optimizations
    this.applyRenderingOptimizations(element, optimization, kerning, ligatures);

    // Apply cultural styling preferences
    this.applyCulturalStyling(element, domain);
  }

  /**
   * Build optimized font stack with fallbacks
   */
  private buildFontStack(fontKey: string): string {
    const config = ARABIC_FONTS[fontKey];
    if (!config) return 'Arial, sans-serif';

    const fonts = [config.primary, ...config.fallbacks];
    return fonts.map((font) => (font.includes(' ') ? `"${font}"` : font)).join(', ');
  }

  /**
   * Detect text direction for mixed Arabic-English content
   */
  detectTextDirection(text: string): 'ltr' | 'rtl' {
    if (!text) return 'ltr';

    // Arabic Unicode ranges
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const arabicChars = (text.match(new RegExp(arabicRegex, 'g')) || []).length;
    const totalChars = text.replace(/\s/g, '').length;

    // If more than 30% Arabic characters, use RTL
    return arabicChars / totalChars > 0.3 ? 'rtl' : 'ltr';
  }

  /**
   * Apply rendering optimizations based on performance requirements
   */
  private applyRenderingOptimizations(
    element: HTMLElement,
    optimization: string,
    kerning: boolean,
    ligatures: boolean
  ): void {
    // Text rendering optimization
    switch (optimization) {
      case 'speed':
        element.style.textRendering = 'optimizeSpeed';
        element.style.fontKerning = 'none';
        element.style.fontVariantLigatures = 'none';
        break;
      case 'quality':
        element.style.textRendering = 'optimizeLegibility';
        element.style.fontKerning = kerning ? 'normal' : 'none';
        element.style.fontVariantLigatures = ligatures ? 'common-ligatures' : 'none';
        break;
      case 'balanced':
      default:
        element.style.textRendering = 'auto';
        element.style.fontKerning = kerning ? 'auto' : 'none';
        element.style.fontVariantLigatures = ligatures ? 'common-ligatures' : 'none';
        break;
    }

    // Arabic-specific optimizations
    element.style.fontFeatureSettings = ligatures
      ? '"liga" 1, "clig" 1, "kern" 1'
      : '"liga" 0, "clig" 0';
  }

  /**
   * Apply cultural styling preferences for Iraqi professional domains
   */
  private applyCulturalStyling(element: HTMLElement, domain: string): void {
    // Domain-specific styling
    switch (domain) {
      case 'legal':
        element.style.fontSize = '1.1em';
        element.style.fontWeight = '500';
        break;
      case 'medical':
        element.style.fontSize = '1.05em';
        element.style.fontWeight = '400';
        element.style.letterSpacing = '0.01em';
        break;
      case 'educational':
        element.style.fontSize = '1.08em';
        element.style.lineHeight = '1.75';
        break;
      case 'business':
        element.style.fontSize = '1em';
        element.style.fontWeight = '450';
        break;
      case 'engineering':
        element.style.fontFamily = '"Cascadia Code", "Fira Code", ' + element.style.fontFamily;
        element.style.fontSize = '0.95em';
        break;
    }

    // Islamic typography principles
    element.style.textShadow = 'none'; // Avoid decorative shadows
    element.style.textTransform = 'none'; // Preserve original text case
  }

  /**
   * Setup font display observers for performance monitoring
   */
  private setupFontDisplayObservers(): void {
    if ('fonts' in document) {
      document.fonts.addEventListener('loadingdone', (event) => {
        console.log(`Loaded ${event.fontfaces.length} Arabic fonts`);
      });

      document.fonts.addEventListener('loadingerror', (event) => {
        console.error('Arabic font loading error:', event);
      });
    }
  }

  /**
   * Initialize cultural preferences for Iraqi users
   */
  private initializeCulturalPreferences(): void {
    // Set default Arabic text preferences
    const style = document.createElement('style');
    style.textContent = `
      /* Arabic text optimization */
      [lang="ar"], [dir="rtl"] {
        font-feature-settings: "kern" 1, "liga" 1, "clig" 1;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Mixed Arabic-English content */
      .mixed-content {
        unicode-bidi: plaintext;
        text-align: start;
      }
      
      /* Iraqi dialect styling */
      .iraqi-dialect {
        letter-spacing: 0.02em;
        word-spacing: 0.1em;
        line-height: 1.7;
      }
      
      /* Professional domain styles */
      .legal-arabic { font-family: "${this.buildFontStack('amiri')}" !important; }
      .medical-arabic { font-family: "${this.buildFontStack('notoArabic')}" !important; }
      .educational-arabic { font-family: "${this.buildFontStack('cairo')}" !important; }
      .business-arabic { font-family: "${this.buildFontStack('notoArabic')}" !important; }
      .engineering-arabic { font-family: "${this.buildFontStack('cairo')}" !important; }
    `;

    document.head.appendChild(style);
  }

  /**
   * Measure text rendering performance for optimization
   */
  measureTextPerformance(element: HTMLElement): {
    renderTime: number;
    fontLoadTime: number;
    layoutShift: number;
  } {
    const start = performance.now();

    // Force layout
    element.offsetHeight;

    const renderTime = performance.now() - start;

    return {
      renderTime,
      fontLoadTime: this.getFontLoadTime(),
      layoutShift: this.measureLayoutShift(element),
    };
  }

  private getFontLoadTime(): number {
    // Estimate based on loaded fonts
    return this.loadedFonts.size * 50; // ~50ms per font
  }

  private measureLayoutShift(element: HTMLElement): number {
    // Simple layout shift measurement
    const rect = element.getBoundingClientRect();
    return rect.width > 0 ? 0 : 1; // 0 = stable, 1 = shifted
  }
}

// Export singleton instance
export const arabicFontOptimizer = new ArabicFontOptimizer();

// Utility functions for React components
export const useArabicFont = (domain: string = 'general') => {
  const fontKey = DOMAIN_FONTS[domain] || 'cairo';
  return arabicFontOptimizer.buildFontStack
    ? arabicFontOptimizer['buildFontStack'](fontKey)
    : ARABIC_FONTS[fontKey]?.primary || 'Arial, sans-serif';
};

export const optimizeArabicText = (
  element: HTMLElement | null,
  options: Partial<TextRenderingOptions> = {}
) => {
  if (!element) return;

  const defaultOptions: TextRenderingOptions = {
    direction: 'auto',
    dialect: 'iraqi',
    domain: 'general',
    kerning: true,
    ligatures: true,
    optimization: 'balanced',
  };

  arabicFontOptimizer.optimizeTextRendering(element, {
    ...defaultOptions,
    ...options,
  });
};
