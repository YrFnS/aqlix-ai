"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";

export function MarketingNav() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Iraqi AI
        </Link>
        <div className="flex gap-6">
          <NavLink href="/" exact>
            Home
          </NavLink>
          <NavLink href="/about" exact>
            About
          </NavLink>
          <NavLink href="/pricing" exact>
            Pricing
          </NavLink>
          <NavLink href="/contact" exact>
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
