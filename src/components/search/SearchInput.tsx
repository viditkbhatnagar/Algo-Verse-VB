"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search algorithms, terms, categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        autoFocus
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
}
