"use client";

import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { brand } from "@/config/brand";

const navItems = [
  { href: "/#product", label: "كيف يعمل" },
  { href: "/#capabilities", label: "القدرات" },
  { href: "/#principles", label: "المبادئ" },
  { href: brand.links.documentation, label: "المستندات" },
];

const mobileItems = [
  ...navItems,
  { href: brand.links.signIn, label: "تسجيل الدخول" },
  { href: brand.links.registration, label: "إنشاء حساب" },
  { href: brand.links.workspace, label: "فتح مساحة العمل" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur-xl">
      <nav
        aria-label="التنقل الرئيسي"
        className="container-responsive flex h-[4.5rem] items-center justify-between gap-4"
      >
        <Link
          href={brand.links.home}
          className="rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-4 focus-visible:ring-ring/20"
          aria-label={`${brand.name} home`}
        >
          <BrandMark size="sm" />
        </Link>

        <div className="hidden items-center rounded-full border border-line/70 bg-surface-raised/75 p-1 shadow-surface-xs lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted outline-none transition-colors duration-fast hover:bg-surface-sunken hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link href={brand.links.signIn}>تسجيل الدخول</Link>
          </Button>
          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link href={brand.links.workspace}>
              افتح مساحة العمل
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <MobileMenu items={mobileItems} />
        </div>
      </nav>
    </header>
  );
}
