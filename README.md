# Import Order Rules

1. **Default Imports First**

   - `import Link from 'next/link'` (next.js components)
   - `import React from 'react'` (external libraries)

2. **Named Imports Second**

   - `import { useState, useEffect } from 'react'` (external named imports)
   - `import { functionName, typeName } from '@/lib/...'` (internal named imports)
   - `import { MyComponent } from '@/components/...'` (internal named imports)

3. **Internal vs External**

   - External imports (libraries) before internal imports (project files)

4. **Named Imports Order**

   - next.js components first
   - external libraries second
   - lib files third
   - services fourth
   - utils fifth
   - types sixth
   - components last
   - prisma imports should always be at the very end

# Import Path Rules

1. **Absolute Imports**

   - Always use `@/` for all imports from `src/` directory
   - Import components with full paths: `@/components/app/discussions/discussion-table`

2. **Relative Imports**

   - Use `./` for files in the same directory
   - Avoid deep relative imports when absolute imports are cleaner

3. **Import Patterns**
   - Server pages import services and lib files directly
   - Components receive data via props (not by importing services)

# Code Structure Rules

1. **Components Organization**

   - Layout components (NavigationBar, Background, providers) go in `components/layout/`
   - App page components go in `components/app/` organized by feature (discussions, contests, submissions, etc.)
   - All components must start with a capital letter
   - Components must be exported as named exports
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
   - Use kebab-case for component file names (discussion-table.tsx)
   - Use camelCase for utility functions and services
   - Type definition files should match their feature name

# Folder Structure Explanation

1. **src/**

   - Contains all source code files.

2. **prisma/**

   - Database schema and migrations.

3. **public/**

   - Static assets (images, fonts, etc.).

4. **app/**

   - Next.js routing and layout files.

5. **components/**

   - Reusable UI components.
   - **layout/** - Layout components (navigation, backgrounds, providers).
   - **app/** - Page-specific components organized by route.
   - **[route]/** - Components for root-level routes (admin, auth, waiting, etc.).

6. **lib/**

   - Core utility libraries and configurations (database, auth, external services).

7. **hooks/**

   - Custom React hooks.

8. **services/**

   - Business logic and API services.

9. **types/**

   - TypeScript type definitions.

10. **utils/**
   
    - Helper functions and utilities.

# Component and Page Integration Example

## How Components and Pages Work Together

### Server Page (app/(app)/submissions/page.tsx)

```tsx
import { SubmissionTable } from "@/components/pages/app/submissions/submission-table";
import { getSubmissionByUserId } from "@/services/submissions";
import { getCurrentUserId } from "@/lib/session";

export default async function SubmissionPage() {
  const userId = await getCurrentUserId();
  const submissions = await getSubmissionByUserId(userId);

  return (
    <div className="container">
      <SubmissionTable submissions={submissions} />
    </div>
  );
}
```

### Client Component (components/app/submissions/submission-table.tsx)

```tsx
"use client";

interface SubmissionTableProps {
  submissions: FullSubmission[];
}

export function SubmissionTable({ submissions }: SubmissionTableProps) {
  return (
    <table>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission.id}>
            <td>{submission.status}</td>
            <td>{submission.time}ms</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Key Pattern**: Server pages fetch data and pass it to client components via props. Components never import services directly.

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
