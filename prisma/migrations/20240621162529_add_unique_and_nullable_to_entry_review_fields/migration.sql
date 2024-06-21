/*
  Warnings:

  - A unique constraint covering the columns `[userId,entryId]` on the table `EntryReview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EntryReview" ALTER COLUMN "reviewedVersionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EntryReview_userId_entryId_key" ON "EntryReview"("userId", "entryId");
