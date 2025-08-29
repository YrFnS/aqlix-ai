# Arabic Font System - Product Requirement Prompt

## Feature Overview
**Comprehensive Arabic typography foundation** for the Iraqi AI Chat System that provides optimal Arabic text rendering, font loading optimization, and typography hierarchy for Arabic content with seamless bilingual support.

## Technology Requirements
- **Runtime**: Bun package manager (30x faster than npm)
- **Framework**: Next.js 15+ with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with custom font configurations
- **Fonts**: Google Fonts Arabic integration with self-hosting optimization
- **Performance**: Font display strategies and loading optimization

---

## Context from Existing Codebase

### Current Font Pattern (examples/onlook-extracted/collaboration-engine/styles/collaboration.css)
```css
/* Import Arabic fonts */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* CSS Custom Properties for Typography */
:root {
  /* Arabic Typography */
  --font-arabic: 'Noto Sans Arabic', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-english: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Performance */
  --transition-fast: 0.15s ease;
  --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* RTL Support */
[dir="rtl"] .visual-collaboration-interface,
.visual-collaboration-interface[style*="direction: rtl"] {
  font-family: var(--font-arabic);
}
```

### Project Architecture Context
- **Tech Stack**: Next.js 15+ + Bun + Tailwind CSS v4 + TypeScript
- **Components**: 44 Iraqi-enhanced UI components available
- **Performance**: Focus on mobile optimization for Iraqi users
- **Cultural**: Support for Iraqi dialect and cultural requirements

---

## Critical Documentation References

### Font Selection & Research
- **Noto Sans Arabic**: Modern, clean Arabic font ideal for digital interfaces
  - Google Fonts: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic
  - Recommended weights: 300, 400, 500, 600, 700
- **Amiri**: Classical Arabic Naskh typeface for formal content
  - Google Fonts: https://fonts.google.com/specimen/Amiri
  - Best for: Traditional texts, formal documents

### Technical Documentation
- **Next.js Font Optimization**: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- **Google's Arabic Typography Modernization**: https://design.google/library/modernizing-arabic-typography-type-design
- **Font Display Strategies**: https://developer.mozilla.org/en-US/docs/Web/CSS/font-display

### Performance & Best Practices
- Google Fonts automatically optimizes for performance with self-hosting
- OpenType features enable advanced Arabic letterform rendering
- Variable fonts provide better performance than multiple font files

---

## Implementation Blueprint

### Phase 1: Font Configuration & Setup (Day 1)

#### Task 1.1: Install and Configure Next.js Fonts
```typescript
// lib/fonts.ts - Create font configuration
import { Noto_Sans_Arabic, Inter, Amiri } from 'next/font/google'

// Primary Arabic font - modern and clean
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-arabic-primary',
})

// Secondary Arabic font - classical and formal
export const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-arabic-formal',
})

// English font - matches Arabic font styling
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-english',
})

// Export font classes for global usage
export const fontVariables = `${notoSansArabic.variable} ${amiri.variable} ${inter.variable}`
```

#### Task 1.2: Configure Root Layout
```typescript
// app/layout.tsx - Apply fonts globally
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body className="font-arabic-primary">
        {children}
      </body>
    </html>
  )
}
```

### Phase 2: CSS Integration & Typography System (Day 1-2)

#### Task 2.1: Update Global CSS
```css
/* app/globals.css - Typography foundation */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Font families from Next.js variables */
    --font-arabic-primary: var(--font-arabic-primary);
    --font-arabic-formal: var(--font-arabic-formal);
    --font-english: var(--font-english);
    
    /* Typography scales optimized for Arabic */
    --text-xs-arabic: 0.875rem;  /* 14px - slightly larger for Arabic */
    --text-sm-arabic: 1rem;      /* 16px */
    --text-base-arabic: 1.125rem; /* 18px */
    --text-lg-arabic: 1.25rem;    /* 20px */
    --text-xl-arabic: 1.5rem;     /* 24px */
    
    /* Line heights for Arabic text */
    --leading-arabic: 1.7;        /* More generous for Arabic */
    --leading-arabic-tight: 1.5;
    --leading-arabic-loose: 1.8;
  }
  
  /* Base Arabic text styling */
  .arabic-text {
    font-family: var(--font-arabic-primary);
    line-height: var(--leading-arabic);
    direction: rtl;
    text-align: start;
  }
  
  /* Formal Arabic text (documents, contracts) */
  .arabic-formal {
    font-family: var(--font-arabic-formal);
    line-height: var(--leading-arabic-loose);
    direction: rtl;
  }
  
  /* English text within Arabic context */
  .english-text {
    font-family: var(--font-english);
    direction: ltr;
    display: inline-block;
  }
  
  /* Mixed content support */
  .mixed-content {
    font-family: var(--font-arabic-primary);
    direction: rtl;
    text-align: start;
  }
  
  .mixed-content .english-phrase {
    font-family: var(--font-english);
    direction: ltr;
    display: inline;
  }
}
```

