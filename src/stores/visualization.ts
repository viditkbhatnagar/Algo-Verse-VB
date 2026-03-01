import { DEFAULT_SPEED } from "@/lib/constants";

export interface VisualizationState {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
}

export type VisualizationAction =
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "STEP_FORWARD"; maxIndex: number }
  | { type: "STEP_BACK" }
  | { type: "RESET" }
  | { type: "SET_SPEED"; speed: number }
  | { type: "SET_STEP"; index: number }
  | { type: "TICK"; maxIndex: number };

export const initialVisualizationState: VisualizationState = {
  currentStepIndex: 0,
  isPlaying: false,
  speed: DEFAULT_SPEED,
};

export function visualizationReducer(
  state: VisualizationState,
  action: VisualizationAction
): VisualizationState {
  switch (action.type) {
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "STEP_FORWARD":
      if (state.currentStepIndex >= action.maxIndex) {
        return { ...state, isPlaying: false };
      }
      return { ...state, currentStepIndex: state.currentStepIndex + 1 };
    case "STEP_BACK":
      return {
        ...state,
        currentStepIndex: Math.max(0, state.currentStepIndex - 1),
        isPlaying: false,
      };
    case "RESET":
      return { ...initialVisualizationState, speed: state.speed };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "SET_STEP":
      return { ...state, currentStepIndex: action.index, isPlaying: false };
    case "TICK":
      if (state.currentStepIndex >= action.maxIndex) {
        return { ...state, isPlaying: false };
      }
      return { ...state, currentStepIndex: state.currentStepIndex + 1 };
    default:
      return state;
  }
}
