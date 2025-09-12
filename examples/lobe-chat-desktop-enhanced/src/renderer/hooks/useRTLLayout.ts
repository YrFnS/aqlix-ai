/**
 * Iraqi AI Chat Desktop - RTL Layout Management Hook
 * Comprehensive RTL support with Arabic text processing
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Types
import type { 
  LanguageCode, 
  LanguageDirection, 
  TextAlignment,
  AppState 
} from '../types/app.types';

interface RTLConfig {
  direction: LanguageDirection;
  textAlign: TextAlignment;
  marginStart: string;
  marginEnd: string;
  paddingStart: string;
  paddingEnd: string;
  borderStart: string;
  borderEnd: string;
  floatStart: string;
  floatEnd: string;
}

interface UseRTLLayoutReturn {
  direction: LanguageDirection;
  isRTL: boolean;
  isLTR: boolean;
  textAlign: TextAlignment;
  config: RTLConfig;
  toggleDirection: () => void;
  setDirection: (direction: LanguageDirection) => void;
  getDirectionalValue: <T>(ltrValue: T, rtlValue: T) => T;
  getMarginStart: (value: string | number) => string;
  getMarginEnd: (value: string | number) => string;
  getPaddingStart: (value: string | number) => string;
  getPaddingEnd: (value: string | number) => string;
  getBorderStart: (style: string) => string;
  getBorderEnd: (style: string) => string;
  getFloatStart: () => string;
  getFloatEnd: () => string;
  formatMixedContent: (arabicText: string, englishText: string) => JSX.Element;
  detectTextDirection: (text: string) => LanguageDirection;
  isArabicText: (text: string) => boolean;
  processRTLText: (text: string) => {
    direction: LanguageDirection;
    align: TextAlignment;
    processed: string;
  };
}

// Arabic text detection regex
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]/;
const ARABIC_SENTENCE_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF\s]+/g;

// RTL languages
const RTL_LANGUAGES: LanguageCode[] = ['ar', 'ar-IQ', 'fa', 'he', 'ur'];

// Language direction mapping
const LANGUAGE_DIRECTIONS: Record<LanguageCode, LanguageDirection> = {
  'ar': 'rtl',
  'ar-IQ': 'rtl',
  'ar-SA': 'rtl',
  'ar-EG': 'rtl',
  'fa': 'rtl',
  'he': 'rtl',
  'ur': 'rtl',
  'en': 'ltr',
  'en-US': 'ltr',
  'en-GB': 'ltr',
  'fr': 'ltr',
  'de': 'ltr',
  'es': 'ltr',
  'tr': 'ltr',
  'ku': 'ltr' // Kurdish is LTR even in Iraq
};

/**
 * Custom hook for RTL layout management with Arabic text processing
 */
