# Responsive Layout System for Iraqi AI Chat System

name: "Responsive Layout Foundation PRP - Mobile-First Design Infrastructure"
description: |

## Purpose
Implement a comprehensive responsive layout foundation for the Iraqi AI Chat System using mobile-first design principles, Tailwind CSS responsive utilities, and modern CSS Grid/Flexbox patterns optimized for Iraqi users primarily accessing via mobile devices.

## Core Principles
1. **Mobile-First Priority**: Start with mobile design, progressively enhance for larger screens
2. **Performance Focused**: Optimized for varying network conditions common in Iraq
3. **Touch-Friendly**: Design for touch interactions and gestures
4. **Iraqi Context**: Consider right-to-left (RTL) layout preparation for future Arabic implementation
5. **Accessibility**: WCAG 2.1 AA compliance across all breakpoints

---

## Goal
Create a responsive layout foundation that provides optimal user experience across mobile (320-768px), tablet (768-1024px), and desktop (1024px+) devices with mobile-first design principles, preparing the groundwork for all future components and layouts in the Iraqi AI Chat System.

## Why
- **Mobile-First Priority**: 70%+ of Iraqi users access digital services via mobile devices
- **Network Optimization**: Efficient responsive design for slower network connections common in Iraq
- **Foundation Building**: Essential infrastructure for all future UI components and layouts
- **Touch Experience**: Optimized interactions for mobile and tablet users
- **Future RTL Support**: Responsive patterns that will work seamlessly with Arabic RTL layouts

## What
Mobile-first responsive layout system including:
- Tailwind CSS configuration with Iraqi-optimized breakpoints
- Responsive grid and flexbox patterns
- Mobile-first component structure
- Image optimization setup for Next.js
- Responsive typography and spacing systems
- Touch-friendly interaction patterns

### Success Criteria
- [ ] Mobile-first Tailwind configuration active with custom breakpoints
- [ ] Responsive components render correctly on mobile (320px+), tablet (768px+), and desktop (1024px+)
- [ ] Touch-friendly buttons and interactions (48px minimum touch targets)
- [ ] Image optimization setup working with WebP/AVIF support
- [ ] Responsive typography scaling properly across all breakpoints
- [ ] Performance: Page loads <3 seconds on 3G networks
- [ ] Accessibility: All responsive layouts meet WCAG 2.1 AA compliance

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://tailwindcss.com/docs/responsive-design
  why: Mobile-first breakpoint system, responsive utility patterns, 2025 best practices
  
- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
  why: CSS Grid responsive patterns, mobile-to-desktop layout transitions
  
- url: https://nextjs.org/docs/app/getting-started/images
  why: Next.js image optimization, WebP/AVIF support, responsive images
  
- file: examples/dyad-extracted/components/ui/navigation-menu.tsx
  why: Existing responsive patterns (md:absolute, md:w-auto), reference implementation
  
- file: examples/dyad-extracted/components/ui/button.tsx
  why: Component variant patterns, size scaling approach to follow
  
- file: PRPs/nextjs-app-setup.md
  why: Planned Tailwind setup structure and configuration approach
  
- file: PRPs/ui-component-system.md
  why: UI architecture patterns, Arabic RTL preparation approach
```

### Current Codebase Structure
```bash
aqlix-ai/
├── examples/
│   └── dyad-extracted/
│       ├── components/
│       │   └── ui/              # 44+ UI components (existing patterns)
│       └── components.json      # Tailwind config reference
├── PRPs/                        # Planned implementation patterns
├── initials/                    # Feature requirements
└── CLAUDE.md                   # Project configuration rules

