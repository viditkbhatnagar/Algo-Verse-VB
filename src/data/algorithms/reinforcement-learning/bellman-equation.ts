import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bellmanEquation: AlgorithmMetadata = {
  id: "bellman-equation",
  name: "Bellman Equation",
  category: "reinforcement-learning",
  subcategory: "Value-Based",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(|S|^2 |A|)",
    average: "O(|S|^2 |A| k)",
    worst: "O(|S|^2 |A| k)",
    note: "Value iteration requires k sweeps over all |S| states, each considering |A| actions with |S| possible successors. Convergence speed depends on the discount factor gamma.",
  },
  spaceComplexity: {
    best: "O(|S|)",
    average: "O(|S|)",
    worst: "O(|S|)",
    note: "Only the value function V(s) needs to be stored (one value per state). The transition model is accessed but not necessarily stored by the algorithm itself.",
  },
  description: `The Bellman Equation, named after Richard Bellman, is the fundamental recursive relationship at the heart of dynamic programming and reinforcement learning. It expresses the value of a state as the immediate reward plus the discounted value of the successor state under optimal decision-making. For the optimal value function, the Bellman optimality equation states: V*(s) = max_a [R(s,a) + gamma * sum_{s'} P(s'|s,a) * V*(s')]. This equation says that the value of a state under the optimal policy equals the best possible action's expected immediate reward plus the discounted expected future value.

Value Iteration is the most direct algorithm for solving the Bellman equation. It starts with an arbitrary value function (typically V(s)=0 for all states) and repeatedly applies the Bellman update to every state, replacing V(s) with max_a [R(s,a) + gamma * V(s')]. Each complete pass over all states is called a sweep. The process converges because the Bellman operator is a contraction mapping: successive sweeps always bring the value function closer to the true optimum, with the gap shrinking by a factor of gamma per sweep.

The Bellman equation also has a version for state-action values (Q-values): Q*(s,a) = R(s,a) + gamma * sum_{s'} P(s'|s,a) * max_{a'} Q*(s',a'). This form is the basis for Q-Learning, which estimates Q-values through interaction without knowing the transition model. The Bellman equation connects a vast array of optimization methods: from shortest path algorithms like Dijkstra's to policy gradient methods in deep RL, the principle of optimality expressed by Bellman's equation is the unifying thread.`,
  shortDescription:
    "The fundamental recursive equation of dynamic programming that relates the value of a state to the values of its successor states through the principle of optimality.",
  pseudocode: `procedure ValueIteration(states, actions, P, R, gamma, threshold):
    // Initialize value function
    V(s) = 0 for all s in states

    repeat:
        delta = 0
        for each state s in states:
            if s is terminal: continue

            v_old = V(s)

            // Bellman optimality update
            best_value = -infinity
            for each action a in actions:
                // Expected value under action a
                q_value = R(s, a)
                for each next_state s' in states:
                    q_value += gamma * P(s' | s, a) * V(s')
                end for
                best_value = max(best_value, q_value)
            end for

            V(s) = best_value
            delta = max(delta, |v_old - V(s)|)
        end for
    until delta < threshold

    // Extract greedy policy
    for each state s in states:
        pi(s) = argmax_a [R(s,a) + gamma * sum_{s'} P(s'|s,a) * V(s')]
    end for

    return V, pi
end procedure`,
  implementations: {
    python: `import numpy as np

def value_iteration(grid_size, walls, goal, goal_reward=10, step_penalty=-0.04,
                    gamma=0.9, threshold=1e-6, max_iter=1000):
    """
    Solve a grid world MDP using the Bellman equation via value iteration.

    Args:
        grid_size: Size of the square grid (grid_size x grid_size)
        walls: Set of (row, col) tuples for wall cells
        goal: (row, col) tuple for the goal cell
        goal_reward: Reward at the goal state
        step_penalty: Penalty for each non-terminal step
        gamma: Discount factor
        threshold: Convergence threshold
        max_iter: Maximum iterations
    Returns:
        V: Value function as a 2D array
        policy: Optimal policy as a 2D array of directions
    """
    V = np.zeros((grid_size, grid_size))
    V[goal] = goal_reward
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    dir_names = ['up', 'down', 'left', 'right']

    def is_valid(r, c):
        return 0 <= r < grid_size and 0 <= c < grid_size and (r, c) not in walls

    for iteration in range(max_iter):
        delta = 0
        for r in range(grid_size):
            for c in range(grid_size):
                if (r, c) in walls or (r, c) == goal:
                    continue

                v_old = V[r, c]
                best = float('-inf')

                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if not is_valid(nr, nc):
                        nr, nc = r, c  # Bounce back

                    # Bellman equation: V(s) = R + gamma * V(s')
                    value = step_penalty + gamma * V[nr, nc]
                    best = max(best, value)

                V[r, c] = best
                delta = max(delta, abs(v_old - V[r, c]))

        if delta < threshold:
            print(f"Converged in {iteration + 1} iterations")
            break

    # Extract policy
    policy = np.full((grid_size, grid_size), '', dtype=object)
    for r in range(grid_size):
        for c in range(grid_size):
            if (r, c) in walls or (r, c) == goal:
                continue
            best_val = float('-inf')
            best_dir = 'up'
            for (dr, dc), name in zip(directions, dir_names):
                nr, nc = r + dr, c + dc
                if not is_valid(nr, nc):
                    nr, nc = r, c
                val = step_penalty + gamma * V[nr, nc]
                if val > best_val:
                    best_val = val
                    best_dir = name
            policy[r, c] = best_dir

    return V, policy


if __name__ == "__main__":
    V, policy = value_iteration(
        grid_size=3,
        walls={(1, 1)},
        goal=(2, 2),
    )
    print("Value Function:")
    print(V)
    print("\\nOptimal Policy:")
    print(policy)`,
    javascript: `function valueIteration(gridSize, walls, goal, options = {}) {
  const {
    goalReward = 10,
    stepPenalty = -0.04,
    gamma = 0.9,
    threshold = 1e-6,
    maxIter = 1000,
  } = options;

  const V = Array.from({ length: gridSize }, () =>
    new Float64Array(gridSize)
  );
  V[goal[0]][goal[1]] = goalReward;

  const isWall = (r, c) => walls.some(([wr, wc]) => wr === r && wc === c);
  const isGoal = (r, c) => r === goal[0] && c === goal[1];
  const isValid = (r, c) =>
    r >= 0 && r < gridSize && c >= 0 && c < gridSize && !isWall(r, c);

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dirNames = ['up', 'down', 'left', 'right'];

  for (let iter = 0; iter < maxIter; iter++) {
    let delta = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (isWall(r, c) || isGoal(r, c)) continue;

        const vOld = V[r][c];
        let best = -Infinity;

        for (const [dr, dc] of directions) {
          let nr = r + dr, nc = c + dc;
          if (!isValid(nr, nc)) { nr = r; nc = c; }

          // Bellman equation
          const value = stepPenalty + gamma * V[nr][nc];
          best = Math.max(best, value);
        }

        V[r][c] = best;
        delta = Math.max(delta, Math.abs(vOld - V[r][c]));
      }
    }
    if (delta < threshold) {
      console.log(\`Converged in \${iter + 1} iterations\`);
      break;
    }
  }

  // Extract policy
  const policy = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('')
  );
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isWall(r, c) || isGoal(r, c)) continue;
      let bestVal = -Infinity, bestDir = 'up';
      for (let d = 0; d < 4; d++) {
        let nr = r + directions[d][0], nc = c + directions[d][1];
        if (!isValid(nr, nc)) { nr = r; nc = c; }
        const val = stepPenalty + gamma * V[nr][nc];
        if (val > bestVal) { bestVal = val; bestDir = dirNames[d]; }
      }
      policy[r][c] = bestDir;
    }
  }

  return {
    V: V.map(row => Array.from(row)),
    policy,
  };
}

// Example usage
const { V, policy } = valueIteration(3, [[1, 1]], [2, 2]);
console.log("Values:", V);
console.log("Policy:", policy);`,
  },
  useCases: [
    "Computing optimal strategies for stochastic shortest path problems in logistics and transportation",
    "Pricing financial derivatives using backward induction, a direct application of the Bellman principle",
    "Optimal control in engineering systems where future states depend on current decisions and noise",
    "Planning AI agents that must make sequences of decisions to maximize long-term objectives in known environments",
  ],
  relatedAlgorithms: [
    "mdp",
    "q-learning",
    "epsilon-greedy",
    "dijkstra",
    "fibonacci",
  ],
  glossaryTerms: [
    "bellman equation",
    "value function",
    "dynamic programming",
    "discount factor",
    "contraction mapping",
    "principle of optimality",
    "convergence",
    "policy",
  ],
  tags: [
    "reinforcement-learning",
    "value-based",
    "dynamic-programming",
    "value-iteration",
    "optimality",
    "intermediate",
  ],
};
