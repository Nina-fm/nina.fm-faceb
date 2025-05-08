/*
  Warnings:

  - Made the column `djsAsText` on table `Mixtape` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mixtape" ALTER COLUMN "djsAsText" SET NOT NULL;
