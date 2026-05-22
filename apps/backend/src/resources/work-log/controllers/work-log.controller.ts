import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { WorkLogService } from '../work-log.service';
import { Endpoint } from 'ts-deco';
import { WorkLogUpdateDto } from '../dto/work-log.update.dto';
import { WorkLogHistoryFindListResponseDto } from '../dto/res/work-log.find-list.dto';
import getMetadata from 'src/common/utils/get-metadata';
import { WorkLogDashboardResponseDto } from '../dto/res/work-log.dashboard.dto';
import { RejectVacationDto } from 'src/resources/vacation/dto/reject-vacation.dto';
import {
  WorkLogHistoryFindListDto,
  WorkLogHistoryFindListMgmtDto,
} from '../dto/work-log-history.find-list.dto';

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
    endpoint: 'work-log/fix/:id',
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
  async fixWorkLog(
    @GetUser('userId') userId: string,
    @Body() body: WorkLogUpdateDto,
    @Param('id') id: string,
  ) {
    return this.workLogService.fixWorkLog(userId, id, body);
  }

  @Endpoint({
    endpoint: 'work-log/fix/own',
    summary: '내 근무 수정 기록 조회',
    method: 'GET',
    description: '내 정정 신청 목록을 조회합니다.',
    responses: [
      {
        status: 200,
        description: '조회 성공',
        // 💡 기존에 있던 DTO를 그대로 사용합니다.
        type: WorkLogHistoryFindListResponseDto,
      },
    ],
  })
  async findFixWorkLog(
    @GetUser('userId') userId: string,
    @Query() query: WorkLogHistoryFindListMgmtDto,
  ): Promise<WorkLogHistoryFindListResponseDto> {
    const { result, total } = await this.workLogService.findFixWorkLog(
      userId,
      query,
    );

    return {
      result,
      metadata: getMetadata(query, total),
    };
  }

  @Endpoint({
    endpoint: 'work-log',
    summary: '근무 기록 목록 조회',
    method: 'GET',
    description: '근무 기록 목록을 조회합니다.',
    responses: [
      {
        status: 200,
        description: '조회 성공',
        type: WorkLogHistoryFindListResponseDto,
      },
    ],
  })
  async findListWorkHistory(
    @GetUser('userId') userId: string,
    @Query() query: WorkLogHistoryFindListDto,
  ): Promise<WorkLogHistoryFindListResponseDto> {
    const { result, total } = await this.workLogService.findListWorkLog(
      query,
      userId,
    );

    return { result, metadata: getMetadata(query, total) };
  }

  @Endpoint({
    endpoint: 'work-log/own/dashboard',
    summary: '내 근무 대시보드 조회',
    method: 'GET',
    description: '내 근무 대시보드를 조회합니다.',
    responses: [
      {
        status: 200,
        description: '조회 성공',
        type: WorkLogDashboardResponseDto,
      },
    ],
  })
  async findDashboard(
    @GetUser('userId') userId: string,
  ): Promise<WorkLogDashboardResponseDto> {
    return this.workLogService.dashboard(userId);
  }

  @Endpoint({
    endpoint: 'work-log/mgmt/dashboard',
    summary: '[관리자/대표] 전체 팀원 근태 정정 대시보드 조회',
    method: 'GET',
    description:
      '대표 화면 상단 카드의 승인 대기, 승인 완료 건수 통계를 조회합니다.',
    responses: [
      {
        status: 200,
        description: '조회 성공',
        type: WorkLogDashboardResponseDto,
      },
    ],
  })
  async findMgmtDashboard(
    @GetUser('userId') userId: string,
  ): Promise<WorkLogDashboardResponseDto> {
    return this.workLogService.dashboardMgmt(userId);
  }

  @Endpoint({
    endpoint: 'work-log/mgmt/list', // 💡 관리자용 전체 정정 신청 목록 주소
    summary: '[관리자/대표] 팀원 전체 근태 정정 신청 목록 조회',
    method: 'GET',
    description:
      '팀원들이 요청한 모든 근태 정정 승인 대기 리스트를 조회합니다.',
    responses: [
      {
        status: 200,
        description: '조회 성공',
        type: WorkLogHistoryFindListResponseDto,
      },
    ],
  })
  async findListMgmtWorkLog(
    @Query() query: WorkLogHistoryFindListMgmtDto,
  ): Promise<WorkLogHistoryFindListResponseDto> {
    const { result, total } =
      await this.workLogService.findListMgmtWorkLog(query);

    return {
      result,
      metadata: getMetadata(query, total),
    };
  }

  @Endpoint({
    endpoint: 'work-log/mgmt/:id/approve', // 💡 관리자용 최종 승인 주소
    summary: '[관리자/대표] 정정 최종 승인',
    method: 'PATCH',
    description:
      '신청된 근태 정정 요청을 최종 승인하여 출퇴근 시간을 반영합니다.',
  })
  async approveMgmtWorkLog(@Param('id') id: string) {
    return this.workLogService.updateMgmtWorkLog(id);
  }

  @Endpoint({
    endpoint: 'work-log/mgmt/:id/reject', // 💡 관리자용 반려 주소
    summary: '[관리자/대표] 정정 신청 반려',
    method: 'PATCH',
    description: '신청된 근태 정정 요청을 반려 사유와 함께 반려 처리합니다.',
  })
  async rejectMgmtWorkLog(
    @Param('id') id: string,
    @Body() body: RejectVacationDto,
  ) {
    return this.workLogService.rejectMgmtWorkLog(id, body);
  }
}
