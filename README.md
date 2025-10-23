# Import Order Rules

1. **Default Imports First**

   - `import ComponentName from '@/components/...'` (internal components)
   - `import React from 'react'` (external libraries)

2. **Named Imports Second**

   - `import { functionName, typeName } from '@/lib/...'` (internal named imports)
   - `import { useState, useEffect } from 'react'` (external named imports)

3. **Internal vs External**
   - Internal imports (project files) before external imports (libraries)

# Import Path Rules

1. **Absolute Imports**

   - Always use `@/` for all imports from `src/` directory
   - Import components with full paths: `@/components/pages/app/discussions/DiscussionTable`

2. **Relative Imports**

   - Use `./` for files in the same directory
   - Use `../` for files in parent directories
   - Avoid deep relative imports when absolute imports are cleaner

3. **Import Patterns**
   - Server pages import services and lib files directly
   - Components receive data via props (not by importing services)

# Code Structure Rules

1. **Components Organization**

   - Layout components (NavigationBar, Background, providers) go in `components/layout/`
   - Page-specific components go in `components/pages/` organized by route structure
   - All components must start with a capital letter
   - Components must be exported as default exports
   - Every page must use a component and must be imported exclusively in its respective `page.tsx` file to maintain clear separation of concerns and prevent unnecessary re-renders

2. **Service Layer**

   - Business logic goes in `services/` (contest.ts, discussion.ts, etc.)
   - API calls and external service integrations belong here
   - Services are imported and used in server pages (`app/` directory)
   - Client components receive data as props, not by importing services directly

3. **Type Definitions**

   - Database-related types go in `types/db.ts`
   - Page-specific types go in `types/[feature].ts`
   - Global type extensions go in `types/global/`
   - Use consistent naming conventions for type definitions

4. **Core Configurations**

   - Database connections and Prisma setup go in `lib/prisma.ts`
   - Authentication configurations go in `lib/auth.ts`
   - External service configurations (Pusher, etc.) go in `lib/[service].ts`
   - These files should export configured instances ready for use

5. **Utility Functions**

   - Pure helper functions go in `utils/`
   - Functions that don't depend on external state or services
   - Can be imported anywhere they're needed

6. **API Routes**

   - Route handlers go in `app/api/` organized by feature
   - Follow Next.js App Router conventions
   - Keep API logic minimal - delegate to services when possible

7. **File Naming**
   - Use PascalCase for component names (DiscussionTable)
   - Use camelCase for utility functions and services
   - Type definition files should match their feature name

# Folder Structure Explanation

1. **src/**
   - Contains all source code files.
2. **app/**
   - Next.js routing and layout files.
3. **components/**
   - Reusable UI components.
   - **layout/** - Layout components (navigation, backgrounds, providers).
   - **pages/** - Page-specific components organized by route.
4. **lib/**
   - Core utility libraries and configurations (database, auth, external services).
5. **services/**
   - Business logic and API services.
6. **types/**
   - TypeScript type definitions.
7. **utils/**
   - Helper functions and utilities.
8. **prisma/**
   - Database schema and migrations.
9. **public/**
   - Static assets (images, fonts, etc.).
   
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
