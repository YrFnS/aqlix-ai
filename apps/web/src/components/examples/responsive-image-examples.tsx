/**
 * Responsive Image Examples
 *
 * Example components demonstrating proper Next.js Image usage
 * optimized for Iraqi network conditions and cultural requirements.
 *
 * See: apps/web/docs/RESPONSIVE_IMAGES.md for full documentation
 */

import Image from "next/image";

/**
 * Example 1: User Avatar
 *
 * Small circular profile image with fixed dimensions
 * Optimized for fast loading with high quality
 */
export function UserAvatarExample() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/examples/user-avatar.jpg"
        alt="صورة المستخدم أحمد / Ahmed's profile picture"
        width={40}
        height={40}
        className="rounded-full"
        sizes="40px"
        quality={85}
        priority={false} // Not critical for above-the-fold
      />
      <div dir="rtl" lang="ar-IQ" className="font-arabic">
        <p className="font-medium">أحمد محمد</p>
        <p className="text-sm text-muted-foreground">مهندس برمجيات</p>
      </div>
    </div>
  );
}

/**
 * Example 2: Card Thumbnail
 *
 * Responsive thumbnail for content cards
 * Uses 'sizes' prop for optimal loading across devices
 */
export function CardThumbnailExample() {
  return (
    <article className="overflow-hidden rounded-lg border">
      <Image
        src="/images/examples/card-thumbnail.jpg"
        alt="واجهة النظام / System interface"
        width={400}
        height={300}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className="w-full object-cover"
        quality={75}
        loading="lazy"
      />
      <div className="p-4" dir="rtl" lang="ar-IQ">
        <h3 className="font-arabic text-lg font-semibold">عنوان المقالة</h3>
        <p className="font-arabic text-sm text-muted-foreground">
          وصف قصير للمحتوى مع معلومات إضافية
        </p>
      </div>
    </article>
  );
}

/**
 * Example 3: Hero Banner
 *
 * Full-width banner optimized for Iraqi 3G networks
 * Uses priority loading as it's above the fold
 */
export function HeroBannerExample() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <Image
        src="/images/examples/hero-banner.jpg"
        alt="Iraqi AI Chat System - نظام الدردشة الذكي العراقي"
        fill
        sizes="100vw"
        className="object-cover"
        quality={75} // Slightly lower for 3G optimization
        priority={true} // Above the fold - preload
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1
          className="font-arabic text-4xl font-bold text-white md:text-6xl"
          dir="rtl"
          lang="ar-IQ"
        >
          مرحباً بك في النظام الذكي
        </h1>
      </div>
    </div>
  );
}

/**
 * Example 4: Responsive Gallery Grid
 *
 * Gallery with responsive image sizes for mobile/tablet/desktop
 * Optimized with lazy loading for below-the-fold images
 */
