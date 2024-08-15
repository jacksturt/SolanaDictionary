-- AlterTable
ALTER TABLE "EntryEdit" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "previousHidden" BOOLEAN NOT NULL DEFAULT false;
