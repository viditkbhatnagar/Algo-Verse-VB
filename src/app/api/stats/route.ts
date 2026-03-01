import { db } from "@/lib/db";
import { userProgress, bookmarks, notes, learningStreaks } from "@/lib/db/schema";
import { eq, count, sum } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [progressRows, bookmarkCount, noteCount, streakRows, totalTime] =
      await Promise.all([
        db.select().from(userProgress),
        db.select({ count: count() }).from(bookmarks),
        db.select({ count: count() }).from(notes),
        db.select().from(learningStreaks),
        db
          .select({ total: sum(userProgress.timeSpentSeconds) })
          .from(userProgress),
      ]);

    const studied = progressRows.filter((r) => r.status !== "not_started").length;
    const understood = progressRows.filter((r) => r.status === "understood").length;
    const inProgressCount = progressRows.filter((r) => r.status === "in_progress").length;

    // Calculate current streak (consecutive days ending today or yesterday)
    const today = new Date().toISOString().slice(0, 10);
    const sortedDates = streakRows
      .map((r) => r.date)
      .sort()
      .reverse();

    let currentStreak = 0;
    const checkDate = new Date(today);
    for (const dateStr of sortedDates) {
      const formatted = checkDate.toISOString().slice(0, 10);
      if (dateStr === formatted) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (currentStreak === 0) {
        // Allow streak to start from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        if (dateStr === checkDate.toISOString().slice(0, 10)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Progress per category
    const categoryProgress: Record<string, { total: number; studied: number; understood: number }> = {};
    for (const row of progressRows) {
      const cat = row.algorithmId.split("/")[0] || "unknown";
      if (!categoryProgress[cat]) {
        categoryProgress[cat] = { total: 0, studied: 0, understood: 0 };
      }
      categoryProgress[cat].total++;
      if (row.status !== "not_started") categoryProgress[cat].studied++;
      if (row.status === "understood") categoryProgress[cat].understood++;
    }

    return Response.json({
      studied,
      understood,
      inProgress: inProgressCount,
      bookmarked: bookmarkCount[0]?.count ?? 0,
      notesWritten: noteCount[0]?.count ?? 0,
      currentStreak,
      totalTimeSeconds: Number(totalTime[0]?.total ?? 0),
      progressByAlgorithm: categoryProgress,
    });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
