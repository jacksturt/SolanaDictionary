/*
  Warnings:

  - Changed the type of `links` on the `Entry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `links` on the `EntryEdit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `previousLinks` on the `EntryEdit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "acronym" TEXT,
DROP COLUMN "links",
ADD COLUMN     "links" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "EntryEdit" ADD COLUMN     "acronym" TEXT,
ADD COLUMN     "previousAcronym" TEXT,
DROP COLUMN "links",
ADD COLUMN     "links" JSONB NOT NULL,
DROP COLUMN "previousLinks",
ADD COLUMN     "previousLinks" JSONB NOT NULL;
