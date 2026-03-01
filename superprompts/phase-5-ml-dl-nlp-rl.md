# Phase 5: ML/DL/NLP/RL Visualizations — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read ALL memory files:
   - `phases-progress.md` — what Phases 1-4 built (especially viz pattern from Phase 2)
   - `architecture-decisions.md` — follow the EXACT viz component pattern
   - `file-registry.md` — existing file paths and shared renderers
3. Read project documentation:
   - `docs/TRD.md` — Section 3.4 (ML/DL/NLP rendering strategies)
   - `docs/ALGORITHM_MASTER_LIST.md` — P0 ML, DL, NLP, RL algorithms
4. Read existing visualization code for the established pattern:
   - Read ONE existing visualization (e.g., BubbleSort) as the template
   - Read shared renderers in `src/visualizations/_shared/`
   - Read `src/components/visualization/Player.tsx`

## Phase Objective
Implement ~60 P0 ML/DL/NLP/RL algorithm visualizations. These require NEW rendering types: scatter plots with decision boundaries, neural network layer diagrams, attention heatmaps, training loss curves, and token flow diagrams.

## IMPORTANT: Same 3-File Pattern
Every algorithm MUST follow the same pattern:
```
src/visualizations/{category}/{AlgorithmName}/
  ├── index.tsx, logic.ts, Canvas.tsx
```
Plus data file at `src/data/algorithms/{category}/{slug}.ts`

## Tasks

### 1. New Shared Renderers (`src/visualizations/_shared/`)

**`ScatterCanvas.tsx`** — 2D scatter plot with clusters and decision boundaries
- D3 scatter plot with axes
- Color-coded data points by class/cluster
- Animated decision boundary lines/curves
- Support for centroids (K-Means), support vectors (SVM), etc.
- Zoom and hover tooltips

**`NeuralNetCanvas.tsx`** — Layered neural network diagram
- Input → Hidden → Output layer layout
- Nodes (circles) arranged vertically per layer
- Weighted connections between layers
- Animated data flow (forward pass: left to right, backward: right to left)
- Node activation values shown
- Dropout: dashed/grayed nodes

**`LossChartCanvas.tsx`** — Animated training curves
- Recharts line chart
- Epoch on x-axis, loss/accuracy on y-axis
- Animated drawing of the curve (epoch by epoch)
- Multiple lines: train loss, val loss, accuracy
- Legend and grid

**`TokenCanvas.tsx`** — NLP token flow diagrams
- Horizontal token boxes with text
- Arrows between tokens (for attention, dependencies)
- Color-coded tokens by type (POS tags, entities, etc.)
- Animated processing flow

**`HeatmapCanvas.tsx`** — Attention/matrix heatmaps
- D3 color scale grid
- Row and column labels
- Color intensity shows attention weights
- Hover to see exact values
- Animated cell-by-cell reveal

**`MLInputPanel.tsx`** — Hyperparameter controls
- Sliders for: learning rate, epochs, batch size, k (for KNN), etc.
- Reset to defaults button
- Real-time update trigger

### 2. Machine Learning (~20 algorithms)
Path: `src/visualizations/machine-learning/{Name}/`

| Algorithm | Rendering |
|-----------|----------|
| Linear Regression | ScatterCanvas with line fitting animation |
| Polynomial Regression | ScatterCanvas with curve fitting |
| Logistic Regression | ScatterCanvas with sigmoid decision boundary |
| KNN | ScatterCanvas with k-nearest voting circles |
| Decision Tree | TreeCanvas with split decisions |
| Random Forest | Multiple small trees + ensemble voting |
| SVM | ScatterCanvas with margin + support vectors |
| Naive Bayes | Probability distribution plots |
| K-Means Clustering | ScatterCanvas with moving centroids |
| DBSCAN | ScatterCanvas with density-based expansion |
| PCA | ScatterCanvas showing projection onto principal components |
| Gradient Descent | 3D surface or contour plot with descending point |
| SGD | Same as GD but with noisy path |
| Mini-batch GD | Batched descent path |
| Cross-Validation | Data split diagram with K folds |
| Confusion Matrix | HeatmapCanvas with TP/FP/TN/FN |
| ROC/AUC | Animated ROC curve drawing |
| Feature Scaling | Before/after scatter comparison |
| Bias-Variance Tradeoff | Complexity vs error curves |
| Regularization (L1/L2) | Weight magnitude visualization |

