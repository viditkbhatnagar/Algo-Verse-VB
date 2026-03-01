import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const biasVarianceTradeoff: AlgorithmMetadata = {
  id: "bias-variance-tradeoff",
  name: "Bias-Variance Tradeoff",
  category: "machine-learning",
  subcategory: "Evaluation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "N/A",
    average: "N/A",
    worst: "N/A",
    note: "The bias-variance tradeoff is a theoretical concept, not an algorithm with a specific time complexity. Analyzing it empirically requires training multiple models, which depends on the specific algorithm used.",
  },
  spaceComplexity: {
    best: "N/A",
    average: "N/A",
    worst: "N/A",
    note: "Space depends on the models being analyzed. The decomposition itself requires storing predictions from multiple model fits.",
  },
  description: `The Bias-Variance Tradeoff is one of the most fundamental concepts in machine learning. It describes the relationship between a model's complexity and its ability to generalize to unseen data. The total expected error of a model can be decomposed into three components: Bias^2 (how far the average prediction is from the true value), Variance (how much predictions vary across different training sets), and Irreducible Error (noise in the data that no model can capture).

High bias occurs when a model is too simple to capture the underlying pattern (underfitting). For example, fitting a linear model to quadratic data. The model consistently misses the true relationship regardless of the training set. High variance occurs when a model is too complex and fits the training data too closely (overfitting). A high-degree polynomial will perfectly fit training data but make wildly different predictions on different training sets, performing poorly on new data.

The tradeoff arises because reducing bias typically requires increasing model complexity, which increases variance, and vice versa. The optimal model complexity is the point where the sum of bias^2 and variance is minimized. Practical strategies for managing this tradeoff include: regularization (adds a penalty for complexity, reducing variance at the cost of slightly higher bias), cross-validation (estimates out-of-sample error to detect overfitting), ensemble methods (bagging reduces variance, boosting reduces bias), and early stopping in iterative training. Understanding this tradeoff is essential for selecting appropriate models and hyperparameters.`,
  shortDescription:
    "The fundamental tradeoff between model complexity and generalization: simple models underfit (high bias), complex models overfit (high variance).",
  pseudocode: `// Bias-Variance Decomposition (conceptual)
// For a regression problem with squared loss:

procedure BiasVarianceDecomposition(model, trainingDatasets, testPoint):
    predictions = []
    for each dataset D in trainingDatasets:
        model.fit(D)
        pred = model.predict(testPoint)
        predictions.append(pred)
    end for

    avgPrediction = mean(predictions)
    trueValue = trueFunction(testPoint)

    bias_squared = (avgPrediction - trueValue)^2
    variance = mean((predictions - avgPrediction)^2)
    irreducible_error = noise_variance

    total_error = bias_squared + variance + irreducible_error
    return bias_squared, variance, irreducible_error, total_error

// Key relationships:
// Simple model (e.g., linear): High bias, Low variance
// Complex model (e.g., degree-20 polynomial): Low bias, High variance
// Optimal model: Minimizes total_error = bias^2 + variance + noise`,
  implementations: {
    python: `import numpy as np

def bias_variance_decomposition(model_class, X_train_sets, X_test, y_test,
                                 model_params=None):
    """
    Empirically estimate bias^2 and variance by training
    on multiple bootstrap samples.
    """
    n_datasets = len(X_train_sets)
    all_predictions = []

    for X_train, y_train in X_train_sets:
        model = model_class(**(model_params or {}))
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        all_predictions.append(preds)

    all_predictions = np.array(all_predictions)  # (n_datasets, n_test)

    # Average prediction across all datasets
    avg_prediction = all_predictions.mean(axis=0)

    # Bias^2: (average prediction - true)^2
    bias_squared = np.mean((avg_prediction - y_test) ** 2)

    # Variance: average squared deviation from average prediction
    variance = np.mean(np.var(all_predictions, axis=0))

    # Total error (MSE averaged across all models)
    total_error = np.mean((all_predictions - y_test) ** 2)

    # Irreducible error ~ total - bias^2 - variance
    irreducible = total_error - bias_squared - variance

    return {
        "bias_squared": bias_squared,
        "variance": variance,
        "irreducible_error": max(0, irreducible),
        "total_error": total_error,
    }


# Example: Compare linear vs high-degree polynomial
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

def make_poly_model(degree=1):
    return make_pipeline(PolynomialFeatures(degree), LinearRegression())

# Generate synthetic data
np.random.seed(42)
true_fn = lambda x: np.sin(x)
n = 50

datasets = []
for _ in range(100):
    X = np.random.uniform(0, 6, n).reshape(-1, 1)
    y = true_fn(X.ravel()) + np.random.normal(0, 0.3, n)
    datasets.append((X, y))

X_test = np.linspace(0, 6, 100).reshape(-1, 1)
y_test = true_fn(X_test.ravel())

# Compare models
for deg in [1, 3, 10]:
    result = bias_variance_decomposition(
        lambda: make_poly_model(deg), datasets, X_test, y_test
    )
    print(f"Degree {deg}: Bias^2={result['bias_squared']:.4f}, "
          f"Var={result['variance']:.4f}, Total={result['total_error']:.4f}")`,
    javascript: `/**
 * Empirical Bias-Variance Decomposition
 */
function biasVarianceDecomposition(modelFactory, trainSets, XTest, yTest) {
  const allPreds = [];

  for (const { X, y } of trainSets) {
    const model = modelFactory();
    model.fit(X, y);
    allPreds.push(XTest.map((x) => model.predict(x)));
  }

  const nModels = allPreds.length;
  const nTest = XTest.length;

  // Average prediction per test point
  const avgPred = XTest.map((_, j) =>
    allPreds.reduce((sum, preds) => sum + preds[j], 0) / nModels
  );

  // Bias^2
  const biasSquared =
    avgPred.reduce((sum, avg, j) => sum + (avg - yTest[j]) ** 2, 0) / nTest;

  // Variance
  const variance =
    XTest.reduce((sum, _, j) => {
      const v = allPreds.reduce(
        (s, preds) => s + (preds[j] - avgPred[j]) ** 2, 0
      ) / nModels;
      return sum + v;
    }, 0) / nTest;

  // Total error
  const totalError =
    allPreds.reduce((sum, preds) =>
      sum + preds.reduce((s, p, j) => s + (p - yTest[j]) ** 2, 0) / nTest,
    0) / nModels;

  return {
    biasSquared,
    variance,
    irreducibleError: Math.max(0, totalError - biasSquared - variance),
    totalError,
  };
}

// Example
console.log("Bias-Variance analysis requires training multiple models");
console.log("Simple model: High bias, Low variance");
console.log("Complex model: Low bias, High variance");`,
  },
  useCases: [
    "Selecting model complexity (e.g., polynomial degree, tree depth, number of hidden layers) to avoid underfitting and overfitting",
    "Diagnosing model performance problems: high training error suggests high bias, large gap between training and validation error suggests high variance",
    "Justifying regularization techniques (L1, L2, dropout) that trade a small increase in bias for a large decrease in variance",
    "Choosing between model families: simple models for small datasets (lower variance), complex models for large datasets (can afford lower bias)",
  ],
  relatedAlgorithms: [
    "cross-validation",
    "regularization",
    "random-forest",
    "linear-regression",
    "polynomial-regression",
  ],
  glossaryTerms: [
    "bias-variance tradeoff",
    "overfitting",
    "underfitting",
    "generalization",
    "model complexity",
    "regularization",
    "cross-validation",
    "irreducible error",
  ],
  tags: [
    "machine-learning",
    "evaluation",
    "theory",
    "model-selection",
    "intermediate",
  ],
};
