import type { VisualizationStep } from "@/lib/visualization/types";

/**
 * LSTM cell diagram step data.
 * Custom shape: shows gates and cell state for an LSTM cell.
 */
export interface LSTMStepData {
  activeGate: "none" | "forget" | "input" | "cell-update" | "output" | "all";
  forgetGateValue: number;
  inputGateValue: number;
  candidateValue: number;
  outputGateValue: number;
  cellState: number;
  hiddenState: number;
  prevCellState: number;
  prevHiddenState: number;
  inputValue: number;
}

export function generateLSTMSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Simulated values for a single LSTM cell processing one time step
  const x_t = 0.7;
  const h_prev = 0.3;
  const c_prev = 0.5;

  // Gate computations (simulated)
  const f_t = 0.6;   // forget gate
  const i_t = 0.8;   // input gate
  const c_tilde = 0.4; // candidate cell state (tanh output)
  const o_t = 0.7;   // output gate
  const c_t = f_t * c_prev + i_t * c_tilde; // new cell state
  const h_t = o_t * Math.tanh(c_t); // new hidden state

  // Step 0: Overview of LSTM cell
  steps.push({
    id: stepId++,
    description: "LSTM (Long Short-Term Memory) cell. It has 3 gates: forget gate, input gate, and output gate. These gates control information flow and solve the vanishing gradient problem.",
    action: "forward-pass",
    highlights: [],
    data: {
      activeGate: "none",
      forgetGateValue: 0,
      inputGateValue: 0,
      candidateValue: 0,
      outputGateValue: 0,
      cellState: c_prev,
      hiddenState: h_prev,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  // Step 1: Input arrives
  steps.push({
    id: stepId++,
    description: `Input x(t)=${x_t.toFixed(1)} and previous hidden state h(t-1)=${h_prev.toFixed(1)} are concatenated. Previous cell state C(t-1)=${c_prev.toFixed(1)} flows along the cell state highway.`,
    action: "forward-pass",
    highlights: [],
    data: {
      activeGate: "none",
      forgetGateValue: 0,
      inputGateValue: 0,
      candidateValue: 0,
      outputGateValue: 0,
      cellState: c_prev,
      hiddenState: h_prev,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  // Step 2: Forget gate
  steps.push({
    id: stepId++,
    description: `Forget gate: f(t) = sigmoid(W_f * [h(t-1), x(t)] + b_f) = ${f_t.toFixed(2)}. This decides what to discard from the cell state. Values close to 0 mean "forget", close to 1 mean "keep".`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "forget",
      forgetGateValue: f_t,
      inputGateValue: 0,
      candidateValue: 0,
      outputGateValue: 0,
      cellState: c_prev,
      hiddenState: h_prev,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  // Step 3: Input gate + candidate
  steps.push({
    id: stepId++,
    description: `Input gate: i(t) = sigmoid(...) = ${i_t.toFixed(2)}. Candidate values: C_tilde = tanh(...) = ${c_tilde.toFixed(2)}. The input gate controls which new information to store.`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "input",
      forgetGateValue: f_t,
      inputGateValue: i_t,
      candidateValue: c_tilde,
      outputGateValue: 0,
      cellState: c_prev,
      hiddenState: h_prev,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  // Step 4: Cell state update
  steps.push({
    id: stepId++,
    description: `Cell state update: C(t) = f(t) * C(t-1) + i(t) * C_tilde = ${f_t.toFixed(2)} * ${c_prev.toFixed(2)} + ${i_t.toFixed(2)} * ${c_tilde.toFixed(2)} = ${c_t.toFixed(3)}. Old memory is selectively forgotten and new information is added.`,
    action: "update-weights",
    highlights: [],
    data: {
      activeGate: "cell-update",
      forgetGateValue: f_t,
      inputGateValue: i_t,
      candidateValue: c_tilde,
      outputGateValue: 0,
      cellState: c_t,
      hiddenState: h_prev,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  // Step 5: Output gate
  steps.push({
    id: stepId++,
    description: `Output gate: o(t) = sigmoid(...) = ${o_t.toFixed(2)}. Hidden state: h(t) = o(t) * tanh(C(t)) = ${o_t.toFixed(2)} * tanh(${c_t.toFixed(3)}) = ${h_t.toFixed(3)}. The output gate controls what part of the cell state becomes the output.`,
    action: "activate",
    highlights: [],
    data: {
      activeGate: "output",
      forgetGateValue: f_t,
      inputGateValue: i_t,
      candidateValue: c_tilde,
      outputGateValue: o_t,
      cellState: c_t,
      hiddenState: h_t,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  // Step 6: Summary
  steps.push({
    id: stepId++,
    description: `LSTM cell complete! C(t)=${c_t.toFixed(3)}, h(t)=${h_t.toFixed(3)}. The cell state acts as a "conveyor belt" -- information can flow unchanged through many time steps. Gates (sigmoid outputs) control what's forgotten, stored, and output. This solves the vanishing gradient problem.`,
    action: "complete",
    highlights: [],
    data: {
      activeGate: "all",
      forgetGateValue: f_t,
      inputGateValue: i_t,
      candidateValue: c_tilde,
      outputGateValue: o_t,
      cellState: c_t,
      hiddenState: h_t,
      prevCellState: c_prev,
      prevHiddenState: h_prev,
      inputValue: x_t,
    } as LSTMStepData,
  });

  return steps;
}
