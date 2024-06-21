-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "links" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EntryEdit" ALTER COLUMN "links" DROP NOT NULL,
ALTER COLUMN "previousLinks" DROP NOT NULL;
