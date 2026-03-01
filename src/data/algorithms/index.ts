import type { AlgorithmMetadata, Category } from "@/lib/visualization/types";

// Sorting
import { bubbleSort } from "./sorting/bubble-sort";
import { selectionSort } from "./sorting/selection-sort";
import { insertionSort } from "./sorting/insertion-sort";
import { mergeSort } from "./sorting/merge-sort";
import { quickSort } from "./sorting/quick-sort";
import { heapSort } from "./sorting/heap-sort";
import { countingSort } from "./sorting/counting-sort";
import { radixSort } from "./sorting/radix-sort";

// Searching
import { linearSearch } from "./searching/linear-search";
import { binarySearch } from "./searching/binary-search";
import { dfs } from "./searching/dfs";
import { bfs } from "./searching/bfs";

// Data Structures
import { stack } from "./data-structures/stack";
import { queue } from "./data-structures/queue";
import { array } from "./data-structures/array";
import { dynamicArray } from "./data-structures/dynamic-array";
import { doublyLinkedList } from "./data-structures/doubly-linked-list";
import { linkedList } from "./data-structures/linked-list";
import { binaryTree } from "./data-structures/binary-tree";
import { binarySearchTree } from "./data-structures/binary-search-tree";
import { avlTree } from "./data-structures/avl-tree";
import { hashTable } from "./data-structures/hash-table";
import { hashTableOpenAddressing } from "./data-structures/hash-table-open-addressing";
import { unionFind } from "./data-structures/union-find";
import { adjacencyMatrix } from "./data-structures/adjacency-matrix";
import { minHeap } from "./data-structures/min-heap";
import { maxHeap } from "./data-structures/max-heap";
import { priorityQueue } from "./data-structures/priority-queue";
import { trie } from "./data-structures/trie";

// Graph
import { dijkstra } from "./graph/dijkstra";
import { bellmanFord } from "./graph/bellman-ford";
import { kruskal } from "./graph/kruskal";
import { prim } from "./graph/prim";
import { topologicalSort } from "./graph/topological-sort";
import { aStar } from "./graph/a-star";
import { cycleDetection } from "./graph/cycle-detection";

// Greedy
import { activitySelection } from "./greedy/activity-selection";
import { fractionalKnapsack } from "./greedy/fractional-knapsack";
import { huffmanCoding } from "./greedy/huffman-coding";

// Dynamic Programming
import { fibonacci } from "./dynamic-programming/fibonacci";
import { knapsack } from "./dynamic-programming/knapsack";
import { climbingStairs } from "./dynamic-programming/climbing-stairs";
import { coinChange } from "./dynamic-programming/coin-change";
import { lcs } from "./dynamic-programming/lcs";
import { editDistance } from "./dynamic-programming/edit-distance";
import { lis } from "./dynamic-programming/lis";
import { kadanes } from "./dynamic-programming/kadanes";
import { uniquePaths } from "./dynamic-programming/unique-paths";

// String
import { naiveStringMatching } from "./string/naive-string-matching";
import { kmp } from "./string/kmp";

// Mathematical
import { euclideanGcd } from "./mathematical/euclidean-gcd";
import { sieveOfEratosthenes } from "./mathematical/sieve-of-eratosthenes";
import { matrixOperations } from "./mathematical/matrix-operations";

// Backtracking
import { nQueens } from "./backtracking/n-queens";
import { sudokuSolver } from "./backtracking/sudoku-solver";

// Machine Learning
import { knn } from "./machine-learning/knn";
import { svm } from "./machine-learning/svm";
import { kMeans } from "./machine-learning/k-means";
import { dbscan } from "./machine-learning/dbscan";
import { linearRegression } from "./machine-learning/linear-regression";
import { polynomialRegression } from "./machine-learning/polynomial-regression";
import { logisticRegression } from "./machine-learning/logistic-regression";
import { pca } from "./machine-learning/pca";
import { gradientDescent } from "./machine-learning/gradient-descent";
import { sgd } from "./machine-learning/sgd";
import { miniBatchGd } from "./machine-learning/mini-batch-gd";
import { crossValidation } from "./machine-learning/cross-validation";
import { confusionMatrix } from "./machine-learning/confusion-matrix";
import { rocAuc } from "./machine-learning/roc-auc";
import { featureScaling } from "./machine-learning/feature-scaling";
import { decisionTreeML } from "./machine-learning/decision-tree-ml";
import { randomForest } from "./machine-learning/random-forest";
import { naiveBayes } from "./machine-learning/naive-bayes";
import { biasVarianceTradeoff } from "./machine-learning/bias-variance-tradeoff";
import { regularization } from "./machine-learning/regularization";

// Deep Learning
import { convolution } from "./deep-learning/convolution";
import { padding } from "./deep-learning/padding";
import { stride } from "./deep-learning/stride";
import { pooling } from "./deep-learning/pooling";
import { cnnArchitecture } from "./deep-learning/cnn-architecture";
import { vanillaRnn } from "./deep-learning/vanilla-rnn";
import { lstm } from "./deep-learning/lstm";
import { gru } from "./deep-learning/gru";
import { seq2seq } from "./deep-learning/seq2seq";
import { perceptron } from "./deep-learning/perceptron";
import { mlp } from "./deep-learning/mlp";
import { forwardPass } from "./deep-learning/forward-pass";
import { backpropagation } from "./deep-learning/backpropagation";
import { activationFunctions } from "./deep-learning/activation-functions";
import { lossFunctions } from "./deep-learning/loss-functions";
import { dropout } from "./deep-learning/dropout";
import { vanishingGradients } from "./deep-learning/vanishing-gradients";
import { sgdMomentum } from "./deep-learning/sgd-momentum";
import { adamOptimizer } from "./deep-learning/adam-optimizer";
import { selfAttention } from "./deep-learning/self-attention";
import { multiHeadAttention } from "./deep-learning/multi-head-attention";
import { positionalEncoding } from "./deep-learning/positional-encoding";
import { transformerBlock } from "./deep-learning/transformer-block";
import { fullTransformer } from "./deep-learning/full-transformer";
import { maskedSelfAttention } from "./deep-learning/masked-self-attention";

