import type { Metadata, Viewport } from "next";
import { notoSansArabic, cairo, amiri } from "@/lib/fonts";
import { DirectionProvider } from "@/components/providers/DirectionProvider";
import { DirectionSync } from "@/components/providers/DirectionSync";
import { brand } from "@/config/brand";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`
        ${notoSansArabic.variable}
        ${cairo.variable}
        ${amiri.variable}
      `.trim()}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        <DirectionProvider>
          <DirectionSync />
          {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
