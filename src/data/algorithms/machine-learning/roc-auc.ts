import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const rocAuc: AlgorithmMetadata = {
  id: "roc-auc",
  name: "ROC Curve & AUC",
  category: "machine-learning",
  subcategory: "Evaluation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Dominated by sorting the n predicted scores. After sorting, the ROC curve is computed in a single O(n) pass.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Stores the sorted scores and the ROC curve points. The number of distinct thresholds is at most n+1.",
  },
  description: `The Receiver Operating Characteristic (ROC) curve is a graphical tool for evaluating binary classifiers across all possible classification thresholds. It plots the True Positive Rate (TPR, also called Recall or Sensitivity) on the y-axis against the False Positive Rate (FPR, equal to 1 - Specificity) on the x-axis. Each point on the curve corresponds to a specific threshold for converting continuous model scores into binary predictions.

The Area Under the ROC Curve (AUC) provides a single scalar summary of the classifier's discriminative ability. AUC = 1.0 indicates a perfect classifier that achieves TPR = 1 and FPR = 0 at some threshold. AUC = 0.5 corresponds to a random classifier (the diagonal line), and AUC < 0.5 indicates a classifier performing worse than random. The AUC has an important probabilistic interpretation: it equals the probability that the model ranks a randomly chosen positive example higher than a randomly chosen negative example.

ROC-AUC is particularly valuable because it is threshold-independent and scale-invariant, making it ideal for comparing models even when they produce scores on different scales. However, it can be misleading on highly imbalanced datasets where the number of negatives vastly exceeds positives, because FPR can remain low even with many false positives. In such cases, the Precision-Recall curve is often preferred. ROC analysis originated in signal detection theory during World War II and has since become one of the most widely used evaluation tools in machine learning, medical diagnostics, and information retrieval.`,
  shortDescription:
    "A threshold-independent evaluation tool that plots TPR vs FPR across all thresholds, with AUC summarizing overall classifier quality.",
  pseudocode: `procedure ComputeROC(scores[], labels[]):
    // Sort by score descending
    sortedPairs = sort(zip(scores, labels), by=score, descending)

    totalPositive = count(labels == 1)
    totalNegative = count(labels == 0)
    tp = 0, fp = 0
    rocPoints = [(0, 0)]

    for each (score, label) in sortedPairs:
        if label == 1:
            tp += 1
        else:
            fp += 1
        tpr = tp / totalPositive
        fpr = fp / totalNegative
        rocPoints.append((fpr, tpr))
    end for

    // Compute AUC via trapezoidal rule
    auc = 0
    for i = 1 to length(rocPoints):
        dx = rocPoints[i].fpr - rocPoints[i-1].fpr
        avgTPR = (rocPoints[i].tpr + rocPoints[i-1].tpr) / 2
        auc += dx * avgTPR
    end for

    return rocPoints, auc
end procedure`,
  implementations: {
    python: `import numpy as np

def compute_roc(y_true, y_scores):
    """Compute ROC curve and AUC from scratch."""
    # Sort by score descending
    sorted_idx = np.argsort(-y_scores)
    y_true_sorted = np.array(y_true)[sorted_idx]

    total_pos = np.sum(y_true)
    total_neg = len(y_true) - total_pos

    tp, fp = 0, 0
    fpr_list, tpr_list = [0.0], [0.0]

    for label in y_true_sorted:
        if label == 1:
            tp += 1
        else:
            fp += 1
        tpr_list.append(tp / total_pos)
        fpr_list.append(fp / total_neg)

    # AUC via trapezoidal rule
    auc = np.trapz(tpr_list, fpr_list)

    return fpr_list, tpr_list, auc


# Example
np.random.seed(42)
y_true = np.random.randint(0, 2, 100)
y_scores = np.where(y_true == 1,
                     np.random.uniform(0.4, 1.0, 100),
                     np.random.uniform(0.0, 0.6, 100))

fpr, tpr, auc = compute_roc(y_true, y_scores)
print(f"AUC = {auc:.3f}")`,
    javascript: `function computeROC(yTrue, yScores) {
  // Sort by score descending
  const pairs = yTrue.map((label, i) => ({ label, score: yScores[i] }));
  pairs.sort((a, b) => b.score - a.score);

  const totalPos = yTrue.filter((l) => l === 1).length;
  const totalNeg = yTrue.length - totalPos;

  let tp = 0, fp = 0;
  const fprList = [0], tprList = [0];

  for (const { label } of pairs) {
    if (label === 1) tp++;
    else fp++;
    tprList.push(tp / totalPos);
    fprList.push(fp / totalNeg);
  }

  // AUC via trapezoidal rule
  let auc = 0;
  for (let i = 1; i < fprList.length; i++) {
    const dx = fprList[i] - fprList[i - 1];
    const avgTPR = (tprList[i] + tprList[i - 1]) / 2;
    auc += dx * avgTPR;
  }

  return { fpr: fprList, tpr: tprList, auc };
}

// Example
const yTrue = Array.from({ length: 100 }, () => Math.random() > 0.5 ? 1 : 0);
const yScores = yTrue.map((l) =>
  l === 1 ? 0.4 + Math.random() * 0.6 : Math.random() * 0.6
);
const { auc } = computeROC(yTrue, yScores);
console.log("AUC:", auc.toFixed(3));`,
  },
  useCases: [
    "Comparing multiple classifiers on the same dataset in a threshold-independent manner",
    "Medical diagnostic test evaluation where the threshold for positive diagnosis can be adjusted",
    "Credit scoring models where the tradeoff between approving bad loans and rejecting good borrowers must be analyzed",
    "Information retrieval systems measuring the ability to rank relevant documents above irrelevant ones",
  ],
  relatedAlgorithms: [
    "confusion-matrix",
    "logistic-regression",
    "svm",
    "random-forest",
    "naive-bayes",
  ],
  glossaryTerms: [
    "ROC curve",
    "AUC",
    "true positive rate",
    "false positive rate",
    "precision",
    "recall",
    "classification threshold",
    "sensitivity",
    "specificity",
  ],
  tags: [
    "machine-learning",
    "evaluation",
    "classification",
    "metrics",
    "intermediate",
  ],
};