// Reinforcement Learning
import { mdp } from "./reinforcement-learning/mdp";
import { qLearning } from "./reinforcement-learning/q-learning";
import { multiArmedBandit } from "./reinforcement-learning/multi-armed-bandit";
import { bellmanEquation } from "./reinforcement-learning/bellman-equation";
import { epsilonGreedy } from "./reinforcement-learning/epsilon-greedy";

// NLP
import { tokenization } from "./nlp/tokenization";
import { stemming } from "./nlp/stemming";
import { lemmatization } from "./nlp/lemmatization";
import { nGrams } from "./nlp/n-grams";
import { bagOfWords } from "./nlp/bag-of-words";
import { tfIdf } from "./nlp/tf-idf";
import { word2vecCbow } from "./nlp/word2vec-cbow";
import { word2vecSkipGram } from "./nlp/word2vec-skip-gram";
import { wordEmbeddings } from "./nlp/word-embeddings";
import { oneHotEncoding } from "./nlp/one-hot-encoding";
import { cosineSimilarity } from "./nlp/cosine-similarity";
import { bertArchitecture } from "./nlp/bert-architecture";
import { gptArchitecture } from "./nlp/gpt-architecture";
import { ner } from "./nlp/ner";
import { attentionVisualization } from "./nlp/attention-visualization";
import { bpe } from "./nlp/bpe";
import { beamSearch } from "./nlp/beam-search";

// Miscellaneous
import { twoPointer } from "./miscellaneous/two-pointer";
import { slidingWindow } from "./miscellaneous/sliding-window";
import { recursion } from "./miscellaneous/recursion";
import { memoization } from "./miscellaneous/memoization";

const algorithms: AlgorithmMetadata[] = [
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  // Searching
  linearSearch,
  binarySearch,
  dfs,
  bfs,
  // Data Structures
  stack,
  queue,
  array,
  dynamicArray,
  doublyLinkedList,
  linkedList,
  binaryTree,
  binarySearchTree,
  avlTree,
  hashTable,
  hashTableOpenAddressing,
  unionFind,
  adjacencyMatrix,
  minHeap,
  maxHeap,
  priorityQueue,
  trie,
  // Graph
  dijkstra,
  bellmanFord,
  kruskal,
  prim,
  topologicalSort,
  aStar,
  cycleDetection,
  // Greedy
  activitySelection,
  fractionalKnapsack,
  huffmanCoding,
  // Dynamic Programming
  fibonacci,
  knapsack,
  climbingStairs,
  coinChange,
  lcs,
  editDistance,
  lis,
  kadanes,
  uniquePaths,
  // String
  naiveStringMatching,
  kmp,
  // Mathematical
  euclideanGcd,
  sieveOfEratosthenes,
  matrixOperations,
  // Backtracking
  nQueens,
  sudokuSolver,
  // Machine Learning
  knn,
  svm,
  kMeans,
  dbscan,
  linearRegression,
  polynomialRegression,
  logisticRegression,
  pca,
  gradientDescent,
  sgd,
  miniBatchGd,
  crossValidation,
  confusionMatrix,
  rocAuc,
  featureScaling,
  decisionTreeML,
  randomForest,
  naiveBayes,
  biasVarianceTradeoff,
  regularization,
  // Deep Learning
  convolution,
  padding,
  stride,
  pooling,
  cnnArchitecture,
  vanillaRnn,
  lstm,
  gru,
  seq2seq,
  perceptron,
  mlp,
  forwardPass,
  backpropagation,
  activationFunctions,
  lossFunctions,
  dropout,
  vanishingGradients,
  sgdMomentum,
  adamOptimizer,
  selfAttention,
  multiHeadAttention,
  positionalEncoding,
  transformerBlock,
  fullTransformer,
  maskedSelfAttention,
  // Reinforcement Learning
  mdp,
  qLearning,
  multiArmedBandit,
  bellmanEquation,
  epsilonGreedy,
  // NLP
  tokenization,
  stemming,
  lemmatization,
  nGrams,
  bagOfWords,
  tfIdf,
  word2vecCbow,
  word2vecSkipGram,
  wordEmbeddings,
  oneHotEncoding,
  cosineSimilarity,
  bertArchitecture,
  gptArchitecture,
  ner,
  attentionVisualization,
  bpe,
  beamSearch,
  // Miscellaneous
  twoPointer,
  slidingWindow,
  recursion,
  memoization,
];

export function getAllAlgorithms(): AlgorithmMetadata[] {
  return algorithms;
}

export function getAlgorithmById(id: string): AlgorithmMetadata | undefined {
  return algorithms.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(category: Category | string): AlgorithmMetadata[] {
  return algorithms.filter((a) => a.category === category);
}
