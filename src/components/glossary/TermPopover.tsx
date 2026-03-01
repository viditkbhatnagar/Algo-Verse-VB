"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { KaTeXRenderer } from "@/components/shared/KaTeXRenderer";
import { AskAIButton } from "./AskAIButton";
import type { GlossaryTermData } from "@/lib/visualization/types";

interface TermPopoverProps {
  term: GlossaryTermData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermPopover({ term, open, onOpenChange }: TermPopoverProps) {
  if (!term) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-background border-border">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-foreground">{term.name}</SheetTitle>
          <SheetDescription>
            <Badge
              variant="outline"
              className="text-xs bg-background border-border text-muted-foreground"
            >
              {term.category}
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Definition */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Definition
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {term.definition}
            </p>
          </div>

          {/* Formal Definition */}
          {term.formalDefinition && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Formal Definition
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {term.formalDefinition}
              </p>
            </div>
          )}

          {/* Formula */}
          {term.formula && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Formula
              </h4>
              <div className="rounded-md bg-surface/50 p-3">
                <KaTeXRenderer content={term.formula} className="text-foreground" />
              </div>
            </div>
          )}

          {/* Related Terms */}
          {term.relatedTerms.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Related Terms
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {term.relatedTerms.map((slug) => (
                  <Link
                    key={slug}
                    href={`/glossary/${slug}`}
                    onClick={() => onOpenChange(false)}
                    className="text-xs px-2 py-1 rounded-md bg-surface/50 border border-border text-accent hover:bg-surface hover:border-accent/50 transition-colors"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ask AI */}
          <AskAIButton term={term.name} context={term.definition} />

          {/* Full page link */}
          <div className="pt-2">
            <Link
              href={`/glossary/${term.slug}`}
              onClick={() => onOpenChange(false)}
              className="text-xs text-primary hover:underline"
            >
              View full definition →
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
