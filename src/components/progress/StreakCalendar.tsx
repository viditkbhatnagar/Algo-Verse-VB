"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface StreakDay {
  date: string;
  algorithmsViewed: number;
  timeSpentSeconds: number;
}

export function StreakCalendar() {
  const [streaks, setStreaks] = useState<StreakDay[]>([]);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/streaks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStreaks(data);
      })
      .catch(console.error);
  }, []);

  const streakMap = useMemo(() => {
    const map = new Map<string, StreakDay>();
    for (const s of streaks) {
      map.set(s.date, s);
    }
    return map;
  }, [streaks]);

  // Generate 52 weeks of dates ending today
  const weeks = useMemo(() => {
    const result: string[][] = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - dayOfWeek)); // End of this week (Saturday)

    for (let w = 51; w >= 0; w--) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - (w * 7) + d - 6);
        const dateStr = date.toISOString().slice(0, 10);
        // Only include if not in the future
        if (date <= today) {
          week.push(dateStr);
        } else {
          week.push("");
        }
      }
      result.push(week);
    }
    return result;
  }, []);

  function getIntensity(date: string): number {
    const day = streakMap.get(date);
    if (!day) return 0;
    const count = day.algorithmsViewed ?? 0;
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  }

  const intensityColors = [
    "bg-zinc-800",
    "bg-emerald-900/60",
    "bg-emerald-700/60",
    "bg-emerald-500/60",
    "bg-emerald-400/80",
  ];

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Learning Activity</h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 mr-1 shrink-0">
          {dayLabels.map((label, i) => (
            <div
              key={label}
              className={cn(
                "h-3 text-[9px] text-muted-foreground leading-3",
                i % 2 === 0 ? "opacity-100" : "opacity-0"
              )}
            >
              {label}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((date, di) => {
              if (!date) {
                return <div key={di} className="h-3 w-3" />;
              }
              const intensity = getIntensity(date);
              const day = streakMap.get(date);
              return (
                <div
                  key={date}
                  className={cn(
                    "h-3 w-3 rounded-[2px] transition-colors relative",
                    intensityColors[intensity]
                  )}
                  onMouseEnter={() => setHoveredDay(date)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {hoveredDay === date && (
                    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-zinc-900 border border-border text-[10px] text-foreground whitespace-nowrap pointer-events-none">
                      <div>{date}</div>
                      <div>{day ? `${day.algorithmsViewed} algorithms` : "No activity"}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {intensityColors.map((color, i) => (
          <div key={i} className={cn("h-3 w-3 rounded-[2px]", color)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
