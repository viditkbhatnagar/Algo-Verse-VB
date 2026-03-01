import { NextRequest } from "next/server";
import { getOpenAI, SYSTEM_PROMPT_EXPLAIN } from "@/lib/ai/openai";
import { db } from "@/lib/db";
import { aiCache } from "@/lib/db/schema";
import { eq, gt, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

const requestTimestamps: number[] = [];
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function checkRateLimit(): boolean {
  const now = Date.now();
  while (requestTimestamps.length && requestTimestamps[0] < now - RATE_WINDOW) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= RATE_LIMIT) return false;
  requestTimestamps.push(now);
  return true;
}

async function hashQuery(term: string, context?: string): Promise<string> {
  const data = `${term}|${context ?? ""}`;
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!checkRateLimit()) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  let term: string;
  let context: string | undefined;
  try {
    const body = await req.json();
    term = body.term;
    context = body.context;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!term || typeof term !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'term' field" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check AI cache
  try {
    const queryHash = await hashQuery(term, context);
    const cached = await db
      .select()
      .from(aiCache)
      .where(
        and(
          eq(aiCache.queryHash, queryHash),
          gt(aiCache.expiresAt, new Date())
        )
      );

    if (cached.length > 0) {
      return new Response(cached[0].response, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "HIT",
        },
      });
    }

    // Cache miss — call OpenAI and collect full response
    const stream = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            SYSTEM_PROMPT_EXPLAIN +
            (context ? `\nContext: ${context}` : ""),
        },
        { role: "user", content: `Explain: "${term}"` },
      ],
    });

    let fullResponse = "";
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              fullResponse += text;
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();

          // Save to cache after stream completes (30-day TTL)
          if (fullResponse.length > 0) {
            try {
              const expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + 30);
              await db
                .insert(aiCache)
                .values({
                  queryHash,
                  term: term.slice(0, 200),
                  context: context?.slice(0, 200),
                  response: fullResponse,
                  expiresAt,
                })
                .onConflictDoUpdate({
                  target: aiCache.queryHash,
                  set: { response: fullResponse, expiresAt },
                });
            } catch (cacheWriteErr) {
              console.error(
                `Failed to write AI cache [queryHash=${queryHash}, term=${term.slice(0, 50)}]:`,
                cacheWriteErr instanceof Error ? cacheWriteErr.message : cacheWriteErr
              );
            }
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Cache": "MISS",
      },
    });
  } catch (cacheErr) {
    // If cache check fails, fall back to direct OpenAI call
    console.error("Cache error, falling back:", cacheErr);
    const stream = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            SYSTEM_PROMPT_EXPLAIN +
            (context ? `\nContext: ${context}` : ""),
        },
        { role: "user", content: `Explain: "${term}"` },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }
}
