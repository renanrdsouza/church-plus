/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cep` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `FinancialContribuition` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FinancialContribuition` table. All the data in the column will be lost.
  - You are about to drop the column `baptismDate` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `motherName` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Member` table. All the data in the column will be lost.
  - The primary key for the `Phone` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `memberId` on the `Phone` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Phone` table. All the data in the column will be lost.
  - Added the required column `member_id` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FinancialContribuition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baptism_date` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `father_name` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mother_name` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `Phone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Phone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_memberId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "cep",
DROP COLUMN "memberId",
ADD COLUMN     "member_id" TEXT NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Address_id_seq";

-- AlterTable
ALTER TABLE "FinancialContribuition" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "baptismDate",
DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "fatherName",
DROP COLUMN "motherName",
DROP COLUMN "updatedAt",
ADD COLUMN     "baptism_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "father_name" TEXT NOT NULL,
ADD COLUMN     "mother_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_pkey",
DROP COLUMN "memberId",
DROP COLUMN "phoneNumber",
ADD COLUMN     "member_id" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Phone_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Phone_id_seq";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
