/*
  Warnings:

  - You are about to drop the column `updateRequest` on the `Entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "updateRequest",
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateRequested" BOOLEAN NOT NULL DEFAULT false;
