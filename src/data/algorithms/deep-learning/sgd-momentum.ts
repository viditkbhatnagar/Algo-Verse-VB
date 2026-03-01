import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const sgdMomentum: AlgorithmMetadata = {
  id: "sgd-momentum",
  name: "SGD with Momentum",
  category: "deep-learning",
  subcategory: "Optimization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * d)",
    average: "O(n * d)",
    worst: "O(n * d)",
    note: "Same as vanilla SGD. Per-iteration cost is O(d) for d parameters. Momentum adds negligible overhead (one extra vector multiplication).",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(d)",
    note: "Requires storing a velocity vector of size d (same as the parameter vector), doubling the memory compared to vanilla SGD.",
  },
  description: `SGD with Momentum is an optimization algorithm that accelerates gradient descent by accumulating a velocity vector in the direction of persistent gradients. Introduced by Polyak in 1964 and applied to neural networks by Rumelhart, Hinton, and Williams, momentum helps solve two key problems with vanilla SGD: oscillation in ravines (narrow valleys in the loss landscape) and slow convergence on flat plateaus.

The core idea is borrowed from physics: a ball rolling downhill gains momentum, allowing it to move faster in consistent directions and dampen oscillations in inconsistent directions. Mathematically, momentum maintains an exponentially decaying moving average of past gradients (the velocity): v_t = beta * v_{t-1} + gradient, where beta (typically 0.9) is the momentum coefficient. The parameter update uses this velocity instead of the raw gradient: theta = theta - lr * v_t. This means that if gradients consistently point in the same direction, the velocity builds up and parameters change faster. If gradients oscillate, the momentum averages them out.

Momentum dramatically improves training in practice. Without momentum, SGD oscillates back and forth across narrow valleys while making slow progress along the valley floor. With momentum, the perpendicular oscillations cancel out while the consistent valley-floor direction accumulates speed. This leads to faster convergence, especially on ill-conditioned problems (where some directions have much steeper gradients than others). Nearly all modern deep learning training uses momentum (typically beta=0.9), often combined with learning rate scheduling and other techniques. Nesterov momentum, a variant that "looks ahead" before computing the gradient, provides even better theoretical convergence guarantees.`,
  shortDescription:
    "An optimization algorithm that accelerates SGD by accumulating velocity in the direction of consistent gradients, reducing oscillation and speeding convergence.",
  pseudocode: `procedure SGD_Momentum(parameters, learningRate, beta, epochs):
    // Initialize velocity to zero
    v = zeros_like(parameters)

    for epoch = 1 to epochs:
        for each mini-batch (X, y):
            // Compute gradient
            gradient = compute_gradient(parameters, X, y)

            // Update velocity (exponential moving average)
            v = beta * v + gradient

            // Update parameters
            parameters = parameters - learningRate * v
        end for
    end for
end procedure

// Nesterov Momentum (look-ahead variant):
procedure Nesterov_Momentum(parameters, lr, beta, epochs):
    v = zeros_like(parameters)
    for each mini-batch:
        // Look ahead
        look_ahead = parameters - beta * v
        gradient = compute_gradient(look_ahead, X, y)
        v = beta * v + gradient
        parameters = parameters - lr * v
    end for
end procedure`,
  implementations: {
    python: `import numpy as np

class SGDMomentum:
    """SGD optimizer with momentum."""

    def __init__(self, lr: float = 0.01, momentum: float = 0.9):
        self.lr = lr
        self.momentum = momentum
        self.velocity = None

    def step(self, params: np.ndarray, gradient: np.ndarray) -> np.ndarray:
        """Perform one optimization step."""
        if self.velocity is None:
            self.velocity = np.zeros_like(params)

        # Update velocity
        self.velocity = self.momentum * self.velocity + gradient

        # Update parameters
        params = params - self.lr * self.velocity
        return params


def rosenbrock(x, y):
    """Rosenbrock function: classic optimization benchmark."""
    return (1 - x)**2 + 100 * (y - x**2)**2

def rosenbrock_grad(x, y):
    """Gradient of Rosenbrock function."""
    dx = -2 * (1 - x) - 400 * x * (y - x**2)
    dy = 200 * (y - x**2)
    return np.array([dx, dy])


# Example: Minimize Rosenbrock function
if __name__ == "__main__":
    params = np.array([-1.0, 1.0])
    optimizer = SGDMomentum(lr=0.001, momentum=0.9)

    for i in range(500):
        grad = rosenbrock_grad(params[0], params[1])
        params = optimizer.step(params, grad)
        if (i + 1) % 100 == 0:
            loss = rosenbrock(params[0], params[1])
            print(f"Step {i+1}: params={params}, loss={loss:.4f}")`,
    javascript: `class SGDMomentum {
  constructor(lr = 0.01, momentum = 0.9) {
    this.lr = lr;
    this.momentum = momentum;
    this.velocity = null;
  }

  step(params, gradient) {
    if (!this.velocity) {
      this.velocity = new Array(params.length).fill(0);
    }

    // Update velocity
    this.velocity = this.velocity.map(
      (v, i) => this.momentum * v + gradient[i]
    );

    // Update parameters
    return params.map((p, i) => p - this.lr * this.velocity[i]);
  }
}

// Quadratic loss: f(x) = x^2 + 10*y^2
function quadraticGrad(params) {
  return [2 * params[0], 20 * params[1]];
}

// Example
const optimizer = new SGDMomentum(0.01, 0.9);
let params = [5.0, 3.0];

for (let i = 0; i < 100; i++) {
  const grad = quadraticGrad(params);
  params = optimizer.step(params, grad);
  if ((i + 1) % 20 === 0) {
    const loss = params[0]**2 + 10 * params[1]**2;
    console.log(\`Step \${i+1}: [\${params.map(p => p.toFixed(4))}], loss=\${loss.toFixed(4)}\`);
  }
}`,
  },
  useCases: [
    "Training deep neural networks where vanilla SGD oscillates and converges slowly",
    "Optimizing on ill-conditioned loss surfaces with elongated valleys and ravines",
    "Escaping shallow local minima and saddle points through accumulated velocity",
    "Standard training of CNNs and ResNets where momentum=0.9 is the default",
  ],
  relatedAlgorithms: [
    "adam-optimizer",
    "backpropagation",
    "loss-functions",
    "sgd",
    "gradient-descent",
  ],
  glossaryTerms: [
    "momentum",
    "velocity",
    "learning rate",
    "gradient descent",
    "convergence",
    "oscillation",
    "Nesterov momentum",
  ],
  tags: [
    "deep-learning",
    "optimization",
    "gradient-descent",
    "momentum",
    "training",
    "intermediate",
  ],
};
