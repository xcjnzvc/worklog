import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { WorkLogService } from '../work-log.service';
import { Endpoint } from 'ts-deco';
import { WorkLogUpdateDto } from '../dto/work-log.update.dto';

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


  @Endpoint({
    endpoint: 'work-log/fix',
    summary: '근무 기록 수정',
    method: 'POST',
    description: '근무 기록을 수정합니다.',
    responses: [
      {
        status: 200,
        description: '근무 기록 수정 성공',
        type: null,
      },
    ],
  })
  async fixWorkLog(@GetUser('userId') userId: string,@Body() body:WorkLogUpdateDto) {
    return this.workLogService.fixWorkLog(userId, body.reason);
  }
}
