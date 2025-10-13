name: "Language Switching System for Iraqi AI Chat System"
description: |

  ## Purpose

  Implement a dynamic language switching foundation that provides seamless Arabic-English language transitions
  with interface direction synchronization and bilingual user experience. This PRP focuses ONLY on the language
  switching mechanism, NOT on content translation or internationalization of features.

  ## Core Principles

  1. **Context is King**: Leverages existing DirectionProvider and RTL utilities
  2. **Validation Loops**: Comprehensive testing for language state management
  3. **Information Dense**: Builds on proven Next.js 15 + React 19 patterns
  4. **Progressive Success**: Start with core toggle, validate, then enhance
  5. **Global rules**: Follow all rules in CLAUDE.md (Iraqi cultural compliance, RTL first)

---

## Goal

Build a language switching system that allows users to toggle between Arabic (ar-IQ), English (en-US), and
Standard Arabic (ar-SA) with:

- **Language Context**: React context for global language state management
- **Toggle Component**: UI component for language switching controls
- **Preference Persistence**: Language preference storage in localStorage
- **Direction Sync**: Automatic direction switching when language changes
- **Smooth Transitions**: Animated language and direction changes using framer-motion
- **Interface Labels**: Basic interface text switching (NOT content translation)

## Why

- **User Experience**: Iraqi users need seamless Arabic-English switching without page reloads
- **Cultural Compliance**: Respect language preferences with Islamic-appropriate defaults
- **Professional Context**: Support bilingual Iraqi professionals who code-switch
- **Integration Foundation**: Enable future content translation and localization features
- **Accessibility**: Proper language attributes improve screen reader support

### Problems This Solves

- Manual browser language changes requiring page refreshes
- Inconsistent direction when switching between Arabic and English
- Lost language preferences across sessions
- Poor bilingual user experience in professional contexts

## What

### User-Visible Behavior

1. **Language Switcher Component**:
   - Dropdown or toggle button in the UI (top navigation)
   - Options: "العربية (العراق)" | "English" | "العربية (الفصحى)"
   - Visual feedback on selection (smooth transition)
   - Persists across page navigation

2. **Automatic Direction Sync**:
   - Switching to Arabic → Automatic RTL layout
   - Switching to English → Automatic LTR layout
   - Smooth layout transition animations

3. **Interface Label Switching**:
   - Basic UI elements switch language (buttons, labels, navigation)
   - NO content translation (chat messages, documents remain as-is)
   - Scope: ~20-30 core interface labels only

4. **Preference Persistence**:
   - Language preference stored in localStorage
   - Auto-restore on page refresh
   - Browser language detection on first visit

### Technical Requirements

- Separate LanguageContext from DirectionContext (performance optimization)
- Two-way integration: Language changes trigger direction updates
- Type-safe language codes using existing `@iraqi-ai/types`
- Server-side rendering compatible (Next.js 15 App Router)
- Zero hydration mismatches

### Success Criteria

- [ ] Language toggle switches between ar-IQ, en-US, ar-SA correctly
- [ ] Direction automatically updates when language changes (ar → RTL, en → LTR)
- [ ] Language preference persists across browser sessions
- [ ] Interface labels update without page refresh
- [ ] Smooth animations during language/direction transitions (no flash)
- [ ] No console errors or hydration warnings
- [ ] All tests pass (unit + e2e)
- [ ] Works in Chrome, Firefox, Safari, Edge

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core patterns and libraries

- url: https://react.dev/learn/passing-data-deeply-with-context
  why: React Context API best practices for global state
  critical: Avoid over-nesting, use context composition, prevent unnecessary re-renders

- url: https://www.developerway.com/posts/react-state-management-2025
  why: 2025 best practices for React state management
  critical: Create multiple contexts for related data, not one giant context

- url: https://nextjs.org/docs/app/guides/internationalization
  why: Next.js 15 internationalization patterns
  critical: Server-side rendering considerations, no middleware approach for simple toggle

- url: https://www.framer.com/motion/
  why: Framer Motion animation library (already in package.json)
  critical: Use AnimatePresence for smooth transitions, MotionConfig for global settings

- file: apps/web/src/components/providers/DirectionProvider.tsx
  why: Existing direction management pattern to mirror
  critical: |
    - Uses localStorage key "iraqi-rtl-config"
    - Provides toggleDirection() and setLocale() methods
    - Integrates with Radix UI DirectionProvider
    - SSR-safe with typeof window checks
    - Document dir/lang attribute sync via useEffect

- file: apps/web/src/lib/utils/rtl.ts
  why: Existing RTL utilities for text direction detection
  critical: |
    - isArabicText() - Detects Arabic Unicode characters
    - getTextDirection() - Returns 'rtl' or 'ltr' based on text
    - getLocaleDirection() - Gets direction from locale using Intl.Locale API
    - detectIraqiDialect() - Detects Baghdad, Basra, Mosul, Kurdish dialects

- file: packages/types/src/rtl.ts
  why: Type definitions for RTL/language system
  critical: |
    - LanguageLocale = "ar-IQ" | "en-US" | "ar-SA"
    - TextDirection = "rtl" | "ltr" | "auto"
    - IraqiDialect = "baghdad" | "basra" | "mosul" | "kurdish" | "standard"
    - DirectionContext interface with toggleDirection, setLocale methods

- file: apps/web/tests/unit/direction-provider-integration.test.tsx
  why: Testing pattern to follow for LanguageProvider
  critical: |
    - Uses @testing-library/react with Bun test runner
    - Tests localStorage persistence with beforeEach cleanup
    - Tests context value accessibility with custom test components
    - Tests document attribute sync with waitFor
    - Uses act() for state updates

- file: examples/roo-code-extracted/i18n-system/iraqi_i18n_manager.py
  why: Iraqi i18n patterns from reference implementation
  critical: |
    - LocalizationContext with dialect, domain, gender_context
    - Translation fallback chain: dialect+domain → standard+domain → standard+general
    - Cultural formatting for dates, times, currency, phone numbers
    - Iraqi dialect detection patterns (شلونك، شكو ماكو، etc.)

- docfile: CLAUDE.md (lines 1-56)
  why: Iraqi AI system rules and cultural compliance requirements
  critical: |
    - ALWAYS use specialized Iraqi AI agents for cultural validation
    - 95%+ cultural appropriateness required
    - Islamic values compliance mandatory
    - Political neutrality for sectarian/tribal topics
    - Iraqi dialect + Standard Arabic + English language support
    - WCAG 2.1 AA accessibility compliance minimum