export function GalleryGridExample() {
  const images = [
    {
      id: 1,
      src: "/images/examples/gallery-1.jpg",
      alt: "صورة توضيحية 1 / Illustration 1",
    },
    {
      id: 2,
      src: "/images/examples/gallery-2.jpg",
      alt: "صورة توضيحية 2 / Illustration 2",
    },
    {
      id: 3,
      src: "/images/examples/gallery-3.jpg",
      alt: "صورة توضيحية 3 / Illustration 3",
    },
    {
      id: 4,
      src: "/images/examples/gallery-4.jpg",
      alt: "صورة توضيحية 4 / Illustration 4",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform hover:scale-105"
            quality={75}
            loading={index < 2 ? "eager" : "lazy"} // Load first 2 eagerly
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Example 5: Image with Blur Placeholder
 *
 * Optimized for slow 3G networks with blur-up effect
 * Provides better perceived performance
 */
export function BlurPlaceholderExample() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <Image
        src="/images/examples/slow-network.jpg"
        alt="صورة محسنة للشبكات البطيئة / Slow network optimized image"
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        quality={60} // Lower quality for 3G
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        className="object-cover"
      />
    </div>
  );
}

/**
 * Example 6: Arabic Diagram with Caption
 *
 * Technical diagram with Arabic text and bilingual caption
 */
export function ArabicDiagramExample() {
  return (
    <figure className="space-y-2">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border">
        <Image
          src="/images/examples/system-diagram.jpg"
          alt="مخطط معماري يوضح مكونات النظام / System architecture diagram"
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          quality={85}
          className="object-contain"
        />
      </div>
      <figcaption
        className="text-center text-sm text-muted-foreground font-arabic"
        dir="rtl"
        lang="ar-IQ"
      >
        الشكل 1: المخطط المعماري لنظام الدردشة الذكي العراقي
        <br />
        <span lang="en-US">Figure 1: Iraqi AI Chat System Architecture</span>
      </figcaption>
    </figure>
  );
}

/**
 * Example 7: Mobile-Optimized Image
 *
 * Image specifically optimized for mobile devices (iPhone SE, Android)
 * with appropriate sizing and quality settings
 */
export function MobileOptimizedExample() {
  return (
    <div className="max-w-md mx-auto">
      <Image
        src="/images/examples/mobile-feature.jpg"
        alt="ميزة الهاتف المحمول / Mobile feature"
        width={750} // 2x for retina displays (375px physical)
        height={1334}
        sizes="(max-width: 375px) 100vw, 375px"
        quality={70} // Lower for mobile data
        className="w-full h-auto rounded-lg shadow-lg"
        loading="lazy"
      />
    </div>
  );
}

/**
 * Example 8: Background Image with Text Overlay
 *
 * Hero section with proper Arabic text overlay on background image
 */
export function BackgroundWithTextExample() {
  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg">
      {/* Background Image */}
      <Image
        src="/images/examples/background.jpg"
        alt="صورة خلفية / Background image"
        fill
        sizes="100vw"
        quality={75}
        className="object-cover"
        priority={true}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

      {/* Arabic Text Content */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        dir="rtl"
        lang="ar-IQ"
      >
        <h2 className="font-arabic text-3xl font-bold text-white md:text-5xl mb-4">
          نظام الدردشة الذكي المتقدم
        </h2>
        <p className="font-arabic text-lg text-white/90 max-w-2xl">
          منصة متطورة تستخدم الذكاء الاصطناعي لتقديم تجربة محادثة احترافية
          ومتوافقة مع الثقافة العراقية
        </p>
      </div>
    </div>
  );
}

/**
 * Example 9: Product Image List
 *
 * E-commerce style product images with proper responsive sizing
 */
export function ProductListExample() {
  const products = [
    { id: 1, name: "منتج 1", price: "50,000 IQD" },
    { id: 2, name: "منتج 2", price: "75,000 IQD" },
    { id: 3, name: "منتج 3", price: "100,000 IQD" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="rounded-lg border overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={`/images/examples/product-${product.id}.jpg`}
              alt={`صورة ${product.name} / ${product.name} image`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              quality={80}
              loading="lazy"
            />
          </div>
          <div className="p-4" dir="rtl" lang="ar-IQ">
            <h3 className="font-arabic font-semibold">{product.name}</h3>
            <p className="font-arabic text-primary">{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 10: Logo with Multiple Resolutions
 *
 * Company logo with appropriate sizing for different contexts
 */
export function LogoExample() {
  return (
    <div className="flex items-center gap-4">
      {/* Small logo (header) */}
      <Image
        src="/images/logo.svg"
        alt="Iraqi AI Chat System Logo"
        width={120}
        height={40}
        sizes="120px"
        priority={true} // Logo is critical
        className="h-auto w-auto"
      />

      {/* Large logo (landing page) */}
      <Image
        src="/images/logo-large.svg"
        alt="Iraqi AI Chat System - شعار النظام"
        width={300}
        height={100}
        sizes="(max-width: 768px) 200px, 300px"
        quality={100} // Logos need high quality
        priority={true}
      />
    </div>
  );
}
