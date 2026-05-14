-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "WorkLog_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
