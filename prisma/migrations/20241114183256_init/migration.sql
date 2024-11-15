/*
  Warnings:

  - Added the required column `dateOfBirth` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactNo` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanentAddress` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentAddress` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactNo` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanentAddress` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentAddress` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "emergencyContactNo" TEXT NOT NULL,
ADD COLUMN     "permanentAddress" TEXT NOT NULL,
ADD COLUMN     "presentAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "emergencyContactNo" TEXT NOT NULL,
ADD COLUMN     "permanentAddress" TEXT NOT NULL,
ADD COLUMN     "presentAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "emergencyContactNo" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "presentAddress" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "managementDepartmentId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managementdepartments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "managementdepartments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "managementdepartments_title_key" ON "managementdepartments"("title");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_managementDepartmentId_fkey" FOREIGN KEY ("managementDepartmentId") REFERENCES "managementdepartments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
