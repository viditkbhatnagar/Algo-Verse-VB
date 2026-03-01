import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const polynomialRegression: AlgorithmMetadata = {
  id: "polynomial-regression",
  name: "Polynomial Regression",
  category: "machine-learning",
  subcategory: "Regression",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * d)",
    average: "O(n * d^2)",
    worst: "O(n * d^2 + d^3)",
    note: "Where n is the number of data points and d is the polynomial degree. Building the Vandermonde matrix is O(n*d), and solving the normal equation involves O(d^3) matrix inversion. For gradient descent, each iteration is O(n*d) and typically requires multiple iterations to converge.",
  },
  spaceComplexity: {
    best: "O(n * d)",
    average: "O(n * d)",
    worst: "O(n * d)",
    note: "The Vandermonde matrix (design matrix) requires O(n*d) space to store the polynomial features. The coefficient vector requires O(d) space. Total dominated by the design matrix.",
  },
  description: `Polynomial Regression extends linear regression by modeling non-linear relationships between the independent variable and the dependent variable. Instead of fitting a straight line, it fits a polynomial curve of degree d to the data. The model takes the form y = a_0 + a_1*x + a_2*x^2 + ... + a_d*x^d, where the coefficients a_0 through a_d are estimated from the data. Despite fitting curves, polynomial regression is still considered a form of linear regression because the model is linear in the parameters (the coefficients), even though it is non-linear in the input variable x.

The fitting process constructs a Vandermonde matrix where each row corresponds to a data point and each column corresponds to a power of x (from x^0 to x^d). The normal equation is then solved to find the coefficient vector that minimizes the sum of squared residuals. Alternatively, gradient descent can be used for iterative optimization. The choice of polynomial degree is critical: too low a degree results in underfitting (the model cannot capture the data's pattern), while too high a degree leads to overfitting (the model fits noise rather than the underlying trend). Cross-validation and information criteria like AIC/BIC help select the appropriate degree.

Polynomial regression is widely used when the data exhibits curvilinear trends that a simple linear model cannot capture. Common applications include modeling growth curves in biology, fitting spectral data in chemistry, and capturing diminishing returns in economics. However, polynomial models can behave erratically outside the range of the training data (poor extrapolation), and high-degree polynomials are prone to Runge's phenomenon where oscillations occur near the edges of the data range. For this reason, practitioners often prefer piecewise polynomials (splines) or other non-parametric methods for complex non-linear relationships.`,
  shortDescription:
    "Extends linear regression to model curvilinear relationships by fitting a polynomial of degree d to the data.",
  pseudocode: `procedure PolynomialRegression(X, y, degree):
    // X: array of feature values (n samples)
    // y: array of target values (n samples)
    // degree: polynomial degree d
    n = length(X)

    // Build Vandermonde matrix (n x (d+1))
    V = matrix of zeros (n, degree + 1)
    for i = 0 to n - 1 do
        for j = 0 to degree do
            V[i][j] = X[i]^j
        end for
    end for

    // Solve normal equation: coeffs = (V^T * V)^(-1) * V^T * y
    VtV = V^T * V          // (d+1) x (d+1) matrix
    Vty = V^T * y          // (d+1) vector
    coeffs = solve(VtV, Vty)

    // Compute predictions and R-squared
    y_pred = V * coeffs
    ss_res = sum((y[i] - y_pred[i])^2 for i in 0..n-1)
    ss_tot = sum((y[i] - mean(y))^2 for i in 0..n-1)
    R2 = 1 - ss_res / ss_tot

    return coeffs, R2
end procedure`,
  implementations: {
    python: `import numpy as np

def polynomial_regression(X: np.ndarray, y: np.ndarray, degree: int = 2):
    """
    Fit a polynomial regression model using the normal equation.

    Parameters:
        X: 1D array of feature values (n samples)
        y: 1D array of target values (n samples)
        degree: polynomial degree (default 2)

    Returns:
        coefficients, r_squared
    """
    n = len(X)

    # Build Vandermonde matrix
    V = np.vander(X, degree + 1, increasing=True)

    # Solve normal equation: coeffs = (V^T V)^(-1) V^T y
    VtV = V.T @ V
    Vty = V.T @ y
    coefficients = np.linalg.solve(VtV, Vty)

    # Compute predictions
    y_pred = V @ coefficients

    # Compute R-squared
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r_squared = 1 - ss_res / ss_tot

    return coefficients, r_squared


def predict(x_new: float, coefficients: np.ndarray) -> float:
    """Predict y for a new x value."""
    return sum(c * x_new**i for i, c in enumerate(coefficients))


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    X = np.linspace(-3, 3, 25)
    y = 0.5 * X**2 - 0.3 * X + 1 + np.random.randn(25) * 0.8

    for deg in [1, 2, 3]:
        coeffs, r2 = polynomial_regression(X, y, degree=deg)
        print(f"Degree {deg}: R² = {r2:.4f}, coeffs = {coeffs.round(3)}")`,
    javascript: `function polynomialRegression(X, y, degree = 2) {
  /**
   * Fit a polynomial regression model.
   * @param {number[]} X - Feature values
   * @param {number[]} y - Target values
   * @param {number} degree - Polynomial degree
   * @returns {{ coefficients: number[], rSquared: number }}
   */
  const n = X.length;
  const d = degree + 1;

  // Build Vandermonde matrix
  const V = X.map((x) =>
    Array.from({ length: d }, (_, j) => Math.pow(x, j))
  );

  // Compute V^T * V and V^T * y
  const VtV = Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) =>
      V.reduce((sum, row) => sum + row[i] * row[j], 0)
    )
  );
  const Vty = Array.from({ length: d }, (_, i) =>
    V.reduce((sum, row, k) => sum + row[i] * y[k], 0)
  );

  // Solve via Gaussian elimination
  const coefficients = solveLinearSystem(VtV, Vty);

  // Compute R-squared
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yPred = coefficients.reduce(
      (sum, c, j) => sum + c * Math.pow(X[i], j), 0
    );
    ssRes += (y[i] - yPred) ** 2;
    ssTot += (y[i] - yMean) ** 2;
  }

  return { coefficients, rSquared: 1 - ssRes / ssTot };
}

function solveLinearSystem(A, b) {
  const n = b.length;
  const aug = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
    x[i] /= aug[i][i];
  }
  return x;
}

// Example usage
const X = Array.from({ length: 25 }, (_, i) => -3 + (i * 6) / 24);
const y = X.map((x) => 0.5 * x * x - 0.3 * x + 1 + (Math.random() - 0.5) * 1.6);

const result = polynomialRegression(X, y, 2);
console.log("Coefficients:", result.coefficients.map((c) => c.toFixed(3)));
console.log("R-squared:", result.rSquared.toFixed(4));`,
  },
  useCases: [
    "Modeling non-linear relationships such as quadratic growth, decay curves, or seasonal patterns in time series",
    "Fitting chemical reaction kinetics data where reaction rate depends non-linearly on concentration",
    "Approximating complex physical phenomena with a smooth curve for interpolation purposes",
    "Capturing diminishing returns in economic models where marginal utility decreases with quantity",
  ],
  relatedAlgorithms: [
    "linear-regression",
    "logistic-regression",
  ],
  glossaryTerms: [
    "regression",
    "polynomial",
    "overfitting",
    "underfitting",
    "bias-variance tradeoff",
    "normal equation",
    "Vandermonde matrix",
  ],
  tags: [
    "machine-learning",
    "regression",
    "supervised-learning",
    "non-linear",
    "intermediate",
    "polynomial",
    "curve-fitting",
  ],
};
