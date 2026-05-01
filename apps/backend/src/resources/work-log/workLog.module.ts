import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkLogService } from './workLog.service';
import { WorkLogRepository } from './workLog.repository';
import { WorkLogScheduler } from './workLog.scheduler';
import { WorkLogController } from './workLog.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [WorkLogController],
  providers: [WorkLogService, WorkLogRepository, WorkLogScheduler],
})
export class WorkLogModule {}
