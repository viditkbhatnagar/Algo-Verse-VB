"use client";

import { useState, useCallback } from "react";
import { getTermBySlug } from "@/data/glossary";
import { TermPopover } from "./TermPopover";
import type { GlossaryTermData } from "@/lib/visualization/types";

interface GlossaryTermProps {
  slug: string;
  children: React.ReactNode;
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function GlossaryTermInline({ slug, children }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState<GlossaryTermData | null>(null);

  const handleClick = useCallback(() => {
    const resolved = getTermBySlug(slug) || getTermBySlug(nameToSlug(slug));
    if (resolved) {
      setTerm(resolved);
      setOpen(true);
    }
  }, [slug]);

  return (
    <>
      <button
        onClick={handleClick}
        className="border-b border-dashed border-accent/50 text-foreground hover:text-accent hover:border-accent transition-colors"
      >
        {children}
      </button>
      <TermPopover term={term} open={open} onOpenChange={setOpen} />
    </>
  );
}
