import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const gradientDescent: AlgorithmMetadata = {
  id: "gradient-descent",
  name: "Gradient Descent",
  category: "machine-learning",
  subcategory: "Optimization",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n * d)",
    average: "O(T * n * d)",
    worst: "O(T * n * d)",
    note: "Each iteration computes the gradient over all n samples with d features, taking O(n*d). T is the number of iterations until convergence. For convex functions with Lipschitz-continuous gradients, T = O(1/epsilon) to reach epsilon-accuracy. For strongly convex functions, convergence is linear: T = O(kappa * log(1/epsilon)) where kappa is the condition number.",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(n * d)",
    note: "Requires O(d) space to store the parameter vector and gradient. If the full dataset must be loaded into memory, O(n*d) is needed. The gradient accumulator uses O(d) space regardless of dataset size.",
  },
  description: `Gradient Descent is the foundational optimization algorithm used throughout machine learning to find the parameters that minimize a loss function. The core idea is elegantly simple: starting from an initial guess, the algorithm iteratively moves the parameters in the direction opposite to the gradient (the direction of steepest increase), which is the direction of steepest decrease. By taking small steps in this direction, the algorithm converges toward a local minimum of the loss function. The size of each step is controlled by the learning rate hyperparameter.

At each iteration, the algorithm computes the gradient of the loss function with respect to all parameters using the entire training dataset. This "batch" gradient provides an exact measure of the loss surface at the current point, ensuring that each update moves reliably toward lower loss. The update rule is simple: theta_new = theta_old - learning_rate * gradient. The learning rate must be carefully chosen: too large and the algorithm may overshoot the minimum and diverge; too small and convergence will be impractically slow. For convex loss functions (like those in linear regression), gradient descent is guaranteed to find the global minimum.

Gradient Descent forms the backbone of training virtually all machine learning models, from linear regression and logistic regression to deep neural networks. While the basic "batch" version computes the gradient using all training data in each step (making it computationally expensive for large datasets), its variants such as Stochastic Gradient Descent (SGD) and Mini-batch Gradient Descent address scalability by using random subsets of the data. Advanced optimizers like Adam, RMSProp, and AdaGrad build on the gradient descent foundation by adaptively adjusting learning rates for different parameters.`,
  shortDescription:
    "Iteratively minimizes a loss function by updating parameters in the direction opposite to the gradient, controlled by a learning rate.",
  pseudocode: `procedure GradientDescent(f, grad_f, theta_init, lr, max_iter, tol):
    // f: loss function
    // grad_f: gradient of loss function
    // theta_init: initial parameter values
    // lr: learning rate
    // max_iter: maximum iterations
    // tol: convergence tolerance

    theta = theta_init

    for t = 1 to max_iter do
        // Compute gradient over entire dataset
        g = grad_f(theta)

        // Update parameters
        theta = theta - lr * g

        // Check convergence
        if ||g|| < tol then
            break
        end if
    end for

    return theta
end procedure`,
  implementations: {
    python: `import numpy as np

def gradient_descent(
    f,
    grad_f,
    x_init: float,
    lr: float = 0.1,
    max_iter: int = 100,
    tol: float = 1e-6
):
    """
    Minimize a function using Gradient Descent.

    Parameters:
        f: loss function f(x) -> float
        grad_f: gradient function grad_f(x) -> float
        x_init: initial parameter value
        lr: learning rate (step size)
        max_iter: maximum number of iterations
        tol: convergence tolerance on gradient norm

    Returns:
        x_opt: optimal parameter value
        history: list of (x, f(x)) at each iteration
    """
    x = x_init
    history = [(x, f(x))]

    for i in range(max_iter):
        grad = grad_f(x)

        # Update rule
        x = x - lr * grad

        history.append((x, f(x)))

        # Check convergence
        if abs(grad) < tol:
            print(f"Converged after {i + 1} iterations")
            break

    return x, history


# Example: minimize f(x) = x^2 + 0.5*sin(3x)
if __name__ == "__main__":
    f = lambda x: x**2 + 0.5 * np.sin(3 * x)
    grad_f = lambda x: 2 * x + 1.5 * np.cos(3 * x)

    x_opt, history = gradient_descent(f, grad_f, x_init=3.0, lr=0.1)
    print(f"Minimum at x = {x_opt:.6f}, f(x) = {f(x_opt):.6f}")
    print(f"Total iterations: {len(history) - 1}")`,
    javascript: `function gradientDescent(f, gradF, xInit, lr = 0.1, maxIter = 100, tol = 1e-6) {
  /**
   * Minimize a function using Gradient Descent.
   * @param {Function} f - Loss function f(x) -> number
   * @param {Function} gradF - Gradient function gradF(x) -> number
   * @param {number} xInit - Initial parameter value
   * @param {number} lr - Learning rate
   * @param {number} maxIter - Maximum iterations
   * @param {number} tol - Convergence tolerance
   * @returns {{ xOpt: number, history: Array<{x: number, fx: number}> }}
   */
  let x = xInit;
  const history = [{ x, fx: f(x) }];

  for (let i = 0; i < maxIter; i++) {
    const grad = gradF(x);

    // Update rule: x_new = x_old - lr * gradient
    x = x - lr * grad;

    history.push({ x, fx: f(x) });

    // Check convergence
    if (Math.abs(grad) < tol) {
      console.log(\`Converged after \${i + 1} iterations\`);
      break;
    }
  }

  return { xOpt: x, history };
}

// Example: minimize f(x) = x^2 + 0.5*sin(3x)
const f = (x) => x * x + 0.5 * Math.sin(3 * x);
const gradF = (x) => 2 * x + 1.5 * Math.cos(3 * x);

const { xOpt, history } = gradientDescent(f, gradF, 3.0, 0.1);
console.log(\`Minimum at x = \${xOpt.toFixed(6)}, f(x) = \${f(xOpt).toFixed(6)}\`);
console.log(\`Total iterations: \${history.length - 1}\`);`,
  },
  useCases: [
    "Training linear regression and logistic regression models by minimizing mean squared error or cross-entropy loss",
    "Optimizing neural network weights during backpropagation through millions of parameters",
    "Fitting maximum likelihood estimators in statistical models where closed-form solutions do not exist",
    "Solving convex optimization problems in operations research such as portfolio optimization and resource allocation",
  ],
  relatedAlgorithms: [
    "sgd",
    "mini-batch-gd",
    "linear-regression",
    "logistic-regression",
  ],
  glossaryTerms: [
    "gradient",
    "learning rate",
    "loss function",
    "convergence",
    "convex optimization",
    "backpropagation",
    "hyperparameter",
  ],
  tags: [
    "machine-learning",
    "optimization",
    "gradient",
    "beginner",
    "foundational",
    "training",
    "loss-minimization",
  ],
};
