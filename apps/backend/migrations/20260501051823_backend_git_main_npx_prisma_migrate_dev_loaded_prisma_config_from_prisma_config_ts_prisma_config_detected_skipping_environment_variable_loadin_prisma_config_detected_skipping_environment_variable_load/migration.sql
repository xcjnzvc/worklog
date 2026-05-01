/*
  Warnings:

  - The `status` column on the `LeaveRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalLeave` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usedLeave` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workPolicyId` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AttendanceFix` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_policy_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "attendance_status" AS ENUM ('정상 출퇴근', '지각 ', '조기 퇴근', '지각, 조기 퇴근', '유연근무 총 시간 미달', '퇴근 누락', '결근');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('대표', '관리자', '직원', '최고 관리자(강수정))');

-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('승인 대기', '승인 완료', '반려');

-- DropForeignKey
ALTER TABLE "AttendanceFix" DROP CONSTRAINT "AttendanceFix_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_workPolicyId_fkey";

-- DropForeignKey
ALTER TABLE "WorkLog" DROP CONSTRAINT "WorkLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkPolicy" DROP CONSTRAINT "WorkPolicy_companyId_fkey";

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "status",
ADD COLUMN     "status" "request_status" NOT NULL DEFAULT '승인 대기';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyId",
DROP COLUMN "createdAt",
DROP COLUMN "totalLeave",
DROP COLUMN "usedLeave",
DROP COLUMN "workPolicyId",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "total_leave" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "used_leave" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "work_policy_id" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL DEFAULT '직원';

-- DropTable
DROP TABLE "AttendanceFix";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Invitation";

-- DropTable
DROP TABLE "WorkLog";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "work_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "clock_in" TIMESTAMP(3) NOT NULL,
    "clock_out" TIMESTAMP(3),
    "work_minutes" INTEGER,
    "status" "attendance_status" NOT NULL DEFAULT '정상 출퇴근',
    "is_overtime" BOOLEAN NOT NULL DEFAULT false,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_history" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "target_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "requested_clock_in" TIMESTAMP(3),
    "requested_clock_out" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "attendance_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT '직원',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_log_user_id_date_key" ON "work_log"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "invite_token_key" ON "invite"("token");

-- AddForeignKey
ALTER TABLE "work_log" ADD CONSTRAINT "work_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_history" ADD CONSTRAINT "attendance_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "invite_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkPolicy" ADD CONSTRAINT "WorkPolicy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_work_policy_id_fkey" FOREIGN KEY ("work_policy_id") REFERENCES "WorkPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
