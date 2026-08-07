import type { ReactNode } from "react";
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
    <div className="flex min-h-screen bg-secondary/25">
      <AppNav userEmail={user.email ?? "Authenticated account"} />
      <main className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 md:px-8 md:py-8 lg:px-10">
        {children}
      </main>
      <OfflineNotice />
    </div>
  );
}
