/**
 * Unit Tests for RTL Utilities
 *
 * Tests for Arabic text detection, Iraqi dialect recognition,
 * direction detection, and mixed content formatting.
 */

import { describe, expect, test } from 'bun:test';
import {
  isArabicText,
  getTextDirection,
  detectIraqiDialect,
  formatMixedContent,
  getLocaleDirection,
  getDirectionClasses,
  isRTLLocale,
  getOppositeDirection,
  normalizeDirection,
} from '../../src/lib/utils/rtl';

describe('RTL Utilities', () => {
  describe('isArabicText', () => {
    test('detects Arabic characters', () => {
      expect(isArabicText('مرحبا')).toBe(true);
      expect(isArabicText('السلام عليكم')).toBe(true);
      expect(isArabicText('شلونك؟')).toBe(true);
    });

    test('returns false for English text', () => {
      expect(isArabicText('Hello')).toBe(false);
      expect(isArabicText('Welcome')).toBe(false);
    });

    test('detects Arabic in mixed content', () => {
      expect(isArabicText('مرحبا Hello')).toBe(true);
      expect(isArabicText('Hello مرحبا')).toBe(true);
    });

    test('handles empty strings', () => {
      expect(isArabicText('')).toBe(false);
    });
  });

  describe('getTextDirection', () => {
    test('returns rtl for Arabic text', () => {
      expect(getTextDirection('مرحبا بكم')).toBe('rtl');
      expect(getTextDirection('شلونك اليوم؟')).toBe('rtl');
    });

    test('returns ltr for English text', () => {
      expect(getTextDirection('Hello World')).toBe('ltr');
      expect(getTextDirection('Welcome')).toBe('ltr');
    });

    test('returns rtl for mixed content with Arabic', () => {
      expect(getTextDirection('مرحبا Hello')).toBe('rtl');
    });
  });

  describe('detectIraqiDialect', () => {
    test('identifies Baghdad dialect', () => {
      expect(detectIraqiDialect('شلونك اليوم؟')).toBe('baghdad');
      expect(detectIraqiDialect('شكو ماكو؟')).toBe('baghdad');
      expect(detectIraqiDialect('وين رايح؟')).toBe('baghdad');
      expect(detectIraqiDialect('شسوي هسة؟')).toBe('baghdad');
    });

    test('identifies Basra dialect', () => {
      expect(detectIraqiDialect('شلونكم هسة؟')).toBe('basra');
      expect(detectIraqiDialect('وين ماشي؟')).toBe('basra');
      expect(detectIraqiDialect('يمعود شنهو؟')).toBe('basra');
    });

    test('identifies Mosul dialect', () => {
      expect(detectIraqiDialect('شلون حالك؟')).toBe('mosul');
      expect(detectIraqiDialect('كيفك اليوم؟')).toBe('mosul');
    });

    test('identifies Kurdish-influenced Arabic', () => {
      expect(detectIraqiDialect('چاي گرم')).toBe('kurdish');
    });

    test('defaults to standard Arabic', () => {
      expect(detectIraqiDialect('كيف حالك؟')).toBe('standard');
      expect(detectIraqiDialect('مرحبا')).toBe('standard');
    });
  });

  describe('formatMixedContent', () => {
    test('segments Arabic and English correctly', () => {
      const result = formatMixedContent('مرحبا Hello العالم World');
      // Whitespace is captured separately, so expect more segments
      expect(result.length).toBeGreaterThanOrEqual(4);
      expect(result[0].direction).toBe('rtl');
      expect(result[0].content).toContain('مرحبا');
      // Find English segments
      const englishSegments = result.filter(s => s.direction === 'ltr');
      expect(englishSegments.length).toBeGreaterThanOrEqual(2);
    });

    test('handles pure Arabic text', () => {
      const result = formatMixedContent('مرحبا بكم في العراق');
      // All segments should be RTL
      const rtlSegments = result.filter(s => s.direction === 'rtl');
      expect(rtlSegments.length).toBeGreaterThan(0);
      expect(result.every(s => s.direction === 'rtl' || s.content.trim() === '')).toBe(true);
    });

    test('handles pure English text', () => {
      const result = formatMixedContent('Hello World Welcome');
      expect(result).toHaveLength(1);
      expect(result[0].direction).toBe('ltr');
    });

    test('includes position metadata', () => {
      const result = formatMixedContent('مرحبا Hello');
      expect(result[0].start).toBe(0);
      expect(result[0].end).toBeGreaterThan(0);
    });
  });

  describe('getLocaleDirection', () => {
    test('returns rtl for Arabic locales', () => {
      expect(getLocaleDirection('ar-IQ')).toBe('rtl');
      expect(getLocaleDirection('ar-SA')).toBe('rtl');
      expect(getLocaleDirection('ar')).toBe('rtl');
    });

    test('returns ltr for English locales', () => {
      expect(getLocaleDirection('en-US')).toBe('ltr');
      expect(getLocaleDirection('en-GB')).toBe('ltr');
      expect(getLocaleDirection('en')).toBe('ltr');
    });

    test('returns rtl for other RTL languages', () => {
      expect(getLocaleDirection('he-IL')).toBe('rtl');
      expect(getLocaleDirection('fa-IR')).toBe('rtl');
    });
  });

  describe('getDirectionClasses', () => {
    test('generates RTL classes', () => {
      const classes = getDirectionClasses('rtl');
      expect(classes).toContain('rtl');
      expect(classes).toContain('text-right');
    });

    test('generates LTR classes', () => {
      const classes = getDirectionClasses('ltr');
      expect(classes).toContain('ltr');
      expect(classes).toContain('text-left');
    });

    test('includes base classes', () => {
      const classes = getDirectionClasses('rtl', 'font-arabic p-4');
      expect(classes).toContain('font-arabic');
      expect(classes).toContain('p-4');
      expect(classes).toContain('rtl');
    });
  });

  describe('isRTLLocale', () => {
    test('returns true for Arabic locales', () => {
      expect(isRTLLocale('ar-IQ')).toBe(true);
      expect(isRTLLocale('ar-SA')).toBe(true);
    });

    test('returns false for English locales', () => {
      expect(isRTLLocale('en-US')).toBe(false);
    });
  });

  describe('getOppositeDirection', () => {
    test('returns ltr for rtl', () => {
      expect(getOppositeDirection('rtl')).toBe('ltr');
    });

    test('returns rtl for ltr', () => {
      expect(getOppositeDirection('ltr')).toBe('rtl');
    });

    test('returns auto for auto', () => {
      expect(getOppositeDirection('auto')).toBe('auto');
    });
  });

  describe('normalizeDirection', () => {
    test('returns rtl for rtl', () => {
      expect(normalizeDirection('rtl')).toBe('rtl');
    });

    test('returns ltr for ltr', () => {
      expect(normalizeDirection('ltr')).toBe('ltr');
    });

    test('converts auto to ltr when no text provided', () => {
      expect(normalizeDirection('auto')).toBe('ltr');
    });

    test('converts auto based on text content', () => {
      expect(normalizeDirection('auto', 'مرحبا')).toBe('rtl');
      expect(normalizeDirection('auto', 'Hello')).toBe('ltr');
    });
  });
});
