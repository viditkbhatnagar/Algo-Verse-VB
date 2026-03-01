import type {
  VisualizationStep,
  ConvolutionStepData,
} from "@/lib/visualization/types";

interface PaddingParams {
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateInput(rand: () => number): number[][] {
  const size = 5;
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rand() * 9) + 1)
  );
}

function padInput(input: number[][], padSize: number): number[][] {
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

export function generatePaddingSteps(params: PaddingParams): VisualizationStep[] {
  const { seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const input = generateInput(rand);
  const kernelSize = 3;
  const kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];

  // -- Phase 1: Valid padding (no padding) --
  const validOutputSize = input.length - kernelSize + 1;
  const validOutput = Array.from({ length: validOutputSize }, () =>
    Array(validOutputSize).fill(0)
  );

  steps.push({
    id: stepId++,
    description: `Original ${input.length}x${input.length} input with a ${kernelSize}x${kernelSize} kernel. First, let's see "valid" padding (no padding).`,
    action: "convolve",
    highlights: [],
    data: {
      input,
      kernel,
      output: validOutput.map((r) => [...r]),
      padding: 0,
      stride: 1,
    } as ConvolutionStepData,
  });

  // Compute valid convolution
  for (let row = 0; row < validOutputSize; row++) {
    for (let col = 0; col < validOutputSize; col++) {
      let sum = 0;
      for (let kr = 0; kr < kernelSize; kr++) {
        for (let kc = 0; kc < kernelSize; kc++) {
          sum += input[row + kr][col + kc] * kernel[kr][kc];
        }
      }
      validOutput[row][col] = sum;
    }
  }

  // Show a couple of valid convolution steps
  steps.push({
    id: stepId++,
    description: `Valid padding: kernel at (0,0). No zeros added around the input. Output is smaller: ${validOutputSize}x${validOutputSize}.`,
    action: "convolve",
    highlights: [],
    data: {
      input,
      kernel,
      output: validOutput.map((r) => r.map(() => 0)),
      kernelPosition: [0, 0] as [number, number],
      currentOutputCell: [0, 0] as [number, number],
      padding: 0,
      stride: 1,
    } as ConvolutionStepData,
  });

  steps.push({
    id: stepId++,
    description: `Valid convolution complete. Output is ${validOutputSize}x${validOutputSize} -- smaller than the ${input.length}x${input.length} input. Information at borders is lost.`,
    action: "convolve",
    highlights: [],
    data: {
      input,
      kernel,
      output: validOutput.map((r) => [...r]),
      padding: 0,
      stride: 1,
    } as ConvolutionStepData,
  });

  // -- Phase 2: Same padding (pad = 1) --
  const padSize = 1;
  const paddedInput = padInput(input, padSize);
  const sameOutputSize = input.length; // same as original input
  const sameOutput = Array.from({ length: sameOutputSize }, () =>
    Array(sameOutputSize).fill(0)
  );

  steps.push({
    id: stepId++,
    description: `Now "same" padding: add ${padSize} row/col of zeros around the input. Padded input becomes ${paddedInput.length}x${paddedInput[0].length}.`,
    action: "convolve",
    highlights: [],
    data: {
      input: paddedInput,
      kernel,
      output: sameOutput.map((r) => [...r]),
      padding: padSize,
      stride: 1,
      computationDetail: "Zeros are added around the border of the input",
    } as ConvolutionStepData,
  });

  steps.push({
    id: stepId++,
    description: `Place kernel at (0,0) on the padded input. The kernel now overlaps the zero-padded region.`,
    action: "convolve",
    highlights: [],
    data: {
      input: paddedInput,
      kernel,
      output: sameOutput.map((r) => [...r]),
      kernelPosition: [0, 0] as [number, number],
      currentOutputCell: [0, 0] as [number, number],
      padding: padSize,
      stride: 1,
    } as ConvolutionStepData,
  });

  // Compute a few same-padding steps
  for (let row = 0; row < sameOutputSize; row++) {
    for (let col = 0; col < sameOutputSize; col++) {
      let sum = 0;
      for (let kr = 0; kr < kernelSize; kr++) {
        for (let kc = 0; kc < kernelSize; kc++) {
          sum += paddedInput[row + kr][col + kc] * kernel[kr][kc];
        }
      }
      sameOutput[row][col] = sum;
    }
  }

  // Show intermediate step
  const midRow = Math.floor(sameOutputSize / 2);
  const midCol = Math.floor(sameOutputSize / 2);
  const partialOutput = sameOutput.map((r, ri) =>
    r.map((v, ci) => (ri < midRow || (ri === midRow && ci <= midCol) ? v : 0))
  );

  steps.push({
    id: stepId++,
    description: `Kernel sliding across padded input. At position (${midRow}, ${midCol}), the center of the input.`,
    action: "convolve",
    highlights: [],
    data: {
      input: paddedInput,
      kernel,
      output: partialOutput,
      kernelPosition: [midRow, midCol] as [number, number],
      currentOutputCell: [midRow, midCol] as [number, number],
      padding: padSize,
      stride: 1,
    } as ConvolutionStepData,
  });

  steps.push({
    id: stepId++,
    description: `Same padding complete! Output is ${sameOutputSize}x${sameOutputSize} -- same size as the original input. Padding preserves spatial dimensions.`,
    action: "complete",
    highlights: [],
    data: {
      input: paddedInput,
      kernel,
      output: sameOutput.map((r) => [...r]),
      padding: padSize,
      stride: 1,
    } as ConvolutionStepData,
  });

  steps.push({
    id: stepId++,
    description: `Summary: Valid padding shrinks output (${validOutputSize}x${validOutputSize}). Same padding preserves size (${sameOutputSize}x${sameOutputSize}). "Same" padding is the most common choice in modern CNNs.`,
    action: "complete",
    highlights: [],
    data: {
      input: paddedInput,
      kernel,
      output: sameOutput.map((r) => [...r]),
      padding: padSize,
      stride: 1,
      computationDetail: `Valid: ${validOutputSize}x${validOutputSize} | Same: ${sameOutputSize}x${sameOutputSize}`,
    } as ConvolutionStepData,
  });

  return steps;
}
