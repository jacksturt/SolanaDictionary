/*
  Warnings:

  - A unique constraint covering the columns `[currentVersionId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "currentVersionId" TEXT;

-- CreateTable
CREATE TABLE "EntryEdit" (
    "id" TEXT NOT NULL,
    "peerReviewCount" INTEGER NOT NULL DEFAULT 0,
    "entryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "longDefinition" TEXT,
    "links" TEXT[],
    "tags" TEXT[],
    "previousTerm" TEXT NOT NULL,
    "previousDefinition" TEXT NOT NULL,
    "previousLongDefinition" TEXT,
    "previousLinks" TEXT[],
    "previousTags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,
    "entryEditId" TEXT,

    CONSTRAINT "EntryEdit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_currentVersionId_key" ON "Entry"("currentVersionId");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "EntryEdit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryEdit" ADD CONSTRAINT "EntryEdit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "EntryEdit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryEdit" ADD CONSTRAINT "EntryEdit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryEdit" ADD CONSTRAINT "EntryEdit_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
