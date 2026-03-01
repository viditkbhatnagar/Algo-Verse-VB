import { cn } from "@/lib/utils";

interface PseudocodeBlockProps {
  pseudocode: string;
  highlightedLine?: number;
}

export function PseudocodeBlock({ pseudocode, highlightedLine }: PseudocodeBlockProps) {
  const lines = pseudocode.split("\n");

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">Pseudocode</h3>
      <div className="rounded-md border border-border bg-surface/50 overflow-x-auto">
        <pre className="p-4 text-sm font-mono">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                highlightedLine === i + 1 && "bg-primary/20 -mx-4 px-4 rounded"
              )}
            >
              <span className="select-none text-muted-foreground/40 w-8 shrink-0 text-right mr-4">
                {i + 1}
              </span>
              <span className="text-foreground/90">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
