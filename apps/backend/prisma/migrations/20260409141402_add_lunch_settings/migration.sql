-- AlterTable
ALTER TABLE "WorkPolicy" ADD COLUMN     "lunchEndTime" TEXT NOT NULL DEFAULT '13:00',
ADD COLUMN     "lunchStartTime" TEXT NOT NULL DEFAULT '12:00';
