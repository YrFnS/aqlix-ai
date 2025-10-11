/**
 * RTL (Right-to-Left) Layout Types
 *
 * Type definitions for RTL layout system supporting Arabic text direction,
 * Iraqi dialect preferences, and bidirectional content handling.
 *
 * @module rtl
 */

/**
 * Text direction for layout rendering
 * - 'rtl': Right-to-left (Arabic, Hebrew)
 * - 'ltr': Left-to-right (English, most languages)
 * - 'auto': Automatic detection from text content
 */
export type TextDirection = 'rtl' | 'ltr' | 'auto';

/**
 * Supported language locales for Iraqi AI Chat System
 * - 'ar-IQ': Arabic (Iraq) - Primary locale for Iraqi users
 * - 'en-US': English (United States) - Secondary locale
 * - 'ar-SA': Arabic (Saudi Arabia) - Standard Arabic reference
 */
export type LanguageLocale = 'ar-IQ' | 'en-US' | 'ar-SA';

/**
 * Iraqi Arabic dialect variants
 * - 'baghdad': Baghdad dialect (شلونك، شكو ماكو)
 * - 'basra': Basra dialect (شلونكم، هسة)
 * - 'mosul': Mosul dialect (شلون حالك، كيفك)
 * - 'kurdish': Kurdish-influenced Arabic
 * - 'standard': Modern Standard Arabic (MSA)
 */
export type IraqiDialect = 'baghdad' | 'basra' | 'mosul' | 'kurdish' | 'standard';

/**
 * RTL configuration for the application
 */
export interface RTLConfig {
  /** Current language locale */
  locale: LanguageLocale;

  /** Text direction for layout */
  direction: TextDirection;

  /** Preferred Iraqi dialect for content */
  dialectPreference: IraqiDialect;

  /** Layout-specific preferences */
  layoutPreferences: {
    /** Text alignment preference */
    textAlignment: 'auto' | 'right' | 'left';

    /** Navigation direction (menu, tabs, etc.) */
    navigationDirection: 'rtl' | 'ltr';

    /** Content flow direction */
    contentFlow: 'natural' | 'forced-rtl' | 'forced-ltr';
  };
}

/**
 * Direction context for React components
 * Provides RTL state and utilities throughout the component tree
 */
export interface DirectionContext {
  /** Current RTL configuration */
  config: RTLConfig;

  /** Whether current direction is RTL */
  isRTL: boolean;

  /** Whether current language is Arabic */
  isArabic: boolean;

  /** Toggle between RTL and LTR directions */
  toggleDirection: () => void;

  /** Set locale and auto-update direction */
  setLocale: (locale: LanguageLocale) => void;

  /** Get text direction from content */
  getTextDirection: (text?: string) => TextDirection;
}

/**
 * Text segment with direction metadata
 * Used for bidirectional content rendering
 */
export interface DirectionalTextSegment {
  /** Text content */
  content: string;

  /** Direction of this text segment */
  direction: TextDirection;

  /** Start position in original text */
  start?: number;

  /** End position in original text */
  end?: number;
}

/**
 * RTL-aware positioning
 */
export interface RTLPosition {
  /** Inline start position (right in RTL, left in LTR) */
  inlineStart?: number | string;

  /** Inline end position (left in RTL, right in LTR) */
  inlineEnd?: number | string;

  /** Block start position (top) */
  blockStart?: number | string;

  /** Block end position (bottom) */
  blockEnd?: number | string;
}

/**
 * RTL-aware spacing
 */
export interface RTLSpacing {
  /** Margin inline start */
  marginInlineStart?: number | string;

  /** Margin inline end */
  marginInlineEnd?: number | string;

  /** Padding inline start */
  paddingInlineStart?: number | string;

  /** Padding inline end */
  paddingInlineEnd?: number | string;
}
