import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(bookmarks);
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/bookmarks error:", err);
    return Response.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { algorithmId: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { algorithmId } = body;
  if (!algorithmId || typeof algorithmId !== "string") {
    return Response.json({ error: "Missing algorithmId" }, { status: 400 });
  }

  try {
    const result = await db
      .insert(bookmarks)
      .values({ algorithmId })
      .onConflictDoUpdate({
        target: bookmarks.algorithmId,
        set: { algorithmId },
      })
      .returning();
    return Response.json(result[0]);
  } catch (err) {
    console.error("POST /api/bookmarks error:", err);
    return Response.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const algorithmId = searchParams.get("algorithmId");
  if (!algorithmId) {
    return Response.json({ error: "Missing algorithmId" }, { status: 400 });
  }

  try {
    await db.delete(bookmarks).where(eq(bookmarks.algorithmId, algorithmId));
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/bookmarks error:", err);
    return Response.json({ error: "Failed to remove bookmark" }, { status: 500 });
  }
}
