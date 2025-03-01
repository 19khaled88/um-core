/*
  Warnings:

  - Added the required column `syncId` to the `superadmins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "superadmins" ADD COLUMN     "syncId" TEXT NOT NULL;
