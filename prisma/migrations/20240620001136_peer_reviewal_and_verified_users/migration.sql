-- DropForeignKey
ALTER TABLE "UserEntry" DROP CONSTRAINT "UserEntry_entryId_fkey";

-- DropForeignKey
ALTER TABLE "UserEntry" DROP CONSTRAINT "UserEntry_userId_fkey";

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "peerReviewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserEntry" ADD COLUMN     "hasReviewed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "UserEntry" ADD CONSTRAINT "UserEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntry" ADD CONSTRAINT "UserEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
