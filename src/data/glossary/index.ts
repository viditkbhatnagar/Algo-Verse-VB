import type { GlossaryTermData } from "@/lib/visualization/types";

import { generalTerms } from "./terms/general";
import { dataStructuresTerms } from "./terms/data-structures";
import { sortingTerms } from "./terms/sorting";
import { searchingTerms } from "./terms/searching";
import { graphTerms } from "./terms/graph";
import { dynamicProgrammingTerms } from "./terms/dynamic-programming";
import { greedyTerms } from "./terms/greedy";
import { stringTerms } from "./terms/string";
import { mathematicalTerms } from "./terms/mathematical";
import { backtrackingTerms } from "./terms/backtracking";
import { machineLearningTerms } from "./terms/machine-learning";
import { deepLearningTerms } from "./terms/deep-learning";
import { nlpTerms } from "./terms/nlp";
import { reinforcementLearningTerms } from "./terms/reinforcement-learning";
import { optimizationTerms } from "./terms/optimization";

const allTermsArray: GlossaryTermData[] = [
  ...generalTerms,
  ...dataStructuresTerms,
  ...sortingTerms,
  ...searchingTerms,
  ...graphTerms,
  ...dynamicProgrammingTerms,
  ...greedyTerms,
  ...stringTerms,
  ...mathematicalTerms,
  ...backtrackingTerms,
  ...machineLearningTerms,
  ...deepLearningTerms,
  ...nlpTerms,
  ...reinforcementLearningTerms,
  ...optimizationTerms,
];

const termsBySlug = new Map<string, GlossaryTermData>(
  allTermsArray.map((t) => [t.slug, t])
);

export function getAllTerms(): GlossaryTermData[] {
  return allTermsArray;
}

export function getTermBySlug(slug: string): GlossaryTermData | undefined {
  return termsBySlug.get(slug);
}

export function getTermsByCategory(category: string): GlossaryTermData[] {
  return allTermsArray.filter((t) => t.category === category);
}

export function getTermsByLetter(letter: string): GlossaryTermData[] {
  return allTermsArray.filter((t) => {
    const firstChar = t.name?.[0];
    return typeof firstChar === "string" && firstChar.toUpperCase() === letter.toUpperCase();
  });
}
