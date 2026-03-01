import type {
  VisualizationStep,
  ConvolutionStepData,
} from "@/lib/visualization/types";

interface StrideParams {
  stride: number;
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
  const size = 6;
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rand() * 9) + 1)
  );
}

export function generateStrideSteps(params: StrideParams): VisualizationStep[] {
  const { stride, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const input = generateInput(rand);
  const kernelSize = 3;
  const kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
  const inputSize = input.length;
  const outputSize = Math.floor((inputSize - kernelSize) / stride) + 1;

  const emptyOutput = Array.from({ length: outputSize }, () =>
    Array(outputSize).fill(0)
  );

  // Step 1: Introduce the concept
  steps.push({
    id: stepId++,
    description: `Input: ${inputSize}x${inputSize}. Kernel: ${kernelSize}x${kernelSize}. Stride: ${stride}. The kernel moves ${stride} cell(s) at a time. Output will be ${outputSize}x${outputSize}.`,
    action: "convolve",
    highlights: [],
    data: {
      input,
      kernel,
      output: emptyOutput.map((r) => [...r]),
      stride,
      padding: 0,
    } as ConvolutionStepData,
  });

  // Slide kernel with stride
  const output = emptyOutput.map((r) => [...r]);
  let outRow = 0;

  for (let row = 0; row <= inputSize - kernelSize; row += stride) {
    let outCol = 0;
    for (let col = 0; col <= inputSize - kernelSize; col += stride) {
      let sum = 0;
      const terms: string[] = [];
      for (let kr = 0; kr < kernelSize; kr++) {
        for (let kc = 0; kc < kernelSize; kc++) {
          const iv = input[row + kr][col + kc];
          const kv = kernel[kr][kc];
          sum += iv * kv;
          terms.push(`${iv}*${kv >= 0 ? kv : `(${kv})`}`);
        }
      }
      output[outRow][outCol] = sum;

      const detail = terms.length <= 9
        ? `${terms.join(" + ")} = ${sum}`
        : `Sum = ${sum}`;

      steps.push({
        id: stepId++,
        description: `Stride=${stride}: kernel at input(${row},${col}) -> output[${outRow}][${outCol}] = ${sum}. Kernel jumps ${stride} position(s).`,
        action: "convolve",
        highlights: [],
        data: {
          input,
          kernel,
          output: output.map((r) => [...r]),
          kernelPosition: [row, col] as [number, number],
          currentOutputCell: [outRow, outCol] as [number, number],
          computationDetail: detail,
          stride,
          padding: 0,
        } as ConvolutionStepData,
      });

      outCol++;
    }
    outRow++;
  }

  // Summary
  const s1OutputSize = Math.floor((inputSize - kernelSize) / 1) + 1;
  const s2OutputSize = Math.floor((inputSize - kernelSize) / 2) + 1;
  const s3OutputSize = Math.floor((inputSize - kernelSize) / 3) + 1;

  steps.push({
    id: stepId++,
    description: `Done! Stride=${stride} produced ${outputSize}x${outputSize} output from ${inputSize}x${inputSize} input. Comparison: stride=1->${s1OutputSize}x${s1OutputSize}, stride=2->${s2OutputSize}x${s2OutputSize}, stride=3->${s3OutputSize}x${s3OutputSize}. Larger stride = more downsampling.`,
    action: "complete",
    highlights: [],
    data: {
      input,
      kernel,
      output: output.map((r) => [...r]),
      stride,
      padding: 0,
      computationDetail: `Stride 1: ${s1OutputSize}x${s1OutputSize} | Stride 2: ${s2OutputSize}x${s2OutputSize} | Stride 3: ${s3OutputSize}x${s3OutputSize}`,
    } as ConvolutionStepData,
  });

  return steps;
}
