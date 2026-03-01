"use client";

import { FileText, Loader2, Check, AlertCircle } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  algorithmId: string;
}

export function NoteEditor({ algorithmId }: NoteEditorProps) {
  const { content, updateContent, saveStatus, isLoading } = useNotes(algorithmId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Notes</h2>
        </div>
        <SaveIndicator status={saveStatus} />
      </div>
      <div className="rounded-lg border border-border bg-surface/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-[150px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading notes...
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Write your notes about this algorithm... (supports Markdown)"
            className={cn(
              "w-full min-h-[150px] p-4 bg-transparent text-sm text-foreground",
              "placeholder:text-muted-foreground/50 resize-y",
              "focus:outline-none font-mono leading-relaxed"
            )}
          />
        )}
      </div>
    </div>
  );
}

function SaveIndicator({ status }: { status: string }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400">
        <Check className="h-3 w-3" />
        Saved
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1 text-xs text-red-400">
        <AlertCircle className="h-3 w-3" />
        Error saving
      </span>
    );
  }
  return null;
}
