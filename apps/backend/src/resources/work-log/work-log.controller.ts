import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { WorkLogService } from './work-log.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Get('live')
  async getLiveStatus(@GetUser('userId') userId: string) {
    return this.workLogService.getLiveWorkMinutes(userId);
  }

  @Get('weekly')
  async getWeeklyStats(@GetUser('userId') userId: string) {
    return await this.workLogService.getWeeklyStats(userId);
  }

  @Post('clock-in')
  async clockIn(@GetUser('userId') userId: string) {
    return this.workLogService.clockIn(userId);
  }

  @Post('clock-out')
  async clockOut(@GetUser('userId') userId: string) {
    return this.workLogService.clockOut(userId);
  }
}
