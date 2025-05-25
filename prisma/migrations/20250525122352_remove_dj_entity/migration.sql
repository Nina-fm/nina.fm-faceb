/*
  Warnings:

  - You are about to drop the `Dj` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DjOnMixtape` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DjOnMixtape" DROP CONSTRAINT "DjOnMixtape_djId_fkey";

-- DropForeignKey
ALTER TABLE "DjOnMixtape" DROP CONSTRAINT "DjOnMixtape_mixtapeId_fkey";

-- DropTable
DROP TABLE "Dj";

-- DropTable
DROP TABLE "DjOnMixtape";