# CURRENT STATE: No root package.json, no Tailwind config yet
# BUT: Rich UI component library exists with some responsive patterns
```

### Desired Codebase Structure 
```bash
aqlix-ai/
├── package.json                 # Root workspace (to be created)
├── apps/
│   └── web/
│       ├── package.json        # Next.js + Tailwind dependencies
│       ├── tailwind.config.ts  # Mobile-first responsive config
│       ├── next.config.js      # Image optimization config
│       ├── app/
│       │   ├── globals.css     # Tailwind base + responsive utilities
│       │   └── components/
│       │       ├── layout/
│       │       │   ├── responsive-container.tsx    # Mobile-first containers
│       │       │   ├── responsive-grid.tsx         # CSS Grid patterns
│       │       │   └── mobile-navigation.tsx       # Mobile navigation
│       │       └── ui/
│       │           ├── responsive-card.tsx         # Mobile-optimized cards
│       │           └── responsive-image.tsx        # Next.js image wrapper
│       └── public/
│           └── images/         # Test images for responsive optimization
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Tailwind uses mobile-first breakpoints
// sm: means "at small breakpoint and above" (640px+)
// Default styles apply to ALL sizes (mobile-first)

// GOTCHA: Next.js Image requires explicit width/height OR fill
// For responsive: Use sizes="100vw" with style={{width: '100%', height: 'auto'}}

// CRITICAL: Touch targets must be 48px minimum (iOS/Android guidelines)
// Apply to buttons, links, and interactive elements

// PERFORMANCE: Use Next.js Image component for automatic WebP/AVIF
// Lazy loading built-in, but test on slow networks

// RTL PREPARATION: Avoid fixed positioning, use logical CSS properties
// margin-left becomes margin-inline-start for future RTL support
```

## Implementation Blueprint

### Mobile-First Breakpoint System
```typescript
// tailwind.config.ts - Iraqi-optimized breakpoints
const config = {
  screens: {
    sm: '640px',    // Small mobile landscape, large mobile portrait
    md: '768px',    // Tablet portrait, small laptop
    lg: '1024px',   // Tablet landscape, desktop
    xl: '1280px',   // Large desktop
    '2xl': '1536px' // Ultra-wide displays
  }
}

// Usage pattern: Mobile-first responsive classes
className="p-4 sm:p-6 md:p-8 lg:p-12"
```

### List of Tasks (In Implementation Order)

```yaml
Task 1: Setup Bun Workspace Foundation
CREATE package.json (root):
  - MIRROR pattern from: PRPs/bun-workspace-setup.md
  - MODIFY: Add responsive-specific development scripts
  - INCLUDE: Tailwind CSS, Next.js image optimization dependencies

CREATE apps/web/package.json:
  - MIRROR pattern from: PRPs/nextjs-app-setup.md  
  - ADD: tailwindcss, @tailwindcss/forms, @tailwindcss/typography
  - INCLUDE: Sharp for Next.js image optimization

Task 2: Configure Mobile-First Tailwind CSS
CREATE apps/web/tailwind.config.ts:
  - IMPLEMENT: Mobile-first breakpoint system
  - ADD: Custom spacing scale for mobile touch targets
  - PREPARE: RTL-ready configuration (future-proof)
  - INCLUDE: Typography responsive scale

CREATE apps/web/app/globals.css:
  - IMPORT: Tailwind base, components, utilities
  - ADD: Mobile-first responsive utility classes
  - DEFINE: Touch-friendly interaction states (:hover, :focus, :active)

Task 3: Implement Responsive Container System
CREATE apps/web/app/components/layout/responsive-container.tsx:
  - MIRROR pattern from: examples/dyad-extracted/components/ui/card.tsx (className patterns)
  - IMPLEMENT: Mobile-first container with max-widths
  - ADD: Responsive padding and margin utilities
  - INCLUDE: TypeScript props for breakpoint customization

Task 4: Build CSS Grid Responsive Patterns
CREATE apps/web/app/components/layout/responsive-grid.tsx:
  - IMPLEMENT: CSS Grid with mobile-first approach
  - ADD: Auto-fit responsive columns using minmax()
  - INCLUDE: Fallback flexbox for older browsers
  - ADD: Gap responsive scaling (gap-4 sm:gap-6 md:gap-8)