export const useRTLLayout = (language?: LanguageCode): UseRTLLayoutReturn => {
  const dispatch = useDispatch();
  
  // Get current language from Redux store
  const currentLanguage = useSelector((state: AppState) => state.app.language) || language || 'ar';
  
  // Determine direction based on language
  const direction = useMemo((): LanguageDirection => {
    return LANGUAGE_DIRECTIONS[currentLanguage as LanguageCode] || 'ltr';
  }, [currentLanguage]);
  
  const isRTL = direction === 'rtl';
  const isLTR = direction === 'ltr';
  
  // Text alignment based on direction
  const textAlign = useMemo((): TextAlignment => {
    return isRTL ? 'right' : 'left';
  }, [isRTL]);
  
  // RTL configuration object
  const config = useMemo((): RTLConfig => ({
    direction,
    textAlign,
    marginStart: isRTL ? 'margin-right' : 'margin-left',
    marginEnd: isRTL ? 'margin-left' : 'margin-right',
    paddingStart: isRTL ? 'padding-right' : 'padding-left',
    paddingEnd: isRTL ? 'padding-left' : 'padding-right',
    borderStart: isRTL ? 'border-right' : 'border-left',
    borderEnd: isRTL ? 'border-left' : 'border-right',
    floatStart: isRTL ? 'right' : 'left',
    floatEnd: isRTL ? 'left' : 'right'
  }), [direction, isRTL, textAlign]);
  
  // Update document direction when direction changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = currentLanguage;
    
    // Update CSS custom property for direction-aware styles
    document.documentElement.style.setProperty('--text-direction', direction);
    document.documentElement.style.setProperty('--text-align-start', textAlign);
    document.documentElement.style.setProperty('--text-align-end', isRTL ? 'left' : 'right');
  }, [direction, currentLanguage, textAlign, isRTL]);
  
  // Toggle direction
  const toggleDirection = useCallback(() => {
    const newDirection: LanguageDirection = isRTL ? 'ltr' : 'rtl';
    const newLanguage: LanguageCode = newDirection === 'rtl' ? 'ar' : 'en';
    
    dispatch({
      type: 'SET_LANGUAGE',
      payload: newLanguage
    });
  }, [isRTL, dispatch]);
  
  // Set specific direction
  const setDirection = useCallback((newDirection: LanguageDirection) => {
    const newLanguage: LanguageCode = newDirection === 'rtl' ? 'ar' : 'en';
    
    dispatch({
      type: 'SET_LANGUAGE',
      payload: newLanguage
    });
  }, [dispatch]);
  
  // Get directional value helper
  const getDirectionalValue = useCallback(<T>(ltrValue: T, rtlValue: T): T => {
    return isRTL ? rtlValue : ltrValue;
  }, [isRTL]);
  
  // Margin helpers
  const getMarginStart = useCallback((value: string | number): string => {
    const val = typeof value === 'number' ? `${value}px` : value;
    return isRTL ? `margin-right: ${val}` : `margin-left: ${val}`;
  }, [isRTL]);
  
  const getMarginEnd = useCallback((value: string | number): string => {
    const val = typeof value === 'number' ? `${value}px` : value;
    return isRTL ? `margin-left: ${val}` : `margin-right: ${val}`;
  }, [isRTL]);
  
  // Padding helpers
  const getPaddingStart = useCallback((value: string | number): string => {
    const val = typeof value === 'number' ? `${value}px` : value;
    return isRTL ? `padding-right: ${val}` : `padding-left: ${val}`;
  }, [isRTL]);
  
  const getPaddingEnd = useCallback((value: string | number): string => {
    const val = typeof value === 'number' ? `${value}px` : value;
    return isRTL ? `padding-left: ${val}` : `padding-right: ${val}`;
  }, [isRTL]);
  
  // Border helpers
  const getBorderStart = useCallback((style: string): string => {
    return isRTL ? `border-right: ${style}` : `border-left: ${style}`;
  }, [isRTL]);
  
  const getBorderEnd = useCallback((style: string): string => {
    return isRTL ? `border-left: ${style}` : `border-right: ${style}`;
  }, [isRTL]);
  
  // Float helpers
  const getFloatStart = useCallback((): string => {
    return isRTL ? 'right' : 'left';
  }, [isRTL]);
  
  const getFloatEnd = useCallback((): string => {
    return isRTL ? 'left' : 'right';
  }, [isRTL]);
  
  // Arabic text detection
  const isArabicText = useCallback((text: string): boolean => {
    return ARABIC_REGEX.test(text);
  }, []);
  
  // Text direction detection
  const detectTextDirection = useCallback((text: string): LanguageDirection => {
    const arabicChars = (text.match(ARABIC_REGEX) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    
    // If more than 30% of characters are Arabic, consider it RTL
    if (totalChars > 0 && (arabicChars / totalChars) > 0.3) {
      return 'rtl';
    }
    
    return 'ltr';
  }, []);
  
  // Process RTL text
  const processRTLText = useCallback((text: string) => {
    const detectedDirection = detectTextDirection(text);
    const align: TextAlignment = detectedDirection === 'rtl' ? 'right' : 'left';
    
    return {
      direction: detectedDirection,
      align,
      processed: text.trim()
    };
  }, [detectTextDirection]);
  
  // Format mixed content (Arabic + English)
  const formatMixedContent = useCallback((arabicText: string, englishText: string): JSX.Element => {
    const arabicProcessed = processRTLText(arabicText);
    const englishProcessed = processRTLText(englishText);
    
    return (
      <div className="mixed-content">
        <span 
          className="arabic-content" 
          dir={arabicProcessed.direction}
          style={{ textAlign: arabicProcessed.align }}
        >
          {arabicProcessed.processed}
        </span>
        {arabicText && englishText && <span className="content-separator"> | </span>}
        <span 
          className="english-content"
          dir={englishProcessed.direction}
          style={{ textAlign: englishProcessed.align }}
        >
          {englishProcessed.processed}
        </span>
      </div>
    );
  }, [processRTLText]);
  
  return {
    direction,
    isRTL,
    isLTR,
    textAlign,
    config,
    toggleDirection,
    setDirection,
    getDirectionalValue,
    getMarginStart,
    getMarginEnd,
    getPaddingStart,
    getPaddingEnd,
    getBorderStart,
    getBorderEnd,
    getFloatStart,
    getFloatEnd,
    formatMixedContent,
    detectTextDirection,
    isArabicText,
    processRTLText
  };
};

export default useRTLLayout;