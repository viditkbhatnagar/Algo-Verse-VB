import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const mdp: AlgorithmMetadata = {
  id: "mdp",
  name: "Markov Decision Process",
  category: "reinforcement-learning",
  subcategory: "Value-Based",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(|S|^2 |A|)",
    average: "O(|S|^2 |A| k)",
    worst: "O(|S|^2 |A| k)",
    note: "Value iteration converges in k iterations, each sweeping over |S| states and |A| actions with |S| possible next states per transition.",
  },
  spaceComplexity: {
    best: "O(|S|^2 |A|)",
    average: "O(|S|^2 |A|)",
    worst: "O(|S|^2 |A|)",
    note: "Storing the transition probability table P(s'|s,a) requires |S|^2 * |A| entries, plus O(|S|) for the value function.",
  },
  description: `A Markov Decision Process (MDP) is the mathematical foundation of reinforcement learning. It provides a formal framework for modeling sequential decision-making problems where outcomes are partly random and partly under the control of an agent. An MDP is defined by a tuple (S, A, P, R, gamma): a set of states S, a set of actions A, transition probabilities P(s'|s,a), a reward function R(s,a,s'), and a discount factor gamma that balances immediate versus future rewards.

The Markov property is the key assumption: the future state depends only on the current state and action, not on the history of previous states. This memoryless property allows the problem to be solved efficiently using dynamic programming methods. The goal is to find an optimal policy -- a mapping from states to actions -- that maximizes the expected cumulative discounted reward over time.

MDPs are solved using algorithms like Value Iteration and Policy Iteration. Value Iteration repeatedly applies the Bellman optimality equation to update state values until convergence. Policy Iteration alternates between policy evaluation (computing values for a fixed policy) and policy improvement (greedily selecting better actions). Both methods are guaranteed to converge to the optimal policy for finite MDPs. MDPs form the theoretical basis for more advanced RL algorithms like Q-Learning, SARSA, and deep reinforcement learning methods.`,
  shortDescription:
    "A mathematical framework for modeling sequential decision-making with states, actions, transitions, and rewards under the Markov property.",
  pseudocode: `procedure ValueIteration(MDP, gamma, threshold):
    // Initialize value function
    V(s) = 0 for all states s

    repeat:
        delta = 0
        for each state s in S:
            v = V(s)
            // Bellman optimality update
            V(s) = max_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V(s')]
            delta = max(delta, |v - V(s)|)
        end for
    until delta < threshold

    // Extract optimal policy
    for each state s in S:
        pi(s) = argmax_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V(s')]
    end for

    return pi, V
end procedure`,
  implementations: {
    python: `import numpy as np

class MDP:
    """Markov Decision Process with Value Iteration solver."""

    def __init__(self, num_states, num_actions, gamma=0.9):
        self.num_states = num_states
        self.num_actions = num_actions
        self.gamma = gamma
        # P[s, a, s'] = transition probability
        self.P = np.zeros((num_states, num_actions, num_states))
        # R[s, a, s'] = reward
        self.R = np.zeros((num_states, num_actions, num_states))
        self.terminal_states = set()

    def set_transition(self, s, a, s_next, prob, reward=0.0):
        """Set transition probability and reward."""
        self.P[s, a, s_next] = prob
        self.R[s, a, s_next] = reward

    def value_iteration(self, threshold=1e-6, max_iter=1000):
        """Compute optimal value function and policy."""
        V = np.zeros(self.num_states)

        for iteration in range(max_iter):
            delta = 0
            for s in range(self.num_states):
                if s in self.terminal_states:
                    continue
                v = V[s]
                # Bellman optimality equation
                action_values = []
                for a in range(self.num_actions):
                    q = np.sum(
                        self.P[s, a] * (self.R[s, a] + self.gamma * V)
                    )
                    action_values.append(q)
                V[s] = max(action_values)
                delta = max(delta, abs(v - V[s]))

            if delta < threshold:
                print(f"Converged in {iteration + 1} iterations")
                break

        # Extract policy
        policy = np.zeros(self.num_states, dtype=int)
        for s in range(self.num_states):
            action_values = []
            for a in range(self.num_actions):
                q = np.sum(self.P[s, a] * (self.R[s, a] + self.gamma * V))
                action_values.append(q)
            policy[s] = np.argmax(action_values)

        return V, policy


# Example: Simple 5-state MDP
if __name__ == "__main__":
    mdp = MDP(num_states=5, num_actions=2, gamma=0.9)
    mdp.terminal_states = {3, 4}

    # State 0 transitions
    mdp.set_transition(0, 0, 1, 0.7)
    mdp.set_transition(0, 0, 2, 0.3)
    mdp.set_transition(0, 1, 2, 0.8)
    mdp.set_transition(0, 1, 1, 0.2)

    # State 1 transitions
    mdp.set_transition(1, 0, 3, 0.9, reward=5)
    mdp.set_transition(1, 0, 0, 0.1, reward=-1)

    # State 2 transitions
    mdp.set_transition(2, 0, 3, 0.6, reward=5)
    mdp.set_transition(2, 0, 4, 0.4, reward=10)
    mdp.set_transition(2, 1, 4, 0.9, reward=10)

    V, policy = mdp.value_iteration()
    print("Optimal Values:", V)
    print("Optimal Policy:", policy)`,
    javascript: `class MDP {
  constructor(numStates, numActions, gamma = 0.9) {
    this.numStates = numStates;
    this.numActions = numActions;
    this.gamma = gamma;
    // P[s][a][s'] = probability, R[s][a][s'] = reward
    this.P = Array.from({ length: numStates }, () =>
      Array.from({ length: numActions }, () => new Float64Array(numStates))
    );
    this.R = Array.from({ length: numStates }, () =>
      Array.from({ length: numActions }, () => new Float64Array(numStates))
    );
    this.terminalStates = new Set();
  }

  setTransition(s, a, sNext, prob, reward = 0) {
    this.P[s][a][sNext] = prob;
    this.R[s][a][sNext] = reward;
  }

  valueIteration(threshold = 1e-6, maxIter = 1000) {
    const V = new Float64Array(this.numStates);

    for (let iter = 0; iter < maxIter; iter++) {
      let delta = 0;
      for (let s = 0; s < this.numStates; s++) {
        if (this.terminalStates.has(s)) continue;
        const v = V[s];
        let bestValue = -Infinity;
        for (let a = 0; a < this.numActions; a++) {
          let q = 0;
          for (let sp = 0; sp < this.numStates; sp++) {
            q += this.P[s][a][sp] * (this.R[s][a][sp] + this.gamma * V[sp]);
          }
          bestValue = Math.max(bestValue, q);
        }
        V[s] = bestValue;
        delta = Math.max(delta, Math.abs(v - V[s]));
      }
      if (delta < threshold) {
        console.log(\`Converged in \${iter + 1} iterations\`);
        break;
      }
    }

    // Extract policy
    const policy = new Int32Array(this.numStates);
    for (let s = 0; s < this.numStates; s++) {
      let bestA = 0, bestQ = -Infinity;
      for (let a = 0; a < this.numActions; a++) {
        let q = 0;
        for (let sp = 0; sp < this.numStates; sp++) {
          q += this.P[s][a][sp] * (this.R[s][a][sp] + this.gamma * V[sp]);
        }
        if (q > bestQ) { bestQ = q; bestA = a; }
      }
      policy[s] = bestA;
    }

    return { V: Array.from(V), policy: Array.from(policy) };
  }
}

// Example usage
const mdp = new MDP(5, 2, 0.9);
mdp.terminalStates = new Set([3, 4]);
mdp.setTransition(0, 0, 1, 0.7);
mdp.setTransition(0, 0, 2, 0.3);
mdp.setTransition(0, 1, 2, 0.8);
mdp.setTransition(0, 1, 1, 0.2);
mdp.setTransition(1, 0, 3, 0.9, 5);
mdp.setTransition(1, 0, 0, 0.1, -1);
mdp.setTransition(2, 0, 3, 0.6, 5);
mdp.setTransition(2, 0, 4, 0.4, 10);
mdp.setTransition(2, 1, 4, 0.9, 10);

const { V, policy } = mdp.valueIteration();
console.log("Values:", V);
console.log("Policy:", policy);`,
  },
  useCases: [
    "Robotics path planning where a robot must navigate through uncertain environments to reach a goal",
    "Inventory management systems that decide optimal order quantities under stochastic demand",
    "Game AI for board games and video games where agents make sequential decisions against opponents",
    "Network routing optimization where packets must be forwarded through nodes with uncertain link qualities",
  ],
  relatedAlgorithms: [
    "q-learning",
    "bellman-equation",
    "epsilon-greedy",
    "multi-armed-bandit",
    "dijkstra",
  ],
  glossaryTerms: [
    "markov property",
    "state space",
    "action space",
    "transition probability",
    "reward function",
    "discount factor",
    "policy",
    "value function",
    "bellman equation",
  ],
  tags: [
    "reinforcement-learning",
    "value-based",
    "dynamic-programming",
    "sequential-decision-making",
    "markov-property",
    "intermediate",
  ],
};
