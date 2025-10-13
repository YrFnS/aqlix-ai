# UI/UX Decisions Knowledge Base

## RTL-First Design Decisions

### Proven RTL Layout Patterns

```css
/* Iraqi-optimized RTL container */
.iraqi-container {
  direction: rtl;
  text-align: right;
  font-family: "Noto Sans Arabic", "Cairo", system-ui;
}

/* Navigation patterns for RTL */
.rtl-navigation {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

/* Form layouts for Arabic */
.arabic-form {
  direction: rtl;
  text-align: right;
}
.arabic-form input[type="text"],
.arabic-form textarea {
  text-align: right;
  direction: rtl;
}
```

### Color Scheme Decisions

#### **Primary Iraqi Color Palette**

- **Primary Green**: #2E8B57 (Islamic significance, trust)
- **Secondary Blue**: #1E40AF (Professional, reliability)
- **Accent Gold**: #D4AF37 (Prosperity, premium features)
- **Success Green**: #059669 (Confirmations, success states)
- **Warning Amber**: #D97706 (Cautions, important notices)
- **Error Red**: #DC2626 (Errors, but used sparingly)

#### **Cultural Color Guidelines**

- **Avoid**: Excessive red (conflict associations)
- **Preferred**: Earth tones, blues, greens
- **Special**: Gold for premium features (cultural prestige)

### Typography Decisions

#### **Arabic Typography Hierarchy**

```css
/* Display - Hero headlines */
.arabic-display {
  font-size: 2.25rem; /* 36px */
  line-height: 2.5rem; /* 40px */
  font-family: "Noto Sans Arabic", "Cairo";
  font-weight: 700;
}

/* H1 - Page titles */
.arabic-h1 {
  font-size: 1.875rem; /* 30px */
  line-height: 2.25rem; /* 36px */
  font-weight: 600;
}

/* Body - Default text */
.arabic-body {
  font-size: 1rem; /* 16px */
  line-height: 1.5rem; /* 24px */
  font-weight: 400;
}
```

#### **Mixed Content Typography**

- **Arabic-English Mixing**: Use `unicode-bidi: plaintext`
- **Professional Terms**: Allow English technical terms in Arabic context
- **Number Display**: Arabic-Indic numerals for Arabic content, Western numerals for English

### Component Design Decisions

#### **Button Patterns**

```css
/* Iraqi-optimized button */
.iraqi-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  direction: rtl;
}

/* Hover states for cultural appropriateness */
.iraqi-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### **Form Design Patterns**

- **Label Position**: Above inputs for RTL layouts
- **Input Direction**: RTL for Arabic content, LTR for email/URLs
- **Validation**: Gentle, supportive error messages
- **Cultural Sensitivity**: Consider privacy concerns for personal information

### Navigation Design Decisions

#### **RTL Navigation Patterns**

```css
/* Main navigation for RTL */
.rtl-nav {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 1rem 1.5rem;
}

/* Breadcrumb for RTL */
.rtl-breadcrumb {
  direction: rtl;
  display: flex;
  align-items: center;
}
.rtl-breadcrumb::before {
  content: "◄"; /* RTL arrow */
  margin: 0 0.5rem;
}
```

#### **Menu Structures**

- **Hamburger Menu**: Right-side for RTL layouts
- **Tab Navigation**: Right-to-left tab order
- **Dropdown Menus**: Align to right side of trigger

### Mobile-First Decisions

#### **Iraqi Mobile Usage Patterns**

- **Screen Sizes**: Optimize for 375px-414px width
- **Touch Targets**: Minimum 44px for Arabic text buttons
- **Thumb Reach**: Important actions in bottom-right for RTL
- **Network Consideration**: Optimize for variable connectivity

#### **Responsive Breakpoints**

```css
/* Iraqi-optimized breakpoints */
@media (max-width: 640px) {
  /* Mobile */
}
@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet */
}
@media (min-width: 1025px) {
  /* Desktop */
}
```

### Accessibility Decisions

#### **Arabic Screen Reader Support**

- **ARIA Labels**: Provide Arabic ARIA labels for all interactive elements
- **Reading Order**: Ensure logical RTL reading order
- **Language Attributes**: Proper `lang="ar"` and `lang="en"` switching
- **Voice Control**: Consider Arabic voice commands

#### **Cultural Accessibility**

- **Family Sharing**: Design for shared device usage
- **Elder Users**: Larger text options, simple navigation
- **Low Vision**: High contrast ratios for Arabic text

### User Experience Flow Decisions

#### **Iraqi User Journey Patterns**

1. **Trust Building**: Clear security indicators, cultural authenticity
2. **Relationship Phase**: Personal greeting, cultural acknowledgment
3. **Service Phase**: Efficient, respectful service delivery
4. **Confirmation Phase**: Clear confirmation with cultural appropriateness

#### **Payment UX Patterns**

```javascript
// Iraqi payment flow optimization
const iraqiPaymentFlow = {
  step1: "Gateway selection with cultural preferences",
  step2: "Amount display in IQD with cultural number formatting",
  step3: "Security confirmation with Islamic blessing",
  step4: "Success confirmation with traditional thanks",
};
```

### Animation and Interaction Decisions

#### **Cultural Motion Patterns**

- **Subtle Animations**: Gentle, respectful motion
- **Loading States**: Patient, informative loading experiences
- **Transitions**: Smooth, professional transitions
- **Feedback**: Clear, immediate feedback for all actions

#### **Micro-Interaction Guidelines**

```css
/* Respectful hover effects */
.interactive-element:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

