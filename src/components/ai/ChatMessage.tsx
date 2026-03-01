"use client";

import { User, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-2 max-w-[85%]">
          <div className="rounded-lg bg-primary/20 px-3 py-2">
            <p className="text-sm text-foreground">{content}</p>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2 max-w-[85%]">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="rounded-lg bg-surface/50 px-3 py-2">
          <MarkdownRenderer content={content} className="text-sm" />
        </div>
      </div>
    </div>
  );
}
