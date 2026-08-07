"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

export function NavLink({
  href,
  children,
  exact = true,
  className,
  activeClassName = "font-semibold text-primary",
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground",
        isActive ? activeClassName : "text-muted-foreground",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
