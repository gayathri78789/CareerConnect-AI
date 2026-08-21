import { CAREER_TRACKS } from './careerData.js';

// Clean function signature generator for unsolv-by-default starter codes
function getStarterCodeTemplates(funcName, paramsStr, returnType) {
  return {
    'Python': `class Solution:\n    def ${funcName}(self, ${paramsStr}) -> ${returnType || 'any'}:\n        # Write your code here\n        pass`,
    'JavaScript': `function ${funcName}(${paramsStr.replace(/:\s*[^,)]+/g, '')}) {\n    // Write your code here\n    return null;\n}`,
    'C++': `class Solution {\npublic:\n    auto ${funcName}(${paramsStr}) {\n        // Write your code here\n    }\n};`,
    'Java': `class Solution {\n    public Object ${funcName}(${paramsStr}) {\n        // Write your code here\n        return null;\n    }\n}`,
    'C': `void* ${funcName}(${paramsStr}) {\n    // Write your code here\n    return NULL;\n}`,
    'Go': `func ${funcName}(${paramsStr}) interface{} {\n    // Write your code here\n    return nil\n}`
  };
}

// Rich Coding Question Repository covering all 12 Topics (Clean Starter Code & Separate Solution Code)
export const CODING_QUESTIONS = [
  // Arrays
  {
    id: 'code-arr-1',
    title: 'Two Sum & Complement Lookup',
    difficulty: 'Easy',
    topic: 'Arrays',
    careers: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Quantitative Analyst'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    examples: [
      { id: 'ex_1', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { id: 'ex_2', input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6.' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    hints: ['A hash map allows O(1) lookups for target - num.', 'Iterate through the array once while storing seen elements.'],
    starterCode: {
      'Python': `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass`,
      'JavaScript': `function twoSum(nums, target) {\n    // Write your code here\n    return [];\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};`,
      'Java': `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`,
      'C': `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}`,
      'Go': `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    return nil\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []`,
      'JavaScript': `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (mp.count(diff)) return {mp[diff], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      'Java': `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[] { map.get(diff), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      'C': `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j; return res;\n            }\n        }\n    }\n    return res;\n}`,
      'Go': `func twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        if j, ok := seen[target-num]; ok {\n            return []int{j, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}`
    },
    solution: 'Hash Map lookup approach in O(N) time complexity and O(N) space complexity.',
    testCases: [{ input: '[2,7,11,15], 9', output: '[0,1]' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'C', 'Go'],
    estimatedTime: '15 mins'
  },
  {
    id: 'code-arr-2',
    title: 'Maximum Subarray (Kadanes Algorithm)',
    difficulty: 'Medium',
    topic: 'Arrays',
    careers: ['Software Engineer', 'Full Stack Developer', 'Data Scientist', 'AI/ML Engineer'],
    description: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      { id: 'ex_1', input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Keep a running sum. If the running sum becomes negative, reset it to 0.'],
    starterCode: {
      'Python': `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`,
      'JavaScript': `function maxSubArray(nums) {\n    // Write your code here\n    return 0;\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        max_sum = current_sum = nums[0]\n        for num in nums[1:]:\n            current_sum = max(num, current_sum + num)\n            max_sum = max(max_sum, current_sum)\n        return max_sum`,
      'JavaScript': `function maxSubArray(nums) {\n    let maxSum = nums[0], currentSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}`
    },
    solution: 'Kadane algorithm in O(N) time and O(1) space.',
    testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '20 mins'
  },

  // Strings
  {
    id: 'code-str-1',
    title: 'Valid Palindrome & Alphanumeric Filter',
    difficulty: 'Easy',
    topic: 'Strings',
    careers: ['Software Engineer', 'Frontend Developer', 'Full Stack Developer', 'Mobile App Developer'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    examples: [
      { id: 'ex_1', input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    hints: ['Use two pointers moving inward from start and end.'],
    starterCode: {
      'Python': `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your code here\n        pass`,
      'JavaScript': `function isPalindrome(s) {\n    // Write your code here\n    return false;\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        filtered = [c.lower() for c in s if c.isalnum()]\n        return filtered == filtered[::-1]`,
      'JavaScript': `function isPalindrome(s) {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}`
    },
    solution: 'Two pointers or string cleaning. Time: O(N), Space: O(N).',
    testCases: [{ input: '"A man, a plan, a canal: Panama"', output: 'true' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '10 mins'
  },

  // Linked Lists
  {
    id: 'code-list-1',
    title: 'Linked List Cycle II & Entry Node',
    difficulty: 'Medium',
    topic: 'Linked Lists',
    careers: ['Software Engineer', 'Backend Developer', 'Mobile App Developer', 'Quantitative Analyst'],
    description: 'Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Do not modify the linked list.',
    examples: [
      { id: 'ex_1', input: 'head = [3,2,0,-4], pos = 1', output: 'tail connects to node index 1', explanation: 'There is a cycle in the list where tail connects to second node.' }
    ],
    constraints: ['Node count [0, 10^4]', '-10^5 <= Node.val <= 10^5'],
    hints: ['Use Floyd Tortoise and Hare algorithm.'],
    starterCode: {
      'Python': `class Solution:\n    def detectCycle(self, head):\n        # Write your code here\n        pass`,
      'JavaScript': `function detectCycle(head) {\n    // Write your code here\n    return null;\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def detectCycle(self, head):\n        slow = fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n            if slow == fast:\n                slow = head\n                while slow != fast:\n                    slow = slow.next\n                    fast = fast.next\n                return slow\n        return None`,
      'JavaScript': `function detectCycle(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) {\n            slow = head;\n            while (slow !== fast) {\n                slow = slow.next;\n                fast = fast.next;\n            }\n            return slow;\n        }\n    }\n    return null;\n}`
    },
    solution: 'Floyd Cycle Detection. Time: O(N), Space: O(1).',
    testCases: [{ input: '[3,2,0,-4], pos=1', output: 'Node index 1' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'C', 'Go'],
    estimatedTime: '20 mins'
  },

  // Trees
  {
    id: 'code-tree-1',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    careers: ['Software Engineer', 'Backend Developer', 'AI/ML Engineer'],
    description: 'Given the root of a binary tree, return its maximum depth (number of nodes along the longest path from root to leaf node).',
    examples: [
      { id: 'ex_1', input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'Path 3 -> 20 -> 15 has depth 3.' }
    ],
    constraints: ['Node count [0, 10^4]', '-100 <= Node.val <= 100'],
    hints: ['Depth of tree = 1 + max(depth(left), depth(right)).'],
    starterCode: {
      'Python': `class Solution:\n    def maxDepth(self, root) -> int:\n        # Write your code here\n        pass`,
      'JavaScript': `function maxDepth(root) {\n    // Write your code here\n    return 0;\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def maxDepth(self, root) -> int:\n        if not root: return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
      'JavaScript': `function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`
    },
    solution: 'Recursive Depth-First Search. Time: O(N), Space: O(H).',
    testCases: [{ input: '[3,9,20,null,null,15,7]', output: '3' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '15 mins'
  },

  // Graphs
  {
    id: 'code-graph-1',
    title: 'Number of Islands (2D Grid Traversal)',
    difficulty: 'Medium',
    topic: 'Graphs',
    careers: ['Software Engineer', 'AI/ML Engineer', 'Full Stack Developer', 'Data Scientist'],
    description: 'Given an m x n 2D binary grid grid where 1 represents land and 0 represents water, return the number of islands.',
    examples: [
      { id: 'ex_1', input: 'grid = [["1","1","1"],["0","1","0"],["1","1","0"]]', output: '1', explanation: 'Connected lands form 1 island.' }
    ],
    constraints: ['m, n <= 300', 'grid[i][j] is 0 or 1'],
    hints: ['Perform DFS or BFS whenever a 1 is encountered.'],
    starterCode: {
      'Python': `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Write your code here\n        pass`,
      'JavaScript': `function numIslands(grid) {\n    // Write your code here\n    return 0;\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        def dfs(r, c):\n            if r<0 or c<0 or r>=rows or c>=cols or grid[r][c]=='0': return\n            grid[r][c] = '0'\n            dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    count += 1\n                    dfs(r, c)\n        return count`,
      'JavaScript': `function numIslands(grid) {\n    if (!grid.length) return 0;\n    let count = 0;\n    const rows = grid.length, cols = grid[0].length;\n    function dfs(r, c) {\n        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;\n        grid[r][c] = '0';\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n    }\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            if (grid[r][c] === '1') { count++; dfs(r, c); }\n        }\n    }\n    return count;\n}`
    },
    solution: 'DFS Grid Traversal. Time: O(M*N), Space: O(M*N).',
    testCases: [{ input: 'grid', output: '1' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '25 mins'
  },

  // Dynamic Programming (DP)
  {
    id: 'code-dp-1',
    title: 'Climbing Stairs (DP Memoization)',
    difficulty: 'Easy',
    topic: 'DP',
    careers: ['Software Engineer', 'AI/ML Engineer', 'Quantitative Analyst', 'Backend Developer'],
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { id: 'ex_1', input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: ['This follows Fibonacci sequence: dp[i] = dp[i-1] + dp[i-2].'],
    starterCode: {
      'Python': `class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass`,
      'JavaScript': `function climbStairs(n) {\n    // Write your code here\n    return 0;\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b`,
      'JavaScript': `function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        const temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}`
    },
    solution: 'Fibonacci DP. Time: O(N), Space: O(1).',
    testCases: [{ input: '3', output: '3' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '10 mins'
  },

  // SQL
  {
    id: 'code-sql-1',
    title: 'Highest Salary per Department',
    difficulty: 'Medium',
    topic: 'SQL',
    careers: ['Backend Developer', 'Data Scientist', 'Business Analyst', 'Full Stack Developer', 'Product Manager'],
    description: 'Write a SQL query to find employees who have the highest salary in each of the departments.',
    examples: [
      { id: 'ex_1', input: 'Employee & Department tables', output: 'Department, Employee, Salary', explanation: 'DENSE_RANK() OVER (PARTITION BY DepartmentId ORDER BY Salary DESC)' }
    ],
    constraints: ['Use window functions or subquery grouping.'],
    hints: ['Partition by DepartmentId ordered by Salary DESC.'],
    starterCode: {
      'Python': `-- Write your SQL Query below\nSELECT Department, Employee, Salary FROM Employee;\n`,
      'JavaScript': `-- Write your SQL Query below\nSELECT Department, Employee, Salary FROM Employee;\n`
    },
    solutionCode: {
      'Python': `-- SQL Query\nSELECT d.Name AS Department, e.Name AS Employee, e.Salary\nFROM Employee e\nJOIN Department d ON e.DepartmentId = d.Id\nWHERE (e.DepartmentId, e.Salary) IN (\n    SELECT DepartmentId, MAX(Salary) FROM Employee GROUP BY DepartmentId\n);`,
      'JavaScript': `SELECT d.Name AS Department, e.Name AS Employee, e.Salary FROM Employee e JOIN Department d ON e.DepartmentId = d.Id;`
    },
    solution: 'SQL Window Partitioning Query.',
    testCases: [{ input: 'Employee schema', output: 'Highest salary rows' }],
    languageSupport: ['Python', 'JavaScript'],
    estimatedTime: '15 mins'
  },

  // OOP
  {
    id: 'code-oop-1',
    title: 'LRU Cache Design & Class Structure',
    difficulty: 'Medium',
    topic: 'OOP',
    careers: ['Software Engineer', 'Backend Developer', 'Full Stack Developer', 'Mobile App Developer'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with `get(key)` and `put(key, value)` in O(1) time.',
    examples: [
      { id: 'ex_1', input: 'LRUCache(2), put(1,1), put(2,2), get(1)', output: 'returns 1' }
    ],
    constraints: ['Capacity <= 3000', 'Operations get and put must run in O(1) time.'],
    hints: ['Combine a HashMap with a Doubly Linked List.'],
    starterCode: {
      'Python': `class LRUCache:\n    def __init__(self, capacity: int):\n        # Write initialization here\n        pass\n    def get(self, key: int) -> int:\n        # Write get implementation\n        return -1\n    def put(self, key: int, value: int) -> None:\n        # Write put implementation\n        pass`,
      'JavaScript': `class LRUCache {\n    constructor(capacity) {\n        // Write initialization here\n    }\n    get(key) {\n        // Write get implementation\n        return -1;\n    }\n    put(key, value) {\n        // Write put implementation\n    }\n}`
    },
    solutionCode: {
      'Python': `from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)`,
      'JavaScript': `class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, value);\n        if (this.cache.size > this.capacity) {\n            this.cache.delete(this.cache.keys().next().value);\n        }\n    }\n}`
    },
    solution: 'Map + Doubly Linked List or OrderedDict. Time: O(1), Space: O(C).',
    testCases: [{ input: 'LRUCache ops', output: '1' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '25 mins'
  },

  // DBMS
  {
    id: 'code-dbms-1',
    title: 'B-Tree Indexing & Transaction Isolation',
    difficulty: 'Medium',
    topic: 'DBMS',
    careers: ['Backend Developer', 'Database Specialist', 'Cloud Engineer', 'DevOps Engineer'],
    description: 'Explain and implement a key lookup routing algorithm matching B-Tree node branching logic for database indexes.',
    examples: [
      { id: 'ex_1', input: 'keys=[10, 20, 30], target=25', output: 'Branch index 2' }
    ],
    constraints: ['Keys ordered ascending'],
    hints: ['Perform binary search to find target interval.'],
    starterCode: {
      'Python': `def find_branch(keys: list[int], target: int) -> int:\n    # Write your code here\n    return 0`,
      'JavaScript': `function findBranch(keys, target) {\n    // Write your code here\n    return 0;\n}`
    },
    solutionCode: {
      'Python': `def find_branch(keys: list[int], target: int) -> int:\n    import bisect\n    return bisect.bisect_right(keys, target)`,
      'JavaScript': `function findBranch(keys, target) {\n    let idx = 0;\n    while (idx < keys.length && target >= keys[idx]) idx++;\n    return idx;\n}`
    },
    solution: 'Binary search key range routing.',
    testCases: [{ input: '[10, 20], 25', output: '2' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java'],
    estimatedTime: '15 mins'
  },

  // OS
  {
    id: 'code-os-1',
    title: 'Process Scheduling & Round Robin Simulation',
    difficulty: 'Medium',
    topic: 'OS',
    careers: ['Software Engineer', 'Backend Developer', 'Cyber Security Engineer', 'Cloud Engineer'],
    description: 'Given process burst times and a time quantum `q`, calculate average waiting time using Round Robin CPU scheduling algorithm.',
    examples: [
      { id: 'ex_1', input: 'processes=[10, 5, 8], q=2', output: 'Average Waiting Time = 13.0s' }
    ],
    constraints: ['Quantum q > 0'],
    hints: ['Use a queue to cycle through active processes until burst time is depleted.'],
    starterCode: {
      'Python': `def round_robin(bursts: list[int], q: int) -> float:\n    # Write your code here\n    return 0.0`,
      'JavaScript': `function roundRobin(bursts, q) {\n    // Write your code here\n    return 0.0;\n}`
    },
    solutionCode: {
      'Python': `def round_robin(bursts: list[int], q: int) -> float:\n    rem = list(bursts)\n    n = len(bursts)\n    wt = [0] * n\n    t = 0\n    while True:\n        done = True\n        for i in range(n):\n            if rem[i] > 0:\n                done = False\n                if rem[i] > q:\n                    t += q\n                    rem[i] -= q\n                else:\n                    t += rem[i]\n                    wt[i] = t - bursts[i]\n                    rem[i] = 0\n        if done: break\n    return sum(wt) / n`,
      'JavaScript': `function roundRobin(bursts, q) {\n    let rem = [...bursts], n = bursts.length, wt = new Array(n).fill(0), t = 0;\n    while (true) {\n        let done = true;\n        for (let i = 0; i < n; i++) {\n            if (rem[i] > 0) {\n                done = false;\n                if (rem[i] > q) { t += q; rem[i] -= q; }\n                else { t += rem[i]; wt[i] = t - bursts[i]; rem[i] = 0; }\n            }\n        }\n        if (done) break;\n    }\n    return wt.reduce((a, b) => a + b, 0) / n;\n}`
    },
    solution: 'Round robin queue process execution.',
    testCases: [{ input: '[10,5,8], q=2', output: '13.0' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java'],
    estimatedTime: '20 mins'
  },

  // Networking
  {
    id: 'code-net-1',
    title: 'IP Subnet Mask Calculator',
    difficulty: 'Easy',
    topic: 'Networking',
    careers: ['Cyber Security Engineer', 'Cloud Engineer', 'DevOps Engineer', 'Backend Developer'],
    description: 'Given an IPv4 address and CIDR prefix (e.g. 192.168.1.1/24), return the Network Address, Broadcast Address, and Total Usable Hosts.',
    examples: [
      { id: 'ex_1', input: 'cidr = "192.168.1.1/24"', output: '{"network": "192.168.1.0", "broadcast": "192.168.1.255", "hosts": 254}' }
    ],
    constraints: ['Valid IPv4 CIDR string'],
    hints: ['Total hosts = 2^(32 - prefix) - 2.'],
    starterCode: {
      'Python': `def calculate_subnet(cidr: str) -> dict:\n    # Write your code here\n    return {}`,
      'JavaScript': `function calculateSubnet(cidr) {\n    // Write your code here\n    return {};\n}`
    },
    solutionCode: {
      'Python': `import ipaddress\ndef calculate_subnet(cidr: str) -> dict:\n    net = ipaddress.ip_network(cidr, strict=False)\n    return {\n        "network": str(net.network_address),\n        "broadcast": str(net.broadcast_address),\n        "hosts": net.num_addresses - 2 if net.num_addresses >= 2 else 0\n    }`,
      'JavaScript': `function calculateSubnet(cidr) {\n    const [ip, mask] = cidr.split('/');\n    const prefix = parseInt(mask, 10);\n    const totalHosts = Math.pow(2, 32 - prefix) - 2;\n    return { prefix, totalHosts };\n}`
    },
    solution: 'Bitwise IP Subnet Mask Calculation.',
    testCases: [{ input: '"192.168.1.1/24"', output: '254 hosts' }],
    languageSupport: ['Python', 'JavaScript', 'Go'],
    estimatedTime: '15 mins'
  },

  // System Design
  {
    id: 'code-sd-1',
    title: 'Distributed Token Bucket Rate Limiter',
    difficulty: 'Hard',
    topic: 'System Design',
    careers: ['Software Engineer', 'Backend Developer', 'Cloud Engineer', 'Full Stack Developer'],
    description: 'Implement a Token Bucket Rate Limiter algorithm that handles up to `capacity` tokens with a refill rate of `refillRate` tokens per second.',
    examples: [
      { id: 'ex_1', input: 'capacity=5, refillRate=1, allowRequest() call', output: 'true' }
    ],
    constraints: ['Time measurement in milliseconds'],
    hints: ['Calculate tokens to add based on time elapsed since last request: tokens += elapsed * refillRate.'],
    starterCode: {
      'Python': `class TokenBucket:\n    def __init__(self, capacity: int, refill_rate: float):\n        # Write initialization here\n        pass\n    def allow_request(self, tokens_requested: int = 1) -> bool:\n        # Write request logic here\n        return False`,
      'JavaScript': `class TokenBucket {\n    constructor(capacity, refillRate) {\n        // Write initialization here\n    }\n    allowRequest(requested = 1) {\n        // Write request logic here\n        return false;\n    }\n}`
    },
    solutionCode: {
      'Python': `import time\nclass TokenBucket:\n    def __init__(self, capacity: int, refill_rate: float):\n        self.capacity = capacity\n        self.refill_rate = refill_rate\n        self.tokens = capacity\n        self.last_update = time.time()\n    def allow_request(self, tokens_requested: int = 1) -> bool:\n        now = time.time()\n        elapsed = now - self.last_update\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)\n        self.last_update = now\n        if self.tokens >= tokens_requested:\n            self.tokens -= tokens_requested\n            return True\n        return False`,
      'JavaScript': `class TokenBucket {\n    constructor(capacity, refillRate) {\n        this.capacity = capacity;\n        this.refillRate = refillRate;\n        this.tokens = capacity;\n        this.lastUpdate = Date.now();\n    }\n    allowRequest(requested = 1) {\n        const now = Date.now();\n        const elapsed = (now - this.lastUpdate) / 1000;\n        this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);\n        this.lastUpdate = now;\n        if (this.tokens >= requested) {\n            this.tokens -= requested;\n            return true;\n        }\n        return false;\n    }\n}`
    },
    solution: 'Token Bucket Rate Limiting algorithm. Time O(1), Space O(1).',
    testCases: [{ input: 'cap=5, rate=1', output: 'true' }],
    languageSupport: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
    estimatedTime: '25 mins'
  }
];

// Generate 5 dynamic unsolv-by-default problems for any requested topic
export function generate5TopicCodingQuestions(topic = 'Arrays', career = 'Software Engineer', difficulty = 'All') {
  const diffs = ['Easy', 'Medium', 'Hard', 'Medium', 'Easy'];
  const titles = [
    `${topic} Foundation & Boundary Check`,
    `Optimal ${topic} Traversal & Partitioning`,
    `Advanced ${topic} State & Cache Lookup`,
    `${topic} Performance & Memory Optimization`,
    `Scalable ${topic} Architecture & Edge Cases`
  ];

  return titles.map((t, idx) => ({
    id: `dyn-q-${topic.toLowerCase().replace(/\s+/g, '-')}-${idx + 1}`,
    title: t,
    difficulty: diffs[idx],
    topic: topic,
    careers: [career],
    description: `Solve the ${topic} practice problem #${idx + 1} for a ${career} candidate. Optimize runtime performance and handle edge cases cleanly.`,
    examples: [
      { id: `ex_${idx}`, input: `Input data stream #${idx + 1}`, output: `Expected output #${idx + 1}`, explanation: `Requires ${diffs[idx]} algorithm complexity optimization.` }
    ],
    constraints: ['Time Limit: 2.0s', 'Space Limit: 64MB'],
    hints: [`Break down the ${topic} logic into modular helper methods.`],
    starterCode: {
      'Python': `class Solution:\n    def solve${topic.replace(/[^a-zA-Z]/g, '')}Problem_${idx + 1}(self, data: list) -> bool:\n        # TODO: Implement ${topic} algorithm here\n        pass`,
      'JavaScript': `function solve${topic.replace(/[^a-zA-Z]/g, '')}Problem_${idx + 1}(data) {\n    // TODO: Implement ${topic} algorithm here\n    return false;\n}`,
      'C++': `class Solution {\npublic:\n    bool solve${topic.replace(/[^a-zA-Z]/g, '')}Problem_${idx + 1}(vector<int>& data) {\n        // TODO: Implement ${topic} algorithm here\n        return false;\n    }\n};`,
      'Java': `class Solution {\n    public boolean solve${topic.replace(/[^a-zA-Z]/g, '')}Problem_${idx + 1}(int[] data) {\n        // TODO: Implement ${topic} algorithm here\n        return false;\n    }\n}`
    },
    solutionCode: {
      'Python': `class Solution:\n    def solve${topic.replace(/[^a-zA-Z]/g, '')}Problem_${idx + 1}(self, data: list) -> bool:\n        # Optimal solution implementation for ${topic}\n        return True`,
      'JavaScript': `function solve${topic.replace(/[^a-zA-Z]/g, '')}Problem_${idx + 1}(data) {\n        // Optimal solution implementation for ${topic}\n        return true;\n}`
    },
    solution: `Optimal ${topic} algorithmic solution. Time: O(N), Space: O(1).`
  }));
}

// Helper Service for Coding Questions
export class CodingQuestionGeneratorService {
  static getAllQuestions() {
    return CODING_QUESTIONS;
  }

  static getQuestionByTopic(topic, career = 'Software Engineer') {
    if (!topic || topic === 'All') return CODING_QUESTIONS;
    const existing = CODING_QUESTIONS.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    if (existing.length >= 5) return existing;
    return generate5TopicCodingQuestions(topic, career);
  }

  static getQuestionByCareer(career) {
    if (!career || career === 'All') return CODING_QUESTIONS;
    return CODING_QUESTIONS.filter(q => !q.careers || q.careers.includes(career) || career === 'Software Engineer');
  }

  static getRandomQuestion(filter = {}) {
    let pool = [...CODING_QUESTIONS];
    if (filter.career && filter.career !== 'All') {
      pool = pool.filter(q => !q.careers || q.careers.includes(filter.career) || filter.career === 'Software Engineer');
    }
    if (filter.topic && filter.topic !== 'All') {
      pool = pool.filter(q => q.topic.toLowerCase() === filter.topic.toLowerCase());
    }
    if (filter.difficulty && filter.difficulty !== 'All') {
      pool = pool.filter(q => q.difficulty.toLowerCase() === filter.difficulty.toLowerCase());
    }
    if (pool.length === 0) pool = generate5TopicCodingQuestions(filter.topic || 'Arrays', filter.career || 'Software Engineer');
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }
}

// Helper Service for Aptitude 10 Questions per Category Generator
export class AptitudeQuestionService {
  static getQuestionsByCategory(category = 'Logical Reasoning', difficulty = 'Medium') {
    return generate10AptitudeQuestions(category, difficulty);
  }

  static getRandomQuestion(category = 'Logical Reasoning') {
    const questions = generate10AptitudeQuestions(category, 'Medium');
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }
}

// Generator function for 10 non-duplicate questions per category
export function generate10AptitudeQuestions(category = 'Logical Reasoning', difficulty = 'Medium') {
  const templates = {
    'Quantitative Aptitude': (i) => ({
      id: `quant_${i}`,
      category: 'Quantitative Aptitude',
      difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      question: `What is ${15 + (i * 2)}% of ${100 + (i * 20)}?`,
      options: [
        { label: 'A', text: `${((15 + i * 2) * (100 + i * 20) / 100).toFixed(1)}` },
        { label: 'B', text: `${((15 + i * 2) * (100 + i * 20) / 100 + 5).toFixed(1)}` },
        { label: 'C', text: `${((15 + i * 2) * (100 + i * 20) / 100 - 3).toFixed(1)}` },
        { label: 'D', text: `${((15 + i * 2) * (100 + i * 20) / 100 + 10).toFixed(1)}` }
      ],
      answer: 'A',
      explanation: `Percentage formula: (${15 + i * 2} / 100) × ${100 + i * 20} = ${((15 + i * 2) * (100 + i * 20) / 100).toFixed(1)}.`
    }),
    'Logical Reasoning': (i) => ({
      id: `logic_${i}`,
      category: 'Logical Reasoning',
      difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      question: `If 'ALPHA_${i}' is transformed by shifting letters forward alphabetically by +${(i % 4) + 1} positions, what is the encrypted code?`,
      options: [
        { label: 'A', text: `BMQI_${i}` },
        { label: 'B', text: `CNRJ_${i}` },
        { label: 'C', text: `DPSK_${i}` },
        { label: 'D', text: `EQTL_${i}` }
      ],
      answer: 'B',
      explanation: `Each letter shifts by +${(i % 4) + 1} positions in the alphabetical order.`
    }),
    'Verbal Ability': (i) => ({
      id: `verbal_${i}`,
      category: 'Verbal Ability',
      difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      question: `Choose the most appropriate synonym for '${i % 2 === 0 ? 'Resilient' : 'Pragmatic'}' in corporate Context #${i}.`,
      options: [
        { label: 'A', text: i % 2 === 0 ? 'Adaptable and quick to recover' : 'Practical and realistic' },
        { label: 'B', text: 'Rigid and unyielding' },
        { label: 'C', text: 'Theoretical and abstract' },
        { label: 'D', text: 'Careless and impulsive' }
      ],
      answer: 'A',
      explanation: `'${i % 2 === 0 ? 'Resilient' : 'Pragmatic'}' describes an individual who is ${i % 2 === 0 ? 'able to withstand or recover quickly from difficult conditions' : 'guided by practical considerations rather than ideals'}.`
    }),
    'Data Interpretation': (i) => ({
      id: `di_${i}`,
      category: 'Data Interpretation',
      difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      question: `A Q${(i % 4) + 1} financial table shows Revenue = $${500 + i * 15}k and Expenditure = $${300 + i * 10}k. What is the net profit percentage?`,
      options: [
        { label: 'A', text: `${(((500 + i * 15 - (300 + i * 10)) / (500 + i * 15)) * 100).toFixed(1)}%` },
        { label: 'B', text: `${(((500 + i * 15 - (300 + i * 10)) / (500 + i * 15)) * 100 + 5).toFixed(1)}%` },
        { label: 'C', text: `${(((500 + i * 15 - (300 + i * 10)) / (500 + i * 15)) * 100 - 4).toFixed(1)}%` },
        { label: 'D', text: `${(((500 + i * 15 - (300 + i * 10)) / (500 + i * 15)) * 100 + 10).toFixed(1)}%` }
      ],
      answer: 'A',
      explanation: `Profit = $${500 + i * 15 - (300 + i * 10)}k. Profit Percentage = (Profit / Revenue) × 100.`
    }),
    'Analytical Reasoning': (i) => ({
      id: `analytical_${i}`,
      category: 'Analytical Reasoning',
      difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      question: `5 servers (S1..S5) execute tasks sequentially. If S2 runs before S4, and S3 runs immediately after S1, which schedule is valid for Run #${i}?`,
      options: [
        { label: 'A', text: 'S1 -> S3 -> S2 -> S4 -> S5' },
        { label: 'B', text: 'S4 -> S2 -> S1 -> S3 -> S5' },
        { label: 'C', text: 'S5 -> S4 -> S3 -> S1 -> S2' },
        { label: 'D', text: 'S2 -> S5 -> S4 -> S3 -> S1' }
      ],
      answer: 'A',
      explanation: 'S1 is immediately followed by S3, and S2 executes before S4. Schedule A satisfies both conditions.'
    }),
    'Puzzle Solving': (i) => ({
      id: `puzzle_${i}`,
      category: 'Puzzle Solving',
      difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      question: `You have ${3 + (i % 3)} jars of water. Jar A holds ${8 + i} liters, Jar B holds ${5 + i} liters. What is the minimum steps to measure exactly ${3} liters?`,
      options: [
        { label: 'A', text: '1 Step' },
        { label: 'B', text: '2 Steps' },
        { label: 'C', text: '3 Steps' },
        { label: 'D', text: '4 Steps' }
      ],
      answer: 'A',
      explanation: `Fill Jar A (${8 + i}L) and pour into Jar B (${5 + i}L). The remainder in Jar A is exactly 3 liters.`
    })
  };

  const generator = templates[category] || templates['Logical Reasoning'];
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    questions.push(generator(i));
  }
  return questions;
}
