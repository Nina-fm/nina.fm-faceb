/*
  Warnings:

  - You are about to drop the column `coverImageId` on the `Mixtape` table. All the data in the column will be lost.
  - You are about to drop the column `avatarImageId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mixtapeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Mixtape" DROP CONSTRAINT "Mixtape_coverImageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarImageId_fkey";

-- DropIndex
DROP INDEX "Mixtape_coverImageId_key";

-- DropIndex
DROP INDEX "User_avatarImageId_key";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "mixtapeId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Mixtape" DROP COLUMN "coverImageId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarImageId";

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_mixtapeId_key" ON "Image"("mixtapeId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_mixtapeId_fkey" FOREIGN KEY ("mixtapeId") REFERENCES "Mixtape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