Task 5: Setup Next.js Image Optimization
MODIFY apps/web/next.config.js:
  - ENABLE: WebP and AVIF formats
  - CONFIGURE: Image domains and optimization settings
  - ADD: Responsive image breakpoints for Iraqi network conditions

CREATE apps/web/app/components/ui/responsive-image.tsx:
  - WRAPPER: Next.js Image component with responsive defaults
  - IMPLEMENT: Mobile-first sizes attribute patterns
  - ADD: Loading states and error handling
  - INCLUDE: ARIA accessibility attributes

Task 6: Mobile Navigation Implementation  
CREATE apps/web/app/components/layout/mobile-navigation.tsx:
  - MIRROR pattern from: PRPs/basic-routing-system.md (mobile nav structure)
  - IMPLEMENT: Touch-friendly drawer/menu
  - ADD: Responsive breakpoint visibility (block md:hidden)
  - INCLUDE: ARIA accessibility and keyboard navigation

Task 7: Responsive Component Examples
CREATE apps/web/app/components/ui/responsive-card.tsx:
  - ENHANCE: examples/dyad-extracted/components/ui/card.tsx
  - ADD: Mobile-first responsive padding and spacing
  - IMPLEMENT: Responsive typography scaling
  - INCLUDE: Touch-friendly interaction states

Task 8: Mobile-First Typography System
MODIFY apps/web/app/globals.css:
  - ADD: Responsive typography scale (text-sm md:text-base lg:text-lg)
  - IMPLEMENT: Line-height scaling for mobile readability
  - ADD: Touch-friendly link styling with adequate spacing
  - INCLUDE: Arabic RTL preparation (font-family fallbacks)
```

### Per Task Pseudocode

```typescript
// Task 2: Mobile-First Tailwind Configuration
// tailwind.config.ts
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      // Mobile-first breakpoints (min-width)
      sm: '640px',   // Small mobile landscape
      md: '768px',   // Tablet portrait  
      lg: '1024px',  // Desktop
      xl: '1280px',  // Large desktop
      '2xl': '1536px'
    },
    extend: {
      spacing: {
        // Touch-friendly sizing (48px = 12 * 4px)
        'touch': '48px',
        'touch-lg': '56px'
      }
    }
  }
}

// Task 3: Responsive Container Pattern
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function ResponsiveContainer({ children, className, maxWidth = 'lg' }: ResponsiveContainerProps) {
  // PATTERN: Mobile-first utility classes
  const containerClasses = cn(
    // Mobile base (applies to all sizes)
    "w-full px-4 mx-auto",
    // Progressive enhancement
    "sm:px-6",           // 640px+
    "md:px-8",           // 768px+
    // Max-width responsive
    maxWidth === 'sm' && "sm:max-w-sm",
    maxWidth === 'md' && "md:max-w-md", 
    maxWidth === 'lg' && "lg:max-w-4xl",
    className
  );
  
  return <div className={containerClasses}>{children}</div>;
}

// Task 4: CSS Grid Mobile-First Pattern
function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(
      // Mobile: Single column
      "grid grid-cols-1 gap-4",
      // Tablet: 2 columns  
      "md:grid-cols-2 md:gap-6",
      // Desktop: Auto-fit with minimum 300px
      "lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:gap-8"
    )}>
      {children}
    </div>
  );
}

// Task 5: Next.js Responsive Image Wrapper
function ResponsiveImage({ src, alt, className }: ResponsiveImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      // Mobile-first responsive sizing
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      style={{ width: '100%', height: 'auto' }}
      className={cn("rounded-md", className)}
      // Performance optimizations
      priority={false}  // Lazy load by default
      placeholder="blur" // Show blur while loading
    />
  );
}
```

### Integration Points
```yaml
WORKSPACE:
  - create: Root package.json with Bun workspace configuration
  - add to: apps/web/ Next.js application structure
  
