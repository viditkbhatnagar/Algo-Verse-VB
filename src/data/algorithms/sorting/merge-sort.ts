import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const mergeSort: AlgorithmMetadata = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "sorting",
  subcategory: "Comparison-Based Sorting",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Guaranteed O(n log n) in all cases because the array is always split in half and the merge step is always linear.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Requires O(n) auxiliary space for the temporary arrays used during the merge step, plus O(log n) for recursion stack.",
  },
  description: `Merge Sort is a divide-and-conquer sorting algorithm that was invented by John von Neumann in 1945. It works by recursively dividing the input array into two halves, sorting each half independently, and then merging the two sorted halves back together into a single sorted array. The key insight is that merging two already-sorted arrays into one sorted array can be done in linear time, and the recursive division creates a balanced binary tree of subproblems with O(log n) levels, yielding an overall time complexity of O(n log n).

The divide step splits the array at its midpoint into two roughly equal subarrays. This splitting continues recursively until each subarray contains a single element (which is trivially sorted). The conquer step then begins: pairs of single-element arrays are merged into sorted two-element arrays, pairs of two-element arrays are merged into sorted four-element arrays, and so on, until the entire array is reconstructed in sorted order. The merge operation uses two pointers to traverse both sorted subarrays simultaneously, always selecting the smaller of the two current elements to place next in the output array.

Merge Sort guarantees O(n log n) performance regardless of the input order, which is a significant advantage over algorithms like Quick Sort that can degrade to O(n²) in the worst case. It is also a stable sorting algorithm, preserving the relative order of equal elements. These properties make Merge Sort the algorithm of choice for sorting linked lists (where it can be implemented with O(1) extra space) and for external sorting scenarios where data is too large to fit in memory and must be sorted in chunks from disk.

The primary drawback of Merge Sort is its O(n) space requirement for arrays, which makes it less suitable than in-place algorithms when memory is constrained. However, this trade-off is often acceptable given its consistent performance guarantees. Merge Sort forms the basis of more sophisticated algorithms like TimSort, which combines Merge Sort with Insertion Sort and exploits existing runs of sorted data in real-world inputs. TimSort is the default sorting algorithm in Python, Java, and many other modern programming languages.`,
  shortDescription:
    "A stable divide-and-conquer sorting algorithm that recursively splits the array in half, sorts each half, and merges them back together in O(n log n) time.",
  pseudocode: `procedure mergeSort(A: list of sortable items, left: int, right: int)
    if left < right then
        mid = left + (right - left) / 2
        mergeSort(A, left, mid)
        mergeSort(A, mid + 1, right)
        merge(A, left, mid, right)
    end if
end procedure

procedure merge(A: list, left: int, mid: int, right: int)
    create temporary arrays L = A[left..mid] and R = A[mid+1..right]
    i = 0, j = 0, k = left

    while i < length(L) and j < length(R) do
        if L[i] <= R[j] then
            A[k] = L[i]
            i = i + 1
        else
            A[k] = R[j]
            j = j + 1
        end if
        k = k + 1
    end while

    // Copy remaining elements of L and R
    while i < length(L) do
        A[k] = L[i]
        i = i + 1
        k = k + 1
    end while

    while j < length(R) do
        A[k] = R[j]
        j = j + 1
        k = k + 1
    end while
end procedure`,
  implementations: {
    python: `def merge_sort(arr: list) -> list:
    """Sort a list in ascending order using Merge Sort."""
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left: list, right: list) -> list:
    """Merge two sorted lists into a single sorted list."""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result


# Example usage
if __name__ == "__main__":
    data = [38, 27, 43, 3, 9, 82, 10]
    print("Original:", data)
    print("Sorted:  ", merge_sort(data))`,
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i), right.slice(j));
}

// Example usage
const data = [38, 27, 43, 3, 9, 82, 10];
console.log("Original:", data);
console.log("Sorted:  ", mergeSort(data));`,
  },
  useCases: [
    "Sorting linked lists efficiently, where Merge Sort can operate in O(1) extra space",
    "External sorting of large datasets that do not fit in memory, processing data in chunks from disk",
    "Applications requiring guaranteed O(n log n) worst-case performance regardless of input distribution",
    "Stable sorting needs where preserving the relative order of equal elements is essential",
    "Parallel and distributed sorting, since the independent subproblems can be processed concurrently",
  ],
  relatedAlgorithms: [
    "bubble-sort",
    "insertion-sort",
    "quick-sort",
    "heap-sort",
    "selection-sort",
  ],
  glossaryTerms: [
    "divide and conquer",
    "stable sort",
    "comparison sort",
    "merge operation",
    "recursion",
    "external sorting",
    "time complexity",
  ],
  tags: [
    "sorting",
    "comparison-based",
    "stable",
    "divide-and-conquer",
    "intermediate",
    "linearithmic",
    "recursive",
  ],
};
