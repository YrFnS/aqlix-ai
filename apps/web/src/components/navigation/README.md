# Navigation Components - Quick Reference

Responsive navigation patterns for the Iraqi AI Chat System.

## Components

### MobileMenu

Hamburger menu with slide-in panel for mobile devices.

```tsx
import { MobileMenu } from "@/components/navigation/mobile-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
];

export function Header() {
  return (
    <header>
      <nav className="container flex justify-between items-center py-4">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile navigation */}
        <MobileMenu items={navItems} />
      </nav>
    </header>
  );
}
```

**Features**:

- Hidden on desktop (md:hidden)
- 48x48px touch targets
- Slide-in animation
- Backdrop overlay
- Safe area support

---

### BottomNav

Fixed bottom navigation bar for mobile app navigation.

```tsx
import { BottomNav } from "@/components/navigation/bottom-nav";

export function AppLayout({ children }) {
  return (
    <div>
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
```

**Features**:

- Mobile-only (hidden md:)
- Fixed bottom position
- Active route highlighting
- Icon + label layout
- Safe area support

**Default Items**:

- Dashboard (Home icon)
- Chat (MessageSquare icon)
- Settings (Settings icon)
- Profile (User icon)

---

### AppNav

Responsive sidebar/drawer navigation.

```tsx
import { AppNav } from "@/components/navigation/app-nav";

export function AppLayout({ children }) {
  return (
    <div className="flex">
      <AppNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

**Features**:

- Desktop: Fixed sidebar (always visible)
- Mobile: Drawer overlay (toggle)
- Smooth transitions
- Touch-optimized
- Auto-close on navigation

---

### NavLink

Active route-aware navigation link.

```tsx
import { NavLink } from "@/components/navigation/nav-link";

// Basic usage
<NavLink href="/dashboard">Dashboard</NavLink>

// Custom active styling
<NavLink
  href="/settings"
  activeClassName="bg-blue-600 text-white"
>
  Settings
</NavLink>

// Non-exact matching
<NavLink href="/blog" exact={false}>
  Blog
</NavLink>
```

**Props**:

- `href`: Link destination (required)
- `children`: Link content (required)
- `exact`: Exact path matching (default: true)
- `className`: Additional CSS classes
- `activeClassName`: Active state classes

---

## Complete Documentation

For comprehensive documentation, examples, and best practices, see:

**[Responsive Patterns Guide](C:\Users\Itokoro\Documents\projects\aqlix-ai\docs\responsive-patterns.md)**

---

## Navigation Patterns

### Marketing Site Navigation

Use `MobileMenu` for simple marketing sites:

```tsx
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { NavLink } from "@/components/navigation/nav-link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  return (
    <header className="border-b">
      <nav className="container-responsive py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Iraqi AI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} exact>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Navigation */}
        <MobileMenu items={navItems} />
      </nav>
    </header>
  );
}
```

---

### Mobile App Navigation

Use `BottomNav` for mobile-first apps:

```tsx
import { BottomNav } from "@/components/navigation/bottom-nav";

export function MobileAppLayout({ children }) {
  return (
    <>
      <header className="sticky top-0 bg-background border-b p-4">
        <h1>Iraqi AI Chat</h1>
      </header>

      <main className="pb-16">{children}</main>

      <BottomNav />
    </>
  );
}
```

---

### Dashboard/Admin Navigation

Use `AppNav` for complex applications:

```tsx
import { AppNav } from "@/components/navigation/app-nav";

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AppNav />

      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
```

---

## Customization

### Customizing MobileMenu

Edit the component to add authentication actions:

```tsx
// In mobile-menu.tsx
<div className="flex flex-col gap-4">
  {items.map((item) => (
    <Link key={item.href} href={item.href}>
      {item.label}
    </Link>
  ))}

  {/* Add custom actions */}
  <hr className="my-2" />
  <button onClick={handleSignOut}>Sign Out</button>
</div>
```

### Customizing BottomNav

Edit `navItems` array in the component:

```tsx
// In bottom-nav.tsx
const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/profile", icon: User, label: "Profile" },
];
```

### Customizing AppNav

Add sections or user profile:

```tsx
// In app-nav.tsx
<aside>
  <Link href="/" className="text-xl font-bold mb-8 block">
    Iraqi AI
  </Link>

  <nav className="flex flex-col gap-2">
    <div className="text-xs font-semibold text-muted-foreground mb-2">MAIN</div>
    <NavLink href="/dashboard">Dashboard</NavLink>
    <NavLink href="/projects">Projects</NavLink>

    <div className="text-xs font-semibold text-muted-foreground mt-4 mb-2">
      SETTINGS
    </div>
    <NavLink href="/settings">Settings</NavLink>
    <NavLink href="/profile">Profile</NavLink>
  </nav>

  {/* User profile */}
  <div className="absolute bottom-4 left-4 right-4">
    <UserProfile />
  </div>
</aside>
```

---

## Accessibility

All navigation components follow WCAG 2.1 AA standards:

- **Touch Targets**: 48x48px minimum (`touch-target` class)
- **ARIA Labels**: Proper `aria-label` and `aria-expanded`
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA attributes
- **Focus Management**: Visible focus indicators

---

## Cultural Compliance

Navigation components support:

- **RTL Layouts**: Right-to-left text direction support (refinement in progress)
- **Arabic Labels**: Font optimization for Arabic text
- **Cultural Validation**: 95%+ appropriateness required

For Arabic navigation labels, consult `arabic-rtl-processor` agent.

---

## Performance

Navigation components are optimized for:

- **Fast Loading**: Minimal JavaScript, CSS-based animations
- **Smooth Animations**: GPU-accelerated transforms
- **Touch Response**: <100ms touch response time
- **Accessibility**: Respects `prefers-reduced-motion`
