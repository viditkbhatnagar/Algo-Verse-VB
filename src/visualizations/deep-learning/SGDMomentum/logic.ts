import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

interface SGDMomentumParams {
  momentum: number;
  learningRate: number;
}

// Optimization on f(x,y) = x^2 + 10*y^2 (elongated bowl)
// We project the 2D path onto a 1D plot for visualization
function quadraticLoss(x: number, y: number): number {
  return x * x + 10 * y * y;
}

function quadraticGrad(x: number, y: number): [number, number] {
  return [2 * x, 20 * y];
}

export function generateSGDMomentumSteps(params: SGDMomentumParams): VisualizationStep[] {
  const { momentum, learningRate } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Run optimization for vanilla SGD
  const sgdPath: { x: number; y: number; loss: number }[] = [];
  let sx = 4.0, sy = 3.0;
  sgdPath.push({ x: sx, y: sy, loss: quadraticLoss(sx, sy) });
  for (let i = 0; i < 25; i++) {
    const [gx, gy] = quadraticGrad(sx, sy);
    sx -= learningRate * gx;
    sy -= learningRate * gy;
    sgdPath.push({ x: sx, y: sy, loss: quadraticLoss(sx, sy) });
  }

  // Run optimization for SGD with momentum
  const momentumPath: { x: number; y: number; loss: number }[] = [];
  let mx = 4.0, my = 3.0;
  let vx = 0, vy = 0;
  momentumPath.push({ x: mx, y: my, loss: quadraticLoss(mx, my) });
  for (let i = 0; i < 25; i++) {
    const [gx, gy] = quadraticGrad(mx, my);
    vx = momentum * vx + gx;
    vy = momentum * vy + gy;
    mx -= learningRate * vx;
    my -= learningRate * vy;
    momentumPath.push({ x: mx, y: my, loss: quadraticLoss(mx, my) });
  }

  // Convert paths to loss-over-step curves
  const sgdLossCurve: FunctionPlotPoint[] = sgdPath.map((p, i) => ({ x: i, y: p.loss }));
  const momentumLossCurve: FunctionPlotPoint[] = momentumPath.map((p, i) => ({ x: i, y: p.loss }));

  // Convert to x-position over steps
  const sgdXCurve: FunctionPlotPoint[] = sgdPath.map((p, i) => ({ x: i, y: p.x }));
  const momentumXCurve: FunctionPlotPoint[] = momentumPath.map((p, i) => ({ x: i, y: p.x }));
  const sgdYCurve: FunctionPlotPoint[] = sgdPath.map((p, i) => ({ x: i, y: p.y }));
  const momentumYCurve: FunctionPlotPoint[] = momentumPath.map((p, i) => ({ x: i, y: p.y }));

  // Step 1: Overview
  steps.push({
    id: stepId++,
    description: `Optimizing f(x,y) = x² + 10y². Starting at (4, 3) with learning rate = ${learningRate}. Comparing vanilla SGD vs SGD with momentum (β=${momentum}).`,
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "SGD Loss", points: sgdLossCurve, color: "#ef4444", active: true },
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, Math.max(sgdPath[0].loss, momentumPath[0].loss) * 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Steps 2-6: Show optimization progress at key steps
  const keySteps = [1, 3, 5, 10, 15];
  for (const k of keySteps) {
    const sgdLoss = sgdPath[Math.min(k, sgdPath.length - 1)].loss;
    const momLoss = momentumPath[Math.min(k, momentumPath.length - 1)].loss;
    const speedup = sgdLoss > 0.01 ? (sgdLoss / Math.max(momLoss, 0.001)).toFixed(1) : "N/A";

    steps.push({
      id: stepId++,
      description: `Step ${k}: SGD loss = ${sgdLoss.toFixed(3)}, Momentum loss = ${momLoss.toFixed(3)}. Momentum is ${speedup}x lower.`,
      action: "train",
      highlights: [],
      data: {
        functions: [
          { name: "SGD Loss", points: sgdLossCurve, color: "#ef4444", active: true },
          { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
        ],
        xLabel: "Step",
        yLabel: "Loss",
        xRange: [0, 25] as [number, number],
        yRange: [0, Math.max(sgdPath[0].loss, momentumPath[0].loss) * 1.1] as [number, number],
        currentX: k,
      } as FunctionPlotStepData,
      variables: { step: k, sgdLoss, momentumLoss: momLoss },
    });
  }

  // Step 7: X-coordinate trajectory (oscillation analysis)
  steps.push({
    id: stepId++,
    description: "X-coordinate over time: Momentum smoothly approaches 0, while vanilla SGD may oscillate or converge more slowly in this direction.",
    action: "compare",
    highlights: [],
    data: {
      functions: [
        { name: "SGD x(t)", points: sgdXCurve, color: "#ef4444", active: true },
        { name: "Momentum x(t)", points: momentumXCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "x position",
      xRange: [0, 25] as [number, number],
      yRange: [-1, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 8: Y-coordinate trajectory
  steps.push({
    id: stepId++,
    description: "Y-coordinate over time: The steep y-direction (gradient = 20y) causes SGD to oscillate. Momentum dampens these oscillations by averaging gradients.",
    action: "compare",
    highlights: [],
    data: {
      functions: [
        { name: "SGD y(t)", points: sgdYCurve, color: "#ef4444", active: true },
        { name: "Momentum y(t)", points: momentumYCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "y position",
      xRange: [0, 25] as [number, number],
      yRange: [-2, 4] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 9: Velocity buildup
  steps.push({
    id: stepId++,
    description: `Momentum = ${momentum}: velocity v_t = β*v_{t-1} + gradient. Persistent gradients build velocity; oscillating gradients cancel. β=${momentum} means ${(momentum * 100).toFixed(0)}% of velocity is retained.`,
    action: "update-weights",
    highlights: [],
    data: {
      functions: [
        { name: "SGD Loss", points: sgdLossCurve, color: "#ef4444", active: true },
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, Math.max(sgdPath[0].loss, momentumPath[0].loss) * 1.1] as [number, number],
    } as FunctionPlotStepData,
    variables: { momentum, effectiveSteps: 1 / (1 - momentum) },
  });

  // Step 10: Effective step size
  const effectiveLR = learningRate / (1 - momentum);
  steps.push({
    id: stepId++,
    description: `Effective learning rate with momentum: lr/(1-β) = ${learningRate}/${(1 - momentum).toFixed(2)} = ${effectiveLR.toFixed(3)}. Momentum amplifies the step in consistent directions.`,
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, momentumPath[0].loss * 1.1] as [number, number],
    } as FunctionPlotStepData,
    variables: { effectiveLR },
  });

  // Step 11: High momentum effects
  steps.push({
    id: stepId++,
    description: `β=${momentum}: Higher momentum → faster in consistent directions but may overshoot. β=0.9 is standard. β=0.99 for very noisy gradients. β=0 is vanilla SGD.`,
    action: "highlight",
    highlights: [],
    data: {
      functions: [
        { name: "SGD Loss", points: sgdLossCurve, color: "#ef4444", active: true },
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, Math.max(sgdPath[0].loss, momentumPath[0].loss) * 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 12: Nesterov momentum
  steps.push({
    id: stepId++,
    description: "Nesterov momentum: 'look ahead' to where momentum will take us, then compute gradient there. Provides better theoretical convergence and is widely used in practice.",
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, momentumPath[0].loss * 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 13: Comparison summary
  const finalSGDLoss = sgdPath[sgdPath.length - 1].loss;
  const finalMomLoss = momentumPath[momentumPath.length - 1].loss;
  steps.push({
    id: stepId++,
    description: `After 25 steps: SGD loss = ${finalSGDLoss.toFixed(4)}, Momentum loss = ${finalMomLoss.toFixed(4)}. Momentum converges ${(finalSGDLoss / Math.max(finalMomLoss, 0.0001)).toFixed(1)}x faster.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "SGD Loss", points: sgdLossCurve, color: "#ef4444", active: true },
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, Math.max(sgdPath[0].loss, momentumPath[0].loss) * 1.1] as [number, number],
      currentX: 25,
    } as FunctionPlotStepData,
  });

  // Step 14: Summary
  steps.push({
    id: stepId++,
    description: `SGD with Momentum summary: v = β*v + grad, θ = θ - lr*v. Dampens oscillations, accelerates consistent directions. Standard β=0.9, lr=${learningRate}.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "Momentum Loss", points: momentumLossCurve, color: "#6366f1", active: true },
      ],
      xLabel: "Step",
      yLabel: "Loss",
      xRange: [0, 25] as [number, number],
      yRange: [0, momentumPath[0].loss * 0.5] as [number, number],
    } as FunctionPlotStepData,
  });

  return steps;
}
