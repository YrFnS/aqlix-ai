import type { Metadata } from "next";
import Link from "next/link";

/**
 * Authentication Layout
 * Provides consistent layout for all auth pages with:
 * - RTL support
 * - Cultural branding
 * - Centered content
 * - Minimal distractions
 */

export const metadata: Metadata = {
  title: {
    template: "%s | Iraqi AI Chat System",
    default: "Authentication | Iraqi AI Chat System",
  },
  description: "Secure authentication for Iraqi AI Chat System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-arabic text-sm font-bold">
                النظام العراقي للذكاء الاصطناعي
              </span>
              <span className="text-xs text-muted-foreground">
                Iraqi AI Chat System
              </span>
            </div>
          </Link>

          {/* Language Selector (Future) */}
          <div className="text-muted-foreground text-sm">
            {/* TODO: Add language selector */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <p className="text-muted-foreground font-arabic text-center text-sm md:text-left">
            © 2025 Iraqi AI Chat System. جميع الحقوق محفوظة / All rights
            reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy / الخصوصية
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms / الشروط
            </a>
            <a
              href="/help"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Help / المساعدة
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
