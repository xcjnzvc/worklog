import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('live')
  async getLiveStatus(@GetUser('userId') userId: string) {
    return this.attendanceService.getLiveWorkMinutes(userId);
  }

  @Get('weekly')
  async getWeeklyStats(@GetUser('userId') userId: string) {
    return await this.attendanceService.getWeeklyStats(userId);
  }

  @Post('clock-in')
  async clockIn(@GetUser('userId') userId: string) {
    return this.attendanceService.clockIn(userId);
  }

  @Post('clock-out')
  async clockOut(@GetUser('userId') userId: string) {
    return this.attendanceService.clockOut(userId);
  }
}
