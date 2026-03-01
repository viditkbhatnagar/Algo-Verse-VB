"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    cleanup();
    setLoading(true);
    setVisible(true);
    setProgress(0);

    // Rapidly go to ~30%, then slow trickle
    let current = 0;
    timerRef.current = setInterval(() => {
      current += current < 30 ? 8 : current < 60 ? 3 : current < 80 ? 1 : 0.5;
      if (current > 90) current = 90;
      setProgress(current);
    }, 200);
  }, [cleanup]);

  const complete = useCallback(() => {
    cleanup();
    setProgress(100);
    setLoading(false);
    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, [cleanup]);

  // Complete on route change
  useEffect(() => {
    if (loading) {
      complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept link clicks to start loading
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Skip external links, hash links, and non-navigating links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        target.getAttribute("download") != null ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Skip if clicking the current page
      if (href === pathname) return;

      start();
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname, start]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Glow effect at the leading edge */}
      {loading && (
        <div
          className="absolute top-0 right-0 h-full w-24 -translate-x-1 bg-gradient-to-l from-primary/60 to-transparent"
          style={{ right: `${100 - progress}%` }}
        />
      )}
    </div>
  );
}
