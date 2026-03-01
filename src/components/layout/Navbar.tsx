"use client";

import Link from "next/link";
import { Search, Menu, Moon, Sun, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/ui";

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full items-center px-4 gap-4">
        {/* Hamburger — tablet and below */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="text-xl font-bold text-primary">Algo</span>
          <span className="text-xl font-bold text-accent">Verse</span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 flex-1 max-w-md mx-auto h-9 px-4 rounded-md border border-border bg-surface/50 text-sm text-muted-foreground hover:bg-surface hover:border-primary/50 transition-colors"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search algorithms...</span>
          <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Mobile search icon */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden ml-auto text-muted-foreground hover:text-foreground"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Spacer on desktop */}
        <div className="hidden sm:block flex-1" />

        {/* Dashboard link */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/progress">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Dashboard"
                >
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Learning Dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Theme toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-foreground relative"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
