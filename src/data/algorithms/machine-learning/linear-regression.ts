import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const linearRegression: AlgorithmMetadata = {
  id: "linear-regression",
  name: "Linear Regression",
  category: "machine-learning",
  subcategory: "Regression",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "For the closed-form (normal equation) solution, computing the least-squares fit requires a single pass through the data to compute sums. The matrix inversion for the normal equation is O(d^3) where d is the number of features, but for simple linear regression d=1 so it reduces to O(n).",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "The closed-form solution requires O(1) auxiliary space for simple linear regression (storing sums and coefficients). For gradient descent on n samples with d features, O(n*d) space is needed to store the design matrix.",
  },
  description: `Linear Regression is one of the most fundamental algorithms in machine learning and statistics. It models the relationship between a dependent variable (target) and one or more independent variables (features) by fitting a straight line through the data points. The goal is to find the line that minimizes the sum of squared differences between the observed values and the values predicted by the line. This approach is known as Ordinary Least Squares (OLS). For simple linear regression with one feature, the model takes the form y = mx + b, where m is the slope and b is the y-intercept.

The algorithm works by computing the optimal slope and intercept directly using the normal equation, or iteratively using gradient descent. In the closed-form approach, the slope is calculated as the covariance of x and y divided by the variance of x, and the intercept is derived from the means of x and y. Gradient descent starts with random parameters and iteratively adjusts them in the direction that reduces the mean squared error (MSE), with the learning rate controlling the step size. Each iteration computes the gradient of the loss function with respect to the parameters and updates them accordingly.

Linear regression assumes a linear relationship between the input features and the output, constant variance of errors (homoscedasticity), independence of observations, and normally distributed residuals. Despite these assumptions, linear regression remains widely used because of its simplicity, interpretability, and efficiency. It serves as the foundation for many more complex models such as polynomial regression, ridge regression, and lasso regression, and is often the first model tried in any regression task due to its strong baseline performance and ease of implementation.`,
  shortDescription:
    "Fits a straight line through data points by minimizing the sum of squared residuals between observed and predicted values.",
  pseudocode: `procedure LinearRegression(X, y):
    // X: array of feature values (n samples)
    // y: array of target values (n samples)
    n = length(X)

    // Compute means
    x_mean = sum(X) / n
    y_mean = sum(y) / n

    // Compute slope (m) using least squares
    numerator = 0
    denominator = 0
    for i = 0 to n - 1 do
        numerator += (X[i] - x_mean) * (y[i] - y_mean)
        denominator += (X[i] - x_mean)^2
    end for
    m = numerator / denominator

    // Compute intercept (b)
    b = y_mean - m * x_mean

    // Compute R-squared (goodness of fit)
    ss_res = sum((y[i] - (m * X[i] + b))^2 for i in 0..n-1)
    ss_tot = sum((y[i] - y_mean)^2 for i in 0..n-1)
    R2 = 1 - ss_res / ss_tot

    return m, b, R2
end procedure`,
  implementations: {
    python: `import numpy as np

def linear_regression(X: np.ndarray, y: np.ndarray):
    """
    Fit a simple linear regression model using Ordinary Least Squares.

    Parameters:
        X: 1D array of feature values (n samples)
        y: 1D array of target values (n samples)

    Returns:
        slope, intercept, r_squared
    """
    n = len(X)
    x_mean = np.mean(X)
    y_mean = np.mean(y)

    # Compute slope using covariance / variance
    numerator = np.sum((X - x_mean) * (y - y_mean))
    denominator = np.sum((X - x_mean) ** 2)
    slope = numerator / denominator

    # Compute intercept
    intercept = y_mean - slope * x_mean

    # Compute R-squared
    y_pred = slope * X + intercept
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - y_mean) ** 2)
    r_squared = 1 - ss_res / ss_tot

    return slope, intercept, r_squared


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    X = np.linspace(0, 10, 20)
    y = 2.5 * X + 3 + np.random.randn(20) * 2

    slope, intercept, r2 = linear_regression(X, y)
    print(f"Slope: {slope:.4f}")
    print(f"Intercept: {intercept:.4f}")
    print(f"R-squared: {r2:.4f}")
    print(f"Equation: y = {slope:.2f}x + {intercept:.2f}")`,
    javascript: `function linearRegression(X, y) {
  /**
   * Fit a simple linear regression model using Ordinary Least Squares.
   * @param {number[]} X - Feature values (n samples)
   * @param {number[]} y - Target values (n samples)
   * @returns {{ slope: number, intercept: number, rSquared: number }}
   */
  const n = X.length;
  const xMean = X.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  // Compute slope using covariance / variance
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (X[i] - xMean) * (y[i] - yMean);
    denominator += (X[i] - xMean) ** 2;
  }
  const slope = numerator / denominator;

  // Compute intercept
  const intercept = yMean - slope * xMean;

  // Compute R-squared
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yPred = slope * X[i] + intercept;
    ssRes += (y[i] - yPred) ** 2;
    ssTot += (y[i] - yMean) ** 2;
  }
  const rSquared = 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

// Example usage
const X = Array.from({ length: 20 }, (_, i) => i * 0.5);
const y = X.map((x) => 2.5 * x + 3 + (Math.random() - 0.5) * 4);

const { slope, intercept, rSquared } = linearRegression(X, y);
console.log(\`Slope: \${slope.toFixed(4)}\`);
console.log(\`Intercept: \${intercept.toFixed(4)}\`);
console.log(\`R-squared: \${rSquared.toFixed(4)}\`);
console.log(\`Equation: y = \${slope.toFixed(2)}x + \${intercept.toFixed(2)}\`);`,
  },
  useCases: [
    "Predicting house prices based on features like square footage, number of rooms, and location",
    "Forecasting sales revenue based on advertising spend across different channels",
    "Estimating a student's exam score from the number of study hours",
    "Modeling the relationship between temperature and energy consumption for resource planning",
  ],
  relatedAlgorithms: [
    "polynomial-regression",
    "logistic-regression",
  ],
  glossaryTerms: [
    "regression",
    "least squares",
    "gradient descent",
    "mean squared error",
    "overfitting",
    "underfitting",
    "bias-variance tradeoff",
  ],
  tags: [
    "machine-learning",
    "regression",
    "supervised-learning",
    "statistics",
    "beginner",
    "least-squares",
    "linear-model",
  ],
};
