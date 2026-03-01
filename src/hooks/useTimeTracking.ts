"use client";

import { useEffect, useRef } from "react";
import { useProgressStore } from "@/stores/progress";

const INTERVAL_SECONDS = 30;

export function useTimeTracking(algorithmId: string) {
  const addTimeSpent = useProgressStore((s) => s.addTimeSpent);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function startTracking() {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          addTimeSpent(algorithmId, INTERVAL_SECONDS);
        }
      }, INTERVAL_SECONDS * 1000);
    }

    function stopTracking() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        startTracking();
      } else {
        stopTracking();
      }
    }

    startTracking();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopTracking();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [algorithmId, addTimeSpent]);
}
