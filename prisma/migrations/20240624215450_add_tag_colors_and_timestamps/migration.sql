/*
  Warnings:

  - Added the required column `updatedAt` to the `EntryTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntryTag" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
