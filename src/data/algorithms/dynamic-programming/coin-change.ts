import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const coinChange: AlgorithmMetadata = {
  id: "coin-change",
  name: "Coin Change",
  category: "dynamic-programming",
  subcategory: "Classic",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * amount)",
    average: "O(n * amount)",
    worst: "O(n * amount)",
    note: "Where n is the number of coin denominations and 'amount' is the target sum. Each cell in the DP table is computed in O(1) amortized time across all coins, resulting in O(n * amount) total. The brute-force recursive approach without memoization is exponential.",
  },
  spaceComplexity: {
    best: "O(amount)",
    average: "O(amount)",
    worst: "O(amount)",
    note: "The 1D DP array stores one entry per possible amount from 0 to the target. Memoized recursive solutions also use O(amount) space for the cache plus O(amount) call stack depth.",
  },
  description: `The Coin Change problem asks: given a set of coin denominations and a target amount, what is the \
minimum number of coins needed to make that amount? If it is impossible to make the exact amount using the \
given denominations, the answer is -1. This problem is a cornerstone of dynamic programming education and \
appears frequently in coding interviews.

The DP formulation builds a 1D table dp[i] representing the minimum number of coins needed to make amount i. \
The base case is dp[0] = 0 (zero coins needed for amount zero). For each amount i from 1 to the target, we \
try every coin denomination c: if c <= i and dp[i - c] is not infinity, then dp[i] = min(dp[i], dp[i - c] + 1). \
The recurrence captures the idea that if we use coin c, we need one more coin than the optimal solution for \
amount (i - c).

The time complexity is O(n * amount) where n is the number of coin denominations. This is pseudo-polynomial \
because the input size of the amount is logarithmic in its value. The space complexity is O(amount) for the \
1D DP array. Unlike the 0/1 Knapsack, each coin can be used unlimited times (unbounded knapsack variant), \
so we iterate coins in the inner loop and use forward-facing updates.

The Coin Change problem has practical applications in currency systems, making change in vending machines, \
financial transactions, and resource allocation. Variants include counting the total number of ways to make \
change (coin change 2), finding the minimum coins with limited supply of each denomination, and the related \
stamp problem. The greedy approach (always use the largest coin first) does not always work for arbitrary \
coin systems, which is why DP is necessary for a correct general solution.`,
  shortDescription:
    "Finds the minimum number of coins from given denominations needed to make a target amount, using dynamic programming over a 1D table.",
  pseudocode: `function CoinChange(coins[], amount):
    // dp[i] = minimum coins to make amount i
    dp = array of size (amount + 1), initialized to infinity
    dp[0] = 0   // base case: 0 coins for amount 0

    for i from 1 to amount:
        for each coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1

    if dp[amount] == infinity:
        return -1   // impossible
    return dp[amount]`,
  implementations: {
    python: `from typing import List


def coin_change(coins: List[int], amount: int) -> int:
    """
    Find minimum coins needed to make the target amount.
    Returns -1 if the amount cannot be made with given coins.
    Bottom-up DP — O(n * amount) time, O(amount) space.
    """
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0  # base case

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1

    return dp[amount] if dp[amount] != float("inf") else -1


# Example usage
if __name__ == "__main__":
    coins = [1, 3, 4]
    amount = 6
    result = coin_change(coins, amount)
    print(f"Coins: {coins}, Amount: {amount}")
    print(f"Minimum coins: {result}")  # 2 (using two 3-coins)

    coins2 = [2]
    amount2 = 3
    result2 = coin_change(coins2, amount2)
    print(f"Coins: {coins2}, Amount: {amount2}")
    print(f"Minimum coins: {result2}")  # -1 (impossible)`,
    javascript: `/**
 * Find minimum coins needed to make the target amount.
 * Returns -1 if impossible.
 * Bottom-up DP — O(n * amount) time, O(amount) space.
 *
 * @param {number[]} coins - Available coin denominations
 * @param {number} amount - Target amount
 * @returns {number} Minimum number of coins, or -1
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // base case

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Example usage
const coins = [1, 3, 4];
const amount = 6;
console.log(\`Coins: [\${coins}], Amount: \${amount}\`);
console.log(\`Minimum coins: \${coinChange(coins, amount)}\`); // 2

const coins2 = [2];
const amount2 = 3;
console.log(\`Coins: [\${coins2}], Amount: \${amount2}\`);
console.log(\`Minimum coins: \${coinChange(coins2, amount2)}\`); // -1`,
  },
  useCases: [
    "Making change in vending machines and cash registers with minimal coins",
    "Financial transaction optimization in payment processing systems",
    "Resource allocation: distributing discrete units to minimize total count",
    "Teaching dynamic programming: unbounded knapsack variant and 1D DP",
    "Proving that greedy algorithms are not always optimal for arbitrary coin systems",
  ],
  relatedAlgorithms: [
    "climbing-stairs",
    "knapsack",
    "fibonacci",
    "unbounded-knapsack",
  ],
  glossaryTerms: [
    "dynamic programming",
    "memoization",
    "tabulation",
    "unbounded knapsack",
    "pseudo-polynomial",
    "optimal substructure",
    "overlapping subproblems",
    "greedy algorithm",
  ],
  tags: [
    "dynamic-programming",
    "classic",
    "intermediate",
    "unbounded-knapsack",
    "1D-table",
    "optimization",
  ],
};
