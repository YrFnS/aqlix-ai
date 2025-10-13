# @iraqi-ai/ui

Bidirectional UI component library for Arabic/English interfaces in the Iraqi AI Chat System.

## Features

- 🔄 **Automatic RTL/LTR Support**: Components adapt to text direction automatically
- 🪞 **Icon Mirroring**: Material Design-compliant automatic icon mirroring
- 🌐 **Mixed Content**: Proper rendering of Arabic-English mixed content
- 🎨 **CSS Logical Properties**: Modern directional styling throughout
- ⚡ **Performance**: React.memo + useMemo for optimal re-renders
- 📦 **Tree-Shakeable**: Import only what you need
- 🔒 **Type-Safe**: Full TypeScript support with zero `any` types

## Installation

```bash
bun add @iraqi-ai/ui
```

## Quick Start

```tsx
import { BiButton, BiCard, MixedContent } from "@iraqi-ai/ui";

function App() {
  return (
    <BiCard direction="rtl">
      <BiCardHeader>
        <BiCardTitle>مرحباً بك</BiCardTitle>
        <BiCardDescription>
          <MixedContent content="Welcome to Iraqi AI Chat System" />
        </BiCardDescription>
      </BiCardHeader>
      <BiCardContent>
        <BiButton icon={<ChevronRight />} iconName="chevron-right">
          التالي
        </BiButton>
      </BiCardContent>
    </BiCard>
  );
}
```

## Components

### Button Components

#### BiButton

Direction-aware button with icon mirroring support.

```tsx
import { BiButton } from '@iraqi-ai/ui';

// RTL button with trailing icon
<BiButton
  icon={<ChevronRight />}
  iconName="chevron-right"
  iconPosition="trailing"
  direction="rtl"
  variant="primary"
>
  التالي
</BiButton>

// LTR button with leading icon
<BiButton
  icon={<ArrowLeft />}
  iconName="arrow-left"
  iconPosition="leading"
  direction="ltr"
  variant="secondary"
>
  Back
</BiButton>
```

**Props:**

- `icon`: Icon element
- `iconName`: Icon name for auto-mirroring detection
- `iconPosition`: `"leading"` | `"trailing"`
- `direction`: `"rtl"` | `"ltr"` | `"auto"`
- `variant`: `"primary"` | `"secondary"` | `"outline"` | `"ghost"` | `"danger"`
- `size`: `"sm"` | `"md"` | `"lg"`

### Card Components

#### BiCard, BiCardHeader, BiCardTitle, BiCardDescription, BiCardContent, BiCardFooter

Direction-aware card components.

```tsx
import {
  BiCard,
  BiCardHeader,
  BiCardTitle,
  BiCardDescription,
  BiCardContent,
  BiCardFooter,
} from "@iraqi-ai/ui";

<BiCard direction="rtl">
  <BiCardHeader alignment="start">
    <BiCardTitle>عنوان البطاقة</BiCardTitle>
    <BiCardDescription>وصف البطاقة</BiCardDescription>
  </BiCardHeader>
  <BiCardContent>محتوى البطاقة</BiCardContent>
  <BiCardFooter alignment="end">
    <BiButton>حفظ</BiButton>
  </BiCardFooter>
</BiCard>;
```

### Form Components

#### BiInput

Direction-aware input with auto-detection and icon support.

```tsx
import { BiInput } from '@iraqi-ai/ui';

// Auto-detect direction from input value
<BiInput
  placeholder="أدخل اسمك / Enter your name"
  autoDetectDirection
/>

// With leading icon
<BiInput
  leadingIcon={<SearchIcon />}
  placeholder="Search..."
  direction="ltr"
/>

// With error state
<BiInput
  error
  errorMessage="هذا الحقل مطلوب"
  direction="rtl"
/>
```

#### BiTextarea

Direction-aware textarea component.

```tsx
import { BiTextarea } from "@iraqi-ai/ui";

<BiTextarea
  placeholder="أدخل نصك هنا..."
  direction="rtl"
  rows={4}
  autoDetectDirection
/>;
```

#### BiForm, BiFormField, BiFormLabel, BiFormGroup

Complete form system with direction support.

```tsx
import { BiForm, BiFormField, BiFormGroup } from "@iraqi-ai/ui";

<BiForm direction="rtl" onSubmit={handleSubmit}>
  <BiFormField
    label="البريد الإلكتروني"
    description="أدخل بريدك الإلكتروني"
    error={errors.email}
    required
  >
    <BiInput type="email" />
  </BiFormField>

  <BiFormGroup layout="horizontal">
    <BiFormField label="الاسم الأول">
      <BiInput />
    </BiFormField>
    <BiFormField label="اسم العائلة">
      <BiInput />
    </BiFormField>
  </BiFormGroup>

  <BiButton type="submit">إرسال</BiButton>
</BiForm>;
```

