import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const matrixOperations: AlgorithmMetadata = {
  id: "matrix-operations",
  name: "Matrix Multiplication",
  category: "mathematical",
  subcategory: "Linear Algebra",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * m * p)",
    average: "O(n * m * p)",
    worst: "O(n * m * p)",
    note: "Multiplying an n x m matrix by an m x p matrix. Standard (naive) multiplication. Strassen's algorithm achieves O(n^2.807) for square matrices.",
  },
  spaceComplexity: {
    best: "O(n * p)",
    average: "O(n * p)",
    worst: "O(n * p)",
    note: "Space for the resulting n x p matrix. In-place multiplication is not possible since result elements depend on full rows and columns.",
  },
  description: `Matrix multiplication is one of the most fundamental operations in linear algebra and computing. Given two matrices A (of size n x m) and B (of size m x p), their product C = A x B is an n x p matrix where each element C[i][j] is the dot product of the i-th row of A and the j-th column of B.

The standard algorithm computes each entry of the result matrix by iterating through the shared dimension (m) and summing the products of corresponding elements. For C[i][j], this means computing A[i][0]*B[0][j] + A[i][1]*B[1][j] + ... + A[i][m-1]*B[m-1][j]. This gives a time complexity of O(n * m * p) for the general case and O(n^3) for square matrices.

Understanding matrix multiplication is crucial because it appears everywhere in computer science and engineering: computer graphics (transformations, projections), machine learning (neural network forward passes, attention mechanisms), physics simulations (state transitions), graph algorithms (computing transitive closure), and scientific computing (solving systems of linear equations).

The naive cubic algorithm, while conceptually simple, can be optimized in several ways. Cache-friendly implementations that access memory in a sequential pattern can be significantly faster in practice. Strassen's algorithm (1969) was the first to break the O(n^3) barrier with O(n^2.807) complexity by cleverly reducing the number of recursive multiplications from 8 to 7 at each level. More recent theoretical results have pushed this even lower, though the practical algorithms typically used are either the naive algorithm (for small matrices) or highly optimized BLAS implementations that exploit hardware-level parallelism.`,
  shortDescription:
    "The fundamental operation of multiplying two matrices by computing dot products of rows and columns, forming the basis of linear algebra in computing.",
  pseudocode: `procedure matrixMultiply(A[n][m], B[m][p]) -> C[n][p]
    for i = 0 to n - 1 do
        for j = 0 to p - 1 do
            C[i][j] = 0
            for k = 0 to m - 1 do
                C[i][j] = C[i][j] + A[i][k] * B[k][j]
            end for
        end for
    end for
    return C
end procedure`,
  implementations: {
    python: `def matrix_multiply(A: list[list[int]], B: list[list[int]]) -> list[list[int]]:
    """Multiply two matrices A (n x m) and B (m x p) to produce C (n x p)."""
    n = len(A)
    m = len(A[0])
    p = len(B[0])

    # Initialize result matrix with zeros
    C = [[0] * p for _ in range(n)]

    for i in range(n):
        for j in range(p):
            for k in range(m):
                C[i][j] += A[i][k] * B[k][j]

    return C


# Example usage
if __name__ == "__main__":
    A = [[1, 2, 3],
         [4, 5, 6]]

    B = [[7, 8],
         [9, 10],
         [11, 12]]

    C = matrix_multiply(A, B)
    for row in C:
        print(row)
    # [58, 64]
    # [139, 154]`,
    javascript: `function matrixMultiply(A, B) {
  const n = A.length;
  const m = A[0].length;
  const p = B[0].length;

  // Initialize result matrix with zeros
  const C = Array.from({ length: n }, () => new Array(p).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < m; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return C;
}

// Example usage
const A = [[1, 2, 3], [4, 5, 6]];
const B = [[7, 8], [9, 10], [11, 12]];
const C = matrixMultiply(A, B);
console.log(C); // [[58, 64], [139, 154]]`,
  },
  useCases: [
    "Computer graphics — applying transformations, rotations, and projections to 3D objects",
    "Machine learning — computing forward passes in neural networks and attention scores in transformers",
    "Graph algorithms — computing graph powers and transitive closure via adjacency matrix multiplication",
    "Scientific computing — solving systems of linear equations and differential equations",
    "Image processing — applying convolutional filters and kernel operations",
  ],
  relatedAlgorithms: [
    "strassen-multiplication",
    "gaussian-elimination",
    "matrix-chain-multiplication",
  ],
  glossaryTerms: [
    "matrix",
    "dot product",
    "linear algebra",
    "matrix dimensions",
    "transpose",
    "identity matrix",
  ],
  tags: [
    "mathematical",
    "linear-algebra",
    "intermediate",
    "matrix",
    "multiplication",
    "fundamental",
  ],
};
