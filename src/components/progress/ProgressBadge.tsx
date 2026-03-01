"use client";

import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { ProgressStatus } from "@/stores/progress";

interface ProgressBadgeProps {
  algorithmId: string;
  variant?: "full" | "compact";
}

const STATUS_CONFIG: Record<
  ProgressStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  not_started: {
    label: "Not Started",
    bg: "bg-zinc-800 hover:bg-zinc-700",
    text: "text-zinc-400",
    dot: "bg-zinc-500",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-amber-900/30 hover:bg-amber-900/50",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  understood: {
    label: "Understood",
    bg: "bg-emerald-900/30 hover:bg-emerald-900/50",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

export function ProgressBadge({ algorithmId, variant = "full" }: ProgressBadgeProps) {
  const { status, cycleStatus } = useProgress(algorithmId);
  const config = STATUS_CONFIG[status];

  if (variant === "compact") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          cycleStatus();
        }}
        className={cn("h-2.5 w-2.5 rounded-full shrink-0 transition-colors", config.dot)}
        title={config.label}
      />
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        cycleStatus();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dot)} />
      {config.label}
    </button>
  );
}
