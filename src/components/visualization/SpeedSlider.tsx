"use client";

import { Slider } from "@/components/ui/slider";
import { PLAYBACK_SPEEDS } from "@/lib/constants";

interface SpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedSlider({ speed, onSpeedChange }: SpeedSliderProps) {
  const currentIndex = PLAYBACK_SPEEDS.indexOf(speed as typeof PLAYBACK_SPEEDS[number]);
  const sliderIndex = currentIndex >= 0 ? currentIndex : 2; // default to 1x

  return (
    <div className="flex items-center gap-2">
      <Slider
        className="w-24"
        min={0}
        max={PLAYBACK_SPEEDS.length - 1}
        step={1}
        value={[sliderIndex]}
        onValueChange={([val]) => onSpeedChange(PLAYBACK_SPEEDS[val])}
      />
      <span className="text-xs text-muted-foreground font-mono w-8 text-right">
        {speed}x
      </span>
    </div>
  );
}
