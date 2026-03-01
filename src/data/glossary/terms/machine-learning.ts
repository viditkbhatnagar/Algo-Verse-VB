import type { GlossaryTermData } from "@/lib/visualization/types";

export const machineLearningTerms: GlossaryTermData[] = [
  {
    slug: "supervised-learning",
    name: "Supervised Learning",
    definition:
      "A type of machine learning where the model is trained on labeled data, meaning each training example includes both input features and the correct output. The model learns to map inputs to outputs by minimizing prediction errors. Common tasks include classification and regression.",
    relatedTerms: ["unsupervised-learning", "semi-supervised-learning", "training-set", "label", "classification", "regression"],
    category: "machine-learning",
    tags: ["paradigm", "fundamentals", "labeled-data"],
  },
  {
    slug: "unsupervised-learning",
    name: "Unsupervised Learning",
    definition:
      "A type of machine learning where the model is trained on unlabeled data and must discover hidden patterns or structures on its own. The algorithm receives no correct answers during training and instead groups or transforms the data based on inherent similarities. Common tasks include clustering and dimensionality reduction.",
    relatedTerms: ["supervised-learning", "semi-supervised-learning", "k-means-clustering", "feature"],
    category: "machine-learning",
    tags: ["paradigm", "fundamentals", "unlabeled-data"],
  },
  {
    slug: "semi-supervised-learning",
    name: "Semi-Supervised Learning",
    definition:
      "A machine learning approach that combines a small amount of labeled data with a large amount of unlabeled data during training. It falls between supervised and unsupervised learning, leveraging the structure in unlabeled data to improve predictions. This is practical because labeling data is often expensive while unlabeled data is abundant.",
    relatedTerms: ["supervised-learning", "unsupervised-learning", "training-set", "label"],
    category: "machine-learning",
    tags: ["paradigm", "fundamentals"],
  },
  {
    slug: "reinforcement-learning",
    name: "Reinforcement Learning",
    definition:
      "A type of machine learning where an agent learns to make decisions by interacting with an environment. The agent receives rewards or penalties for its actions and learns a policy that maximizes cumulative reward over time. It is widely used in robotics, game playing, and autonomous systems.",
    relatedTerms: ["supervised-learning", "unsupervised-learning"],
    category: "machine-learning",
    tags: ["paradigm", "fundamentals", "agent", "reward"],
  },
  {
    slug: "feature",
    name: "Feature",
    definition:
      "An individual measurable property or characteristic of the data used as input to a machine learning model. Features are the variables that the model uses to make predictions. Good feature selection and engineering are critical to model performance.",
    relatedTerms: ["label", "feature-engineering", "feature-selection", "training-set"],
    category: "machine-learning",
    tags: ["fundamentals", "data", "input"],
  },
  {
    slug: "label",
    name: "Label",
    definition:
      "The correct answer or target value associated with a training example in supervised learning. Labels are what the model is trying to predict. For classification tasks a label is a category, while for regression tasks it is a continuous value.",
    relatedTerms: ["feature", "supervised-learning", "classification", "regression", "training-set"],
    category: "machine-learning",
    tags: ["fundamentals", "data", "target"],
  },
  {
    slug: "training-set",
    name: "Training Set",
    definition:
      "The portion of labeled data used to train a machine learning model. The model learns patterns from this data by adjusting its internal parameters. Typically, 60-80% of the available data is reserved for training.",
    relatedTerms: ["test-set", "validation-set", "cross-validation", "overfitting"],
    category: "machine-learning",
    tags: ["fundamentals", "data", "evaluation"],
  },
  {
    slug: "test-set",
    name: "Test Set",
    definition:
      "A subset of data held back from training and used only to evaluate the final performance of a trained model. The model never sees this data during training, providing an unbiased estimate of how well it will generalize to new data. Typically 10-20% of available data is reserved for testing.",
    relatedTerms: ["training-set", "validation-set", "overfitting", "cross-validation"],
    category: "machine-learning",
    tags: ["fundamentals", "data", "evaluation"],
  },
  {
    slug: "validation-set",
    name: "Validation Set",
    definition:
      "A subset of data separate from the training and test sets, used to tune model hyperparameters and make decisions during the training process. It helps detect overfitting early by monitoring performance on data the model has not been trained on. Typically 10-20% of available data is reserved for validation.",
    relatedTerms: ["training-set", "test-set", "cross-validation", "overfitting", "learning-rate"],
    category: "machine-learning",
    tags: ["fundamentals", "data", "evaluation"],
  },
  {
    slug: "cross-validation",
    name: "Cross-Validation",
    definition:
      "A resampling technique that divides the data into multiple folds and trains the model multiple times, each time using a different fold as the validation set and the rest for training. K-fold cross-validation is the most common form, where the data is split into K equal parts. It provides a more reliable estimate of model performance than a single train-test split.",
    formalDefinition:
      "In K-fold CV the dataset is partitioned into $K$ equal subsets. The model is trained $K$ times, each time holding out one fold. The final score is the average across all folds.",
    relatedTerms: ["training-set", "validation-set", "test-set", "overfitting"],
    category: "machine-learning",
    tags: ["evaluation", "resampling", "model-selection"],
  },
  {
    slug: "overfitting",
    name: "Overfitting",
    definition:
      "A problem where a model learns the training data too well, including its noise and outliers, and fails to generalize to new unseen data. An overfitted model has high accuracy on the training set but poor accuracy on the test set. It can be mitigated with regularization, more data, or simpler models.",
    relatedTerms: ["underfitting", "bias-variance-tradeoff", "regularization", "cross-validation", "training-set"],
    category: "machine-learning",
    tags: ["fundamentals", "error", "generalization"],
  },
  {
    slug: "underfitting",
    name: "Underfitting",
    definition:
      "A problem where a model is too simple to capture the underlying patterns in the data, resulting in poor performance on both the training set and test set. It occurs when the model has too few parameters or is not trained long enough. Increasing model complexity or training longer can help resolve underfitting.",
    relatedTerms: ["overfitting", "bias-variance-tradeoff", "bias"],
    category: "machine-learning",
    tags: ["fundamentals", "error", "generalization"],
  },
  {
    slug: "bias",
    name: "Bias",
    definition:
      "The error introduced by approximating a complex real-world problem with a simplified model. High bias means the model makes strong assumptions about the data and may miss important patterns, leading to underfitting. Bias is one of the two components of prediction error, alongside variance.",
    relatedTerms: ["variance", "bias-variance-tradeoff", "underfitting", "overfitting"],
    category: "machine-learning",
    tags: ["fundamentals", "error", "theory"],
  },
  {
    slug: "variance",
    name: "Variance",
    definition:
      "The amount by which a model's predictions change when trained on different subsets of the data. High variance means the model is very sensitive to the specific training data used and is likely overfitting. Variance is one of the two components of prediction error, alongside bias.",
    relatedTerms: ["bias", "bias-variance-tradeoff", "overfitting", "regularization"],
    category: "machine-learning",
    tags: ["fundamentals", "error", "theory"],
  },
  {
    slug: "bias-variance-tradeoff",
    name: "Bias-Variance Tradeoff",
    definition:
      "The fundamental tension in machine learning between a model's ability to fit the training data (low bias) and its ability to generalize to new data (low variance). Reducing one typically increases the other. The goal is to find the sweet spot that minimizes total prediction error.",
    formalDefinition:
      "Total error decomposes as: $\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$.",
    formula: "$\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2$",
    relatedTerms: ["bias", "variance", "overfitting", "underfitting", "regularization"],
    category: "machine-learning",
    tags: ["fundamentals", "theory", "tradeoff"],
  },
  {
    slug: "regularization",
    name: "Regularization",
    definition:
      "A set of techniques that constrain or penalize model complexity to prevent overfitting. Regularization adds a penalty term to the loss function that discourages large parameter values, forcing the model to find simpler solutions. Common forms include L1 (Lasso) and L2 (Ridge) regularization.",
    relatedTerms: ["l1-regularization", "l2-regularization", "overfitting", "loss-function", "bias-variance-tradeoff"],
    category: "machine-learning",
    tags: ["technique", "overfitting", "penalty"],
  },
  {
    slug: "l1-regularization",
    name: "L1 Regularization",
    definition:
      "A regularization technique that adds the sum of the absolute values of model weights to the loss function. Also known as Lasso regularization, it encourages sparse models by driving some weights to exactly zero, effectively performing feature selection. It is useful when you suspect only a few features are truly important.",
    formalDefinition:
      "The L1 penalty term is $\\lambda \\sum_{i} |w_i|$, where $\\lambda$ is the regularization strength and $w_i$ are the model weights.",
    formula: "$L_{\\text{regularized}} = L + \\lambda \\sum_{i} |w_i|$",
    relatedTerms: ["l2-regularization", "regularization", "feature-selection", "loss-function"],
    category: "machine-learning",
    tags: ["technique", "regularization", "sparsity"],
  },
  {
    slug: "l2-regularization",
    name: "L2 Regularization",
    definition:
      "A regularization technique that adds the sum of the squared values of model weights to the loss function. Also known as Ridge regularization, it discourages large weights but does not force them to zero, resulting in smaller and more evenly distributed weight values. It is generally the default regularization choice.",
    formalDefinition:
      "The L2 penalty term is $\\lambda \\sum_{i} w_i^2$, where $\\lambda$ is the regularization strength.",
    formula: "$L_{\\text{regularized}} = L + \\lambda \\sum_{i} w_i^2$",
    relatedTerms: ["l1-regularization", "regularization", "loss-function"],
    category: "machine-learning",
    tags: ["technique", "regularization", "weight-decay"],
  },
  {
    slug: "gradient-descent",
    name: "Gradient Descent",
    definition:
      "An optimization algorithm that iteratively adjusts model parameters in the direction that reduces the loss function. It computes the gradient (slope) of the loss with respect to each parameter and takes a step proportional to the negative gradient. It is the backbone of training most machine learning models.",
    formalDefinition:
      "Parameter update rule: $\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} J(\\theta_t)$, where $\\eta$ is the learning rate and $J$ is the cost function.",
    formula: "$\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)$",
    relatedTerms: ["stochastic-gradient-descent", "learning-rate", "loss-function", "cost-function"],
    category: "machine-learning",
    tags: ["optimization", "fundamentals", "iterative"],
  },
  {
    slug: "stochastic-gradient-descent",
    name: "Stochastic Gradient Descent",
    definition:
      "A variant of gradient descent that updates model parameters using the gradient computed from a single randomly chosen training example (or a small mini-batch) at each step, rather than the entire dataset. It is much faster per iteration and introduces noise that can help escape local minima. SGD is the most widely used optimizer in practice.",
    formula: "$\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t; x^{(i)}, y^{(i)})$",
    relatedTerms: ["gradient-descent", "learning-rate", "loss-function", "cost-function"],
    category: "machine-learning",
    tags: ["optimization", "stochastic", "mini-batch"],
  },
  {
    slug: "learning-rate",
    name: "Learning Rate",
    definition:
      "A hyperparameter that controls the size of the steps taken during gradient descent optimization. A learning rate that is too large can cause the model to overshoot the optimal solution and diverge, while one that is too small leads to very slow convergence. Choosing the right learning rate is one of the most important decisions in model training.",
    relatedTerms: ["gradient-descent", "stochastic-gradient-descent", "loss-function"],
    category: "machine-learning",
    tags: ["hyperparameter", "optimization", "training"],
  },
  {
    slug: "loss-function",
    name: "Loss Function",
    definition:
      "A mathematical function that measures how far a model's prediction is from the actual target value for a single training example. Common examples include mean squared error for regression and cross-entropy for classification. Minimizing the loss function is the core objective of training.",
    relatedTerms: ["cost-function", "mean-squared-error", "cross-entropy-loss", "gradient-descent"],
    category: "machine-learning",
    tags: ["fundamentals", "optimization", "evaluation"],
  },
  {
    slug: "cost-function",
    name: "Cost Function",
    definition:
      "A function that measures the average loss across the entire training dataset. While 'loss function' typically refers to the error on a single example, the cost function aggregates the losses over all examples to give an overall measure of model performance. Gradient descent minimizes the cost function.",
    formalDefinition:
      "For a dataset of $m$ examples: $J(\\theta) = \\frac{1}{m} \\sum_{i=1}^{m} L(\\hat{y}^{(i)}, y^{(i)})$, where $L$ is the loss function.",
    formula: "$J(\\theta) = \\frac{1}{m} \\sum_{i=1}^{m} L(\\hat{y}^{(i)}, y^{(i)})$",
    relatedTerms: ["loss-function", "gradient-descent", "mean-squared-error", "cross-entropy-loss"],
    category: "machine-learning",
    tags: ["fundamentals", "optimization", "evaluation"],
  },
  {
    slug: "mean-squared-error",
    name: "Mean Squared Error",
    definition:
      "A commonly used loss function for regression tasks that calculates the average of the squared differences between predicted and actual values. Squaring the errors penalizes large mistakes more heavily than small ones. It is differentiable everywhere, making it convenient for gradient-based optimization.",
    formula: "$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2$",
    relatedTerms: ["loss-function", "cost-function", "regression", "linear-regression"],
    category: "machine-learning",
    tags: ["loss", "regression", "metric"],
  },
  {
    slug: "cross-entropy-loss",
    name: "Cross-Entropy Loss",
    definition:
      "A loss function commonly used for classification tasks that measures the difference between the predicted probability distribution and the true distribution. It penalizes confident wrong predictions heavily. For binary classification it simplifies to binary cross-entropy, and for multi-class problems it extends to categorical cross-entropy.",
    formula: "$H(y, \\hat{y}) = -\\sum_{i} y_i \\log(\\hat{y}_i)$",
    relatedTerms: ["loss-function", "classification", "logistic-regression", "cost-function"],
    category: "machine-learning",
    tags: ["loss", "classification", "probability"],
  },
  {
    slug: "classification",
    name: "Classification",
    definition:
      "A supervised learning task where the goal is to predict a discrete category or class label for each input. Examples include spam detection (spam or not spam) and image recognition (cat, dog, bird). The model learns decision boundaries that separate different classes in the feature space.",
    relatedTerms: ["regression", "supervised-learning", "logistic-regression", "label", "confusion-matrix"],
    category: "machine-learning",
    tags: ["task", "supervised", "discrete"],
  },
  {
    slug: "regression",
    name: "Regression",
    definition:
      "A supervised learning task where the goal is to predict a continuous numerical value. Examples include predicting house prices, stock values, or temperature. Unlike classification which outputs categories, regression outputs a number on a continuous scale.",
    relatedTerms: ["classification", "supervised-learning", "linear-regression", "mean-squared-error", "label"],
    category: "machine-learning",
    tags: ["task", "supervised", "continuous"],
  },
  {
    slug: "linear-regression",
    name: "Linear Regression",
    definition:
      "A supervised learning algorithm that models the relationship between input features and a continuous output as a linear function. It finds the best-fitting straight line (or hyperplane in higher dimensions) through the data by minimizing the sum of squared residuals. It is one of the simplest and most interpretable machine learning models.",
    formalDefinition:
      "The model predicts $\\hat{y} = \\mathbf{w}^T \\mathbf{x} + b$, where $\\mathbf{w}$ are the weights and $b$ is the bias, optimized to minimize MSE.",
    formula: "$\\hat{y} = w_0 + w_1 x_1 + w_2 x_2 + \\cdots + w_n x_n$",
    relatedTerms: ["regression", "logistic-regression", "mean-squared-error", "gradient-descent", "supervised-learning"],
    category: "machine-learning",
    tags: ["algorithm", "regression", "linear", "interpretable"],
  },
  {
    slug: "logistic-regression",
    name: "Logistic Regression",
    definition:
      "A supervised learning algorithm used for binary classification that models the probability of an input belonging to a particular class. Despite its name, it is a classification algorithm, not a regression one. It applies the sigmoid function to a linear combination of features to produce a probability between 0 and 1.",
    formula: "$P(y=1|x) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}$",
    relatedTerms: ["linear-regression", "classification", "cross-entropy-loss", "supervised-learning"],
    category: "machine-learning",
    tags: ["algorithm", "classification", "linear", "probabilistic"],
  },
  {
    slug: "decision-tree",
    name: "Decision Tree",
    definition:
      "A supervised learning algorithm that makes predictions by learning a series of if-then-else rules from the training data, forming a tree-like structure. Each internal node tests a feature, each branch represents the outcome, and each leaf node holds a prediction. Decision trees are highly interpretable but prone to overfitting on complex datasets.",
    relatedTerms: ["random-forest", "ensemble-method", "classification", "regression", "overfitting"],
    category: "machine-learning",
    tags: ["algorithm", "interpretable", "tree-based", "non-parametric"],
  },
  {
    slug: "random-forest",
    name: "Random Forest",
    definition:
      "An ensemble learning method that builds many decision trees during training, each on a random subset of the data and features, and combines their predictions by averaging (regression) or voting (classification). This reduces overfitting compared to a single decision tree and typically produces more accurate and robust models.",
    relatedTerms: ["decision-tree", "ensemble-method", "bagging", "classification", "regression"],
    category: "machine-learning",
    tags: ["algorithm", "ensemble", "tree-based", "bagging"],
  },
  {
    slug: "support-vector-machine",
    name: "Support Vector Machine",
    definition:
      "A supervised learning algorithm that finds the optimal hyperplane that separates data points of different classes with the maximum margin. The data points closest to the hyperplane, called support vectors, define the decision boundary. SVMs can handle non-linear boundaries using kernel functions that map data into higher-dimensional spaces.",
    relatedTerms: ["classification", "supervised-learning", "feature"],
    category: "machine-learning",
    tags: ["algorithm", "classification", "margin", "kernel"],
  },
  {
    slug: "k-nearest-neighbors",
    name: "K-Nearest Neighbors",
    definition:
      "A simple supervised learning algorithm that classifies a new data point based on the majority class among its K closest neighbors in the feature space. It requires no training phase and instead stores the entire dataset, making predictions by computing distances at query time. The choice of K and the distance metric strongly affect performance.",
    relatedTerms: ["classification", "regression", "supervised-learning", "feature"],
    category: "machine-learning",
    tags: ["algorithm", "instance-based", "lazy-learning", "non-parametric"],
  },
  {
    slug: "k-means-clustering",
    name: "K-Means Clustering",
    definition:
      "An unsupervised learning algorithm that partitions data into K clusters by iteratively assigning each point to the nearest cluster centroid and then updating the centroids to the mean of assigned points. It converges when assignments no longer change. K-means is fast and simple but requires specifying K in advance and assumes spherical clusters.",
    relatedTerms: ["unsupervised-learning", "feature", "classification"],
    category: "machine-learning",
    tags: ["algorithm", "clustering", "unsupervised", "iterative"],
  },
  {
    slug: "naive-bayes",
    name: "Naive Bayes",
    definition:
      "A family of probabilistic classifiers based on Bayes' theorem that assume all features are conditionally independent given the class label. Despite this 'naive' assumption rarely being true, the algorithm works surprisingly well in practice, especially for text classification tasks like spam filtering. It is fast to train and requires very little data.",
    formula: "$P(y|\\mathbf{x}) = \\frac{P(\\mathbf{x}|y) P(y)}{P(\\mathbf{x})} \\propto P(y) \\prod_{i} P(x_i|y)$",
    relatedTerms: ["classification", "supervised-learning", "feature"],
    category: "machine-learning",
    tags: ["algorithm", "probabilistic", "classification", "text"],
  },
  {
    slug: "ensemble-method",
    name: "Ensemble Method",
    definition:
      "A machine learning technique that combines multiple models to produce a single, stronger model. The key insight is that a group of weak learners can together form a strong learner. Common ensemble strategies include bagging (e.g., random forests), boosting (e.g., AdaBoost, gradient boosting), and stacking.",
    relatedTerms: ["bagging", "boosting", "random-forest", "adaboost", "gradient-boosting"],
    category: "machine-learning",
    tags: ["technique", "combination", "meta-learning"],
  },
  {
    slug: "bagging",
    name: "Bagging",
    definition:
      "Short for Bootstrap Aggregating, bagging is an ensemble technique that trains multiple models on different random subsets of the training data (drawn with replacement) and combines their predictions by averaging or voting. It reduces variance and helps prevent overfitting. Random Forest is the most well-known bagging method.",
    relatedTerms: ["ensemble-method", "random-forest", "boosting", "variance", "overfitting"],
    category: "machine-learning",
    tags: ["technique", "ensemble", "bootstrap", "variance-reduction"],
  },
  {
    slug: "boosting",
    name: "Boosting",
    definition:
      "An ensemble technique that trains models sequentially, where each new model focuses on correcting the errors made by previous models. Unlike bagging which trains models independently, boosting builds an additive model that progressively improves. Popular boosting algorithms include AdaBoost, Gradient Boosting, and XGBoost.",
    relatedTerms: ["ensemble-method", "bagging", "adaboost", "gradient-boosting", "xgboost"],
    category: "machine-learning",
    tags: ["technique", "ensemble", "sequential", "bias-reduction"],
  },
  {
    slug: "adaboost",
    name: "AdaBoost",
    definition:
      "Short for Adaptive Boosting, AdaBoost is a boosting algorithm that assigns higher weights to misclassified training examples so that subsequent weak learners focus more on the difficult cases. Each learner's contribution to the final prediction is weighted by its accuracy. It was one of the first practical boosting algorithms and remains widely used.",
    relatedTerms: ["boosting", "ensemble-method", "gradient-boosting", "decision-tree"],
    category: "machine-learning",
    tags: ["algorithm", "ensemble", "boosting", "adaptive"],
  },
  {
    slug: "gradient-boosting",
    name: "Gradient Boosting",
    definition:
      "A boosting ensemble technique that builds models sequentially, where each new model is trained to predict the residual errors (gradients of the loss function) of the combined ensemble so far. It is highly flexible and can optimize any differentiable loss function. Gradient boosting often achieves state-of-the-art results on tabular data.",
    relatedTerms: ["boosting", "ensemble-method", "xgboost", "adaboost", "gradient-descent", "loss-function"],
    category: "machine-learning",
    tags: ["algorithm", "ensemble", "boosting", "gradient"],
  },
  {
    slug: "xgboost",
    name: "XGBoost",
    definition:
      "Short for Extreme Gradient Boosting, XGBoost is an optimized implementation of gradient boosting designed for speed and performance. It includes regularization to reduce overfitting, handles missing values natively, and uses parallel processing for fast training. XGBoost is one of the most popular algorithms for winning machine learning competitions on tabular data.",
    relatedTerms: ["gradient-boosting", "boosting", "ensemble-method", "regularization", "decision-tree"],
    category: "machine-learning",
    tags: ["algorithm", "ensemble", "boosting", "optimized"],
  },
  {
    slug: "precision",
    name: "Precision",
    definition:
      "A classification metric that measures the proportion of positive predictions that are actually correct. High precision means the model rarely labels a negative example as positive (few false positives). It is especially important in applications where false positives are costly, such as spam filtering or medical screening.",
    formula: "$\\text{Precision} = \\frac{TP}{TP + FP}$",
    relatedTerms: ["recall", "f1-score", "accuracy", "confusion-matrix", "classification"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification"],
  },
  {
    slug: "recall",
    name: "Recall",
    definition:
      "A classification metric that measures the proportion of actual positive examples that the model correctly identified. High recall means the model catches most of the positive cases (few false negatives). It is also known as sensitivity or true positive rate and is critical when missing a positive case is very costly.",
    formula: "$\\text{Recall} = \\frac{TP}{TP + FN}$",
    relatedTerms: ["precision", "f1-score", "accuracy", "confusion-matrix", "classification"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification", "sensitivity"],
  },
  {
    slug: "f1-score",
    name: "F1 Score",
    definition:
      "The harmonic mean of precision and recall, providing a single metric that balances both concerns. An F1 score of 1 indicates perfect precision and recall, while a score of 0 means the model fails completely. It is especially useful when the class distribution is imbalanced and you need a single number to compare models.",
    formula: "$F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$",
    relatedTerms: ["precision", "recall", "accuracy", "confusion-matrix", "classification"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification", "harmonic-mean"],
  },
  {
    slug: "accuracy",
    name: "Accuracy",
    definition:
      "A classification metric that measures the proportion of all predictions that are correct, including both positive and negative cases. While intuitive, accuracy can be misleading on imbalanced datasets where one class dominates. For example, predicting the majority class always yields high accuracy even without learning anything useful.",
    formula: "$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$",
    relatedTerms: ["precision", "recall", "f1-score", "confusion-matrix", "classification"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification"],
  },
  {
    slug: "confusion-matrix",
    name: "Confusion Matrix",
    definition:
      "A table that summarizes the performance of a classification model by showing the counts of true positives, true negatives, false positives, and false negatives. It provides a detailed breakdown of how the model confuses different classes. Precision, recall, F1 score, and accuracy can all be derived from the confusion matrix.",
    relatedTerms: ["precision", "recall", "f1-score", "accuracy", "classification"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification", "visualization"],
  },
  {
    slug: "roc-curve",
    name: "ROC Curve",
    definition:
      "A graph that plots the true positive rate (recall) against the false positive rate at various classification thresholds. ROC stands for Receiver Operating Characteristic. A model with perfect classification hugs the top-left corner, while a random classifier produces a diagonal line. The curve helps visualize the tradeoff between sensitivity and specificity.",
    relatedTerms: ["auc", "recall", "precision", "classification", "confusion-matrix"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification", "threshold"],
  },
  {
    slug: "auc",
    name: "AUC",
    definition:
      "Area Under the ROC Curve, a single number that summarizes the overall ability of a classifier to discriminate between positive and negative classes across all thresholds. An AUC of 1.0 represents a perfect classifier, 0.5 represents a random classifier, and values below 0.5 indicate a model performing worse than random. It is threshold-independent, making it useful for comparing models.",
    relatedTerms: ["roc-curve", "classification", "precision", "recall"],
    category: "machine-learning",
    tags: ["metric", "evaluation", "classification", "aggregate"],
  },
  {
    slug: "feature-engineering",
    name: "Feature Engineering",
    definition:
      "The process of using domain knowledge to create new input features from raw data, or to transform existing features to make them more useful for machine learning models. Examples include creating interaction terms, binning continuous values, or extracting date parts. Good feature engineering often has a bigger impact on model performance than choosing a more complex algorithm.",
    relatedTerms: ["feature", "feature-selection", "training-set"],
    category: "machine-learning",
    tags: ["technique", "preprocessing", "data-preparation"],
  },
  {
    slug: "feature-selection",
    name: "Feature Selection",
    definition:
      "The process of identifying and selecting the most relevant features (input variables) for a machine learning model while discarding irrelevant or redundant ones. It reduces model complexity, speeds up training, and can improve generalization by removing noise. Common methods include filter methods, wrapper methods, and embedded methods like L1 regularization.",
    relatedTerms: ["feature", "feature-engineering", "l1-regularization", "overfitting"],
    category: "machine-learning",
    tags: ["technique", "preprocessing", "dimensionality-reduction"],
  },
];
