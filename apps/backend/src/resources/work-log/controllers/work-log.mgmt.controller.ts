import { Body, Param, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UseRole } from 'src/common/decorators/use-role.decorator';
import getMetadata from 'src/common/utils/get-metadata';
import { Endpoint, ResourceMgmt } from 'ts-deco';
import {
  WorkLogDataDto,
  WorkLogHistoryFindListResponseDto,
  WorkLogMgmtUpdateResponseDto,
} from '../dto/res/work-log.find-list.dto';
import { WorkLogHistoryFindListMgmtDto } from '../dto/work-log-history.find-list.dto';
import { WorkLogService } from '../work-log.service';
import { RejectVacationDto } from 'src/resources/vacation/dto/reject-vacation.dto';

@ResourceMgmt('work-log')
export class WorkLogMgmtController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Endpoint({
    endpoint: 'work-log/mgmt/list',
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
    const mgmtQuery = {
      ...query,
      isFix: true,
      apprStatus: 'PENDING',
    };

    const { result, total } =
      await this.workLogService.findListMgmtWorkLog(mgmtQuery);

    return {
      result,
      metadata: getMetadata(query, total),
    };
  }

  @Endpoint({
    endpoint: ':id',
    summary: '근무 기록 수정 (관리자 전용)',
    method: 'PATCH',
    description:
      '근무 기록의 출근/퇴근 시간을 수정하고 상태값을 자동 변경합니다.',
    responses: [
      {
        status: 200,
        description: '근무 기록 수정 성공',
        type: WorkLogMgmtUpdateResponseDto,
      },
    ],
  })
  @UseRole(Role.OWNER, Role.ADMIN)
  async updateWorkLog(
    @Param('id') id: string,
  ): Promise<WorkLogMgmtUpdateResponseDto> {
    return this.workLogService.updateMgmtWorkLog(id);
  }

  @Endpoint({
    endpoint: ':id/reject',
    summary: '정정 신청 반려 (관리자 전용)',
    method: 'PATCH',
    responses: [{ status: 200, description: '반려 성공', type: null }],
  })
  @UseRole(Role.OWNER, Role.ADMIN)
  async rejectWorkLog(
    @Param('id') id: string,
    @Body() dto: RejectVacationDto,
  ): Promise<WorkLogDataDto> {
    return this.workLogService.rejectMgmtWorkLog(id, dto);
  }
}
