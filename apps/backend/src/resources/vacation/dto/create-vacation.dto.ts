import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVacationDto {
  @ApiProperty({
    description: '휴가 종류',
    enum: ['ANNUAL', 'HALF', 'SICK', 'EVENT', 'OTHER'],
    example: 'ANNUAL',
  })
  @IsEnum(['ANNUAL', 'HALF', 'SICK', 'EVENT', 'OTHER'])
  @IsNotEmpty()
  type: 'ANNUAL' | 'HALF' | 'SICK' | 'EVENT' | 'OTHER';

  @ApiProperty({
    description: '시작 날짜',
    example: '2026-05-09',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: '종료 날짜',
    example: '2026-05-10',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: '사유',
    example: '가족 행사 참여',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: '승인자 ID',
    example: 'uuid-approver-1234',
  })
  @IsString()
  @IsNotEmpty()
  approverId: string;

  @ApiPropertyOptional({
    description: '반차 상세 (type이 HALF일 때만 필수)',
    enum: ['AM', 'PM'],
    example: 'AM',
  })
  @IsOptional()
  @IsEnum(['AM', 'PM'])
  timeDetail?: 'AM' | 'PM';
}
