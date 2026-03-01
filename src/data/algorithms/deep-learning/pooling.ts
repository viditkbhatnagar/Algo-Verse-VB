import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const pooling: AlgorithmMetadata = {
  id: "pooling",
  name: "Pooling",
  category: "deep-learning",
  subcategory: "Convolutional Neural Networks",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n^2)",
    average: "O(n^2)",
    worst: "O(n^2)",
    note: "Each output cell requires examining p^2 values in the pooling window. Total: (n/p)^2 * p^2 = n^2.",
  },
  spaceComplexity: {
    best: "O((n/p)^2)",
    average: "O((n/p)^2)",
    worst: "O((n/p)^2)",
    note: "Output feature map is (n/p) x (n/p) for pool size p with stride p.",
  },
  description: `Pooling (also called subsampling or downsampling) is a key operation in convolutional neural networks that progressively reduces the spatial dimensions of feature maps. It operates independently on each channel by sliding a window across the feature map and aggregating values within each window into a single output value. The two most common variants are max pooling, which takes the maximum value in each window, and average pooling, which computes the mean.

Max pooling is the dominant choice in most CNN architectures because it preserves the strongest activations (most prominent features) while discarding weaker ones. This provides a degree of translation invariance: small shifts in the input produce the same max value as long as the maximum remains within the pooling window. Average pooling computes a smoother, less aggressive downsampling and is sometimes used in the final layers of a network (global average pooling) to replace fully connected layers, as popularized by GoogLeNet/Inception and ResNet.

Pooling serves multiple purposes: (1) Dimensionality reduction: each pooling layer halves the spatial dimensions (with 2x2 pooling), reducing computation by 4x in subsequent layers. (2) Translation invariance: small spatial shifts in the input do not change the output significantly. (3) Overfitting prevention: by reducing the number of parameters, pooling acts as a regularizer. (4) Increasing receptive field: pooling allows deeper layers to "see" larger regions of the original input. However, pooling discards spatial information, which can be problematic for tasks requiring precise localization (e.g., segmentation). Some modern architectures replace pooling with strided convolutions for a learnable downsampling alternative.`,
  shortDescription:
    "Reduces the spatial dimensions of a feature map by taking the max or average value within each pooling window.",
  pseudocode: `procedure MaxPooling(input, poolSize, stride):
    n = size(input)
    outputSize = floor(n / stride)
    output = zeros(outputSize, outputSize)

    for outR = 0 to outputSize - 1:
        for outC = 0 to outputSize - 1:
            maxVal = -infinity
            for pr = 0 to poolSize - 1:
                for pc = 0 to poolSize - 1:
                    r = outR * stride + pr
                    c = outC * stride + pc
                    maxVal = max(maxVal, input[r][c])
                end for
            end for
            output[outR][outC] = maxVal
        end for
    end for
    return output
end procedure

procedure AvgPooling(input, poolSize, stride):
    // Same structure but compute mean instead of max
    output[outR][outC] = sum / (poolSize * poolSize)
end procedure`,
  implementations: {
    python: `import numpy as np

def max_pooling(input_matrix: np.ndarray, pool_size: int = 2,
                stride: int = 2) -> np.ndarray:
    """Max pooling on a 2D feature map."""
    n = input_matrix.shape[0]
    output_size = n // stride
    output = np.zeros((output_size, output_size))

    for r in range(output_size):
        for c in range(output_size):
            region = input_matrix[
                r*stride : r*stride + pool_size,
                c*stride : c*stride + pool_size
            ]
            output[r, c] = np.max(region)
    return output

def avg_pooling(input_matrix: np.ndarray, pool_size: int = 2,
                stride: int = 2) -> np.ndarray:
    """Average pooling on a 2D feature map."""
    n = input_matrix.shape[0]
    output_size = n // stride
    output = np.zeros((output_size, output_size))

    for r in range(output_size):
        for c in range(output_size):
            region = input_matrix[
                r*stride : r*stride + pool_size,
                c*stride : c*stride + pool_size
            ]
            output[r, c] = np.mean(region)
    return output

# Example
if __name__ == "__main__":
    feature_map = np.random.randint(0, 20, (6, 6))
    print("Input:\\n", feature_map)
    print("Max pool:\\n", max_pooling(feature_map))
    print("Avg pool:\\n", avg_pooling(feature_map))`,
    javascript: `function maxPooling(input, poolSize = 2, stride = 2) {
  const n = input.length;
  const outputSize = Math.floor(n / stride);
  const output = Array.from({ length: outputSize }, () =>
    Array(outputSize).fill(0)
  );

  for (let r = 0; r < outputSize; r++) {
    for (let c = 0; c < outputSize; c++) {
      let maxVal = -Infinity;
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          maxVal = Math.max(maxVal, input[r * stride + pr][c * stride + pc]);
        }
      }
      output[r][c] = maxVal;
    }
  }
  return output;
}

function avgPooling(input, poolSize = 2, stride = 2) {
  const n = input.length;
  const outputSize = Math.floor(n / stride);
  const output = Array.from({ length: outputSize }, () =>
    Array(outputSize).fill(0)
  );

  for (let r = 0; r < outputSize; r++) {
    for (let c = 0; c < outputSize; c++) {
      let sum = 0;
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          sum += input[r * stride + pr][c * stride + pc];
        }
      }
      output[r][c] = sum / (poolSize * poolSize);
    }
  }
  return output;
}

// Example
const featureMap = Array.from({ length: 6 }, () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 20))
);
console.log("Max pool:", maxPooling(featureMap));
console.log("Avg pool:", avgPooling(featureMap));`,
  },
  useCases: [
    "Dimensionality reduction in CNNs to decrease computation in deeper layers",
    "Translation invariance for image classification where exact object position is less important",
    "Global average pooling as a final layer to convert feature maps to class predictions (GoogLeNet, ResNet)",
    "Feature pyramid networks for multi-scale object detection using pooled features at different resolutions",
  ],
  relatedAlgorithms: [
    "convolution",
    "stride",
    "padding",
    "cnn-architecture",
  ],
  glossaryTerms: [
    "max pooling",
    "average pooling",
    "global average pooling",
    "downsampling",
    "translation invariance",
    "feature map",
  ],
  tags: [
    "deep-learning",
    "cnn",
    "pooling",
    "downsampling",
    "beginner",
  ],
};
