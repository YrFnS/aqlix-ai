"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
}

export function NavLink({
  href,
  children,
  exact = true,
  className,
  activeClassName = "text-blue-600 font-semibold",
}: NavLinkProps) {
  const pathname = usePathname();

  // Determine if link is active
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-blue-600",
        isActive ? activeClassName : "text-gray-700",
        className,
      )}
    >
      {children}
    </Link>
  );
}
