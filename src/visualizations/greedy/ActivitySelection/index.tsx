"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { Player } from "@/components/visualization/Player";
import { generateActivitySelectionSteps, DEFAULT_ACTIVITIES } from "./logic";
import { ActivitySelectionCanvas } from "./Canvas";

function generateRandomActivities(count: number): [number, number][] {
  const activities: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * 14);
    const duration = Math.floor(Math.random() * 5) + 1;
    activities.push([start, start + duration]);
  }
  return activities;
}

export default function ActivitySelectionVisualization() {
  const [activities, setActivities] = useState<[number, number][]>(DEFAULT_ACTIVITIES);

  const steps = useMemo(
    () => generateActivitySelectionSteps(activities),
    [activities],
  );

  const handleRandomize = useCallback(() => {
    setActivities(generateRandomActivities(11));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono">
          {activities.length} activities
        </span>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <ActivitySelectionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