#### Task 2.2: Configure Tailwind CSS
```javascript
// tailwind.config.js - Add Arabic font support
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'arabic-primary': ['var(--font-arabic-primary)'],
        'arabic-formal': ['var(--font-arabic-formal)'],
        'english': ['var(--font-english)'],
      },
      fontSize: {
        'xs-ar': ['var(--text-xs-arabic)', { lineHeight: 'var(--leading-arabic)' }],
        'sm-ar': ['var(--text-sm-arabic)', { lineHeight: 'var(--leading-arabic)' }],
        'base-ar': ['var(--text-base-arabic)', { lineHeight: 'var(--leading-arabic)' }],
        'lg-ar': ['var(--text-lg-arabic)', { lineHeight: 'var(--leading-arabic)' }],
        'xl-ar': ['var(--text-xl-arabic)', { lineHeight: 'var(--leading-arabic)' }],
      }
    },
  },
  plugins: [],
}
```

### Phase 3: Component Integration (Day 2-3)

#### Task 3.1: Create Typography Components
```typescript
// components/ui/Typography.tsx - Arabic typography components
import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'formal'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
}

export function ArabicText({ 
  children, 
  className, 
  variant = 'primary',
  size = 'base' 
}: TypographyProps) {
  const baseClasses = "arabic-text"
  const variantClasses = {
    primary: "font-arabic-primary",
    formal: "font-arabic-formal arabic-formal"
  }
  const sizeClasses = {
    xs: "text-xs-ar",
    sm: "text-sm-ar", 
    base: "text-base-ar",
    lg: "text-lg-ar",
    xl: "text-xl-ar"
  }
  
  return (
    <span className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  )
}

export function MixedText({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("mixed-content", className)}>
      {children}
    </div>
  )
}

export function EnglishPhrase({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("english-phrase font-english", className)}>
      {children}
    </span>
  )
}
```

#### Task 3.2: Update Existing Components
```typescript
// Update chat components to use new typography
// components/chat/MessageBubble.tsx
import { ArabicText, MixedText, EnglishPhrase } from '@/components/ui/Typography'

export function MessageBubble({ message, isArabic }: MessageBubbleProps) {
  return (
    <div className="message-bubble">
      {isArabic ? (
        <ArabicText size="base" className="text-gray-900">
          {message.content}
        </ArabicText>
      ) : (
        <div className="font-english text-base leading-relaxed">
          {message.content}
        </div>
      )}
    </div>
  )
}
```

### Phase 4: Performance Optimization & Testing (Day 3-4)

#### Task 4.1: Font Loading Optimization
```typescript
// app/head.tsx - Optimize font loading
export default function Head() {
  return (
    <>
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/NotoSansArabic-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload" 
        href="/fonts/Inter-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  )
}
```

#### Task 4.2: Performance Testing Setup
```typescript
// lib/performance.ts - Font loading performance utilities
export function measureFontLoadTime(fontFamily: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now()
    
    document.fonts.load(`1em ${fontFamily}`).then(() => {
      const loadTime = performance.now() - startTime
      resolve(loadTime)
    })
  })
}

export function validateArabicRendering(): boolean {
  // Create test element with Arabic text
  const testElement = document.createElement('div')
  testElement.style.fontFamily = 'var(--font-arabic-primary)'
  testElement.textContent = 'مرحباً بكم في النظام'
  testElement.style.position = 'absolute'
  testElement.style.visibility = 'hidden'
  
  document.body.appendChild(testElement)
  
  const computedStyle = window.getComputedStyle(testElement)
  const fontFamily = computedStyle.fontFamily
  
  document.body.removeChild(testElement)
  
  return fontFamily.includes('Noto Sans Arabic')
}
```

---

## Common Gotchas & Solutions

### 1. Font Loading Performance
**Problem**: Large Arabic font files slow page load
**Solution**: 
- Use Next.js font optimization for automatic self-hosting
- Implement `font-display: swap` for faster text rendering
- Preload only critical font weights (400, 500)

