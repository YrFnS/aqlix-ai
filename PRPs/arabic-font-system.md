name: "Arabic Font System - Iraqi AI Chat System"
description: |

## Goal

Implement a comprehensive Arabic font system for the Iraqi AI Chat System that provides optimal Arabic text rendering, font loading optimization, and typography hierarchy for Arabic content. This system will serve as the foundational typography infrastructure for all Arabic text display in the application.

**End State**: A production-ready Arabic font system with:
- Multiple Arabic fonts loaded via Next.js 15 font optimization
- Tailwind CSS classes for Arabic typography hierarchy
- Optimized font loading with proper fallback chains
- CSS custom properties for flexible font usage
- Performance-optimized with font-display strategies
- Cross-browser Arabic font rendering consistency

## Why

- **User Experience**: Iraqi users need high-quality Arabic text rendering that respects cultural typography preferences and ensures excellent readability
- **Performance**: Proper font optimization reduces load times and eliminates layout shift for users on mobile networks in Iraq
- **Integration**: Provides foundational typography system that all other components (chat, documents, payments) will build upon
- **Cultural Respect**: Proper Arabic typography demonstrates respect for Iraqi cultural preferences in digital reading experiences
- **Accessibility**: Well-configured Arabic fonts improve readability for all users, including those with visual impairments

## What

A beginner-friendly Arabic font system that configures Google Fonts Arabic fonts with Next.js optimization, extends Tailwind with Arabic typography utilities, and provides CSS custom properties for flexible Arabic text styling.

### Success Criteria

- [x] Google Fonts Arabic fonts (Noto Sans Arabic, Cairo, Amiri) loaded via next/font/google
- [x] Tailwind CSS extended with Arabic font families and typography utilities
- [x] CSS custom properties for Arabic font hierarchy (heading, body, mono)
- [x] Comprehensive font fallback chain for Arabic characters
- [x] Font-display strategy optimized for performance (swap recommended)
- [x] Arabic typography CSS classes (sizes, line heights, letter spacing)
- [x] No layout shift during font loading (adjustFontFallback configuration)
- [x] Fonts render correctly across Chrome, Firefox, Safari, Edge
- [x] Zero TypeScript errors in font configuration
- [x] Documentation for using Arabic font classes

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

- url: https://nextjs.org/docs/app/getting-started/fonts
  why: Official Next.js 15 font optimization guide - CRITICAL for understanding next/font/google API
  key_sections:
    - "Google Fonts" section for font loading
    - "Font Function Arguments" for configuration options
    - "Applying Fonts" for CSS variable usage

- url: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
  why: Understanding font-display values (swap, optional, block, fallback, auto)
  critical: "swap gives zero block period and infinite swap period - best for Arabic fonts"

- url: https://fonts.google.com/?subset=arabic
  why: Browse available Arabic fonts on Google Fonts
  fonts_to_use:
    - Noto Sans Arabic: Modern sans-serif, excellent for body text
    - Cairo: Contemporary clean design, great for headings
    - Amiri: Classical Naskh style, elegant for formal text

- url: https://developer.chrome.com/blog/font-display
  why: Performance implications of font-display strategies
  critical: "font-display: swap is very good for fast connections, optional for best performance"

- file: apps/web/src/app/layout.tsx
  why: Current root layout - where fonts will be configured
  current_state: Minimal setup, no fonts configured, uses Inter variable from Tailwind

- file: apps/web/tailwind.config.ts
  why: Tailwind configuration - needs Arabic font families added
  current_state: Has Inter font configured, needs Arabic font extension

- file: apps/web/src/app/globals.css
  why: Global CSS - where Arabic typography utilities will be added
  current_state: Has shadcn/ui setup, responsive utilities, no Arabic classes

- file: examples/lobe-chat-arabic-extracted/styles/arabic-typography.css
  why: EXCELLENT reference for Arabic typography patterns - comprehensive example
  patterns_to_follow:
    - CSS custom properties structure for font hierarchies
    - Arabic font size naming (text-xs-arabic, text-base-arabic)
    - Line height optimization (leading-normal-arabic: 1.6)
    - Letter spacing for Arabic (tracking-normal-arabic: 0em)
    - Dialect-specific font preferences
    - Professional domain fonts (legal, medical, educational)

- file: examples/ai-design-generation/src/ArabicTypographyAI.ts
  why: Reference for Arabic font database and selection logic
  patterns_to_extract:
    - Font metadata structure (readability, culturalScore, fileSize)
    - Font fallback chain logic
    - Arabic typography optimization patterns
    - Font characteristics (xHeight, letterSpacing, diacriticSupport)

- docfile: initials/11_arabic_font_system.md
  why: Original requirements specification
  scope_reminder: "ONLY font system, no RTL layout or text direction"
```

### Current Codebase Structure

```bash
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (modify here)
│   │   └── globals.css         # Global styles (add Arabic utilities)
│   ├── components/             # UI components (will use Arabic fonts)
│   ├── config/                 # Configuration
│   ├── hooks/                  # React hooks
│   └── types/                  # TypeScript types
├── tailwind.config.ts          # Tailwind config (extend with Arabic fonts)
└── package.json                # Dependencies

examples/
├── lobe-chat-arabic-extracted/
│   └── styles/
│       └── arabic-typography.css  # Reference implementation
└── ai-design-generation/
    └── src/
        └── ArabicTypographyAI.ts  # Font selection logic
