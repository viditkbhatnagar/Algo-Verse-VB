import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const kmp: AlgorithmMetadata = {
  id: "kmp",
  name: "KMP (Knuth-Morris-Pratt)",
  category: "string",
  subcategory: "Pattern Matching",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n + m)",
    note: "Preprocessing the pattern takes O(m) and matching takes O(n). The key insight is that the text pointer never moves backward.",
  },
  spaceComplexity: {
    best: "O(m)",
    average: "O(m)",
    worst: "O(m)",
    note: "Requires O(m) space for the failure/prefix function (LPS array) of the pattern.",
  },
  description: `The Knuth-Morris-Pratt (KMP) algorithm is a highly efficient string matching algorithm that improves upon the naive approach by avoiding redundant comparisons. When a mismatch occurs during pattern matching, instead of shifting the pattern by just one position and restarting comparisons, KMP uses information about previously matched characters to skip ahead intelligently.

The key innovation of KMP is the "failure function" or "longest proper prefix which is also a suffix" (LPS) array. This array is computed during a preprocessing phase and tells the algorithm, for each position in the pattern, the length of the longest proper prefix that is also a suffix of the pattern substring ending at that position. When a mismatch occurs at position j in the pattern, the LPS value at position j-1 indicates where to resume matching without moving the text pointer backward.

For example, if the pattern is "ABABCABAB" and we have matched "ABAB" before encountering a mismatch, the LPS table tells us that "AB" (length 2) is both a prefix and a suffix of "ABAB". So instead of starting over, we can continue matching from position 2 in the pattern, effectively sliding the pattern forward by 2 positions while retaining the knowledge that the first 2 characters already match.

The preprocessing phase runs in O(m) time, and the matching phase runs in O(n) time, giving an overall complexity of O(n + m). This is a significant improvement over the naive algorithm's O(n * m) worst case. KMP is particularly effective when the pattern contains repeated subpatterns, which is exactly the scenario where the naive algorithm performs worst.

KMP is widely used in text editors, grep utilities, DNA sequence analysis, and any application requiring efficient substring search. It forms the foundation for understanding more advanced string algorithms and automata-based pattern matching.`,
  shortDescription:
    "An efficient string matching algorithm that uses a precomputed failure function to skip redundant comparisons, achieving linear time complexity.",
  pseudocode: `procedure computeLPS(P: pattern) -> lps[]
    m = length(P)
    lps[0] = 0
    length = 0
    i = 1
    while i < m do
        if P[i] == P[length] then
            length = length + 1
            lps[i] = length
            i = i + 1
        else
            if length != 0 then
                length = lps[length - 1]
            else
                lps[i] = 0
                i = i + 1
            end if
        end if
    end while
    return lps

procedure KMPSearch(T: text, P: pattern)
    n = length(T)
    m = length(P)
    lps = computeLPS(P)
    i = 0   // index for text
    j = 0   // index for pattern
    while i < n do
        if P[j] == T[i] then
            i = i + 1
            j = j + 1
        end if
        if j == m then
            print "Found at index " + (i - j)
            j = lps[j - 1]
        else if i < n and P[j] != T[i] then
            if j != 0 then
                j = lps[j - 1]
            else
                i = i + 1
            end if
        end if
    end while
end procedure`,
  implementations: {
    python: `def compute_lps(pattern: str) -> list[int]:
    """Compute the Longest Proper Prefix which is also Suffix (LPS) array."""
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1

    return lps


def kmp_search(text: str, pattern: str) -> list[int]:
    """Find all occurrences of pattern in text using KMP algorithm."""
    n, m = len(text), len(pattern)
    lps = compute_lps(pattern)
    matches = []
    i = j = 0

    while i < n:
        if pattern[j] == text[i]:
            i += 1
            j += 1

        if j == m:
            matches.append(i - j)
            j = lps[j - 1]
        elif i < n and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

    return matches


# Example usage
if __name__ == "__main__":
    text = "ABABDABACDABABCABAB"
    pattern = "ABABCABAB"
    result = kmp_search(text, pattern)
    print(f"Pattern found at indices: {result}")  # [9]`,
    javascript: `function computeLPS(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let length = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

function kmpSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const lps = computeLPS(pattern);
  const matches = [];
  let i = 0, j = 0;

  while (i < n) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === m) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return matches;
}

// Example usage
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
console.log("Matches at:", kmpSearch(text, pattern)); // [9]`,
  },
  useCases: [
    "Text editors and search-and-replace functionality",
    "DNA sequence analysis for finding gene patterns",
    "Network intrusion detection for matching packet signatures",
    "Compiler lexical analysis for token recognition",
    "Large-scale log file searching and filtering",
  ],
  relatedAlgorithms: [
    "naive-string-matching",
    "rabin-karp",
    "boyer-moore",
    "z-algorithm",
    "aho-corasick",
  ],
  glossaryTerms: [
    "failure function",
    "prefix function",
    "LPS array",
    "proper prefix",
    "proper suffix",
    "pattern matching",
    "string search",
  ],
  tags: [
    "string",
    "pattern-matching",
    "advanced",
    "linear-time",
    "preprocessing",
    "failure-function",
  ],
};
