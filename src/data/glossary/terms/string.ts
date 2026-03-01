import type { GlossaryTermData } from "@/lib/visualization/types";

export const stringTerms: GlossaryTermData[] = [
  {
    slug: "string-matching",
    name: "String Matching",
    definition:
      "String matching is the problem of finding all occurrences of a pattern string within a larger text string. It is one of the most fundamental problems in computer science, with applications in text editors, search engines, bioinformatics, and data mining. Algorithms range from the naive O(nm) approach to sophisticated linear-time methods.",
    relatedTerms: ["pattern", "text", "substring", "kmp-algorithm", "rabin-karp-algorithm", "boyer-moore-algorithm"],
    category: "string",
    tags: ["fundamental", "search", "pattern-matching"],
  },
  {
    slug: "pattern",
    name: "Pattern",
    definition:
      "In the context of string algorithms, a pattern is the shorter string that you are searching for within a larger text. The goal of most string matching algorithms is to find every position in the text where this pattern occurs. The length of the pattern is typically denoted as $m$.",
    formula: "Pattern length: $m$, where $m \\leq n$ (text length)",
    relatedTerms: ["text", "string-matching", "substring", "regular-expression"],
    category: "string",
    tags: ["concept", "input", "search"],
  },
  {
    slug: "text",
    name: "Text",
    definition:
      "In string matching, the text (also called the haystack) is the larger string in which you search for occurrences of a pattern. The text has length $n$, and the goal is to report all positions where the pattern appears. Efficient algorithms preprocess either the pattern or the text to speed up the search.",
    formula: "Text length: $n$, where $n \\geq m$ (pattern length)",
    relatedTerms: ["pattern", "string-matching", "substring", "suffix-array"],
    category: "string",
    tags: ["concept", "input", "search"],
  },
  {
    slug: "substring",
    name: "Substring",
    definition:
      "A substring is a contiguous sequence of characters within a string. For a string $S$ of length $n$, the substring from index $i$ to $j$ is written as $S[i..j]$. Substrings are central to pattern matching, where you check whether the pattern is a substring of the text. A string of length $n$ has $O(n^2)$ distinct substrings.",
    formalDefinition:
      "For string $S = s_1 s_2 \\ldots s_n$, a substring $S[i..j] = s_i s_{i+1} \\ldots s_j$ where $1 \\leq i \\leq j \\leq n$.",
    formula: "Number of substrings: $\\frac{n(n+1)}{2}$",
    relatedTerms: ["suffix", "prefix", "string-matching", "longest-common-prefix"],
    category: "string",
    tags: ["concept", "fundamental", "contiguous"],
  },
  {
    slug: "suffix",
    name: "Suffix",
    definition:
      "A suffix of a string $S$ is a substring that extends to the end of $S$. The suffix starting at position $i$ is $S[i..n]$. Suffixes are the building blocks of powerful data structures like suffix arrays and suffix trees, which enable fast substring searches and many other string operations.",
    formalDefinition:
      "For string $S = s_1 s_2 \\ldots s_n$, the $i$-th suffix is $S[i..n] = s_i s_{i+1} \\ldots s_n$.",
    relatedTerms: ["prefix", "substring", "suffix-array", "longest-common-prefix"],
    category: "string",
    tags: ["concept", "fundamental", "structure"],
  },
  {
    slug: "prefix",
    name: "Prefix",
    definition:
      "A prefix of a string $S$ is a substring that starts from the beginning of $S$. The prefix of length $k$ is $S[1..k]$. Prefixes play a key role in algorithms like KMP, where the failure function tracks the longest proper prefix that is also a suffix of each pattern prefix.",
    formalDefinition:
      "For string $S = s_1 s_2 \\ldots s_n$, the prefix of length $k$ is $S[1..k] = s_1 s_2 \\ldots s_k$, where $0 \\leq k \\leq n$.",
    relatedTerms: ["suffix", "substring", "kmp-algorithm", "longest-common-prefix"],
    category: "string",
    tags: ["concept", "fundamental", "structure"],
  },
  {
    slug: "naive-string-matching",
    name: "Naive String Matching",
    definition:
      "The naive (brute-force) string matching algorithm checks every possible position in the text for a match with the pattern. It slides the pattern one position at a time across the text and compares characters one by one. It is simple to implement but inefficient for large inputs because it does not reuse information from previous comparisons.",
    formula: "Time: $O((n - m + 1) \\cdot m)$ worst case, where $n$ = text length, $m$ = pattern length. Space: $O(1)$",
    relatedTerms: ["string-matching", "kmp-algorithm", "rabin-karp-algorithm", "pattern", "text"],
    category: "string",
    tags: ["algorithm", "brute-force", "simple"],
  },
  {
    slug: "kmp-algorithm",
    name: "KMP Algorithm",
    definition:
      "The Knuth-Morris-Pratt (KMP) algorithm is a linear-time string matching algorithm that avoids redundant comparisons by using a failure function (also called the prefix function). When a mismatch occurs, the failure function tells the algorithm how far to shift the pattern without missing any potential matches, so no character in the text is ever re-examined.",
    formalDefinition:
      "The failure function $\\pi[i]$ gives the length of the longest proper prefix of $P[1..i]$ that is also a suffix of $P[1..i]$.",
    formula: "Preprocessing: $O(m)$. Matching: $O(n)$. Total: $O(n + m)$. Space: $O(m)$",
    relatedTerms: ["string-matching", "prefix", "naive-string-matching", "z-algorithm"],
    category: "string",
    tags: ["algorithm", "linear-time", "prefix-function", "classic"],
  },
  {
    slug: "rabin-karp-algorithm",
    name: "Rabin-Karp Algorithm",
    definition:
      "The Rabin-Karp algorithm uses hashing to speed up string matching. It computes a hash of the pattern and a rolling hash of each text window of the same length, comparing hashes instead of characters. When hashes match, it verifies with a character-by-character comparison. It is especially useful for searching multiple patterns simultaneously.",
    formula: "Average: $O(n + m)$. Worst (many hash collisions): $O(nm)$. Space: $O(1)$ extra",
    relatedTerms: ["string-matching", "naive-string-matching", "kmp-algorithm", "pattern"],
    category: "string",
    tags: ["algorithm", "hashing", "rolling-hash", "probabilistic"],
  },
  {
    slug: "boyer-moore-algorithm",
    name: "Boyer-Moore Algorithm",
    definition:
      "The Boyer-Moore algorithm is a highly efficient string matching algorithm that works by comparing the pattern from right to left. It uses two heuristics — the bad character rule and the good suffix rule — to skip large sections of the text. In practice, it is often the fastest single-pattern matching algorithm, especially for longer patterns and large alphabets.",
    formula: "Best case: $O(n/m)$ (sub-linear). Worst case: $O(nm)$, but $O(n)$ with the Galil rule",
    relatedTerms: ["string-matching", "kmp-algorithm", "naive-string-matching", "pattern"],
    category: "string",
    tags: ["algorithm", "right-to-left", "heuristic", "fast"],
  },
  {
    slug: "z-algorithm",
    name: "Z Algorithm",
    definition:
      "The Z algorithm computes, for each position $i$ in a string, the length of the longest substring starting at $i$ that matches a prefix of the string. This Z-array can be built in linear time and provides an elegant alternative to KMP for string matching: by concatenating the pattern, a separator, and the text, positions where $Z[i]$ equals the pattern length indicate matches.",
    formalDefinition:
      "For string $S$, $Z[i]$ = length of the longest substring starting at $S[i]$ that is also a prefix of $S$, with $Z[0]$ undefined or set to $n$.",
    formula: "Time: $O(n)$. Space: $O(n)$",
    relatedTerms: ["kmp-algorithm", "string-matching", "prefix", "longest-common-prefix"],
    category: "string",
    tags: ["algorithm", "linear-time", "prefix-matching"],
  },
  {
    slug: "suffix-array",
    name: "Suffix Array",
    definition:
      "A suffix array is a sorted array of all suffixes of a string, represented by their starting indices. It provides a space-efficient alternative to suffix trees and supports fast substring searching via binary search. Combined with the LCP array, suffix arrays can solve many complex string problems efficiently.",
    formalDefinition:
      "For string $S$ of length $n$, the suffix array $SA$ is a permutation of $\\{0, 1, \\ldots, n-1\\}$ such that $S[SA[i]..n] < S[SA[i+1]..n]$ lexicographically.",
    formula: "Construction: $O(n \\log n)$ or $O(n)$ (SA-IS). Search: $O(m \\log n)$. Space: $O(n)$",
    relatedTerms: ["suffix", "longest-common-prefix", "substring", "text"],
    category: "string",
    tags: ["data-structure", "suffix", "efficient", "indexing"],
  },
  {
    slug: "regular-expression",
    name: "Regular Expression",
    definition:
      "A regular expression (regex) is a sequence of characters that defines a search pattern. It can describe sets of strings using operators like concatenation, alternation (|), and Kleene star (*). Regular expressions are compiled into finite automata for efficient matching and are widely used in text processing, validation, and lexical analysis.",
    relatedTerms: ["automaton", "pattern", "string-matching", "text"],
    category: "string",
    tags: ["pattern", "formal-language", "matching", "text-processing"],
  },
  {
    slug: "automaton",
    name: "Automaton",
    definition:
      "A finite automaton is an abstract computational model with a finite number of states and transitions between them based on input symbols. In string algorithms, automata are used to implement pattern matching: a deterministic finite automaton (DFA) built from a pattern can scan the text in a single pass, processing each character in constant time.",
    formalDefinition:
      "A DFA is a 5-tuple $(Q, \\Sigma, \\delta, q_0, F)$: states $Q$, alphabet $\\Sigma$, transition function $\\delta$, start state $q_0$, and accepting states $F$.",
    formula: "DFA matching: $O(n)$ time after $O(m|\\Sigma|)$ preprocessing",
    relatedTerms: ["regular-expression", "string-matching", "kmp-algorithm", "pattern"],
    category: "string",
    tags: ["theory", "formal-language", "state-machine", "dfa"],
  },
  {
    slug: "longest-common-prefix",
    name: "Longest Common Prefix",
    definition:
      "The Longest Common Prefix (LCP) array stores, for each pair of consecutive suffixes in a sorted suffix array, the length of their longest common prefix. The LCP array is a powerful companion to the suffix array, enabling efficient solutions to problems like longest repeated substring, number of distinct substrings, and string comparisons.",
    formalDefinition:
      "Given suffix array $SA$, $LCP[i]$ = length of the longest common prefix between suffixes $S[SA[i-1]..n]$ and $S[SA[i]..n]$.",
    formula: "Construction (Kasai's algorithm): $O(n)$ time and space",
    relatedTerms: ["suffix-array", "suffix", "prefix", "substring"],
    category: "string",
    tags: ["data-structure", "suffix", "prefix", "auxiliary"],
  },
];
