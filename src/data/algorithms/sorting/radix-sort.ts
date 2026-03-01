import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const radixSort: AlgorithmMetadata = {
  id: "radix-sort",
  name: "Radix Sort",
  category: "sorting",
  subcategory: "Non-Comparison Sorting",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(d × (n + k))",
    average: "O(d × (n + k))",
    worst: "O(d × (n + k))",
    note: "Where d is the number of digits and k is the radix (base, typically 10). Efficient when d is small.",
  },
  spaceComplexity: {
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    note: "Requires auxiliary space for buckets and output array.",
  },
  description:
    "Radix Sort is a non-comparison-based sorting algorithm that sorts integers by processing each digit position, from the least significant digit (LSD) to the most significant digit (MSD). At each digit position, a stable sort (typically Counting Sort) is used to rearrange elements based on that digit's value.\n\nThe LSD variant starts from the rightmost digit and works left. For each digit position, elements are distributed into 10 buckets (for base-10 numbers) based on the value of the current digit. After all elements are placed, the buckets are concatenated back into the array. This process repeats for each digit position until the most significant digit has been processed.\n\nRadix Sort achieves linear time complexity when the number of digits (d) is constant or small relative to n. It is particularly effective for sorting large sets of fixed-length integers, strings, or keys. Since it relies on a stable subroutine, Radix Sort itself is stable. However, it is limited to data types that can be decomposed into orderable digits or characters.",
  shortDescription:
    "A non-comparison sort that processes digits from least significant to most significant using bucket distribution.",
  pseudocode: `procedure radixSort(A: array of non-negative integers)
    d = number of digits of max(A)

    for digit = 0 to d - 1 do
        // Use stable sort (counting sort) on current digit
        buckets = array of 10 empty lists

        for each element x in A do
            d = digit-th digit of x
            append x to buckets[d]
        end for

        // Collect from buckets back into A
        A = concatenate(buckets[0], buckets[1], ..., buckets[9])
    end for

    return A
end procedure`,
  implementations: {
    python: `def radix_sort(arr: list[int]) -> list[int]:
    if not arr:
        return arr

    max_val = max(arr)
    exp = 1  # Current digit position (1s, 10s, 100s, ...)

    while max_val // exp > 0:
        # Create 10 buckets
        buckets = [[] for _ in range(10)]

        # Distribute into buckets based on current digit
        for x in arr:
            digit = (x // exp) % 10
            buckets[digit].append(x)

        # Collect from buckets
        arr = []
        for bucket in buckets:
            arr.extend(bucket)

        exp *= 10

    return arr


# Example usage
arr = [170, 45, 75, 90, 802, 24, 2, 66]
print(radix_sort(arr))  # [2, 24, 45, 66, 75, 90, 170, 802]`,
    javascript: `function radixSort(arr) {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    // Create 10 buckets
    const buckets = Array.from({ length: 10 }, () => []);

    // Distribute into buckets based on current digit
    for (const x of arr) {
      const digit = Math.floor(x / exp) % 10;
      buckets[digit].push(x);
    }

    // Collect from buckets
    arr = buckets.flat();
    exp *= 10;
  }

  return arr;
}

// Example usage
const arr = [170, 45, 75, 90, 802, 24, 2, 66];
console.log(radixSort(arr)); // [2, 24, 45, 66, 75, 90, 170, 802]`,
  },
  useCases: [
    "Sorting large datasets of fixed-length integers (e.g., phone numbers, ZIP codes)",
    "Sorting strings of equal length (e.g., fixed-format dates, license plates)",
    "When comparison-based O(n log n) sorts are a bottleneck and values have bounded digit count",
    "Card sorting machines (the original application of radix sort)",
  ],
  relatedAlgorithms: [
    "counting-sort",
    "bucket-sort",
    "merge-sort",
    "quick-sort",
  ],
  glossaryTerms: [
    "non-comparison sort",
    "stable sort",
    "radix",
    "LSD radix sort",
    "MSD radix sort",
    "bucket",
    "digit extraction",
  ],
  tags: [
    "sorting",
    "non-comparison",
    "stable",
    "linear-time",
    "intermediate",
    "integer-sort",
    "digit-based",
  ],
};
