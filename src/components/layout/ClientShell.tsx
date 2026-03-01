"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function ClientShell({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
