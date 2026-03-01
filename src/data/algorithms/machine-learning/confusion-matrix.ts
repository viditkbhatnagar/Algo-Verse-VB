import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const confusionMatrix: AlgorithmMetadata = {
  id: "confusion-matrix",
  name: "Confusion Matrix",
  category: "machine-learning",
  subcategory: "Evaluation",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Computing a confusion matrix requires a single pass over all n predictions to count TP, FP, TN, and FN.",
  },
  spaceComplexity: {
    best: "O(C^2)",
    average: "O(C^2)",
    worst: "O(C^2)",
    note: "The matrix has C x C entries where C is the number of classes. For binary classification, C=2 so only 4 values are stored.",
  },
  description: `A confusion matrix is a tabular summary of a classification model's predictions versus the actual labels. For binary classification, it is a 2x2 matrix containing four key metrics: True Positives (TP), True Negatives (TN), False Positives (FP), and False Negatives (FN). This simple structure provides deep insight into the types of errors a model makes, going far beyond a single accuracy number.

From the confusion matrix, numerous evaluation metrics can be derived. Accuracy measures overall correctness: (TP + TN) / Total. Precision (also called Positive Predictive Value) measures how many predicted positives are actually positive: TP / (TP + FP). Recall (also called Sensitivity or True Positive Rate) measures how many actual positives were detected: TP / (TP + FN). The F1 Score is the harmonic mean of precision and recall, providing a balanced measure when classes are imbalanced.

For multi-class problems, the confusion matrix extends to C x C dimensions where C is the number of classes. The diagonal entries represent correct predictions, while off-diagonal entries reveal which classes are being confused with each other. This is invaluable for understanding model weaknesses -- for example, a digit recognizer might frequently confuse 3s with 8s. Confusion matrices are used extensively in medical diagnosis (where false negatives can be life-threatening), spam detection, fraud detection, and any classification task where understanding error types matters.`,
  shortDescription:
    "A table that visualizes classifier performance by showing counts of true positives, false positives, true negatives, and false negatives.",
  pseudocode: `procedure BuildConfusionMatrix(actual[], predicted[], numClasses):
    matrix = zeros(numClasses, numClasses)

    for i = 0 to length(actual) - 1:
        row = actual[i]
        col = predicted[i]
        matrix[row][col] += 1
    end for

    // Derive metrics (binary case)
    TP = matrix[1][1]
    FP = matrix[0][1]
    TN = matrix[0][0]
    FN = matrix[1][0]

    accuracy  = (TP + TN) / (TP + FP + TN + FN)
    precision = TP / (TP + FP)
    recall    = TP / (TP + FN)
    f1        = 2 * precision * recall / (precision + recall)

    return matrix, accuracy, precision, recall, f1
end procedure`,
  implementations: {
    python: `import numpy as np

def confusion_matrix(y_true, y_pred, num_classes=2):
    """Build a confusion matrix from actual and predicted labels."""
    matrix = np.zeros((num_classes, num_classes), dtype=int)
    for actual, predicted in zip(y_true, y_pred):
        matrix[actual][predicted] += 1
    return matrix


def classification_metrics(cm):
    """Derive classification metrics from a 2x2 confusion matrix."""
    tp = cm[1, 1]
    tn = cm[0, 0]
    fp = cm[0, 1]
    fn = cm[1, 0]

    accuracy = (tp + tn) / cm.sum()
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = (2 * precision * recall / (precision + recall)
          if (precision + recall) > 0 else 0)

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
    }


# Example usage
y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0]

cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:\\n", cm)
print("Metrics:", classification_metrics(cm))`,
    javascript: `function confusionMatrix(yTrue, yPred, numClasses = 2) {
  const matrix = Array.from({ length: numClasses }, () =>
    Array(numClasses).fill(0)
  );
  for (let i = 0; i < yTrue.length; i++) {
    matrix[yTrue[i]][yPred[i]]++;
  }
  return matrix;
}

function classificationMetrics(cm) {
  const tp = cm[1][1];
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const total = tp + tn + fp + fn;

  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0
    ? (2 * precision * recall) / (precision + recall) : 0;

  return { accuracy, precision, recall, f1 };
}

// Example usage
const yTrue = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0];
const yPred = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0];

const cm = confusionMatrix(yTrue, yPred);
console.log("Confusion Matrix:", cm);
console.log("Metrics:", classificationMetrics(cm));`,
  },
  useCases: [
    "Medical diagnosis evaluation where false negatives (missed diseases) are more costly than false positives",
    "Spam filtering analysis to understand how many legitimate emails are incorrectly flagged",
    "Fraud detection systems where understanding the tradeoff between catching fraud and flagging legitimate transactions is critical",
    "Multi-class image classification to identify which object categories are most commonly confused",
  ],
  relatedAlgorithms: [
    "roc-auc",
    "cross-validation",
    "logistic-regression",
    "decision-tree-ml",
    "naive-bayes",
  ],
  glossaryTerms: [
    "confusion matrix",
    "precision",
    "recall",
    "f1 score",
    "accuracy",
    "true positive",
    "false positive",
    "classification",
  ],
  tags: [
    "machine-learning",
    "evaluation",
    "classification",
    "metrics",
    "beginner",
  ],
};
