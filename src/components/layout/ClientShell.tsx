"use client";

import { useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SearchModal } from "@/components/search/SearchModal";
import { useProgressStore } from "@/stores/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavigationProgress } from "@/components/ui/navigation-progress";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useKeyboardShortcuts();

  const hasFetched = useProgressStore((s) => s.hasFetched);
  const fetchAll = useProgressStore((s) => s.fetchAll);

  useEffect(() => {
    if (!hasFetched) {
      fetchAll();
    }
  }, [hasFetched, fetchAll]);

  if (isLanding) {
    return (
      <>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Navbar />
      <div className="flex overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 lg:ml-[280px] min-h-[calc(100vh-56px)] mt-14 pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
      <SearchModal />
    </>
  );
}
