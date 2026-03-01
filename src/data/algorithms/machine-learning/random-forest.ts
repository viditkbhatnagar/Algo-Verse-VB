import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const randomForest: AlgorithmMetadata = {
  id: "random-forest",
  name: "Random Forest",
  category: "machine-learning",
  subcategory: "Ensemble Methods",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(T * n d log n)",
    average: "O(T * n d log n)",
    worst: "O(T * n^2 d)",
    note: "Trains T decision trees, each on a bootstrap sample of n points with d features. Feature subsampling uses sqrt(d) features per split. Prediction is O(T * depth).",
  },
  spaceComplexity: {
    best: "O(T * n)",
    average: "O(T * n)",
    worst: "O(T * n)",
    note: "Stores T complete decision trees. Each tree requires O(n) space in the worst case.",
  },
  description: `Random Forest is an ensemble learning method that combines multiple decision trees to produce more accurate and robust predictions than any single tree. Introduced by Leo Breiman in 2001, it uses two key sources of randomness: bootstrap aggregating (bagging) and random feature selection. Each tree is trained on a different random subset of the training data (drawn with replacement), and at each split, only a random subset of features is considered.

The bagging process creates diversity among the trees: since each tree sees a different subset of the data, they make different errors. When their predictions are aggregated by majority vote (classification) or averaging (regression), the individual errors tend to cancel out, significantly reducing variance compared to a single decision tree. The random feature selection at each split further decorrelates the trees, preventing them from all learning the same dominant patterns.

Random Forests have several practical advantages: they are remarkably resistant to overfitting (even with hundreds of trees), they handle high-dimensional data well, they provide built-in feature importance scores, and they require minimal hyperparameter tuning. The Out-of-Bag (OOB) error estimate provides a free validation metric. Key hyperparameters are the number of trees (more is generally better), maximum depth, and the number of features considered per split (sqrt(d) for classification, d/3 for regression). Random Forest is one of the most widely used algorithms in data science, from Kaggle competitions to production ML systems.`,
  shortDescription:
    "An ensemble of decision trees trained on random subsets of data and features, combined by majority vote for robust predictions.",
  pseudocode: `procedure RandomForest(data, numTrees, maxDepth):
    forest = []

    for t = 1 to numTrees:
        // Bootstrap sample (sample with replacement)
        bootstrapData = sample(data, |data|, with_replacement=true)

        // Build tree with random feature subsets at each split
        tree = BuildRandomTree(bootstrapData, maxDepth)
        forest.append(tree)
    end for

    return forest

procedure Predict(forest, queryPoint):
    votes = {}
    for each tree in forest:
        prediction = tree.predict(queryPoint)
        votes[prediction] += 1
    end for
    return argmax(votes)  // Majority vote

procedure BuildRandomTree(data, maxDepth, depth=0):
    if stopping_condition:
        return LeafNode(majorityClass(data))

    // Random feature subset: sqrt(d) features
    featureSubset = randomSample(features, sqrt(d))
    bestSplit = findBestSplit(data, featureSubset)

    left = BuildRandomTree(leftData, maxDepth, depth + 1)
    right = BuildRandomTree(rightData, maxDepth, depth + 1)
    return SplitNode(bestSplit, left, right)`,
  implementations: {
    python: `import numpy as np
from collections import Counter

class RandomForest:
    """Simple Random Forest classifier."""

    def __init__(self, n_trees=100, max_depth=5, max_features="sqrt"):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.max_features = max_features
        self.trees = []

    def _bootstrap(self, X, y):
        n = len(X)
        indices = np.random.choice(n, n, replace=True)
        return X[indices], y[indices]

    def _build_tree(self, X, y, depth=0):
        n_features = X.shape[1]
        if self.max_features == "sqrt":
            m = int(np.sqrt(n_features))
        else:
            m = n_features

        if depth >= self.max_depth or len(np.unique(y)) == 1:
            return {"leaf": True, "class": Counter(y).most_common(1)[0][0]}

        # Random feature subset
        feature_idx = np.random.choice(n_features, m, replace=False)
        best_gain, best_feat, best_thresh = -1, None, None

        for f in feature_idx:
            thresholds = np.unique(X[:, f])
            for t in thresholds:
                left_y = y[X[:, f] <= t]
                right_y = y[X[:, f] > t]
                if len(left_y) == 0 or len(right_y) == 0:
                    continue
                gain = self._info_gain(y, left_y, right_y)
                if gain > best_gain:
                    best_gain, best_feat, best_thresh = gain, f, t

        if best_gain <= 0:
            return {"leaf": True, "class": Counter(y).most_common(1)[0][0]}

        mask = X[:, best_feat] <= best_thresh
        return {
            "leaf": False, "feature": best_feat, "threshold": best_thresh,
            "left": self._build_tree(X[mask], y[mask], depth + 1),
            "right": self._build_tree(X[~mask], y[~mask], depth + 1),
        }

    def _info_gain(self, parent, left, right):
        def entropy(y):
            probs = np.bincount(y) / len(y)
            return -np.sum(p * np.log2(p + 1e-10) for p in probs if p > 0)
        n = len(parent)
        return entropy(parent) - (len(left)/n * entropy(left)
                                 + len(right)/n * entropy(right))

    def fit(self, X, y):
        self.trees = []
        for _ in range(self.n_trees):
            X_boot, y_boot = self._bootstrap(X, y)
            self.trees.append(self._build_tree(X_boot, y_boot))

    def predict(self, X):
        preds = np.array([[self._predict_one(x, t) for t in self.trees]
                          for x in X])
        return np.array([Counter(row).most_common(1)[0][0] for row in preds])

    def _predict_one(self, x, node):
        if node["leaf"]:
            return node["class"]
        if x[node["feature"]] <= node["threshold"]:
            return self._predict_one(x, node["left"])
        return self._predict_one(x, node["right"])`,
    javascript: `class RandomForest {
  constructor(nTrees = 10, maxDepth = 5) {
    this.nTrees = nTrees;
    this.maxDepth = maxDepth;
    this.trees = [];
  }

  _bootstrap(X, y) {
    const n = X.length;
    const indices = Array.from({ length: n }, () =>
      Math.floor(Math.random() * n)
    );
    return {
      X: indices.map((i) => X[i]),
      y: indices.map((i) => y[i]),
    };
  }

  _gini(y) {
    const counts = {};
    for (const v of y) counts[v] = (counts[v] || 0) + 1;
    let impurity = 1;
    for (const c of Object.values(counts))
      impurity -= (c / y.length) ** 2;
    return impurity;
  }

  _buildTree(X, y, depth = 0) {
    const unique = [...new Set(y)];
    if (depth >= this.maxDepth || unique.length === 1 || y.length < 4) {
      const counts = {};
      for (const v of y) counts[v] = (counts[v] || 0) + 1;
      return {
        leaf: true,
        class: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0],
      };
    }

    const d = X[0].length;
    const m = Math.max(1, Math.floor(Math.sqrt(d)));
    const features = [];
    while (features.length < m) {
      const f = Math.floor(Math.random() * d);
      if (!features.includes(f)) features.push(f);
    }

    let bestGain = -1, bestFeat = null, bestThresh = null;
    const parentGini = this._gini(y);

    for (const f of features) {
      const vals = [...new Set(X.map((r) => r[f]))].sort((a, b) => a - b);
      for (const t of vals) {
        const leftY = y.filter((_, i) => X[i][f] <= t);
        const rightY = y.filter((_, i) => X[i][f] > t);
        if (!leftY.length || !rightY.length) continue;
        const wg = (leftY.length * this._gini(leftY) +
                    rightY.length * this._gini(rightY)) / y.length;
        const gain = parentGini - wg;
        if (gain > bestGain) {
          bestGain = gain; bestFeat = f; bestThresh = t;
        }
      }
    }

    if (bestGain <= 0) {
      const counts = {};
      for (const v of y) counts[v] = (counts[v] || 0) + 1;
      return {
        leaf: true,
        class: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0],
      };
    }

    const mask = X.map((r) => r[bestFeat] <= bestThresh);
    return {
      leaf: false, feature: bestFeat, threshold: bestThresh,
      left: this._buildTree(X.filter((_, i) => mask[i]),
                            y.filter((_, i) => mask[i]), depth + 1),
      right: this._buildTree(X.filter((_, i) => !mask[i]),
                             y.filter((_, i) => !mask[i]), depth + 1),
    };
  }

  fit(X, y) {
    this.trees = [];
    for (let t = 0; t < this.nTrees; t++) {
      const { X: Xb, y: yb } = this._bootstrap(X, y);
      this.trees.push(this._buildTree(Xb, yb));
    }
  }

  predict(X) {
    return X.map((x) => {
      const votes = {};
      for (const tree of this.trees) {
        let node = tree;
        while (!node.leaf) {
          node = x[node.feature] <= node.threshold
            ? node.left : node.right;
        }
        votes[node.class] = (votes[node.class] || 0) + 1;
      }
      return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    });
  }
}`,
  },
  useCases: [
    "Kaggle competitions and tabular data challenges where Random Forest consistently performs among the top models",
    "Feature importance ranking to understand which variables most influence predictions",
    "Anomaly detection in cybersecurity by measuring how isolated data points are in the forest",
    "Medical research for patient outcome prediction with built-in handling of missing values",
  ],
  relatedAlgorithms: [
    "decision-tree-ml",
    "knn",
    "svm",
    "logistic-regression",
    "cross-validation",
  ],
  glossaryTerms: [
    "random forest",
    "bagging",
    "bootstrap",
    "ensemble learning",
    "decision tree",
    "feature importance",
    "out-of-bag error",
    "variance reduction",
  ],
  tags: [
    "machine-learning",
    "ensemble",
    "classification",
    "regression",
    "supervised-learning",
    "bagging",
    "intermediate",
  ],
};
