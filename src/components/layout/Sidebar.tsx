"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, BookOpenText } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { categories } from "@/data/categories";
import { getAlgorithmsByCategory } from "@/data/algorithms";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";
import type { CategoryInfo } from "@/lib/visualization/types";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);

  function toggleCategory(slug: string) {
    setExpanded((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Categories
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        <Link
          href="/glossary"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mb-1",
            pathname.startsWith("/glossary")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-surface hover:text-foreground"
          )}
        >
          <BookOpenText className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Glossary</span>
        </Link>
        <div className="border-b border-border mb-1" />
        {categories.map((cat: CategoryInfo) => {
          const isExpanded = expanded.includes(cat.slug);
          const algorithms = getAlgorithmsByCategory(cat.slug);
          const isCategoryActive = pathname.startsWith(`/algorithms/${cat.slug}`);

          return (
            <div key={cat.slug}>
              <button
                onClick={() => toggleCategory(cat.slug)}
                className={cn(
                  "flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isCategoryActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                )}
              >
                <CategoryIcon
                  category={cat.slug}
                  className="h-4 w-4 shrink-0"
                />
                <span className="flex-1 text-left truncate">{cat.name}</span>
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] border-border text-muted-foreground shrink-0"
                >
                  {cat.algorithmCount}
                </Badge>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="ml-6 pl-3 border-l border-border mt-1 mb-2 space-y-0.5">
                  <Link
                    href={`/algorithms/${cat.slug}`}
                    onClick={onNavigate}
                    className={cn(
                      "block px-3 py-1.5 rounded-md text-xs transition-colors",
                      pathname === `/algorithms/${cat.slug}`
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    )}
                  >
                    Overview
                  </Link>
                  {algorithms.map((algo) => (
                    <Link
                      key={algo.id}
                      href={`/algorithms/${cat.slug}/${algo.id}`}
                      onClick={onNavigate}
                      className={cn(
                        "block px-3 py-1.5 rounded-md text-xs transition-colors truncate",
                        pathname === `/algorithms/${cat.slug}/${algo.id}`
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface"
                      )}
                    >
                      {algo.name}
                    </Link>
                  ))}
                  {algorithms.length === 0 && (
                    <span className="block px-3 py-1.5 text-xs text-muted-foreground/50 italic">
                      Coming soon
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-14 w-[280px] h-[calc(100vh-56px)] border-r border-border bg-background">
        <SidebarContent />
      </aside>

      {/* Tablet/mobile sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 bg-background border-r border-border"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
