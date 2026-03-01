import type { GlossaryTermData } from "@/lib/visualization/types";

export const reinforcementLearningTerms: GlossaryTermData[] = [
  {
    slug: "agent",
    name: "Agent",
    definition:
      "The learner and decision-maker in a reinforcement learning system that interacts with its environment by observing states, selecting actions, and receiving rewards. The agent's goal is to learn a policy that maximizes the cumulative reward over time. Examples range from game-playing AI to robotic controllers and autonomous vehicles.",
    relatedTerms: ["environment", "policy", "state", "action", "reward"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "core-concept"],
  },
  {
    slug: "environment",
    name: "Environment",
    definition:
      "Everything outside the agent that it interacts with — the world in which the agent operates. The environment receives the agent's action, transitions to a new state, and returns a reward signal. It is typically modeled as a Markov Decision Process. The agent has no control over the environment's dynamics; it can only influence it through its actions.",
    relatedTerms: ["agent", "state", "action", "reward", "markov-decision-process"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "core-concept"],
  },
  {
    slug: "state",
    name: "State",
    definition:
      "A representation of the current situation of the environment at a given time step, containing all the information the agent needs to make a decision. In a chess game, the state is the board position; in a robot, it might include joint angles and velocities. The quality of the state representation significantly impacts the agent's ability to learn.",
    relatedTerms: ["environment", "action", "reward", "markov-decision-process", "value-function"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "core-concept"],
  },
  {
    slug: "action",
    name: "Action",
    definition:
      "A choice made by the agent at each time step that affects the environment and causes a transition to a new state. Actions can be discrete (turn left, turn right) or continuous (apply 3.5 Newtons of force). The set of all possible actions available to the agent is called the action space, and its structure greatly influences which algorithms can be applied.",
    relatedTerms: ["agent", "state", "policy", "reward", "environment"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "core-concept"],
  },
  {
    slug: "reward",
    name: "Reward",
    definition:
      "A scalar numerical signal returned by the environment after the agent takes an action, indicating how good or bad that action was. The reward is the primary feedback mechanism in reinforcement learning — the agent's entire objective is to maximize the total cumulative reward (return) over time. Designing a good reward function (reward shaping) is critical and challenging.",
    formula: "The return (cumulative discounted reward) is $G_t = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$",
    relatedTerms: ["agent", "environment", "discount-factor", "value-function", "policy"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "core-concept"],
  },
  {
    slug: "policy",
    name: "Policy",
    definition:
      "A mapping from states to actions (or probability distributions over actions) that defines the agent's behavior. A deterministic policy assigns one action per state, while a stochastic policy gives probabilities over actions. The goal of reinforcement learning is to find the optimal policy — the one that maximizes expected cumulative reward from every state.",
    formula: "Deterministic: $a = \\pi(s)$. Stochastic: $\\pi(a|s) = P(A_t = a | S_t = s)$",
    relatedTerms: ["agent", "action", "state", "value-function", "q-value", "policy-gradient"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "core-concept"],
  },
  {
    slug: "value-function",
    name: "Value Function",
    definition:
      "A function that estimates the expected cumulative reward an agent can obtain starting from a given state (and following a particular policy). The state-value function V(s) answers 'how good is it to be in this state?'. Value functions are central to many RL algorithms because they enable the agent to evaluate and compare states without exhaustively exploring all possibilities.",
    formula: "$V^\\pi(s) = \\mathbb{E}_\\pi\\left[\\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1} \\mid S_t = s\\right]$",
    relatedTerms: ["q-value", "bellman-equation", "policy", "reward", "discount-factor"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "estimation"],
  },
  {
    slug: "q-value",
    name: "Q-Value",
    definition:
      "The expected cumulative reward of taking a specific action in a specific state and then following a particular policy thereafter. While the value function evaluates states, the Q-function (action-value function) evaluates state-action pairs, making it directly useful for action selection. The optimal Q-function satisfies the Bellman optimality equation.",
    formula: "$Q^\\pi(s, a) = \\mathbb{E}_\\pi\\left[\\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1} \\mid S_t = s, A_t = a\\right]$",
    relatedTerms: ["value-function", "q-learning", "bellman-equation", "policy", "deep-q-network"],
    category: "reinforcement-learning",
    tags: ["fundamentals", "estimation"],
  },
  {
    slug: "q-learning",
    name: "Q-Learning",
    definition:
      "An off-policy temporal difference algorithm that learns the optimal Q-function directly, without requiring a model of the environment. At each step, the agent updates its Q-value estimate using the observed reward and the maximum Q-value of the next state. Q-learning is guaranteed to converge to the optimal policy in tabular settings with sufficient exploration.",
    formula: "$Q(s,a) \\leftarrow Q(s,a) + \\alpha\\left[R + \\gamma \\max_{a'} Q(s',a') - Q(s,a)\\right]$",
    relatedTerms: ["q-value", "sarsa", "temporal-difference", "bellman-equation", "epsilon-greedy", "deep-q-network"],
    category: "reinforcement-learning",
    tags: ["algorithm", "model-free", "off-policy"],
  },
  {
    slug: "sarsa",
    name: "SARSA",
    definition:
      "An on-policy temporal difference algorithm whose name stands for State-Action-Reward-State-Action, reflecting the five values it uses in each update. Unlike Q-learning, SARSA updates its Q-values using the action actually taken in the next state (following the current policy), not the maximum. This makes SARSA more conservative and better suited for environments where exploration is risky.",
    formula: "$Q(s,a) \\leftarrow Q(s,a) + \\alpha\\left[R + \\gamma Q(s', a') - Q(s,a)\\right]$, where $a'$ is the action actually taken",
    relatedTerms: ["q-learning", "temporal-difference", "policy", "epsilon-greedy", "q-value"],
    category: "reinforcement-learning",
    tags: ["algorithm", "model-free", "on-policy"],
  },
  {
    slug: "temporal-difference",
    name: "Temporal Difference",
    definition:
      "A family of reinforcement learning methods that update value estimates based on the difference between consecutive predictions, without waiting for the final outcome. TD learning combines the sampling of Monte Carlo methods with the bootstrapping of dynamic programming. The simplest form, TD(0), updates the value of the current state toward the observed reward plus the estimated value of the next state.",
    formula: "$V(s) \\leftarrow V(s) + \\alpha\\left[R + \\gamma V(s') - V(s)\\right]$, where $R + \\gamma V(s') - V(s)$ is the TD error",
    relatedTerms: ["q-learning", "sarsa", "monte-carlo-method", "value-function", "bellman-equation"],
    category: "reinforcement-learning",
    tags: ["method", "fundamentals", "bootstrapping"],
  },
  {
    slug: "monte-carlo-method",
    name: "Monte Carlo Method",
    definition:
      "A class of reinforcement learning methods that estimate value functions by averaging the actual returns observed after visiting a state over many complete episodes. Unlike temporal difference methods, Monte Carlo does not bootstrap — it waits until the end of an episode to perform updates. This makes MC methods unbiased but higher variance, and they require episodic tasks.",
    formula: "$V(s) \\leftarrow V(s) + \\alpha\\left[G_t - V(s)\\right]$, where $G_t$ is the observed return from state $s$",
    relatedTerms: ["temporal-difference", "value-function", "reward", "policy"],
    category: "reinforcement-learning",
    tags: ["method", "model-free", "episodic"],
  },
  {
    slug: "exploration",
    name: "Exploration",
    definition:
      "The strategy of trying new, potentially suboptimal actions to discover more about the environment and find better long-term strategies. Without exploration, an agent might get stuck exploiting a mediocre action and never find the truly optimal one. Balancing exploration with exploitation is one of the central challenges in reinforcement learning.",
    relatedTerms: ["exploitation", "epsilon-greedy", "agent", "action", "reward"],
    category: "reinforcement-learning",
    tags: ["strategy", "fundamentals"],
  },
  {
    slug: "exploitation",
    name: "Exploitation",
    definition:
      "The strategy of selecting the action that the agent currently believes will yield the highest reward, based on its learned knowledge. Pure exploitation maximizes immediate expected reward but risks missing better actions that haven't been sufficiently tried. Good reinforcement learning algorithms strike a careful balance between exploitation and exploration.",
    relatedTerms: ["exploration", "epsilon-greedy", "policy", "q-value"],
    category: "reinforcement-learning",
    tags: ["strategy", "fundamentals"],
  },
  {
    slug: "epsilon-greedy",
    name: "Epsilon-Greedy",
    definition:
      "A simple action selection strategy that balances exploration and exploitation by choosing the action with the highest estimated value (greedy) most of the time, but with probability epsilon, selecting a random action instead. A typical approach is to start with a high epsilon (more exploration) and gradually decay it over training. It is the most commonly used exploration strategy.",
    formula: "Choose action: $a = \\begin{cases} \\arg\\max_a Q(s,a) & \\text{with probability } 1 - \\varepsilon \\\\ \\text{random action} & \\text{with probability } \\varepsilon \\end{cases}$",
    relatedTerms: ["exploration", "exploitation", "q-learning", "sarsa"],
    category: "reinforcement-learning",
    tags: ["strategy", "exploration", "practical"],
  },
  {
    slug: "discount-factor",
    name: "Discount Factor",
    definition:
      "A parameter (gamma, typically between 0 and 1) that determines how much the agent values future rewards compared to immediate rewards. A discount factor of 0 makes the agent completely myopic (only caring about immediate reward), while a value close to 1 makes it far-sighted (caring almost equally about distant future rewards). It also ensures that infinite-horizon returns remain mathematically bounded.",
    formula: "$\\gamma \\in [0, 1]$. Return: $G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\ldots = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$",
    relatedTerms: ["reward", "value-function", "bellman-equation", "q-value"],
    category: "reinforcement-learning",
    tags: ["hyperparameter", "fundamentals"],
  },
  {
    slug: "markov-decision-process",
    name: "Markov Decision Process",
    definition:
      "A mathematical framework for modeling sequential decision-making problems where outcomes are partly random and partly under the control of the agent. An MDP is defined by a set of states, actions, transition probabilities, and a reward function. The key Markov property states that the future depends only on the current state, not on the history of past states.",
    formula: "Defined as a tuple $(S, A, P, R, \\gamma)$ where $P(s'|s,a)$ is the transition probability and $R(s,a)$ is the reward",
    relatedTerms: ["state", "action", "reward", "bellman-equation", "policy", "value-function"],
    category: "reinforcement-learning",
    tags: ["framework", "theory", "fundamentals"],
  },
  {
    slug: "bellman-equation",
    name: "Bellman Equation",
    definition:
      "A recursive relationship that expresses the value of a state as the immediate reward plus the discounted value of the next state. The Bellman equation is the foundation of dynamic programming and many RL algorithms — it decomposes the value function into an immediate component and a future component. The Bellman optimality equation characterizes the optimal value function.",
    formula: "$V^\\pi(s) = \\sum_a \\pi(a|s) \\sum_{s'} P(s'|s,a)\\left[R(s,a,s') + \\gamma V^\\pi(s')\\right]$",
    relatedTerms: ["value-function", "q-value", "markov-decision-process", "temporal-difference", "discount-factor"],
    category: "reinforcement-learning",
    tags: ["theory", "equation", "fundamentals"],
  },
  {
    slug: "deep-q-network",
    name: "Deep Q-Network",
    definition:
      "A reinforcement learning algorithm that combines Q-learning with deep neural networks to handle environments with large or continuous state spaces. Introduced by DeepMind, DQN uses a neural network to approximate the Q-function and employs experience replay and a target network for training stability. DQN achieved human-level performance on many Atari games directly from pixel inputs.",
    relatedTerms: ["q-learning", "q-value", "exploration", "bellman-equation", "policy-gradient"],
    category: "reinforcement-learning",
    tags: ["deep-learning", "algorithm", "neural-network"],
  },
  {
    slug: "policy-gradient",
    name: "Policy Gradient",
    definition:
      "A family of RL algorithms that directly optimize the policy by computing the gradient of the expected return with respect to the policy parameters and updating via gradient ascent. Unlike value-based methods like Q-learning, policy gradient methods can naturally handle continuous action spaces and stochastic policies. The REINFORCE algorithm is the simplest policy gradient method.",
    formula: "$\\nabla_\\theta J(\\theta) = \\mathbb{E}_\\pi\\left[\\nabla_\\theta \\log \\pi_\\theta(a|s) \\cdot G_t\\right]$",
    relatedTerms: ["policy", "deep-q-network", "agent", "reward", "value-function"],
    category: "reinforcement-learning",
    tags: ["algorithm", "optimization", "deep-learning"],
  },
];
