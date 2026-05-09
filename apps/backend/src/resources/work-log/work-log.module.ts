import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { WorkLogController } from './controllers/work-log.controller';
import { WorkLogMgmtController } from './controllers/work-log.mgmt.controller';
import { WorkLogRepository } from './work-log.repository';
import { WorkLogScheduler } from './work-log.scheduler';
import { WorkLogService } from './work-log.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [WorkLogController, WorkLogMgmtController],
  providers: [WorkLogService, WorkLogRepository, WorkLogScheduler],
})
export class WorkLogModule {}
