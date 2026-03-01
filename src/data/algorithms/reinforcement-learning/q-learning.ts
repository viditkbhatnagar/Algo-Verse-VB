import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const qLearning: AlgorithmMetadata = {
  id: "q-learning",
  name: "Q-Learning",
  category: "reinforcement-learning",
  subcategory: "Value-Based",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1) per update",
    average: "O(|S| |A| / alpha)",
    worst: "O(|S| |A| / alpha)",
    note: "Each Q-value update is O(1). Convergence requires visiting all state-action pairs sufficiently, which depends on the exploration strategy and learning rate alpha.",
  },
  spaceComplexity: {
    best: "O(|S| |A|)",
    average: "O(|S| |A|)",
    worst: "O(|S| |A|)",
    note: "The Q-table stores one value for each state-action pair. For large state spaces, function approximation (e.g., neural networks in DQN) replaces the table.",
  },
  description: `Q-Learning is a model-free, off-policy reinforcement learning algorithm that learns the optimal action-value function Q*(s,a) without requiring a model of the environment's dynamics. Introduced by Watkins in 1989, it is one of the most fundamental and widely studied RL algorithms. The Q-value Q(s,a) represents the expected cumulative discounted reward of taking action a in state s and then following the optimal policy thereafter.

The algorithm works by maintaining a table of Q-values for every state-action pair and updating them using temporal difference (TD) learning. At each step, the agent observes its current state, selects an action (often using epsilon-greedy exploration), observes the reward and next state, and updates the Q-value using the Bellman equation: Q(s,a) <- Q(s,a) + alpha * [r + gamma * max_a' Q(s',a') - Q(s,a)]. The key insight is that the update uses the maximum Q-value over all possible next actions, making it an off-policy method -- the update rule follows the optimal policy regardless of the action actually taken.

Q-Learning is guaranteed to converge to the optimal Q-function given sufficient exploration of all state-action pairs and a properly decaying learning rate. In practice, it works well for problems with discrete, finite state and action spaces. For continuous or large state spaces, Deep Q-Networks (DQN) extend Q-Learning by approximating the Q-function with neural networks, enabling applications to complex domains like Atari games, robotics, and autonomous driving.`,
  shortDescription:
    "A model-free RL algorithm that learns optimal action-value functions using temporal difference updates and the Bellman equation.",
  pseudocode: `procedure QLearning(env, alpha, gamma, epsilon, numEpisodes):
    // Initialize Q-table
    Q(s, a) = 0 for all states s, actions a

    for episode = 1 to numEpisodes:
        s = env.reset()  // Start state

        while s is not terminal:
            // Epsilon-greedy action selection
            if random() < epsilon:
                a = random action       // Explore
            else:
                a = argmax_a Q(s, a)    // Exploit

            // Take action, observe result
            s', r = env.step(s, a)

            // Q-Learning update (off-policy)
            Q(s, a) = Q(s, a) + alpha * [r + gamma * max_a' Q(s', a') - Q(s, a)]

            s = s'
        end while
    end for

    // Extract optimal policy
    pi(s) = argmax_a Q(s, a) for all s
    return pi, Q
end procedure`,
  implementations: {
    python: `import numpy as np
import random

class QLearning:
    """Tabular Q-Learning agent."""

    def __init__(self, num_states, num_actions, alpha=0.5, gamma=0.9, epsilon=0.3):
        self.num_states = num_states
        self.num_actions = num_actions
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.q_table = np.zeros((num_states, num_actions))

    def choose_action(self, state):
        """Epsilon-greedy action selection."""
        if random.random() < self.epsilon:
            return random.randint(0, self.num_actions - 1)
        return int(np.argmax(self.q_table[state]))

    def update(self, state, action, reward, next_state, done):
        """Update Q-value using temporal difference."""
        if done:
            target = reward
        else:
            target = reward + self.gamma * np.max(self.q_table[next_state])

        td_error = target - self.q_table[state, action]
        self.q_table[state, action] += self.alpha * td_error

    def train(self, env, num_episodes=500):
        """Train the agent over multiple episodes."""
        rewards_per_episode = []

        for ep in range(num_episodes):
            state = env.reset()
            total_reward = 0
            done = False

            while not done:
                action = self.choose_action(state)
                next_state, reward, done = env.step(state, action)
                self.update(state, action, reward, next_state, done)
                state = next_state
                total_reward += reward

            rewards_per_episode.append(total_reward)

        return rewards_per_episode

    def get_policy(self):
        """Extract the greedy policy from Q-table."""
        return np.argmax(self.q_table, axis=1)


# Example: Simple GridWorld
class GridWorld:
    def __init__(self, size=4):
        self.size = size
        self.goal = (size - 1, size - 1)
        self.obstacles = {(1, 1), (2, 2)}

    def reset(self):
        return 0  # top-left corner

    def state_to_pos(self, state):
        return (state // self.size, state % self.size)

    def pos_to_state(self, row, col):
        return row * self.size + col

    def step(self, state, action):
        row, col = self.state_to_pos(state)
        dr, dc = [(- 1, 0), (1, 0), (0, -1), (0, 1)][action]
        nr, nc = row + dr, col + dc

        if 0 <= nr < self.size and 0 <= nc < self.size and (nr, nc) not in self.obstacles:
            row, col = nr, nc

        next_state = self.pos_to_state(row, col)
        done = (row, col) == self.goal
        reward = 10.0 if done else -0.1
        return next_state, reward, done

if __name__ == "__main__":
    env = GridWorld(4)
    agent = QLearning(16, 4)
    rewards = agent.train(env, 500)
    print("Policy:", agent.get_policy())
    print("Q-table (sample):", agent.q_table[:4])`,
    javascript: `class QLearning {
  constructor(numStates, numActions, alpha = 0.5, gamma = 0.9, epsilon = 0.3) {
    this.numStates = numStates;
    this.numActions = numActions;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.qTable = Array.from({ length: numStates }, () =>
      new Float64Array(numActions)
    );
  }

  chooseAction(state) {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.numActions);
    }
    const qRow = this.qTable[state];
    let bestA = 0;
    for (let a = 1; a < this.numActions; a++) {
      if (qRow[a] > qRow[bestA]) bestA = a;
    }
    return bestA;
  }

  update(state, action, reward, nextState, done) {
    const maxNextQ = done
      ? 0
      : Math.max(...this.qTable[nextState]);
    const target = reward + this.gamma * maxNextQ;
    const tdError = target - this.qTable[state][action];
    this.qTable[state][action] += this.alpha * tdError;
  }

  train(env, numEpisodes = 500) {
    const rewards = [];
    for (let ep = 0; ep < numEpisodes; ep++) {
      let state = env.reset();
      let totalReward = 0;
      let done = false;

      while (!done) {
        const action = this.chooseAction(state);
        const { nextState, reward, isDone } = env.step(state, action);
        this.update(state, action, reward, nextState, isDone);
        state = nextState;
        totalReward += reward;
        done = isDone;
      }
      rewards.push(totalReward);
    }
    return rewards;
  }

  getPolicy() {
    return this.qTable.map((row) => {
      let bestA = 0;
      for (let a = 1; a < this.numActions; a++) {
        if (row[a] > row[bestA]) bestA = a;
      }
      return bestA;
    });
  }
}

// GridWorld environment
class GridWorld {
  constructor(size = 4) {
    this.size = size;
    this.goal = [size - 1, size - 1];
    this.obstacles = new Set(["1,1", "2,2"]);
  }

  reset() { return 0; }

  step(state, action) {
    const row = Math.floor(state / this.size);
    const col = state % this.size;
    const deltas = [[-1,0],[1,0],[0,-1],[0,1]];
    let [nr, nc] = [row + deltas[action][0], col + deltas[action][1]];

    if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size
        || this.obstacles.has(\`\${nr},\${nc}\`)) {
      nr = row; nc = col;
    }

    const nextState = nr * this.size + nc;
    const isDone = nr === this.goal[0] && nc === this.goal[1];
    const reward = isDone ? 10 : -0.1;
    return { nextState, reward, isDone };
  }
}

const env = new GridWorld(4);
const agent = new QLearning(16, 4);
agent.train(env, 500);
console.log("Policy:", agent.getPolicy());`,
  },
  useCases: [
    "Training game-playing agents that learn optimal strategies through trial-and-error interaction",
    "Robot navigation in grid worlds or maze environments where the map is initially unknown",
    "Dynamic pricing and resource allocation where optimal decisions depend on changing conditions",
    "Traffic signal control systems that learn to optimize vehicle flow based on real-time traffic patterns",
  ],
  relatedAlgorithms: [
    "mdp",
    "bellman-equation",
    "epsilon-greedy",
    "multi-armed-bandit",
    "gradient-descent",
  ],
  glossaryTerms: [
    "q-value",
    "temporal difference",
    "bellman equation",
    "epsilon-greedy",
    "off-policy",
    "exploration-exploitation tradeoff",
    "discount factor",
    "learning rate",
  ],
  tags: [
    "reinforcement-learning",
    "value-based",
    "model-free",
    "off-policy",
    "temporal-difference",
    "tabular",
    "intermediate",
  ],
};
