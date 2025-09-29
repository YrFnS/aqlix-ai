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

## Recent UI/UX Decisions

- Date: 2025-08-01 - Established comprehensive UI/UX knowledge base for Iraqi context
- Decision: Implement consistent design patterns across all Iraqi agents
- Pattern: RTL-first approach with cultural color and typography preferences
- Integration: Link UI/UX decisions to cultural validation for consistency
