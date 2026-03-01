"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generatePoolingSteps } from "./logic";
import { PoolingCanvas } from "./Canvas";

export default function PoolingVisualization() {
  const [poolType, setPoolType] = useState<"max" | "avg">("max");
  const [poolSize, setPoolSize] = useState(2);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generatePoolingSteps({ poolType, poolSize, seed }),
    [poolType, poolSize, seed]
  );

  const controls: MLControl[] = [
    {
      type: "select",
      key: "poolType",
      label: "Pool Type",
      value: poolType,
      options: [
        { label: "Max Pooling", value: "max" },
        { label: "Avg Pooling", value: "avg" },
      ],
    },
    {
      type: "select",
      key: "poolSize",
      label: "Pool Size",
      value: String(poolSize),
      options: [
        { label: "2x2", value: "2" },
        { label: "3x3", value: "3" },
      ],
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    if (key === "poolType") setPoolType(value as "max" | "avg");
    if (key === "poolSize") setPoolSize(Number(value));
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setPoolType("max");
    setPoolSize(2);
    setSeed(42);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onRandomize={handleRandomize}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <PoolingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
