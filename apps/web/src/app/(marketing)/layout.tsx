import type { ReactNode } from "react";
import { MarketingNav } from "@/components/navigation/marketing-nav";
import { Footer } from "@/app/components/footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
