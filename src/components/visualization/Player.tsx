"use client";

import { useVisualization } from "@/hooks/useVisualization";
import type { VisualizationStep } from "@/lib/visualization/types";
import { VisualizationContainer } from "./VisualizationContainer";
import { Controls } from "./Controls";
import { StepCounter } from "./StepCounter";
import { StepDescription } from "./StepDescription";

interface PlayerProps {
  steps: VisualizationStep[];
  children: (currentStep: VisualizationStep) => React.ReactNode;
  defaultSpeed?: number;
}

export function Player({ steps, children, defaultSpeed }: PlayerProps) {
  const {
    currentStepIndex,
    currentStep,
    isPlaying,
    speed,
    totalSteps,
    isAtStart,
    isAtEnd,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
    handleKeyDown,
  } = useVisualization({ steps, defaultSpeed });

  if (steps.length === 0) {
    return (
      <VisualizationContainer>
        <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm">
          No visualization steps generated
        </div>
      </VisualizationContainer>
    );
  }

  return (
    <VisualizationContainer>
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="outline-none"
        role="application"
        aria-label="Algorithm visualization"
      >
        <div className="relative w-full min-h-[300px]">
          {currentStep && children(currentStep)}
        </div>

        {currentStep && (
          <StepDescription description={currentStep.description} />
        )}

        <Controls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onStepForward={stepForward}
          onStepBack={stepBack}
          onReset={reset}
          speed={speed}
          onSpeedChange={setSpeed}
          canStepForward={!isAtEnd}
          canStepBack={!isAtStart}
        />

        <div className="flex justify-center">
          <StepCounter current={currentStepIndex + 1} total={totalSteps} />
        </div>
      </div>
    </VisualizationContainer>
  );
}
