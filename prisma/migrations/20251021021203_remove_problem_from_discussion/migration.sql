/*
  Warnings:

  - You are about to drop the column `problemId` on the `Discussion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Discussion" DROP CONSTRAINT "Discussion_problemId_fkey";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "problemId";
