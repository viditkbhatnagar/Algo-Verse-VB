"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import type { VisualizationStep } from "@/lib/visualization/types";
import {
  visualizationReducer,
  initialVisualizationState,
} from "@/stores/visualization";

const BASE_INTERVAL = 600; // ms at 1x speed

interface UseVisualizationOptions {
  steps: VisualizationStep[];
  defaultSpeed?: number;
}

export function useVisualization({ steps, defaultSpeed }: UseVisualizationOptions) {
  const [state, dispatch] = useReducer(visualizationReducer, {
    ...initialVisualizationState,
    speed: defaultSpeed ?? initialVisualizationState.speed,
  });

  const maxIndex = steps.length - 1;
  const stepsRef = useRef(steps);

  // Auto-reset when steps change
  useEffect(() => {
    if (stepsRef.current !== steps) {
      stepsRef.current = steps;
      dispatch({ type: "RESET" });
    }
  }, [steps]);

  // Playback interval
  useEffect(() => {
    if (!state.isPlaying || steps.length === 0) return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK", maxIndex });
    }, BASE_INTERVAL / state.speed);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.speed, steps.length, maxIndex]);

  const play = useCallback(() => {
    if (state.currentStepIndex >= maxIndex) {
      dispatch({ type: "RESET" });
    }
    dispatch({ type: "PLAY" });
  }, [state.currentStepIndex, maxIndex]);

  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      dispatch({ type: "PAUSE" });
    } else {
      if (state.currentStepIndex >= maxIndex) {
        dispatch({ type: "RESET" });
      }
      dispatch({ type: "PLAY" });
    }
  }, [state.isPlaying, state.currentStepIndex, maxIndex]);

  const stepForward = useCallback(
    () => dispatch({ type: "STEP_FORWARD", maxIndex }),
    [maxIndex]
  );

  const stepBack = useCallback(() => dispatch({ type: "STEP_BACK" }), []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const setSpeed = useCallback(
    (speed: number) => dispatch({ type: "SET_SPEED", speed }),
    []
  );

  const goToStep = useCallback(
    (index: number) => dispatch({ type: "SET_STEP", index }),
    []
  );

  // Keyboard handler (scoped — call from Player's onKeyDown)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowRight":
          e.preventDefault();
          stepForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          stepBack();
          break;
        case "r":
        case "R":
          e.preventDefault();
          reset();
          break;
      }
    },
    [togglePlayPause, stepForward, stepBack, reset]
  );

  return {
    currentStepIndex: state.currentStepIndex,
    currentStep: steps.length > 0 ? steps[state.currentStepIndex] ?? null : null,
    isPlaying: state.isPlaying,
    speed: state.speed,
    totalSteps: steps.length,
    isAtStart: state.currentStepIndex === 0,
    isAtEnd: state.currentStepIndex >= maxIndex,

    play,
    pause,
    togglePlayPause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
    goToStep,
    handleKeyDown,
  };
}
