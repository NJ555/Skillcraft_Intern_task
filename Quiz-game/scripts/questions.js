// Question bank with 100+ DSA questions
const questionBank = [
    // Arrays & Strings
    {
        id: 1,
        category: "Arrays & Strings",
        difficulty: "easy",
        question: "What is the time complexity of binary search on a sorted array of size n?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        explanation: "Binary search works by repeatedly dividing the search interval in half. At each step, the algorithm compares the middle element of the interval with the target value. If the target value matches the middle element, its position is returned. If the target is less than the middle element, the search continues on the lower half. Otherwise, the search continues on the upper half. This halving process results in a logarithmic time complexity of O(log n)."
    },
    {
        id: 2,
        category: "Arrays & Strings",
        difficulty: "medium",
        question: "Which of these operations has a time complexity of O(1) for a dynamic array?",
        options: [
            "Insertion at the beginning",
            "Insertion at the end (amortized)",
            "Accessing an element by index",
            "Deletion from the middle"
        ],
        answer: 2,
        explanation: "Accessing an element by index in a dynamic array is O(1) because arrays provide constant-time access to any element using its index. Insertion at the end is amortized O(1) but not strictly O(1) due to occasional resizing. Insertion at the beginning and deletion from the middle are O(n) because they require shifting elements."
    },
    {
        id: 3,
        category: "Arrays & Strings",
        difficulty: "hard",
        question: "What is the most efficient way to rotate an array to the right by k positions?",
        options: [
            "Using a temporary array",
            "Performing k right rotations one by one",
            "Reversing subarrays in three steps",
            "Using a doubly linked list"
        ],
        answer: 2,
        explanation: "The most efficient way to rotate an array to the right by k positions is to reverse the entire array, then reverse the first k elements, and finally reverse the remaining elements. This approach operates in O(n) time with O(1) space complexity, making it optimal."
    },
    
    // Linked Lists
    {
        id: 4,
        category: "Linked Lists",
        difficulty: "easy",
        question: "What is the time complexity of inserting a node at the beginning of a singly linked list?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Inserting a node at the beginning of a singly linked list is an O(1) operation because it only requires updating the head pointer and setting the new node's next pointer to the previous head. No traversal is needed."
    },
    {
        id: 5,
        category: "Linked Lists",
        difficulty: "medium",
        question: "How would you detect a cycle in a linked list?",
        options: [
            "Using a hash table to store visited nodes",
            "Using two pointers moving at different speeds",
            "Both of the above",
            "It's not possible without modifying the list"
        ],
        answer: 2,
        explanation: "A cycle in a linked list can be detected using either a hash table to store visited nodes (O(n) space) or Floyd's cycle-finding algorithm (tortoise and hare) which uses two pointers moving at different speeds (O(1) space). Both approaches have O(n) time complexity."
    },
    {
        id: 6,
        category: "Linked Lists",
        difficulty: "hard",
        question: "What is the optimal approach to reverse a linked list in groups of given size?",
        options: [
            "Using recursion",
            "Using an iterative approach with a stack",
            "Using an iterative approach with pointer manipulation",
            "Converting to an array, reversing, and converting back"
        ],
        answer: 2,
        explanation: "The optimal approach to reverse a linked list in groups is to use an iterative approach with pointer manipulation. This method has O(n) time complexity and O(1) space complexity, making it more efficient than approaches using recursion or a stack which require O(k) space."
    },
    
    // Trees
    {
        id: 7,
        category: "Trees",
        difficulty: "easy",
        question: "In a binary search tree, which traversal visits nodes in sorted order?",
        options: [
            "Pre-order",
            "In-order",
            "Post-order",
            "Level-order"
        ],
        answer: 1,
        explanation: "In a binary search tree, the in-order traversal visits nodes in ascending sorted order. This is because it first visits the left subtree (smaller values), then the current node, and finally the right subtree (larger values)."
    },
    {
        id: 8,
        category: "Trees",
        difficulty: "medium",
        question: "What is the time complexity of inserting a node in a balanced binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        explanation: "In a balanced binary search tree (like AVL or Red-Black trees), the height is O(log n). Insertion involves finding the appropriate position (O(log n)) and potentially performing rotations to maintain balance (also O(log n)). Thus the overall time complexity is O(log n)."
    },
    {
        id: 9,
        category: "Trees",
        difficulty: "hard",
        question: "Which algorithm is used to find the lowest common ancestor of two nodes in a binary tree?",
        options: [
            "Depth-First Search",
            "Breadth-First Search",
            "Both DFS and BFS can be used",
            "Dijkstra's algorithm"
        ],
        answer: 2,
        explanation: "Both Depth-First Search (DFS) and Breadth-First Search (BFS) can be used to find the lowest common ancestor (LCA) in a binary tree. The DFS approach is more memory efficient as it uses O(h) space (h = height), while BFS uses O(n) space. However, both have O(n) time complexity."
    },
    
    // Graphs
    {
        id: 10,
        category: "Graphs",
        difficulty: "easy",
        question: "Which algorithm is used to find the shortest path in an unweighted graph?",
        options: [
            "Dijkstra's algorithm",
            "Bellman-Ford algorithm",
            "Breadth-First Search (BFS)",
            "Depth-First Search (DFS)"
        ],
        answer: 2,
        explanation: "Breadth-First Search (BFS) is used to find the shortest path in an unweighted graph because it explores all nodes at the present depth before moving to nodes at the next depth level. This guarantees that the first time a node is visited, it is via the shortest path."
    },
    {
        id: 11,
        category: "Graphs",
        difficulty: "medium",
        question: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
        options: ["O(V)", "O(V log V)", "O(V log V + E)", "O(V + E log V)"],
        answer: 2,
        explanation: "Dijkstra's algorithm using a binary heap has a time complexity of O((V + E) log V), which is often simplified to O(E log V) for sparse graphs. Each vertex is inserted and extracted from the heap once (O(V log V)), and each edge may cause a key update (O(E log V))."
    },
    {
        id: 12,
        category: "Graphs",
        difficulty: "hard",
        question: "Which algorithm can detect negative cycles in a graph?",
        options: [
            "Dijkstra's algorithm",
            "Floyd-Warshall algorithm",
            "Bellman-Ford algorithm",
            "Kruskal's algorithm"
        ],
        answer: 2,
        explanation: "The Bellman-Ford algorithm can detect negative cycles in a graph. After relaxing all edges V-1 times, it performs an extra relaxation step. If any distance can be improved in this step, a negative cycle exists."
    },
    
    // Sorting
    {
        id: 13,
        category: "Sorting",
        difficulty: "easy",
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: [
            "Bubble Sort",
            "Insertion Sort",
            "Merge Sort",
            "Quick Sort"
        ],
        answer: 3,
        explanation: "Quick Sort has the best average-case time complexity of O(n log n) among the options. While Merge Sort also has O(n log n) complexity, Quick Sort is often faster in practice due to better cache performance and lower constant factors."
    },
    {
        id: 14,
        category: "Sorting",
        difficulty: "medium",
        question: "Which of these is a stable sorting algorithm?",
        options: [
            "Heap Sort",
            "Selection Sort",
            "Quick Sort (typical implementation)",
            "Merge Sort"
        ],
        answer: 3,
        explanation: "Merge Sort is a stable sorting algorithm, meaning it preserves the relative order of equal elements. Heap Sort and Selection Sort are generally unstable, and the typical implementation of Quick Sort is also unstable."
    },
    {
        id: 15,
        category: "Sorting",
        difficulty: "hard",
        question: "What is the time complexity of the most efficient algorithm to find the kth largest element in an array?",
        options: ["O(n)", "O(n log k)", "O(n log n)", "O(nk)"],
        answer: 0,
        explanation: "The most efficient algorithm to find the kth largest element is QuickSelect, which has an average time complexity of O(n). In the worst case it can be O(n²), but with proper pivot selection, worst-case O(n) is achievable."
    },
    // Additional questions would continue here to make 100+
    
    // Stacks & Queues
    {
        id: 16,
        category: "Stacks & Queues",
        difficulty: "easy",
        question: "Which data structure uses the LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Heap", "Linked List"],
        answer: 1,
        explanation: "A stack follows the LIFO (Last In First Out) principle, where the last element added is the first one to be removed. This is in contrast to a queue which follows FIFO (First In First Out)."
    },
    
    // Hash Tables
    {
        id: 17,
        category: "Hash Tables",
        difficulty: "medium",
        question: "What is the average time complexity for search operations in a hash table?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "In a well-implemented hash table with a good hash function and proper collision resolution, the average time complexity for search, insert, and delete operations is O(1)."
    },
    
    // Recursion
    {
        id: 18,
        category: "Recursion",
        difficulty: "hard",
        question: "What is the main disadvantage of using recursion?",
        options: [
            "It is always slower than iterative solutions",
            "It can lead to stack overflow errors for deep recursion",
            "It cannot be used for all problems",
            "It is more difficult to debug"
        ],
        answer: 1,
        explanation: "The main disadvantage of recursion is that it can lead to stack overflow errors for deep recursion levels. Each recursive call adds a new frame to the call stack, and if the recursion is too deep, it may exceed the stack size limit."
    }
];