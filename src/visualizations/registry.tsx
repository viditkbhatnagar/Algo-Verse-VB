import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const visualizationRegistry: Record<string, ComponentType> = {
  // Sorting
  "bubble-sort": dynamic(
    () => import("@/visualizations/sorting/BubbleSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "selection-sort": dynamic(
    () => import("@/visualizations/sorting/SelectionSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "insertion-sort": dynamic(
    () => import("@/visualizations/sorting/InsertionSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "merge-sort": dynamic(
    () => import("@/visualizations/sorting/MergeSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "quick-sort": dynamic(
    () => import("@/visualizations/sorting/QuickSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "heap-sort": dynamic(
    () => import("@/visualizations/sorting/HeapSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "counting-sort": dynamic(
    () => import("@/visualizations/sorting/CountingSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "radix-sort": dynamic(
    () => import("@/visualizations/sorting/RadixSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Searching
  "linear-search": dynamic(
    () => import("@/visualizations/searching/LinearSearch"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "binary-search": dynamic(
    () => import("@/visualizations/searching/BinarySearch"),
    { ssr: false, loading: LoadingSpinner }
  ),
  dfs: dynamic(
    () => import("@/visualizations/searching/DFS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  bfs: dynamic(
    () => import("@/visualizations/searching/BFS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Data Structures
  stack: dynamic(
    () => import("@/visualizations/data-structures/Stack"),
    { ssr: false, loading: LoadingSpinner }
  ),
  queue: dynamic(
    () => import("@/visualizations/data-structures/Queue"),
    { ssr: false, loading: LoadingSpinner }
  ),
  array: dynamic(
    () => import("@/visualizations/data-structures/Array"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "dynamic-array": dynamic(
    () => import("@/visualizations/data-structures/DynamicArray"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "doubly-linked-list": dynamic(
    () => import("@/visualizations/data-structures/DoublyLinkedList"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "linked-list": dynamic(
    () => import("@/visualizations/data-structures/LinkedList"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "binary-tree": dynamic(
    () => import("@/visualizations/data-structures/BinaryTree"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "binary-search-tree": dynamic(
    () => import("@/visualizations/data-structures/BST"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "avl-tree": dynamic(
    () => import("@/visualizations/data-structures/AVLTree"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "min-heap": dynamic(
    () => import("@/visualizations/data-structures/MinHeap"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "max-heap": dynamic(
    () => import("@/visualizations/data-structures/MaxHeap"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "priority-queue": dynamic(
    () => import("@/visualizations/data-structures/PriorityQueue"),
    { ssr: false, loading: LoadingSpinner }
  ),
  trie: dynamic(
    () => import("@/visualizations/data-structures/Trie"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "hash-table": dynamic(
    () => import("@/visualizations/data-structures/HashTable"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "hash-table-open-addressing": dynamic(
    () => import("@/visualizations/data-structures/HashTableOpenAddressing"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "union-find": dynamic(
    () => import("@/visualizations/data-structures/UnionFind"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "adjacency-matrix": dynamic(
    () => import("@/visualizations/data-structures/AdjacencyMatrix"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Graph
  dijkstra: dynamic(
    () => import("@/visualizations/graph/Dijkstra"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "bellman-ford": dynamic(
    () => import("@/visualizations/graph/BellmanFord"),
    { ssr: false, loading: LoadingSpinner }
  ),
  kruskal: dynamic(
    () => import("@/visualizations/graph/Kruskal"),
    { ssr: false, loading: LoadingSpinner }
  ),
  prim: dynamic(
    () => import("@/visualizations/graph/Prim"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "topological-sort": dynamic(
    () => import("@/visualizations/graph/TopologicalSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "a-star": dynamic(
    () => import("@/visualizations/graph/AStar"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "cycle-detection": dynamic(
    () => import("@/visualizations/graph/CycleDetection"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Greedy
  "activity-selection": dynamic(
    () => import("@/visualizations/greedy/ActivitySelection"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "fractional-knapsack": dynamic(
    () => import("@/visualizations/greedy/FractionalKnapsack"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "huffman-coding": dynamic(
    () => import("@/visualizations/greedy/HuffmanCoding"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Dynamic Programming
  fibonacci: dynamic(
    () => import("@/visualizations/dynamic-programming/Fibonacci"),
    { ssr: false, loading: LoadingSpinner }
  ),
  knapsack: dynamic(
    () => import("@/visualizations/dynamic-programming/Knapsack"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "climbing-stairs": dynamic(
    () => import("@/visualizations/dynamic-programming/ClimbingStairs"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "coin-change": dynamic(
    () => import("@/visualizations/dynamic-programming/CoinChange"),
    { ssr: false, loading: LoadingSpinner }
  ),
  lcs: dynamic(
    () => import("@/visualizations/dynamic-programming/LCS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "edit-distance": dynamic(
    () => import("@/visualizations/dynamic-programming/EditDistance"),
    { ssr: false, loading: LoadingSpinner }
  ),
  lis: dynamic(
    () => import("@/visualizations/dynamic-programming/LIS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  kadanes: dynamic(
    () => import("@/visualizations/dynamic-programming/Kadanes"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "unique-paths": dynamic(
    () => import("@/visualizations/dynamic-programming/UniquePaths"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Miscellaneous
  "two-pointer": dynamic(
    () => import("@/visualizations/miscellaneous/TwoPointer"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sliding-window": dynamic(
    () => import("@/visualizations/miscellaneous/SlidingWindow"),
    { ssr: false, loading: LoadingSpinner }
  ),
  recursion: dynamic(
    () => import("@/visualizations/miscellaneous/Recursion"),
    { ssr: false, loading: LoadingSpinner }
  ),
  memoization: dynamic(
    () => import("@/visualizations/miscellaneous/Memoization"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // String
  "naive-string-matching": dynamic(
    () => import("@/visualizations/string/NaiveStringMatching"),
    { ssr: false, loading: LoadingSpinner }
  ),
  kmp: dynamic(
    () => import("@/visualizations/string/KMP"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Mathematical
  "euclidean-gcd": dynamic(
    () => import("@/visualizations/mathematical/EuclideanGCD"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sieve-of-eratosthenes": dynamic(
    () => import("@/visualizations/mathematical/SieveOfEratosthenes"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "matrix-operations": dynamic(
    () => import("@/visualizations/mathematical/MatrixOperations"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Backtracking
  "n-queens": dynamic(
    () => import("@/visualizations/backtracking/NQueens"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sudoku-solver": dynamic(
    () => import("@/visualizations/backtracking/SudokuSolver"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Machine Learning
  knn: dynamic(
    () => import("@/visualizations/machine-learning/KNN"),
    { ssr: false, loading: LoadingSpinner }
  ),
  svm: dynamic(
    () => import("@/visualizations/machine-learning/SVM"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "k-means": dynamic(
    () => import("@/visualizations/machine-learning/KMeans"),
    { ssr: false, loading: LoadingSpinner }
  ),
  dbscan: dynamic(
    () => import("@/visualizations/machine-learning/DBSCAN"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "linear-regression": dynamic(
    () => import("@/visualizations/machine-learning/LinearRegression"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "polynomial-regression": dynamic(
    () => import("@/visualizations/machine-learning/PolynomialRegression"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "logistic-regression": dynamic(
    () => import("@/visualizations/machine-learning/LogisticRegression"),
    { ssr: false, loading: LoadingSpinner }
  ),
  pca: dynamic(
    () => import("@/visualizations/machine-learning/PCA"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "gradient-descent": dynamic(
    () => import("@/visualizations/machine-learning/GradientDescent"),
    { ssr: false, loading: LoadingSpinner }
  ),
  sgd: dynamic(
    () => import("@/visualizations/machine-learning/SGD"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "mini-batch-gd": dynamic(
    () => import("@/visualizations/machine-learning/MiniBatchGD"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "cross-validation": dynamic(
    () => import("@/visualizations/machine-learning/CrossValidation"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "confusion-matrix": dynamic(
    () => import("@/visualizations/machine-learning/ConfusionMatrix"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "roc-auc": dynamic(
    () => import("@/visualizations/machine-learning/ROCAUC"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "feature-scaling": dynamic(
    () => import("@/visualizations/machine-learning/FeatureScaling"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "decision-tree-ml": dynamic(
    () => import("@/visualizations/machine-learning/DecisionTree"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "random-forest": dynamic(
    () => import("@/visualizations/machine-learning/RandomForest"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "naive-bayes": dynamic(
    () => import("@/visualizations/machine-learning/NaiveBayes"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "bias-variance-tradeoff": dynamic(
    () => import("@/visualizations/machine-learning/BiasVarianceTradeoff"),
    { ssr: false, loading: LoadingSpinner }
  ),
  regularization: dynamic(
    () => import("@/visualizations/machine-learning/Regularization"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Deep Learning
  convolution: dynamic(
    () => import("@/visualizations/deep-learning/Convolution"),
    { ssr: false, loading: LoadingSpinner }
  ),
  padding: dynamic(
    () => import("@/visualizations/deep-learning/Padding"),
    { ssr: false, loading: LoadingSpinner }
  ),
  stride: dynamic(
    () => import("@/visualizations/deep-learning/Stride"),
    { ssr: false, loading: LoadingSpinner }
  ),
  pooling: dynamic(
    () => import("@/visualizations/deep-learning/Pooling"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "cnn-architecture": dynamic(
    () => import("@/visualizations/deep-learning/CNNArchitecture"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "vanilla-rnn": dynamic(
    () => import("@/visualizations/deep-learning/VanillaRNN"),
    { ssr: false, loading: LoadingSpinner }
  ),
  lstm: dynamic(
    () => import("@/visualizations/deep-learning/LSTM"),
    { ssr: false, loading: LoadingSpinner }
  ),
  gru: dynamic(
    () => import("@/visualizations/deep-learning/GRU"),
    { ssr: false, loading: LoadingSpinner }
  ),
  seq2seq: dynamic(
    () => import("@/visualizations/deep-learning/Seq2Seq"),
    { ssr: false, loading: LoadingSpinner }
  ),
  perceptron: dynamic(
    () => import("@/visualizations/deep-learning/Perceptron"),
    { ssr: false, loading: LoadingSpinner }
  ),
  mlp: dynamic(
    () => import("@/visualizations/deep-learning/MLP"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "forward-pass": dynamic(
    () => import("@/visualizations/deep-learning/ForwardPass"),
    { ssr: false, loading: LoadingSpinner }
  ),
  backpropagation: dynamic(
    () => import("@/visualizations/deep-learning/Backpropagation"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "activation-functions": dynamic(
    () => import("@/visualizations/deep-learning/ActivationFunctions"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "loss-functions": dynamic(
    () => import("@/visualizations/deep-learning/LossFunctions"),
    { ssr: false, loading: LoadingSpinner }
  ),
  dropout: dynamic(
    () => import("@/visualizations/deep-learning/Dropout"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "vanishing-gradients": dynamic(
    () => import("@/visualizations/deep-learning/VanishingGradients"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sgd-momentum": dynamic(
    () => import("@/visualizations/deep-learning/SGDMomentum"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "adam-optimizer": dynamic(
    () => import("@/visualizations/deep-learning/AdamOptimizer"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Transformer / Attention
  "self-attention": dynamic(
    () => import("@/visualizations/deep-learning/SelfAttention"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "multi-head-attention": dynamic(
    () => import("@/visualizations/deep-learning/MultiHeadAttention"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "positional-encoding": dynamic(
    () => import("@/visualizations/deep-learning/PositionalEncoding"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "transformer-block": dynamic(
    () => import("@/visualizations/deep-learning/TransformerBlock"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "full-transformer": dynamic(
    () => import("@/visualizations/deep-learning/FullTransformer"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "masked-self-attention": dynamic(
    () => import("@/visualizations/deep-learning/MaskedSelfAttention"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Reinforcement Learning
  mdp: dynamic(
    () => import("@/visualizations/reinforcement-learning/MDP"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "q-learning": dynamic(
    () => import("@/visualizations/reinforcement-learning/QLearning"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "multi-armed-bandit": dynamic(
    () => import("@/visualizations/reinforcement-learning/MultiArmedBandit"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "bellman-equation": dynamic(
    () => import("@/visualizations/reinforcement-learning/BellmanEquation"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "epsilon-greedy": dynamic(
    () => import("@/visualizations/reinforcement-learning/EpsilonGreedy"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // NLP
  tokenization: dynamic(
    () => import("@/visualizations/nlp/Tokenization"),
    { ssr: false, loading: LoadingSpinner }
  ),
  stemming: dynamic(
    () => import("@/visualizations/nlp/Stemming"),
    { ssr: false, loading: LoadingSpinner }
  ),
  lemmatization: dynamic(
    () => import("@/visualizations/nlp/Lemmatization"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "n-grams": dynamic(
    () => import("@/visualizations/nlp/NGrams"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "bag-of-words": dynamic(
    () => import("@/visualizations/nlp/BagOfWords"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "tf-idf": dynamic(
    () => import("@/visualizations/nlp/TFIDF"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "word2vec-cbow": dynamic(
    () => import("@/visualizations/nlp/Word2VecCBOW"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "word2vec-skip-gram": dynamic(
    () => import("@/visualizations/nlp/Word2VecSkipGram"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "word-embeddings": dynamic(
    () => import("@/visualizations/nlp/WordEmbeddings"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "one-hot-encoding": dynamic(
    () => import("@/visualizations/nlp/OneHotEncoding"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "cosine-similarity": dynamic(
    () => import("@/visualizations/nlp/CosineSimilarity"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "bert-architecture": dynamic(
    () => import("@/visualizations/nlp/BERTArchitecture"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "gpt-architecture": dynamic(
    () => import("@/visualizations/nlp/GPTArchitecture"),
    { ssr: false, loading: LoadingSpinner }
  ),
  ner: dynamic(
    () => import("@/visualizations/nlp/NER"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "attention-visualization": dynamic(
    () => import("@/visualizations/nlp/AttentionVisualization"),
    { ssr: false, loading: LoadingSpinner }
  ),
  bpe: dynamic(
    () => import("@/visualizations/nlp/BPE"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "beam-search": dynamic(
    () => import("@/visualizations/nlp/BeamSearch"),
    { ssr: false, loading: LoadingSpinner }
  ),
};

export function getVisualization(algorithmId: string): ComponentType | null {
  return visualizationRegistry[algorithmId] ?? null;
}
