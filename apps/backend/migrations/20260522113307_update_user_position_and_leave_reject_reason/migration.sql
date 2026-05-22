/*
  Warnings:

  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "rejectReason" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "position",
ADD COLUMN     "positionId" TEXT;

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_companyId_name_key" ON "Position"("companyId", "name");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;