### 2. Browser Compatibility
**Problem**: Safari renders Arabic fonts differently than Chrome/Firefox
**Solution**:
- Test on multiple browsers during development
- Use consistent font fallback chains
- Include system Arabic fonts in fallback

### 3. Mixed Language Content
**Problem**: Arabic and English text alignment issues
**Solution**: 
```css
.mixed-content {
  direction: rtl; /* Default Arabic direction */
  text-align: start;
}

.mixed-content .english-phrase {
  direction: ltr;
  display: inline; /* Prevents line breaks */
  unicode-bidi: embed; /* Proper bidirectional text handling */
}
```

### 4. Tailwind CSS Integration
**Problem**: Custom font variables not working with Tailwind
**Solution**:
- Use CSS custom properties properly in config
- Extend theme rather than replacing defaults
- Test font classes after configuration

### 5. TypeScript Font Module Declarations
**Problem**: TypeScript errors with Next.js font imports
**Solution**: Create type declarations:
```typescript
// types/fonts.d.ts
declare module 'next/font/google' {
  export function Noto_Sans_Arabic(options: any): any
  export function Inter(options: any): any
  export function Amiri(options: any): any
}
```

---

## Validation Gates (Executable)

### Build & Development Validation
```bash
# 1. Clean install and build
bun install --frozen-lockfile
bun run build

# 2. Development server test
bun run dev
# Verify fonts load correctly on http://localhost:3000

# 3. Type checking
bun run typecheck

# 4. Linting
bun run lint

# 5. Font loading performance test
bun run test:performance
```

### Arabic Text Rendering Validation
```bash
# Test Arabic text display
echo "Testing Arabic font rendering..."

# Check font files are included in build
ls -la .next/static/fonts/ | grep -E "(NotoSansArabic|Inter)"

# Validate CSS variables are generated
grep -r "font-arabic-primary" .next/static/css/

# Performance audit
bun run lighthouse:audit
```

### Cross-Browser Testing
```bash
# Run Playwright tests for font rendering
bun run test:fonts:cross-browser

# Validate on different screen sizes
bun run test:responsive:fonts
```

### Manual Validation Checklist
- [ ] Arabic text renders with Noto Sans Arabic font
- [ ] English text uses Inter font in mixed content
- [ ] Font loading time < 2 seconds on 3G
- [ ] No FOUT (Flash of Unstyled Text) on page load
- [ ] Typography scales properly on mobile devices
- [ ] RTL direction works correctly with new fonts

---

## Integration Guidelines

### Iraqi-Enhanced Components Integration
The Arabic font system should integrate with the existing 44 Iraqi-enhanced components by:

1. **Component Updates**: Update components to use new typography components
2. **CSS Variable Migration**: Migrate from hardcoded fonts to CSS variables
3. **RTL Support**: Ensure all components support proper Arabic text rendering
4. **Performance**: Maintain component performance with optimized font loading

### Cultural Requirements
- **Font Selection**: Noto Sans Arabic chosen for modern, clean appearance preferred by Iraqi users
- **Formal Content**: Amiri font available for traditional/formal documents
- **Readability**: Typography scales optimized for Arabic text reading patterns
- **Performance**: Optimized for mobile-first Iraqi users

---

## Success Metrics

### Technical Performance
- Font loading time: < 1.5 seconds on 3G
- Cumulative Layout Shift (CLS): < 0.1
- First Contentful Paint with fonts: < 3 seconds
- Build size increase: < 200KB

### User Experience
- Arabic text readability score: > 95%
- Cross-browser consistency: 100%
- Mobile responsiveness: All viewports
- Accessibility compliance: WCAG 2.1 AA

---

## Implementation Confidence Score: 8.5/10

**Justification:**
- ✅ Comprehensive context from existing codebase patterns
- ✅ Detailed technical documentation and references
- ✅ Step-by-step implementation blueprint
- ✅ Executable validation gates with specific commands
- ✅ Common gotchas identified with solutions
- ✅ Integration with existing architecture covered
- ⚠️ Minor risk: Cross-browser testing complexity
- ⚠️ Minor risk: Performance optimization fine-tuning

**Risk Mitigation:**
- Use Next.js built-in font optimization for performance
- Follow established CSS patterns from existing codebase
- Implement comprehensive testing at each phase
- Use proven font choices (Noto Sans Arabic, Inter)

This PRP provides complete context for one-pass implementation of a comprehensive Arabic font system optimized for the Iraqi AI Chat System's technical architecture and user requirements.