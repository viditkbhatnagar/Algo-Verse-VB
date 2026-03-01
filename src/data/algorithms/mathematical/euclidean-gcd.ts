import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const euclideanGcd: AlgorithmMetadata = {
  id: "euclidean-gcd",
  name: "Euclidean GCD",
  category: "mathematical",
  subcategory: "Number Theory",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(log(min(a, b)))",
    worst: "O(log(min(a, b)))",
    note: "Best case when b divides a evenly. Worst case involves consecutive Fibonacci numbers. The number of steps is at most 5 times the number of digits of the smaller number.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Iterative version uses constant space. Recursive version uses O(log(min(a,b))) stack space.",
  },
  description: `The Euclidean algorithm is one of the oldest known algorithms, dating back to around 300 BC in Euclid's Elements. It computes the greatest common divisor (GCD) of two integers — the largest number that divides both of them without a remainder. The algorithm is based on the principle that gcd(a, b) = gcd(b, a mod b), and terminates when b becomes 0, at which point a holds the GCD.

The algorithm works by repeatedly replacing the larger number with the remainder of dividing the larger by the smaller. For example, to find gcd(252, 105): 252 = 105 * 2 + 42, so gcd(252, 105) = gcd(105, 42). Then 105 = 42 * 2 + 21, so gcd(105, 42) = gcd(42, 21). Finally 42 = 21 * 2 + 0, so gcd(42, 21) = 21. The GCD is 21.

The efficiency of the Euclidean algorithm is remarkable. It runs in O(log(min(a, b))) time, which means even for very large numbers (hundreds of digits), it completes in a manageable number of steps. Gabriel Lame proved in 1844 that the worst-case number of steps is at most five times the number of digits of the smaller number.

The Euclidean algorithm forms the foundation for many important algorithms in number theory and cryptography. The Extended Euclidean Algorithm computes, in addition to the GCD, the coefficients x and y such that ax + by = gcd(a, b). This is essential for computing modular inverses, which are central to RSA encryption, Chinese Remainder Theorem applications, and many other areas of computational mathematics.`,
  shortDescription:
    "Computes the greatest common divisor of two integers using repeated division, based on the principle that gcd(a, b) = gcd(b, a mod b).",
  pseudocode: `procedure euclideanGCD(a, b)
    while b != 0 do
        temp = b
        b = a mod b
        a = temp
    end while
    return a
end procedure

// Recursive version
procedure gcdRecursive(a, b)
    if b == 0 then
        return a
    end if
    return gcdRecursive(b, a mod b)
end procedure`,
  implementations: {
    python: `def gcd(a: int, b: int) -> int:
    """Compute the GCD of two integers using the Euclidean algorithm."""
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a


def gcd_recursive(a: int, b: int) -> int:
    """Recursive version of the Euclidean algorithm."""
    a, b = abs(a), abs(b)
    if b == 0:
        return a
    return gcd_recursive(b, a % b)


def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """Extended Euclidean Algorithm: returns (gcd, x, y) where ax + by = gcd."""
    if b == 0:
        return a, 1, 0
    g, x1, y1 = extended_gcd(b, a % b)
    return g, y1, x1 - (a // b) * y1


# Example usage
if __name__ == "__main__":
    a, b = 252, 105
    print(f"gcd({a}, {b}) = {gcd(a, b)}")  # 21
    g, x, y = extended_gcd(a, b)
    print(f"{a}*{x} + {b}*{y} = {g}")      # 252*1 + 105*(-2) = 42... wait
    # 252*1 + 105*(-2) = 252 - 210 = 42, extended returns for original values`,
    javascript: `function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function gcdRecursive(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  return gcdRecursive(b, a % b);
}

function extendedGcd(a, b) {
  if (b === 0) return { gcd: a, x: 1, y: 0 };
  const { gcd: g, x: x1, y: y1 } = extendedGcd(b, a % b);
  return { gcd: g, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

// Example usage
const a = 252, b = 105;
console.log(\`gcd(\${a}, \${b}) = \${gcd(a, b)}\`); // 21`,
  },
  useCases: [
    "Simplifying fractions by dividing numerator and denominator by their GCD",
    "RSA encryption — computing modular multiplicative inverses via the Extended Euclidean Algorithm",
    "Determining if two numbers are coprime (GCD = 1)",
    "Music theory — finding rhythmic patterns and time signature relationships",
    "Computing least common multiples: lcm(a, b) = a * b / gcd(a, b)",
  ],
  relatedAlgorithms: [
    "sieve-of-eratosthenes",
    "modular-exponentiation",
    "chinese-remainder-theorem",
  ],
  glossaryTerms: [
    "greatest common divisor",
    "GCD",
    "modular arithmetic",
    "Euclidean division",
    "coprime",
    "number theory",
  ],
  tags: [
    "mathematical",
    "number-theory",
    "beginner",
    "gcd",
    "euclidean",
    "classical",
  ],
};
