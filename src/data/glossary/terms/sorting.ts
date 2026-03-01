import type { GlossaryTermData } from "@/lib/visualization/types";

export const sortingTerms: GlossaryTermData[] = [
  {
    slug: "bubble-sort",
    name: "Bubble Sort",
    definition:
      "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The algorithm gets its name because smaller elements gradually 'bubble' to the top. While easy to understand, it is inefficient for large datasets.",
    formula: "Time: $O(n^2)$ average and worst case. Best (already sorted): $O(n)$. Space: $O(1)$",
    relatedTerms: ["selection-sort", "insertion-sort", "comparison-sort", "stable-sort", "adaptive-sorting"],
    category: "sorting",
    tags: ["comparison", "simple", "stable", "in-place"],
  },
  {
    slug: "selection-sort",
    name: "Selection Sort",
    definition:
      "A sorting algorithm that divides the list into sorted and unsorted regions. It repeatedly finds the minimum element from the unsorted region and places it at the end of the sorted region. Selection sort is simple but inefficient, and unlike bubble sort, it is not stable.",
    formula: "Time: $O(n^2)$ in all cases. Space: $O(1)$. Comparisons: $\\frac{n(n-1)}{2}$",
    relatedTerms: ["bubble-sort", "insertion-sort", "comparison-sort", "unstable-sort", "in-place-sorting"],
    category: "sorting",
    tags: ["comparison", "simple", "unstable", "in-place"],
  },
  {
    slug: "insertion-sort",
    name: "Insertion Sort",
    definition:
      "A sorting algorithm that builds the sorted array one element at a time by picking each element and inserting it into its correct position among the previously sorted elements. It works much like sorting playing cards in your hand and is very efficient for small or nearly sorted datasets.",
    formula: "Time: $O(n^2)$ worst, $O(n)$ best (nearly sorted). Space: $O(1)$",
    relatedTerms: ["bubble-sort", "shell-sort", "tim-sort", "stable-sort", "adaptive-sorting", "comparison-sort"],
    category: "sorting",
    tags: ["comparison", "simple", "stable", "in-place", "adaptive", "online"],
  },
  {
    slug: "merge-sort",
    name: "Merge Sort",
    definition:
      "A divide-and-conquer sorting algorithm that splits the array in half, recursively sorts each half, and then merges the two sorted halves back together. Merge sort guarantees O(n log n) performance in all cases and is stable, but requires additional memory for the merge step.",
    formalDefinition:
      "A recursive algorithm: $T(n) = 2T(n/2) + O(n)$, solved by the Master Theorem to give $\\Theta(n \\log n)$.",
    formula: "Time: $O(n \\log n)$ in all cases. Space: $O(n)$",
    relatedTerms: ["quick-sort", "merge-operation", "stable-sort", "comparison-sort", "external-sorting"],
    category: "sorting",
    tags: ["comparison", "divide-and-conquer", "stable", "recursive"],
  },
  {
    slug: "quick-sort",
    name: "Quick Sort",
    definition:
      "A divide-and-conquer sorting algorithm that selects a pivot element, partitions the array so that elements smaller than the pivot come before it and larger elements come after, then recursively sorts the partitions. Quick sort is typically the fastest general-purpose sorting algorithm in practice.",
    formula: "Average: $O(n \\log n)$. Worst (bad pivot): $O(n^2)$. Space: $O(\\log n)$ stack",
    relatedTerms: ["merge-sort", "partition", "pivot", "comparison-sort", "unstable-sort", "in-place-sorting"],
    category: "sorting",
    tags: ["comparison", "divide-and-conquer", "unstable", "in-place", "recursive"],
  },
  {
    slug: "heap-sort",
    name: "Heap Sort",
    definition:
      "A comparison-based sorting algorithm that uses a binary heap data structure. It first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end. Heap sort has guaranteed O(n log n) performance and sorts in-place, but is not stable.",
    formula: "Time: $O(n \\log n)$ in all cases. Space: $O(1)$",
    relatedTerms: ["heap", "max-heap", "selection-sort", "comparison-sort", "unstable-sort", "in-place-sorting"],
    category: "sorting",
    tags: ["comparison", "heap-based", "unstable", "in-place"],
  },
  {
    slug: "counting-sort",
    name: "Counting Sort",
    definition:
      "A non-comparison sorting algorithm that works by counting the number of occurrences of each distinct value. It then uses arithmetic on those counts to place each element in its correct sorted position. Counting sort is extremely fast when the range of input values (k) is not significantly larger than the number of elements (n).",
    formula: "Time: $O(n + k)$ where $k$ is the range of input values. Space: $O(n + k)$",
    relatedTerms: ["radix-sort", "bucket-sort", "non-comparison-sort", "stable-sort"],
    category: "sorting",
    tags: ["non-comparison", "integer", "stable", "linear"],
  },
  {
    slug: "radix-sort",
    name: "Radix Sort",
    definition:
      "A non-comparison sorting algorithm that sorts integers by processing individual digits, from the least significant digit to the most significant (LSD) or vice versa (MSD). It uses a stable sub-sort (usually counting sort) for each digit position and achieves linear time when the number of digits is constant.",
    formula: "Time: $O(d \\cdot (n + b))$ where $d$ = digits, $b$ = base. Space: $O(n + b)$",
    relatedTerms: ["counting-sort", "bucket-sort", "non-comparison-sort", "stable-sort"],
    category: "sorting",
    tags: ["non-comparison", "digit-based", "stable", "linear"],
  },
  {
    slug: "bucket-sort",
    name: "Bucket Sort",
    definition:
      "A distribution-based sorting algorithm that distributes elements into several buckets, sorts each bucket individually (often using insertion sort), and then concatenates the results. Bucket sort works best when input is uniformly distributed over a known range.",
    formula: "Average: $O(n + k)$ with $k$ buckets and uniform distribution. Worst: $O(n^2)$",
    relatedTerms: ["counting-sort", "radix-sort", "insertion-sort", "distribution-sort"],
    category: "sorting",
    tags: ["non-comparison", "distribution", "stable"],
  },
  {
    slug: "shell-sort",
    name: "Shell Sort",
    definition:
      "An optimization of insertion sort that allows exchanges of elements far apart. It starts by sorting pairs of elements far apart and progressively reduces the gap between compared elements. The choice of gap sequence significantly affects performance, with some sequences achieving sub-quadratic time.",
    formula: "Time depends on gap sequence. Typical: $O(n^{3/2})$ to $O(n \\log^2 n)$. Space: $O(1)$",
    relatedTerms: ["insertion-sort", "comparison-sort", "in-place-sorting"],
    category: "sorting",
    tags: ["comparison", "gap-based", "unstable", "in-place"],
  },
  {
    slug: "tim-sort",
    name: "Tim Sort",
    definition:
      "A hybrid sorting algorithm derived from merge sort and insertion sort, designed for real-world data that often contains existing ordered subsequences (runs). Tim sort is the default sorting algorithm in Python, Java, and many other languages because of its excellent performance on partially sorted data.",
    formula: "Time: $O(n \\log n)$ worst case, $O(n)$ best (already sorted). Space: $O(n)$",
    relatedTerms: ["merge-sort", "insertion-sort", "adaptive-sorting", "stable-sort"],
    category: "sorting",
    tags: ["hybrid", "adaptive", "stable", "practical"],
  },
  {
    slug: "comparison-sort",
    name: "Comparison Sort",
    definition:
      "A category of sorting algorithms that determine the order of elements by comparing pairs of elements. Every comparison-based sorting algorithm has a theoretical lower bound of O(n log n) comparisons in the worst case. Examples include merge sort, quick sort, and heap sort.",
    formalDefinition:
      "Any sorting algorithm that operates solely by comparing elements. The decision-tree model proves a lower bound of $\\Omega(n \\log n)$ comparisons.",
    formula: "Lower bound: $\\lceil \\log_2(n!) \\rceil \\geq \\Omega(n \\log n)$ comparisons",
    relatedTerms: ["non-comparison-sort", "merge-sort", "quick-sort", "heap-sort"],
    category: "sorting",
    tags: ["theoretical", "category", "lower-bound"],
  },
  {
    slug: "non-comparison-sort",
    name: "Non-Comparison Sort",
    definition:
      "A category of sorting algorithms that do not rely on comparing elements to determine order. Instead, they exploit the structure of the data (like integer digits or value ranges) to achieve linear time. Examples include counting sort, radix sort, and bucket sort.",
    formula: "Can achieve $O(n)$ time under certain conditions, beating the $\\Omega(n \\log n)$ comparison lower bound",
    relatedTerms: ["comparison-sort", "counting-sort", "radix-sort", "bucket-sort"],
    category: "sorting",
    tags: ["theoretical", "category", "linear-time"],
  },
  {
    slug: "stable-sort",
    name: "Stable Sort",
    definition:
      "A sorting algorithm that preserves the relative order of elements with equal keys. If two elements have the same sorting key, a stable sort guarantees they will appear in the same order in the output as they did in the input. This property is important when sorting by multiple criteria.",
    relatedTerms: ["unstable-sort", "merge-sort", "insertion-sort", "counting-sort", "tim-sort"],
    category: "sorting",
    tags: ["property", "order-preserving"],
  },
  {
    slug: "unstable-sort",
    name: "Unstable Sort",
    definition:
      "A sorting algorithm that does not guarantee the preservation of the relative order of equal elements. After sorting, elements with the same key may appear in a different order than in the original input. Quick sort, heap sort, and selection sort are examples of unstable sorts.",
    relatedTerms: ["stable-sort", "quick-sort", "heap-sort", "selection-sort"],
    category: "sorting",
    tags: ["property", "non-preserving"],
  },
  {
    slug: "in-place-sorting",
    name: "In-Place Sorting",
    definition:
      "A sorting algorithm that requires only a constant amount of extra memory beyond the original array, typically O(1) auxiliary space. In-place algorithms are memory-efficient because they rearrange elements within the existing array. Examples include quick sort, heap sort, and insertion sort.",
    formula: "Auxiliary space: $O(1)$ (not counting the input array or recursion stack)",
    relatedTerms: ["quick-sort", "heap-sort", "insertion-sort", "merge-sort"],
    category: "sorting",
    tags: ["property", "memory-efficient", "space"],
  },
  {
    slug: "external-sorting",
    name: "External Sorting",
    definition:
      "Sorting algorithms designed for data too large to fit entirely in main memory. They work by dividing the data into manageable chunks, sorting each chunk in memory, and then merging the sorted chunks. External merge sort is the most common approach, widely used in database systems.",
    relatedTerms: ["merge-sort", "internal-sorting", "merge-operation"],
    category: "sorting",
    tags: ["disk-based", "large-data", "merge"],
  },
  {
    slug: "internal-sorting",
    name: "Internal Sorting",
    definition:
      "Sorting algorithms that operate on data that fits entirely within a computer's main memory (RAM). Most standard sorting algorithms (quick sort, merge sort, heap sort) are internal sorts. The term distinguishes them from external sorting, which handles data too large for memory.",
    relatedTerms: ["external-sorting", "quick-sort", "merge-sort", "heap-sort"],
    category: "sorting",
    tags: ["memory-based", "standard"],
  },
  {
    slug: "partition",
    name: "Partition",
    definition:
      "A fundamental operation in quick sort that rearranges elements in an array around a pivot so that elements less than the pivot are on its left and elements greater are on its right. The Lomuto and Hoare partition schemes are the two most common implementations.",
    relatedTerms: ["quick-sort", "pivot", "comparison-sort"],
    category: "sorting",
    tags: ["operation", "quicksort", "divide"],
  },
  {
    slug: "pivot",
    name: "Pivot",
    definition:
      "The element chosen in quick sort around which the array is partitioned. The choice of pivot significantly affects performance: a poor choice (like always picking the smallest or largest element) leads to O(n^2) behavior, while a good choice (like the median) leads to O(n log n). Common strategies include random selection and median-of-three.",
    relatedTerms: ["quick-sort", "partition"],
    category: "sorting",
    tags: ["quicksort", "element", "selection"],
  },
  {
    slug: "merge-operation",
    name: "Merge Operation",
    definition:
      "The process of combining two sorted sequences into a single sorted sequence. This is the key step in merge sort: given two sorted halves, the merge operation compares the front elements of each half and places the smaller one into the output, repeating until both halves are exhausted.",
    formula: "Time to merge two sequences of total size $n$: $O(n)$",
    relatedTerms: ["merge-sort", "external-sorting", "stable-sort"],
    category: "sorting",
    tags: ["operation", "combining", "merge-sort"],
  },
  {
    slug: "inversion-count",
    name: "Inversion Count",
    definition:
      "The number of pairs of elements in an array that are out of their natural order. Formally, a pair (i, j) is an inversion if i < j but A[i] > A[j]. The inversion count measures how far an array is from being sorted and can be computed efficiently using a modified merge sort.",
    formalDefinition:
      "For an array $A$ of size $n$, the inversion count is $|\\{(i,j) : i < j \\text{ and } A[i] > A[j]\\}|$.",
    formula: "Max inversions: $\\frac{n(n-1)}{2}$. Can be counted in $O(n \\log n)$ via merge sort",
    relatedTerms: ["merge-sort", "bubble-sort", "comparison-sort"],
    category: "sorting",
    tags: ["metric", "disorder", "analysis"],
  },
  {
    slug: "adaptive-sorting",
    name: "Adaptive Sorting",
    definition:
      "A sorting algorithm whose performance improves when the input is already partially sorted. Adaptive algorithms take advantage of existing order in the data, running faster on nearly sorted inputs than on random ones. Insertion sort, Tim sort, and natural merge sort are adaptive.",
    relatedTerms: ["insertion-sort", "tim-sort", "bubble-sort", "inversion-count"],
    category: "sorting",
    tags: ["property", "optimization", "partial-order"],
  },
  {
    slug: "sorting-network",
    name: "Sorting Network",
    definition:
      "A fixed sequence of comparators (compare-and-swap operations) that will sort any input of a given size. Unlike software sorting algorithms, sorting networks have a predetermined comparison pattern, making them suitable for hardware implementation and parallel processing.",
    formula: "AKS network: $O(n \\log n)$ comparators. Practical: Bitonic sort uses $O(n \\log^2 n)$",
    relatedTerms: ["comparison-sort", "bubble-sort"],
    category: "sorting",
    tags: ["hardware", "parallel", "network", "fixed"],
  },
  {
    slug: "distribution-sort",
    name: "Distribution Sort",
    definition:
      "A family of sorting algorithms that work by distributing elements into groups or buckets based on their values, then collecting the groups in order. Unlike comparison sorts, distribution sorts exploit the structure of keys to achieve better-than-O(n log n) time. Counting sort, radix sort, and bucket sort are examples.",
    relatedTerms: ["bucket-sort", "counting-sort", "radix-sort", "non-comparison-sort"],
    category: "sorting",
    tags: ["category", "non-comparison", "grouping"],
  },
];