```

### Desired Codebase Structure After Implementation

```bash
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # [MODIFIED] Import and configure Arabic fonts
│   │   └── globals.css         # [MODIFIED] Add Arabic typography utilities
│   ├── lib/                    # [NEW DIRECTORY]
│   │   └── fonts.ts            # [NEW] Arabic font configurations
│   └── styles/                 # [NEW DIRECTORY]
│       └── arabic-typography.css  # [NEW] Arabic typography classes
├── tailwind.config.ts          # [MODIFIED] Extend with Arabic font families
└── package.json                # [NO CHANGE] next/font included in Next.js

Documentation:
├── PRPs/
│   └── arabic-font-system.md   # This PRP
└── docs/                       # [NEW DIRECTORY]
    └── arabic-fonts-usage.md   # [NEW] Usage documentation
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Next.js 15 next/font/google quirks

// ❌ WRONG: Using multiple fonts without adjustFontFallback configuration
import { Noto_Sans_Arabic, Cairo } from 'next/font/google'
const notoSans = Noto_Sans_Arabic({ subsets: ['arabic'] })
const cairo = Cairo({ subsets: ['arabic'] })
// Problem: Both fonts generate automatic fallbacks that can conflict

// ✅ CORRECT: Disable adjustFontFallback for secondary fonts
import { Noto_Sans_Arabic, Cairo } from 'next/font/google'
const notoSans = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic-primary'
})
const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  adjustFontFallback: false,  // Disable for non-primary fonts
  variable: '--font-arabic-heading'
})

// CRITICAL: Subset specification is REQUIRED
// ❌ WRONG: Missing subsets
const notoSans = Noto_Sans_Arabic({ display: 'swap' })
// Warning: "Preload is enabled for font Noto Sans Arabic but no subsets were specified"

// ✅ CORRECT: Always specify Arabic subset
const notoSans = Noto_Sans_Arabic({
  subsets: ['arabic'],  // Required for preload
  display: 'swap'
})

// CRITICAL: Font weight arrays for variable fonts
// ❌ WRONG: Using weight array for non-variable fonts
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700']  // Cairo is variable, but don't specify array
})

// ✅ CORRECT: Variable fonts automatically include all weights
const cairo = Cairo({
  subsets: ['arabic'],
  // No weight needed - variable fonts include all weights
})

// For non-variable fonts like Amiri:
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],  // Amiri only has 400 and 700
  style: ['normal', 'italic']
})

// CRITICAL: CSS variable naming for Tailwind
// Pattern: --font-{purpose} for CSS variables
// Then use in Tailwind config as var(--font-{purpose})

// GOTCHA: Arabic typography line heights
// Arabic text needs 1.5-1.8 line height (higher than English 1.3-1.5)
// ✅ Set baseline: leading-relaxed (1.625) or leading-loose (2)
```

```css
/* CRITICAL: Tailwind CSS Arabic font configuration patterns */

/* ❌ WRONG: Direct font-family application without fallbacks */
.font-arabic {
  font-family: 'Noto Sans Arabic';
}

/* ✅ CORRECT: Comprehensive fallback chain */
.font-arabic {
  font-family: var(--font-arabic-primary), 'Noto Sans Arabic', 'Tahoma', 'Arial Unicode MS', sans-serif;
}

/* GOTCHA: Arabic letter spacing defaults
   - English typically uses positive letter-spacing
   - Arabic typically uses 0 or negative letter-spacing
   - But for readability, 0.5-1px (0.02-0.04em) can help at small sizes */

/* ❌ WRONG: Using English letter-spacing on Arabic */
.text-arabic {
  letter-spacing: 0.1em;  /* Too wide for Arabic */
}

/* ✅ CORRECT: Arabic-optimized letter spacing */
.text-arabic {
  letter-spacing: 0em;     /* Normal Arabic spacing */
}
.text-arabic-readable {
  letter-spacing: 0.02em;  /* Slight spacing for small sizes */
}

/* CRITICAL: Font feature settings for Arabic
   - Enable ligatures (liga) for proper character connection
   - Enable contextual alternates (calt) for contextual forms
   - Enable kerning (kern) for proper spacing */

