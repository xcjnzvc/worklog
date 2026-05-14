import { Property } from 'ts-deco';

export class WorkLogUpdateDto {
  @Property({ type: String, description: '정정 분류', required: true })
  type: string;

  @Property({ type: String, description: '수정 사유', required: true })
  reason: string;

  @Property({ type: Date, description: '수정 출근 시간', required: true })
  fixClockIn: Date;

  @Property({ type: Date, description: '수정 퇴근 시간', required: true })
  fixClockOut: Date;

  @Property({ type: String, description: '결재권자 ID', required: true })
  approverId: string;
}
