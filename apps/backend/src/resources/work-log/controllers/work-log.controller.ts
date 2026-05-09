import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import getMetadata from 'src/common/utils/get-metadata';
import { Endpoint } from 'ts-deco';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { WorkLogHistoryFindListResponseDto } from '../dto/res/work-log.find-list.dto';
import { WorkLogHistoryFindListDto } from '../dto/work-log-history.find-list.dto';
import { WorkLogService } from '../work-log.service';

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
    endpoint: 'work-log',
    summary: '근무 기록 조회',
    method: 'GET',
    description: '유저의 근무 기록을 조회합니다.',
    responses: [
      {
        status: 200,
        description: '근무 기록 조회 성공',
        type: WorkLogHistoryFindListResponseDto,
      },
    ],
  })
  async findListWorkLogHistory(
    @Query() query: WorkLogHistoryFindListDto,
    @GetUser('userId') userId: string,
  ): Promise<WorkLogHistoryFindListResponseDto> {
    const { result, total } = await this.workLogService.getWorkLogHistory(
      query,
      userId,
    );
    return { result, metadata: getMetadata(query, total) };
  }
}
