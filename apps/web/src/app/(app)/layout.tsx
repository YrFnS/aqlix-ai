import { AppNav } from "@/components/navigation/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-secondary/25">
      <AppNav />
      <main className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 md:px-8 md:py-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
