-- CreateTable
CREATE TABLE "superadmins" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "profileImage" TEXT,
    "email" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "emergencyContactNo" TEXT NOT NULL,
    "presentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "designation" TEXT NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT true,
    "permissions" TEXT[] DEFAULT ARRAY['manage-users', 'manage-settings', 'full-access']::TEXT[],
    "managementDepartmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "superadmins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "superadmins_email_key" ON "superadmins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "superadmins_contactNo_key" ON "superadmins"("contactNo");

-- AddForeignKey
ALTER TABLE "superadmins" ADD CONSTRAINT "superadmins_managementDepartmentId_fkey" FOREIGN KEY ("managementDepartmentId") REFERENCES "managementdepartments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
