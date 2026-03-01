import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

interface AdamParams {
  learningRate: number;
  beta1: number;
  beta2: number;
}

function quadraticLoss(x: number, y: number): number {
  return x * x + 10 * y * y;
}

function quadraticGrad(x: number, y: number): [number, number] {
  return [2 * x, 20 * y];
}

export function generateAdamOptimizerSteps(params: AdamParams): VisualizationStep[] {
  const { learningRate, beta1, beta2 } = params;
  const eps = 1e-8;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const totalIterations = 25;

  // Run vanilla SGD
  const sgdPath: { x: number; y: number; loss: number }[] = [];
  let sx = 4.0, sy = 3.0;
  sgdPath.push({ x: sx, y: sy, loss: quadraticLoss(sx, sy) });
  for (let i = 0; i < totalIterations; i++) {
    const [gx, gy] = quadraticGrad(sx, sy);
    sx -= learningRate * gx;
    sy -= learningRate * gy;
    sgdPath.push({ x: sx, y: sy, loss: quadraticLoss(sx, sy) });
  }

  // Run SGD with Momentum
  const momPath: { x: number; y: number; loss: number }[] = [];
  let momx = 4.0, momy = 3.0;
  let mvx = 0, mvy = 0;
  momPath.push({ x: momx, y: momy, loss: quadraticLoss(momx, momy) });
  for (let i = 0; i < totalIterations; i++) {
    const [gx, gy] = quadraticGrad(momx, momy);
    mvx = beta1 * mvx + gx;
    mvy = beta1 * mvy + gy;
    momx -= learningRate * mvx;
    momy -= learningRate * mvy;
    momPath.push({ x: momx, y: momy, loss: quadraticLoss(momx, momy) });
  }

  // Run Adam
  const adamPath: { x: number; y: number; loss: number; m: [number, number]; v: [number, number] }[] = [];
  let ax = 4.0, ay = 3.0;
  let m1 = 0, m2 = 0; // first moment
  let v1 = 0, v2 = 0; // second moment
  adamPath.push({ x: ax, y: ay, loss: quadraticLoss(ax, ay), m: [0, 0], v: [0, 0] });
  for (let t = 1; t <= totalIterations; t++) {
    const [gx, gy] = quadraticGrad(ax, ay);

    // Update first moment
    m1 = beta1 * m1 + (1 - beta1) * gx;
    m2 = beta1 * m2 + (1 - beta1) * gy;

    // Update second moment
    v1 = beta2 * v1 + (1 - beta2) * gx * gx;
    v2 = beta2 * v2 + (1 - beta2) * gy * gy;

    // Bias correction
    const m1Hat = m1 / (1 - Math.pow(beta1, t));
    const m2Hat = m2 / (1 - Math.pow(beta1, t));
    const v1Hat = v1 / (1 - Math.pow(beta2, t));
    const v2Hat = v2 / (1 - Math.pow(beta2, t));

    // Update
    ax -= learningRate * m1Hat / (Math.sqrt(v1Hat) + eps);
    ay -= learningRate * m2Hat / (Math.sqrt(v2Hat) + eps);

    adamPath.push({ x: ax, y: ay, loss: quadraticLoss(ax, ay), m: [m1, m2], v: [v1, v2] });
  }

  // Generate loss curves
  const sgdLoss: FunctionPlotPoint[] = sgdPath.map((p, i) => ({ x: i, y: p.loss }));
  const momLoss: FunctionPlotPoint[] = momPath.map((p, i) => ({ x: i, y: p.loss }));
  const adamLoss: FunctionPlotPoint[] = adamPath.map((p, i) => ({ x: i, y: p.loss }));

  const maxLoss = Math.max(sgdPath[0].loss, momPath[0].loss, adamPath[0].loss) * 1.1;

  // Step 1: Overview
  steps.push({
    id: stepId++,
    description: `Adam optimizer combines momentum (β₁=${beta1}) and adaptive learning rates (β₂=${beta2}). Comparing SGD, SGD+Momentum, and Adam on f(x,y) = x² + 10y².`,
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "SGD", points: sgdLoss, color: "#ef4444", active: true },
        { name: "Momentum", points: momLoss, color: "#f59e0b", active: true },
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 2: First moment (momentum-like)
  steps.push({
    id: stepId++,
    description: `First moment (m): m_t = β₁ * m_{t-1} + (1-β₁) * gradient. This is the exponential moving average of gradients (like momentum). β₁=${beta1}.`,
    action: "compute-gradient",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss] as [number, number],
      currentX: 1,
    } as FunctionPlotStepData,
    variables: { beta1, m_x: adamPath[1].m[0], m_y: adamPath[1].m[1] },
  });

  // Step 3: Second moment (adaptive learning rate)
  steps.push({
    id: stepId++,
    description: `Second moment (v): v_t = β₂ * v_{t-1} + (1-β₂) * gradient². Tracks gradient variance. Large v → small step. Small v → large step. β₂=${beta2}.`,
    action: "compute-gradient",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss] as [number, number],
      currentX: 2,
    } as FunctionPlotStepData,
    variables: { beta2, v_x: adamPath[2].v[0], v_y: adamPath[2].v[1] },
  });

  // Step 4: Bias correction
  steps.push({
    id: stepId++,
    description: "Bias correction: m_hat = m/(1-β₁^t), v_hat = v/(1-β₂^t). Without correction, early estimates are biased toward 0 since m and v are initialized at 0.",
    action: "update-weights",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss] as [number, number],
      currentX: 3,
    } as FunctionPlotStepData,
  });

  // Step 5: Update rule
  steps.push({
    id: stepId++,
    description: `Update: θ = θ - lr * m_hat / (√v_hat + ε). The division by √v_hat makes learning rates adaptive: parameters with large gradients get smaller effective learning rates.`,
    action: "update-weights",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss] as [number, number],
      currentX: 5,
    } as FunctionPlotStepData,
  });

  // Steps 6-9: Progress at key steps
  const keySteps = [3, 8, 15, 20];
  for (const k of keySteps) {
    const aLoss = adamPath[Math.min(k, adamPath.length - 1)].loss;
    const sLoss = sgdPath[Math.min(k, sgdPath.length - 1)].loss;
    const mLoss = momPath[Math.min(k, momPath.length - 1)].loss;

    steps.push({
      id: stepId++,
      description: `Step ${k}: Adam=${aLoss.toFixed(3)}, Momentum=${mLoss.toFixed(3)}, SGD=${sLoss.toFixed(3)}. Adam adapts learning rate per parameter for balanced convergence.`,
      action: "train",
      highlights: [],
      data: {
        functions: [
          { name: "SGD", points: sgdLoss, color: "#ef4444", active: true },
          { name: "Momentum", points: momLoss, color: "#f59e0b", active: true },
          { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
        ],
        xLabel: "Step",
        yLabel: "Loss",
        xRange: [0, totalIterations] as [number, number],
        yRange: [0, maxLoss] as [number, number],
        currentX: k,
      } as FunctionPlotStepData,
      variables: { step: k, adam: aLoss, sgd: sLoss, momentum: mLoss },
    });
  }

  // Step 10: Why Adam works
  steps.push({
    id: stepId++,
    description: "Why Adam works: In the steep y-direction (gradient=20y), √v_y is large, so effective lr is small. In the flat x-direction (gradient=2x), √v_x is small, so effective lr is large.",
    action: "highlight",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss * 0.5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 11: Default hyperparameters
  steps.push({
    id: stepId++,
    description: `Default hyperparameters: lr=0.001, β₁=0.9, β₂=0.999, ε=1e-8. These work well for most problems. Current: lr=${learningRate}, β₁=${beta1}, β₂=${beta2}.`,
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss * 0.3] as [number, number],
    } as FunctionPlotStepData,
    variables: { learningRate, beta1, beta2 },
  });

  // Step 12: Adam vs AdamW
  steps.push({
    id: stepId++,
    description: "AdamW: decouples weight decay from adaptive learning rate. Standard Adam applies weight decay through the gradient, which interacts poorly with the adaptive scaling.",
    action: "highlight",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss * 0.3] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 13: Final comparison
  const finalAdam = adamPath[adamPath.length - 1].loss;
  const finalSGD = sgdPath[sgdPath.length - 1].loss;
  const finalMom = momPath[momPath.length - 1].loss;
  steps.push({
    id: stepId++,
    description: `Final loss after ${totalIterations} steps: Adam=${finalAdam.toFixed(4)}, Momentum=${finalMom.toFixed(4)}, SGD=${finalSGD.toFixed(4)}. Adam converges fastest with adaptive per-parameter rates.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "SGD", points: sgdLoss, color: "#ef4444", active: true },
        { name: "Momentum", points: momLoss, color: "#f59e0b", active: true },
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss] as [number, number],
      currentX: totalIterations,
    } as FunctionPlotStepData,
  });

  // Step 14: Summary
  steps.push({
    id: stepId++,
    description: "Adam summary: Combines momentum (first moment) + adaptive learning rates (second moment) + bias correction. The default optimizer for modern deep learning.",
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "Adam", points: adamLoss, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, totalIterations] as [number, number],
      yRange: [0, maxLoss * 0.2] as [number, number],
    } as FunctionPlotStepData,
  });

  return steps;
}
