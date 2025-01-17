/*
  Warnings:

  - Added the required column `syncId` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "syncId" TEXT NOT NULL;
