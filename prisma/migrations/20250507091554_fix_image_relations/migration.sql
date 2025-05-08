-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_mixtapeId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "mixtapeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_mixtapeId_fkey" FOREIGN KEY ("mixtapeId") REFERENCES "Mixtape"("id") ON DELETE SET NULL ON UPDATE CASCADE;
