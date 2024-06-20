/*
  Warnings:

  - A unique constraint covering the columns `[term]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entry_term_key" ON "Entry"("term");
