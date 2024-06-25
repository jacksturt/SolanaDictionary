-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_currentVersionId_fkey";

-- DropForeignKey
ALTER TABLE "entry_relations" DROP CONSTRAINT "entry_relations_entryAId_fkey";

-- DropForeignKey
ALTER TABLE "entry_relations" DROP CONSTRAINT "entry_relations_entryBId_fkey";

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "EntryEdit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_relations" ADD CONSTRAINT "entry_relations_entryAId_fkey" FOREIGN KEY ("entryAId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_relations" ADD CONSTRAINT "entry_relations_entryBId_fkey" FOREIGN KEY ("entryBId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