### Navigation Components

#### BiNavigation

Direction-aware navigation with proper flow.

```tsx
import { BiNavigation } from "@iraqi-ai/ui";

<BiNavigation direction="rtl">
  <BiButton variant="ghost">الرئيسية</BiButton>
  <BiButton variant="ghost">حول</BiButton>
  <BiButton variant="ghost">اتصل بنا</BiButton>
</BiNavigation>;
```

### Layout Components

#### BiGrid

Direction-aware grid layout.

```tsx
import { BiGrid } from "@iraqi-ai/ui";

<BiGrid direction="rtl" columns={3} gap="md">
  <BiCard>بطاقة 1</BiCard>
  <BiCard>بطاقة 2</BiCard>
  <BiCard>بطاقة 3</BiCard>
</BiGrid>;
```

#### BiList, BiListItem

Direction-aware list components.

```tsx
import { BiList, BiListItem } from "@iraqi-ai/ui";

<BiList direction="rtl">
  <BiListItem>العنصر الأول</BiListItem>
  <BiListItem>العنصر الثاني</BiListItem>
  <BiListItem>العنصر الثالث</BiListItem>
</BiList>;
```

### Mixed Content Components

#### MixedContent

Renders mixed Arabic-English content with proper segmentation.

```tsx
import { MixedContent } from '@iraqi-ai/ui';

<MixedContent content="مرحبا Hello العالم World" />

// Inline rendering
<MixedContent content="Name: أحمد محمد" inline />
```

#### DirectionalIcon

Icon wrapper with automatic mirroring.

```tsx
import { DirectionalIcon } from "@iraqi-ai/ui";

<DirectionalIcon
  icon={<ChevronRight />}
  iconName="chevron-right"
  isRTL={true}
/>;
```

## Hooks

### useBidirectional

Main hook for direction-aware logic.

```tsx
import { useBidirectional } from "@iraqi-ai/ui";

function MyComponent({ direction }) {
  const { isRTL, getDirectionClasses, getInlineStartClass, getFlexDirection } =
    useBidirectional(direction);

  return (
    <div className={getDirectionClasses("container")}>
      <span className={getInlineStartClass("4")}>Content</span>
    </div>
  );
}
```

### useIconMirror

Hook for icon mirroring logic.

```tsx
import { useIconMirror } from "@iraqi-ai/ui";

function IconButton({ icon, iconName, isRTL }) {
  const { shouldMirror, mirrorStyle, mirrorClass } = useIconMirror(
    iconName,
    isRTL,
  );

  return (
    <button>
      <span style={mirrorStyle} className={mirrorClass}>
        {icon}
      </span>
    </button>
  );
}
```

## Icon Mirroring Rules

Following Material Design bidirectionality guidelines:

### ✅ Icons That Mirror

- **Navigation**: arrows, chevrons, back/forward buttons
- **Directional**: indicators showing movement or direction
- **Layout**: drawer, menu, panel controls

### ❌ Icons That Don't Mirror

- **Content**: text, media, objects
- **Actions**: search, settings, user, notifications
- **Status**: checkmarks, errors, warnings
- **Media**: play, pause, volume controls

## CSS Logical Properties

All components use CSS logical properties for direction-independent styling:

```css
/* ❌ Don't use physical properties */
.element {
  padding-left: 1rem;
  margin-right: 2rem;
}

/* ✅ Use logical properties */
.element {
  padding-inline-start: 1rem;
  margin-inline-end: 2rem;
}
```

## TypeScript Support

Full type safety with zero `any` types:

```tsx
import type { BiButtonProps, BidirectionalProps } from "@iraqi-ai/ui";

const MyButton: React.FC<BiButtonProps> = (props) => {
  return <BiButton {...props} />;
};
```

## Performance

All components are optimized for performance:

- `React.memo` for component memoization
- `useMemo` for expensive computations
- Tree-shakeable exports
- Target bundle size: < 50KB for core components

## Browser Support

- Chrome/Edge 88+
- Firefox 68+
- Safari 14.1+
- All modern browsers with CSS logical properties support

## Contributing

See the main [CLAUDE.md](../../CLAUDE.md) for development guidelines.

## License

MIT
