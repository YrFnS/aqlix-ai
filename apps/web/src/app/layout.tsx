import type { Metadata, Viewport } from "next";
import { notoSansArabic, cairo, amiri } from "@/lib/fonts";
import { DirectionProvider } from "@/components/providers/DirectionProvider";
import { DirectionSync } from "@/components/providers/DirectionSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iraqi AI Chat System",
  description: "Advanced AI chat with Iraqi dialect support",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true, // Don't disable user scaling
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
      <body className="min-h-screen flex flex-col">
        <DirectionProvider>
          <DirectionSync />
          {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
