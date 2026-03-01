# AlgoVerse — Algorithm Master List

> This is the COMPLETE list of algorithms, techniques, and concepts to implement.
> Each entry needs: visualization, explanation, pseudocode, implementation, complexity analysis, and glossary terms.
> Priority: P0 = MVP (build first), P1 = Important (build second), P2 = Complete coverage (build last)

---

## 1. DATA STRUCTURES

### 1.1 Linear Data Structures
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 1 | Array | Block diagram with index labels | P0 |
| 2 | Dynamic Array (ArrayList) | Block diagram showing resize/copy | P0 |
| 3 | Singly Linked List | Node-arrow chain | P0 |
| 4 | Doubly Linked List | Node-bidirectional-arrow chain | P0 |
| 5 | Circular Linked List | Circular node chain | P1 |
| 6 | Stack (LIFO) | Vertical block stack with push/pop | P0 |
| 7 | Queue (FIFO) | Horizontal block queue with enqueue/dequeue | P0 |
| 8 | Deque (Double-ended Queue) | Bidirectional queue | P1 |
| 9 | Priority Queue | Heap-backed queue visualization | P0 |
| 10 | Circular Buffer / Ring Buffer | Circular array diagram | P1 |

### 1.2 Tree Data Structures
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 11 | Binary Tree | Hierarchical node layout | P0 |
| 12 | Binary Search Tree (BST) | Hierarchical with insert/delete/search animation | P0 |
| 13 | AVL Tree | BST with rotation animations | P0 |
| 14 | Red-Black Tree | Color-coded BST with rebalancing | P1 |
| 15 | B-Tree | Wide multi-child node tree | P1 |
| 16 | B+ Tree | B-Tree with linked leaves | P1 |
| 17 | Trie (Prefix Tree) | Character-labeled tree | P0 |
| 18 | Suffix Tree | Suffix-labeled tree | P2 |
| 19 | Segment Tree | Range query tree with intervals | P1 |
| 20 | Fenwick Tree (BIT) | Array with binary indexed structure | P1 |
| 21 | Heap (Min-Heap) | Tree + array dual view | P0 |
| 22 | Heap (Max-Heap) | Tree + array dual view | P0 |
| 23 | Fibonacci Heap | Multi-tree with consolidation | P2 |
| 24 | Splay Tree | BST with splay operation | P2 |
| 25 | Treap | BST + Heap hybrid | P2 |
| 26 | K-D Tree | Spatial partitioning tree | P1 |

### 1.3 Hash-Based Structures
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 27 | Hash Table (Chaining) | Array of buckets with linked lists | P0 |
| 28 | Hash Table (Open Addressing) | Array with probe sequences | P0 |
| 29 | Hash Table (Robin Hood Hashing) | Array with displacement visualization | P2 |
| 30 | Bloom Filter | Bit array with multiple hash functions | P1 |
| 31 | Count-Min Sketch | 2D hash grid | P2 |
| 32 | Cuckoo Hashing | Dual table with displacement | P2 |

### 1.4 Graph Structures
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 33 | Adjacency Matrix | Grid/matrix visualization | P0 |
| 34 | Adjacency List | Node + list visualization | P0 |
| 35 | Edge List | Simple list of pairs | P1 |
| 36 | Weighted Graph | Graph with edge weights | P0 |
| 37 | Directed Graph (Digraph) | Graph with arrow edges | P0 |
| 38 | Undirected Graph | Graph with line edges | P0 |

### 1.5 Advanced Data Structures
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 39 | Disjoint Set (Union-Find) | Forest with path compression | P0 |
| 40 | Skip List | Multi-level linked list | P1 |
| 41 | LRU Cache | Hash map + doubly linked list | P1 |
| 42 | LFU Cache | Frequency-based cache | P2 |

---

## 2. SORTING ALGORITHMS

### 2.1 Comparison-Based Sorting
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 43 | Bubble Sort | Bar chart with adjacent swaps | P0 |
| 44 | Selection Sort | Bar chart with min-finding | P0 |
| 45 | Insertion Sort | Bar chart with insertion shifting | P0 |
| 46 | Merge Sort | Bar chart with divide-and-merge | P0 |
| 47 | Quick Sort | Bar chart with pivot partitioning | P0 |
| 48 | Heap Sort | Heap tree + array transformation | P0 |
| 49 | Shell Sort | Bar chart with gap sequence | P1 |
| 50 | Cocktail Shaker Sort | Bidirectional bubble sort | P1 |
| 51 | Comb Sort | Bar chart with shrinking gap | P2 |
| 52 | Tim Sort | Merge + Insertion hybrid visualization | P1 |
| 53 | Tree Sort | BST insertion then traversal | P2 |
| 54 | Gnome Sort | Bar chart with gnome movement | P2 |
| 55 | Odd-Even Sort | Parallel pair comparisons | P2 |

