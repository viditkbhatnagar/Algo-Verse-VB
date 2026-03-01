import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const naiveBayes: AlgorithmMetadata = {
  id: "naive-bayes",
  name: "Naive Bayes",
  category: "machine-learning",
  subcategory: "Classification",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n d)",
    average: "O(n d)",
    worst: "O(n d)",
    note: "Training requires a single pass over n samples with d features to compute class priors and per-feature statistics. Prediction is O(C * d) per sample where C is the number of classes.",
  },
  spaceComplexity: {
    best: "O(C d)",
    average: "O(C d)",
    worst: "O(C d)",
    note: "Stores per-class priors and per-feature-per-class statistics (mean/variance for Gaussian, counts for Multinomial). Very memory-efficient.",
  },
  description: `Naive Bayes is a family of probabilistic classifiers based on Bayes' theorem with the "naive" assumption that all features are conditionally independent given the class label. Despite this unrealistic assumption, Naive Bayes classifiers are surprisingly effective in many real-world applications and serve as a strong baseline. The algorithm computes the posterior probability P(class | features) using Bayes' rule: P(class | x) = P(x | class) * P(class) / P(x).

There are three main variants: Gaussian Naive Bayes (for continuous features, assumes Gaussian distributions), Multinomial Naive Bayes (for count data, popular in text classification), and Bernoulli Naive Bayes (for binary features). Gaussian NB models each feature per class as a Gaussian distribution parameterized by its mean and variance. For a query point, it computes the likelihood of the features under each class's distributions, multiplies by the class prior, and selects the class with the highest posterior probability.

The key advantage of Naive Bayes is its efficiency: training is extremely fast (single pass, O(n*d)), prediction is fast (O(C*d)), and it requires very little memory. It handles high-dimensional data well and performs particularly well when the independence assumption roughly holds, as in text classification (spam filtering, sentiment analysis, document categorization). The Laplace smoothing technique handles zero-frequency features. While more sophisticated models often outperform Naive Bayes, its speed, simplicity, and surprisingly good performance make it an essential part of any ML practitioner's toolkit.`,
  shortDescription:
    "A fast probabilistic classifier that applies Bayes' theorem with the assumption of feature independence to compute class posteriors.",
  pseudocode: `procedure TrainNaiveBayes(X, y):
    classes = unique(y)
    for each class c in classes:
        P(c) = count(y == c) / |y|  // Prior
        for each feature j:
            // For Gaussian NB:
            mean[c][j] = mean(X[y==c, j])
            var[c][j]  = variance(X[y==c, j])
        end for
    end for
    return model(priors, means, variances)

procedure PredictNaiveBayes(model, x):
    for each class c:
        posterior[c] = log(P(c))  // Log-prior
        for each feature j:
            // Gaussian likelihood
            posterior[c] += log(GaussianPDF(x[j], mean[c][j], var[c][j]))
        end for
    end for
    return argmax(posterior)
end procedure`,
  implementations: {
    python: `import numpy as np

class GaussianNaiveBayes:
    """Gaussian Naive Bayes classifier."""

    def __init__(self):
        self.classes = None
        self.priors = {}
        self.means = {}
        self.vars = {}

    def fit(self, X, y):
        self.classes = np.unique(y)
        for c in self.classes:
            X_c = X[y == c]
            self.priors[c] = len(X_c) / len(X)
            self.means[c] = X_c.mean(axis=0)
            self.vars[c] = X_c.var(axis=0) + 1e-6  # Smoothing

    def _gaussian_pdf(self, x, mean, var):
        coeff = 1.0 / np.sqrt(2 * np.pi * var)
        exponent = np.exp(-((x - mean) ** 2) / (2 * var))
        return coeff * exponent

    def predict(self, X):
        return np.array([self._predict_one(x) for x in X])

    def _predict_one(self, x):
        posteriors = {}
        for c in self.classes:
            prior = np.log(self.priors[c])
            likelihood = np.sum(
                np.log(self._gaussian_pdf(x, self.means[c], self.vars[c]))
            )
            posteriors[c] = prior + likelihood
        return max(posteriors, key=posteriors.get)


# Example
X = np.array([[1,2],[2,3],[3,1],[6,5],[7,8],[8,6]])
y = np.array([0, 0, 0, 1, 1, 1])
model = GaussianNaiveBayes()
model.fit(X, y)
print("Prediction:", model.predict(np.array([[5, 5]])))`,
    javascript: `class GaussianNaiveBayes {
  constructor() {
    this.classes = [];
    this.priors = {};
    this.means = {};
    this.vars = {};
  }

  fit(X, y) {
    this.classes = [...new Set(y)];
    for (const c of this.classes) {
      const Xc = X.filter((_, i) => y[i] === c);
      this.priors[c] = Xc.length / X.length;
      const d = X[0].length;
      this.means[c] = Array(d).fill(0);
      this.vars[c] = Array(d).fill(0);
      for (const row of Xc)
        for (let j = 0; j < d; j++) this.means[c][j] += row[j] / Xc.length;
      for (const row of Xc)
        for (let j = 0; j < d; j++)
          this.vars[c][j] += (row[j] - this.means[c][j]) ** 2 / Xc.length;
      this.vars[c] = this.vars[c].map((v) => v + 1e-6);
    }
  }

  _gaussianPDF(x, mean, variance) {
    return (1 / Math.sqrt(2 * Math.PI * variance))
      * Math.exp(-((x - mean) ** 2) / (2 * variance));
  }

  predict(X) {
    return X.map((x) => {
      let bestClass = null, bestScore = -Infinity;
      for (const c of this.classes) {
        let score = Math.log(this.priors[c]);
        for (let j = 0; j < x.length; j++) {
          score += Math.log(
            this._gaussianPDF(x[j], this.means[c][j], this.vars[c][j])
          );
        }
        if (score > bestScore) { bestScore = score; bestClass = c; }
      }
      return bestClass;
    });
  }
}

const X = [[1,2],[2,3],[3,1],[6,5],[7,8],[8,6]];
const y = [0, 0, 0, 1, 1, 1];
const model = new GaussianNaiveBayes();
model.fit(X, y);
console.log("Prediction:", model.predict([[5, 5]]));`,
  },
  useCases: [
    "Email spam detection using word frequencies (Multinomial Naive Bayes is the standard approach)",
    "Sentiment analysis of product reviews and social media posts",
    "Medical diagnosis with independent symptom features for rapid preliminary screening",
    "Real-time classification in streaming data where training and prediction speed are critical",
  ],
  relatedAlgorithms: [
    "logistic-regression",
    "knn",
    "decision-tree-ml",
    "svm",
    "confusion-matrix",
  ],
  glossaryTerms: [
    "Bayes theorem",
    "prior probability",
    "posterior probability",
    "likelihood",
    "conditional independence",
    "Gaussian distribution",
    "classification",
    "Laplace smoothing",
  ],
  tags: [
    "machine-learning",
    "classification",
    "probabilistic",
    "supervised-learning",
    "text-classification",
    "intermediate",
  ],
};
