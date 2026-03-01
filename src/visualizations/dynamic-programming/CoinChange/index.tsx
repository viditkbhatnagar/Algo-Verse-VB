"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateCoinChangeSteps, DEFAULT_COIN_CHANGE_CONFIG } from "./logic";
import { CoinChangeCanvas } from "./Canvas";

export default function CoinChangeVisualization() {
  const [amount, setAmount] = useState(DEFAULT_COIN_CHANGE_CONFIG.amount);
  const [coins] = useState(DEFAULT_COIN_CHANGE_CONFIG.coins);

  const steps = useMemo(() => generateCoinChangeSteps(coins, amount), [coins, amount]);

  const handleRandomize = useCallback(() => {
    const randomAmount = Math.floor(Math.random() * 10) + 3; // 3..12
    setAmount(randomAmount);
  }, []);

  const handleSizeChange = useCallback((size: number) => {
    setAmount(size);
  }, []);

  return (
    <div className="space-y-4">
      <DPInputControls
        problemSize={amount}
        onProblemSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        label="Amount"
        minSize={3}
        maxSize={12}
      />
      <Player steps={steps}>
        {(currentStep) => <CoinChangeCanvas step={currentStep} coins={coins} />}
      </Player>
    </div>
  );
}
