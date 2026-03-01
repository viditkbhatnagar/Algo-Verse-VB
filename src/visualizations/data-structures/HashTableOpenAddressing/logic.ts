import type { VisualizationStep, HashTableStepData, HashTableBucket, HighlightColor } from "@/lib/visualization/types";

/**
 * Generate visualization steps for Hash Table with Open Addressing (Linear Probing).
 * Uses h(key, i) = (h(key) + i) % size with size = 7.
 * Inserts keys [15, 25, 35, 10, 20] to demonstrate probing on collisions.
 */
export function generateHashTableOpenAddressingSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const tableSize = 7;
  const keys = [15, 25, 35, 10, 20];

  // Each "bucket" in open addressing holds at most one item
  const table: (null | { key: string; value: string })[] = new Array(tableSize).fill(null);

  function toBuckets(probeSeq?: number[], currentIdx?: number): HashTableBucket[] {
    return table.map((slot, i) => {
      let highlight: HighlightColor | undefined;
      if (currentIdx === i) {
        highlight = "active";
      } else if (probeSeq && probeSeq.includes(i) && table[i] !== null) {
        highlight = "comparing";
      }
      return {
        index: i,
        items: slot
          ? [{ key: slot.key, value: slot.value, highlight }]
          : [],
      };
    });
  }

  function countItems(): number {
    return table.filter((s) => s !== null).length;
  }

  // Step 0: Initial empty table
  steps.push({
    id: stepId++,
    description: `Initialize a hash table with ${tableSize} slots using open addressing (linear probing). All elements are stored directly in the array. When a collision occurs, we probe the next slot: h(key, i) = (key % ${tableSize} + i) % ${tableSize}.`,
    action: "highlight",
    highlights: [],
    data: {
      buckets: toBuckets(),
      probeSequence: [],
      hashComputation: `h(key, i) = (key % ${tableSize} + i) % ${tableSize}`,
      loadFactor: 0,
    } satisfies HashTableStepData,
    variables: { tableSize, itemCount: 0 },
  });

  for (const key of keys) {
    const hashIndex = key % tableSize;
    const value = `v${key}`;
    const probeSequence: number[] = [];
    let probeCount = 0;
    let insertIndex = hashIndex;

    // Step: Show initial hash computation
    steps.push({
      id: stepId++,
      description: `Insert key ${key}: Compute h(${key}) = ${key} % ${tableSize} = ${hashIndex}. Check if slot ${hashIndex} is available.`,
      action: "hash",
      highlights: [{ indices: [hashIndex], color: "comparing" }],
      data: {
        buckets: toBuckets([], hashIndex),
        probeSequence: [hashIndex],
        currentBucket: hashIndex,
        hashComputation: `h(${key}) = ${key} % ${tableSize} = ${hashIndex}`,
        loadFactor: countItems() / tableSize,
      } satisfies HashTableStepData,
      variables: { key, hashIndex, probe: 0 },
    });

    // Linear probing loop
    while (table[insertIndex] !== null) {
      probeSequence.push(insertIndex);
      const occupant = table[insertIndex]!.key;

      steps.push({
        id: stepId++,
        description: `Slot ${insertIndex} is occupied by key ${occupant}. Collision! Linear probe: try next slot (${insertIndex} + 1) % ${tableSize} = ${(insertIndex + 1) % tableSize}.`,
        action: "compare",
        highlights: [{ indices: [insertIndex], color: "swapping" }],
        data: {
          buckets: toBuckets(probeSequence),
          probeSequence: [...probeSequence],
          currentBucket: insertIndex,
          hashComputation: `Slot ${insertIndex} occupied (key ${occupant}), probing...`,
          loadFactor: countItems() / tableSize,
        } satisfies HashTableStepData,
        variables: { key, currentSlot: insertIndex, occupant, probe: probeCount + 1 },
      });

      probeCount++;
      insertIndex = (insertIndex + 1) % tableSize;
    }

    probeSequence.push(insertIndex);

    // Step: Found empty slot
    if (probeCount > 0) {
      steps.push({
        id: stepId++,
        description: `Found empty slot at index ${insertIndex} after ${probeCount} probe(s). Probe sequence: [${probeSequence.join(" -> ")}].`,
        action: "visit",
        highlights: [{ indices: [insertIndex], color: "active" }],
        data: {
          buckets: toBuckets(probeSequence, insertIndex),
          probeSequence: [...probeSequence],
          currentBucket: insertIndex,
          hashComputation: `Empty slot found at index ${insertIndex}`,
          loadFactor: countItems() / tableSize,
        } satisfies HashTableStepData,
        variables: { key, insertIndex, probeCount, probeSequence: [...probeSequence] },
      });
    }

    // Insert the key
    table[insertIndex] = { key: String(key), value };
    const newCount = countItems();
    const newLoadFactor = newCount / tableSize;

    steps.push({
      id: stepId++,
      description: `Inserted (${key}, "${value}") at slot ${insertIndex}. ${probeCount > 0 ? `Required ${probeCount} probe(s) due to collisions.` : "Direct insertion, no collision."} Load factor: ${newCount}/${tableSize} = ${newLoadFactor.toFixed(2)}.`,
      action: "insert",
      highlights: [{ indices: [insertIndex], color: "active" }],
      data: {
        buckets: toBuckets([], insertIndex),
        probeSequence: [...probeSequence],
        currentBucket: insertIndex,
        hashComputation: `Inserted (${key}, "${value}") at slot ${insertIndex}`,
        loadFactor: newLoadFactor,
      } satisfies HashTableStepData,
      variables: { key, value, insertIndex, probeCount, loadFactor: newLoadFactor },
    });
  }

  // Final state: mark all items completed
  const finalBuckets: HashTableBucket[] = table.map((slot, i) => ({
    index: i,
    items: slot
      ? [{ key: slot.key, value: slot.value, highlight: "completed" as HighlightColor }]
      : [],
  }));

  const finalCount = countItems();
  const emptySlots = tableSize - finalCount;
  steps.push({
    id: stepId++,
    description: `Hash table complete! ${finalCount} items stored in ${tableSize} slots (${emptySlots} empty). Load factor: ${(finalCount / tableSize).toFixed(2)}. With linear probing, lookups follow the same probe sequence — they stop when they find the key or hit an empty slot. Keeping the load factor below 0.7 is critical for O(1) average performance.`,
    action: "complete",
    highlights: [],
    data: {
      buckets: finalBuckets,
      probeSequence: [],
      loadFactor: finalCount / tableSize,
      hashComputation: "All insertions complete",
    } satisfies HashTableStepData,
    variables: { totalItems: finalCount, emptySlots },
  });

  return steps;
}
