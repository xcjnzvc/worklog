import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AttendanceService } from './attendance.service';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceScheduler } from './attendance.scheduler';
import { AttendanceController } from './attendance.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository, AttendanceScheduler],
})
export class AttendanceModule {}
