import { db } from "@/lib/db";
import { learningStreaks } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(learningStreaks)
      .orderBy(desc(learningStreaks.date))
      .limit(365);
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/streaks error:", err);
    return Response.json({ error: "Failed to fetch streaks" }, { status: 500 });
  }
}
