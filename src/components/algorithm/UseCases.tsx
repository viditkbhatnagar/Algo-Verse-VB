import { CheckCircle2 } from "lucide-react";

interface UseCasesProps {
  useCases: string[];
}

export function UseCases({ useCases }: UseCasesProps) {
  if (useCases.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">Use Cases</h3>
      <ul className="space-y-2">
        {useCases.map((useCase, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
            <span>{useCase}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
