/*
  Warnings:

  - Added the required column `syncId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "syncId" TEXT NOT NULL;
