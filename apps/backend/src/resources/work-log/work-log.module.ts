import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkLogService } from './work-log.service';
import { WorkLogRepository } from './work-log.repository';
import { WorkLogScheduler } from './work-log.scheduler';
import { WorkLogController } from './controllers/work-log.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [WorkLogController],
  providers: [WorkLogService, WorkLogRepository, WorkLogScheduler],
})
export class WorkLogModule {}
