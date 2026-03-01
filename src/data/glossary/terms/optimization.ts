import type { GlossaryTermData } from "@/lib/visualization/types";

export const optimizationTerms: GlossaryTermData[] = [
  {
    slug: "optimization",
    name: "Optimization",
    definition:
      "The mathematical process of finding the best solution from a set of possible solutions, typically by minimizing or maximizing an objective function subject to constraints. Optimization is the backbone of machine learning (training models), operations research (scheduling, logistics), and engineering design. Problems range from simple convex cases with guaranteed global solutions to complex combinatorial ones that are NP-hard.",
    relatedTerms: ["objective-function", "constraint", "global-optimum", "local-optimum", "gradient-descent"],
    category: "optimization",
    tags: ["fundamentals", "mathematics"],
  },
  {
    slug: "objective-function",
    name: "Objective Function",
    definition:
      "The function that an optimization algorithm seeks to minimize or maximize, also known as the cost function, loss function, or fitness function depending on the context. In machine learning, the objective function measures how well the model fits the data (e.g., mean squared error). The choice of objective function directly determines what solution the optimizer will converge to.",
    formula: "Minimize $f(\\mathbf{x})$ subject to constraints, where $\\mathbf{x} \\in \\mathbb{R}^n$",
    relatedTerms: ["optimization", "constraint", "gradient-descent", "global-optimum", "convergence"],
    category: "optimization",
    tags: ["fundamentals", "mathematics"],
  },
  {
    slug: "constraint",
    name: "Constraint",
    definition:
      "A condition or restriction that limits the set of allowable solutions in an optimization problem. Constraints can be equality constraints (e.g., budget must equal exactly $1000) or inequality constraints (e.g., weight must be less than 50kg). The set of all points satisfying the constraints is called the feasible region, and the optimal solution must lie within it.",
    formula: "Equality: $g_i(\\mathbf{x}) = 0$. Inequality: $h_j(\\mathbf{x}) \\leq 0$",
    relatedTerms: ["feasible-region", "objective-function", "optimization", "linear-programming"],
    category: "optimization",
    tags: ["fundamentals", "mathematics"],
  },
  {
    slug: "feasible-region",
    name: "Feasible Region",
    definition:
      "The set of all points (solutions) that satisfy every constraint in an optimization problem. A solution is feasible if it lies within this region and infeasible otherwise. In linear programming, the feasible region is a convex polytope defined by the intersection of half-spaces. The optimal solution lies on the boundary of the feasible region (at a vertex, for linear programs).",
    relatedTerms: ["constraint", "optimization", "linear-programming", "simplex-method", "global-optimum"],
    category: "optimization",
    tags: ["fundamentals", "geometry"],
  },
  {
    slug: "global-optimum",
    name: "Global Optimum",
    definition:
      "The absolute best solution over the entire feasible region of an optimization problem — no other feasible point achieves a better objective value. Finding the global optimum is guaranteed for convex problems but is generally NP-hard for non-convex problems, where algorithms may get trapped in local optima. Metaheuristics like simulated annealing attempt to escape local optima in search of the global one.",
    relatedTerms: ["local-optimum", "convex-optimization", "optimization", "objective-function"],
    category: "optimization",
    tags: ["concepts", "theory"],
  },
  {
    slug: "local-optimum",
    name: "Local Optimum",
    definition:
      "A solution that is better than all nearby (neighboring) solutions but may not be the best overall. Gradient-based optimizers can converge to local optima in non-convex landscapes and have no built-in mechanism to escape. The presence of many local optima is what makes non-convex optimization challenging. Techniques like random restarts, momentum, and simulated annealing help mitigate this issue.",
    relatedTerms: ["global-optimum", "gradient-descent", "hill-climbing", "simulated-annealing", "convex-optimization"],
    category: "optimization",
    tags: ["concepts", "theory"],
  },
  {
    slug: "convex-optimization",
    name: "Convex Optimization",
    definition:
      "A subfield of optimization where the objective function is convex (curves upward) and the feasible region is a convex set, guaranteeing that any local minimum is also the global minimum. Convex problems can be solved efficiently and reliably using algorithms like gradient descent and interior-point methods. Many important problems in machine learning, statistics, and engineering are convex or can be reformulated as convex.",
    formalDefinition:
      "A problem $\\min f(\\mathbf{x})$ s.t. $\\mathbf{x} \\in C$ is convex if $f$ is convex ($f(\\lambda x + (1-\\lambda)y) \\leq \\lambda f(x) + (1-\\lambda)f(y)$) and $C$ is a convex set.",
    relatedTerms: ["optimization", "global-optimum", "gradient-descent", "linear-programming", "constraint"],
    category: "optimization",
    tags: ["theory", "class"],
  },
  {
    slug: "gradient-descent",
    name: "Gradient Descent",
    definition:
      "An iterative first-order optimization algorithm that moves toward a minimum of the objective function by taking steps proportional to the negative of the gradient (the direction of steepest descent). It is the workhorse of machine learning, used to train neural networks and most parametric models. Variants include stochastic gradient descent (SGD), mini-batch SGD, and adaptive methods like Adam.",
    formula: "$\\mathbf{x}_{t+1} = \\mathbf{x}_t - \\alpha \\nabla f(\\mathbf{x}_t)$, where $\\alpha$ is the learning rate",
    relatedTerms: ["learning-rate-decay", "objective-function", "convergence", "convex-optimization", "newtons-method"],
    category: "optimization",
    tags: ["algorithm", "iterative", "first-order"],
  },
  {
    slug: "newtons-method",
    name: "Newton's Method",
    definition:
      "A second-order optimization algorithm that uses both the gradient and the Hessian (matrix of second derivatives) to find the minimum. By approximating the objective with a quadratic model at each step, Newton's method converges much faster than gradient descent (quadratically near the optimum). However, computing and inverting the Hessian is expensive for high-dimensional problems.",
    formula: "$\\mathbf{x}_{t+1} = \\mathbf{x}_t - [\\nabla^2 f(\\mathbf{x}_t)]^{-1} \\nabla f(\\mathbf{x}_t)$",
    relatedTerms: ["gradient-descent", "conjugate-gradient", "convergence", "convex-optimization"],
    category: "optimization",
    tags: ["algorithm", "iterative", "second-order"],
  },
  {
    slug: "conjugate-gradient",
    name: "Conjugate Gradient",
    definition:
      "An iterative optimization method for solving large systems of linear equations and quadratic optimization problems that converges in at most n steps for an n-dimensional problem. It improves upon steepest descent by choosing search directions that are conjugate (non-interfering) with respect to the Hessian, avoiding the zigzagging behavior of gradient descent. It is widely used because it does not require storing the full Hessian matrix.",
    relatedTerms: ["gradient-descent", "newtons-method", "convex-optimization", "linear-programming"],
    category: "optimization",
    tags: ["algorithm", "iterative", "linear-algebra"],
  },
  {
    slug: "linear-programming",
    name: "Linear Programming",
    definition:
      "An optimization technique where both the objective function and all constraints are linear. LP is used extensively in logistics, manufacturing, finance, and resource allocation. Despite having infinitely many feasible points, the optimal solution always occurs at a vertex of the feasible polytope, which the simplex method exploits. LP problems can be solved in polynomial time.",
    formula: "Minimize $\\mathbf{c}^T\\mathbf{x}$ subject to $A\\mathbf{x} \\leq \\mathbf{b}$, $\\mathbf{x} \\geq 0$",
    relatedTerms: ["simplex-method", "constraint", "feasible-region", "integer-programming", "convex-optimization"],
    category: "optimization",
    tags: ["class", "linear", "operations-research"],
  },
  {
    slug: "simplex-method",
    name: "Simplex Method",
    definition:
      "An algorithm for solving linear programming problems that moves along the edges of the feasible polytope from vertex to vertex, improving the objective at each step until the optimum is reached. Developed by George Dantzig in 1947, it is remarkably efficient in practice despite having exponential worst-case complexity. The simplex method remains one of the most widely used optimization algorithms.",
    relatedTerms: ["linear-programming", "feasible-region", "constraint", "objective-function"],
    category: "optimization",
    tags: ["algorithm", "linear-programming", "classic"],
  },
  {
    slug: "integer-programming",
    name: "Integer Programming",
    definition:
      "A variant of linear programming where some or all decision variables are required to take integer values. This seemingly small change makes the problem NP-hard in general, as the feasible region is no longer a convex polytope but a discrete set. Integer programming is used for scheduling, assignment, routing, and network design problems. Common solution methods include branch and bound, cutting planes, and LP relaxation.",
    relatedTerms: ["linear-programming", "combinatorial-optimization", "constraint", "simplex-method"],
    category: "optimization",
    tags: ["class", "discrete", "np-hard"],
  },
  {
    slug: "combinatorial-optimization",
    name: "Combinatorial Optimization",
    definition:
      "A branch of optimization that deals with finding the best solution from a finite (but typically exponentially large) set of discrete objects, such as graphs, permutations, or subsets. Classic problems include the traveling salesman problem, knapsack problem, and graph coloring. Most combinatorial optimization problems are NP-hard, so exact solutions are often impractical and heuristics or approximation algorithms are used.",
    relatedTerms: ["integer-programming", "simulated-annealing", "genetic-algorithm", "hill-climbing"],
    category: "optimization",
    tags: ["class", "discrete", "np-hard"],
  },
  {
    slug: "simulated-annealing",
    name: "Simulated Annealing",
    definition:
      "A probabilistic metaheuristic optimization algorithm inspired by the annealing process in metallurgy, where a material is slowly cooled to reach a low-energy crystalline state. SA occasionally accepts worse solutions with a probability that decreases over time (following a temperature schedule), allowing it to escape local optima. It is widely used for combinatorial optimization problems where gradient information is unavailable.",
    formula: "Accept worse move with probability $P = e^{-\\Delta E / T}$, where $\\Delta E$ is the cost increase and $T$ is the current temperature",
    relatedTerms: ["hill-climbing", "local-optimum", "global-optimum", "combinatorial-optimization", "genetic-algorithm"],
    category: "optimization",
    tags: ["metaheuristic", "probabilistic", "nature-inspired"],
  },
  {
    slug: "genetic-algorithm",
    name: "Genetic Algorithm",
    definition:
      "An evolutionary metaheuristic optimization algorithm inspired by natural selection that maintains a population of candidate solutions which evolve over generations through selection, crossover (recombination), and mutation operators. Fitter individuals (better solutions) are more likely to be selected as parents. GAs are versatile and can handle non-differentiable, discontinuous, and multi-modal objective functions.",
    relatedTerms: ["particle-swarm-optimization", "simulated-annealing", "combinatorial-optimization", "hill-climbing"],
    category: "optimization",
    tags: ["metaheuristic", "evolutionary", "population-based"],
  },
  {
    slug: "particle-swarm-optimization",
    name: "Particle Swarm Optimization",
    definition:
      "A population-based metaheuristic inspired by the social behavior of bird flocks and fish schools. Each particle in the swarm represents a candidate solution that moves through the search space guided by its own best-known position and the swarm's global best position. PSO is simple to implement, has few hyperparameters, and works well for continuous optimization problems.",
    formula: "$v_i \\leftarrow w \\cdot v_i + c_1 r_1 (p_{\\text{best},i} - x_i) + c_2 r_2 (g_{\\text{best}} - x_i)$; $x_i \\leftarrow x_i + v_i$",
    relatedTerms: ["genetic-algorithm", "simulated-annealing", "global-optimum", "combinatorial-optimization"],
    category: "optimization",
    tags: ["metaheuristic", "swarm-intelligence", "population-based"],
  },
  {
    slug: "hill-climbing",
    name: "Hill Climbing",
    definition:
      "A simple local search algorithm that starts from a random solution and iteratively moves to a neighboring solution with a better objective value until no improvement can be found. Hill climbing is fast and easy to implement but is greedy — it always moves uphill and gets stuck at the first local optimum it encounters. Variants include steepest ascent, stochastic, and random-restart hill climbing.",
    relatedTerms: ["local-optimum", "global-optimum", "simulated-annealing", "gradient-descent", "combinatorial-optimization"],
    category: "optimization",
    tags: ["algorithm", "local-search", "simple"],
  },
  {
    slug: "convergence",
    name: "Convergence",
    definition:
      "The property of an optimization algorithm approaching a solution (typically a local or global optimum) as the number of iterations increases. An algorithm converges if the difference between successive solutions or objective values shrinks below a specified tolerance. Convergence rate describes how quickly this happens — common rates are linear, quadratic (Newton's method), and sublinear (SGD). Guaranteeing convergence often requires conditions on the learning rate and objective function.",
    relatedTerms: ["gradient-descent", "newtons-method", "learning-rate-decay", "local-optimum", "global-optimum"],
    category: "optimization",
    tags: ["theory", "analysis"],
  },
  {
    slug: "learning-rate-decay",
    name: "Learning Rate Decay",
    definition:
      "A strategy that gradually reduces the learning rate (step size) during optimization to achieve both fast initial progress and fine-grained convergence. Common schedules include step decay (reduce by a factor every k epochs), exponential decay, and cosine annealing. Without decay, a fixed large learning rate may overshoot the optimum, while a fixed small learning rate converges too slowly.",
    formula: "Step decay: $\\alpha_t = \\alpha_0 \\cdot \\gamma^{\\lfloor t/k \\rfloor}$. Exponential: $\\alpha_t = \\alpha_0 \\cdot e^{-\\lambda t}$",
    relatedTerms: ["gradient-descent", "convergence", "objective-function", "optimization"],
    category: "optimization",
    tags: ["technique", "hyperparameter", "training"],
  },
];
