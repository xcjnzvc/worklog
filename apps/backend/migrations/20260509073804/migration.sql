/*
  Warnings:

  - You are about to drop the `WorkLogHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkLogHistory" DROP CONSTRAINT "WorkLogHistory_userId_fkey";

-- DropTable
DROP TABLE "WorkLogHistory";
