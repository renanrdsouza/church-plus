/*
  Warnings:

  - You are about to drop the column `memberId` on the `FinancialContribuition` table. All the data in the column will be lost.
  - Added the required column `member_id` to the `FinancialContribuition` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FinancialContribuition" DROP CONSTRAINT "FinancialContribuition_memberId_fkey";

-- AlterTable
ALTER TABLE "FinancialContribuition" DROP COLUMN "memberId",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FinancialContribuition" ADD CONSTRAINT "FinancialContribuition_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
