import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { AccessibilityRuntime } from "@/components/system/accessibility-runtime";
import { DirectionProvider } from "@/components/providers/DirectionProvider";
import { DirectionSync } from "@/components/providers/DirectionSync";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { brand } from "@/config/brand";
import { amiri, cairo, inter, notoSansArabic } from "@/lib/fonts";
import "./globals.css";
import "./quality.css";

export const metadata: Metadata = {
  applicationName: brand.name,
  title: {
    default: `${brand.name} — ${brand.category}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`
        ${inter.variable}
        ${notoSansArabic.variable}
        ${cairo.variable}
        ${amiri.variable}
      `.trim()}
    >
      <body
        data-ui-foundation="p0"
        className="flex min-h-screen flex-col bg-background font-arabic text-foreground antialiased selection:bg-primary/20"
      >
        <AccessibilityRuntime />
        <DirectionProvider>
          <DirectionSync />
          <MotionProvider>{children}</MotionProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
