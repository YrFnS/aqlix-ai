"use client";

import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { brand } from "@/config/brand";

const navItems = [
  { href: "/#how-it-works", label: "كيف يعمل" },
  { href: "/#why-tuppra", label: "لماذا Tuppra" },
  { href: brand.links.documentation, label: "الدليل" },
];

const mobileItems = [
  ...navItems,
  { href: brand.links.signIn, label: "تسجيل الدخول" },
  { href: brand.links.registration, label: "ابدأ الآن" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <nav className="container-responsive flex h-16 items-center justify-between gap-4">
        <Link
          href={brand.links.home}
          className="group flex min-w-0 items-center gap-3"
          aria-label={`${brand.name} home`}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-transform group-hover:-rotate-3"
            aria-hidden="true"
          >
            T
          </span>
          <span className="font-arabic-heading text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {brand.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={brand.links.signIn}
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            تسجيل الدخول
          </Link>
          <Link
            href={brand.links.registration}
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            ابدأ الآن
            <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <MobileMenu items={mobileItems} />
        </div>
      </nav>
    </header>
  );
}
