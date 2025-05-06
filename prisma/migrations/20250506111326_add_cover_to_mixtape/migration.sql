/*
  Warnings:

  - A unique constraint covering the columns `[mixtapeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mixtapeId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "mixtapeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_mixtapeId_key" ON "Image"("mixtapeId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_mixtapeId_fkey" FOREIGN KEY ("mixtapeId") REFERENCES "Mixtape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
