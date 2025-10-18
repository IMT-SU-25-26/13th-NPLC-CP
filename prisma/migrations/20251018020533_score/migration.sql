-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSubmission" TIMESTAMP(3),
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;
