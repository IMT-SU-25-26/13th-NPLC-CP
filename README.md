# Import Order Rules

1. Default Imports First
2. Named Imports Second
3. Components First
4. Default Library Imports Second
5. Named Library Imports Third
6. Named Type Imports Fourth
7. Next Imports Fifth
8. React Imports Sixth
9. Other Imports Last

# Import Path Rules

1. Always use @/ for absolute imports from the src directory.
2. Use relative imports for local files within the same directory or nearby directories.

# Code Structure Rules

1. Components must start with a capital letter.
2. Components must be exported as default exports (export default function ComponentName).
3. Files must use .tsx extension for React components.

# Problem Solving Example

## Example: Fibonacci Problem

### Solution Example

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