/* Loading animations for Iraqi context */
.iraqi-loading {
  animation: gentle-pulse 2s infinite;
}
```

## Language Switching Accessibility Patterns (2025-10-13)

### WCAG 2.1 AA Compliance Requirements

**Validated Component**: LanguageSwitcher + LanguageProvider
**Compliance Score**: 88/100 (B+ Grade)
**Status**: NEEDS IMPROVEMENT - 4 Critical Failures

#### Proven Accessible Patterns

```tsx
// ✅ GOOD: Comprehensive ARIA attributes
<button
  aria-label="Select language"
  aria-expanded={isOpen}
  aria-haspopup="menu"
  id="language-menu"
>
  <Languages className="w-5 h-5" aria-hidden="true" />
</button>

// ✅ GOOD: Proper menu structure
<div
  role="menu"
  aria-orientation="vertical"
  aria-labelledby="language-menu"
>
  <button
    role="menuitem"
    aria-current={isSelected ? "true" : undefined}
  >
    {option.nativeLabel}
  </button>
</div>

// ✅ GOOD: Document language synchronization
useEffect(() => {
  document.documentElement.lang = config.locale;
}, [config.locale]);

// ✅ GOOD: Escape key support
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus(); // Add focus restoration
    }
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [isOpen]);
```

#### Critical Accessibility Failures (Must Fix)

```tsx
// ❌ CRITICAL: Missing arrow key navigation (WCAG 2.1.1)
// REQUIRED IMPLEMENTATION:
const handleKeyDown = (e: KeyboardEvent) => {
  const items = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'));
  const currentIndex = items.indexOf(document.activeElement);

  switch (e.key) {
    case "ArrowDown":
      // In RTL: move to previous item; in LTR: move to next item
      focusIndex(isRTL ? currentIndex - 1 : currentIndex + 1);
      break;
    case "ArrowUp":
      // In RTL: move to next item; in LTR: move to previous item
      focusIndex(isRTL ? currentIndex + 1 : currentIndex - 1);
      break;
    case "Home":
      // In RTL: rightmost (first); in LTR: leftmost (first)
      focusIndex(isRTL ? items.length - 1 : 0);
      break;
    case "End":
      // In RTL: leftmost (last); in LTR: rightmost (last)
      focusIndex(isRTL ? 0 : items.length - 1);
      break;
    case "Enter":
    case " ":
      (document.activeElement as HTMLButtonElement)?.click();
      break;
  }
};

// ❌ CRITICAL: Missing live region announcements (WCAG 4.1.3)
// REQUIRED IMPLEMENTATION:
const [announcement, setAnnouncement] = useState("");

useEffect(() => {
  if (previousLocale && previousLocale !== locale) {
    setAnnouncement(
      locale === "ar-IQ"
        ? `تم تغيير اللغة إلى ${getLanguageDisplayName(locale)}`
        : `Language changed to ${getLanguageDisplayName(locale)}`
    );
  }
}, [locale]);

// Add to component JSX:
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  lang={locale}
  className="sr-only"
>
  {announcement}
</div>

// ❌ CRITICAL: Missing focus trap (WCAG 2.1.2)
// REQUIRED IMPLEMENTATION:
import { useFocusTrap } from "@/hooks/useFocusTrap";

const menuRef = useRef<HTMLDivElement>(null);
useFocusTrap(menuRef, isOpen);

// ❌ CRITICAL: Missing focus restoration (WCAG 2.4.3)
// REQUIRED IMPLEMENTATION:
const triggerRef = useRef<HTMLButtonElement>(null);

const handleLanguageSelect = (newLocale: LanguageLocale) => {
  setLanguage(newLocale);
  setIsOpen(false);
  // Restore focus to trigger
  triggerRef.current?.focus();
};
```

#### Recommended Accessibility Enhancements

```tsx
// ⚠️ ENHANCEMENT: Locale-aware ARIA labels
const getAriaLabel = () => {
  switch (locale) {
    case "ar-IQ":
    case "ar-SA":
      return "اختر اللغة";
    default:
      return "Select language";
  }
};

// ⚠️ ENHANCEMENT: Inline lang attributes for Arabic text
<span lang="ar-IQ" className="font-arabic">
  {option.nativeLabel}
