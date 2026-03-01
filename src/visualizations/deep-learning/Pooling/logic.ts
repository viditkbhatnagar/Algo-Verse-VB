import type {
  VisualizationStep,
  ConvolutionStepData,
} from "@/lib/visualization/types";

interface PoolingParams {
  poolType: "max" | "avg";
  poolSize: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateFeatureMap(rand: () => number): number[][] {
  const size = 6;
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rand() * 20))
  );
}

export function generatePoolingSteps(params: PoolingParams): VisualizationStep[] {
  const { poolType, poolSize, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const input = generateFeatureMap(rand);
  const inputSize = input.length;
  const stride = poolSize; // pooling typically uses stride = poolSize
  const outputSize = Math.floor(inputSize / poolSize);

  // Use a "kernel" of ones for display purposes (the ConvolutionCanvas expects a kernel)
  const displayKernel = Array.from({ length: poolSize }, () =>
    Array(poolSize).fill(1)
  );

  const emptyOutput = Array.from({ length: outputSize }, () =>
    Array(outputSize).fill(0)
  );

  const poolLabel = poolType === "max" ? "Max" : "Average";

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `${poolLabel} Pooling: ${inputSize}x${inputSize} feature map, pool size ${poolSize}x${poolSize}, stride ${stride}. Output will be ${outputSize}x${outputSize}.`,
    action: "pool",
    highlights: [],
    data: {
      input,
      kernel: displayKernel,
      output: emptyOutput.map((r) => [...r]),
      stride,
      padding: 0,
    } as ConvolutionStepData,
  });

  // Slide pooling window
  const output = emptyOutput.map((r) => [...r]);

  for (let outRow = 0; outRow < outputSize; outRow++) {
    for (let outCol = 0; outCol < outputSize; outCol++) {
      const row = outRow * stride;
      const col = outCol * stride;

      // Collect values in the pool window
      const windowValues: number[] = [];
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          windowValues.push(input[row + pr][col + pc]);
        }
      }

      let result: number;
      let detail: string;
      if (poolType === "max") {
        result = Math.max(...windowValues);
        detail = `max(${windowValues.join(", ")}) = ${result}`;
      } else {
        result = Math.round((windowValues.reduce((a, b) => a + b, 0) / windowValues.length) * 10) / 10;
        detail = `avg(${windowValues.join(", ")}) = ${result}`;
      }

      output[outRow][outCol] = result;

      steps.push({
        id: stepId++,
        description: `${poolLabel} pool window at (${row},${col}): ${detail}. Output[${outRow}][${outCol}] = ${result}.`,
        action: "pool",
        highlights: [],
        data: {
          input,
          kernel: displayKernel,
          output: output.map((r) => [...r]),
          kernelPosition: [row, col] as [number, number],
          currentOutputCell: [outRow, outCol] as [number, number],
          computationDetail: detail,
          stride,
          padding: 0,
        } as ConvolutionStepData,
      });
    }
  }

  // Summary step
  steps.push({
    id: stepId++,
    description: `${poolLabel} pooling complete! Reduced ${inputSize}x${inputSize} to ${outputSize}x${outputSize}. ${poolType === "max" ? "Max pooling keeps the strongest activation in each region, providing translation invariance." : "Average pooling computes the mean activation, providing a smooth downsampling."} Pooling reduces spatial dimensions and computation while retaining important features.`,
    action: "complete",
    highlights: [],
    data: {
      input,
      kernel: displayKernel,
      output: output.map((r) => [...r]),
      stride,
      padding: 0,
    } as ConvolutionStepData,
  });

  return steps;
}
