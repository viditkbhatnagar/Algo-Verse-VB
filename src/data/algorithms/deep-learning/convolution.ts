import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const convolution: AlgorithmMetadata = {
  id: "convolution",
  name: "Convolution Operation",
  category: "deep-learning",
  subcategory: "Convolutional Neural Networks",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n^2 * k^2)",
    average: "O(n^2 * k^2)",
    worst: "O(n^2 * k^2)",
    note: "For an n x n input and k x k kernel, each of the (n-k+1)^2 output cells requires k^2 multiplications and additions.",
  },
  spaceComplexity: {
    best: "O((n-k+1)^2)",
    average: "O((n-k+1)^2)",
    worst: "O((n-k+1)^2)",
    note: "The output feature map has (n-k+1)^2 elements for valid convolution (no padding).",
  },
  description: `The convolution operation is the fundamental building block of Convolutional Neural Networks (CNNs). In the context of deep learning, a convolution involves sliding a small learned filter (called a kernel) across an input tensor and computing element-wise products at each position, followed by a sum. This produces a feature map that captures the presence of specific patterns (edges, textures, shapes) at each spatial location.

Unlike fully connected layers, convolution exploits two key principles: (1) Parameter sharing -- the same kernel is applied at every spatial location, dramatically reducing the number of learnable parameters. (2) Local connectivity -- each output neuron only depends on a small local region (receptive field) of the input. These properties make CNNs translation-equivariant: a pattern detected in one location can be recognized anywhere in the image.

In practice, a convolutional layer applies multiple kernels to produce multiple output channels (feature maps). The kernel dimensions are typically 1x1, 3x3, 5x5, or 7x7. Modern architectures like ResNet and EfficientNet stack many convolutional layers, where each layer learns increasingly abstract features. The convolution operation can be made more flexible with padding (to control output size) and stride (to control spatial downsampling). Depthwise separable convolutions, dilated convolutions, and grouped convolutions are popular variants that trade off expressiveness for efficiency.`,
  shortDescription:
    "Slides a kernel across an input matrix, computing element-wise products and sums to produce a feature map.",
  pseudocode: `procedure Convolution2D(input, kernel):
    inputH, inputW = dimensions(input)
    kernelH, kernelW = dimensions(kernel)
    outputH = inputH - kernelH + 1
    outputW = inputW - kernelW + 1
    output = zeros(outputH, outputW)

    for row = 0 to outputH - 1:
        for col = 0 to outputW - 1:
            sum = 0
            for kr = 0 to kernelH - 1:
                for kc = 0 to kernelW - 1:
                    sum += input[row + kr][col + kc] * kernel[kr][kc]
                end for
            end for
            output[row][col] = sum
        end for
    end for

    return output
end procedure`,
  implementations: {
    python: `import numpy as np

def convolve2d(input_matrix: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    """Perform 2D convolution (valid mode, no padding)."""
    input_h, input_w = input_matrix.shape
    kernel_h, kernel_w = kernel.shape
    output_h = input_h - kernel_h + 1
    output_w = input_w - kernel_w + 1

    output = np.zeros((output_h, output_w))

    for row in range(output_h):
        for col in range(output_w):
            patch = input_matrix[row:row + kernel_h, col:col + kernel_w]
            output[row, col] = np.sum(patch * kernel)

    return output


# Example usage
if __name__ == "__main__":
    inp = np.array([
        [1, 2, 3, 0, 1],
        [0, 1, 2, 3, 1],
        [1, 3, 0, 2, 1],
        [2, 1, 1, 0, 3],
        [0, 2, 3, 1, 2],
    ])
    kernel = np.array([
        [1, 0, -1],
        [1, 0, -1],
        [1, 0, -1],
    ])
    result = convolve2d(inp, kernel)
    print("Output feature map:\\n", result)`,
    javascript: `function convolve2d(input, kernel) {
  const inputH = input.length;
  const inputW = input[0].length;
  const kernelH = kernel.length;
  const kernelW = kernel[0].length;
  const outputH = inputH - kernelH + 1;
  const outputW = inputW - kernelW + 1;

  const output = Array.from({ length: outputH }, () =>
    Array(outputW).fill(0)
  );

  for (let row = 0; row < outputH; row++) {
    for (let col = 0; col < outputW; col++) {
      let sum = 0;
      for (let kr = 0; kr < kernelH; kr++) {
        for (let kc = 0; kc < kernelW; kc++) {
          sum += input[row + kr][col + kc] * kernel[kr][kc];
        }
      }
      output[row][col] = sum;
    }
  }

  return output;
}

// Example usage
const input = [
  [1, 2, 3, 0, 1],
  [0, 1, 2, 3, 1],
  [1, 3, 0, 2, 1],
  [2, 1, 1, 0, 3],
  [0, 2, 3, 1, 2],
];
const kernel = [
  [1, 0, -1],
  [1, 0, -1],
  [1, 0, -1],
];
console.log("Output:", convolve2d(input, kernel));`,
  },
  useCases: [
    "Image feature extraction: detecting edges, corners, textures, and shapes in visual data",
    "Object detection models like YOLO and SSD that locate and classify objects in images",
    "Medical imaging: identifying tumors, fractures, and anomalies in CT scans and X-rays",
    "Audio processing: applying 1D convolutions to spectrograms for speech recognition",
  ],
  relatedAlgorithms: [
    "padding",
    "stride",
    "pooling",
    "cnn-architecture",
  ],
  glossaryTerms: [
    "convolution",
    "kernel",
    "feature map",
    "receptive field",
    "parameter sharing",
    "stride",
    "padding",
  ],
  tags: [
    "deep-learning",
    "cnn",
    "convolution",
    "feature-extraction",
    "computer-vision",
    "intermediate",
  ],
};
