"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { GlossaryTermData } from "@/lib/visualization/types";

interface TermCardProps {
  term: GlossaryTermData;
}

export function TermCard({ term }: TermCardProps) {
  return (
    <Link
      href={`/glossary/${term.slug}`}
      className="group block rounded-lg border border-border bg-surface/30 p-4 transition-colors hover:bg-surface/60 hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {term.name}
        </h3>
        <Badge
          variant="outline"
          className="text-[10px] shrink-0 bg-background border-border text-muted-foreground"
        >
          {term.category}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {term.definition}
      </p>
    </Link>
  );
}
