import type { GlossaryTermData } from "@/lib/visualization/types";

export const dataStructuresTerms: GlossaryTermData[] = [
  {
    slug: "array",
    name: "Array",
    definition:
      "A contiguous block of memory that stores elements of the same type, accessible by numeric index. Arrays provide constant-time access to any element by position, making them one of the most fundamental data structures in computing.",
    formalDefinition:
      "A fixed-size sequential collection of elements of the same type stored in contiguous memory locations, where each element is identified by an index or key.",
    formula: "Access: $O(1)$, Search: $O(n)$, Insert/Delete: $O(n)$",
    relatedTerms: ["linked-list", "circular-buffer", "hash-table"],
    category: "data-structures",
    tags: ["linear", "sequential", "indexed", "primitive"],
  },
  {
    slug: "linked-list",
    name: "Linked List",
    definition:
      "A linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, linked lists do not store elements contiguously in memory, which allows efficient insertions and deletions without shifting elements.",
    formalDefinition:
      "A sequence of nodes where each node stores a value and a reference (pointer) to its successor node, with the last node pointing to null.",
    formula: "Access: $O(n)$, Search: $O(n)$, Insert/Delete at head: $O(1)$",
    relatedTerms: ["doubly-linked-list", "circular-linked-list", "node", "array"],
    category: "data-structures",
    tags: ["linear", "sequential", "dynamic", "pointer-based"],
  },
  {
    slug: "doubly-linked-list",
    name: "Doubly Linked List",
    definition:
      "A linked list where each node has pointers to both the next and the previous node. This allows traversal in both directions and makes deletion of a known node an O(1) operation, at the cost of extra memory for the additional pointer.",
    formula: "Access: $O(n)$, Insert/Delete at known node: $O(1)$",
    relatedTerms: ["linked-list", "circular-linked-list", "deque", "node"],
    category: "data-structures",
    tags: ["linear", "sequential", "dynamic", "bidirectional"],
  },
  {
    slug: "circular-linked-list",
    name: "Circular Linked List",
    definition:
      "A variation of a linked list in which the last node points back to the first node instead of null, forming a circle. This is useful for applications that need continuous cycling through elements, like round-robin scheduling.",
    relatedTerms: ["linked-list", "doubly-linked-list", "circular-buffer", "node"],
    category: "data-structures",
    tags: ["linear", "circular", "dynamic"],
  },
  {
    slug: "stack",
    name: "Stack",
    definition:
      "A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end, called the top. Think of it like a stack of plates: you can only add or remove from the top. Stacks are essential for function call management, undo operations, and expression evaluation.",
    formalDefinition:
      "An abstract data type that serves as a collection of elements with two principal operations: push (adds to the top) and pop (removes from the top), following LIFO ordering.",
    formula: "Push: $O(1)$, Pop: $O(1)$, Peek: $O(1)$",
    relatedTerms: ["queue", "deque", "array", "linked-list"],
    category: "data-structures",
    tags: ["linear", "LIFO", "abstract"],
  },
  {
    slug: "queue",
    name: "Queue",
    definition:
      "A First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front, like a line of people waiting. Queues are widely used in scheduling, buffering, and breadth-first search algorithms.",
    formalDefinition:
      "An abstract data type that maintains elements in FIFO order with enqueue (add to rear) and dequeue (remove from front) as principal operations.",
    formula: "Enqueue: $O(1)$, Dequeue: $O(1)$, Peek: $O(1)$",
    relatedTerms: ["stack", "deque", "priority-queue", "circular-buffer"],
    category: "data-structures",
    tags: ["linear", "FIFO", "abstract"],
  },
  {
    slug: "deque",
    name: "Deque",
    definition:
      "Short for Double-Ended Queue, a deque allows insertion and removal of elements from both the front and the rear. It combines the capabilities of both stacks and queues, making it versatile for sliding window problems and palindrome checking.",
    formula: "Insert/Remove at either end: $O(1)$",
    relatedTerms: ["queue", "stack", "circular-buffer"],
    category: "data-structures",
    tags: ["linear", "double-ended", "abstract"],
  },
  {
    slug: "priority-queue",
    name: "Priority Queue",
    definition:
      "An abstract data structure where each element has an associated priority, and the element with the highest (or lowest) priority is served first regardless of insertion order. Priority queues are typically implemented using heaps and power algorithms like Dijkstra's shortest path.",
    formula: "Insert: $O(\\log n)$, Extract-Min/Max: $O(\\log n)$, Peek: $O(1)$",
    relatedTerms: ["heap", "min-heap", "max-heap", "queue"],
    category: "data-structures",
    tags: ["abstract", "priority", "heap-based"],
  },
  {
    slug: "heap",
    name: "Heap",
    definition:
      "A specialized complete binary tree that satisfies the heap property: in a max heap every parent is greater than or equal to its children, and in a min heap every parent is less than or equal to its children. Heaps are the standard implementation for priority queues.",
    formalDefinition:
      "A complete binary tree stored in an array where for a max heap, $A[\\text{parent}(i)] \\geq A[i]$, and for a min heap, $A[\\text{parent}(i)] \\leq A[i]$ for all nodes $i$.",
    formula: "For node at index $i$: parent $= \\lfloor (i-1)/2 \\rfloor$, left child $= 2i+1$, right child $= 2i+2$",
    relatedTerms: ["min-heap", "max-heap", "priority-queue", "binary-tree", "heap-sort"],
    category: "data-structures",
    tags: ["tree", "complete", "array-backed"],
  },
  {
    slug: "min-heap",
    name: "Min Heap",
    definition:
      "A heap where the smallest element is always at the root. Every parent node has a value less than or equal to its children. Min heaps are used when you need fast access to the minimum element, such as in Dijkstra's algorithm or job scheduling.",
    formula: "Property: $A[\\text{parent}(i)] \\leq A[i]$ for all nodes $i$",
    relatedTerms: ["heap", "max-heap", "priority-queue"],
    category: "data-structures",
    tags: ["tree", "heap", "minimum"],
  },
  {
    slug: "max-heap",
    name: "Max Heap",
    definition:
      "A heap where the largest element is always at the root. Every parent node has a value greater than or equal to its children. Max heaps are used in heap sort and when you need fast access to the maximum element.",
    formula: "Property: $A[\\text{parent}(i)] \\geq A[i]$ for all nodes $i$",
    relatedTerms: ["heap", "min-heap", "priority-queue", "heap-sort"],
    category: "data-structures",
    tags: ["tree", "heap", "maximum"],
  },
  {
    slug: "binary-tree",
    name: "Binary Tree",
    definition:
      "A tree data structure where each node has at most two children, referred to as the left child and the right child. Binary trees form the basis for many more specialized structures like BSTs, heaps, and expression trees.",
    formalDefinition:
      "A rooted tree in which every node has at most two children, partitioned into a left subtree and a right subtree.",
    formula: "Max nodes at depth $d$: $2^d$. Max total nodes with height $h$: $2^{h+1} - 1$",
    relatedTerms: ["binary-search-tree", "avl-tree", "red-black-tree", "heap", "node"],
    category: "data-structures",
    tags: ["tree", "hierarchical", "recursive"],
  },
  {
    slug: "binary-search-tree",
    name: "Binary Search Tree",
    definition:
      "A binary tree where for every node, all values in its left subtree are smaller and all values in its right subtree are larger. This ordering property enables efficient searching, insertion, and deletion, similar to how binary search works on a sorted array.",
    formalDefinition:
      "A binary tree $T$ such that for every node $x$: all keys in the left subtree of $x$ are less than $x.key$, and all keys in the right subtree are greater than $x.key$.",
    formula: "Average case: $O(\\log n)$ for search, insert, delete. Worst case (skewed): $O(n)$",
    relatedTerms: ["binary-tree", "avl-tree", "red-black-tree", "b-tree"],
    category: "data-structures",
    tags: ["tree", "sorted", "searchable"],
  },
  {
    slug: "avl-tree",
    name: "AVL Tree",
    definition:
      "A self-balancing binary search tree where the heights of the left and right subtrees of every node differ by at most one. Named after inventors Adelson-Velsky and Landis, AVL trees guarantee O(log n) operations by performing rotations to maintain balance after insertions and deletions.",
    formalDefinition:
      "A BST where for every node $v$: $|\\text{height}(v.\\text{left}) - \\text{height}(v.\\text{right})| \\leq 1$.",
    formula: "Search, Insert, Delete: $O(\\log n)$ guaranteed",
    relatedTerms: ["binary-search-tree", "red-black-tree", "binary-tree"],
    category: "data-structures",
    tags: ["tree", "balanced", "self-balancing", "rotations"],
  },
  {
    slug: "red-black-tree",
    name: "Red-Black Tree",
    definition:
      "A self-balancing binary search tree where each node is colored red or black, and specific coloring rules ensure the tree remains approximately balanced. Red-black trees are used in many language standard libraries (e.g., Java TreeMap, C++ std::map) because they offer good worst-case guarantees with fewer rotations than AVL trees.",
    formula: "Height $\\leq 2 \\log_2(n+1)$. Search, Insert, Delete: $O(\\log n)$",
    relatedTerms: ["binary-search-tree", "avl-tree", "b-tree"],
    category: "data-structures",
    tags: ["tree", "balanced", "self-balancing", "colored"],
  },
  {
    slug: "b-tree",
    name: "B-Tree",
    definition:
      "A self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time. Unlike binary trees, B-tree nodes can have many children, making them ideal for databases and file systems where minimizing disk reads is critical.",
    formalDefinition:
      "A balanced m-ary search tree where each node can contain between $\\lceil m/2 \\rceil - 1$ and $m - 1$ keys, and all leaves are at the same depth.",
    formula: "Search, Insert, Delete: $O(\\log n)$. Height: $O(\\log_m n)$",
    relatedTerms: ["binary-search-tree", "red-black-tree", "trie"],
    category: "data-structures",
    tags: ["tree", "balanced", "disk-based", "database"],
  },
  {
    slug: "trie",
    name: "Trie",
    definition:
      "A tree-like data structure used to store a dynamic set of strings, where each node represents a character and paths from root to leaf spell out stored words. Tries provide very fast prefix-based lookups, making them ideal for autocomplete, spell checkers, and IP routing.",
    formalDefinition:
      "A rooted tree where each edge is labeled with a character, and the concatenation of edge labels from root to any node represents a prefix of at least one stored string.",
    formula: "Search/Insert: $O(L)$ where $L$ is the length of the key",
    relatedTerms: ["suffix-tree", "hash-table", "binary-search-tree"],
    category: "data-structures",
    tags: ["tree", "string", "prefix", "autocomplete"],
  },
  {
    slug: "suffix-tree",
    name: "Suffix Tree",
    definition:
      "A compressed trie of all suffixes of a given string. Suffix trees enable extremely fast pattern matching, substring search, and many other string operations. They can be built in linear time and are fundamental to bioinformatics and text processing.",
    formula: "Build: $O(n)$ (Ukkonen's algorithm). Pattern search: $O(m)$ where $m$ is pattern length",
    relatedTerms: ["trie", "hash-table"],
    category: "data-structures",
    tags: ["tree", "string", "suffix", "pattern-matching"],
  },
  {
    slug: "hash-table",
    name: "Hash Table",
    definition:
      "A data structure that maps keys to values using a hash function to compute an index into an array of buckets. Hash tables provide near-constant-time average performance for lookups, insertions, and deletions, making them one of the most widely used data structures in practice.",
    formalDefinition:
      "A data structure that implements an associative array by using a hash function $h: K \\rightarrow \\{0, 1, ..., m-1\\}$ to map keys to bucket indices.",
    formula: "Average: $O(1)$ for search, insert, delete. Worst case: $O(n)$",
    relatedTerms: [
      "hash-function",
      "hash-collision",
      "open-addressing",
      "separate-chaining",
      "load-factor",
      "rehashing",
    ],
    category: "data-structures",
    tags: ["associative", "key-value", "hashing"],
  },
  {
    slug: "hash-function",
    name: "Hash Function",
    definition:
      "A function that converts an input (key) of arbitrary size into a fixed-size integer (hash code), which is then used as an index in a hash table. A good hash function distributes keys uniformly across the table to minimize collisions.",
    formalDefinition:
      "A function $h: U \\rightarrow \\{0, 1, ..., m-1\\}$ that maps elements from a universe $U$ of keys to indices in a table of size $m$.",
    relatedTerms: ["hash-table", "hash-collision", "load-factor"],
    category: "data-structures",
    tags: ["hashing", "mapping", "function"],
  },
  {
    slug: "hash-collision",
    name: "Hash Collision",
    definition:
      "Occurs when two different keys produce the same hash value, mapping to the same index in a hash table. Collisions are inevitable when the key space is larger than the table size (by the pigeonhole principle) and must be handled using techniques like chaining or open addressing.",
    formalDefinition:
      "A collision occurs when $h(k_1) = h(k_2)$ for distinct keys $k_1 \\neq k_2$.",
    relatedTerms: ["hash-table", "hash-function", "open-addressing", "separate-chaining"],
    category: "data-structures",
    tags: ["hashing", "collision", "resolution"],
  },
  {
    slug: "open-addressing",
    name: "Open Addressing",
    definition:
      "A collision resolution technique for hash tables where, upon a collision, the algorithm probes (searches) for the next available slot in the table itself. Common probing strategies include linear probing, quadratic probing, and double hashing.",
    relatedTerms: ["hash-table", "hash-collision", "separate-chaining", "load-factor"],
    category: "data-structures",
    tags: ["hashing", "collision-resolution", "probing"],
  },
  {
    slug: "separate-chaining",
    name: "Separate Chaining",
    definition:
      "A collision resolution technique where each bucket in a hash table stores a linked list (or other collection) of all elements that hash to the same index. This approach is simple and performs well when the load factor is moderate.",
    relatedTerms: ["hash-table", "hash-collision", "open-addressing", "linked-list", "load-factor"],
    category: "data-structures",
    tags: ["hashing", "collision-resolution", "chaining"],
  },
  {
    slug: "load-factor",
    name: "Load Factor",
    definition:
      "The ratio of the number of stored elements to the total number of buckets in a hash table. A higher load factor means more collisions and slower performance. When the load factor exceeds a threshold (commonly 0.75), the table is resized through rehashing.",
    formalDefinition:
      "For a hash table with $n$ elements and $m$ buckets, the load factor is $\\alpha = n / m$.",
    formula: "$\\alpha = \\frac{n}{m}$",
    relatedTerms: ["hash-table", "rehashing", "hash-collision"],
    category: "data-structures",
    tags: ["hashing", "performance", "threshold"],
  },
  {
    slug: "rehashing",
    name: "Rehashing",
    definition:
      "The process of creating a larger hash table and reinserting all existing elements using the hash function with the new table size. Rehashing is triggered when the load factor exceeds a certain threshold, ensuring that the hash table continues to operate efficiently.",
    formula: "Amortized cost per insertion: $O(1)$ when table doubles in size",
    relatedTerms: ["hash-table", "load-factor", "hash-function"],
    category: "data-structures",
    tags: ["hashing", "resizing", "dynamic"],
  },
  {
    slug: "graph",
    name: "Graph",
    definition:
      "A data structure consisting of a set of vertices (nodes) and edges (connections between nodes). Graphs model relationships and connections in networks, social media, maps, and countless other domains. They can be directed or undirected, weighted or unweighted.",
    formalDefinition:
      "A graph $G = (V, E)$ consists of a set of vertices $V$ and a set of edges $E \\subseteq V \\times V$.",
    relatedTerms: [
      "directed-graph",
      "undirected-graph",
      "weighted-graph",
      "adjacency-list",
      "adjacency-matrix",
      "node",
      "edge",
    ],
    category: "data-structures",
    tags: ["non-linear", "network", "relational"],
  },
  {
    slug: "adjacency-list",
    name: "Adjacency List",
    definition:
      "A graph representation where each vertex stores a list of its neighboring vertices. This is the most common way to represent sparse graphs because it uses memory proportional to the number of vertices plus edges, rather than the square of the vertices.",
    formula: "Space: $O(V + E)$. Check edge: $O(\\deg(v))$",
    relatedTerms: ["adjacency-matrix", "graph", "directed-graph", "undirected-graph"],
    category: "data-structures",
    tags: ["graph", "representation", "sparse"],
  },
  {
    slug: "adjacency-matrix",
    name: "Adjacency Matrix",
    definition:
      "A 2D array representation of a graph where entry (i, j) indicates whether there is an edge from vertex i to vertex j. While it uses more memory than adjacency lists, it allows O(1) edge lookups and is suitable for dense graphs.",
    formula: "Space: $O(V^2)$. Check edge: $O(1)$",
    relatedTerms: ["adjacency-list", "graph", "directed-graph", "weighted-graph"],
    category: "data-structures",
    tags: ["graph", "representation", "dense", "matrix"],
  },
  {
    slug: "directed-graph",
    name: "Directed Graph",
    definition:
      "A graph where edges have a direction, going from one vertex to another. An edge from A to B does not imply an edge from B to A. Directed graphs (digraphs) are used to model one-way relationships like web page links, dependencies, and state machines.",
    formalDefinition:
      "A graph $G = (V, E)$ where $E$ is a set of ordered pairs $(u, v)$ indicating a directed edge from $u$ to $v$.",
    relatedTerms: ["undirected-graph", "graph", "weighted-graph", "edge"],
    category: "data-structures",
    tags: ["graph", "directed", "digraph"],
  },
  {
    slug: "undirected-graph",
    name: "Undirected Graph",
    definition:
      "A graph where edges have no direction, meaning the connection between two vertices goes both ways. If there is an edge between A and B, you can traverse it in either direction. Social networks (friendships) and road maps (two-way streets) are common examples.",
    formalDefinition:
      "A graph $G = (V, E)$ where $E$ is a set of unordered pairs $\\{u, v\\}$.",
    relatedTerms: ["directed-graph", "graph", "weighted-graph", "edge"],
    category: "data-structures",
    tags: ["graph", "undirected", "symmetric"],
  },
  {
    slug: "weighted-graph",
    name: "Weighted Graph",
    definition:
      "A graph where each edge has an associated numerical value (weight) representing cost, distance, capacity, or some other metric. Weighted graphs are essential for shortest path algorithms like Dijkstra's and for network flow problems.",
    formalDefinition:
      "A graph $G = (V, E, w)$ with a weight function $w: E \\rightarrow \\mathbb{R}$ that assigns a real-valued weight to each edge.",
    relatedTerms: ["graph", "directed-graph", "edge", "adjacency-matrix"],
    category: "data-structures",
    tags: ["graph", "weighted", "cost"],
  },
  {
    slug: "union-find",
    name: "Union Find",
    definition:
      "A data structure (also called Disjoint Set Union) that tracks elements partitioned into non-overlapping sets. It supports two primary operations: find (which set an element belongs to) and union (merge two sets). With path compression and union by rank, both operations run in nearly constant time.",
    formalDefinition:
      "A forest of trees where each tree represents a set. Find returns the root representative, and union merges two trees.",
    formula: "Find/Union: $O(\\alpha(n))$ amortized, where $\\alpha$ is the inverse Ackermann function",
    relatedTerms: ["disjoint-set", "graph"],
    category: "data-structures",
    tags: ["set", "partition", "connectivity"],
  },
  {
    slug: "disjoint-set",
    name: "Disjoint Set",
    definition:
      "A collection of non-overlapping sets where each element belongs to exactly one set. The disjoint set data structure (often implemented via Union Find) efficiently supports checking whether two elements are in the same set and merging sets together.",
    relatedTerms: ["union-find", "graph"],
    category: "data-structures",
    tags: ["set", "partition", "equivalence"],
  },
  {
    slug: "segment-tree",
    name: "Segment Tree",
    definition:
      "A binary tree used for storing information about intervals (segments) of an array. It allows efficient range queries (like finding the sum or minimum over a range) and point updates in logarithmic time. Segment trees are a staple in competitive programming.",
    formula: "Build: $O(n)$. Query: $O(\\log n)$. Update: $O(\\log n)$. Space: $O(4n)$",
    relatedTerms: ["fenwick-tree", "binary-tree", "array"],
    category: "data-structures",
    tags: ["tree", "range-query", "interval"],
  },
  {
    slug: "fenwick-tree",
    name: "Fenwick Tree",
    definition:
      "Also known as a Binary Indexed Tree (BIT), it is a data structure that provides efficient methods for computing prefix sums and updating individual elements. It uses less memory and has simpler code than a segment tree, though it is less versatile.",
    formula: "Update: $O(\\log n)$. Prefix sum query: $O(\\log n)$. Space: $O(n)$",
    relatedTerms: ["segment-tree", "array"],
    category: "data-structures",
    tags: ["tree", "prefix-sum", "binary-indexed"],
  },
  {
    slug: "bloom-filter",
    name: "Bloom Filter",
    definition:
      "A space-efficient probabilistic data structure that tests whether an element is a member of a set. It can produce false positives (saying an element is present when it is not) but never false negatives. Bloom filters are used in spell checkers, database query optimization, and network routers.",
    formula: "Optimal number of hash functions: $k = \\frac{m}{n} \\ln 2$, where $m$ = bit array size, $n$ = items",
    relatedTerms: ["hash-function", "hash-table"],
    category: "data-structures",
    tags: ["probabilistic", "membership", "space-efficient"],
  },
  {
    slug: "skip-list",
    name: "Skip List",
    definition:
      "A probabilistic data structure that uses multiple layers of sorted linked lists to achieve O(log n) average search time. Each higher layer acts as an express lane for the layer below it, skipping over elements. Skip lists are a simpler alternative to balanced BSTs.",
    formula: "Average search, insert, delete: $O(\\log n)$. Space: $O(n)$ expected",
    relatedTerms: ["linked-list", "binary-search-tree", "avl-tree"],
    category: "data-structures",
    tags: ["probabilistic", "sorted", "layered"],
  },
  {
    slug: "circular-buffer",
    name: "Circular Buffer",
    definition:
      "A fixed-size buffer that wraps around to the beginning when the end is reached, using a head and tail pointer to track the front and back. Circular buffers are efficient for streaming data, producer-consumer patterns, and implementing bounded queues.",
    formula: "Next index: $(i + 1) \\mod n$. Insert/Remove: $O(1)$",
    relatedTerms: ["queue", "deque", "array"],
    category: "data-structures",
    tags: ["linear", "fixed-size", "ring", "buffer"],
  },
  {
    slug: "node",
    name: "Node",
    definition:
      "The basic building block of many data structures (linked lists, trees, graphs). A node typically contains a piece of data (the value) and one or more references (pointers or links) to other nodes. The structure of a node defines the shape and capabilities of the data structure it belongs to.",
    relatedTerms: ["edge", "linked-list", "binary-tree", "graph"],
    category: "data-structures",
    tags: ["fundamental", "building-block", "pointer"],
  },
  {
    slug: "edge",
    name: "Edge",
    definition:
      "A connection between two nodes (vertices) in a graph. Edges can be directed (one-way) or undirected (two-way), and they can carry weights representing costs or distances. The set of edges defines the structure and connectivity of a graph.",
    formalDefinition:
      "In a graph $G = (V, E)$, an edge $e \\in E$ is an ordered pair $(u, v)$ in a directed graph or an unordered pair $\\{u, v\\}$ in an undirected graph.",
    relatedTerms: ["node", "graph", "directed-graph", "weighted-graph"],
    category: "data-structures",
    tags: ["fundamental", "graph", "connection"],
  },
];
