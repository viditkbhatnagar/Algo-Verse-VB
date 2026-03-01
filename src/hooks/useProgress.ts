"use client";

import { useCallback } from "react";
import { useProgressStore, type ProgressStatus } from "@/stores/progress";

const STATUS_CYCLE: ProgressStatus[] = ["not_started", "in_progress", "understood"];

export function useProgress(algorithmId: string) {
  const status = useProgressStore((s) => s.getStatus(algorithmId));
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const cycleStatus = useCallback(() => {
    const currentIndex = STATUS_CYCLE.indexOf(status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    updateProgress(algorithmId, nextStatus);
  }, [algorithmId, status, updateProgress]);

  const setStatus = useCallback(
    (newStatus: ProgressStatus) => {
      updateProgress(algorithmId, newStatus);
    },
    [algorithmId, updateProgress]
  );

  return { status, cycleStatus, setStatus };
}
