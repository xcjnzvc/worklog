-- CreateEnum
CREATE TYPE "ApprStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "WorkLog" ADD COLUMN     "apprStatus" "ApprStatus",
ADD COLUMN     "approverId" TEXT,
ADD COLUMN     "fixType" TEXT;
