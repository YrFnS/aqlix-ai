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
    <>
      <AppNav userEmail={user.email ?? "Authenticated account"}>
        {children}
      </AppNav>
      <OfflineNotice />
    </>
  );
}
