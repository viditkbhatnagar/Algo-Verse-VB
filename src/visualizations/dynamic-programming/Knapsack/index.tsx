"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateKnapsackSteps, DEFAULT_KNAPSACK_CONFIG } from "./logic";
import type { KnapsackConfig } from "./logic";
import { KnapsackCanvas } from "./Canvas";

function generateRandomConfig(numItems: number): KnapsackConfig {
  const names = "ABCDEFGHIJKLMNOP".split("");
  const items = Array.from({ length: numItems }, (_, i) => ({
    name: names[i] || `I${i}`,
    weight: Math.floor(Math.random() * 5) + 1,
    value: Math.floor(Math.random() * 8) + 1,
  }));
  const maxWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const capacity = Math.max(3, Math.floor(maxWeight * 0.6));
  return { items, capacity };
}

export default function KnapsackVisualization() {
  const [numItems, setNumItems] = useState(DEFAULT_KNAPSACK_CONFIG.items.length);
  const [config, setConfig] = useState<KnapsackConfig>(DEFAULT_KNAPSACK_CONFIG);

  const steps = useMemo(() => generateKnapsackSteps(config), [config]);

  const handleRandomize = useCallback(() => {
    setConfig(generateRandomConfig(numItems));
  }, [numItems]);

  const handleSizeChange = useCallback((size: number) => {
    setNumItems(size);
    setConfig(generateRandomConfig(size));
  }, []);

  return (
    <div className="space-y-4">
      <DPInputControls
        problemSize={numItems}
        onProblemSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        label="Items"
        minSize={2}
        maxSize={6}
      />
      <Player steps={steps} defaultSpeed={2}>
        {(currentStep) => <KnapsackCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
