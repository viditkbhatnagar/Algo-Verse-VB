import type { GlossaryTermData } from "@/lib/visualization/types";

export const mathematicalTerms: GlossaryTermData[] = [
  {
    slug: "greatest-common-divisor",
    name: "Greatest Common Divisor",
    definition:
      "The greatest common divisor (GCD) of two integers is the largest positive integer that divides both numbers without leaving a remainder. It is a fundamental concept in number theory and is used in simplifying fractions, modular arithmetic, and many algorithmic problems. The GCD can be computed efficiently using the Euclidean algorithm.",
    formalDefinition:
      "For integers $a$ and $b$, $\\gcd(a, b) = \\max\\{d \\in \\mathbb{Z}^+ : d \\mid a \\text{ and } d \\mid b\\}$.",
    formula: "$\\gcd(a, b) = \\gcd(b, a \\mod b)$, with $\\gcd(a, 0) = a$",
    relatedTerms: ["least-common-multiple", "euclidean-algorithm", "modular-arithmetic", "prime-number"],
    category: "mathematical",
    tags: ["number-theory", "fundamental", "divisibility"],
  },
  {
    slug: "least-common-multiple",
    name: "Least Common Multiple",
    definition:
      "The least common multiple (LCM) of two integers is the smallest positive integer that is divisible by both numbers. It is closely related to the GCD and is often used in problems involving periodic events, fraction addition, and scheduling. The LCM can be computed efficiently using the relationship with GCD.",
    formalDefinition:
      "For integers $a$ and $b$, $\\text{lcm}(a, b) = \\min\\{m \\in \\mathbb{Z}^+ : a \\mid m \\text{ and } b \\mid m\\}$.",
    formula: "$\\text{lcm}(a, b) = \\frac{|a \\cdot b|}{\\gcd(a, b)}$",
    relatedTerms: ["greatest-common-divisor", "euclidean-algorithm", "prime-number"],
    category: "mathematical",
    tags: ["number-theory", "fundamental", "divisibility"],
  },
  {
    slug: "euclidean-algorithm",
    name: "Euclidean Algorithm",
    definition:
      "The Euclidean algorithm is one of the oldest known algorithms, dating back to around 300 BC. It computes the greatest common divisor of two integers by repeatedly replacing the larger number with the remainder of dividing the two. The extended version also finds integers $x$ and $y$ such that $ax + by = \\gcd(a, b)$.",
    formula: "Time: $O(\\log(\\min(a, b)))$ divisions. $\\gcd(a, b) = \\gcd(b, a \\mod b)$",
    relatedTerms: ["greatest-common-divisor", "modular-arithmetic", "least-common-multiple"],
    category: "mathematical",
    tags: ["algorithm", "classic", "number-theory", "efficient"],
  },
  {
    slug: "prime-number",
    name: "Prime Number",
    definition:
      "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Primes are the building blocks of all natural numbers through the Fundamental Theorem of Arithmetic, which states every integer greater than 1 can be uniquely factored into primes. They play a critical role in cryptography, hashing, and number theory.",
    formalDefinition:
      "An integer $p > 1$ is prime if its only divisors are $1$ and $p$. The Fundamental Theorem of Arithmetic: every $n > 1$ has a unique prime factorization $n = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}$.",
    formula: "Prime counting function: $\\pi(n) \\sim \\frac{n}{\\ln n}$ (Prime Number Theorem)",
    relatedTerms: ["sieve-of-eratosthenes", "greatest-common-divisor", "modular-arithmetic"],
    category: "mathematical",
    tags: ["number-theory", "fundamental", "cryptography"],
  },
  {
    slug: "sieve-of-eratosthenes",
    name: "Sieve of Eratosthenes",
    definition:
      "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to a given limit. It works by iteratively marking the multiples of each prime starting from 2. After processing all primes up to the square root of the limit, the unmarked numbers that remain are prime. It is one of the most efficient ways to generate small primes.",
    formula: "Time: $O(n \\log \\log n)$. Space: $O(n)$",
    relatedTerms: ["prime-number", "greatest-common-divisor", "modular-arithmetic"],
    category: "mathematical",
    tags: ["algorithm", "classic", "prime", "sieve"],
  },
  {
    slug: "modular-arithmetic",
    name: "Modular Arithmetic",
    definition:
      "Modular arithmetic is a system of arithmetic for integers where numbers wrap around after reaching a certain value called the modulus. The expression $a \\mod m$ gives the remainder when $a$ is divided by $m$. Modular arithmetic is essential in cryptography, hashing, random number generation, and competitive programming.",
    formalDefinition:
      "Two integers $a$ and $b$ are congruent modulo $m$ (written $a \\equiv b \\pmod{m}$) if $m$ divides $a - b$.",
    formula: "$(a + b) \\mod m = ((a \\mod m) + (b \\mod m)) \\mod m$. Similar rules hold for subtraction and multiplication.",
    relatedTerms: ["euclidean-algorithm", "exponentiation-by-squaring", "greatest-common-divisor", "prime-number"],
    category: "mathematical",
    tags: ["number-theory", "fundamental", "cryptography", "arithmetic"],
  },
  {
    slug: "exponentiation-by-squaring",
    name: "Exponentiation by Squaring",
    definition:
      "Exponentiation by squaring (also called binary exponentiation or fast power) is an efficient method for computing large powers of a number. Instead of multiplying $n$ times, it repeatedly squares the base and uses the binary representation of the exponent to combine results. It is especially useful in modular exponentiation for cryptography.",
    formula: "$a^n = \\begin{cases} 1 & n = 0 \\\\ (a^{n/2})^2 & n \\text{ even} \\\\ a \\cdot a^{n-1} & n \\text{ odd} \\end{cases}$. Time: $O(\\log n)$",
    relatedTerms: ["modular-arithmetic", "matrix-multiplication", "logarithm-base-2"],
    category: "mathematical",
    tags: ["algorithm", "efficient", "power", "binary"],
  },
  {
    slug: "matrix-multiplication",
    name: "Matrix Multiplication",
    definition:
      "Matrix multiplication is the operation of producing a new matrix from two input matrices by taking dot products of rows and columns. The standard algorithm for multiplying two $n \\times n$ matrices runs in $O(n^3)$ time, but faster algorithms exist, such as Strassen's $O(n^{2.807})$ method. Matrix multiplication is central to graph algorithms, dynamic programming, and machine learning.",
    formalDefinition:
      "For matrices $A$ ($m \\times n$) and $B$ ($n \\times p$), the product $C = AB$ has entries $C_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}$.",
    formula: "Naive: $O(n^3)$. Strassen: $O(n^{2.807})$. Current best: $O(n^{2.371})$",
    relatedTerms: ["determinant", "eigenvalue", "exponentiation-by-squaring"],
    category: "mathematical",
    tags: ["linear-algebra", "fundamental", "operation"],
  },
  {
    slug: "determinant",
    name: "Determinant",
    definition:
      "The determinant is a scalar value computed from a square matrix that encodes important properties: a matrix is invertible if and only if its determinant is nonzero, and the absolute value of the determinant gives the volume scaling factor of the linear transformation. Determinants are used in solving systems of linear equations, computing eigenvalues, and computational geometry.",
    formalDefinition:
      "For an $n \\times n$ matrix $A$, $\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^{n} a_{i,\\sigma(i)}$, where $S_n$ is the set of permutations.",
    formula: "For $2 \\times 2$: $\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$. Gaussian elimination: $O(n^3)$",
    relatedTerms: ["matrix-multiplication", "eigenvalue", "permutation"],
    category: "mathematical",
    tags: ["linear-algebra", "matrix", "scalar"],
  },
  {
    slug: "eigenvalue",
    name: "Eigenvalue",
    definition:
      "An eigenvalue of a square matrix $A$ is a scalar $\\lambda$ such that there exists a nonzero vector $v$ with $Av = \\lambda v$. The vector $v$ is called the corresponding eigenvector. Eigenvalues reveal fundamental properties of the matrix, such as stability and oscillation modes, and are central to Principal Component Analysis (PCA), Google's PageRank, and spectral graph theory.",
    formalDefinition:
      "For matrix $A$, $\\lambda$ is an eigenvalue if $\\det(A - \\lambda I) = 0$. The corresponding eigenvector satisfies $(A - \\lambda I)v = 0$, $v \\neq 0$.",
    formula: "Characteristic polynomial: $\\det(A - \\lambda I) = 0$",
    relatedTerms: ["determinant", "matrix-multiplication"],
    category: "mathematical",
    tags: ["linear-algebra", "matrix", "spectral"],
  },
  {
    slug: "fibonacci-number",
    name: "Fibonacci Number",
    definition:
      "The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. This sequence (0, 1, 1, 2, 3, 5, 8, 13, ...) appears throughout mathematics, nature, and computer science. Computing Fibonacci numbers is a classic example of recursion, memoization, and matrix exponentiation.",
    formalDefinition:
      "$F(0) = 0$, $F(1) = 1$, $F(n) = F(n-1) + F(n-2)$ for $n \\geq 2$.",
    formula: "Closed form (Binet's formula): $F(n) = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}}$, where $\\phi = \\frac{1+\\sqrt{5}}{2}$. Matrix method: $O(\\log n)$",
    relatedTerms: ["factorial", "exponentiation-by-squaring", "matrix-multiplication"],
    category: "mathematical",
    tags: ["sequence", "classic", "recursion", "dynamic-programming"],
  },
  {
    slug: "factorial",
    name: "Factorial",
    definition:
      "The factorial of a non-negative integer $n$, denoted $n!$, is the product of all positive integers up to $n$. Factorials grow extremely fast and are fundamental in combinatorics, where they count the number of ways to arrange $n$ distinct objects. They also appear in the formulas for permutations, combinations, and probability distributions.",
    formalDefinition:
      "$n! = \\prod_{k=1}^{n} k = n \\cdot (n-1) \\cdot \\ldots \\cdot 2 \\cdot 1$, with $0! = 1$ by convention.",
    formula: "Stirling's approximation: $n! \\approx \\sqrt{2\\pi n} \\left(\\frac{n}{e}\\right)^n$",
    relatedTerms: ["permutation", "combination", "binomial-coefficient", "fibonacci-number"],
    category: "mathematical",
    tags: ["combinatorics", "fundamental", "counting"],
  },
  {
    slug: "permutation",
    name: "Permutation",
    definition:
      "A permutation is an arrangement of objects in a specific order. The number of permutations of $n$ distinct objects taken $r$ at a time counts how many different ordered sequences of $r$ elements can be formed. Permutations are used in combinatorics, probability, cryptography, and algorithm analysis.",
    formalDefinition:
      "A permutation of a set $S$ is a bijection $\\sigma: S \\to S$. The number of $r$-permutations of $n$ objects is $P(n, r) = \\frac{n!}{(n-r)!}$.",
    formula: "$P(n, r) = \\frac{n!}{(n-r)!}$. Total permutations of $n$ objects: $n!$",
    relatedTerms: ["combination", "factorial", "binomial-coefficient", "permutation-generation"],
    category: "mathematical",
    tags: ["combinatorics", "counting", "ordering"],
  },
  {
    slug: "combination",
    name: "Combination",
    definition:
      "A combination is a selection of objects where the order does not matter. The number of combinations of $n$ objects taken $r$ at a time counts how many distinct subsets of size $r$ can be chosen. Unlike permutations, combinations treat {A, B} and {B, A} as the same selection.",
    formalDefinition:
      "The number of $r$-combinations from $n$ objects is $C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}$.",
    formula: "$\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$",
    relatedTerms: ["permutation", "binomial-coefficient", "factorial", "subset-generation"],
    category: "mathematical",
    tags: ["combinatorics", "counting", "selection"],
  },
  {
    slug: "binomial-coefficient",
    name: "Binomial Coefficient",
    definition:
      "The binomial coefficient $\\binom{n}{k}$ (read \"n choose k\") counts the number of ways to choose $k$ elements from a set of $n$ elements. It is the coefficient of the $x^k$ term in the expansion of $(1 + x)^n$ (the Binomial Theorem). Binomial coefficients can be computed efficiently using Pascal's Triangle or dynamic programming.",
    formalDefinition:
      "$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ for $0 \\leq k \\leq n$.",
    formula: "Binomial Theorem: $(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$. Pascal's rule: $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$",
    relatedTerms: ["combination", "factorial", "permutation", "probability"],
    category: "mathematical",
    tags: ["combinatorics", "counting", "polynomial"],
  },
  {
    slug: "probability",
    name: "Probability",
    definition:
      "Probability is a measure of the likelihood that an event will occur, expressed as a number between 0 (impossible) and 1 (certain). In algorithm analysis, probability is used to analyze randomized algorithms, expected running times, and average-case complexity. It is also foundational to machine learning and statistical inference.",
    formalDefinition:
      "A probability function $P$ on a sample space $\\Omega$ satisfies: $P(\\Omega) = 1$, $P(A) \\geq 0$, and $P(A \\cup B) = P(A) + P(B)$ for disjoint events.",
    formula: "For equally likely outcomes: $P(A) = \\frac{|A|}{|\\Omega|}$",
    relatedTerms: ["expected-value", "combination", "permutation", "binomial-coefficient"],
    category: "mathematical",
    tags: ["statistics", "fundamental", "randomized"],
  },
  {
    slug: "expected-value",
    name: "Expected Value",
    definition:
      "The expected value (or mean) of a random variable is the weighted average of all possible values, where each value is weighted by its probability. In algorithm analysis, expected value is used to determine the average-case running time of randomized algorithms, such as the expected $O(n \\log n)$ time of randomized quicksort.",
    formalDefinition:
      "For a discrete random variable $X$, $E[X] = \\sum_{x} x \\cdot P(X = x)$.",
    formula: "Linearity: $E[X + Y] = E[X] + E[Y]$ (always, even if $X$ and $Y$ are dependent)",
    relatedTerms: ["probability", "binomial-coefficient", "combination"],
    category: "mathematical",
    tags: ["statistics", "analysis", "average-case"],
  },
  {
    slug: "logarithm-base-2",
    name: "Logarithm Base 2",
    definition:
      "The base-2 logarithm (also written $\\lg n$ or $\\log_2 n$) of a number $n$ is the exponent to which 2 must be raised to produce $n$. It is ubiquitous in computer science because binary decisions (like comparisons in binary search) halve the problem size, leading to $O(\\log n)$ complexities. Most logarithmic complexities in algorithms implicitly use base 2.",
    formalDefinition:
      "$\\log_2 n = x$ means $2^x = n$.",
    formula: "Change of base: $\\log_b n = \\frac{\\ln n}{\\ln b}$. Note: $\\log_2 n = \\Theta(\\log_k n)$ for any constant $k$",
    relatedTerms: ["exponentiation-by-squaring", "floor-function", "ceiling-function"],
    category: "mathematical",
    tags: ["fundamental", "complexity", "binary"],
  },
  {
    slug: "floor-function",
    name: "Floor Function",
    definition:
      "The floor function $\\lfloor x \\rfloor$ returns the largest integer less than or equal to $x$. It rounds a real number down to the nearest integer. The floor function appears frequently in algorithm analysis, particularly in divide-and-conquer recurrences (e.g., $T(n) = T(\\lfloor n/2 \\rfloor) + O(1)$ for binary search) and array index calculations.",
    formalDefinition:
      "$\\lfloor x \\rfloor = \\max\\{n \\in \\mathbb{Z} : n \\leq x\\}$.",
    formula: "$\\lfloor x \\rfloor \\leq x < \\lfloor x \\rfloor + 1$",
    relatedTerms: ["ceiling-function", "logarithm-base-2"],
    category: "mathematical",
    tags: ["fundamental", "rounding", "integer"],
  },
  {
    slug: "ceiling-function",
    name: "Ceiling Function",
    definition:
      "The ceiling function $\\lceil x \\rceil$ returns the smallest integer greater than or equal to $x$. It rounds a real number up to the nearest integer. In algorithms, the ceiling function arises when dividing work evenly (e.g., splitting an array of $n$ elements into $\\lceil n/2 \\rceil$ and $\\lfloor n/2 \\rfloor$ pieces) and in complexity analysis of divide-and-conquer algorithms.",
    formalDefinition:
      "$\\lceil x \\rceil = \\min\\{n \\in \\mathbb{Z} : n \\geq x\\}$.",
    formula: "$\\lceil x \\rceil - 1 < x \\leq \\lceil x \\rceil$. Also: $\\lceil n/k \\rceil = \\lfloor (n + k - 1) / k \\rfloor$",
    relatedTerms: ["floor-function", "logarithm-base-2"],
    category: "mathematical",
    tags: ["fundamental", "rounding", "integer"],
  },
];
