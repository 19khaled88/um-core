/*
  Warnings:

  - Added the required column `superAdminId` to the `superadmins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "superadmins" ADD COLUMN     "superAdminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "superAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "superadmins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
