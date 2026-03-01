import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const stride: AlgorithmMetadata = {
  id: "stride",
  name: "Stride",
  category: "deep-learning",
  subcategory: "Convolutional Neural Networks",
  difficulty: "beginner",
  timeComplexity: {
    best: "O((n/s)^2 * k^2)",
    average: "O((n/s)^2 * k^2)",
    worst: "O((n/s)^2 * k^2)",
    note: "With stride s, the kernel visits (n-k)/s + 1 positions per dimension, each requiring k^2 operations.",
  },
  spaceComplexity: {
    best: "O(((n-k)/s + 1)^2)",
    average: "O(((n-k)/s + 1)^2)",
    worst: "O(((n-k)/s + 1)^2)",
    note: "Output feature map size decreases quadratically with stride.",
  },
  description: `Stride controls how many positions the convolution kernel moves between each computation. A stride of 1 means the kernel moves one cell at a time, visiting every possible position. A stride of 2 means the kernel jumps two cells, effectively skipping every other position and producing an output roughly half the size in each dimension.

Stride is a powerful mechanism for spatial downsampling. With stride > 1, the output feature map is smaller than the input, reducing computational cost and memory usage in subsequent layers. The output size formula is: output_size = floor((input_size - kernel_size) / stride) + 1. For example, a 32x32 input with a 3x3 kernel at stride 2 produces a 15x15 output, while stride 1 would produce a 30x30 output.

In modern CNN architectures, strided convolutions are increasingly preferred over pooling for downsampling because they are learnable. While max pooling uses a fixed operation to reduce spatial dimensions, strided convolutions allow the network to learn the best way to downsample. Networks like the all-convolutional net and various GAN architectures (DCGAN) replace pooling layers entirely with strided convolutions for downsampling and transposed convolutions (fractionally strided convolutions) for upsampling. The choice of stride involves a trade-off: larger strides reduce computation but may lose fine-grained spatial information that is important for tasks like segmentation or detection.`,
  shortDescription:
    "Controls how many positions the convolution kernel moves between computations, affecting output size.",
  pseudocode: `procedure StridedConvolution(input, kernel, stride):
    n = size(input)
    k = size(kernel)
    outputSize = floor((n - k) / stride) + 1
    output = zeros(outputSize, outputSize)

    outRow = 0
    for row = 0 to n - k step stride:
        outCol = 0
        for col = 0 to n - k step stride:
            sum = 0
            for kr = 0 to k - 1:
                for kc = 0 to k - 1:
                    sum += input[row + kr][col + kc] * kernel[kr][kc]
                end for
            end for
            output[outRow][outCol] = sum
            outCol += 1
        end for
        outRow += 1
    end for

    return output
end procedure`,
  implementations: {
    python: `import numpy as np

def strided_convolution(input_matrix: np.ndarray, kernel: np.ndarray,
                         stride: int = 1) -> np.ndarray:
    """2D convolution with configurable stride."""
    n = input_matrix.shape[0]
    k = kernel.shape[0]
    output_size = (n - k) // stride + 1
    output = np.zeros((output_size, output_size))

    for out_r in range(output_size):
        for out_c in range(output_size):
            r = out_r * stride
            c = out_c * stride
            patch = input_matrix[r:r+k, c:c+k]
            output[out_r, out_c] = np.sum(patch * kernel)

    return output

# Example
if __name__ == "__main__":
    inp = np.random.randint(1, 10, (6, 6))
    kernel = np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]])

    for s in [1, 2, 3]:
        out = strided_convolution(inp, kernel, stride=s)
        print(f"Stride {s}: output shape = {out.shape}")`,
    javascript: `function stridedConvolution(input, kernel, stride = 1) {
  const n = input.length;
  const k = kernel.length;
  const outputSize = Math.floor((n - k) / stride) + 1;
  const output = Array.from({ length: outputSize }, () =>
    Array(outputSize).fill(0)
  );

  for (let outR = 0; outR < outputSize; outR++) {
    for (let outC = 0; outC < outputSize; outC++) {
      const r = outR * stride;
      const c = outC * stride;
      let sum = 0;
      for (let kr = 0; kr < k; kr++) {
        for (let kc = 0; kc < k; kc++) {
          sum += input[r + kr][c + kc] * kernel[kr][kc];
        }
      }
      output[outR][outC] = sum;
    }
  }

  return output;
}

// Example
const input = Array.from({ length: 6 }, () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
);
const kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];

[1, 2, 3].forEach((s) => {
  const out = stridedConvolution(input, kernel, s);
  console.log(\`Stride \${s}: output size = \${out.length}x\${out[0].length}\`);
});`,
  },
  useCases: [
    "Spatial downsampling in CNN feature extractors as a learnable alternative to pooling",
    "DCGAN and other generative models that use strided convolutions for encoding and transposed convolutions for decoding",
    "Real-time object detection networks that use large strides in early layers to quickly reduce spatial dimensions",
    "Mobile networks (MobileNet, EfficientNet) where stride-2 convolutions balance accuracy and inference speed",
  ],
  relatedAlgorithms: [
    "convolution",
    "padding",
    "pooling",
    "cnn-architecture",
  ],
  glossaryTerms: [
    "stride",
    "downsampling",
    "feature map",
    "transposed convolution",
    "spatial resolution",
  ],
  tags: [
    "deep-learning",
    "cnn",
    "stride",
    "downsampling",
    "beginner",
  ],
};
