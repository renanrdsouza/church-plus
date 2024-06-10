/*
  Warnings:

  - You are about to drop the column `cityId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_cityId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_stateId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "cityId",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "uf" TEXT NOT NULL;

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "State";
