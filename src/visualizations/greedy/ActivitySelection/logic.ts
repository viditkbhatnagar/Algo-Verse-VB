import type { VisualizationStep } from "@/lib/visualization/types";

export interface Activity {
  id: number;
  start: number;
  finish: number;
}

export interface ActivitySelectionStepData {
  activities: Activity[];
  sortedActivities: Activity[];
  currentIndex: number;
  selectedIds: number[];
  skippedIds: number[];
  lastFinishTime: number;
  phase: "unsorted" | "sorting" | "selecting" | "done";
}

export const DEFAULT_ACTIVITIES: [number, number][] = [
  [1, 4],
  [3, 5],
  [0, 6],
  [5, 7],
  [3, 9],
  [5, 9],
  [6, 10],
  [8, 11],
  [8, 12],
  [2, 14],
  [12, 16],
];

function toActivities(pairs: [number, number][]): Activity[] {
  return pairs.map(([start, finish], i) => ({
    id: i,
    start,
    finish,
  }));
}

export function generateActivitySelectionSteps(
  input: [number, number][] = DEFAULT_ACTIVITIES,
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const activities = toActivities(input);
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);

  // Step 1: Show unsorted activities
  steps.push({
    id: stepId++,
    description: `We have ${activities.length} activities, each with a start time and finish time. Goal: select the maximum number of non-overlapping activities.`,
    action: "highlight",
    highlights: [],
    data: {
      activities,
      sortedActivities: activities,
      currentIndex: -1,
      selectedIds: [],
      skippedIds: [],
      lastFinishTime: -1,
      phase: "unsorted",
    } satisfies ActivitySelectionStepData,
  });

  // Step 2: Sort by finish time
  steps.push({
    id: stepId++,
    description: `Sort all activities by finish time in ascending order. This is the key greedy insight: by choosing the activity that finishes earliest, we leave the most room for remaining activities.`,
    action: "compare",
    highlights: [],
    data: {
      activities,
      sortedActivities: sorted,
      currentIndex: -1,
      selectedIds: [],
      skippedIds: [],
      lastFinishTime: -1,
      phase: "sorting",
    } satisfies ActivitySelectionStepData,
  });

  // Step 3: Select first activity (always optimal)
  const selectedIds: number[] = [sorted[0].id];
  let lastFinish = sorted[0].finish;

  steps.push({
    id: stepId++,
    description: `Select the first activity (${sorted[0].start},${sorted[0].finish}) — it has the earliest finish time. Last finish time = ${lastFinish}.`,
    action: "select",
    highlights: [],
    data: {
      activities,
      sortedActivities: sorted,
      currentIndex: 0,
      selectedIds: [...selectedIds],
      skippedIds: [],
      lastFinishTime: lastFinish,
      phase: "selecting",
    } satisfies ActivitySelectionStepData,
  });

  const skippedIds: number[] = [];

  // Steps 4+: Process remaining activities
  for (let i = 1; i < sorted.length; i++) {
    const activity = sorted[i];

    if (activity.start >= lastFinish) {
      // Compatible — select it
      selectedIds.push(activity.id);
      lastFinish = activity.finish;

      steps.push({
        id: stepId++,
        description: `Activity (${activity.start},${activity.finish}): start=${activity.start} >= lastFinish=${lastFinish - (activity.finish - activity.start) > 0 ? sorted[selectedIds.length - 2 >= 0 ? selectedIds.length - 2 : 0].finish : lastFinish}? YES — select it! New last finish time = ${lastFinish}. Total selected: ${selectedIds.length}.`,
        action: "select",
        highlights: [],
        data: {
          activities,
          sortedActivities: sorted,
          currentIndex: i,
          selectedIds: [...selectedIds],
          skippedIds: [...skippedIds],
          lastFinishTime: lastFinish,
          phase: "selecting",
        } satisfies ActivitySelectionStepData,
      });
    } else {
      // Overlaps — skip it
      skippedIds.push(activity.id);

      steps.push({
        id: stepId++,
        description: `Activity (${activity.start},${activity.finish}): start=${activity.start} >= lastFinish=${lastFinish}? NO — it overlaps with a selected activity. Skip it.`,
        action: "compare",
        highlights: [],
        data: {
          activities,
          sortedActivities: sorted,
          currentIndex: i,
          selectedIds: [...selectedIds],
          skippedIds: [...skippedIds],
          lastFinishTime: lastFinish,
          phase: "selecting",
        } satisfies ActivitySelectionStepData,
      });
    }
  }

  // Final step
  const selectedActivities = sorted.filter((a) => selectedIds.includes(a.id));
  steps.push({
    id: stepId++,
    description: `Done! Selected ${selectedIds.length} non-overlapping activities: ${selectedActivities.map((a) => `(${a.start},${a.finish})`).join(", ")}. This is the maximum possible.`,
    action: "complete",
    highlights: [],
    data: {
      activities,
      sortedActivities: sorted,
      currentIndex: sorted.length,
      selectedIds: [...selectedIds],
      skippedIds: [...skippedIds],
      lastFinishTime: lastFinish,
      phase: "done",
    } satisfies ActivitySelectionStepData,
  });

  return steps;
}
