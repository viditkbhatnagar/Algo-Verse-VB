import type { VisualizationStep, HashTableStepData, HashTableBucket, HighlightColor } from "@/lib/visualization/types";

/**
 * Generate visualization steps for Hash Table with Chaining.
 * Uses h(key) = key % tableSize. Inserts keys [15, 25, 35, 10, 20]
 * into a table of size 7 to demonstrate collisions and chain building.
 */
export function generateHashTableChainingSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const tableSize = 7;
  const keys = [15, 25, 35, 10, 20];

  // Initialize empty buckets
  const buckets: HashTableBucket[] = Array.from({ length: tableSize }, (_, i) => ({
    index: i,
    items: [],
  }));

  function cloneBuckets(): HashTableBucket[] {
    return buckets.map((b) => ({
      index: b.index,
      items: b.items.map((item) => ({ ...item })),
    }));
  }

  function countItems(): number {
    return buckets.reduce((sum, b) => sum + b.items.length, 0);
  }

  // Step 0: Initial empty table
  steps.push({
    id: stepId++,
    description: `Initialize a hash table with ${tableSize} buckets using separate chaining. Each bucket holds a linked list of key-value pairs. Hash function: h(key) = key % ${tableSize}.`,
    action: "highlight",
    highlights: [],
    data: {
      buckets: cloneBuckets(),
      loadFactor: 0,
      hashComputation: `h(key) = key % ${tableSize}`,
    } satisfies HashTableStepData,
    variables: { tableSize, itemCount: 0, loadFactor: 0 },
  });

  // Insert each key
  for (const key of keys) {
    const hashIndex = key % tableSize;
    const value = `v${key}`;
    const existingChainLength = buckets[hashIndex].items.length;
    const isCollision = existingChainLength > 0;

    // Step: Show hash computation
    steps.push({
      id: stepId++,
      description: `Insert key ${key}: Compute hash h(${key}) = ${key} % ${tableSize} = ${hashIndex}. ${isCollision ? `Bucket ${hashIndex} already has ${existingChainLength} item(s) — a collision will occur.` : `Bucket ${hashIndex} is empty.`}`,
      action: "hash",
      highlights: [{ indices: [hashIndex], color: "comparing" }],
      data: {
        buckets: cloneBuckets(),
        currentBucket: hashIndex,
        hashComputation: `h(${key}) = ${key} % ${tableSize} = ${hashIndex}`,
        loadFactor: countItems() / tableSize,
      } satisfies HashTableStepData,
      variables: { key, hashIndex, isCollision, chainLength: existingChainLength },
    });

    // Step: Navigate to bucket
    if (isCollision) {
      const existingKeys = buckets[hashIndex].items.map((i) => i.key).join(", ");
      steps.push({
        id: stepId++,
        description: `Collision detected at bucket ${hashIndex}! Existing key(s): [${existingKeys}]. With chaining, we simply add the new item to the head of the linked list in this bucket.`,
        action: "visit",
        highlights: [{ indices: [hashIndex], color: "swapping" }],
        data: {
          buckets: cloneBuckets(),
          currentBucket: hashIndex,
          hashComputation: `Collision at bucket ${hashIndex}`,
          loadFactor: countItems() / tableSize,
        } satisfies HashTableStepData,
        variables: { key, hashIndex, existingKeys },
      });
    }

    // Insert at head of chain
    buckets[hashIndex].items.unshift({
      key: String(key),
      value,
      highlight: "active" as HighlightColor,
    });

    const newCount = countItems();
    const newLoadFactor = newCount / tableSize;

    steps.push({
      id: stepId++,
      description: `Inserted (${key}, "${value}") at the head of bucket ${hashIndex}'s chain. Chain length is now ${buckets[hashIndex].items.length}. Load factor: ${newCount}/${tableSize} = ${newLoadFactor.toFixed(2)}.`,
      action: "insert",
      highlights: [{ indices: [hashIndex], color: "active" }],
      data: {
        buckets: cloneBuckets(),
        currentBucket: hashIndex,
        hashComputation: `Inserted (${key}, "${value}")`,
        loadFactor: newLoadFactor,
      } satisfies HashTableStepData,
      variables: { key, value, hashIndex, chainLength: buckets[hashIndex].items.length, loadFactor: newLoadFactor },
    });

    // Clear the highlight for next iteration
    buckets[hashIndex].items[0].highlight = undefined;
  }

  // Final state: mark all items as completed
  for (const bucket of buckets) {
    for (const item of bucket.items) {
      item.highlight = "completed" as HighlightColor;
    }
  }

  const finalCount = countItems();
  const collisionBuckets = buckets.filter((b) => b.items.length > 1);
  steps.push({
    id: stepId++,
    description: `Hash table complete! ${finalCount} items stored across ${tableSize} buckets. ${collisionBuckets.length} bucket(s) have chains with multiple items (collisions). The longest chain has ${Math.max(...buckets.map((b) => b.items.length))} item(s). Average-case lookup is O(1) when the load factor is low and the hash function distributes keys uniformly.`,
    action: "complete",
    highlights: [],
    data: {
      buckets: cloneBuckets(),
      loadFactor: finalCount / tableSize,
      hashComputation: "All insertions complete",
    } satisfies HashTableStepData,
    variables: { totalItems: finalCount, collisions: collisionBuckets.length },
  });

  return steps;
}