.font-arabic {
  font-feature-settings:
    'liga' 1,  /* Enable ligatures */
    'calt' 1,  /* Enable contextual alternates */
    'kern' 1;  /* Enable kerning */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

```typescript
// PERFORMANCE GOTCHA: font-display strategy trade-offs

// font-display: swap
// - Best for Arabic fonts on fast connections
// - Zero block period = instant fallback display
// - Infinite swap period = font replaces fallback whenever it loads
// - ⚠️ Can cause layout shift if fallback and webfont have different metrics
// - ✅ Recommended for Iraqi AI Chat System (most users on 4G+)

// font-display: optional
// - Best performance, zero layout shift
// - 100ms block period, zero swap period
// - If font doesn't load in 100ms, fallback used permanently
// - ⚠️ Users might never see custom font on slow connections
// - ❌ Not recommended for Iraqi AI Chat (cultural font preference important)

// font-display: fallback
// - Compromise between swap and optional
// - 100ms block period, 3s swap period
// - If font loads within 3s, swap occurs; otherwise fallback permanent
// - ⚠️ Can still cause layout shift in the 3s window
// - ⚠️ Not ideal for Arabic where custom fonts are culturally important
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// apps/web/src/lib/fonts.ts
// Core font configurations for Arabic typography system

import {
  Noto_Sans_Arabic,
  Cairo,
  Amiri,
  Inter  // Keep existing English font
} from 'next/font/google'

// PRIMARY Arabic font: Noto Sans Arabic
// Modern sans-serif, excellent readability, comprehensive Arabic support
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',  // Best for Iraqi users on 4G+ connections
  variable: '--font-arabic-primary',
  // No weight needed - Noto Sans Arabic is variable font
  preload: true,  // Preload for performance
})

// HEADING Arabic font: Cairo
// Contemporary clean design, great for headings and titles
export const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  adjustFontFallback: false,  // Disable to avoid conflict with primary font
  variable: '--font-arabic-heading',
  preload: true,
})

// FORMAL Arabic font: Amiri
// Classical Naskh style for elegant formal text
export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],  // Amiri only has these weights
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-arabic-formal',
  preload: false,  // Load on-demand for formal content
})

// English font (existing)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Font metadata for documentation
export const arabicFontMetadata = {
  primary: {
    name: 'Noto Sans Arabic',
    purpose: 'Body text, chat messages, general content',
    characteristics: 'Modern, highly readable, comprehensive Arabic support',
    fallback: 'Tahoma, Arial Unicode MS, sans-serif'
  },
  heading: {
    name: 'Cairo',
    purpose: 'Headings, titles, navigation',
    characteristics: 'Contemporary, clean lines, excellent for display',
    fallback: 'Noto Sans Arabic, Tahoma, sans-serif'
  },
  formal: {
    name: 'Amiri',
    purpose: 'Formal documents, legal text, traditional content',
    characteristics: 'Classical Naskh, elegant, culturally appropriate',
    fallback: 'Noto Sans Arabic, Tahoma, serif'
  }
}
```

### Task Implementation Order

```yaml
Task 1: Create Arabic Font Configuration
  DESCRIPTION: Set up Next.js font configurations in new lib/fonts.ts
  CREATES: apps/web/src/lib/fonts.ts
  PATTERN: Import Google Fonts via next/font/google with proper configuration
  CRITICAL_DETAILS:
    - Use display: 'swap' for optimal performance
    - Set adjustFontFallback: false for secondary fonts
    - Specify subsets: ['arabic'] to avoid warnings
    - Use CSS variable names for Tailwind integration
  VALIDATION:
    - No TypeScript errors in font imports
    - All fonts have required configuration properties
    - CSS variables follow naming convention (--font-*)

Task 2: Update Root Layout with Fonts
  DESCRIPTION: Import and apply Arabic fonts in layout.tsx
  MODIFIES: apps/web/src/app/layout.tsx
  PATTERN: Import font objects and apply via className
  DEPENDENCIES: Task 1 (requires fonts.ts)
  CRITICAL_DETAILS:
    - Import all font objects from lib/fonts
    - Apply CSS variables to <html> element
    - Keep existing English font (Inter)
    - Update lang attribute to support bilingual content
  VALIDATION:
    - No TypeScript errors in layout
    - CSS variables available in dev tools
    - Fonts load in browser Network tab

Task 3: Extend Tailwind Config with Arabic Fonts
  DESCRIPTION: Add Arabic font families to Tailwind CSS configuration
  MODIFIES: apps/web/tailwind.config.ts
  PATTERN: Extend theme.fontFamily with CSS variables
  DEPENDENCIES: Task 1 (requires CSS variable names)
  CRITICAL_DETAILS:
    - Add 'arabic' font family with primary Arabic font
    - Add 'arabic-heading' with Cairo font
    - Add 'arabic-formal' with Amiri font
    - Maintain existing 'sans' family for English
    - Include proper fallback chains
  VALIDATION:
    - Tailwind build succeeds without errors
    - Font utilities available in editor autocomplete
    - Can apply font-arabic class to elements

Task 4: Create Arabic Typography CSS Utilities
  DESCRIPTION: Add comprehensive Arabic typography classes to globals.css
  MODIFIES: apps/web/src/app/globals.css
  PATTERN: Follow examples/lobe-chat-arabic-extracted/styles/arabic-typography.css patterns
  DEPENDENCIES: Task 2 (requires CSS variables in DOM)
  CRITICAL_DETAILS:
    - Define Arabic-specific font sizes (text-*-arabic)
    - Define Arabic line heights (leading-*-arabic)
    - Define Arabic letter spacing (tracking-*-arabic)
    - Add font feature settings for proper rendering
    - Include responsive typography for mobile
    - Add dark mode support
  VALIDATION:
    - All CSS compiles without errors
    - Classes apply correctly to test elements
    - No specificity conflicts with existing styles

Task 5: Create Comprehensive Font Fallback CSS
  DESCRIPTION: Define robust font fallback chains in CSS custom properties
  MODIFIES: apps/web/src/app/globals.css (extend existing :root)
  PATTERN: CSS custom properties for flexible font usage
  DEPENDENCIES: Task 2 (requires CSS variables from fonts)
  CRITICAL_DETAILS:
    - Primary fallback: Tahoma (excellent Arabic support on all platforms)
    - Secondary fallback: Arial Unicode MS (comprehensive Unicode)
    - Final fallback: sans-serif (system default)
    - Create properties for each font purpose (body, heading, formal)
  VALIDATION:
    - Fonts fallback correctly when primary disabled
    - Arabic characters render in all fallback scenarios
    - No broken characters or missing glyphs

Task 6: Add Font Feature Settings for Arabic
  DESCRIPTION: Configure OpenType features for proper Arabic rendering
  MODIFIES: apps/web/src/app/globals.css
  PATTERN: Use font-feature-settings CSS property
  CRITICAL_DETAILS:
    - Enable ligatures ('liga' 1) for character connection
    - Enable contextual alternates ('calt' 1) for context forms
    - Enable kerning ('kern' 1) for proper spacing
    - Add font-smoothing for better rendering
    - Apply to base .font-arabic class
  VALIDATION:
    - Arabic character connections render properly
    - Diacritics position correctly
    - Text rendering smooth and clear

Task 7: Create Usage Documentation
  DESCRIPTION: Document how to use Arabic font classes in components
  CREATES: docs/arabic-fonts-usage.md
  PATTERN: Clear examples with code snippets
  CRITICAL_DETAILS:
    - Usage examples for each font family
    - When to use each font (body vs heading vs formal)
    - Tailwind utility class reference
    - Common patterns (mixed Arabic-English)
    - Troubleshooting guide
  VALIDATION:
    - Documentation is clear and complete
    - All code examples are correct
    - Covers all font families and utilities

Task 8: Add Font Loading Tests
  DESCRIPTION: Create visual tests to verify font loading
  CREATES: apps/web/src/app/test-fonts/page.tsx (test page)
  PATTERN: Simple test page with all font variations
  CRITICAL_DETAILS:
    - Show each font family with Arabic text
    - Display different sizes and weights
    - Include mixed Arabic-English content
    - Show headings, body, and formal text
    - Add font family name labels for verification
  VALIDATION:
    - All fonts render correctly on test page
    - Font names match expected fonts in dev tools
    - No layout shift during font loading
```

### Task Pseudocode

```typescript
// Task 1: Create Arabic Font Configuration
// FILE: apps/web/src/lib/fonts.ts

// Import font loaders from Next.js
import { Noto_Sans_Arabic, Cairo, Amiri, Inter } from 'next/font/google'

// PRIMARY: Noto Sans Arabic for body text
// - Variable font (includes all weights automatically)
// - display: 'swap' for fast rendering with fallback
// - preload: true for immediate availability
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],  // REQUIRED to avoid warning
  display: 'swap',      // Best for Iraqi 4G+ connections
  variable: '--font-arabic-primary',
  preload: true
})

// HEADING: Cairo for titles and headings
// - Variable font
// - adjustFontFallback: false to avoid conflicts
export const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  adjustFontFallback: false,  // CRITICAL for multi-font setup
  variable: '--font-arabic-heading',
  preload: true
})

// FORMAL: Amiri for elegant formal content
// - NOT variable (specify weights explicitly)
// - preload: false (load on-demand)
export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],  // Only available weights
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-arabic-formal',
  preload: false  // On-demand loading
})

// Keep existing English font
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})
```

```typescript
// Task 2: Update Root Layout with Fonts
// FILE: apps/web/src/app/layout.tsx

import { notoSansArabic, cairo, amiri, inter } from '@/lib/fonts'
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"  // Changed from "en" to support Arabic as primary
      className={`
        ${notoSansArabic.variable}
        ${cairo.variable}
        ${amiri.variable}
        ${inter.variable}
      `}
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}

// PATTERN: Apply CSS variables to html element
// RESULT: All CSS variables (--font-*) available throughout app
// GOTCHA: Must apply to html, not body, for global availability
```

```typescript
// Task 3: Extend Tailwind Config with Arabic Fonts
// FILE: apps/web/tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  // ... existing config
  theme: {
    extend: {
      fontFamily: {
        // Arabic fonts
        arabic: [
          'var(--font-arabic-primary)',  // Noto Sans Arabic
          'Tahoma',                       // Excellent fallback for Arabic
          'Arial Unicode MS',             // Unicode support
          'sans-serif'                    // System default
        ],
        'arabic-heading': [
          'var(--font-arabic-heading)',   // Cairo
          'var(--font-arabic-primary)',   // Fallback to primary
          'Tahoma',
          'sans-serif'
        ],
        'arabic-formal': [
          'var(--font-arabic-formal)',    // Amiri
          'var(--font-arabic-primary)',   // Fallback to primary
          'Tahoma',
          'serif'                         // Serif fallback for formal
        ],
        // Keep existing
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      // ... rest of config
    }
  }
}

// USAGE in components: className="font-arabic"
// VALIDATION: Check autocomplete in editor shows font-arabic
```

```css
/* Task 4: Create Arabic Typography CSS Utilities */
/* FILE: apps/web/src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ... existing styles ... */

/* Arabic Typography System */
@layer base {
  :root {
    /* Arabic Font Families (from CSS variables) */
    --font-arabic-primary: var(--font-arabic-primary);  /* Noto Sans Arabic */
    --font-arabic-heading: var(--font-arabic-heading);  /* Cairo */
    --font-arabic-formal: var(--font-arabic-formal);    /* Amiri */

    /* Arabic-Optimized Font Sizes */
    /* Arabic text needs slightly larger sizes for readability */
    --text-xs-arabic: 0.875rem;   /* 14px */
    --text-sm-arabic: 1rem;        /* 16px - base for Arabic */
    --text-base-arabic: 1.125rem;  /* 18px - comfortable reading */
    --text-lg-arabic: 1.25rem;     /* 20px */
    --text-xl-arabic: 1.5rem;      /* 24px */
    --text-2xl-arabic: 1.875rem;   /* 30px */
    --text-3xl-arabic: 2.25rem;    /* 36px */

    /* Arabic-Optimized Line Heights */
    /* Arabic needs 1.5-1.8x font size for proper readability */
    --leading-tight-arabic: 1.4;
    --leading-snug-arabic: 1.5;
    --leading-normal-arabic: 1.6;   /* Default for body text */
    --leading-relaxed-arabic: 1.7;  /* Formal documents */
    --leading-loose-arabic: 1.8;    /* Educational content */

    /* Arabic Letter Spacing */
    /* 0em is standard, 0.02-0.04em helps readability at small sizes */
    --tracking-tighter-arabic: -0.02em;
    --tracking-tight-arabic: -0.01em;
    --tracking-normal-arabic: 0em;      /* Default for Arabic */
    --tracking-wide-arabic: 0.02em;     /* Small text readability */
    --tracking-wider-arabic: 0.04em;    /* Very small text */
  }
}

/* Base Arabic Font Class */
@layer base {
  .font-arabic {
    /* Font features for proper Arabic rendering */
    font-feature-settings:
      'liga' 1,  /* Ligatures for character connection */
      'calt' 1,  /* Contextual alternates for context forms */
      'kern' 1;  /* Kerning for proper spacing */

    /* Font smoothing for better rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* Text rendering optimization */
    text-rendering: optimizeLegibility;
  }
}

/* Arabic Typography Utilities */
@layer utilities {
  /* Arabic Text Sizes */
  .text-xs-arabic { font-size: var(--text-xs-arabic); }
  .text-sm-arabic { font-size: var(--text-sm-arabic); }
  .text-base-arabic { font-size: var(--text-base-arabic); }
  .text-lg-arabic { font-size: var(--text-lg-arabic); }
  .text-xl-arabic { font-size: var(--text-xl-arabic); }
  .text-2xl-arabic { font-size: var(--text-2xl-arabic); }
  .text-3xl-arabic { font-size: var(--text-3xl-arabic); }

  /* Arabic Line Heights */
  .leading-tight-arabic { line-height: var(--leading-tight-arabic); }
  .leading-snug-arabic { line-height: var(--leading-snug-arabic); }
  .leading-normal-arabic { line-height: var(--leading-normal-arabic); }
  .leading-relaxed-arabic { line-height: var(--leading-relaxed-arabic); }
  .leading-loose-arabic { line-height: var(--leading-loose-arabic); }

  /* Arabic Letter Spacing */
  .tracking-tighter-arabic { letter-spacing: var(--tracking-tighter-arabic); }
  .tracking-tight-arabic { letter-spacing: var(--tracking-tight-arabic); }
  .tracking-normal-arabic { letter-spacing: var(--tracking-normal-arabic); }
  .tracking-wide-arabic { letter-spacing: var(--tracking-wide-arabic); }
  .tracking-wider-arabic { letter-spacing: var(--tracking-wider-arabic); }
}

/* Responsive Arabic Typography */
@layer utilities {
  /* Mobile: Slightly smaller for screen real estate */
  @media (max-width: 768px) {
    :root {
      --text-base-arabic: 1rem;      /* 16px on mobile */
      --text-lg-arabic: 1.125rem;    /* 18px on mobile */
      --text-xl-arabic: 1.25rem;     /* 20px on mobile */
    }
  }

  /* Small mobile: Even more compact */
  @media (max-width: 480px) {
    :root {
      --text-base-arabic: 0.9375rem; /* 15px on small mobile */
      --leading-normal-arabic: 1.5;  /* Tighter for small screens */
    }
  }
}

/* Dark Mode Arabic Typography */
@layer utilities {
  .dark .font-arabic {
    /* Slightly adjust font smoothing for dark backgrounds */
    -webkit-font-smoothing: auto;
  }
}

/* Print Styles for Arabic */
@media print {
  .font-arabic {
    /* Use serif for printed Arabic documents */
    font-family: 'Times New Roman', serif;
    color: #000;
    background: #fff;
  }
}
```

```markdown
<!-- Task 7: Create Usage Documentation -->
<!-- FILE: docs/arabic-fonts-usage.md -->

# Arabic Fonts Usage Guide

## Overview

The Iraqi AI Chat System uses three Arabic fonts optimized for different purposes:

1. **Noto Sans Arabic** (Primary) - Body text, chat messages, general content
2. **Cairo** (Heading) - Headings, titles, navigation
3. **Amiri** (Formal) - Formal documents, legal text, traditional content

## Basic Usage

### Body Text (Noto Sans Arabic)

```tsx
// Default Arabic body text
<p className="font-arabic text-base-arabic leading-normal-arabic">
  مرحباً بكم في نظام الدردشة الذكي العراقي
</p>

// Arabic paragraph with optimal readability
<p className="font-arabic text-base-arabic leading-relaxed-arabic tracking-normal-arabic">
  هذا نص تجريبي لاختبار قراءة النصوص العربية بخط Noto Sans Arabic.
</p>
```

### Headings (Cairo)

```tsx
// Main heading
<h1 className="font-arabic-heading text-3xl-arabic leading-tight-arabic font-bold">
  عنوان رئيسي
</h1>

// Section heading
<h2 className="font-arabic-heading text-2xl-arabic leading-snug-arabic font-semibold">
  عنوان فرعي
</h2>
```

### Formal Text (Amiri)

```tsx
// Legal or formal document text
<div className="font-arabic-formal text-lg-arabic leading-relaxed-arabic">
  <p>نص رسمي أو قانوني يتطلب خط تقليدي أنيق</p>
</div>
```

## Font Size Scale

| Class | Size | Use Case |
|-------|------|----------|
| `text-xs-arabic` | 14px | Small labels, captions |
| `text-sm-arabic` | 16px | Secondary content |
| `text-base-arabic` | 18px | Body text (default) |
| `text-lg-arabic` | 20px | Emphasized text |
| `text-xl-arabic` | 24px | Small headings |
| `text-2xl-arabic` | 30px | Section headings |
| `text-3xl-arabic` | 36px | Page headings |

## Line Height Guide

| Class | Value | Use Case |
|-------|-------|----------|
| `leading-tight-arabic` | 1.4 | Headings, tight spaces |
| `leading-snug-arabic` | 1.5 | Compact content |
| `leading-normal-arabic` | 1.6 | Body text (default) |
| `leading-relaxed-arabic` | 1.7 | Formal documents |
| `leading-loose-arabic` | 1.8 | Educational content |

## Complete Examples

### Chat Message

```tsx
<div className="font-arabic text-base-arabic leading-normal-arabic tracking-normal-arabic">
  مرحباً! كيف يمكنني مساعدتك اليوم؟
</div>
```

### Document Title and Content

```tsx
<article>
  <h1 className="font-arabic-heading text-3xl-arabic leading-tight-arabic font-bold mb-4">
    دليل استخدام النظام
  </h1>

  <p className="font-arabic text-base-arabic leading-relaxed-arabic">
    هذا دليل شامل لاستخدام نظام الدردشة الذكي العراقي.
  </p>
</article>
```

### Mixed Arabic-English Content

```tsx
<div className="font-arabic text-base-arabic leading-normal-arabic">
  <span>البريد الإلكتروني: </span>
  <span className="font-sans">user@example.com</span>
</div>
```

## Troubleshooting

### Fonts not loading

1. Check browser DevTools → Network tab for font file requests
2. Verify CSS variables in Elements → Computed styles
3. Ensure Next.js dev server restarted after adding fonts

### Arabic text appears as squares

1. Verify `subsets: ['arabic']` in font configuration
2. Check fallback fonts include Tahoma or Arial Unicode MS
3. Clear browser cache and reload

### Layout shift on page load

1. Verify `display: 'swap'` in font configuration
2. Check `adjustFontFallback: false` on secondary fonts
3. Ensure fonts preloaded in layout.tsx

### Wrong font rendering

1. Check CSS variable names match between fonts.ts and tailwind.config.ts
2. Verify className applied correctly to html element
3. Inspect element in DevTools to see computed font-family
```

```tsx
// Task 8: Add Font Loading Tests
// FILE: apps/web/src/app/test-fonts/page.tsx

export default function TestFontsPage() {
  const arabicSample = "مرحباً بكم في نظام الدردشة الذكي العراقي"
  const formalSample = "بسم الله الرحمن الرحيم"

  return (
    <div className="container-responsive py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Arabic Fonts Test Page</h1>

      {/* Primary Font: Noto Sans Arabic */}
      <section className="border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          Primary Font: Noto Sans Arabic
        </h2>

        <div className="space-y-4">
          <p className="font-arabic text-xs-arabic">
            {arabicSample} (XS - 14px)
          </p>
          <p className="font-arabic text-sm-arabic">
            {arabicSample} (SM - 16px)
          </p>
          <p className="font-arabic text-base-arabic">
            {arabicSample} (Base - 18px)
          </p>
          <p className="font-arabic text-lg-arabic">
            {arabicSample} (LG - 20px)
          </p>
          <p className="font-arabic text-xl-arabic">
            {arabicSample} (XL - 24px)
          </p>
        </div>
      </section>

      {/* Heading Font: Cairo */}
      <section className="border-2 border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Heading Font: Cairo
        </h2>

        <div className="space-y-4">
          <h1 className="font-arabic-heading text-3xl-arabic leading-tight-arabic font-bold">
            عنوان رئيسي كبير
          </h1>
          <h2 className="font-arabic-heading text-2xl-arabic leading-snug-arabic font-semibold">
            عنوان فرعي متوسط
          </h2>
          <h3 className="font-arabic-heading text-xl-arabic font-medium">
            عنوان صغير
          </h3>
        </div>
      </section>

      {/* Formal Font: Amiri */}
      <section className="border-2 border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          Formal Font: Amiri
        </h2>

        <div className="space-y-4">
          <p className="font-arabic-formal text-lg-arabic leading-relaxed-arabic">
            {formalSample}
          </p>
          <p className="font-arabic-formal text-base-arabic leading-relaxed-arabic">
            نص رسمي بخط أميري الأنيق للوثائق القانونية والنصوص التقليدية
          </p>
        </div>
      </section>

      {/* Line Height Examples */}
      <section className="border-2 border-purple-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">
          Line Heights
        </h2>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tight (1.4)</p>
            <p className="font-arabic text-base-arabic leading-tight-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Normal (1.6)</p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Relaxed (1.7)</p>
            <p className="font-arabic text-base-arabic leading-relaxed-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>
        </div>
      </section>

      {/* Mixed Content */}
      <section className="border-2 border-orange-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-orange-600">
          Mixed Arabic-English Content
        </h2>

        <p className="font-arabic text-base-arabic leading-normal-arabic">
          <span>البريد الإلكتروني: </span>
          <span className="font-sans">user@example.com</span>
        </p>

        <p className="font-arabic text-base-arabic leading-normal-arabic mt-4">
          <span>تاريخ اليوم: </span>
          <span className="font-sans">{new Date().toLocaleDateString()}</span>
        </p>
      </section>
    </div>
  )
}
```

### Integration Points

```yaml
LAYOUT:
  - file: apps/web/src/app/layout.tsx
  - integration: Import fonts and apply CSS variables to html element
  - pattern: className={`${font1.variable} ${font2.variable}`}

TAILWIND:
  - file: apps/web/tailwind.config.ts
  - integration: Extend fontFamily with Arabic fonts
  - pattern: fontFamily: { arabic: ['var(--font-arabic)', ...fallbacks] }

GLOBAL_STYLES:
  - file: apps/web/src/app/globals.css
  - integration: Add Arabic typography utilities and custom properties
  - pattern: @layer utilities for Arabic-specific classes

COMPONENTS:
  - integration: Use font-arabic, font-arabic-heading, font-arabic-formal classes
  - pattern: className="font-arabic text-base-arabic leading-normal-arabic"
  - future: All chat, document, payment components will use these fonts
```

## Validation Loop

### Level 1: Syntax & Build

```bash
# Run these FIRST - fix any errors before proceeding

# TypeScript type checking
bun run typecheck
# Expected: No errors in fonts.ts, layout.tsx, tailwind.config.ts

# Tailwind CSS build
bun run build
# Expected: Successful build, no font-related warnings
# Check for: "Preload is enabled but no subsets specified" warning (should not appear)

# Start dev server
bun run dev
# Expected: Server starts, no font loading errors in console
```

### Level 2: Browser Validation

```bash
# Start dev server
bun run dev

# Open browser DevTools
# 1. Navigate to http://localhost:3000
# 2. Open DevTools → Elements → Computed styles
# 3. Verify CSS variables:
#    - --font-arabic-primary
#    - --font-arabic-heading
#    - --font-arabic-formal
#    Expected: All variables present with font family values

# 4. Network tab → Filter: Font
#    Expected:
#    - NotoSansArabic-Regular.woff2
#    - Cairo-Regular.woff2
#    - Amiri-Regular.woff2 (if formal content present)
#    Status: 200 OK
#    Loaded from: localhost (self-hosted by Next.js)

# 5. Navigate to /test-fonts
#    Expected:
#    - All three font sections render correctly
#    - Arabic text displays with proper fonts
#    - No layout shift during font loading
#    - Font names in DevTools match expected fonts
```

### Level 3: Cross-Browser Testing

```bash
# Test in multiple browsers

# Chrome/Edge:
# - Open http://localhost:3000/test-fonts
# - Check: All fonts render correctly
# - DevTools → Computed → font-family should show correct font

# Firefox:
# - Open http://localhost:3000/test-fonts
# - Check: Arabic ligatures render properly
# - Check: No font loading delay (font-display: swap works)

# Safari:
# - Open http://localhost:3000/test-fonts
# - Check: Font smoothing looks good
# - Check: No FOUC (flash of unstyled content)

# Expected Results:
# - All browsers: Fonts load within 500ms
# - All browsers: No layout shift during font loading
# - All browsers: Arabic text renders with proper character connections
# - All browsers: Fallback fonts work if custom fonts disabled
```

### Level 4: Performance Validation

```bash
# Lighthouse audit for font loading performance

# 1. Open Chrome DevTools
# 2. Navigate to Lighthouse tab
# 3. Select:
#    - Mode: Navigation
#    - Categories: Performance
#    - Device: Mobile (typical Iraqi user)
# 4. Run audit

# Expected Metrics:
# - First Contentful Paint (FCP): < 1.8s
# - Largest Contentful Paint (LCP): < 2.5s
# - Cumulative Layout Shift (CLS): < 0.1 (no layout shift from fonts)
# - Font Display: "Ensure text remains visible during webfont load" should pass

# If LCP > 2.5s or CLS > 0.1:
# - Check: Are fonts preloaded? (should be true for primary/heading)
# - Check: Is font-display set to 'swap'? (should be yes)
# - Check: Is adjustFontFallback configured correctly?
```

### Level 5: Accessibility Validation

```bash
# Screen reader testing with NVDA/JAWS

# 1. Enable screen reader
# 2. Navigate to http://localhost:3000/test-fonts
# 3. Tab through content

# Expected:
# - Arabic text read correctly (RTL order)
# - Font family changes don't affect reading order
# - All headings announced with proper hierarchy
# - No "loading" or "font loading" announcements

# High contrast mode test:
# 1. Windows: Enable High Contrast mode
# 2. Navigate to test page

# Expected:
# - Text remains readable in high contrast
# - Font families still render (not overridden by system)
# - Sufficient contrast maintained (4.5:1 minimum)
```

## Final Validation Checklist

- [ ] TypeScript compiles without errors: `bun run typecheck`
- [ ] Tailwind builds successfully: `bun run build`
- [ ] Dev server starts without warnings: `bun run dev`
- [ ] CSS variables present in browser DevTools
- [ ] Font files load from localhost (Network tab)
- [ ] Test page renders all three fonts correctly
- [ ] No layout shift during font loading (CLS < 0.1)
- [ ] Fonts work in Chrome, Firefox, Safari, Edge
- [ ] Lighthouse Performance score > 90
- [ ] "Ensure text remains visible" audit passes
- [ ] Arabic text renders with proper ligatures
- [ ] Fallback fonts work when custom fonts disabled
- [ ] Documentation complete and accurate
- [ ] Usage examples tested and verified

---

## Anti-Patterns to Avoid

### Font Configuration

```typescript
// ❌ DON'T: Load fonts without subset specification
const notoSans = Noto_Sans_Arabic({ display: 'swap' })
// Problem: Warning about preload without subsets

// ✅ DO: Always specify subsets
const notoSans = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap'
})
```

```typescript
// ❌ DON'T: Use multiple fonts without adjustFontFallback config
const font1 = Noto_Sans_Arabic({ subsets: ['arabic'] })
const font2 = Cairo({ subsets: ['arabic'] })
// Problem: Automatic fallback generation conflicts

// ✅ DO: Disable adjustFontFallback for non-primary fonts
const font1 = Noto_Sans_Arabic({ subsets: ['arabic'] })
const font2 = Cairo({
  subsets: ['arabic'],
  adjustFontFallback: false  // Disable for secondary
})
```

```typescript
// ❌ DON'T: Use font-display: optional for culturally important fonts
const notoSans = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'optional'  // Bad: Users might never see Arabic font
})

// ✅ DO: Use font-display: swap for Arabic fonts
const notoSans = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap'  // Good: Ensures font displays eventually
})
```

### CSS Configuration

```css
/* ❌ DON'T: Apply Arabic fonts without font feature settings */
.font-arabic {
  font-family: 'Noto Sans Arabic';
}

/* ✅ DO: Include font feature settings for proper rendering */
.font-arabic {
  font-family: 'Noto Sans Arabic';
  font-feature-settings: 'liga' 1, 'calt' 1, 'kern' 1;
  -webkit-font-smoothing: antialiased;
}
```

```css
/* ❌ DON'T: Use English line heights for Arabic text */
.arabic-text {
  line-height: 1.3;  /* Too tight for Arabic */
}

/* ✅ DO: Use Arabic-optimized line heights */
.arabic-text {
  line-height: 1.6;  /* Proper spacing for Arabic */
}
```

```css
/* ❌ DON'T: Forget fallback fonts */
.font-arabic {
  font-family: 'Noto Sans Arabic';
}

/* ✅ DO: Include comprehensive fallback chain */
.font-arabic {
  font-family: 'Noto Sans Arabic', 'Tahoma', 'Arial Unicode MS', sans-serif;
}
```

### Component Usage

```tsx
// ❌ DON'T: Mix font utilities inconsistently
<p className="font-arabic text-lg leading-tight">
  // Problem: English line-height on Arabic font
</p>

// ✅ DO: Use matching Arabic utilities
<p className="font-arabic text-lg-arabic leading-normal-arabic">
  // Good: Coordinated Arabic typography
</p>
```

```tsx
// ❌ DON'T: Apply Arabic fonts to English content
<p className="font-arabic">
  Hello World  // English text with Arabic font
</p>

// ✅ DO: Use appropriate fonts for each language
<p className="font-sans">
  Hello World
</p>
<p className="font-arabic">
  مرحبا بالعالم
</p>
```

---

## Success Metrics

**Technical Performance**:
- Font loading time < 500ms on 4G connections
- Cumulative Layout Shift (CLS) < 0.1
- First Contentful Paint (FCP) < 1.8s
- Zero TypeScript errors
- Zero build warnings

**Visual Quality**:
- Arabic character connections render properly (ligatures work)
- Diacritics positioned correctly above/below characters
- Consistent rendering across Chrome, Firefox, Safari, Edge
- No font rendering artifacts or antialiasing issues

**User Experience**:
- No visible font loading delay (font-display: swap works)
- No layout shift during font loading
- Fallback fonts work correctly when custom fonts disabled
- All fonts meet 4.5:1 contrast ratio for WCAG AA

**Developer Experience**:
- Clear documentation with working examples
- Easy-to-use Tailwind utility classes
- Consistent naming conventions
- Test page for visual verification

---

## PRP Confidence Score

**Score: 9/10** - Very High Confidence for One-Pass Implementation

**Strengths**:
1. ✅ **Complete Context**: Comprehensive research on Next.js 15 font optimization
2. ✅ **Clear Examples**: Detailed pseudocode with critical gotchas highlighted
3. ✅ **Proven Patterns**: Following successful patterns from examples/ directory
4. ✅ **Validation Gates**: Executable tests at every level (syntax, browser, performance)
5. ✅ **Documentation**: Official Next.js docs, MDN, and codebase examples referenced
6. ✅ **Task Sequencing**: Clear dependencies and order (fonts → layout → tailwind → CSS)
7. ✅ **Error Prevention**: Anti-patterns documented with explanations
8. ✅ **Beginner-Friendly**: Matches "Beginner" complexity level from initial

**Minor Risks** (-1 point):
- ⚠️ **First-time Setup**: Fonts haven't been configured before in this project
- ⚠️ **Browser Testing**: Need to verify across multiple browsers manually

**Mitigations**:
- Comprehensive test page (`/test-fonts`) for immediate visual verification
- Clear validation checklist with specific metrics to check
- Fallback strategies documented if primary approach fails
- Known gotchas section prevents common mistakes

**Expected Outcome**: AI agent should successfully implement Arabic font system in one pass with all validation gates passing. Test page will provide immediate visual confirmation of success. Minor adjustments may be needed for cross-browser rendering optimization, but core functionality will work correctly.
