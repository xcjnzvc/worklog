import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';
import { ResponseWithMetaData } from 'src/common/dto/response.dto';

class WorkLogHistoryData {
  id: string;
  clockIn: Date | null;
  clockOut: Date | null;
  workMinutes: number | null;
  status: AttendanceStatus;
  isOvertime: boolean;
  date: Date;
  createdAt: Date;
}

export class WorkLogHistoryFindListResponseDto extends ResponseWithMetaData {
  @ApiProperty({
    type: WorkLogHistoryData,
    description: 'The data of the response',
    required: true,
    isArray: true,
  })
  result: WorkLogHistoryData[];
}
