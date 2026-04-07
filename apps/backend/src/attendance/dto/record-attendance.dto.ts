import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum AttendanceAction {
  CLOCK_IN = 'CLOCK_IN',
  CLOCK_OUT = 'CLOCK_OUT',
}

export class RecordAttendanceDto {
  @ApiProperty({
    enum: AttendanceAction,
    example: AttendanceAction.CLOCK_IN,
    description: '출근 또는 퇴근 액션',
  })
  @IsEnum(AttendanceAction)
  action: AttendanceAction;
}
