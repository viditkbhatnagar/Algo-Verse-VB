import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const crossValidation: AlgorithmMetadata = {
  id: "cross-validation",
  name: "Cross-Validation (K-Fold)",
  category: "machine-learning",
  subcategory: "Evaluation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(K * T(n))",
    average: "O(K * T(n))",
    worst: "O(K * T(n))",
    note: "Where T(n) is the time to train the model on n samples. K-fold cross-validation trains the model K times, each on (K-1)/K of the data.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n + M)",
    note: "Requires storing the dataset plus the model M. Each fold reuses the same data with different train/test splits.",
  },
  description: `K-Fold Cross-Validation is a fundamental model evaluation technique in machine learning that provides a robust estimate of model performance. Instead of a single train/test split, the dataset is divided into K equally sized folds. The model is then trained K times, each time using a different fold as the test set and the remaining K-1 folds as the training set. The final performance metric is the average across all K runs.

This approach addresses a critical limitation of the simple holdout method: the performance estimate depends heavily on which data points end up in the training vs. test set. With K-fold CV, every data point is used for both training and testing exactly once, giving a more reliable and less biased estimate of how the model will perform on unseen data. Common choices for K are 5 and 10, with 10-fold being the most popular in practice.

Variations include Stratified K-Fold (preserving class proportions in each fold), Leave-One-Out Cross-Validation (LOOCV, where K = n), and Repeated K-Fold (running K-fold CV multiple times with different random splits). Cross-validation is essential for hyperparameter tuning, model selection, and understanding the variance in model performance. It is widely used in machine learning competitions, academic research, and production ML pipelines.`,
  shortDescription:
    "A model evaluation technique that splits data into K folds, training K times with each fold as the test set to produce a robust performance estimate.",
  pseudocode: `procedure KFoldCrossValidation(data, K, model):
    shuffle(data)
    folds = split(data, K)  // K equal-sized subsets
    scores = []

    for i = 1 to K:
        testSet = folds[i]
        trainSet = union(folds[1..K] except folds[i])

        model.fit(trainSet)
        predictions = model.predict(testSet)
        score = evaluate(predictions, testSet.labels)
        scores.append(score)
    end for

    averageScore = mean(scores)
    stdDev = std(scores)
    return averageScore, stdDev
end procedure`,
  implementations: {
    python: `import numpy as np
from sklearn.model_selection import KFold

class KFoldCV:
    """K-Fold Cross-Validation implementation."""

    def __init__(self, k: int = 5, shuffle: bool = True, random_state: int = 42):
        self.k = k
        self.shuffle = shuffle
        self.random_state = random_state

    def split(self, X: np.ndarray):
        """Generate train/test index splits."""
        n = len(X)
        indices = np.arange(n)
        if self.shuffle:
            rng = np.random.RandomState(self.random_state)
            rng.shuffle(indices)

        fold_size = n // self.k
        for i in range(self.k):
            start = i * fold_size
            end = start + fold_size if i < self.k - 1 else n
            test_idx = indices[start:end]
            train_idx = np.concatenate([indices[:start], indices[end:]])
            yield train_idx, test_idx

    def evaluate(self, model, X, y, scoring_fn):
        """Run K-fold CV and return scores."""
        scores = []
        for train_idx, test_idx in self.split(X):
            X_train, X_test = X[train_idx], X[test_idx]
            y_train, y_test = y[train_idx], y[test_idx]

            model.fit(X_train, y_train)
            predictions = model.predict(X_test)
            score = scoring_fn(y_test, predictions)
            scores.append(score)

        return {
            "scores": scores,
            "mean": np.mean(scores),
            "std": np.std(scores),
        }


# Example usage with sklearn
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
model = DecisionTreeClassifier(max_depth=3)
scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")
print(f"Accuracy: {scores.mean():.3f} (+/- {scores.std():.3f})")`,
    javascript: `class KFoldCV {
  constructor(k = 5, shuffle = true) {
    this.k = k;
    this.shuffle = shuffle;
  }

  /** Generate train/test index splits. */
  *split(data) {
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    if (this.shuffle) {
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
    }

    const foldSize = Math.floor(n / this.k);
    for (let i = 0; i < this.k; i++) {
      const start = i * foldSize;
      const end = i < this.k - 1 ? start + foldSize : n;
      const testIdx = indices.slice(start, end);
      const trainIdx = [...indices.slice(0, start), ...indices.slice(end)];
      yield { trainIdx, testIdx };
    }
  }

  /** Run K-fold CV and return scores. */
  evaluate(model, X, y, scoringFn) {
    const scores = [];
    for (const { trainIdx, testIdx } of this.split(X)) {
      const XTrain = trainIdx.map((i) => X[i]);
      const yTrain = trainIdx.map((i) => y[i]);
      const XTest = testIdx.map((i) => X[i]);
      const yTest = testIdx.map((i) => y[i]);

      model.fit(XTrain, yTrain);
      const predictions = model.predict(XTest);
      scores.push(scoringFn(yTest, predictions));
    }

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const std = Math.sqrt(
      scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length
    );
    return { scores, mean, std };
  }
}

// Example usage
const cv = new KFoldCV(5);
console.log("Splits generated for K=5");`,
  },
  useCases: [
    "Comparing multiple ML models to select the best performer on a given dataset",
    "Tuning hyperparameters (e.g., learning rate, tree depth) without overfitting to the test set",
    "Estimating model generalization error when dataset size is limited",
    "Validating feature engineering choices by measuring their impact across multiple splits",
  ],
  relatedAlgorithms: [
    "decision-tree-ml",
    "random-forest",
    "logistic-regression",
    "knn",
    "svm",
  ],
  glossaryTerms: [
    "cross-validation",
    "overfitting",
    "bias-variance tradeoff",
    "hyperparameter tuning",
    "model selection",
    "generalization",
    "train-test split",
  ],
  tags: [
    "machine-learning",
    "evaluation",
    "model-selection",
    "validation",
    "intermediate",
  ],
};
