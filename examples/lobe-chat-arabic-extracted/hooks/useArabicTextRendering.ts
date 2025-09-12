/**
 * Arabic Text Rendering Hook for Iraqi AI Chat System
 * 
 * Features:
 * - Real-time Arabic text optimization
 * - Iraqi dialect-aware rendering
 * - Performance monitoring and optimization
 * - Cultural font preferences
 * - Mixed Arabic-English content handling
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { arabicFontOptimizer, TextRenderingOptions, optimizeArabicText } from '../utils/arabicFontOptimizer';

export interface UseArabicTextRenderingOptions extends Partial<TextRenderingOptions> {
  autoOptimize?: boolean;
  performanceMonitoring?: boolean;
  culturalAdaptation?: boolean;
}

export interface TextRenderingMetrics {
  renderTime: number;
  fontLoadTime: number;
  layoutShift: number;
  optimizationApplied: boolean;
  detectedLanguage: 'arabic' | 'english' | 'mixed';
  detectedDialect: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard' | 'unknown';
}

/**
 * Hook for optimizing Arabic text rendering with Iraqi cultural enhancements
 */
export const useArabicTextRendering = (
  options: UseArabicTextRenderingOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const [metrics, setMetrics] = useState<TextRenderingMetrics | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  
  const {
    autoOptimize = true,
    performanceMonitoring = false,
    culturalAdaptation = true,
    direction = 'auto',
    dialect = 'iraqi',
    domain = 'general',
    kerning = true,
    ligatures = true,
    optimization = 'balanced'
  } = options;
  
  /**
   * Optimize Arabic text rendering for the current element
   */
  const optimizeRendering = useCallback(async () => {
    if (!elementRef.current) return;
    
    const startTime = performance.now();
    
    try {
      // Apply Arabic text optimization
      optimizeArabicText(elementRef.current, {
        direction,
        dialect,
        domain,
        kerning,
        ligatures,
        optimization
      });
      
      // Apply cultural adaptations if enabled
      if (culturalAdaptation) {
        applyCulturalAdaptations(elementRef.current, dialect, domain);
      }
      
      setIsOptimized(true);
      
      // Performance monitoring
      if (performanceMonitoring) {
        const renderTime = performance.now() - startTime;
        const textMetrics = analyzeTextContent(elementRef.current);
        
        setMetrics({
          renderTime,
          fontLoadTime: await getFontLoadTime(),
          layoutShift: measureLayoutShift(elementRef.current),
          optimizationApplied: true,
          detectedLanguage: textMetrics.language,
          detectedDialect: textMetrics.dialect
        });
      }
      
    } catch (error) {
      console.error('Arabic text optimization failed:', error);
      setIsOptimized(false);
    }
  }, [direction, dialect, domain, kerning, ligatures, optimization, culturalAdaptation, performanceMonitoring]);
  
  /**
   * Detect and analyze text content for optimization
   */
  const analyzeTextContent = useCallback((element: HTMLElement): {
    language: 'arabic' | 'english' | 'mixed';
    dialect: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard' | 'unknown';
  } => {
    const text = element.textContent || '';
    
    // Language detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
    const arabicMatches = text.match(arabicRegex) || [];
    const arabicRatio = arabicMatches.length / text.replace(/\s/g, '').length;
    
    let language: 'arabic' | 'english' | 'mixed';
    if (arabicRatio > 0.8) {
      language = 'arabic';
    } else if (arabicRatio > 0.2) {
      language = 'mixed';
    } else {
      language = 'english';
    }
    
    // Iraqi dialect detection
    const dialectKeywords = {
      iraqi: ['شلونك', 'شكو ماكو', 'زين', 'بالله', 'وياك'],
      baghdad: ['شوكت', 'وين', 'چان', 'دالحين', 'شفيك'],
      basra: ['شلونكم', 'قاعد', 'گاع', 'دامرگاع', 'چاي'],
      mosul: ['شلون', 'أشلون', 'چوا', 'شوني', 'أزكور']
    };
    
    let detectedDialect: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard' | 'unknown' = 'unknown';
    let maxMatches = 0;
    
    for (const [dialectName, keywords] of Object.entries(dialectKeywords)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedDialect = dialectName as any;
      }
    }
    
    if (detectedDialect === 'unknown' && language === 'arabic') {
      detectedDialect = 'standard';
    }
    
    return { language, dialect: detectedDialect };
  }, []);
  
  /**
   * Apply cultural adaptations for Iraqi users
   */
  const applyCulturalAdaptations = useCallback((
    element: HTMLElement,
    currentDialect: string,
    currentDomain: string
  ) => {
    // Add cultural classes
    element.classList.add('arabic-optimized');
    element.classList.add(`dialect-${currentDialect}`);
    element.classList.add(`domain-${currentDomain}`);
    
    // Apply Islamic typography principles
    element.style.setProperty('--text-decoration', 'none');
    element.style.setProperty('--text-shadow', 'none');
    
    // Iraqi-specific spacing adjustments
    if (currentDialect === 'iraqi') {
      element.style.setProperty('--letter-spacing', '0.02em');
      element.style.setProperty('--word-spacing', '0.1em');
    }
    
    // Professional domain adjustments
    switch (currentDomain) {
      case 'legal':
        element.style.setProperty('--font-weight', '500');
        element.style.setProperty('--color', 'var(--legal-text-color, #2c3e50)');
        break;
      case 'medical':
        element.style.setProperty('--font-weight', '400');
        element.style.setProperty('--color', 'var(--medical-text-color, #27ae60)');
        break;
      case 'educational':
        element.style.setProperty('--line-height', '1.75');
        element.style.setProperty('--color', 'var(--educational-text-color, #3498db)');
        break;
      case 'business':
        element.style.setProperty('--font-weight', '450');
        element.style.setProperty('--color', 'var(--business-text-color, #34495e)');
        break;
      case 'engineering':
        element.style.setProperty('--font-family', 'var(--mono-font), var(--arabic-font)');
        element.style.setProperty('--color', 'var(--engineering-text-color, #7f8c8d)');
        break;
    }
  }, []);
  
  /**
   * Measure layout shift for performance optimization
   */
  const measureLayoutShift = useCallback((element: HTMLElement): number => {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);
    
    // Check if font is properly loaded
    const fontFamily = computedStyle.fontFamily;
    const isFallbackFont = fontFamily.includes('Arial') || fontFamily.includes('sans-serif');
    
    return isFallbackFont ? 0.1 : 0; // Small shift if using fallback
  }, []);
  
  /**
   * Get font load time estimation
   */
  const getFontLoadTime = useCallback(async (): Promise<number> => {
    if (!('fonts' in document)) return 0;
    
    const loadStart = performance.now();
    await document.fonts.ready;
    return performance.now() - loadStart;
  }, []);
  
  /**
   * Force re-optimization of text rendering
   */
  const reoptimize = useCallback(() => {
    setIsOptimized(false);
    if (autoOptimize) {
      optimizeRendering();
    }
  }, [autoOptimize, optimizeRendering]);
  
  /**
   * Check if Arabic fonts are loaded
   */
  const checkFontStatus = useCallback(async () => {
    if (!('fonts' in document)) {
      setFontLoaded(true);
      return;
    }
    
    try {
      await document.fonts.ready;
      setFontLoaded(true);
    } catch (error) {
      console.warn('Font loading check failed:', error);
      setFontLoaded(true); // Assume loaded to prevent blocking
    }
  }, []);
  
  // Effect for automatic optimization
  useEffect(() => {
    if (autoOptimize && elementRef.current && !isOptimized) {
      optimizeRendering();
    }
  }, [autoOptimize, optimizeRendering, isOptimized]);
  
  // Effect for font loading detection
  useEffect(() => {
    checkFontStatus();
  }, [checkFontStatus]);
  
  // Effect for resize observer (re-optimize on layout changes)
  useEffect(() => {
    if (!elementRef.current || !autoOptimize) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (isOptimized) {
        reoptimize();
      }
    });
    
    resizeObserver.observe(elementRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [autoOptimize, isOptimized, reoptimize]);
  
  return {
    elementRef,
    optimizeRendering,
    reoptimize,
    isOptimized,
    fontLoaded,
    metrics,
    analyzeTextContent: (element?: HTMLElement) => 
      analyzeTextContent(element || elementRef.current!),
  };
};

