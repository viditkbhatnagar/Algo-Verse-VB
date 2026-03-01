import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const cnnArchitecture: AlgorithmMetadata = {
  id: "cnn-architecture",
  name: "CNN Architecture",
  category: "deep-learning",
  subcategory: "Convolutional Neural Networks",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(L * n^2 * k^2 * C)",
    average: "O(L * n^2 * k^2 * C)",
    worst: "O(L * n^2 * k^2 * C)",
    note: "For L convolutional layers, each with n x n spatial dims, k x k kernels, and C channels. Dense layers add O(F^2) where F is the feature vector size.",
  },
  spaceComplexity: {
    best: "O(sum of feature maps + parameters)",
    average: "O(sum of feature maps + parameters)",
    worst: "O(sum of feature maps + parameters)",
    note: "Memory for all intermediate feature maps (needed for backprop) plus all learnable weights and biases.",
  },
  description: `A Convolutional Neural Network (CNN) is a specialized deep learning architecture designed primarily for processing grid-structured data such as images. A typical CNN consists of a sequence of convolutional layers, activation functions (typically ReLU), and pooling layers, followed by one or more fully connected (dense) layers. The full pipeline is: Input -> [Conv -> ReLU -> Pool]* -> Flatten -> Dense -> Output.

The convolutional layers act as feature extractors. Early layers learn simple features like edges and color gradients, while deeper layers combine these into increasingly abstract representations like textures, parts, and eventually whole objects. This hierarchical feature learning is a key strength of CNNs. Each convolutional layer applies multiple learned kernels to produce multiple feature maps (channels), allowing the network to detect various patterns simultaneously.

After the convolutional feature extraction stages, the feature maps are flattened into a 1D vector and passed through fully connected layers that act as a classifier. The final layer typically uses softmax activation for classification tasks. Landmark CNN architectures include LeNet-5 (1998, handwritten digit recognition), AlexNet (2012, ImageNet breakthrough), VGGNet (2014, deeper networks with 3x3 kernels), GoogLeNet/Inception (2014, parallel convolution paths), ResNet (2015, residual connections enabling very deep networks), and EfficientNet (2019, compound scaling). Modern CNNs are used for image classification, object detection, semantic segmentation, medical imaging, autonomous driving, and many other visual tasks.`,
  shortDescription:
    "A deep learning architecture that stacks convolution, ReLU, and pooling layers for hierarchical feature extraction and classification.",
  pseudocode: `procedure CNN_Forward(image):
    // Feature extraction
    x = image

    // Block 1
    x = Conv2D(x, filters=32, kernel=3x3)
    x = ReLU(x)                    // max(0, x) element-wise
    x = MaxPool2D(x, pool=2x2)     // halve spatial dims

    // Block 2
    x = Conv2D(x, filters=64, kernel=3x3)
    x = ReLU(x)
    x = MaxPool2D(x, pool=2x2)

    // Classification head
    x = Flatten(x)                 // 2D -> 1D vector
    x = Dense(x, units=128)        // fully connected
    x = ReLU(x)
    logits = Dense(x, units=numClasses)
    probs = Softmax(logits)

    return probs
end procedure`,
  implementations: {
    python: `import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    """A basic CNN for image classification."""

    def __init__(self, num_classes: int = 10):
        super().__init__()
        self.features = nn.Sequential(
            # Block 1: Conv -> ReLU -> Pool
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            # Block 2: Conv -> ReLU -> Pool
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 128),
            nn.ReLU(),
            nn.Linear(128, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)     # [B, 64, 8, 8]
        x = self.classifier(x)   # [B, num_classes]
        return x

# Example
if __name__ == "__main__":
    model = SimpleCNN(num_classes=10)
    dummy_input = torch.randn(1, 3, 32, 32)  # batch of 1, 3 channels, 32x32
    output = model(dummy_input)
    print(f"Output shape: {output.shape}")  # [1, 10]
    print(f"Total params: {sum(p.numel() for p in model.parameters()):,}")`,
    javascript: `// Simplified CNN forward pass (conceptual, no autograd)
class SimpleCNN {
  constructor(numClasses = 10) {
    this.numClasses = numClasses;
    // In practice, weights would be initialized and trained
    this.layers = [
      { type: "conv", filters: 32, kernelSize: 3 },
      { type: "relu" },
      { type: "maxpool", poolSize: 2 },
      { type: "conv", filters: 64, kernelSize: 3 },
      { type: "relu" },
      { type: "maxpool", poolSize: 2 },
      { type: "flatten" },
      { type: "dense", units: 128 },
      { type: "relu" },
      { type: "dense", units: numClasses },
    ];
  }

  forward(input) {
    let x = input;
    const activations = [{ layer: "input", shape: shapeOf(x) }];

    for (const layer of this.layers) {
      switch (layer.type) {
        case "conv":
          // Simulated: spatial dims preserved (same padding)
          x = applyConv(x, layer.filters, layer.kernelSize);
          break;
        case "relu":
          x = applyReLU(x);
          break;
        case "maxpool":
          x = applyMaxPool(x, layer.poolSize);
          break;
        case "flatten":
          x = flatten(x);
          break;
        case "dense":
          x = applyDense(x, layer.units);
          break;
      }
      activations.push({ layer: layer.type, shape: shapeOf(x) });
    }

    return { output: softmax(x), activations };
  }
}

function shapeOf(x) { return Array.isArray(x) ? [x.length] : [1]; }
function softmax(x) {
  const max = Math.max(...x);
  const exps = x.map(v => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b);
  return exps.map(v => v / sum);
}

// Placeholder functions for actual implementations
function applyConv(x, filters, k) { return x; }
function applyReLU(x) { return Array.isArray(x) ? x.map(v => Math.max(0, v)) : x; }
function applyMaxPool(x, p) { return x; }
function flatten(x) { return Array.isArray(x) ? x.flat(Infinity) : [x]; }
function applyDense(x, units) { return Array(units).fill(0).map(() => Math.random()); }

console.log("CNN architecture: Input->Conv->ReLU->Pool->Conv->ReLU->Pool->Flatten->Dense->Output");`,
  },
  useCases: [
    "Image classification (ImageNet, CIFAR-10): identifying objects in photographs",
    "Object detection (YOLO, Faster R-CNN): locating and classifying multiple objects in a scene",
    "Medical imaging: detecting tumors in CT/MRI scans, diabetic retinopathy in eye scans",
    "Autonomous driving: processing camera feeds for lane detection, pedestrian recognition, and sign reading",
  ],
  relatedAlgorithms: [
    "convolution",
    "pooling",
    "padding",
    "stride",
  ],
  glossaryTerms: [
    "convolutional neural network",
    "feature map",
    "receptive field",
    "relu",
    "max pooling",
    "softmax",
    "flatten",
    "fully connected layer",
  ],
  tags: [
    "deep-learning",
    "cnn",
    "architecture",
    "image-classification",
    "computer-vision",
    "advanced",
  ],
};
