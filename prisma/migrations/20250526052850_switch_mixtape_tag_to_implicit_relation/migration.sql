/*
  Warnings:

  - You are about to drop the `TagOnMixtape` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TagOnMixtape" DROP CONSTRAINT "TagOnMixtape_mixtapeId_fkey";

-- DropForeignKey
ALTER TABLE "TagOnMixtape" DROP CONSTRAINT "TagOnMixtape_tagId_fkey";

-- DropTable
DROP TABLE "TagOnMixtape";

-- CreateTable
CREATE TABLE "_MixtapeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MixtapeToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MixtapeToTag_B_index" ON "_MixtapeToTag"("B");

-- AddForeignKey
ALTER TABLE "_MixtapeToTag" ADD CONSTRAINT "_MixtapeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Mixtape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MixtapeToTag" ADD CONSTRAINT "_MixtapeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
