"use client";

import { cn } from "@/lib/utils";

interface VisualizationContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function VisualizationContainer({
  children,
  className,
}: VisualizationContainerProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface/50 p-4 space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}
