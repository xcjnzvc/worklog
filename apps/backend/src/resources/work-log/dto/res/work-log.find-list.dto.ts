import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';
import { ResponseWithMetaData } from 'src/common/dto/response.dto';

export class WorkLogDataDto {
  @ApiProperty({
    description: '근무 기록 ID',
    example: '34b8820b-06bf-40a1-ac51-3df8914b0a42',
  })
  id: string;

  @ApiProperty({
    description: '출근 시간',
    example: '2026-05-09T07:36:23.478Z',
    nullable: true,
  })
  clockIn: Date | null;

  @ApiProperty({
    description: '퇴근 시간',
    example: '2026-05-09T07:36:33.634Z',
    nullable: true,
  })
  clockOut: Date | null;

  @ApiProperty({
    description: '근무 시간(분)',
    example: 0,
    nullable: true,
  })
  workMinutes: number | null;

  @ApiProperty({
    enum: AttendanceStatus,
    description: '근태 상태',
    example: AttendanceStatus.LATE_EARLY,
  })
  status: AttendanceStatus;

  @ApiProperty({
    description: '초과 근무 여부',
    example: false,
  })
  isOvertime: boolean;

  @ApiProperty({
    description: '근무 날짜',
    example: '2026-05-09T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: '생성일',
    example: '2026-05-09T07:36:23.497Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 사유',
    example: '출퇴근 시간 오기록 수정',
    nullable: true,
    required: false,
  })
  fixReason?: string | null;

  @ApiProperty({
    description: '수정 여부',
    example: true,
  })
  isFix: boolean;
}

export class WorkLogHistoryFindListResponseDto extends ResponseWithMetaData {
  @ApiProperty({
    type: WorkLogDataDto,
    description: 'The data of the response',
    required: true,
    isArray: true,
  })
  result: WorkLogDataDto[];
}

export class WorkLogMgmtUpdateResponseDto {
  @ApiProperty({
    type: WorkLogDataDto,
    description: '수정된 근무 기록',
    required: true,
  })
  result: WorkLogDataDto;
}
