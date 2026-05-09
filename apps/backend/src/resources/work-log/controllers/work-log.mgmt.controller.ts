import { Body, Param, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UseRole } from 'src/common/decorators/use-role.decorator';
import getMetadata from 'src/common/utils/get-metadata';
import { Endpoint, ResourceMgmt } from 'ts-deco';
import {
  WorkLogHistoryFindListResponseDto,
  WorkLogMgmtUpdateResponseDto,
} from '../dto/res/work-log.find-list.dto';
import { WorkLogHistoryFindListDto } from '../dto/work-log-history.find-list.dto';
import { WorkLogMgmtUpdateDto } from '../dto/work-log.mgmt.update.dto';
import { WorkLogService } from '../work-log.service';

@ResourceMgmt('work-log')
export class WorkLogMgmtController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Endpoint({
    endpoint: 'work-log',
    summary: '근무 기록 조회 (관리자 전용)',
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
  @UseRole(Role.OWNER, Role.ADMIN)
  async findListWorkLogHistory(
    @Query() query: WorkLogHistoryFindListDto,
  ): Promise<WorkLogHistoryFindListResponseDto> {
    const { result, total } =
      await this.workLogService.findListMgmtWorkLog(query);
    return { result, metadata: getMetadata(query, total) };
  }

  @Endpoint({
    endpoint: 'work-log/:id',
    summary: '근무 기록 수정 (관리자 전용)',
    method: 'PATCH',
    description: '근무 기록의 출근/퇴근 시간을 수정하고 상태값을 자동 변경합니다.',
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
    @Body() body: WorkLogMgmtUpdateDto,
  ): Promise<WorkLogMgmtUpdateResponseDto> {
    return this.workLogService.updateMgmtWorkLog(id, body);
  }
}
