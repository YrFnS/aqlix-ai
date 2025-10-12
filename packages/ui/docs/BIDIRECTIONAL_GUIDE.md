# Bidirectional UI Development Guide

Comprehensive guide for building bidirectional (RTL/LTR) user interfaces in the Iraqi AI Chat System.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [CSS Logical Properties](#css-logical-properties)
3. [Icon Mirroring](#icon-mirroring)
4. [Mixed Content Handling](#mixed-content-handling)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

## Core Concepts

### Text Direction

Text direction affects:

- Text alignment (right for RTL, left for LTR)
- Content flow (right-to-left or left-to-right)
- Spacing and positioning
- Icon orientation

### Direction Priority

1. **Component prop**: Explicit `direction` prop
2. **Content detection**: Auto-detect from text (if enabled)
3. **Context**: Inherited from DirectionProvider
4. **Default**: `ltr`

## CSS Logical Properties

### Inline vs Block Axis

- **Inline axis**: Horizontal (left-right in LTR, right-left in RTL)
- **Block axis**: Vertical (always top-bottom)

### Property Mapping

| Physical | Logical        | RTL Resolves To | LTR Resolves To |
| -------- | -------------- | --------------- | --------------- |
| `left`   | `inline-start` | `right`         | `left`          |
| `right`  | `inline-end`   | `left`          | `right`         |
| `top`    | `block-start`  | `top`           | `top`           |
| `bottom` | `block-end`    | `bottom`        | `bottom`        |

### Common Patterns

```css
/* ❌ Physical properties */
.element {
  padding-left: 1rem;
  padding-right: 2rem;
  margin-left: auto;
  text-align: left;
  left: 0;
}

/* ✅ Logical properties */
.element {
  padding-inline-start: 1rem;
  padding-inline-end: 2rem;
  margin-inline-start: auto;
  text-align: start;
  inset-inline-start: 0;
}
```

### Tailwind CSS Logical Classes

```tsx
// ❌ Physical classes
<div className="ml-4 mr-2 text-left" />

// ✅ Logical classes (use utilities)
<div className={`${getInlineStartClass('4')} ${getInlineEndClass('2')} text-start`} />

// ✅ Or use custom logical classes
<div className="mis-4 mie-2 text-start" />
```

## Icon Mirroring

### Material Design Guidelines

Icons are categorized into:

#### 1. Directional Icons (Mirror in RTL)

- **Navigation**: arrows, chevrons, back/forward
- **Movement**: indicators showing direction
- **Layout**: drawer, menu, panel controls

```tsx
// These icons will mirror automatically
<DirectionalIcon iconName="arrow-right" isRTL={true} />
<DirectionalIcon iconName="chevron-left" isRTL={true} />
<DirectionalIcon iconName="menu-open" isRTL={true} />
```

#### 2. Content Icons (Don't Mirror)

- **Objects**: files, folders, documents
- **Media**: play, pause, volume
- **Actions**: search, settings, notifications
- **Status**: checkmarks, errors, warnings

```tsx
// These icons won't mirror
<DirectionalIcon iconName="search" isRTL={true} />
<DirectionalIcon iconName="user" isRTL={true} />
<DirectionalIcon iconName="settings" isRTL={true} />
```

### Implementation

```tsx
import { useIconMirror } from "@iraqi-ai/ui";

function MyIcon({ iconName, isRTL }) {
  const { shouldMirror, mirrorStyle } = useIconMirror(iconName, isRTL);

  return (
    <span style={mirrorStyle}>
      <Icon name={iconName} />
    </span>
  );
}
```

### Custom Mirroring Rules

```tsx
// Force mirroring for custom icon
<DirectionalIcon
  icon={<CustomIcon />}
  iconName="custom-arrow"
  forceMirror={true}
  isRTL={true}
/>

// Disable mirroring
<DirectionalIcon
  icon={<ArrowIcon />}
  enableMirroring={false}
  isRTL={true}
/>
```

## Mixed Content Handling

### Unicode Bidirectional Algorithm

Use `unicode-bidi: plaintext` for natural mixed content flow:

```tsx
<MixedContent content="Name: أحمد محمد - Email: ahmed@example.com" />
```

### Segment Isolation

Segments are isolated with `unicode-bidi: embed`:

```css
.segment-rtl {
  unicode-bidi: embed;
  direction: rtl;
  text-align: right;
}

.segment-ltr {
  unicode-bidi: embed;
  direction: ltr;
  text-align: left;
}
```

### Manual Segmentation

```tsx
import { MixedContent } from "@iraqi-ai/ui";

const customFormatter = (content: string) => {
  // Custom segmentation logic
  return segments;
};

<MixedContent content="مرحبا Hello" formatSegments={customFormatter} />;
```

## Best Practices

### 1. Always Use Logical Properties

```tsx
// ❌ Don't
<div style={{ marginLeft: '1rem' }} />

// ✅ Do
<div style={{ marginInlineStart: '1rem' }} />
```

### 2. Use Direction Hooks

```tsx
// ❌ Don't manually check direction
const marginClass = direction === "rtl" ? "mr-4" : "ml-4";

// ✅ Do use hooks
const { getInlineStartClass } = useBidirectional(direction);
const marginClass = getInlineStartClass("4");
```

### 3. Test Both Directions

Always test components in both RTL and LTR modes:

```tsx
// Test RTL
<MyComponent direction="rtl" />

// Test LTR
<MyComponent direction="ltr" />

// Test auto-detection
<MyComponent autoDetectDirection value="مرحبا" />
```

### 4. Handle Icons Correctly

```tsx
// ❌ Don't forget to specify icon names
<BiButton icon={<ArrowIcon />} />

// ✅ Do specify icon names for auto-mirroring
<BiButton icon={<ArrowIcon />} iconName="arrow-right" />
```

### 5. Use Semantic HTML

```tsx
// ❌ Don't
<div onClick={handleClick}>Click me</div>

// ✅ Do
<button onClick={handleClick}>Click me</button>
```

## Common Patterns

### Form Layout

```tsx
<BiForm direction="rtl">
  <BiFormGroup layout="horizontal">
    <BiFormField label="الاسم" required>
      <BiInput />
    </BiFormField>
    <BiFormField label="البريد">
      <BiInput type="email" />
    </BiFormField>
  </BiFormGroup>
</BiForm>
```

### Navigation Bar

```tsx
<BiNavigation direction="rtl">
  <BiButton icon={<HomeIcon />} iconName="home">
    الرئيسية
  </BiButton>
  <BiButton icon={<SearchIcon />} iconName="search">
    بحث
  </BiButton>
  <BiButton
    icon={<ArrowRight />}
    iconName="arrow-right"
    iconPosition="trailing"
  >
    التالي
  </BiButton>
</BiNavigation>
```

### Card Grid

```tsx
<BiGrid direction="rtl" columns={3} gap="md">
  {items.map((item) => (
    <BiCard key={item.id}>
      <BiCardHeader>
        <BiCardTitle>{item.title}</BiCardTitle>
      </BiCardHeader>
      <BiCardContent>
        <MixedContent content={item.description} />
      </BiCardContent>
      <BiCardFooter alignment="end">
        <BiButton size="sm">عرض المزيد</BiButton>
      </BiCardFooter>
    </BiCard>
  ))}
</BiGrid>
```

### Mixed Content Form

```tsx
<BiFormField label={<MixedContent content="Name / الاسم" />}>
  <BiInput autoDetectDirection placeholder="Enter name / أدخل الاسم" />
</BiFormField>
```

## Troubleshooting

### Icon Not Mirroring

**Problem**: Icon doesn't mirror in RTL mode.

**Solutions**:

1. Ensure `iconName` prop is set correctly
2. Check if icon is in the non-mirrored list
3. Use `forceMirror={true}` to override

```tsx
// ✅ Fix
<BiButton icon={<CustomArrow />} iconName="arrow-right" forceMirror={true} />
```

### Text Alignment Issues

**Problem**: Text doesn't align correctly in RTL.

**Solutions**:

1. Use `text-align: start` instead of `text-align: left`
2. Ensure `dir` attribute is set on element
3. Use logical properties for spacing

```tsx
// ✅ Fix
<div dir="rtl" className="text-start">
  النص العربي
</div>
```

### Flexbox Direction

**Problem**: Flexbox items don't flow correctly in RTL.

**Solutions**:

1. Use `flex-row-reverse` for RTL
2. Use the `getFlexDirection()` helper
3. Apply direction to flex container

```tsx
// ✅ Fix
const { getFlexDirection } = useBidirectional(direction);

<div className={`flex ${getFlexDirection()}`}>
  {items.map((item) => (
    <div key={item.id}>{item.content}</div>
  ))}
</div>;
```

### Mixed Content Splitting

**Problem**: Mixed content splits incorrectly.

**Solutions**:

1. Use `<bdi>` tags for isolation
2. Use `MixedContent` component
3. Implement custom formatter

```tsx
// ✅ Fix
<MixedContent content="Name: أحمد - Age: 25" formatSegments={customFormatter} />
```

### Form Input Direction

**Problem**: Input placeholder doesn't align with text.

**Solutions**:

1. Use `autoDetectDirection` prop
2. Set explicit `direction` prop
3. Ensure `dir` attribute matches content

```tsx
// ✅ Fix
<BiInput autoDetectDirection placeholder="أدخل اسمك / Enter name" />
```

## Additional Resources

- [CSS Logical Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
- [Material Design Bidirectionality](https://m2.material.io/design/usability/bidirectionality.html)
- [Radix UI Direction Provider](https://www.radix-ui.com/primitives/docs/utilities/direction-provider)
- [Unicode Bidirectional Algorithm](https://www.unicode.org/reports/tr9/)

## Support

For issues or questions:

1. Check this guide first
2. Review component documentation
3. See examples in `/examples` directory
4. Open an issue on GitHub
