/*
  Warnings:

  - Added the required column `syncId` to the `managementdepartments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "managementdepartments" ADD COLUMN     "syncId" TEXT NOT NULL;
