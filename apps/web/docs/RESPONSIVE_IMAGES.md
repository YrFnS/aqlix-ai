# Responsive Images Guide - Iraqi AI Chat System

## Overview

This guide covers best practices for implementing responsive, optimized images in the Iraqi AI Chat System with special considerations for:

- Iraqi network conditions (3G/4G optimization)
- Arabic text in images (proper RTL rendering)
- Cultural content (Islamic compliance)
- Mobile-first design (iPhone SE, Android devices)

---

## Next.js Image Component

**Always use Next.js `Image` component** instead of HTML `<img>` tags for automatic optimization.

### Basic Usage

```tsx
import Image from "next/image";

export function Example() {
  return (
    <Image
      src="/images/example.jpg"
      alt="وصف الصورة / Image description"
      width={800}
      height={600}
      priority={false} // Set true for above-the-fold images
    />
  );
}
```

---

## Responsive Images with `sizes` Prop

The `sizes` prop tells the browser which image size to load based on viewport width.

### Example: Full-Width Hero Image

```tsx
<Image
  src="/images/hero.jpg"
  alt="Iraqi AI Chat System"
  width={1920}
  height={1080}
  sizes="100vw"
  priority={true} // Above the fold
  quality={85} // Slightly lower for faster loading on 3G
/>
```

### Example: Responsive Grid (Mobile-First)

```tsx
<Image
  src="/images/feature.jpg"
  alt="ميزة النظام / System feature"
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  quality={80}
/>
```

**Sizes Breakdown**:

- Mobile (≤640px): Full width (100vw)
- Tablet (≤1024px): Half width (50vw)
- Desktop (>1024px): Third width (33vw)

---

## Iraqi Network Optimization

### 3G/4G Network Considerations

Iraqi mobile networks typically run on:

- **3G**: 384 Kbps - 2 Mbps
- **4G**: 5-50 Mbps (varies by location)

**Optimization Strategies**:

1. **Lower Quality for Faster Loading**

   ```tsx
   <Image
     src="/images/content.jpg"
     quality={75} // Default is 75, use 60-70 for slower networks
     placeholder="blur" // Show blur while loading
     blurDataURL="data:image/jpeg;base64,..." // Tiny placeholder
   />
   ```

2. **Lazy Loading (Default)**

   ```tsx
   <Image
     src="/images/below-fold.jpg"
     loading="lazy" // Default behavior
     // Only loads when image enters viewport
   />
   ```

3. **Priority Loading for Critical Images**
   ```tsx
   <Image
     src="/images/logo.jpg"
     priority={true} // Preload immediately
     // Use for above-the-fold content only
   />
   ```

---

## Arabic Text in Images

### Text Overlay on Images

When overlaying Arabic text on images:

```tsx
<div className="relative">
  <Image
    src="/images/background.jpg"
    alt="صورة خلفية"
    width={1200}
    height={800}
    sizes="100vw"
  />
  <div
    className="absolute inset-0 flex items-center justify-center"
    dir="rtl"
    lang="ar-IQ"
  >
    <h1 className="font-arabic text-4xl text-white">مرحباً بك في النظام</h1>
  </div>
</div>
```

### Images with Embedded Arabic Text

For images containing Arabic text (e.g., diagrams, screenshots):

```tsx
<figure>
  <Image
    src="/images/arabic-diagram.jpg"
    alt="مخطط النظام يوضح العلاقات بين المكونات"
    width={1200}
    height={800}
    sizes="(max-width: 768px) 100vw, 80vw"
  />
  <figcaption
    className="text-center mt-2 text-sm text-muted-foreground font-arabic"
    lang="ar-IQ"
    dir="rtl"
  >
    الشكل 1: مخطط معماري للنظام
  </figcaption>
</figure>
```

---

## Cultural Content Guidelines

### Islamic Compliance

**Allowed Images**:

- ✅ System UI screenshots
- ✅ Abstract patterns and geometric designs
- ✅ Diagrams and flowcharts
- ✅ Professional portraits (with hijab for women)
- ✅ Landscapes and nature

**Prohibited Content**:

- ❌ Intimate images
- ❌ Alcohol or prohibited items
- ❌ Disrespectful religious imagery
- ❌ Inappropriate clothing

### Example: Professional Profile Images

```tsx
<Image
  src="/images/profiles/user-123.jpg"
  alt="صورة المستخدم / User profile"
  width={200}
  height={200}
  className="rounded-full"
  sizes="(max-width: 768px) 150px, 200px"
  quality={85}
/>
```

---

## Mobile Device Optimization

### iPhone SE (375px width)

