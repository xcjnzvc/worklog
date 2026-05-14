export class WorkLogDashboardResponseDto {
  /** 정정 요청 중 건수 */
  pendingCount: number;

  /** 정정 완료 건수 */
  approvedCount: number;

  /** 이번 달 총 근무 시간 (h) */
  totalWorkHours: number;

  /** (선택) 상세 분 데이터 */
  totalWorkMinutes: number;
}
