import type { GlossaryTermData } from "@/lib/visualization/types";

export const deepLearningTerms: GlossaryTermData[] = [
  {
    slug: "neural-network",
    name: "Neural Network",
    definition:
      "A computational model inspired by the structure of biological brains, consisting of layers of interconnected artificial neurons. Each connection has a weight that is adjusted during training to learn patterns from data. Neural networks are the foundation of deep learning and can approximate virtually any function given enough neurons and data.",
    relatedTerms: ["artificial-neuron", "perceptron", "multi-layer-perceptron", "weight", "activation-function"],
    category: "deep-learning",
    tags: ["fundamentals", "architecture", "model"],
  },
  {
    slug: "artificial-neuron",
    name: "Artificial Neuron",
    definition:
      "The basic computational unit of a neural network that receives one or more inputs, multiplies each by a weight, sums them together with a bias term, and passes the result through an activation function. It is loosely modeled after biological neurons. Multiple artificial neurons organized in layers form a neural network.",
    formula: "$y = f\\left(\\sum_{i} w_i x_i + b\\right)$",
    relatedTerms: ["neural-network", "perceptron", "weight", "bias-neural-network", "activation-function"],
    category: "deep-learning",
    tags: ["fundamentals", "unit", "computation"],
  },
  {
    slug: "perceptron",
    name: "Perceptron",
    definition:
      "The simplest type of artificial neural network, consisting of a single neuron that makes binary decisions by computing a weighted sum of inputs and applying a step function. Invented by Frank Rosenblatt in 1957, it can only solve linearly separable problems. Stacking perceptrons into multiple layers overcomes this limitation.",
    formula: "$y = \\begin{cases} 1 & \\text{if } \\mathbf{w} \\cdot \\mathbf{x} + b > 0 \\\\ 0 & \\text{otherwise} \\end{cases}$",
    relatedTerms: ["artificial-neuron", "multi-layer-perceptron", "activation-function", "neural-network"],
    category: "deep-learning",
    tags: ["fundamentals", "historical", "linear"],
  },
  {
    slug: "multi-layer-perceptron",
    name: "Multi-Layer Perceptron",
    definition:
      "A feedforward neural network with at least one hidden layer between the input and output layers. Each layer is fully connected to the next, and non-linear activation functions are applied at each neuron. MLPs can learn non-linear decision boundaries and are the classic architecture for many supervised learning tasks.",
    relatedTerms: ["perceptron", "neural-network", "activation-function", "backpropagation", "forward-pass"],
    category: "deep-learning",
    tags: ["architecture", "feedforward", "fully-connected"],
  },
  {
    slug: "activation-function",
    name: "Activation Function",
    definition:
      "A mathematical function applied to the output of each neuron that introduces non-linearity into the network. Without activation functions, a multi-layer network would collapse to a single linear transformation regardless of depth. Common choices include ReLU, sigmoid, tanh, and softmax.",
    relatedTerms: ["sigmoid", "relu", "tanh", "softmax", "artificial-neuron", "neural-network"],
    category: "deep-learning",
    tags: ["fundamentals", "non-linearity", "function"],
  },
  {
    slug: "sigmoid",
    name: "Sigmoid",
    definition:
      "An activation function that squashes any input value into the range (0, 1), making it useful for modeling probabilities. It has an S-shaped curve and was historically the most popular activation function. However, it suffers from the vanishing gradient problem for very large or very small inputs and has largely been replaced by ReLU in hidden layers.",
    formula: "$\\sigma(x) = \\frac{1}{1 + e^{-x}}$",
    relatedTerms: ["activation-function", "relu", "tanh", "vanishing-gradient", "logistic-regression"],
    category: "deep-learning",
    tags: ["activation", "function", "probability"],
  },
  {
    slug: "relu",
    name: "ReLU",
    definition:
      "Short for Rectified Linear Unit, ReLU is the most widely used activation function in deep learning. It outputs the input directly if it is positive, and zero otherwise. ReLU is computationally efficient and helps mitigate the vanishing gradient problem, enabling the training of much deeper networks. Its main drawback is the 'dying ReLU' problem where neurons can permanently output zero.",
    formula: "$\\text{ReLU}(x) = \\max(0, x)$",
    relatedTerms: ["activation-function", "sigmoid", "tanh", "vanishing-gradient"],
    category: "deep-learning",
    tags: ["activation", "function", "non-linear"],
  },
  {
    slug: "tanh",
    name: "Tanh",
    definition:
      "The hyperbolic tangent activation function that maps inputs to the range (-1, 1). It is zero-centered unlike sigmoid, which can make optimization easier. Tanh is still used in certain architectures like LSTMs and GRUs, but ReLU is generally preferred for hidden layers of feedforward networks due to its computational simplicity.",
    formula: "$\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$",
    relatedTerms: ["activation-function", "sigmoid", "relu", "lstm", "gru"],
    category: "deep-learning",
    tags: ["activation", "function", "zero-centered"],
  },
  {
    slug: "softmax",
    name: "Softmax",
    definition:
      "An activation function typically used in the output layer of a neural network for multi-class classification. It converts a vector of raw scores (logits) into a probability distribution where all values are between 0 and 1 and sum to 1. The class with the highest softmax probability is the predicted class.",
    formula: "$\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j} e^{z_j}}$",
    relatedTerms: ["activation-function", "sigmoid", "cross-entropy-loss", "classification"],
    category: "deep-learning",
    tags: ["activation", "function", "probability", "output"],
  },
  {
    slug: "backpropagation",
    name: "Backpropagation",
    definition:
      "The fundamental algorithm for training neural networks that efficiently computes the gradient of the loss function with respect to every weight in the network. It works by applying the chain rule of calculus, propagating error signals backward from the output layer through the hidden layers. These gradients are then used by an optimizer like SGD to update the weights.",
    formalDefinition:
      "For weight $w_{ij}$ connecting neuron $i$ to neuron $j$: $\\frac{\\partial L}{\\partial w_{ij}} = \\frac{\\partial L}{\\partial a_j} \\cdot \\frac{\\partial a_j}{\\partial z_j} \\cdot \\frac{\\partial z_j}{\\partial w_{ij}}$, computed via the chain rule.",
    relatedTerms: ["forward-pass", "backward-pass", "gradient-descent", "weight", "loss-function"],
    category: "deep-learning",
    tags: ["fundamentals", "training", "gradient", "chain-rule"],
  },
  {
    slug: "forward-pass",
    name: "Forward Pass",
    definition:
      "The process of passing input data through a neural network from the input layer to the output layer, computing the weighted sums and activation functions at each layer to produce a prediction. During training, the forward pass generates the predicted output which is compared to the true label to compute the loss. It is the first step before backpropagation.",
    relatedTerms: ["backward-pass", "backpropagation", "neural-network", "activation-function"],
    category: "deep-learning",
    tags: ["fundamentals", "training", "inference"],
  },
  {
    slug: "backward-pass",
    name: "Backward Pass",
    definition:
      "The phase of training where gradients of the loss function are computed with respect to each weight by propagating error signals from the output layer back to the input layer using the chain rule. This is the core computation of the backpropagation algorithm. The computed gradients are then used to update the weights in the direction that reduces the loss.",
    relatedTerms: ["forward-pass", "backpropagation", "gradient-descent", "weight"],
    category: "deep-learning",
    tags: ["fundamentals", "training", "gradient"],
  },
  {
    slug: "weight",
    name: "Weight",
    definition:
      "A learnable parameter in a neural network that determines the strength of the connection between two neurons. Weights are multiplied by input values and adjusted during training to minimize the loss function. The collection of all weights in a network encodes the patterns and knowledge the model has learned from the data.",
    relatedTerms: ["bias-neural-network", "artificial-neuron", "backpropagation", "gradient-descent"],
    category: "deep-learning",
    tags: ["fundamentals", "parameter", "learnable"],
  },
  {
    slug: "bias-neural-network",
    name: "Bias (Neural Network)",
    definition:
      "A learnable parameter in a neural network that is added to the weighted sum of inputs before the activation function. Unlike the statistical concept of bias, this is simply an offset term that allows the neuron to shift its activation function. It enables neurons to produce non-zero output even when all inputs are zero.",
    formula: "$z = \\sum_{i} w_i x_i + b$",
    relatedTerms: ["weight", "artificial-neuron", "activation-function"],
    category: "deep-learning",
    tags: ["fundamentals", "parameter", "learnable"],
  },
  {
    slug: "epoch",
    name: "Epoch",
    definition:
      "One complete pass through the entire training dataset during the training of a neural network. Training typically requires many epochs, and the model's performance generally improves with each epoch up to a point. Too many epochs can lead to overfitting, so validation loss is monitored to decide when to stop.",
    relatedTerms: ["batch-size", "mini-batch", "training-set", "overfitting"],
    category: "deep-learning",
    tags: ["training", "hyperparameter", "iteration"],
  },
  {
    slug: "batch-size",
    name: "Batch Size",
    definition:
      "The number of training examples processed together in a single forward and backward pass before the model's weights are updated. Larger batch sizes provide more stable gradient estimates but require more memory and can converge to sharper minima. Smaller batch sizes add noise that can help escape local minima but may slow convergence.",
    relatedTerms: ["mini-batch", "epoch", "stochastic-gradient-descent", "gpu-acceleration"],
    category: "deep-learning",
    tags: ["training", "hyperparameter", "optimization"],
  },
  {
    slug: "mini-batch",
    name: "Mini-Batch",
    definition:
      "A small subset of the training data used to compute an approximate gradient and update the model weights in a single step. Mini-batch gradient descent is a compromise between full-batch gradient descent (using all data) and stochastic gradient descent (using one example at a time). Common mini-batch sizes range from 16 to 512 examples.",
    relatedTerms: ["batch-size", "stochastic-gradient-descent", "epoch"],
    category: "deep-learning",
    tags: ["training", "optimization", "gradient"],
  },
  {
    slug: "learning-rate-schedule",
    name: "Learning Rate Schedule",
    definition:
      "A strategy for changing the learning rate during training, typically reducing it over time. Starting with a larger learning rate allows fast initial progress, while gradually reducing it enables finer convergence near the optimum. Common schedules include step decay, exponential decay, cosine annealing, and warmup followed by decay.",
    relatedTerms: ["learning-rate", "optimizer", "adam-optimizer", "epoch"],
    category: "deep-learning",
    tags: ["training", "hyperparameter", "optimization"],
  },
  {
    slug: "optimizer",
    name: "Optimizer",
    definition:
      "The algorithm used to update the model's weights during training in order to minimize the loss function. Different optimizers use different strategies for adjusting the learning rate and direction of updates. Popular optimizers include SGD with momentum, Adam, RMSprop, and AdaGrad, each with different convergence properties.",
    relatedTerms: ["adam-optimizer", "sgd-with-momentum", "gradient-descent", "learning-rate"],
    category: "deep-learning",
    tags: ["training", "optimization", "algorithm"],
  },
  {
    slug: "adam-optimizer",
    name: "Adam Optimizer",
    definition:
      "An adaptive learning rate optimization algorithm that combines the benefits of two other methods: AdaGrad (which adapts learning rates based on gradient history) and RMSprop (which uses a moving average of squared gradients). Adam maintains per-parameter learning rates and is widely regarded as a robust default optimizer for deep learning.",
    formalDefinition:
      "Adam computes first ($m_t$) and second ($v_t$) moment estimates of gradients with bias correction, then updates: $\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$.",
    formula: "$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$",
    relatedTerms: ["optimizer", "sgd-with-momentum", "learning-rate", "gradient-descent"],
    category: "deep-learning",
    tags: ["optimizer", "adaptive", "momentum"],
  },
  {
    slug: "sgd-with-momentum",
    name: "SGD with Momentum",
    definition:
      "An enhancement to stochastic gradient descent that accelerates convergence by accumulating a velocity vector that smooths out oscillations in the gradient updates. Like a ball rolling downhill, momentum helps the optimizer maintain consistent direction through noisy or flat regions of the loss landscape. It typically converges faster than plain SGD.",
    formula: "$v_t = \\gamma v_{t-1} + \\eta \\nabla J(\\theta_t), \\quad \\theta_{t+1} = \\theta_t - v_t$",
    relatedTerms: ["optimizer", "stochastic-gradient-descent", "adam-optimizer", "learning-rate"],
    category: "deep-learning",
    tags: ["optimizer", "momentum", "acceleration"],
  },
  {
    slug: "dropout",
    name: "Dropout",
    definition:
      "A regularization technique that randomly sets a fraction of neurons to zero during each training step. This prevents neurons from co-adapting too heavily and forces the network to learn more robust features that are useful across different subsets of neurons. At test time, all neurons are active but their outputs are scaled appropriately.",
    formalDefinition:
      "During training, each neuron is retained with probability $p$ (or dropped with probability $1-p$). At inference, outputs are multiplied by $p$ to maintain expected values.",
    relatedTerms: ["regularization", "overfitting", "batch-normalization"],
    category: "deep-learning",
    tags: ["regularization", "technique", "training"],
  },
  {
    slug: "batch-normalization",
    name: "Batch Normalization",
    definition:
      "A technique that normalizes the inputs to each layer by subtracting the batch mean and dividing by the batch standard deviation, followed by a learnable scale and shift. It stabilizes and accelerates training by reducing internal covariate shift. Batch normalization also has a mild regularizing effect and allows the use of higher learning rates.",
    formula: "$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta$",
    relatedTerms: ["layer-normalization", "dropout", "training-set", "learning-rate"],
    category: "deep-learning",
    tags: ["normalization", "technique", "training", "stabilization"],
  },
  {
    slug: "layer-normalization",
    name: "Layer Normalization",
    definition:
      "A normalization technique that normalizes the inputs across the features for each individual example, rather than across the batch as in batch normalization. It computes mean and variance over all neurons in a layer for a single training example. Layer normalization works well with recurrent networks and transformers where batch size may vary or be small.",
    formula: "$\\hat{x}_i = \\frac{x_i - \\mu_L}{\\sqrt{\\sigma_L^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta$",
    relatedTerms: ["batch-normalization", "recurrent-neural-network", "transformer"],
    category: "deep-learning",
    tags: ["normalization", "technique", "training"],
  },
  {
    slug: "convolutional-neural-network",
    name: "Convolutional Neural Network",
    definition:
      "A specialized neural network architecture designed for processing grid-like data such as images. It uses convolutional layers that apply learnable filters to detect local patterns like edges, textures, and shapes, followed by pooling layers that reduce spatial dimensions. CNNs are the backbone of modern computer vision systems.",
    relatedTerms: ["convolution", "pooling", "feature-map", "kernel", "stride", "padding"],
    category: "deep-learning",
    tags: ["architecture", "vision", "spatial"],
  },
  {
    slug: "convolution",
    name: "Convolution",
    definition:
      "A mathematical operation in neural networks where a small learnable filter (kernel) slides across the input data, computing element-wise multiplications and summing the results at each position to produce a feature map. It enables the network to detect local patterns regardless of their position in the input. Convolutions are the core operation in CNNs.",
    formalDefinition:
      "For 2D input: $(f * g)(i,j) = \\sum_m \\sum_n f(m,n) \\cdot g(i-m, j-n)$, where $f$ is the input and $g$ is the kernel.",
    formula: "$(I * K)(i,j) = \\sum_m \\sum_n I(i+m, j+n) \\cdot K(m,n)$",
    relatedTerms: ["kernel", "feature-map", "stride", "padding", "convolutional-neural-network"],
    category: "deep-learning",
    tags: ["operation", "spatial", "filter"],
  },
  {
    slug: "pooling",
    name: "Pooling",
    definition:
      "A downsampling operation used in convolutional neural networks to reduce the spatial dimensions of feature maps while retaining the most important information. Pooling makes the network more computationally efficient and helps achieve a degree of translational invariance. The two most common types are max pooling and average pooling.",
    relatedTerms: ["max-pooling", "average-pooling", "convolutional-neural-network", "feature-map", "stride"],
    category: "deep-learning",
    tags: ["operation", "downsampling", "spatial"],
  },
  {
    slug: "max-pooling",
    name: "Max Pooling",
    definition:
      "A pooling operation that selects the maximum value from each patch of the feature map, keeping only the strongest activation in each region. It effectively downsamples the feature map while preserving the most prominent features. Max pooling is the most commonly used pooling operation in modern CNNs.",
    relatedTerms: ["pooling", "average-pooling", "convolutional-neural-network", "feature-map"],
    category: "deep-learning",
    tags: ["operation", "downsampling", "spatial"],
  },
  {
    slug: "average-pooling",
    name: "Average Pooling",
    definition:
      "A pooling operation that computes the average of all values within each patch of the feature map. Unlike max pooling which keeps only the strongest signal, average pooling preserves a smooth summary of the features. It is sometimes used in the final layers of a CNN to reduce the spatial dimensions to a single vector.",
    relatedTerms: ["pooling", "max-pooling", "convolutional-neural-network", "feature-map"],
    category: "deep-learning",
    tags: ["operation", "downsampling", "spatial"],
  },
  {
    slug: "stride",
    name: "Stride",
    definition:
      "The number of pixels by which a filter or pooling window moves across the input at each step. A stride of 1 means the filter moves one pixel at a time, producing a detailed output. A stride of 2 skips every other position, effectively halving the spatial dimensions. Larger strides reduce the output size and computation cost.",
    relatedTerms: ["convolution", "pooling", "padding", "kernel", "convolutional-neural-network"],
    category: "deep-learning",
    tags: ["hyperparameter", "spatial", "convolution"],
  },
  {
    slug: "padding",
    name: "Padding",
    definition:
      "The practice of adding extra pixels (usually zeros) around the border of the input before applying a convolution. Padding preserves the spatial dimensions of the output and ensures that edge pixels are processed as many times as interior pixels. 'Same' padding keeps dimensions unchanged while 'valid' padding uses no padding at all.",
    relatedTerms: ["convolution", "stride", "kernel", "convolutional-neural-network"],
    category: "deep-learning",
    tags: ["technique", "spatial", "convolution"],
  },
  {
    slug: "feature-map",
    name: "Feature Map",
    definition:
      "The output produced by applying a convolutional filter to the input data or a previous layer's output. Each feature map highlights the presence of a specific pattern (like an edge or texture) at different spatial locations. Deeper layers in a CNN produce feature maps that represent increasingly complex and abstract features.",
    relatedTerms: ["convolution", "kernel", "convolutional-neural-network", "filter"],
    category: "deep-learning",
    tags: ["concept", "spatial", "representation"],
  },
  {
    slug: "kernel",
    name: "Kernel",
    definition:
      "A small matrix of learnable weights used in the convolution operation to detect specific patterns in the input. Also called a filter, it slides across the input and computes dot products at each position. Different kernels learn to detect different features such as edges, corners, or textures. The kernel size is a key hyperparameter in CNN design.",
    relatedTerms: ["convolution", "filter", "feature-map", "convolutional-neural-network", "weight"],
    category: "deep-learning",
    tags: ["parameter", "spatial", "convolution"],
  },
  {
    slug: "filter",
    name: "Filter",
    definition:
      "A term used interchangeably with kernel in the context of convolutional neural networks. A filter is a set of learnable weights arranged in a small spatial grid that is convolved with the input to produce a feature map. In practice, a filter can span multiple input channels, with one kernel per channel, and their outputs are summed to produce a single feature map.",
    relatedTerms: ["kernel", "convolution", "feature-map", "convolutional-neural-network"],
    category: "deep-learning",
    tags: ["parameter", "spatial", "convolution"],
  },
  {
    slug: "recurrent-neural-network",
    name: "Recurrent Neural Network",
    definition:
      "A neural network architecture designed for sequential data where connections between neurons form directed cycles, allowing information to persist across time steps. At each step, the RNN receives the current input and the hidden state from the previous step, enabling it to maintain a form of memory. Basic RNNs struggle with long sequences due to the vanishing gradient problem.",
    relatedTerms: ["lstm", "gru", "vanishing-gradient", "sequence-modeling"],
    category: "deep-learning",
    tags: ["architecture", "sequential", "recurrent"],
  },
  {
    slug: "lstm",
    name: "LSTM",
    definition:
      "Long Short-Term Memory, a specialized recurrent neural network architecture designed to learn long-range dependencies in sequential data. It uses a gating mechanism with forget, input, and output gates that control the flow of information, allowing it to selectively remember or forget information over many time steps. LSTMs effectively solve the vanishing gradient problem that plagues basic RNNs.",
    relatedTerms: ["recurrent-neural-network", "gru", "vanishing-gradient", "tanh", "sigmoid"],
    category: "deep-learning",
    tags: ["architecture", "sequential", "gated", "memory"],
  },
  {
    slug: "gru",
    name: "GRU",
    definition:
      "Gated Recurrent Unit, a simplified variant of LSTM that combines the forget and input gates into a single update gate and merges the cell state with the hidden state. It achieves comparable performance to LSTM on many tasks with fewer parameters and faster training. GRUs are popular for applications where computational efficiency is important.",
    relatedTerms: ["lstm", "recurrent-neural-network", "vanishing-gradient"],
    category: "deep-learning",
    tags: ["architecture", "sequential", "gated", "efficient"],
  },
  {
    slug: "vanishing-gradient",
    name: "Vanishing Gradient",
    definition:
      "A problem that occurs during backpropagation in deep networks where gradients become exponentially smaller as they are propagated back through many layers. This causes early layers to learn extremely slowly or not at all, effectively preventing the network from learning long-range dependencies. Solutions include ReLU activation, LSTMs, residual connections, and careful initialization.",
    relatedTerms: ["exploding-gradient", "backpropagation", "sigmoid", "lstm", "relu", "residual-connection"],
    category: "deep-learning",
    tags: ["problem", "training", "gradient"],
  },
  {
    slug: "exploding-gradient",
    name: "Exploding Gradient",
    definition:
      "A problem during training where gradients grow exponentially large as they are propagated back through the network, causing extremely large weight updates that make training unstable. It is the opposite of the vanishing gradient problem and often manifests as NaN values during training. Gradient clipping, proper initialization, and batch normalization are common solutions.",
    relatedTerms: ["vanishing-gradient", "backpropagation", "batch-normalization", "weight"],
    category: "deep-learning",
    tags: ["problem", "training", "gradient", "instability"],
  },
  {
    slug: "residual-connection",
    name: "Residual Connection",
    definition:
      "A shortcut connection that adds the input of a layer directly to its output, allowing the network to learn residual mappings instead of the full transformation. Introduced in ResNet, residual connections enable the training of very deep networks (hundreds of layers) by providing gradient highways that mitigate the vanishing gradient problem.",
    formalDefinition:
      "Given input $x$ and a block of layers $F$, the output is $y = F(x) + x$. The network learns the residual $F(x) = y - x$.",
    formula: "$y = F(x) + x$",
    relatedTerms: ["skip-connection", "vanishing-gradient", "backpropagation"],
    category: "deep-learning",
    tags: ["technique", "architecture", "deep"],
  },
  {
    slug: "skip-connection",
    name: "Skip Connection",
    definition:
      "A connection in a neural network that bypasses one or more layers by feeding the output of an earlier layer directly to a later layer. Skip connections help preserve gradient flow during backpropagation and enable the training of deeper networks. Residual connections are the most common form, but skip connections can also concatenate features rather than adding them.",
    relatedTerms: ["residual-connection", "vanishing-gradient", "convolutional-neural-network"],
    category: "deep-learning",
    tags: ["technique", "architecture", "gradient-flow"],
  },
  {
    slug: "transfer-learning",
    name: "Transfer Learning",
    definition:
      "A technique where a model trained on one task (usually a large, general dataset) is reused as the starting point for a model on a different but related task. The pre-trained model's learned features are transferred, often requiring only fine-tuning on the new dataset. Transfer learning dramatically reduces training time and data requirements.",
    relatedTerms: ["fine-tuning", "pre-training", "feature-map", "convolutional-neural-network"],
    category: "deep-learning",
    tags: ["technique", "practical", "efficiency"],
  },
  {
    slug: "fine-tuning",
    name: "Fine-Tuning",
    definition:
      "The process of taking a pre-trained neural network and continuing to train it on a new, typically smaller dataset for a specific task. Usually the early layers (which capture general features) are frozen while the later layers are updated to adapt to the new task. Fine-tuning is a key step in transfer learning and is much faster than training from scratch.",
    relatedTerms: ["transfer-learning", "pre-training", "learning-rate", "epoch"],
    category: "deep-learning",
    tags: ["technique", "practical", "adaptation"],
  },
  {
    slug: "pre-training",
    name: "Pre-Training",
    definition:
      "The initial phase of training a neural network on a large, general-purpose dataset before it is adapted to a specific task through fine-tuning. The goal is to learn rich, transferable feature representations that capture general patterns in the data. Pre-training on large datasets like ImageNet or large text corpora has become a standard practice in modern deep learning.",
    relatedTerms: ["transfer-learning", "fine-tuning", "neural-network"],
    category: "deep-learning",
    tags: ["technique", "practical", "representation-learning"],
  },
  {
    slug: "generative-adversarial-network",
    name: "Generative Adversarial Network",
    definition:
      "An architecture consisting of two neural networks that compete against each other: a generator that creates synthetic data and a discriminator that tries to distinguish real data from generated data. Through this adversarial process, the generator learns to produce increasingly realistic outputs. GANs have achieved remarkable results in image generation, style transfer, and data augmentation.",
    relatedTerms: ["autoencoder", "latent-space", "neural-network"],
    category: "deep-learning",
    tags: ["architecture", "generative", "adversarial"],
  },
  {
    slug: "autoencoder",
    name: "Autoencoder",
    definition:
      "A neural network architecture that learns to compress input data into a lower-dimensional latent representation (encoding) and then reconstruct the original input from it (decoding). The network is trained to minimize the reconstruction error between input and output. Autoencoders are used for dimensionality reduction, denoising, anomaly detection, and as building blocks for generative models.",
    relatedTerms: ["variational-autoencoder", "latent-space", "neural-network"],
    category: "deep-learning",
    tags: ["architecture", "unsupervised", "compression"],
  },
  {
    slug: "variational-autoencoder",
    name: "Variational Autoencoder",
    definition:
      "A generative model that extends the autoencoder by learning a probabilistic mapping to the latent space rather than a deterministic one. Instead of encoding inputs to fixed points, it encodes them as probability distributions (typically Gaussian). This allows smooth interpolation in latent space and enables generation of new data by sampling from the learned distribution.",
    formalDefinition:
      "Optimizes the evidence lower bound (ELBO): $\\mathcal{L} = \\mathbb{E}_{q(z|x)}[\\log p(x|z)] - D_{KL}(q(z|x) \\| p(z))$, balancing reconstruction quality and latent space regularity.",
    formula: "$\\mathcal{L} = \\mathbb{E}_{q(z|x)}[\\log p(x|z)] - D_{KL}(q(z|x) \\| p(z))$",
    relatedTerms: ["autoencoder", "latent-space", "generative-adversarial-network"],
    category: "deep-learning",
    tags: ["architecture", "generative", "probabilistic"],
  },
  {
    slug: "latent-space",
    name: "Latent Space",
    definition:
      "A compressed, lower-dimensional representation of data learned by a model, where each point corresponds to a meaningful encoding of the input. In autoencoders and GANs, the latent space captures the essential features and variations of the data. Points that are close together in latent space typically correspond to similar inputs, enabling interpolation and generation.",
    relatedTerms: ["autoencoder", "variational-autoencoder", "generative-adversarial-network"],
    category: "deep-learning",
    tags: ["concept", "representation", "encoding"],
  },
  {
    slug: "tensor",
    name: "Tensor",
    definition:
      "A multi-dimensional array of numbers that serves as the fundamental data structure in deep learning frameworks like PyTorch and TensorFlow. A scalar is a 0-dimensional tensor, a vector is 1-dimensional, a matrix is 2-dimensional, and higher-dimensional tensors are used for batches of images, video, and other structured data. All neural network computations operate on tensors.",
    relatedTerms: ["neural-network", "gpu-acceleration", "weight"],
    category: "deep-learning",
    tags: ["fundamentals", "data-structure", "computation"],
  },
  {
    slug: "gpu-acceleration",
    name: "GPU Acceleration",
    definition:
      "The use of Graphics Processing Units to speed up the training and inference of deep learning models. GPUs can perform thousands of matrix operations in parallel, making them vastly more efficient than CPUs for the large tensor computations that neural networks require. GPU acceleration has been a key enabler of modern deep learning, reducing training times from weeks to hours.",
    relatedTerms: ["tensor", "batch-size", "neural-network"],
    category: "deep-learning",
    tags: ["hardware", "performance", "parallel-computing"],
  },
];
