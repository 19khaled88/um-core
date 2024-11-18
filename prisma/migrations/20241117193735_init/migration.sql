/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `managementdepartments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "managementdepartments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Auth";

-- CreateTable
CREATE TABLE "auths" (
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "auths_pkey" PRIMARY KEY ("userId")
);
