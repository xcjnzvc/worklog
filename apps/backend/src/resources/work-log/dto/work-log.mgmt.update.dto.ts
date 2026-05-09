import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class WorkLogMgmtUpdateDto {
  @ApiProperty({
    description: '수정할 출근 시간',
    example: '2026-05-09T00:00:00.000Z',
  })
  @IsDateString()
  clockIn: string;

  @ApiProperty({
    description: '수정할 퇴근 시간',
    example: '2026-05-09T09:00:00.000Z',
  })
  @IsDateString()
  clockOut: string;

  @ApiPropertyOptional({
    description: '관리자 수정 사유',
    example: '출퇴근 시간 오기록 수정',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
