import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const adamOptimizer: AlgorithmMetadata = {
  id: "adam-optimizer",
  name: "Adam Optimizer",
  category: "deep-learning",
  subcategory: "Optimization",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n * d)",
    average: "O(n * d)",
    worst: "O(n * d)",
    note: "Same per-iteration cost as SGD. Adam requires O(d) extra operations per step for maintaining first and second moment estimates.",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(d)",
    note: "Stores two moment vectors (m and v) plus the parameters, totaling 3x the memory of vanilla SGD for d parameters.",
  },
  description: `Adam (Adaptive Moment Estimation) is the most widely used optimizer in deep learning. Published by Kingma and Ba in 2015, Adam combines the benefits of two earlier optimizers: Momentum (which tracks the first moment / mean of gradients) and RMSprop (which tracks the second moment / uncentered variance of gradients). By maintaining per-parameter adaptive learning rates, Adam converges faster than vanilla SGD or momentum alone, especially on problems with sparse gradients or noisy objectives.

Adam maintains two exponentially decaying running averages: m_t (the first moment, similar to momentum) and v_t (the second moment, the mean of squared gradients). The first moment gives the direction of the gradient, while the second moment scales each parameter's learning rate inversely proportional to the historical gradient magnitude. This means parameters with large gradients get smaller effective learning rates, and parameters with small gradients get larger ones. Bias correction is applied to both moments to account for their initialization at zero: m_hat = m_t / (1 - beta1^t) and v_hat = v_t / (1 - beta2^t).

The default hyperparameters (lr=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8) work well across a wide range of problems, making Adam highly practical. However, Adam has known issues: it can converge to sharp minima that generalize poorly, and its adaptive learning rates can be too aggressive in some cases. Variants like AdamW (which decouples weight decay from the adaptive learning rate), AMSGrad (which uses the maximum of past v_t values), and LAMB (for large-batch training) address these issues. Despite these nuances, Adam remains the default optimizer for most deep learning applications.`,
  shortDescription:
    "An adaptive optimizer combining momentum (first moment) and RMSprop (second moment) to maintain per-parameter learning rates for faster, more stable training.",
  pseudocode: `procedure Adam(parameters, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
    // Initialize moment estimates
    m = zeros_like(parameters)  // first moment (mean)
    v = zeros_like(parameters)  // second moment (variance)
    t = 0                       // timestep

    for each mini-batch:
        t = t + 1
        gradient = compute_gradient(parameters)

        // Update biased first moment estimate
        m = beta1 * m + (1 - beta1) * gradient

        // Update biased second moment estimate
        v = beta2 * v + (1 - beta2) * gradient²

        // Bias correction
        m_hat = m / (1 - beta1^t)
        v_hat = v / (1 - beta2^t)

        // Update parameters
        parameters = parameters - lr * m_hat / (sqrt(v_hat) + eps)
    end for
end procedure`,
  implementations: {
    python: `import numpy as np

class Adam:
    """Adam optimizer with bias correction."""

    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = None  # First moment
        self.v = None  # Second moment
        self.t = 0     # Timestep

    def step(self, params: np.ndarray, gradient: np.ndarray) -> np.ndarray:
        """Perform one Adam optimization step."""
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)

        self.t += 1

        # Update biased first moment estimate
        self.m = self.beta1 * self.m + (1 - self.beta1) * gradient

        # Update biased second moment estimate
        self.v = self.beta2 * self.v + (1 - self.beta2) * gradient**2

        # Bias-corrected estimates
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)

        # Update parameters
        params = params - self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
        return params


def rosenbrock(x, y):
    return (1 - x)**2 + 100 * (y - x**2)**2

def rosenbrock_grad(x, y):
    dx = -2 * (1 - x) - 400 * x * (y - x**2)
    dy = 200 * (y - x**2)
    return np.array([dx, dy])


# Example: Minimize Rosenbrock function
if __name__ == "__main__":
    params = np.array([-1.0, 1.0])
    optimizer = Adam(lr=0.01)

    for i in range(1000):
        grad = rosenbrock_grad(params[0], params[1])
        params = optimizer.step(params, grad)
        if (i + 1) % 200 == 0:
            loss = rosenbrock(params[0], params[1])
            print(f"Step {i+1}: params={params.round(4)}, loss={loss:.4f}")`,
    javascript: `class Adam {
  constructor(lr = 0.001, beta1 = 0.9, beta2 = 0.999, eps = 1e-8) {
    this.lr = lr;
    this.beta1 = beta1;
    this.beta2 = beta2;
    this.eps = eps;
    this.m = null;
    this.v = null;
    this.t = 0;
  }

  step(params, gradient) {
    if (!this.m) {
      this.m = new Array(params.length).fill(0);
      this.v = new Array(params.length).fill(0);
    }

    this.t += 1;

    // Update moments
    this.m = this.m.map((mi, i) =>
      this.beta1 * mi + (1 - this.beta1) * gradient[i]
    );
    this.v = this.v.map((vi, i) =>
      this.beta2 * vi + (1 - this.beta2) * gradient[i] ** 2
    );

    // Bias correction
    const mHat = this.m.map(mi => mi / (1 - this.beta1 ** this.t));
    const vHat = this.v.map(vi => vi / (1 - this.beta2 ** this.t));

    // Update parameters
    return params.map((p, i) =>
      p - this.lr * mHat[i] / (Math.sqrt(vHat[i]) + this.eps)
    );
  }
}

// Example: quadratic optimization
const adam = new Adam(0.1);
let params = [5.0, 3.0];

for (let i = 0; i < 100; i++) {
  const grad = [2 * params[0], 20 * params[1]];
  params = adam.step(params, grad);
  if ((i + 1) % 20 === 0) {
    const loss = params[0]**2 + 10 * params[1]**2;
    console.log(\`Step \${i+1}: [\${params.map(p => p.toFixed(4))}], loss=\${loss.toFixed(4)}\`);
  }
}`,
  },
  useCases: [
    "Default optimizer for training Transformers, GPT models, and most modern deep learning architectures",
    "Natural language processing tasks where sparse gradients from embeddings benefit from adaptive learning rates",
    "Generative adversarial networks (GANs) where training dynamics are unstable and adaptive rates help",
    "Transfer learning and fine-tuning pre-trained models where different parameters need different learning rates",
  ],
  relatedAlgorithms: [
    "sgd-momentum",
    "backpropagation",
    "gradient-descent",
    "loss-functions",
    "sgd",
  ],
  glossaryTerms: [
    "adaptive learning rate",
    "first moment",
    "second moment",
    "bias correction",
    "exponential moving average",
    "weight decay",
    "convergence",
  ],
  tags: [
    "deep-learning",
    "optimization",
    "adaptive-learning-rate",
    "adam",
    "training",
    "advanced",
  ],
};
