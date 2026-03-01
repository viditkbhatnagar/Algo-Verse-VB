import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const sieveOfEratosthenes: AlgorithmMetadata = {
  id: "sieve-of-eratosthenes",
  name: "Sieve of Eratosthenes",
  category: "mathematical",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log log n)",
    average: "O(n log log n)",
    worst: "O(n log log n)",
    note: "One of the most efficient ways to find all primes up to a given limit. The log log n factor comes from the harmonic series of primes.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Requires an array of size n to mark composite numbers. Can be optimized to O(n/8) with bitwise storage.",
  },
  description: `The Sieve of Eratosthenes is an ancient and remarkably efficient algorithm for finding all prime numbers up to a specified integer n. Named after the Greek mathematician Eratosthenes of Cyrene (c. 276 BC - c. 194 BC), this algorithm works by iteratively marking the multiples of each prime number starting from 2.

The algorithm starts by creating a list of all integers from 2 to n and assuming they are all prime. It then takes the first unmarked number (2) and marks all of its multiples (4, 6, 8, ...) as composite (not prime). Next, it moves to the next unmarked number (3) and marks all of its multiples (9, 12, 15, ...) as composite. This process continues until it reaches a number greater than the square root of n, at which point all remaining unmarked numbers are guaranteed to be prime.

The key optimization that makes the sieve efficient is starting the marking process at p*p rather than 2*p for each prime p. This is because all smaller multiples of p have already been marked by smaller primes. For example, when processing prime 5, we start marking at 25 because 10 was already marked by 2, 15 by 3, and 20 by 2.

The time complexity of O(n log log n) makes the Sieve of Eratosthenes one of the fastest known methods for generating all primes in a range. The space requirement of O(n) can be reduced using a segmented sieve approach, which processes the range in smaller blocks that fit in cache memory. There are also wheel optimizations that skip multiples of small primes to further improve performance.

The sieve is widely used in competitive programming, cryptographic key generation (for finding prime candidates), and number theory research. It remains one of the most elegant algorithms ever devised, demonstrating that a simple idea from antiquity can still be highly relevant in modern computing.`,
  shortDescription:
    "An ancient algorithm that efficiently finds all prime numbers up to a given limit by iteratively marking multiples of each prime as composite.",
  pseudocode: `procedure sieveOfEratosthenes(n)
    isPrime = array of boolean [2..n], all set to true
    for p = 2 to sqrt(n) do
        if isPrime[p] then
            for multiple = p * p to n step p do
                isPrime[multiple] = false
            end for
        end if
    end for
    primes = []
    for i = 2 to n do
        if isPrime[i] then
            primes.append(i)
        end if
    end for
    return primes
end procedure`,
  implementations: {
    python: `def sieve_of_eratosthenes(n: int) -> list[int]:
    """Find all primes up to n using the Sieve of Eratosthenes."""
    if n < 2:
        return []

    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    p = 2
    while p * p <= n:
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False
        p += 1

    return [i for i in range(2, n + 1) if is_prime[i]]


# Example usage
if __name__ == "__main__":
    n = 50
    primes = sieve_of_eratosthenes(n)
    print(f"Primes up to {n}: {primes}")
    # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]`,
    javascript: `function sieveOfEratosthenes(n) {
  if (n < 2) return [];

  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let multiple = p * p; multiple <= n; multiple += p) {
        isPrime[multiple] = false;
      }
    }
  }

  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}

// Example usage
const n = 50;
console.log(\`Primes up to \${n}:\`, sieveOfEratosthenes(n));
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]`,
  },
  useCases: [
    "Generating prime numbers for cryptographic applications (RSA, Diffie-Hellman)",
    "Competitive programming problems involving prime factorization",
    "Precomputing primes for efficient divisibility testing",
    "Number theory research and mathematical experimentation",
    "Finding prime gaps and studying the distribution of primes",
  ],
  relatedAlgorithms: [
    "euclidean-gcd",
    "modular-exponentiation",
    "miller-rabin",
    "segmented-sieve",
  ],
  glossaryTerms: [
    "prime number",
    "composite number",
    "sieve",
    "number theory",
    "prime factorization",
    "fundamental theorem of arithmetic",
  ],
  tags: [
    "mathematical",
    "number-theory",
    "intermediate",
    "primes",
    "sieve",
    "classical",
  ],
};
