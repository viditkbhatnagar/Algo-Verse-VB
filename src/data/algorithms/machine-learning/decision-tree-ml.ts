import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const decisionTreeML: AlgorithmMetadata = {
  id: "decision-tree-ml",
  name: "Decision Tree (ML)",
  category: "machine-learning",
  subcategory: "Classification",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n d log n)",
    average: "O(n d log n)",
    worst: "O(n^2 d)",
    note: "Training requires sorting n samples for each of d features at each split. With balanced splits, depth is O(log n). Prediction is O(depth) per sample.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "The tree stores split conditions and leaf predictions. In the worst case, every sample could be a leaf node. Typically O(2^depth) nodes.",
  },
  description: `A decision tree is a supervised learning algorithm that partitions the feature space into rectangular regions through a series of binary splits. Starting from the root, each internal node tests a feature against a threshold, directing samples left or right. Leaf nodes contain class labels (for classification) or predicted values (for regression). The tree is built top-down by greedily selecting the split that maximizes information gain or minimizes impurity at each node.

The most common splitting criteria are Gini Impurity and Information Gain (based on entropy). Gini impurity measures the probability of misclassifying a randomly chosen sample: Gini = 1 - sum(p_i^2) where p_i is the proportion of class i. A Gini of 0 means the node is pure (all samples belong to one class). The algorithm evaluates all possible splits across all features and chooses the one that reduces impurity the most. This process recurses until a stopping condition is met: maximum depth, minimum samples per leaf, or the node is pure.

Decision trees are highly interpretable -- the learned rules can be visualized and understood by non-experts. They handle both numerical and categorical features, require no feature scaling, and can capture non-linear decision boundaries. However, they are prone to overfitting (especially deep trees) and have high variance -- small changes in data can produce very different trees. These weaknesses motivate ensemble methods like Random Forest and Gradient Boosting that combine many trees for better generalization.`,
  shortDescription:
    "A tree-structured model that learns decision rules from data, splitting features at each node to classify or predict outcomes.",
  pseudocode: `procedure BuildDecisionTree(data, depth, maxDepth):
    if depth >= maxDepth or data is pure or |data| < minSamples:
        return LeafNode(majorityClass(data))

    bestSplit = null
    bestGain = -infinity

    for each feature f in features:
        for each threshold t in uniqueValues(data, f):
            leftData = data where f <= t
            rightData = data where f > t
            gain = gini(data) - weightedGini(leftData, rightData)
            if gain > bestGain:
                bestGain = gain
                bestSplit = (f, t)

    if bestGain <= 0:
        return LeafNode(majorityClass(data))

    left = BuildDecisionTree(leftData, depth + 1, maxDepth)
    right = BuildDecisionTree(rightData, depth + 1, maxDepth)
    return SplitNode(bestSplit.f, bestSplit.t, left, right)
end procedure`,
  implementations: {
    python: `import numpy as np

class DecisionTree:
    """Simple CART decision tree classifier."""

    def __init__(self, max_depth=3, min_samples=2):
        self.max_depth = max_depth
        self.min_samples = min_samples
        self.tree = None

    def _gini(self, y):
        classes, counts = np.unique(y, return_counts=True)
        probs = counts / len(y)
        return 1 - np.sum(probs ** 2)

    def _best_split(self, X, y):
        best_gain, best_feature, best_threshold = -1, None, None
        parent_gini = self._gini(y)

        for feature in range(X.shape[1]):
            thresholds = np.unique(X[:, feature])
            for t in thresholds:
                left = y[X[:, feature] <= t]
                right = y[X[:, feature] > t]
                if len(left) == 0 or len(right) == 0:
                    continue

                weighted = (len(left) * self._gini(left) +
                           len(right) * self._gini(right)) / len(y)
                gain = parent_gini - weighted

                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature
                    best_threshold = t

        return best_feature, best_threshold, best_gain

    def _build(self, X, y, depth):
        if (depth >= self.max_depth or len(y) < self.min_samples
                or self._gini(y) == 0):
            classes, counts = np.unique(y, return_counts=True)
            return {"leaf": True, "class": classes[np.argmax(counts)]}

        feature, threshold, gain = self._best_split(X, y)
        if gain <= 0:
            classes, counts = np.unique(y, return_counts=True)
            return {"leaf": True, "class": classes[np.argmax(counts)]}

        left_mask = X[:, feature] <= threshold
        return {
            "leaf": False,
            "feature": feature,
            "threshold": threshold,
            "left": self._build(X[left_mask], y[left_mask], depth + 1),
            "right": self._build(X[~left_mask], y[~left_mask], depth + 1),
        }

    def fit(self, X, y):
        self.tree = self._build(X, y, 0)

    def _predict_one(self, x, node):
        if node["leaf"]:
            return node["class"]
        if x[node["feature"]] <= node["threshold"]:
            return self._predict_one(x, node["left"])
        return self._predict_one(x, node["right"])

    def predict(self, X):
        return np.array([self._predict_one(x, self.tree) for x in X])`,
    javascript: `class DecisionTree {
  constructor(maxDepth = 3, minSamples = 2) {
    this.maxDepth = maxDepth;
    this.minSamples = minSamples;
    this.tree = null;
  }

  _gini(y) {
    const counts = {};
    for (const label of y) counts[label] = (counts[label] || 0) + 1;
    let impurity = 1;
    for (const count of Object.values(counts)) {
      impurity -= (count / y.length) ** 2;
    }
    return impurity;
  }

  _bestSplit(X, y) {
    let bestGain = -1, bestFeature = null, bestThreshold = null;
    const parentGini = this._gini(y);

    for (let f = 0; f < X[0].length; f++) {
      const thresholds = [...new Set(X.map((r) => r[f]))].sort((a, b) => a - b);
      for (const t of thresholds) {
        const leftY = y.filter((_, i) => X[i][f] <= t);
        const rightY = y.filter((_, i) => X[i][f] > t);
        if (!leftY.length || !rightY.length) continue;

        const weighted = (leftY.length * this._gini(leftY)
                        + rightY.length * this._gini(rightY)) / y.length;
        const gain = parentGini - weighted;
        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = f;
          bestThreshold = t;
        }
      }
    }
    return { feature: bestFeature, threshold: bestThreshold, gain: bestGain };
  }

  _build(X, y, depth) {
    if (depth >= this.maxDepth || y.length < this.minSamples
        || this._gini(y) === 0) {
      const counts = {};
      for (const l of y) counts[l] = (counts[l] || 0) + 1;
      return { leaf: true, class: Object.entries(counts)
        .sort((a, b) => b[1] - a[1])[0][0] };
    }

    const { feature, threshold, gain } = this._bestSplit(X, y);
    if (gain <= 0) {
      const counts = {};
      for (const l of y) counts[l] = (counts[l] || 0) + 1;
      return { leaf: true, class: Object.entries(counts)
        .sort((a, b) => b[1] - a[1])[0][0] };
    }

    const leftMask = X.map((r) => r[feature] <= threshold);
    return {
      leaf: false, feature, threshold,
      left: this._build(
        X.filter((_, i) => leftMask[i]),
        y.filter((_, i) => leftMask[i]), depth + 1),
      right: this._build(
        X.filter((_, i) => !leftMask[i]),
        y.filter((_, i) => !leftMask[i]), depth + 1),
    };
  }

  fit(X, y) { this.tree = this._build(X, y, 0); }

  predict(X) {
    return X.map((x) => {
      let node = this.tree;
      while (!node.leaf) {
        node = x[node.feature] <= node.threshold ? node.left : node.right;
      }
      return node.class;
    });
  }
}`,
  },
  useCases: [
    "Credit risk assessment where interpretable rules are required by regulators",
    "Medical diagnosis decision support systems that need to explain reasoning to doctors",
    "Customer churn prediction with clear, actionable rules for retention teams",
    "Feature importance analysis to understand which variables drive predictions",
  ],
  relatedAlgorithms: [
    "random-forest",
    "knn",
    "logistic-regression",
    "naive-bayes",
    "svm",
  ],
  glossaryTerms: [
    "decision tree",
    "gini impurity",
    "information gain",
    "entropy",
    "overfitting",
    "pruning",
    "classification",
    "CART",
  ],
  tags: [
    "machine-learning",
    "classification",
    "supervised-learning",
    "interpretable",
    "tree-based",
    "intermediate",
  ],
};
