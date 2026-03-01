"use client";

import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

interface AIExplanationProps {
  term: string;
  context?: string;
}

export function AIExplanation({ term, context }: AIExplanationProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function fetchExplanation() {
    if (isLoading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setContent("");
    setError("");

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, context }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setError(
          res.status === 503
            ? "AI features require an OpenAI API key"
            : "Failed to get explanation"
        );
        setIsLoading(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setContent(buffer);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Failed to connect to AI service");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!content && !isLoading && !error) {
    return (
      <button
        onClick={fetchExplanation}
        className="text-sm text-primary hover:underline"
      >
        Get AI explanation
      </button>
    );
  }

  return (
    <div>
      {isLoading && !content && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating explanation...
        </div>
      )}
      {content && <MarkdownRenderer content={content} />}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
