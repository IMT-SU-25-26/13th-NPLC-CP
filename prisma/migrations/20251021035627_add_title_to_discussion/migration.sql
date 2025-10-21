/*
  Warnings:

  - Added the required column `title` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "title" TEXT NOT NULL;
