import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { userProgress, learningStreaks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(userProgress);
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/progress error:", err);
    return Response.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { algorithmId: string; status?: string; timeSpent?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { algorithmId, status, timeSpent } = body;
  if (!algorithmId || typeof algorithmId !== "string") {
    return Response.json({ error: "Missing algorithmId" }, { status: 400 });
  }

  try {
    const now = new Date();
    const values: Record<string, unknown> = {
      algorithmId,
      updatedAt: now,
      lastVisitedAt: now,
    };
    const setFields: Record<string, unknown> = {
      updatedAt: now,
      lastVisitedAt: now,
    };

    if (status && ["not_started", "in_progress", "understood"].includes(status)) {
      values.status = status;
      setFields.status = status;
      if (status === "understood") {
        values.completedAt = now;
        setFields.completedAt = now;
      }
    }

    if (typeof timeSpent === "number" && timeSpent > 0) {
      const existingRows = await db
        .select({ timeSpentSeconds: userProgress.timeSpentSeconds })
        .from(userProgress)
        .where(eq(userProgress.algorithmId, algorithmId));
      const existingTime = existingRows.length > 0 ? (existingRows[0].timeSpentSeconds ?? 0) : 0;
      const accumulated = existingTime + timeSpent;
      values.timeSpentSeconds = accumulated;
      setFields.timeSpentSeconds = accumulated;
    }

    const result = await db
      .insert(userProgress)
      .values(values as typeof userProgress.$inferInsert)
      .onConflictDoUpdate({
        target: userProgress.algorithmId,
        set: setFields,
      })
      .returning();

    // Update today's learning streak
    const today = now.toISOString().slice(0, 10);
    const existing = await db
      .select()
      .from(learningStreaks)
      .where(eq(learningStreaks.date, today));

    if (existing.length > 0) {
      await db
        .insert(learningStreaks)
        .values({
          date: today,
          algorithmsViewed: (existing[0].algorithmsViewed ?? 0) + 1,
          timeSpentSeconds: (existing[0].timeSpentSeconds ?? 0) + (timeSpent ?? 0),
        })
        .onConflictDoUpdate({
          target: learningStreaks.date,
          set: {
            algorithmsViewed: (existing[0].algorithmsViewed ?? 0) + 1,
            timeSpentSeconds: (existing[0].timeSpentSeconds ?? 0) + (timeSpent ?? 0),
          },
        });
    } else {
      await db.insert(learningStreaks).values({
        date: today,
        algorithmsViewed: 1,
        timeSpentSeconds: timeSpent ?? 0,
      });
    }

    return Response.json(result[0]);
  } catch (err) {
    console.error("POST /api/progress error:", err);
    return Response.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
