import type { VisualizationStep } from "@/lib/visualization/types";

/**
 * GRU cell diagram step data.
 * Simpler than LSTM: only 2 gates (update gate, reset gate).
 */
export interface GRUStepData {
  activeGate: "none" | "reset" | "update" | "candidate" | "output" | "all";
  resetGateValue: number;
  updateGateValue: number;
  candidateValue: number;
  hiddenState: number;
  prevHiddenState: number;
  inputValue: number;
}

export function generateGRUSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Simulated values
  const x_t = 0.8;
  const h_prev = 0.4;

  const r_t = 0.3;   // reset gate
  const z_t = 0.7;   // update gate
  const h_tilde = Math.tanh(0.5 * x_t + 0.3 * (r_t * h_prev)); // candidate
  const h_t = (1 - z_t) * h_prev + z_t * h_tilde; // new hidden state

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: "GRU (Gated Recurrent Unit): a simplified gated RNN with only 2 gates -- update gate and reset gate. No separate cell state. Fewer parameters than LSTM, often comparable performance.",
    action: "forward-pass",
    highlights: [],
    data: {
      activeGate: "none",
      resetGateValue: 0,
      updateGateValue: 0,
      candidateValue: 0,
      hiddenState: h_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  // Step 1: Input
  steps.push({
    id: stepId++,
    description: `Input x(t)=${x_t.toFixed(1)} and previous hidden state h(t-1)=${h_prev.toFixed(1)} enter the GRU cell. Unlike LSTM, there is no separate cell state.`,
    action: "forward-pass",
    highlights: [],
    data: {
      activeGate: "none",
      resetGateValue: 0,
      updateGateValue: 0,
      candidateValue: 0,
      hiddenState: h_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  // Step 2: Update gate
  steps.push({
    id: stepId++,
    description: `Update gate: z(t) = sigmoid(W_z * [h(t-1), x(t)] + b_z) = ${z_t.toFixed(2)}. Controls how much of the new candidate to mix in. Like a combined forget+input gate from LSTM.`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "update",
      resetGateValue: 0,
      updateGateValue: z_t,
      candidateValue: 0,
      hiddenState: h_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  // Step 3: Reset gate
  steps.push({
    id: stepId++,
    description: `Reset gate: r(t) = sigmoid(W_r * [h(t-1), x(t)] + b_r) = ${r_t.toFixed(2)}. Controls how much of the previous hidden state to forget when computing the candidate. Low values = ignore past.`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "reset",
      resetGateValue: r_t,
      updateGateValue: z_t,
      candidateValue: 0,
      hiddenState: h_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  // Step 4: Candidate hidden state
  steps.push({
    id: stepId++,
    description: `Candidate: h~(t) = tanh(W * [r(t)*h(t-1), x(t)] + b) = ${h_tilde.toFixed(3)}. The reset gate modulates how much past context feeds into the candidate computation.`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "candidate",
      resetGateValue: r_t,
      updateGateValue: z_t,
      candidateValue: h_tilde,
      hiddenState: h_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  // Step 5: Final hidden state
  steps.push({
    id: stepId++,
    description: `Output: h(t) = (1 - z(t)) * h(t-1) + z(t) * h~(t) = (1 - ${z_t.toFixed(2)}) * ${h_prev.toFixed(2)} + ${z_t.toFixed(2)} * ${h_tilde.toFixed(3)} = ${h_t.toFixed(3)}. The update gate interpolates between the old and new hidden state.`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "output",
      resetGateValue: r_t,
      updateGateValue: z_t,
      candidateValue: h_tilde,
      hiddenState: h_t,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  // Step 6: Summary
  steps.push({
    id: stepId++,
    description: `GRU cell complete! h(t)=${h_t.toFixed(3)}. GRU merges LSTM's forget and input gates into a single update gate, and has no separate cell state. Result: fewer parameters, faster training, often similar performance to LSTM.`,
    action: "complete",
    highlights: [],
    data: {
      activeGate: "all",
      resetGateValue: r_t,
      updateGateValue: z_t,
      candidateValue: h_tilde,
      hiddenState: h_t,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as GRUStepData,
  });

  return steps;
}
