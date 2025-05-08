/*
  Warnings:

  - You are about to drop the column `mixtapeId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coverImageId]` on the table `Mixtape` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarImageId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_mixtapeId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropIndex
DROP INDEX "Image_mixtapeId_key";

-- DropIndex
DROP INDEX "Image_userId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "mixtapeId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Mixtape" ADD COLUMN     "coverImageId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Mixtape_coverImageId_key" ON "Mixtape"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarImageId_key" ON "User"("avatarImageId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarImageId_fkey" FOREIGN KEY ("avatarImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mixtape" ADD CONSTRAINT "Mixtape_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
