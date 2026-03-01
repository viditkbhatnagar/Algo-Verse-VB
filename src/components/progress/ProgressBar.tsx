"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  total,
  label,
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, total > 0 ? Math.round((value / total) * 100) : 0));

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-foreground font-medium">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percentage >= 80
              ? "bg-emerald-500"
              : percentage >= 40
                ? "bg-amber-500"
                : percentage > 0
                  ? "bg-primary"
                  : "bg-transparent"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
