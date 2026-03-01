import { NextRequest } from "next/server";
import { getOpenAI, SYSTEM_PROMPT_CHAT } from "@/lib/ai/openai";

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AlgorithmContext {
  name: string;
  category: string;
  description: string;
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

  let body: { messages?: unknown; algorithmContext?: AlgorithmContext };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, algorithmContext } = body as {
    messages?: unknown;
    algorithmContext?: AlgorithmContext;
  };

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    !messages.every(
      (m) =>
        typeof m === "object" &&
        m !== null &&
        typeof m.role === "string" &&
        typeof m.content === "string" &&
        (m.role === "user" || m.role === "assistant")
    )
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid messages: expected a non-empty array of {role, content} objects" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const validMessages = messages as ChatMessage[];

  let systemContent = SYSTEM_PROMPT_CHAT;
  if (algorithmContext) {
    systemContent += `\n\nThe user is currently viewing the "${algorithmContext.name}" algorithm (category: ${algorithmContext.category}). Description: ${algorithmContext.description.slice(0, 500)}`;
  }

  const stream = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 1000,
    messages: [
      { role: "system", content: systemContent },
      ...validMessages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
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
