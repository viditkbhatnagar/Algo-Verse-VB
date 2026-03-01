import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const editDistance: AlgorithmMetadata = {
  id: "edit-distance",
  name: "Edit Distance (Levenshtein Distance)",
  category: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(m * n)",
    average: "O(m * n)",
    worst: "O(m * n)",
    note: "Where m and n are the lengths of the two input strings. Every cell in the DP table must be filled, so there is no early termination. A space-optimized version can reduce space to O(min(m, n)) but time remains the same.",
  },
  spaceComplexity: {
    best: "O(m * n)",
    average: "O(m * n)",
    worst: "O(m * n)",
    note: "The standard approach uses a full (m+1) x (n+1) table. A rolling-array optimization reduces space to O(min(m, n)) by keeping only two rows at a time, but loses the ability to reconstruct the edit sequence.",
  },
  description: `The Edit Distance (also known as Levenshtein Distance) measures the minimum number of single-character \
operations required to transform one string into another. The three permitted operations are insertion, \
deletion, and substitution (replacement). This metric is fundamental in computational linguistics, \
spell checking, DNA sequence alignment, and many areas of natural language processing.

The dynamic programming solution builds a 2D table dp[i][j] where each cell represents the minimum \
edit distance between the first i characters of word1 and the first j characters of word2. The base \
cases are straightforward: transforming an empty string into a string of length j requires j insertions \
(dp[0][j] = j), and transforming a string of length i into an empty string requires i deletions \
(dp[i][0] = i).

For the general case, if the characters at positions i and j match (word1[i-1] == word2[j-1]), no \
operation is needed, so dp[i][j] = dp[i-1][j-1]. If they differ, we take the minimum of three options: \
dp[i-1][j] + 1 (delete from word1), dp[i][j-1] + 1 (insert into word1), or dp[i-1][j-1] + 1 (replace \
the character in word1). The final answer is found at dp[m][n].

After filling the table, we can backtrack from dp[m][n] to dp[0][0] to reconstruct the actual sequence \
of edit operations. This backtracking follows the path of optimal decisions: moving diagonally indicates \
a match or substitution, moving left indicates an insertion, and moving up indicates a deletion. Edit \
distance has applications in spell checkers, DNA sequence alignment (where it is closely related to the \
Needleman-Wunsch algorithm), plagiarism detection, and diff utilities.`,
  shortDescription:
    "Computes the minimum number of insertions, deletions, and substitutions needed to transform one string into another using a 2D DP table.",
  pseudocode: `function EditDistance(word1, word2):
    m = length(word1)
    n = length(word2)
    dp = 2D array of size (m+1) x (n+1)

    // Base cases
    for i from 0 to m:
        dp[i][0] = i        // i deletions
    for j from 0 to n:
        dp[0][j] = j        // j insertions

    // Fill table
    for i from 1 to m:
        for j from 1 to n:
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]         // match, no cost
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],      // delete
                    dp[i][j-1],      // insert
                    dp[i-1][j-1]     // replace
                )

    return dp[m][n]`,
  implementations: {
    python: `def edit_distance(word1: str, word2: str) -> int:
    """Compute minimum edit distance between two strings."""
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # delete
                    dp[i][j - 1],      # insert
                    dp[i - 1][j - 1],  # replace
                )

    return dp[m][n]


def get_edit_operations(word1: str, word2: str):
    """Return the list of edit operations to transform word1 into word2."""
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])

    # Backtrack to find operations
    ops = []
    i, j = m, n
    while i > 0 or j > 0:
        if i > 0 and j > 0 and word1[i - 1] == word2[j - 1]:
            ops.append(("match", word1[i - 1]))
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i - 1][j - 1] + 1:
            ops.append(("replace", word1[i - 1], word2[j - 1]))
            i -= 1
            j -= 1
        elif j > 0 and dp[i][j] == dp[i][j - 1] + 1:
            ops.append(("insert", word2[j - 1]))
            j -= 1
        else:
            ops.append(("delete", word1[i - 1]))
            i -= 1

    return list(reversed(ops))


# Example
if __name__ == "__main__":
    w1, w2 = "kitten", "sitting"
    print(f"Edit distance('{w1}', '{w2}') = {edit_distance(w1, w2)}")
    for op in get_edit_operations(w1, w2):
        print(op)`,
    javascript: `/**
 * Compute minimum edit distance between two strings.
 * @param {string} word1
 * @param {string} word2
 * @returns {number}
 */
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],      // delete
          dp[i][j - 1],      // insert
          dp[i - 1][j - 1],  // replace
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Return the sequence of edit operations.
 * @param {string} word1
 * @param {string} word2
 * @returns {Array}
 */
function getEditOperations(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
      ops.push({ type: "match", char: word1[i - 1] });
      i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.push({ type: "replace", from: word1[i - 1], to: word2[j - 1] });
      i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      ops.push({ type: "insert", char: word2[j - 1] });
      j--;
    } else {
      ops.push({ type: "delete", char: word1[i - 1] });
      i--;
    }
  }

  return ops.reverse();
}

// Example
const w1 = "kitten", w2 = "sitting";
console.log(\`Edit distance('\${w1}', '\${w2}') = \${editDistance(w1, w2)}\`);
console.log(getEditOperations(w1, w2));`,
  },
  useCases: [
    "Spell checking and autocorrect systems that suggest closest dictionary words",
    "DNA and protein sequence alignment in bioinformatics (closely related to Needleman-Wunsch)",
    "Plagiarism detection by measuring similarity between documents",
    "Natural language processing tasks like fuzzy string matching and entity resolution",
    "Diff utilities that compute minimal changes between file versions",
  ],
  relatedAlgorithms: [
    "longest-common-subsequence",
    "knapsack",
    "lis",
    "fibonacci",
  ],
  glossaryTerms: [
    "dynamic programming",
    "edit distance",
    "Levenshtein distance",
    "string matching",
    "optimal substructure",
    "backtracking",
    "tabulation",
  ],
  tags: [
    "dynamic-programming",
    "string",
    "intermediate",
    "classic",
    "2D-table",
    "backtracking",
  ],
};
