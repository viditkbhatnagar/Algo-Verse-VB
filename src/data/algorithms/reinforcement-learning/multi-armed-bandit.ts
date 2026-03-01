import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const multiArmedBandit: AlgorithmMetadata = {
  id: "multi-armed-bandit",
  name: "Multi-Armed Bandit",
  category: "reinforcement-learning",
  subcategory: "Exploration",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1) per pull",
    average: "O(K) per pull",
    worst: "O(K) per pull",
    note: "Each pull requires computing the best arm among K options (or selecting randomly). Over T total pulls, the total time is O(T * K).",
  },
  spaceComplexity: {
    best: "O(K)",
    average: "O(K)",
    worst: "O(K)",
    note: "Storage for K arm statistics: estimated mean, pull count, and total reward per arm.",
  },
  description: `The Multi-Armed Bandit (MAB) problem is one of the most elegant formulations of the exploration-exploitation dilemma in reinforcement learning. Named after a gambler facing a row of slot machines (one-armed bandits) with unknown payoff distributions, the problem asks: how should an agent allocate trials among K options to maximize cumulative reward? The agent must balance exploring less-known arms (to gather information) against exploiting the arm currently believed to be best (to maximize immediate reward).

The simplest approach is epsilon-greedy: with probability epsilon choose a random arm (explore), and with probability 1-epsilon choose the arm with the highest estimated reward (exploit). Other strategies include Upper Confidence Bound (UCB), which selects the arm with the highest upper confidence estimate, naturally balancing exploration of uncertain arms with exploitation of high-value arms. Thompson Sampling takes a Bayesian approach, maintaining a posterior distribution over each arm's reward and sampling from it to guide decisions.

The key metric for evaluating bandit algorithms is regret: the difference between the cumulative reward of the optimal arm and the agent's actual cumulative reward. Good algorithms achieve sublinear regret, meaning the per-step regret decreases over time as the agent learns. The MAB framework has far-reaching applications in A/B testing, clinical trials, ad placement, recommendation engines, and any online decision-making scenario where learning and earning must happen simultaneously.`,
  shortDescription:
    "A framework for sequential decision-making that balances exploring unknown options with exploiting the best-known option to maximize reward.",
  pseudocode: `procedure EpsilonGreedyBandit(K, epsilon, numPulls):
    // Initialize arm statistics
    for each arm i = 1 to K:
        Q(i) = 0       // Estimated reward
        N(i) = 0       // Pull count
    end for

    totalReward = 0

    for t = 1 to numPulls:
        // Epsilon-greedy action selection
        if random() < epsilon:
            arm = randomInt(1, K)    // Explore
        else:
            arm = argmax_i Q(i)      // Exploit
        end if

        // Pull arm and observe reward
        reward = pull(arm)

        // Update arm statistics
        N(arm) = N(arm) + 1
        Q(arm) = Q(arm) + (reward - Q(arm)) / N(arm)    // Incremental mean

        totalReward = totalReward + reward
    end for

    return Q, totalReward
end procedure`,
  implementations: {
    python: `import numpy as np

class MultiArmedBandit:
    """Simulates a multi-armed bandit problem."""

    def __init__(self, k: int, true_means: list[float] = None):
        self.k = k
        if true_means is not None:
            self.true_means = np.array(true_means)
        else:
            self.true_means = np.random.randn(k) + 2.0
        self.std = 1.0  # Reward noise

    def pull(self, arm: int) -> float:
        """Pull an arm and get a noisy reward."""
        return np.random.normal(self.true_means[arm], self.std)


class EpsilonGreedy:
    """Epsilon-greedy agent for multi-armed bandits."""

    def __init__(self, k: int, epsilon: float = 0.1):
        self.k = k
        self.epsilon = epsilon
        self.q_estimates = np.zeros(k)   # Estimated means
        self.pull_counts = np.zeros(k)   # Number of pulls

    def select_arm(self) -> int:
        """Select arm using epsilon-greedy strategy."""
        if np.random.random() < self.epsilon:
            return np.random.randint(self.k)  # Explore
        return int(np.argmax(self.q_estimates))  # Exploit

    def update(self, arm: int, reward: float):
        """Update estimate using incremental mean."""
        self.pull_counts[arm] += 1
        n = self.pull_counts[arm]
        self.q_estimates[arm] += (reward - self.q_estimates[arm]) / n

    def run(self, bandit: MultiArmedBandit, num_pulls: int = 1000):
        """Run the agent for num_pulls steps."""
        rewards = []
        for _ in range(num_pulls):
            arm = self.select_arm()
            reward = bandit.pull(arm)
            self.update(arm, reward)
            rewards.append(reward)
        return np.array(rewards)


# Example usage
if __name__ == "__main__":
    bandit = MultiArmedBandit(k=4, true_means=[2.0, 3.5, 1.5, 4.0])
    agent = EpsilonGreedy(k=4, epsilon=0.1)

    rewards = agent.run(bandit, num_pulls=1000)
    print(f"Total reward: {rewards.sum():.1f}")
    print(f"Best arm estimate: {np.argmax(agent.q_estimates)}")
    print(f"Estimates: {agent.q_estimates}")
    print(f"Pull counts: {agent.pull_counts}")`,
    javascript: `class MultiArmedBandit {
  constructor(k, trueMeans = null) {
    this.k = k;
    this.trueMeans = trueMeans || Array.from({ length: k },
      () => Math.random() * 4 + 1
    );
    this.std = 1.0;
  }

  pull(arm) {
    // Box-Muller for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
    return this.trueMeans[arm] + this.std * z;
  }
}

class EpsilonGreedy {
  constructor(k, epsilon = 0.1) {
    this.k = k;
    this.epsilon = epsilon;
    this.qEstimates = new Float64Array(k);
    this.pullCounts = new Float64Array(k);
  }

  selectArm() {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.k);
    }
    let bestArm = 0;
    for (let i = 1; i < this.k; i++) {
      if (this.qEstimates[i] > this.qEstimates[bestArm]) bestArm = i;
    }
    return bestArm;
  }

  update(arm, reward) {
    this.pullCounts[arm]++;
    const n = this.pullCounts[arm];
    this.qEstimates[arm] += (reward - this.qEstimates[arm]) / n;
  }

  run(bandit, numPulls = 1000) {
    const rewards = [];
    for (let t = 0; t < numPulls; t++) {
      const arm = this.selectArm();
      const reward = bandit.pull(arm);
      this.update(arm, reward);
      rewards.push(reward);
    }
    return rewards;
  }
}

// Example usage
const bandit = new MultiArmedBandit(4, [2.0, 3.5, 1.5, 4.0]);
const agent = new EpsilonGreedy(4, 0.1);

const rewards = agent.run(bandit, 1000);
const totalReward = rewards.reduce((s, r) => s + r, 0);
console.log(\`Total reward: \${totalReward.toFixed(1)}\`);
console.log("Estimates:", Array.from(agent.qEstimates).map(v => v.toFixed(2)));
console.log("Pull counts:", Array.from(agent.pullCounts));`,
  },
  useCases: [
    "A/B testing for web applications where different page variants are tested to maximize conversion rates",
    "Clinical trials where different treatments must be tested while minimizing harm to patients",
    "Online advertising systems that learn which ads generate the most clicks for given user segments",
    "Recommendation engines that balance showing popular content with discovering user preferences for new content",
  ],
  relatedAlgorithms: [
    "epsilon-greedy",
    "q-learning",
    "mdp",
    "bellman-equation",
  ],
  glossaryTerms: [
    "exploration-exploitation tradeoff",
    "regret",
    "epsilon-greedy",
    "upper confidence bound",
    "thompson sampling",
    "reward distribution",
    "bandit",
  ],
  tags: [
    "reinforcement-learning",
    "exploration",
    "online-learning",
    "sequential-decision-making",
    "stochastic",
    "beginner",
  ],
};
