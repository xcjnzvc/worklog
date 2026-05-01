/*
  Warnings:

  - The values [VIOLATED] on the enum `AttendanceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttendanceStatus_new" AS ENUM ('NORMAL', 'LATE', 'EARLY_LEAVE', 'LATE_EARLY', 'INSUFFICIENT', 'MISSING_OUT', 'ABSENT');
ALTER TABLE "public"."WorkLog" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WorkLog" ALTER COLUMN "status" TYPE "AttendanceStatus_new" USING ("status"::text::"AttendanceStatus_new");
ALTER TYPE "AttendanceStatus" RENAME TO "AttendanceStatus_old";
ALTER TYPE "AttendanceStatus_new" RENAME TO "AttendanceStatus";
DROP TYPE "public"."AttendanceStatus_old";
ALTER TABLE "WorkLog" ALTER COLUMN "status" SET DEFAULT 'NORMAL';
COMMIT;
