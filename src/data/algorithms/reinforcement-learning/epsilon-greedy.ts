import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const epsilonGreedy: AlgorithmMetadata = {
  id: "epsilon-greedy",
  name: "Epsilon-Greedy",
  category: "reinforcement-learning",
  subcategory: "Exploration",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(K)",
    worst: "O(K)",
    note: "Each action selection is O(K) where K is the number of actions (finding the argmax). With a single greedy action tracked, selection can be O(1).",
  },
  spaceComplexity: {
    best: "O(K)",
    average: "O(K)",
    worst: "O(K)",
    note: "Stores estimated values and counts for K actions. The decay schedule adds only O(1) additional storage.",
  },
  description: `Epsilon-Greedy is the most widely used exploration strategy in reinforcement learning due to its simplicity and effectiveness. At each decision point, the agent flips a biased coin: with probability epsilon it takes a random action (exploration), and with probability 1-epsilon it takes the action with the highest estimated value (exploitation). This ensures that even after the agent has developed strong preferences, it continues to occasionally try suboptimal actions, which is essential for discovering better options and adapting to non-stationary environments.

A crucial enhancement to basic epsilon-greedy is epsilon decay, where the exploration rate decreases over time according to a schedule such as epsilon(t) = epsilon_0 * exp(-decay * t). This captures the intuition that early in learning the agent knows very little and should explore aggressively, while later it has accumulated enough experience to exploit confidently. The decay rate is a hyperparameter that trades off exploration thoroughness against convergence speed: too fast a decay may cause the agent to commit prematurely to a suboptimal action, while too slow a decay wastes resources on unnecessary exploration.

Epsilon-Greedy is used as the default exploration mechanism in Q-Learning, SARSA, and many deep RL algorithms (e.g., DQN uses a linear epsilon decay from 1.0 to 0.01 over the first million frames). Despite being simple, it can be surprisingly competitive with more sophisticated methods like UCB or Thompson Sampling, especially when combined with good decay schedules. Its main limitation is that it explores uniformly at random, without directing exploration toward promising or uncertain actions -- this is addressed by methods like Boltzmann exploration, UCB, and curiosity-driven approaches.`,
  shortDescription:
    "A simple exploration strategy that randomly selects actions with probability epsilon and greedily selects the best-known action otherwise, often with a decaying epsilon schedule.",
  pseudocode: `procedure EpsilonGreedy(Q, state, epsilon):
    // Decide whether to explore or exploit
    if random() < epsilon:
        action = randomAction()          // Explore: random arm
    else:
        action = argmax_a Q(state, a)    // Exploit: best known
    end if
    return action
end procedure

procedure EpsilonDecay(epsilon_0, decay_rate, episode):
    // Exponential decay schedule
    epsilon = epsilon_0 * exp(-decay_rate * episode)
    return max(epsilon, epsilon_min)     // Floor to prevent zero exploration
end procedure

procedure RunAgent(env, numEpisodes, epsilon_0, decay_rate):
    Q(s, a) = 0 for all s, a
    epsilon_min = 0.01

    for episode = 1 to numEpisodes:
        epsilon = EpsilonDecay(epsilon_0, decay_rate, episode)
        state = env.reset()

        while not done:
            action = EpsilonGreedy(Q, state, epsilon)
            next_state, reward, done = env.step(action)

            // Update Q (e.g., Q-Learning update)
            Q(state, action) += alpha * [reward + gamma * max_a Q(next_state, a) - Q(state, action)]
            state = next_state
        end while
    end for
    return Q
end procedure`,
  implementations: {
    python: `import numpy as np

class EpsilonGreedyAgent:
    """Epsilon-Greedy agent with exponential decay."""

    def __init__(self, num_arms, epsilon_0=0.8, decay_rate=0.05, epsilon_min=0.01):
        self.num_arms = num_arms
        self.epsilon_0 = epsilon_0
        self.decay_rate = decay_rate
        self.epsilon_min = epsilon_min
        self.estimates = np.zeros(num_arms)
        self.counts = np.zeros(num_arms)
        self.episode = 0

    @property
    def epsilon(self):
        """Current epsilon with exponential decay."""
        return max(
            self.epsilon_min,
            self.epsilon_0 * np.exp(-self.decay_rate * self.episode)
        )

    def select_action(self):
        """Select action using epsilon-greedy."""
        if np.random.random() < self.epsilon:
            return np.random.randint(self.num_arms)  # Explore
        return int(np.argmax(self.estimates))          # Exploit

    def update(self, arm, reward):
        """Update estimate using incremental mean."""
        self.counts[arm] += 1
        self.estimates[arm] += (reward - self.estimates[arm]) / self.counts[arm]

    def run(self, bandit_means, num_episodes=100):
        """Run the agent against a multi-armed bandit."""
        rewards = []
        epsilons = []

        for ep in range(num_episodes):
            self.episode = ep
            epsilons.append(self.epsilon)

            arm = self.select_action()
            reward = np.random.normal(bandit_means[arm], 1.0)
            self.update(arm, reward)
            rewards.append(reward)

        return {
            'rewards': np.array(rewards),
            'cumulative_reward': np.cumsum(rewards),
            'epsilons': np.array(epsilons),
            'estimates': self.estimates.copy(),
            'counts': self.counts.copy(),
        }


if __name__ == "__main__":
    true_means = [2.0, 5.0, 3.5]  # Arm 1 is best
    agent = EpsilonGreedyAgent(
        num_arms=3, epsilon_0=0.8, decay_rate=0.05
    )

    results = agent.run(true_means, num_episodes=200)
    print(f"Final epsilon: {agent.epsilon:.4f}")
    print(f"Total reward: {results['cumulative_reward'][-1]:.1f}")
    print(f"Arm estimates: {results['estimates']}")
    print(f"Arm pull counts: {results['counts']}")`,
    javascript: `class EpsilonGreedyAgent {
  constructor(numArms, epsilon0 = 0.8, decayRate = 0.05, epsilonMin = 0.01) {
    this.numArms = numArms;
    this.epsilon0 = epsilon0;
    this.decayRate = decayRate;
    this.epsilonMin = epsilonMin;
    this.estimates = new Float64Array(numArms);
    this.counts = new Float64Array(numArms);
    this.episode = 0;
  }

  get epsilon() {
    return Math.max(
      this.epsilonMin,
      this.epsilon0 * Math.exp(-this.decayRate * this.episode)
    );
  }

  selectAction() {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.numArms);
    }
    let bestArm = 0;
    for (let i = 1; i < this.numArms; i++) {
      if (this.estimates[i] > this.estimates[bestArm]) bestArm = i;
    }
    return bestArm;
  }

  update(arm, reward) {
    this.counts[arm]++;
    this.estimates[arm] += (reward - this.estimates[arm]) / this.counts[arm];
  }

  run(banditMeans, numEpisodes = 100) {
    const rewards = [];
    const epsilons = [];
    let cumReward = 0;

    for (let ep = 0; ep < numEpisodes; ep++) {
      this.episode = ep;
      epsilons.push(this.epsilon);

      const arm = this.selectAction();
      // Normal(mean, 1) via Box-Muller
      const u1 = Math.random(), u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
      const reward = banditMeans[arm] + z;

      this.update(arm, reward);
      rewards.push(reward);
      cumReward += reward;
    }

    return {
      rewards,
      cumulativeReward: cumReward,
      epsilons,
      estimates: Array.from(this.estimates),
      counts: Array.from(this.counts),
    };
  }
}

// Example usage
const trueMeans = [2.0, 5.0, 3.5];
const agent = new EpsilonGreedyAgent(3, 0.8, 0.05);
const results = agent.run(trueMeans, 200);

console.log(\`Final epsilon: \${agent.epsilon.toFixed(4)}\`);
console.log(\`Total reward: \${results.cumulativeReward.toFixed(1)}\`);
console.log("Estimates:", results.estimates.map(v => v.toFixed(2)));
console.log("Pull counts:", results.counts);`,
  },
  useCases: [
    "Default exploration strategy in Q-Learning and DQN for video game AI training",
    "A/B testing systems that gradually converge on the best variant while still testing alternatives",
    "Recommendation systems that occasionally surface diverse content to discover user preferences",
    "Autonomous agents that need to balance learning about new actions with performing known-good actions",
  ],
  relatedAlgorithms: [
    "multi-armed-bandit",
    "q-learning",
    "mdp",
    "bellman-equation",
  ],
  glossaryTerms: [
    "exploration-exploitation tradeoff",
    "epsilon-greedy",
    "decay schedule",
    "greedy policy",
    "exploitation",
    "exploration",
    "action selection",
  ],
  tags: [
    "reinforcement-learning",
    "exploration",
    "action-selection",
    "epsilon-decay",
    "strategy",
    "beginner",
  ],
};
