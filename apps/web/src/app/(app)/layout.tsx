import type { ReactNode } from "react";
import { PageReveal } from "@/components/motion/motion-primitives";
import { AppNav } from "@/components/navigation/app-nav";
import { OfflineNotice } from "@/components/system/offline-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await requireAuthenticatedUser("/workspaces");

  return (
    <div className="app-shell flex min-h-screen">
      <AppNav userEmail={user.email ?? "Authenticated account"} />
      <main className="app-main min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 md:px-8 md:py-8 lg:px-10">
        <PageReveal className="page-frame">{children}</PageReveal>
      </main>
      <OfflineNotice />
    </div>
  );
}
