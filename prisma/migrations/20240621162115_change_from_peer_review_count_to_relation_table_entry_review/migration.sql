/*
  Warnings:

  - You are about to drop the column `peerReviewCount` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `peerReviewCount` on the `EntryEdit` table. All the data in the column will be lost.
  - You are about to drop the column `hasReviewed` on the `UserEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "peerReviewCount";

-- AlterTable
ALTER TABLE "EntryEdit" DROP COLUMN "peerReviewCount";

-- AlterTable
ALTER TABLE "UserEntry" DROP COLUMN "hasReviewed";

-- CreateTable
CREATE TABLE "EntryReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedVersionId" TEXT NOT NULL,

    CONSTRAINT "EntryReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EntryReview" ADD CONSTRAINT "EntryReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryReview" ADD CONSTRAINT "EntryReview_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryReview" ADD CONSTRAINT "EntryReview_reviewedVersionId_fkey" FOREIGN KEY ("reviewedVersionId") REFERENCES "EntryEdit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