### 3. Deep Learning (~25 algorithms)
Path: `src/visualizations/deep-learning/{Name}/`

| Algorithm | Rendering |
|-----------|----------|
| Perceptron | Single neuron with inputs, weights, activation |
| MLP | NeuralNetCanvas with multiple hidden layers |
| Forward Pass | NeuralNetCanvas with animated data flow left→right |
| Backpropagation | NeuralNetCanvas with gradient flow right→left |
| Activation Functions | Function graph plots (ReLU, Sigmoid, Tanh, Softmax) |
| Loss Functions | Loss landscape / function graph |
| Dropout | NeuralNetCanvas with randomly dropped connections |
| Vanishing Gradients | Gradient magnitudes getting smaller through layers |
| Convolution | Kernel sliding over 2D input, output feature map |
| Padding | Input with border padding, kernel operation |
| Stride | Kernel step sizes demonstration |
| Pooling | Max/Avg pooling on feature map |
| CNN Architecture | Full pipeline: Conv → ReLU → Pool → Flatten → Dense |
| Vanilla RNN | Unrolled time-step diagram |
| LSTM | Cell diagram with forget/input/output gates |
| GRU | Simplified gated unit diagram |
| Seq2Seq | Encoder → Decoder architecture |
| Self-Attention | QKV matrix multiplication → attention scores |
| Multi-Head Attention | Parallel attention heads + concatenation |
| Positional Encoding | Sinusoidal pattern visualization |
| Transformer Block | LayerNorm → MHA → FFN → Residual |
| Full Transformer | Complete encoder-decoder architecture |
| Masked Self-Attention | Causal mask triangle |
| SGD with Momentum | Momentum ball rolling |
| Adam Optimizer | Combined first/second moment visualization |

### 4. NLP (~15 algorithms)
Path: `src/visualizations/nlp/{Name}/`

| Algorithm | Rendering |
|-----------|----------|
| Tokenization | Text → token boxes breakdown |
| Stemming | Word → stem transformation arrows |
| Lemmatization | Word → lemma with POS context |
| N-grams | Sliding window over token sequence |
| Bag of Words | Document → frequency vector |
| TF-IDF | Term frequency heatmap across documents |
| Word2Vec CBOW | Architecture: context → hidden → target |
| Word2Vec Skip-gram | Architecture: target → hidden → context |
| Word Embeddings | 2D scatter of similar words clustered |
| One-Hot Encoding | Sparse vector diagram |
| BERT Architecture | Bidirectional masked LM diagram |
| GPT Architecture | Autoregressive decoder diagram |
| NER | Text with entity box highlighting |
| Attention Visualization | HeatmapCanvas: source × target attention |
| BPE | Merge operations step-by-step |
| Beam Search | Candidate tree with scores |
| Cosine Similarity | Two vectors with angle between them |

### 5. Reinforcement Learning (~5 algorithms)
Path: `src/visualizations/reinforcement-learning/{Name}/`

| Algorithm | Rendering |
|-----------|----------|
| MDP | State transition diagram with rewards |
| Q-Learning | Grid world with Q-table updates |
| Multi-Armed Bandit | Slot machines with reward distributions |
| Bellman Equation | Value iteration on states |
| Epsilon-Greedy | Exploration rate over time chart |

### 6. Data Files
Create complete data files for ALL ~60 algorithms.
Update `src/data/algorithms/index.ts` to include all.

## CRITICAL: After Completion
1. Run `npm run build` — verify clean build
2. Test representative algorithms from each category:
   - ML: Linear Regression, K-Means, SVM
   - DL: MLP forward pass, CNN, Self-Attention
   - NLP: Tokenization, Word2Vec, Attention Viz
   - RL: Q-Learning
3. Update ALL memory files (MEMORY.md, phases-progress.md, architecture-decisions.md, file-registry.md, current-phase.md)
4. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 5: ML, deep learning, NLP, and RL visualizations (~60 algorithms)"
   git push origin main
   ```
