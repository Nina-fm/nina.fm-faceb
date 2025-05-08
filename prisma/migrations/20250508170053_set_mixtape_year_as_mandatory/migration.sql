/*
  Warnings:

  - Made the column `year` on table `Mixtape` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mixtape" ALTER COLUMN "year" SET NOT NULL;