### 2.2 Non-Comparison Sorting
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 56 | Counting Sort | Frequency array + output construction | P0 |
| 57 | Radix Sort | Digit-by-digit bucket sorting | P0 |
| 58 | Bucket Sort | Bucket distribution + per-bucket sort | P1 |

### 2.3 Special Purpose
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 59 | Topological Sort | DAG with ordering animation | P0 |
| 60 | Pancake Sort | Stack flipping animation | P2 |
| 61 | Bogo Sort | Random shuffle (humorous) | P2 |

---

## 3. SEARCHING ALGORITHMS

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 62 | Linear Search | Array scan with pointer | P0 |
| 63 | Binary Search | Array with narrowing bounds | P0 |
| 64 | Jump Search | Array with block jumps | P1 |
| 65 | Interpolation Search | Array with calculated position | P1 |
| 66 | Exponential Search | Doubling range then binary search | P1 |
| 67 | Ternary Search | Array with three-way division | P2 |
| 68 | Fibonacci Search | Array with Fibonacci division | P2 |
| 69 | Depth-First Search (DFS) | Graph/tree traversal animation | P0 |
| 70 | Breadth-First Search (BFS) | Graph/tree level-by-level traversal | P0 |
| 71 | Iterative Deepening DFS | DFS with increasing depth limits | P1 |
| 72 | Bidirectional Search | Graph with two expanding frontiers | P1 |

---

## 4. GRAPH ALGORITHMS

### 4.1 Shortest Path
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 73 | Dijkstra's Algorithm | Weighted graph with distance updates | P0 |
| 74 | Bellman-Ford Algorithm | Edge relaxation animation | P0 |
| 75 | Floyd-Warshall Algorithm | Distance matrix updates | P1 |
| 76 | A* Search Algorithm | Grid/graph with heuristic + path | P0 |
| 77 | Johnson's Algorithm | Reweighting + Dijkstra | P2 |

### 4.2 Minimum Spanning Tree
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 78 | Kruskal's Algorithm | Edge-by-edge MST construction | P0 |
| 79 | Prim's Algorithm | Growing MST from start node | P0 |
| 80 | Borůvka's Algorithm | Component-based MST | P2 |

### 4.3 Network Flow
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 81 | Ford-Fulkerson (Max Flow) | Flow network with augmenting paths | P1 |
| 82 | Edmonds-Karp Algorithm | BFS-based Ford-Fulkerson | P1 |
| 83 | Dinic's Algorithm | Layered graph flow | P2 |
| 84 | Min-Cut / Max-Flow Theorem | Cut visualization on flow network | P1 |

### 4.4 Other Graph Algorithms
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 85 | Tarjan's SCC Algorithm | Graph with strongly connected components | P1 |
| 86 | Kosaraju's SCC Algorithm | Two-pass DFS on graph | P1 |
| 87 | Articulation Points | Graph with cut vertices highlighted | P1 |
| 88 | Bridges in Graph | Graph with bridge edges highlighted | P1 |
| 89 | Eulerian Path/Circuit | Graph with path tracing | P2 |
| 90 | Hamiltonian Path/Circuit | Graph with backtracking path | P2 |
| 91 | Graph Coloring | Graph with chromatic assignment | P1 |
| 92 | Bipartite Check | Graph with 2-coloring | P1 |
| 93 | Cycle Detection | Graph with cycle highlighting | P0 |

---

## 5. DYNAMIC PROGRAMMING

