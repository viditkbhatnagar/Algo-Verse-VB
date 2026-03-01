import { NextRequest } from "next/server";
import { getOpenAI, SYSTEM_PROMPT_EXPLAIN } from "@/lib/ai/openai";

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
