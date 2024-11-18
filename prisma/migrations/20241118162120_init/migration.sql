-- AlterTable
ALTER TABLE "users" ADD COLUMN     "adminId" TEXT,
ALTER COLUMN "needsPassChange" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
