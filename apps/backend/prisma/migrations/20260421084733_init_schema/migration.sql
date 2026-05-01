/*
  Warnings:

  - The values [HALF] on the enum `LeaveType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeaveType_new" AS ENUM ('ANNUAL', 'HALF_AM', 'HALF_PM');
ALTER TABLE "public"."LeaveRequest" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "LeaveRequest" ALTER COLUMN "type" TYPE "LeaveType_new" USING ("type"::text::"LeaveType_new");
ALTER TYPE "LeaveType" RENAME TO "LeaveType_old";
ALTER TYPE "LeaveType_new" RENAME TO "LeaveType";
DROP TYPE "public"."LeaveType_old";
ALTER TABLE "LeaveRequest" ALTER COLUMN "type" SET DEFAULT 'ANNUAL';
COMMIT;

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "approverId" TEXT,
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalLeave" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "usedLeave" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "WorkPolicy" ADD COLUMN     "workEndTime" TEXT NOT NULL DEFAULT '18:00',
ADD COLUMN     "workMinutes" INTEGER NOT NULL DEFAULT 480;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
