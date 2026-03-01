import type { GlossaryTermData } from "@/lib/visualization/types";

export const greedyTerms: GlossaryTermData[] = [
  {
    slug: "greedy-algorithm",
    name: "Greedy Algorithm",
    definition:
      "A greedy algorithm makes the locally optimal choice at each step with the hope of finding a globally optimal solution. It never reconsiders past choices. Greedy algorithms work correctly when the problem has the greedy choice property and optimal substructure.",
    relatedTerms: ["greedy-choice-property", "locally-optimal", "globally-optimal", "optimal-substructure"],
    category: "greedy",
    tags: ["greedy", "strategy", "optimization"],
  },
  {
    slug: "greedy-choice-property",
    name: "Greedy Choice Property",
    definition:
      "The greedy choice property states that a globally optimal solution can be reached by making a locally optimal (greedy) choice at each step. If a problem has this property, you never need to reconsider earlier decisions to arrive at the best overall answer.",
    relatedTerms: ["greedy-algorithm", "optimal-substructure", "exchange-argument"],
    category: "greedy",
    tags: ["greedy", "property", "proof"],
  },
  {
    slug: "matroid",
    name: "Matroid",
    definition:
      "A matroid is a combinatorial structure that generalizes the notion of linear independence. When a problem can be modeled as optimizing a weight function over a matroid, a greedy algorithm is guaranteed to find the optimal solution. Examples include spanning trees and certain scheduling problems.",
    formalDefinition:
      "A matroid $M = (E, \\mathcal{I})$ consists of a finite set $E$ and a family of independent sets $\\mathcal{I}$ satisfying: (1) $\\emptyset \\in \\mathcal{I}$, (2) hereditary property, and (3) exchange property.",
    relatedTerms: ["greedy-algorithm", "minimum-spanning-tree", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "theory", "combinatorics", "math"],
  },
  {
    slug: "activity-selection",
    name: "Activity Selection",
    definition:
      "The activity selection problem asks for the maximum number of non-overlapping activities that can be scheduled, given their start and finish times. The greedy strategy of always picking the activity that finishes earliest yields an optimal solution.",
    relatedTerms: ["greedy-algorithm", "interval-scheduling", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "classic", "scheduling"],
  },
  {
    slug: "fractional-knapsack",
    name: "Fractional Knapsack",
    definition:
      "The fractional knapsack problem allows you to take fractions of items (unlike the 0/1 knapsack). The greedy approach sorts items by value-to-weight ratio and greedily fills the knapsack with the highest-ratio items first, achieving an optimal solution in $O(n \\log n)$ time.",
    formula: "Sort by $\\frac{v_i}{w_i}$ in decreasing order, then greedily fill capacity",
    relatedTerms: ["greedy-algorithm", "greedy-choice-property", "locally-optimal"],
    category: "greedy",
    tags: ["greedy", "classic", "knapsack", "optimization"],
  },
  {
    slug: "huffman-coding",
    name: "Huffman Coding",
    definition:
      "Huffman coding is a greedy algorithm that builds an optimal prefix-free binary code for data compression. It repeatedly merges the two least-frequent symbols into a single node, building a binary tree from the bottom up. More frequent characters get shorter codes.",
    relatedTerms: ["greedy-algorithm", "optimal-merge-pattern", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "classic", "compression", "tree"],
  },
  {
    slug: "greedy-minimum-spanning-tree",
    name: "Minimum Spanning Tree",
    definition:
      "A minimum spanning tree connects all vertices of a weighted, undirected graph with the least total edge weight. Both Kruskal's and Prim's algorithms use greedy strategies: Kruskal's greedily picks the lightest edge that doesn't form a cycle, while Prim's greedily grows the tree from a vertex.",
    relatedTerms: ["greedy-algorithm", "matroid", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "graph", "mst", "optimization"],
  },
  {
    slug: "greedy-coloring",
    name: "Greedy Coloring",
    definition:
      "Greedy coloring assigns colors to graph vertices one by one, giving each vertex the smallest color not used by its already-colored neighbors. While it does not always use the minimum number of colors, it provides a simple and fast heuristic for graph coloring problems.",
    relatedTerms: ["greedy-algorithm", "locally-optimal"],
    category: "greedy",
    tags: ["greedy", "graph", "coloring", "heuristic"],
  },
  {
    slug: "interval-scheduling",
    name: "Interval Scheduling",
    definition:
      "Interval scheduling is a family of problems involving the selection or arrangement of intervals on a timeline. The basic form (maximize non-overlapping intervals) is solved greedily by earliest finish time. Weighted variants require dynamic programming instead.",
    relatedTerms: ["activity-selection", "greedy-algorithm", "job-sequencing"],
    category: "greedy",
    tags: ["greedy", "scheduling", "intervals"],
  },
  {
    slug: "job-sequencing",
    name: "Job Sequencing",
    definition:
      "The job sequencing problem asks how to schedule jobs with deadlines and profits to maximize total profit, where each job takes one unit of time. The greedy approach sorts jobs by profit in decreasing order and assigns each job to the latest available slot before its deadline.",
    relatedTerms: ["greedy-algorithm", "activity-selection", "interval-scheduling"],
    category: "greedy",
    tags: ["greedy", "classic", "scheduling", "optimization"],
  },
  {
    slug: "optimal-merge-pattern",
    name: "Optimal Merge Pattern",
    definition:
      "The optimal merge pattern finds the minimum-cost way to merge a set of sorted files (or lists) into a single sorted file, where the cost of merging two files is the sum of their sizes. The greedy strategy always merges the two smallest files first, similar to Huffman coding.",
    relatedTerms: ["huffman-coding", "greedy-algorithm", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "classic", "merging", "optimization"],
  },
  {
    slug: "locally-optimal",
    name: "Locally Optimal",
    definition:
      "A locally optimal choice is the best option available at the current step without considering future consequences. Greedy algorithms rely on locally optimal choices, and their correctness depends on whether such choices lead to a globally optimal solution for the given problem.",
    relatedTerms: ["globally-optimal", "greedy-algorithm", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "concept", "optimization"],
  },
  {
    slug: "globally-optimal",
    name: "Globally Optimal",
    definition:
      "A globally optimal solution is the best possible solution to the entire problem, considering all choices together. The key question in greedy algorithm design is whether a sequence of locally optimal choices always produces a globally optimal result.",
    relatedTerms: ["locally-optimal", "greedy-algorithm", "greedy-choice-property"],
    category: "greedy",
    tags: ["greedy", "concept", "optimization"],
  },
  {
    slug: "exchange-argument",
    name: "Exchange Argument",
    definition:
      "The exchange argument is a proof technique used to show that a greedy algorithm is optimal. It works by taking any optimal solution and showing that you can swap (exchange) elements to match the greedy solution without worsening the objective, thereby proving the greedy solution is also optimal.",
    relatedTerms: ["greedy-choice-property", "greedy-stays-ahead", "greedy-algorithm"],
    category: "greedy",
    tags: ["greedy", "proof", "technique"],
  },
  {
    slug: "greedy-stays-ahead",
    name: "Greedy Stays Ahead",
    definition:
      "Greedy stays ahead is a proof technique that shows a greedy algorithm is optimal by demonstrating that at every step, the greedy solution is at least as good as any other solution. By induction, the greedy solution \"stays ahead\" throughout and is therefore optimal at the end.",
    relatedTerms: ["exchange-argument", "greedy-choice-property", "greedy-algorithm"],
    category: "greedy",
    tags: ["greedy", "proof", "technique"],
  },
];
