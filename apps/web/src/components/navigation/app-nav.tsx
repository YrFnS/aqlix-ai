"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";

export function AppNav() {
  return (
    <aside className="w-64 border-r bg-gray-50 p-6">
      <Link href="/" className="text-xl font-bold mb-8 block">
        Iraqi AI
      </Link>
      <nav className="flex flex-col gap-2">
        <NavLink
          href="/dashboard"
          exact
          className="px-4 py-2 rounded-md"
          activeClassName="bg-blue-600 text-white font-semibold"
        >
          Dashboard
        </NavLink>
        <NavLink
          href="/settings"
          exact
          className="px-4 py-2 rounded-md"
          activeClassName="bg-blue-600 text-white font-semibold"
        >
          Settings
        </NavLink>
        <NavLink
          href="/profile"
          exact
          className="px-4 py-2 rounded-md"
          activeClassName="bg-blue-600 text-white font-semibold"
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}
