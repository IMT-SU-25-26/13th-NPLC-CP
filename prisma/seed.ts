import prisma from "@/lib/prisma";
import { Difficulty, ContestStatus, Role } from "@prisma/client";
import { hashSync } from "@node-rs/bcrypt";

const languages = [
  { id: 54, name: "C++ (GCC 9.2.0)" },
  { id: 71, name: "Python (3.8.1)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
];

const adminUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123456",
    role: Role.ADMIN,
  },
  {
    name: "Bryan",
    email: "bfernando@student.ciputra.ac.id",
    password: "123456",
    role: Role.ADMIN,
  },
  {
    name: "Obie",
    email: "ozuriel07@student.ciputra.ac.id",
    password: "123456",
    role: Role.ADMIN,
  },
];

const problems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    difficulty: Difficulty.EASY,
    points: 100,
    timeLimit: 2.0,
    memoryLimit: 256,
    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        isSample: true,
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
        isSample: true,
      },
      {
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
        isSample: false,
      },
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

**Example 1:**
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

**Example 2:**
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]

**Constraints:**
- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
    difficulty: Difficulty.EASY,
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    testCases: [
      {
        input: "hello",
        expectedOutput: "olleh",
        isSample: true,
      },
      {
        input: "Hannah",
        expectedOutput: "hannaH",
        isSample: true,
      },
      {
        input: "a",
        expectedOutput: "a",
        isSample: false,
      },
    ],
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same backward as forward.

**Example 1:**
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

**Example 2:**
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

**Example 3:**
Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.

**Constraints:**
- -2^31 <= x <= 2^31 - 1`,
    difficulty: Difficulty.EASY,
    points: 100,
    timeLimit: 1.5,
    memoryLimit: 128,
    testCases: [
      {
        input: "121",
        expectedOutput: "true",
        isSample: true,
      },
      {
        input: "-121",
        expectedOutput: "false",
        isSample: true,
      },
      {
        input: "10",
        expectedOutput: "false",
        isSample: false,
      },
      {
        input: "12321",
        expectedOutput: "true",
        isSample: false,
      },
    ],
  },
  {
    slug: "fibonacci-number",
    title: "Fibonacci Number",
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).

**Example 1:**
Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.

**Example 2:**
Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.

**Example 3:**
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.

**Constraints:**
- 0 <= n <= 30`,
    difficulty: Difficulty.EASY,
    points: 100,
    timeLimit: 1.0,
    memoryLimit: 128,
    testCases: [
      {
        input: "2",
        expectedOutput: "1",
        isSample: true,
      },
      {
        input: "3",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "4",
        expectedOutput: "3",
        isSample: false,
      },
      {
        input: "10",
        expectedOutput: "55",
        isSample: false,
      },
    ],
  },
];

async function seedUser(userData: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (!existingUser) {
    try {
      const hashedPassword = hashSync(userData.password, 10);

      await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
          emailVerified: new Date(),
        },
      });

      console.log(`Created user: ${userData.name} (${userData.email})`);
    } catch (error) {
      console.error(`Failed to create user ${userData.email}:`, error);
    }
  } else {
    console.log(`User already exists: ${userData.name} (${userData.email})`);
  }
}

export async function main() {
  // Seed users
  console.log("\n" + "=".repeat(50));
  console.log("Seeding users...");
  console.log("=".repeat(50));

  // Seed admin users
  for (const userData of adminUsers) {
    await seedUser(userData);
  }

  // Seed generic users
  for (let i = 1; i <= 40; i++) {
    const userData = {
      name: `Test User ${i}`,
      email: `user${i}@example.com`,
      password: "password123",
      role: Role.USER,
    };
    await seedUser(userData);
  }

  // Seed languages
  console.log("\n" + "=".repeat(50));
  console.log("Seeding languages...");
  console.log("=".repeat(50));

  for (const lang of languages) {
    const language = await prisma.language.upsert({
      where: { id: lang.id },
      update: {},
      create: {
        id: lang.id,
        name: lang.name,
      },
    });
    console.log(`Created language: ${language.name}`);
  }

  // Seed problems and their test cases
  console.log("\n" + "=".repeat(50));
  console.log("Seeding problems and test cases...");
  console.log("=".repeat(50));

  for (const problemData of problems) {
    const { testCases, ...problemInfo } = problemData;

    const problem = await prisma.problem.upsert({
      where: { slug: problemInfo.slug },
      update: {},
      create: {
        ...problemInfo,
        testCases: {
          create: testCases,
        },
      },
    });

    console.log(
      `Created problem: ${problem.title} (${testCases.length} test cases)`
    );
  }

  // Seed a default contest if none exists
  console.log("\n" + "=".repeat(50));
  console.log("Seeding contest...");
  console.log("=".repeat(50));

  const existingContest = await prisma.contest.findFirst();

  if (!existingContest) {
    const contest = await prisma.contest.create({
      data: {
        name: "NPLC 13",
        startTime: new Date(),
        endTime: new Date(),
        status: ContestStatus.PENDING,
      },
    });
    console.log(`Created contest: ${contest.name}`);
  } else {
    console.log(`Contest already exists, skipping creation.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
