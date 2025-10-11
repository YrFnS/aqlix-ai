# Layout Components - Quick Reference

Responsive layout components for the Iraqi AI Chat System.

## Components

### Container

Responsive container with automatic centering and padding.

```tsx
import { Container } from "@/components/layout/container";

<Container size="lg">{/* Content */}</Container>;
```

**Sizes**: `sm` | `md` | `lg` | `xl` | `full`

---

### Grid

Responsive grid with configurable columns and gaps.

```tsx
import { Grid } from "@/components/layout/grid";

<Grid cols={{ xs: 1, md: 2, lg: 3 }} gap="md">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</Grid>;
```

**Gaps**: `sm` | `md` | `lg`

---

### Stack

Flexible stacking with responsive direction changes.

```tsx
import { Stack } from "@/components/layout/stack";

// Vertical stack
<Stack spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Responsive (stacked on mobile, row on desktop)
<Stack responsive>
  <div>Left</div>
  <div>Right</div>
</Stack>
```

**Direction**: `row` | `col`
**Spacing**: `sm` | `md` | `lg`
**Responsive**: `true` | `false`

---

### ResponsiveWrapper

Conditionally render content based on device type.

```tsx
import { ResponsiveWrapper } from "@/components/layout/responsive-wrapper";

<ResponsiveWrapper mobile={<MobileView />} desktop={<DesktopView />} />;
```

---

## Complete Documentation

For comprehensive documentation, examples, and best practices, see:

**[Responsive Patterns Guide](C:\Users\Itokoro\Documents\projects\aqlix-ai\docs\responsive-patterns.md)**

---

## Breakpoints

| Breakpoint | Min Width | Device        |
| ---------- | --------- | ------------- |
| xs         | 0px       | Mobile        |
| sm         | 640px     | Large mobile  |
| md         | 768px     | Tablet        |
| lg         | 1024px    | Desktop       |
| xl         | 1280px    | Large desktop |
| 2xl        | 1536px    | Ultra-wide    |

---

## Quick Examples

### Responsive Page Layout

```tsx
import { Container, Grid, Stack } from "@/components/layout";

export function Page() {
  return (
    <Container size="lg">
      <Stack spacing="lg">
        <h1 className="text-heading-1">Page Title</h1>

        <Grid cols={{ xs: 1, md: 2, lg: 3 }} gap="md">
          <Card />
          <Card />
          <Card />
        </Grid>
      </Stack>
    </Container>
  );
}
```

### Responsive Form

```tsx
import { Stack } from "@/components/layout";

export function Form() {
  return (
    <form>
      <Stack spacing="md">
        {/* Full width on mobile, side-by-side on desktop */}
        <Stack responsive spacing="md">
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
        </Stack>

        <Input placeholder="Email" />

        <Stack direction="row" spacing="sm" className="justify-end">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </Stack>
      </Stack>
    </form>
  );
}
```

### Responsive Dashboard

```tsx
import { Container, Grid } from "@/components/layout";
import { ResponsiveWrapper } from "@/components/layout/responsive-wrapper";

export function Dashboard() {
  return (
    <Container size="xl">
      <ResponsiveWrapper
        mobile={
          <Stack spacing="md">
            <StatCard />
            <StatCard />
            <Chart />
          </Stack>
        }
        desktop={
          <Grid cols={{ md: 2, lg: 3 }} gap="lg">
            <StatCard />
            <StatCard />
            <StatCard />
            <div className="col-span-2 lg:col-span-3">
              <Chart />
            </div>
          </Grid>
        }
      />
    </Container>
  );
}
```
