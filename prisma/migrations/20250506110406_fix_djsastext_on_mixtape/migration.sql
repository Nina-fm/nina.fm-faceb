/*
  Warnings:

  - You are about to drop the column `djAsText` on the `Mixtape` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mixtape" DROP COLUMN "djAsText",
ADD COLUMN     "djsAsText" TEXT;
