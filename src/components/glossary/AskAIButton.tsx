"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

interface AskAIButtonProps {
  term: string;
  context?: string;
}

export function AskAIButton({ term, context }: AskAIButtonProps) {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (isLoading) return;
    setIsLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, context }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(res.status === 503 ? "AI features require an OpenAI API key" : text || "Failed to get explanation");
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
        setResponse(buffer);
      }
    } catch {
      setError("Failed to connect to AI service");
    } finally {
      setIsLoading(false);
    }
  }

  if (response) {
    return (
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">AI Explanation</span>
        </div>
        <MarkdownRenderer content={response} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      {error && (
        <p className="text-xs text-error mb-2">{error}</p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleAsk}
        disabled={isLoading}
        className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {isLoading ? "Thinking..." : "Ask AI"}
      </Button>
    </div>
  );
}
