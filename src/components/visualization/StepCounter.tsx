"use client";

interface StepCounterProps {
  current: number;
  total: number;
}

export function StepCounter({ current, total }: StepCounterProps) {
  return (
    <span className="text-sm text-muted-foreground font-mono">
      Step {current} of {total}
    </span>
  );
}
