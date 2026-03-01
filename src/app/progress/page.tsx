"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Star,
  FileText,
} from "lucide-react";
import { StatsCard } from "@/components/progress/StatsCard";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { StreakCalendar } from "@/components/progress/StreakCalendar";
import { categories } from "@/data/categories";
import { getAlgorithmsByCategory, getAllAlgorithms } from "@/data/algorithms";
import { useProgressStore } from "@/stores/progress";
import Link from "next/link";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

export default function ProgressPage() {
  const progressMap = useProgressStore((s) => s.progressMap);
  const bookmarks = useProgressStore((s) => s.bookmarks);
  const [stats, setStats] = useState<{
    notesWritten: number;
    currentStreak: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          notesWritten: Number(data.notesWritten ?? 0),
          currentStreak: data.currentStreak ?? 0,
        });
      })
      .catch(console.error);
  }, []);

  const allAlgorithms = getAllAlgorithms();
  const totalAlgorithms = allAlgorithms.length;

  const studied = Object.values(progressMap).filter(
    (p) => p.status !== "not_started"
  ).length;
  const understood = Object.values(progressMap).filter(
    (p) => p.status === "understood"
  ).length;
  const totalTime = Object.values(progressMap).reduce(
    (acc, p) => acc + (p.timeSpentSeconds || 0),
    0
  );

  const overallPercentage = totalAlgorithms > 0
    ? Math.round((studied / totalAlgorithms) * 100)
    : 0;

  // Recently visited (last 10)
  const recentlyVisited = Object.values(progressMap)
    .filter((p) => p.lastVisitedAt)
    .sort((a, b) => new Date(b.lastVisitedAt!).getTime() - new Date(a.lastVisitedAt!).getTime())
    .slice(0, 10);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Learning Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your algorithm learning progress
        </p>
      </div>

      {/* Overall Progress */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">{overallPercentage}%</p>
            <p className="text-sm text-muted-foreground mt-1">Overall Progress</p>
          </div>
          <div className="flex-1">
            <ProgressBar
              value={studied}
              total={totalAlgorithms}
              label={`${studied} of ${totalAlgorithms} algorithms studied`}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard icon={BookOpen} label="Studied" value={studied} />
        <StatsCard icon={CheckCircle2} label="Understood" value={understood} />
        <StatsCard icon={Star} label="Bookmarked" value={bookmarks.length} />
        <StatsCard
          icon={FileText}
          label="Notes Written"
          value={stats ? stats.notesWritten : "..."}
        />
        <StatsCard
          icon={Flame}
          label="Current Streak"
          value={stats ? `${stats.currentStreak} days` : "..."}
        />
        <StatsCard icon={Clock} label="Time Spent" value={formatTime(totalTime)} />
      </div>

      {/* Streak Calendar */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6 overflow-hidden">
        <StreakCalendar />
      </div>

      {/* Category Progress */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Progress by Category</h2>
        <div className="grid gap-3">
          {categories.map((cat) => {
            const catAlgorithms = getAlgorithmsByCategory(cat.slug);
            const catStudied = catAlgorithms.filter(
              (a) =>
                progressMap[a.id]?.status &&
                progressMap[a.id].status !== "not_started"
            ).length;

            return (
              <Link
                key={cat.slug}
                href={`/algorithms/${cat.slug}`}
                className="block rounded-lg border border-border bg-surface/50 p-4 hover:border-primary/50 transition-colors"
              >
                <ProgressBar
                  value={catStudied}
                  total={catAlgorithms.length}
                  label={cat.name}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recently Visited */}
      {recentlyVisited.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recently Visited</h2>
          <div className="grid gap-2">
            {recentlyVisited.map((entry) => {
              const algo = allAlgorithms.find((a) => a.id === entry.algorithmId);
              if (!algo) return null;

              return (
                <Link
                  key={entry.algorithmId}
                  href={`/algorithms/${algo.category}/${algo.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3 hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {algo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {algo.subcategory}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.lastVisitedAt
                      ? new Date(entry.lastVisitedAt).toLocaleDateString()
                      : ""}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
