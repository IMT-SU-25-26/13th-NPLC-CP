## 📝 Example: Fibonacci Problem

### Problem Statement

Write a program that calculates the nth Fibonacci number.

**Input Format:**
- A single integer `n` (0 ≤ n ≤ 30)

**Output Format:**
- A single integer representing the nth Fibonacci number

**Sample Input:**
```
5
```

**Sample Output:**
```
5
```

**Explanation:**
The Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13...
The 5th Fibonacci number (0-indexed) is 5.

### Python Solution Examples

#### Solution 1: Iterative Approach (Recommended)

```python
def fibonacci(n):
    if n <= 1:
        return n
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    
    return b

n = int(input())

print(fibonacci(n))
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

#### Solution 2: Recursive Approach (Educational)

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Read input
n = int(input())

# Calculate and print result
print(fibonacci(n))
```

**Time Complexity:** O(2^n)  
**Space Complexity:** O(n)  
⚠️ **Note:** This solution may get Time Limit Exceeded for larger inputs.

#### Solution 3: Dynamic Programming (Memoization)

```python
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

# Read input
n = int(input())

# Calculate and print result
print(fibonacci(n))
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

### Testing the Fibonacci Solutions

#### Test Case 1: Basic Test
**Input:**
```
0
```
**Expected Output:**
```
0
```

#### Test Case 2: Small Number
**Input:**
```
5
```
**Expected Output:**
```
5
```

#### Test Case 3: Larger Number
**Input:**
```
10
```
**Expected Output:**
```
55
```

#### Test Case 4: Edge Case
**Input:**
```
1
```
**Expected Output:**
```
1
```
