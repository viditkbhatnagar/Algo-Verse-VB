import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const naiveStringMatching: AlgorithmMetadata = {
  id: "naive-string-matching",
  name: "Naive String Matching",
  category: "string",
  subcategory: "Pattern Matching",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n * m)",
    worst: "O(n * m)",
    note: "Best case when the first character of the pattern never matches. n is text length, m is pattern length.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Only uses a constant amount of extra space for loop variables and index tracking.",
  },
  description: `The Naive String Matching algorithm is the simplest approach to finding all occurrences of a pattern within a text. It works by sliding the pattern one character at a time across the text and checking for a match at each position. At every position, it compares each character of the pattern against the corresponding character in the text, starting from the first character of the pattern.

The algorithm begins at position 0 in the text and attempts to match the entire pattern. If all characters match, a match is found at that position. If any character fails to match, the algorithm shifts the pattern one position to the right and begins comparison again from the first character of the pattern. This process continues until the pattern has been checked at every valid starting position in the text.

While the Naive algorithm has a worst-case time complexity of O(n * m), where n is the length of the text and m is the length of the pattern, it performs well in practice for many common inputs. The worst case occurs when the text and pattern share many common prefixes, such as searching for "AAAB" in "AAAAAAAAAA". In these cases, more sophisticated algorithms like KMP or Boyer-Moore provide significant speedups.

Despite its simplicity and potential inefficiency, the Naive approach has important advantages: it is extremely easy to understand and implement, it requires no preprocessing of the pattern, and it uses only constant extra space. It serves as an essential educational stepping stone before studying more advanced string matching algorithms.`,
  shortDescription:
    "The simplest pattern matching algorithm that slides the pattern across the text, comparing character by character at each position.",
  pseudocode: `procedure naiveStringMatch(T: text, P: pattern)
    n = length(T)
    m = length(P)
    for i = 0 to n - m do
        j = 0
        while j < m and T[i + j] == P[j] do
            j = j + 1
        end while
        if j == m then
            print "Pattern found at index " + i
        end if
    end for
end procedure`,
  implementations: {
    python: `def naive_string_match(text: str, pattern: str) -> list[int]:
    """Find all occurrences of pattern in text using naive matching."""
    n, m = len(text), len(pattern)
    matches = []

    for i in range(n - m + 1):
        j = 0
        while j < m and text[i + j] == pattern[j]:
            j += 1
        if j == m:
            matches.append(i)

    return matches


# Example usage
if __name__ == "__main__":
    text = "AABAACAADAABAABA"
    pattern = "AABA"
    result = naive_string_match(text, pattern)
    print(f"Pattern found at indices: {result}")  # [0, 9, 12]`,
    javascript: `function naiveStringMatch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const matches = [];

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) {
      matches.push(i);
    }
  }

  return matches;
}

// Example usage
const text = "AABAACAADAABAABA";
const pattern = "AABA";
console.log("Matches at:", naiveStringMatch(text, pattern)); // [0, 9, 12]`,
  },
  useCases: [
    "Simple text search where preprocessing overhead is not justified",
    "Educational tool for introducing string matching concepts",
    "Short patterns where the brute-force approach is efficient enough",
    "One-time search operations where the pattern will not be reused",
  ],
  relatedAlgorithms: [
    "kmp",
    "rabin-karp",
    "boyer-moore",
    "z-algorithm",
  ],
  glossaryTerms: [
    "pattern matching",
    "string search",
    "brute force",
    "sliding window",
    "text processing",
  ],
  tags: [
    "string",
    "pattern-matching",
    "brute-force",
    "beginner",
    "linear-scan",
  ],
};