/**
 * Hook for Arabic text measurement and analysis
 */
export const useArabicTextMeasurement = () => {
  const measureText = useCallback((
    text: string,
    style: Partial<CSSStyleDeclaration> = {}
  ): {
    width: number;
    height: number;
    direction: 'ltr' | 'rtl';
    complexity: number;
  } => {
    // Create temporary element for measurement
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    
    // Apply provided styles
    Object.assign(temp.style, style);
    
    temp.textContent = text;
    document.body.appendChild(temp);
    
    const rect = temp.getBoundingClientRect();
    const direction = getComputedStyle(temp).direction as 'ltr' | 'rtl';
    
    // Calculate text complexity (Arabic characters, mixed content, etc.)
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
    const arabicChars = (text.match(arabicRegex) || []).length;
    const totalChars = text.length;
    const complexity = arabicChars / totalChars;
    
    document.body.removeChild(temp);
    
    return {
      width: rect.width,
      height: rect.height,
      direction,
      complexity
    };
  }, []);
  
  return { measureText };
};

/**
 * Hook for Arabic font preloading
 */
export const useArabicFontPreloader = (fonts: string[] = ['cairo', 'notoArabic']) => {
  const [loadingStatus, setLoadingStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  
  const preloadFonts = useCallback(async () => {
    const status: Record<string, 'loading' | 'loaded' | 'error'> = {};
    
    for (const font of fonts) {
      status[font] = 'loading';
      setLoadingStatus(prev => ({ ...prev, [font]: 'loading' }));
      
      try {
        await arabicFontOptimizer.loadArabicFont(font);
        status[font] = 'loaded';
        setLoadingStatus(prev => ({ ...prev, [font]: 'loaded' }));
      } catch (error) {
        status[font] = 'error';
        setLoadingStatus(prev => ({ ...prev, [font]: 'error' }));
      }
    }
    
    return status;
  }, [fonts]);
  
  useEffect(() => {
    preloadFonts();
  }, [preloadFonts]);
  
  const isAllLoaded = Object.values(loadingStatus).every(status => status === 'loaded');
  const isLoading = Object.values(loadingStatus).some(status => status === 'loading');
  
  return {
    loadingStatus,
    isAllLoaded,
    isLoading,
    preloadFonts
  };
};