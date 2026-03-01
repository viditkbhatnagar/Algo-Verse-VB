import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const activitySelection: AlgorithmMetadata = {
  id: "activity-selection",
  name: "Activity Selection",
  category: "greedy",
  subcategory: "Interval Scheduling",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Dominated by the initial sort by finish time. The greedy selection pass is O(n).",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "O(1) extra space if sorting in-place (excluding output). O(n) for storing the selected activities.",
  },
  description: `The Activity Selection Problem is a classic optimization problem that serves as the textbook introduction to greedy algorithms. Given a set of activities, each with a start time and finish time, the goal is to select the maximum number of non-overlapping activities — that is, no two selected activities can share a time interval.

The greedy strategy is deceptively simple but provably optimal: sort all activities by their finish times, then iterate through them, greedily selecting each activity that starts after the last selected activity finishes. The first activity (with the earliest finish time) is always selected since it leaves the most room for subsequent activities.

The correctness proof relies on the "greedy choice property" and "optimal substructure." The greedy choice property states that an optimal solution always exists that includes the activity with the earliest finish time. By choosing this activity first, we reduce the problem to selecting the maximum number of compatible activities from those that start after it finishes — a smaller instance of the same problem.

This problem and its solution were first formally analyzed in the context of combinatorial optimization and form the foundation for understanding when greedy algorithms work. It is closely related to the weighted job scheduling problem (where activities have profits and the goal is to maximize total profit), which requires dynamic programming instead.

Real-world applications include scheduling conference rooms, assigning time slots for presentations, resource allocation in project management, and CPU process scheduling. The algorithm is also the basis for interval graph coloring, which determines the minimum number of resources needed to handle all activities.`,
  shortDescription:
    "Selects the maximum number of non-overlapping activities by greedily choosing the activity with the earliest finish time at each step.",
  pseudocode: `function ActivitySelection(activities):
    // Sort activities by finish time
    sort activities by finish_time ascending

    selected = [activities[0]]   // Always take the first
    lastFinish = activities[0].finish_time

    for i = 1 to n-1:
        if activities[i].start_time >= lastFinish:
            // This activity is compatible
            selected.append(activities[i])
            lastFinish = activities[i].finish_time
        else:
            // This activity overlaps — skip it

    return selected`,
  implementations: {
    python: `from typing import List, Tuple


def activity_selection(
    activities: List[Tuple[int, int]]
) -> List[Tuple[int, int]]:
    """
    Select maximum non-overlapping activities.

    Args:
        activities: List of (start_time, finish_time) tuples

    Returns:
        List of selected non-overlapping activities
    """
    # Sort by finish time
    sorted_activities = sorted(activities, key=lambda x: x[1])

    selected = [sorted_activities[0]]
    last_finish = sorted_activities[0][1]

    for i in range(1, len(sorted_activities)):
        start, finish = sorted_activities[i]
        if start >= last_finish:
            selected.append(sorted_activities[i])
            last_finish = finish

    return selected


# Example usage
if __name__ == "__main__":
    activities = [
        (1, 4), (3, 5), (0, 6), (5, 7), (3, 9),
        (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16),
    ]
    result = activity_selection(activities)
    print(f"Selected {len(result)} activities: {result}")
    # Selected 4 activities: [(1, 4), (5, 7), (8, 11), (12, 16)]`,
    javascript: `/**
 * Activity Selection — greedy algorithm for interval scheduling.
 *
 * @param {[number, number][]} activities - Array of [start, finish] pairs
 * @returns {[number, number][]} Maximum set of non-overlapping activities
 */
function activitySelection(activities) {
  // Sort by finish time
  const sorted = [...activities].sort((a, b) => a[1] - b[1]);

  const selected = [sorted[0]];
  let lastFinish = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    const [start, finish] = sorted[i];
    if (start >= lastFinish) {
      selected.push(sorted[i]);
      lastFinish = finish;
    }
  }

  return selected;
}

// Example usage
const activities = [
  [1, 4], [3, 5], [0, 6], [5, 7], [3, 9],
  [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16],
];
const result = activitySelection(activities);
console.log(\`Selected \${result.length} activities:\`, result);
// Selected 4 activities: [[1, 4], [5, 7], [8, 11], [12, 16]]`,
  },
  useCases: [
    "Conference room scheduling — maximizing the number of meetings in a single room",
    "CPU process scheduling — selecting non-overlapping tasks for a single processor",
    "Event planning — scheduling the most presentations in a single track",
    "Resource allocation — assigning time slots for machines or personnel",
    "Broadcasting — selecting the most TV shows to record without overlap",
  ],
  relatedAlgorithms: [
    "job-scheduling",
    "interval-scheduling-maximization",
    "fractional-knapsack",
    "huffman-coding",
  ],
  glossaryTerms: [
    "greedy algorithm",
    "greedy choice property",
    "optimal substructure",
    "interval scheduling",
    "non-overlapping intervals",
  ],
  tags: [
    "greedy",
    "interval-scheduling",
    "sorting",
    "optimization",
    "classic",
    "intermediate",
  ],
};