```tsx
<Image
  src="/images/mobile-hero.jpg"
  alt="واجهة التطبيق"
  width={750} // 2x for retina
  height={1334}
  sizes="(max-width: 375px) 100vw, 375px"
  quality={70} // Lower for mobile data
/>
```

### Android (360px width typical)

```tsx
<Image
  src="/images/android-feature.jpg"
  alt="ميزة الأندرويد"
  width={720} // 2x for high DPI
  height={1280}
  sizes="(max-width: 360px) 100vw, 360px"
  quality={70}
/>
```

---

## Common Patterns

### 1. Avatar/Profile Images

```tsx
export function UserAvatar({ src, alt, size = 40 }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full"
      sizes={`${size}px`}
      quality={85}
    />
  );
}
```

### 2. Card Thumbnails

```tsx
export function CardThumbnail({ src, alt }: ThumbnailProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      className="rounded-lg object-cover"
      quality={75}
    />
  );
}
```

### 3. Full-Width Banners

```tsx
export function Banner({ src, alt }: BannerProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1920}
      height={400}
      sizes="100vw"
      priority={true}
      quality={80}
      className="w-full h-auto"
    />
  );
}
```

---

## Performance Benchmarks

### Target Metrics (Iraqi Networks)

| Network       | LCP Target | Image Load Time |
| ------------- | ---------- | --------------- |
| 3G (384 Kbps) | < 4s       | < 3s            |
| 3G (2 Mbps)   | < 3s       | < 2s            |
| 4G (10 Mbps)  | < 2.5s     | < 1.5s          |
| 4G (50 Mbps)  | < 1.5s     | < 0.8s          |

### Recommended Image Sizes

| Use Case   | Dimensions | File Size (JPEG) | Quality |
| ---------- | ---------- | ---------------- | ------- |
| Avatar     | 200x200    | < 20 KB          | 85      |
| Thumbnail  | 400x300    | < 40 KB          | 75      |
| Card Image | 800x600    | < 80 KB          | 75      |
| Hero Image | 1920x1080  | < 150 KB         | 70-80   |

---

## Testing Images

### Manual Testing Checklist

- [ ] Images load on 3G throttling (Chrome DevTools)
- [ ] Lazy loading works (images below fold don't load immediately)
- [ ] Images render correctly in RTL mode
- [ ] Alt text is bilingual (Arabic / English)
- [ ] Images meet Islamic compliance guidelines
- [ ] Mobile devices (iPhone SE 375px, Android 360px)
- [ ] Tablet viewports (768px, 1024px)
- [ ] Desktop viewports (1280px, 1920px)

### Automated Testing

```typescript
// apps/web/tests/e2e/performance/page-performance.spec.ts
test("should load images efficiently", async ({ page }) => {
  await page.goto("/");

  const imageMetrics = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return images.map((img) => ({
      src: img.src,
      loading: img.loading,
      decoded: img.complete && img.naturalHeight !== 0,
    }));
  });

  // Verify lazy loading
  const hasLazyLoading = imageMetrics.some((img) => img.loading === "lazy");
  expect(hasLazyLoading).toBeTruthy();

  // Verify all images loaded
  const allDecoded = imageMetrics.every((img) => img.decoded);
  expect(allDecoded).toBeTruthy();
});
```

---

## Next.js Image Configuration

### next.config.js Setup

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external image sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],

    // Image optimization formats
    formats: ["image/avif", "image/webp"],

    // Device sizes for responsive images
    deviceSizes: [360, 375, 640, 750, 828, 1080, 1200, 1920],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

---

## Common Issues & Solutions

### Issue 1: Images Not Loading on 3G

**Solution**: Lower quality and use blur placeholder

```tsx
<Image
  src="/images/slow.jpg"
  quality={60}
  placeholder="blur"
  blurDataURL={generateBlurDataURL()}
/>
```

### Issue 2: Layout Shift (CLS)

**Solution**: Always specify width and height

```tsx
// ❌ BAD - Causes layout shift
<Image src="/images/example.jpg" />

// ✅ GOOD - No layout shift
<Image src="/images/example.jpg" width={800} height={600} />
```

### Issue 3: Images Not Lazy Loading

**Solution**: Ensure `priority={false}` (default)

```tsx
// Below-the-fold images automatically lazy load
<Image src="/images/below.jpg" loading="lazy" />
```

---

## Resources

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [WCAG Image Requirements](https://www.w3.org/WAI/WCAG21/Understanding/images-of-text)
- [Iraqi Internet Speed Data](https://www.speedtest.net/global-index/iraq)

---

**Last Updated**: 2025-11-01
**Version**: 1.0.0