### 5.1 Classic DP
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 94 | Fibonacci (DP) | Table fill + recursion tree comparison | P0 |
| 95 | Climbing Stairs | Step diagram + DP table | P0 |
| 96 | Coin Change | DP table with coin selection | P0 |
| 97 | 0/1 Knapsack | 2D DP table with item selection | P0 |
| 98 | Unbounded Knapsack | 1D DP table | P1 |
| 99 | Longest Common Subsequence (LCS) | 2D matrix with arrows | P0 |
| 100 | Longest Increasing Subsequence (LIS) | Array with subsequence highlighting | P0 |
| 101 | Edit Distance (Levenshtein) | 2D matrix with operations | P0 |
| 102 | Matrix Chain Multiplication | DP table with parenthesization | P1 |
| 103 | Rod Cutting | DP table with cut positions | P1 |
| 104 | Subset Sum | DP table with boolean entries | P1 |
| 105 | Partition Problem | Subset sum variant | P1 |
| 106 | Longest Palindromic Subsequence | 2D matrix | P1 |
| 107 | Longest Palindromic Substring | Expanding center / DP table | P1 |
| 108 | Word Break Problem | DP array with dictionary lookup | P1 |
| 109 | Egg Drop Problem | 2D DP table | P2 |
| 110 | Maximum Subarray (Kadane's) | Array scan with running sum | P0 |
| 111 | House Robber | DP array with skip pattern | P1 |
| 112 | Unique Paths (Grid) | Grid with path counting | P0 |
| 113 | Minimum Path Sum | Grid with optimal path | P1 |
| 114 | Longest Common Substring | 2D matrix variant | P1 |
| 115 | Regular Expression Matching | 2D DP table | P2 |
| 116 | Wildcard Matching | 2D DP table | P2 |
| 117 | Catalan Numbers | Table with combinatorial visualization | P2 |
| 118 | Travelling Salesman (DP) | Bitmask DP + graph | P1 |

---

## 6. GREEDY ALGORITHMS

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 119 | Activity Selection | Timeline with interval selection | P0 |
| 120 | Fractional Knapsack | Value/weight ratio sorting + filling | P0 |
| 121 | Huffman Coding | Tree construction animation | P0 |
| 122 | Job Sequencing | Timeline with deadline scheduling | P1 |
| 123 | Minimum Platforms | Timeline with overlap counting | P1 |
| 124 | Interval Scheduling | Timeline with greedy selection | P1 |
| 125 | Egyptian Fraction | Fraction decomposition | P2 |

---

## 7. DIVIDE AND CONQUER

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 126 | Merge Sort (D&C view) | Recursive tree splitting | P0 |
| 127 | Quick Sort (D&C view) | Partition tree | P0 |
| 128 | Binary Search (D&C view) | Halving visualization | P0 |
| 129 | Strassen's Matrix Multiplication | Matrix subdivision | P2 |
| 130 | Closest Pair of Points | 2D plane with divide lines | P1 |
| 131 | Karatsuba Multiplication | Number splitting animation | P2 |
| 132 | Maximum Subarray (D&C) | Array splitting + combine | P1 |

---

## 8. STRING ALGORITHMS

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 133 | Naive String Matching | Text + pattern sliding | P0 |
| 134 | KMP Algorithm | Prefix table + matching | P0 |
| 135 | Rabin-Karp Algorithm | Hash-based sliding window | P1 |
| 136 | Boyer-Moore Algorithm | Right-to-left matching | P1 |
| 137 | Z-Algorithm | Z-array construction | P1 |
| 138 | Aho-Corasick | Trie + failure links | P2 |
| 139 | Manacher's Algorithm | Palindrome detection | P2 |
| 140 | Suffix Array | Sorted suffix visualization | P2 |
| 141 | Levenshtein Distance | Edit matrix (see also DP #101) | P0 |

---

## 9. MATHEMATICAL ALGORITHMS

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 142 | Euclidean Algorithm (GCD) | Number reduction steps | P0 |
| 143 | Sieve of Eratosthenes | Number grid with crossing out | P0 |
| 144 | Fast Exponentiation | Binary decomposition | P1 |
| 145 | Modular Arithmetic | Clock/modular visualization | P1 |
| 146 | Newton's Method | Function graph with tangent lines | P1 |
| 147 | Convex Hull (Graham Scan) | 2D point set with hull construction | P1 |
| 148 | Convex Hull (Jarvis March) | Gift wrapping animation | P1 |
| 149 | Line Intersection | 2D geometry visualization | P2 |
| 150 | Matrix Operations | Matrix animations (add, multiply, transpose) | P0 |
| 151 | Gaussian Elimination | Matrix row operations | P1 |
| 152 | Fast Fourier Transform | Signal decomposition | P2 |

---

## 10. BACKTRACKING

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 153 | N-Queens Problem | Chessboard with queen placement | P0 |
| 154 | Sudoku Solver | Grid filling with backtracking | P0 |
| 155 | Rat in a Maze | Grid pathfinding | P1 |
| 156 | Subset Generation | Tree of subsets | P1 |
| 157 | Permutation Generation | Permutation tree | P1 |
| 158 | Knight's Tour | Chessboard with knight moves | P2 |
| 159 | Word Search | Grid with path tracing | P1 |

---

## 11. MACHINE LEARNING ALGORITHMS

### 11.1 Supervised Learning — Regression
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 160 | Linear Regression | 2D scatter + line fitting animation | P0 |
| 161 | Polynomial Regression | 2D scatter + curve fitting | P1 |
| 162 | Ridge Regression (L2) | Coefficient shrinkage visualization | P1 |
| 163 | Lasso Regression (L1) | Coefficient zeroing visualization | P1 |
| 164 | Elastic Net | Combined L1+L2 visualization | P2 |

### 11.2 Supervised Learning — Classification
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 165 | Logistic Regression | Sigmoid curve + decision boundary | P0 |
| 166 | K-Nearest Neighbors (KNN) | 2D scatter with voting circles | P0 |
| 167 | Decision Tree | Tree construction with split criteria | P0 |
| 168 | Random Forest | Multiple trees + voting | P0 |
| 169 | Support Vector Machine (SVM) | 2D scatter + margin + support vectors | P0 |
| 170 | Naive Bayes | Probability distribution + classification | P0 |
| 171 | Gradient Boosting (XGBoost concept) | Sequential tree building | P1 |
| 172 | AdaBoost | Weighted sample resampling | P1 |

### 11.3 Unsupervised Learning
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 173 | K-Means Clustering | 2D scatter with moving centroids | P0 |
| 174 | K-Medoids | Similar to K-Means with actual data points | P2 |
| 175 | DBSCAN | Density-based cluster expansion | P0 |
| 176 | Hierarchical Clustering | Dendrogram construction | P1 |
| 177 | Gaussian Mixture Models (GMM) | 2D Gaussian contours | P1 |
| 178 | PCA (Principal Component Analysis) | 2D/3D projection with eigenvectors | P0 |
| 179 | t-SNE | High-dim to 2D embedding animation | P1 |
| 180 | UMAP | Manifold projection animation | P2 |
| 181 | Autoencoders (concept) | Bottleneck architecture diagram | P1 |

### 11.4 ML Concepts & Techniques
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 182 | Gradient Descent | 3D loss surface with ball rolling | P0 |
| 183 | Stochastic Gradient Descent | Noisy descent path | P0 |
| 184 | Mini-batch Gradient Descent | Batch processing visualization | P1 |
| 185 | Learning Rate Scheduling | Loss curves at different rates | P0 |
| 186 | Cross-Validation (K-Fold) | Data split diagram | P0 |
| 187 | Bias-Variance Tradeoff | Model complexity vs error curves | P0 |
| 188 | Confusion Matrix | Heatmap matrix | P0 |
| 189 | ROC Curve & AUC | Animated ROC curve plotting | P0 |
| 190 | Precision-Recall Curve | Threshold-based curve | P1 |
| 191 | Feature Scaling (Normalization/Standardization) | Before/after scatter plots | P0 |
| 192 | Overfitting vs Underfitting | Training vs validation curves | P0 |
| 193 | Regularization (L1/L2) | Weight distribution visualization | P0 |
| 194 | Ensemble Methods Overview | Bagging vs Boosting diagram | P1 |
| 195 | Hyperparameter Tuning (Grid/Random) | Search space visualization | P1 |

---

## 12. DEEP LEARNING

### 12.1 Neural Network Fundamentals
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 196 | Perceptron | Single neuron with weights + activation | P0 |
| 197 | Multi-Layer Perceptron (MLP) | Layered network diagram | P0 |
| 198 | Forward Pass | Data flowing through network layers | P0 |
| 199 | Backpropagation | Gradient flowing backward through layers | P0 |
| 200 | Activation Functions | Function graphs (ReLU, Sigmoid, Tanh, Softmax, etc.) | P0 |
| 201 | Loss Functions | Loss landscape (MSE, Cross-Entropy, etc.) | P0 |
| 202 | Weight Initialization | Distribution visualization (Xavier, He, etc.) | P1 |
| 203 | Batch Normalization | Distribution shift visualization | P1 |
| 204 | Dropout | Network with randomly dropped connections | P0 |
| 205 | Vanishing/Exploding Gradients | Gradient magnitude through layers | P0 |

### 12.2 Convolutional Neural Networks (CNN)
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 206 | Convolution Operation | Kernel sliding over input matrix | P0 |
| 207 | Padding (Valid, Same) | Input with padding border | P0 |
| 208 | Stride | Kernel with step sizes | P0 |
| 209 | Pooling (Max, Average) | Feature map reduction | P0 |
| 210 | CNN Architecture (LeNet concept) | Full pipeline: Conv→Pool→FC | P0 |
| 211 | Feature Maps | Multiple filter outputs visualized | P1 |
| 212 | 1x1 Convolutions | Channel mixing visualization | P2 |
| 213 | Depthwise Separable Convolutions | Split convolution steps | P2 |
| 214 | Residual Connections (ResNet) | Skip connection diagram | P1 |
| 215 | Transfer Learning | Pre-trained layers freezing | P1 |

### 12.3 Recurrent Neural Networks (RNN)
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 216 | Vanilla RNN | Unrolled time-step diagram | P0 |
| 217 | LSTM | Cell with gates (forget, input, output) | P0 |
| 218 | GRU | Simplified gated unit | P0 |
| 219 | Bidirectional RNN | Forward + backward pass | P1 |
| 220 | Sequence-to-Sequence | Encoder-decoder with hidden state | P0 |

### 12.4 Transformer Architecture
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 221 | Self-Attention Mechanism | Query-Key-Value matrix operations | P0 |
| 222 | Multi-Head Attention | Parallel attention heads | P0 |
| 223 | Positional Encoding | Sinusoidal pattern visualization | P0 |
| 224 | Transformer Block | LayerNorm → Attention → FFN pipeline | P0 |
| 225 | Full Transformer Architecture | Encoder-decoder with all components | P0 |
| 226 | Masked Self-Attention | Causal mask triangle | P0 |
| 227 | Cross-Attention | Encoder-decoder attention | P1 |

### 12.5 Generative Models
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 228 | Variational Autoencoder (VAE) | Encoder → Latent → Decoder | P1 |
| 229 | GAN (Generative Adversarial Network) | Generator vs Discriminator | P1 |
| 230 | Diffusion Models (concept) | Noise → Image denoising steps | P1 |

### 12.6 Optimizers
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 231 | SGD with Momentum | Ball with momentum on loss surface | P0 |
| 232 | AdaGrad | Per-parameter learning rate | P1 |
| 233 | RMSProp | Adaptive learning rate | P1 |
| 234 | Adam | Combined momentum + adaptive rate | P0 |
| 235 | AdamW | Adam with weight decay | P1 |
| 236 | Learning Rate Warmup | Rate schedule visualization | P1 |
| 237 | Cosine Annealing | Cosine-shaped LR schedule | P2 |

---

## 13. NATURAL LANGUAGE PROCESSING (NLP)

### 13.1 Text Preprocessing
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 238 | Tokenization | Text → token boxes | P0 |
| 239 | Stemming | Word → stem transformation | P0 |
| 240 | Lemmatization | Word → lemma transformation | P0 |
| 241 | Stop Word Removal | Text with words crossing out | P0 |
| 242 | N-grams | Sliding window over tokens | P0 |
| 243 | Bag of Words (BoW) | Document → frequency vector | P0 |

### 13.2 Text Representation
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 244 | TF-IDF | Term frequency heatmap across documents | P0 |
| 245 | Word2Vec (CBOW) | Context → target word architecture | P0 |
| 246 | Word2Vec (Skip-gram) | Target → context word architecture | P0 |
| 247 | GloVe | Co-occurrence matrix → vectors | P1 |
| 248 | FastText | Subword embedding visualization | P1 |
| 249 | Word Embeddings Space | 2D/3D embedding scatter plot with analogies | P0 |
| 250 | One-Hot Encoding | Sparse vector visualization | P0 |

### 13.3 Neural NLP Models
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 251 | BERT Architecture | Bidirectional transformer diagram | P0 |
| 252 | GPT Architecture | Autoregressive decoder diagram | P0 |
| 253 | BERT Masked Language Model | Token masking + prediction | P0 |
| 254 | Next Sentence Prediction | Sentence pair classification | P1 |
| 255 | Fine-tuning BERT | Frozen layers + task head | P1 |
| 256 | Sentence Transformers | Siamese network for embeddings | P2 |

### 13.4 NLP Tasks & Techniques
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 257 | Named Entity Recognition (NER) | Text with entity highlighting | P0 |
| 258 | Part-of-Speech Tagging | Text with POS labels | P0 |
| 259 | Sentiment Analysis | Text → score/label pipeline | P0 |
| 260 | Text Classification | Document → category pipeline | P0 |
| 261 | Machine Translation | Source → target with attention | P1 |
| 262 | Text Summarization | Document → summary pipeline | P1 |
| 263 | Question Answering | Context + question → answer span | P1 |
| 264 | Beam Search (Decoding) | Tree of candidate sequences | P0 |
| 265 | Greedy Decoding | Sequential token selection | P0 |
| 266 | Top-K Sampling | Probability distribution truncation | P1 |
| 267 | Top-P (Nucleus) Sampling | Cumulative probability cutoff | P1 |
| 268 | Temperature Scaling | Distribution sharpening/flattening | P1 |

### 13.5 Advanced NLP Concepts
| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 269 | Attention Visualization | Heatmap between source/target tokens | P0 |
| 270 | Byte-Pair Encoding (BPE) | Merge operations on character pairs | P0 |
| 271 | WordPiece Tokenization | Subword segmentation | P1 |
| 272 | SentencePiece | Unigram model tokenization | P2 |
| 273 | Perplexity | Probability-based metric visualization | P1 |
| 274 | BLEU Score | N-gram overlap calculation | P1 |
| 275 | ROUGE Score | Recall-based overlap visualization | P2 |
| 276 | Cosine Similarity | Vector angle visualization | P0 |

---

## 14. REINFORCEMENT LEARNING

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 277 | Markov Decision Process (MDP) | State transition diagram | P0 |
| 278 | Q-Learning | Q-table update visualization | P0 |
| 279 | SARSA | On-policy Q-table update | P1 |
| 280 | Policy Gradient (REINFORCE) | Policy improvement visualization | P1 |
| 281 | Deep Q-Network (DQN) | NN + experience replay | P1 |
| 282 | Actor-Critic | Dual network architecture | P2 |
| 283 | Multi-Armed Bandit | Exploration vs exploitation | P0 |
| 284 | Monte Carlo Tree Search | Tree expansion with rollouts | P1 |
| 285 | Bellman Equation | Value iteration on grid world | P0 |
| 286 | Epsilon-Greedy Strategy | Exploration rate visualization | P0 |

---

## 15. OPTIMIZATION ALGORITHMS

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 287 | Gradient Descent (detailed) | Contour plot with descent path | P0 |
| 288 | Simulated Annealing | Temperature-based search landscape | P1 |
| 289 | Genetic Algorithm | Population evolution visualization | P1 |
| 290 | Particle Swarm Optimization | Swarm movement on landscape | P2 |
| 291 | Hill Climbing | Step-by-step ascent on landscape | P1 |
| 292 | Linear Programming (Simplex) | 2D feasible region with vertex hopping | P1 |
| 293 | Constraint Satisfaction | Variable assignment with backtracking | P2 |
| 294 | Branch and Bound | Search tree with pruning | P1 |

---

## 16. MISCELLANEOUS / PARADIGMS

| # | Name | Visualization Type | Priority |
|---|---|---|---|
| 295 | Two Pointer Technique | Array with converging pointers | P0 |
| 296 | Sliding Window | Array with moving window bounds | P0 |
| 297 | Recursion Visualization | Call stack tree | P0 |
| 298 | Memoization | Recursion tree with cached nodes | P0 |
| 299 | Bit Manipulation | Binary representation operations | P1 |
| 300 | Reservoir Sampling | Stream sampling animation | P2 |

---

## SUMMARY

| Category | Count |
|---|---|
| Data Structures | 42 |
| Sorting | 19 |
| Searching | 11 |
| Graph Algorithms | 21 |
| Dynamic Programming | 25 |
| Greedy | 7 |
| Divide & Conquer | 7 |
| String Algorithms | 9 |
| Mathematical | 11 |
| Backtracking | 7 |
| Machine Learning | 36 |
| Deep Learning | 42 |
| NLP | 39 |
| Reinforcement Learning | 10 |
| Optimization | 8 |
| Miscellaneous | 6 |
| **GRAND TOTAL** | **~300** |

### Priority Breakdown
- **P0 (MVP):** ~120 algorithms — Build these first
- **P1 (Important):** ~110 algorithms — Build second
- **P2 (Complete):** ~70 algorithms — Build last
