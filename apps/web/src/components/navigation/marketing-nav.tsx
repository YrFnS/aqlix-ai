"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  return (
    <header className="border-b">
      <nav className="container-responsive py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Iraqi AI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} exact>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Navigation */}
        <MobileMenu items={navItems} />
      </nav>
    </header>
  );
}
