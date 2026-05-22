import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectVacationDto {
  @ApiProperty({
    description: '휴가 신청 반려 사유',
    required: false,
    example: '프로젝트 마감 기간으로 인해 연차가 반려되었습니다.',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: '반려 사유는 최대 200자까지 입력 가능합니다.' })
  rejectReason?: string;
}