</span>;

// ⚠️ ENHANCEMENT: Custom focus indicators with Iraqi colors
className = {
  `
  focus:outline-none
  focus:ring-2
  focus:ring-[#2E8B57]
  focus:ring-offset-2
  focus-visible:ring-2
`;
};

// ⚠️ ENHANCEMENT: Touch targets for Iraqi mobile users
className = {
  `
  ${isMobile ? "px-4 py-3 min-h-[48px]" : "px-3 py-2"}
  ${elderMode ? "text-lg px-6 py-4" : "text-sm"}
`;
};

// ⚠️ ENHANCEMENT: Network-aware animations
const isSlowConnection =
  navigator.connection?.effectiveType === "2g" ||
  navigator.connection?.effectiveType === "slow-2g";

const motionVariants = isSlowConnection
  ? {}
  : { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } };
```

#### Iraqi Cultural Accessibility Requirements

```tsx
// RTL Keyboard Navigation (Cultural Requirement)
// Right arrow = previous item in RTL
// Left arrow = next item in RTL
// Home = rightmost (first) item in RTL
// End = leftmost (last) item in RTL

// Elder-Friendly Text Sizes
const textSizeClasses = {
  default: "text-sm", // 14px (current - too small)
  recommended: "text-base", // 16px minimum
  elderMode: "text-lg", // 18px optimal for elderly users
};

// Arabic Voice Commands (Future Enhancement)
const voiceCommands = {
  "ar-IQ": [
    "فتح قائمة اللغات", // Open language menu
    "اللغة الإنجليزية", // Switch to English
    "اللغة العربية", // Switch to Arabic
    "العربية العراقية", // Iraqi Arabic
    "العربية الفصحى", // Standard Arabic
  ],
};

// Prayer-Time Awareness (Islamic Principle)
// Queue language changes during active prayer notifications
const handleLanguageChange = (newLocale: LanguageLocale) => {
  if (isPrayerNotificationActive) {
    queueLanguageChange(newLocale);
  } else {
    setLanguage(newLocale);
  }
};
```

#### Accessibility Testing Checklist

**Automated Testing**:

- [ ] axe DevTools: No accessibility violations
- [ ] Keyboard navigation: Arrow keys, Enter, Space, Escape, Tab
- [ ] Focus management: Focus trap, focus restoration, visible focus
- [ ] ARIA attributes: Proper roles, labels, states
- [ ] Live regions: Status message announcements

**Manual Testing Required**:

- [ ] NVDA with Arabic voice: Proper pronunciation and announcements
- [ ] JAWS with Arabic TTS: Compatibility and clarity
- [ ] VoiceOver (iOS/macOS): Arabic support and navigation
- [ ] Touch targets: 44px minimum on real devices (375px-414px width)
- [ ] Color contrast: 4.5:1 ratio for all text/background combinations
- [ ] RTL keyboard navigation: Arrow key reversals work correctly
- [ ] Elder mode: Text readable at 18px, touch targets adequate

**Color Contrast Verification** (Use WebAIM Contrast Checker):

- Light mode selected: text-blue-600 (#2563eb) on bg-blue-50 (#eff6ff)
- Dark mode selected: text-blue-400 (#60a5fa) on bg-blue-900/20
- Light mode hover: text-gray-700 (#374151) on bg-gray-50 (#f9fafb)
- Dark mode hover: text-gray-300 (#d1d5db) on bg-gray-800 (#1f2937)

#### Accessibility Documentation

**Reference Files**:

- Full Audit: `apps/web/docs/LANGUAGE_SWITCHING_ACCESSIBILITY_AUDIT.md`
- Test Suite: `apps/web/tests/unit/language-switcher-accessibility.test.tsx`
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Patterns: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

**Priority Actions** (Before Production):

1. Implement arrow key navigation with RTL support (4 hours)
2. Add live region status messages (2 hours)
3. Implement focus trap and restoration (3 hours)
4. Add custom focus indicators (2 hours)
5. Conduct screen reader testing with Iraqi Arabic (4 hours)

**With these improvements**: System can achieve 95-100% WCAG 2.1 AA compliance

## Recent UI/UX Decisions

- Date: 2025-10-13 - Language Switching Accessibility Audit Complete
- Decision: Document critical accessibility failures and required improvements
- Pattern: Implement arrow key navigation, live regions, focus management for WCAG 2.1 AA
- Integration: Prioritize Iraqi cultural accessibility (RTL keyboards, Arabic screen readers, elder-friendly)
- Status: 88/100 (B+ Grade) - 4 critical fixes required before production

- Date: 2025-08-01 - Established comprehensive UI/UX knowledge base for Iraqi context
- Decision: Implement consistent design patterns across all Iraqi agents
- Pattern: RTL-first approach with cultural color and typography preferences
- Integration: Link UI/UX decisions to cultural validation for consistency
