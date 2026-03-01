import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const padding: AlgorithmMetadata = {
  id: "padding",
  name: "Padding",
  category: "deep-learning",
  subcategory: "Convolutional Neural Networks",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n^2)",
    average: "O(n^2)",
    worst: "O(n^2)",
    note: "Padding itself is O((n + 2p)^2) to create the padded matrix. The subsequent convolution dominates total time.",
  },
  spaceComplexity: {
    best: "O((n + 2p)^2)",
    average: "O((n + 2p)^2)",
    worst: "O((n + 2p)^2)",
    note: "Extra memory for the padded input. In practice, frameworks pad on-the-fly without full materialization.",
  },
  description: `Padding is a technique used in convolutional neural networks to control the spatial dimensions of the output feature map. When a kernel slides across an input, the output is smaller than the input because the kernel cannot be centered on border pixels. Padding adds extra values (typically zeros) around the border of the input to allow the kernel to fully overlap edge regions.

There are two main types of padding. "Valid" padding means no padding at all: the kernel only visits positions where it fully overlaps the input, producing a smaller output of size (n - k + 1) for an n x n input with a k x k kernel. "Same" padding adds enough zeros so that the output has the same spatial dimensions as the input. For a k x k kernel with stride 1, same padding requires p = floor(k/2) rows and columns of zeros on each side.

Padding is crucial for several reasons. First, without padding, spatial dimensions shrink with every convolutional layer, severely limiting network depth. A 32x32 input with repeated 3x3 valid convolutions would shrink to 1x1 after only 15 layers. Second, border pixels participate in fewer kernel computations than center pixels, causing information loss at the edges. Padding ensures all pixels contribute equally. Third, padding enables flexible architecture design -- modern networks like ResNet and U-Net rely on same padding to maintain spatial resolution through residual connections and skip connections.`,
  shortDescription:
    "Adds zeros around an input matrix to control the output size of convolution operations.",
  pseudocode: `procedure PadInput(input, padSize):
    h, w = dimensions(input)
    paddedH = h + 2 * padSize
    paddedW = w + 2 * padSize
    padded = zeros(paddedH, paddedW)

    for row = 0 to h - 1:
        for col = 0 to w - 1:
            padded[row + padSize][col + padSize] = input[row][col]
        end for
    end for

    return padded
end procedure

// Valid convolution: no padding
// Output size = (n - k + 1) x (n - k + 1)

// Same convolution: pad = floor(k / 2)
// Output size = n x n (preserves spatial dims)`,
  implementations: {
    python: `import numpy as np

def pad_input(input_matrix: np.ndarray, pad_size: int) -> np.ndarray:
    """Pad a 2D input matrix with zeros."""
    return np.pad(input_matrix, pad_size, mode='constant', constant_values=0)

def convolve_with_padding(input_matrix: np.ndarray, kernel: np.ndarray,
                           padding_type: str = "same") -> np.ndarray:
    """Convolve with specified padding type."""
    k = kernel.shape[0]

    if padding_type == "valid":
        padded = input_matrix
    elif padding_type == "same":
        pad_size = k // 2
        padded = pad_input(input_matrix, pad_size)
    else:
        raise ValueError(f"Unknown padding type: {padding_type}")

    h, w = padded.shape
    out_h = h - k + 1
    out_w = w - k + 1
    output = np.zeros((out_h, out_w))

    for r in range(out_h):
        for c in range(out_w):
            output[r, c] = np.sum(padded[r:r+k, c:c+k] * kernel)

    return output

# Example
if __name__ == "__main__":
    inp = np.array([[1,2,3],[4,5,6],[7,8,9]])
    kernel = np.array([[1,0],[-1,0]])

    valid_out = convolve_with_padding(inp, kernel, "valid")
    same_out = convolve_with_padding(inp, kernel, "same")

    print(f"Valid output shape: {valid_out.shape}")
    print(f"Same output shape: {same_out.shape}")`,
    javascript: `function padInput(input, padSize) {
  const h = input.length;
  const w = input[0].length;
  const newH = h + 2 * padSize;
  const newW = w + 2 * padSize;
  const padded = Array.from({ length: newH }, () => Array(newW).fill(0));

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      padded[r + padSize][c + padSize] = input[r][c];
    }
  }
  return padded;
}

function convolveWithPadding(input, kernel, paddingType = "same") {
  const k = kernel.length;
  let padded;

  if (paddingType === "valid") {
    padded = input;
  } else {
    const padSize = Math.floor(k / 2);
    padded = padInput(input, padSize);
  }

  const h = padded.length;
  const w = padded[0].length;
  const outH = h - k + 1;
  const outW = w - k + 1;
  const output = Array.from({ length: outH }, () => Array(outW).fill(0));

  for (let r = 0; r < outH; r++) {
    for (let c = 0; c < outW; c++) {
      let sum = 0;
      for (let kr = 0; kr < k; kr++) {
        for (let kc = 0; kc < k; kc++) {
          sum += padded[r + kr][c + kc] * kernel[kr][kc];
        }
      }
      output[r][c] = sum;
    }
  }

  return output;
}

// Example
const inp = [[1,2,3],[4,5,6],[7,8,9]];
const kernel = [[1,0],[-1,0]];
console.log("Valid:", convolveWithPadding(inp, kernel, "valid"));
console.log("Same:", convolveWithPadding(inp, kernel, "same"));`,
  },
  useCases: [
    "Preserving spatial dimensions through deep networks with many convolutional layers",
    "Ensuring border pixels contribute equally to learned feature maps in image classification",
    "Enabling residual connections in ResNet where input and output must have matching dimensions",
    "U-Net architectures for medical image segmentation where spatial precision at borders is critical",
  ],
  relatedAlgorithms: [
    "convolution",
    "stride",
    "pooling",
    "cnn-architecture",
  ],
  glossaryTerms: [
    "padding",
    "valid convolution",
    "same convolution",
    "zero padding",
    "feature map",
    "receptive field",
  ],
  tags: [
    "deep-learning",
    "cnn",
    "padding",
    "spatial-dimensions",
    "beginner",
  ],
};
