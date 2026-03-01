import type {
  VisualizationStep,
  ConvolutionStepData,
} from "@/lib/visualization/types";

interface ConvolutionParams {
  kernelSize: number;
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

function generateKernel(size: number, rand: () => number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rand() * 3) - 1)
  );
}

export function generateConvolutionSteps(params: ConvolutionParams): VisualizationStep[] {
  const { kernelSize, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const input = generateInput(rand);
  const kernel = generateKernel(kernelSize, rand);
  const inputSize = input.length;
  const outputSize = inputSize - kernelSize + 1;

  // Initialize empty output
  const emptyOutput = Array.from({ length: outputSize }, () =>
    Array.from({ length: outputSize }, () => 0)
  );

  // Step 1: Show input and kernel
  steps.push({
    id: stepId++,
    description: `Input: ${inputSize}x${inputSize} matrix. Kernel: ${kernelSize}x${kernelSize}. Output will be ${outputSize}x${outputSize} (valid convolution, no padding, stride=1).`,
    action: "convolve",
    highlights: [],
    data: {
      input,
      kernel,
      output: emptyOutput.map((r) => [...r]),
      padding: 0,
      stride: 1,
    } as ConvolutionStepData,
  });

  // Step 2: Place kernel at starting position
  steps.push({
    id: stepId++,
    description: `Place the ${kernelSize}x${kernelSize} kernel at position (0, 0) of the input. The kernel slides across the input to compute each output value.`,
    action: "convolve",
    highlights: [],
    data: {
      input,
      kernel,
      output: emptyOutput.map((r) => [...r]),
      kernelPosition: [0, 0] as [number, number],
      currentOutputCell: [0, 0] as [number, number],
      padding: 0,
      stride: 1,
    } as ConvolutionStepData,
  });

  // Slide kernel across the input
  const output = emptyOutput.map((r) => [...r]);

  for (let row = 0; row < outputSize; row++) {
    for (let col = 0; col < outputSize; col++) {
      // Compute the convolution value
      let sum = 0;
      const terms: string[] = [];
      for (let kr = 0; kr < kernelSize; kr++) {
        for (let kc = 0; kc < kernelSize; kc++) {
          const inputVal = input[row + kr][col + kc];
          const kernelVal = kernel[kr][kc];
          sum += inputVal * kernelVal;
          terms.push(`${inputVal}*${kernelVal >= 0 ? kernelVal : `(${kernelVal})`}`);
        }
      }
      output[row][col] = sum;

      const detail = terms.length <= 9
        ? `${terms.join(" + ")} = ${sum}`
        : `Sum of ${terms.length} products = ${sum}`;

      steps.push({
        id: stepId++,
        description: `Kernel at (${row}, ${col}): element-wise multiply and sum. Output[${row}][${col}] = ${sum}.`,
        action: "convolve",
        highlights: [],
        data: {
          input,
          kernel,
          output: output.map((r) => [...r]),
          kernelPosition: [row, col] as [number, number],
          currentOutputCell: [row, col] as [number, number],
          computationDetail: detail,
          padding: 0,
          stride: 1,
        } as ConvolutionStepData,
      });
    }
  }

  // Final step
  steps.push({
    id: stepId++,
    description: `Convolution complete! The ${kernelSize}x${kernelSize} kernel produced a ${outputSize}x${outputSize} output feature map. Each output value is the dot product of the kernel with the corresponding input patch.`,
    action: "complete",
    highlights: [],
    data: {
      input,
      kernel,
      output: output.map((r) => [...r]),
      padding: 0,
      stride: 1,
    } as ConvolutionStepData,
  });

  return steps;
}
