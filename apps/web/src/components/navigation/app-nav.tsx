"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppNav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Mobile: Drawer that overlays
  // Desktop: Fixed sidebar
  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 touch-target"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Sidebar/Drawer */}
      <aside
        className={cn(
          "bg-gray-50 border-r p-6",
          // Desktop: fixed sidebar
          "hidden md:block md:w-64 md:sticky md:top-0 md:h-screen",
          // Mobile: drawer overlay
          isMobile && isOpen && "fixed inset-y-0 left-0 z-40 w-64 block",
          isMobile && !isOpen && "hidden",
        )}
      >
        <Link href="/" className="text-xl font-bold mb-8 block">
          Iraqi AI
        </Link>
        <nav className="flex flex-col gap-2">
          <NavLink
            href="/dashboard"
            exact
            className="touch-target px-4 py-3 rounded-md"
            activeClassName="bg-blue-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            href="/settings"
            exact
            className="touch-target px-4 py-3 rounded-md"
            activeClassName="bg-blue-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </NavLink>
          <NavLink
            href="/profile"
            exact
            className="touch-target px-4 py-3 rounded-md"
            activeClassName="bg-blue-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
