import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const algorithmId = searchParams.get("algorithmId");
  if (!algorithmId) {
    return Response.json({ error: "Missing algorithmId" }, { status: 400 });
  }

  try {
    const rows = await db
      .select()
      .from(notes)
      .where(eq(notes.algorithmId, algorithmId));
    return Response.json(rows[0] ?? null);
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return Response.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { algorithmId: string; content: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { algorithmId, content } = body;
  if (!algorithmId || typeof algorithmId !== "string") {
    return Response.json({ error: "Missing algorithmId" }, { status: 400 });
  }
  if (typeof content !== "string") {
    return Response.json({ error: "Missing content" }, { status: 400 });
  }

  try {
    const now = new Date();
    const result = await db
      .insert(notes)
      .values({ algorithmId, content, updatedAt: now })
      .onConflictDoUpdate({
        target: notes.algorithmId,
        set: { content, updatedAt: now },
      })
      .returning();
    return Response.json(result[0]);
  } catch (err) {
    console.error("POST /api/notes error:", err);
    return Response.json({ error: "Failed to save note" }, { status: 500 });
  }
}
