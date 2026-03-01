import {
  Database,
  ArrowUpDown,
  Search,
  GitBranch,
  Table2,
  Zap,
  Split,
  Type,
  Calculator,
  Undo2,
  Brain,
  Cpu,
  MessageSquare,
  Gamepad2,
  TrendingUp,
  Puzzle,
  type LucideProps,
} from "lucide-react";
import type { Category } from "@/lib/visualization/types";

const iconMap: Record<Category, React.ComponentType<LucideProps>> = {
  "data-structures": Database,
  sorting: ArrowUpDown,
  searching: Search,
  graph: GitBranch,
  "dynamic-programming": Table2,
  greedy: Zap,
  "divide-and-conquer": Split,
  string: Type,
  mathematical: Calculator,
  backtracking: Undo2,
  "machine-learning": Brain,
  "deep-learning": Cpu,
  nlp: MessageSquare,
  "reinforcement-learning": Gamepad2,
  optimization: TrendingUp,
  miscellaneous: Puzzle,
};

interface CategoryIconProps extends LucideProps {
  category: Category;
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  const Icon = iconMap[category];
  return <Icon {...props} />;
}