TAILWIND:
  - config: apps/web/tailwind.config.ts with mobile-first breakpoints
  - styles: apps/web/app/globals.css with responsive utilities
  
NEXT.JS:
  - config: apps/web/next.config.js with image optimization
  - images: Responsive image optimization with WebP/AVIF support
  
COMPONENTS:
  - layout: Responsive containers and grid systems
  - ui: Mobile-first component patterns
```

## Validation Loop

### Level 1: Setup & Configuration
```bash
# Bun workspace validation
cd aqlix-ai
bun install                    # Install dependencies
bun run dev                    # Start Next.js development server

# Expected: No errors, dev server starts on localhost:3000
# If errors: Check package.json workspace configuration
```

### Level 2: Responsive Behavior Testing
```bash
# Test responsive breakpoints
# 1. Open browser dev tools
# 2. Toggle device simulation
# 3. Test breakpoints: 320px, 640px, 768px, 1024px, 1280px

# Expected behaviors:
# - 320px: Single column, mobile navigation visible
# - 640px: Enhanced spacing, improved typography
# - 768px: Two-column grid, desktop navigation appears  
# - 1024px: Multi-column layouts, larger containers
```

### Level 3: Performance Testing
```bash
# Test image optimization
curl -I http://localhost:3000/_next/image?url=/test-image.jpg&w=640&q=75
# Expected: Content-Type: image/webp (or image/avif if supported)

# Test mobile performance (Chrome DevTools)
# 1. Network tab -> Fast 3G simulation
# 2. Lighthouse audit -> Mobile performance
# Expected: Performance score >90, LCP <2.5s
```

### Level 4: Touch Interaction Testing
```bash
# Test touch targets (minimum 48px)
# 1. Enable touch simulation in browser dev tools
# 2. Verify all buttons and links are easily tappable
# 3. Test mobile navigation drawer interactions

# Expected: No accidental taps, smooth touch interactions
```

## Final Validation Checklist
- [ ] Bun workspace setup complete: `bun install` succeeds
- [ ] Tailwind responsive utilities working: Classes apply correctly at breakpoints
- [ ] Next.js image optimization active: WebP/AVIF serving correctly
- [ ] Mobile navigation functional: Drawer opens/closes smoothly
- [ ] Responsive containers scale properly: Padding and max-widths work
- [ ] CSS Grid patterns work: Auto-fit columns at different breakpoints
- [ ] Touch targets compliant: All interactive elements ≥48px
- [ ] Performance optimized: Mobile Lighthouse score >90
- [ ] Cross-browser tested: Chrome, Safari, Firefox mobile compatibility
- [ ] Accessibility validated: Screen reader navigation works at all breakpoints

---

## Anti-Patterns to Avoid
- ❌ Don't use desktop-first media queries (max-width) - Always use mobile-first (min-width)
- ❌ Don't hardcode pixel values - Use Tailwind responsive utilities
- ❌ Don't ignore touch interaction design - Test on actual mobile devices
- ❌ Don't skip image optimization - Use Next.js Image component always
- ❌ Don't create layouts that break RTL - Prepare for future Arabic support
- ❌ Don't use fixed positioning without mobile testing - Can cause mobile usability issues
- ❌ Don't assume fast internet - Test on simulated 3G networks

## Performance Targets
- Mobile (3G): First Contentful Paint <2s, Largest Contentful Paint <2.5s
- Touch Response: Interaction feedback <100ms
- Image Loading: Progressive loading with blur placeholder
- Bundle Size: Responsive utilities add <10KB to production build

---

**PRP Confidence Score: 9/10**
This PRP provides comprehensive context for one-pass implementation success through:
✅ Complete technical documentation with specific URLs
✅ Existing codebase patterns to follow  
✅ Step-by-step implementation tasks with clear order
✅ Executable validation commands
✅ Performance targets and testing procedures
✅ Common pitfalls and anti-patterns to avoid