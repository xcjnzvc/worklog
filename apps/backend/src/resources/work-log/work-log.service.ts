import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  AttendanceStatus,
  WorkType,
  LeaveType,
  WorkPolicy,
  WorkLog,
  LeaveRequest,
  ApprStatus,
  Prisma,
} from '@prisma/client';
import { WorkLogRepository, WorkLogWithUser } from './work-log.repository';
import {
  WorkLogHistoryFindListDto,
  WorkLogHistoryFindListMgmtDto,
} from './dto/work-log-history.find-list.dto';
import {
  WorkLogDataDto,
  WorkLogMgmtUpdateResponseDto,
} from './dto/res/work-log.find-list.dto';
import { WorkLogUpdateDto } from './dto/work-log.update.dto';
import { WorkLogDashboardResponseDto } from './dto/res/work-log.dashboard.dto';
import { RejectVacationDto } from '../vacation/dto/reject-vacation.dto';

type UserWithPolicy = {
  id: string;
  companyId: string;
  workPolicy: WorkPolicy | null;
  leaveRequests: LeaveRequest[];
};

type WorkLogWithApprover = Prisma.WorkLogGetPayload<{
  include: {
    approver: {
      include: {
        team: true;
        position: true;
      };
    };
  };
}>;

@Injectable()
export class WorkLogService {
  constructor(private repo: WorkLogRepository) {}

  async dashboard(userId: string): Promise<WorkLogDashboardResponseDto> {
    return this.repo.dashboard(userId);
  }

  /**
   * [관리자/대표 전용] 회사 전체 팀원 근태 정정 대시보드 통계
   */
  async dashboardMgmt(
    adminUserId: string,
  ): Promise<WorkLogDashboardResponseDto> {
    // 1. 관리자의 회사 ID를 조회합니다.
    const adminUser = await this.repo.findUserWithPolicy(adminUserId);
    const companyId = adminUser.companyId;

    // 💡 레포지토리의 정식 메서드를 호출하여 any 캐스팅 및 Unused 변수 에러를 완벽히 해결합니다.
    const stats = await this.repo.dashboardMgmt(companyId);

    return {
      pendingCount: stats.pendingCount,
      approvedCount: stats.approvedCount,
      totalWorkHours: 0,
      totalWorkMinutes: 0,
    };
  }

  async findListMgmtWorkLog(query: WorkLogHistoryFindListMgmtDto) {
    return this.repo.findWorkLogMgmt(query);
  }

  async findListWorkLog(query: WorkLogHistoryFindListDto, userId: string) {
    return this.repo.findWorkLog(query, userId);
  }

  /**
   * [관리자용] 정정 최종 승인
   */
  async updateMgmtWorkLog(id: string): Promise<WorkLogMgmtUpdateResponseDto> {
    const log: WorkLogWithUser = await this.repo.findWorkLogById(id);

    if (!log.fixClockIn || !log.fixClockOut) {
      throw new BadRequestException('승인할 수정 출퇴근 시간이 없습니다.');
    }

    const clockIn: Date = log.fixClockIn;
    const clockOut: Date = log.fixClockOut;

    if (clockOut <= clockIn) {
      throw new BadRequestException(
        '퇴근 시간은 출근 시간보다 이후여야 합니다.',
      );
    }

    const policy = log.user.workPolicy;
    if (!policy) {
      throw new BadRequestException('근무 정책이 없습니다.');
    }

    const workDate = this.getKSTDateStart(clockIn);

    const isHalfLeave = log.user.leaveRequests.some((leave: LeaveRequest) => {
      const leaveDate = this.getKSTDateStart(new Date(leave.startDate));
      return (
        leaveDate.getTime() === workDate.getTime() &&
        (leave.type === LeaveType.HALF_AM || leave.type === LeaveType.HALF_PM)
      );
    });

    const hasHalfAM = log.user.leaveRequests.some((leave: LeaveRequest) => {
      const leaveDate = this.getKSTDateStart(new Date(leave.startDate));
      return (
        leaveDate.getTime() === workDate.getTime() &&
        leave.type === LeaveType.HALF_AM
      );
    });

    const rawMin = Math.floor((clockOut.getTime() - clockIn.getTime()) / 60000);
    const lunch = isHalfLeave
      ? 0
      : this.calcLunchDeduction(clockOut, clockIn, policy);
    const workMinutes = Math.max(0, rawMin - lunch);

    const clockInStatus = this.resolveClockInStatus(clockIn, policy, hasHalfAM);
    const isShort = this.resolveIsShort(
      clockOut,
      workMinutes,
      policy,
      isHalfLeave,
    );
    const status = this.resolveFinalStatus(
      clockInStatus === AttendanceStatus.LATE,
      isShort,
    );

    const updatedLog = (await this.repo.updateMgmtWorkLog(id, {
      clockIn,
      clockOut,
      workMinutes,
      status,
      isOvertime: workMinutes > (policy.workMinutes ?? 480),
      date: workDate,
      isFix: false,
      apprStatus: 'APPROVED' as ApprStatus,
    })) as WorkLogWithApprover;

    return { result: this.toWorkLogDataDto(updatedLog) };
  }

  /**
   * [관리자용] 정정 신청 반려
   */
  async rejectMgmtWorkLog(
    id: string,
    dto: RejectVacationDto,
  ): Promise<WorkLogDataDto> {
    const updatedLog = (await this.repo.updateMgmtWorkLog(id, {
      isFix: false,
      apprStatus: 'REJECTED' as ApprStatus,
      rejectReason: dto.rejectReason?.trim() || '사유 없음',
    })) as WorkLogWithApprover;

    return this.toWorkLogDataDto(updatedLog);
  }

  /**
   * [사용자용] 정정 신청하기
   */
  fixWorkLog(
    userId: string,
    id: string,
    body: WorkLogUpdateDto,
  ): Promise<WorkLog> {
    // 💡 3. TS(2561) 해결: approverId 직접 사용이 안되면 connect 구문 사용
    // Repository의 fixWorkLog 메서드 내부에서 아래 구조를 받도록 처리해야 합니다.
    return this.repo.fixWorkLog(userId, id, {
      fixClockIn: body.fixClockIn,
      fixClockOut: body.fixClockOut,
      fixReason: body.reason,
      fixType: body.type,
      isFix: true,
      apprStatus: 'PENDING' as ApprStatus,
      // 💡 관계를 맺을 때는 connect를 사용하는 것이 정석입니다.
      approver: body.approverId
        ? { connect: { id: body.approverId } }
        : undefined,
    } as any);
  }

  /**
   * [사용자용] 정정 신청 중인 로그 목록 조회
   */
  async findFixWorkLog(userId: string, query: WorkLogHistoryFindListDto) {
    const { result, total } = await this.repo.findFixWorkLog(userId, query);

    return {
      // 💡 4. any 대신 정확한 타입을 명시하여 ESLint 오류 해결
      result: (result as WorkLogWithApprover[]).map((log) =>
        this.toWorkLogDataDto(log),
      ),
      total,
    };
  }

  async getLiveWorkMinutes(userId: string) {
    const now = new Date();
    const today = this.getTodayStart();
    const [user, activeLog, finishedLog] = await Promise.all([
      this.repo.findUserWithPolicy(userId),
      this.repo.findOpenLog(userId),
      this.repo.findTodayFinishedLog(userId, today),
    ]);

    const formatKST = (date: Date | null): string | null => {
      if (!date) return null;
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Seoul',
      })
        .format(date)
        .replace(/\. /g, '-')
        .replace('.', '');
    };

    if (activeLog) {
      const rawMin = Math.floor(
        (now.getTime() - activeLog.clockIn.getTime()) / 60000,
      );
      const lunch = this.calcLunchDeduction(
        now,
        activeLog.clockIn,
        user.workPolicy,
      );

      return {
        status: activeLog.status,
        isClockedIn: true,
        isClockedOut: false,
        workMinutes: Math.max(0, rawMin - lunch),
        clockIn: formatKST(activeLog.clockIn),
        clockOut: null,
        serverTime: formatKST(now),
        policy: user.workPolicy,
      };
    }

    if (finishedLog) {
      return {
        status: finishedLog.status,
        isClockedIn: false,
        isClockedOut: true,
        workMinutes: finishedLog.workMinutes,
        clockIn: formatKST(finishedLog.clockIn),
        clockOut: formatKST(finishedLog.clockOut),
        serverTime: formatKST(now),
        policy: user.workPolicy,
      };
    }

    return {
      status: 'NOT_STARTED',
      isClockedIn: false,
      isClockedOut: false,
      workMinutes: 0,
      clockIn: null,
      clockOut: null,
      serverTime: formatKST(now),
      policy: user.workPolicy,
    };
  }

  async clockIn(userId: string): Promise<WorkLog> {
    const now = new Date();
    const today = this.getTodayStart();

    const user: UserWithPolicy =
      await this.repo.findUserWithPolicyAndTodayLeave(userId, today);

    if (!user.workPolicy) {
      throw new BadRequestException('근무 정책이 없습니다.');
    }

    if (
      user.leaveRequests.some((l: LeaveRequest) => l.type === LeaveType.ANNUAL)
    ) {
      throw new BadRequestException('오늘은 연차 휴가일입니다.');
    }

    const forgotLog: WorkLog | null = await this.repo.findForgottenLog(
      userId,
      today,
    );
    if (forgotLog) {
      const yesterdayEnd = new Date(forgotLog.date);
      yesterdayEnd.setHours(23, 59, 59, 999);
      await this.repo.markMissingOut(forgotLog.id, yesterdayEnd);
    }

    const activeLog: WorkLog | null = await this.repo.findTodayActiveLog(
      userId,
      today,
    );
    if (activeLog) throw new ConflictException('이미 출근한 상태입니다.');

    const hasHalfAM = user.leaveRequests.some(
      (l: LeaveRequest) => l.type === LeaveType.HALF_AM,
    );

    const status = this.resolveClockInStatus(now, user.workPolicy, hasHalfAM);

    return this.repo.createClockIn({
      userId,
      companyId: user.companyId,
      clockIn: now,
      status,
      date: today,
    });
  }

  async clockOut(userId: string): Promise<WorkLog> {
    const now = new Date();
    const log: WorkLogWithUser | null = await this.repo.findOpenLog(userId);

    if (!log) throw new BadRequestException('출근 기록이 없습니다.');

    const policy = log.user.workPolicy;
    if (!policy) throw new BadRequestException('근무 정책이 없습니다.');

    const today = this.getTodayStart();

    const isHalfLeave = log.user.leaveRequests.some((l: LeaveRequest) => {
      const start = new Date(l.startDate).getTime();
      return (
        start === today.getTime() &&
        (l.type === LeaveType.HALF_AM || l.type === LeaveType.HALF_PM)
      );
    });

    const rawMin = Math.floor((now.getTime() - log.clockIn.getTime()) / 60000);
    const lunch = isHalfLeave
      ? 0
      : this.calcLunchDeduction(now, log.clockIn, policy);
    const workMinutes = Math.max(0, rawMin - lunch);

    const isShort = this.resolveIsShort(now, workMinutes, policy, isHalfLeave);
    const wasLate =
      log.status === AttendanceStatus.LATE ||
      log.status === AttendanceStatus.LATE_EARLY;
    const finalStatus = this.resolveFinalStatus(wasLate, isShort);

    return this.repo.updateClockOut(log.id, {
      clockOut: now,
      workMinutes,
      status: finalStatus,
      isOvertime: workMinutes > (policy.workMinutes ?? 480),
    });
  }

  async getWeeklyStats(userId: string) {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    // 순차 → 병렬로 변경
    const [user, logs, activeLog] = await Promise.all([
      this.repo.findUserWithPolicyAndTodayLeave(userId, monday),
      this.repo.findWeeklyLogs(userId, monday),
      this.repo.findOpenLog(userId),
    ]);

    const policyMax = user.workPolicy?.workMinutes ?? 480;
    const counts = { normal: 0, late: 0, early: 0, absent: 0 };

    const getKSTDateString = (date: Date): string => {
      return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Seoul',
      }).format(date);
    };

    const todayStr = getKSTDateString(now);
    const weekDays = ['월', '화', '수', '목', '금'];

    const dailyGraph = weekDays.map((dayName, index) => {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);
      const targetDateStr = getKSTDateString(targetDate);

      const log = logs.find(
        (l) => getKSTDateString(new Date(l.date)) === targetDateStr,
      );

      const hasHalfLeave = user.leaveRequests?.some((leave: LeaveRequest) => {
        return (
          getKSTDateString(new Date(leave.startDate)) === targetDateStr &&
          (leave.type === LeaveType.HALF_AM || leave.type === LeaveType.HALF_PM)
        );
      });

      let actualMinutes = log?.workMinutes ?? 0;
      if (
        log &&
        log.clockOut === null &&
        activeLog &&
        activeLog.id === log.id
      ) {
        const rawMin = Math.floor(
          (now.getTime() - activeLog.clockIn.getTime()) / 60000,
        );
        const lunch = this.calcLunchDeduction(
          now,
          activeLog.clockIn,
          user.workPolicy,
        );
        actualMinutes = Math.max(0, rawMin - lunch);
      }

      if (log) {
        if (log.status === 'NORMAL') counts.normal++;
        if (log.status === 'LATE' || log.status === 'LATE_EARLY') counts.late++;
        if (log.status === 'EARLY_LEAVE' || log.status === 'LATE_EARLY')
          counts.early++;
      } else if (targetDateStr < todayStr && !hasHalfLeave) {
        counts.absent++;
      }

      const dailyTarget = hasHalfLeave ? policyMax / 2 : policyMax;

      return {
        day: dayName,
        actualMinutes,
        targetMinutes: dailyTarget,
        percent:
          dailyTarget > 0
            ? Math.min(Math.round((actualMinutes / dailyTarget) * 100), 125)
            : 0,
        status:
          log?.status ??
          (hasHalfLeave
            ? 'LEAVE'
            : targetDateStr > todayStr
              ? 'NOT_STARTED'
              : 'ABSENT'),
      };
    });

    const totalMinutes = dailyGraph.reduce(
      (sum, d) => sum + (d.actualMinutes ?? 0),
      0,
    );

    return {
      weeklySummary: {
        period: `${getKSTDateString(monday).replace(/-/g, '. ')} - ${getKSTDateString(now).replace(/-/g, '. ')}`,
        totalHours: Math.floor(totalMinutes / 60),
        totalMinutes: totalMinutes % 60,
      },
      dailyGraph,
      stats: [
        {
          label: '정상 출근',
          value: String(counts.normal).padStart(2, '0'),
          unit: '일',
        },
        {
          label: '누적 지각',
          value: String(counts.late).padStart(2, '0'),
          unit: '회',
        },
        {
          label: '결근',
          value: String(counts.absent).padStart(2, '0'),
          unit: '일',
        },
        {
          label: '조퇴',
          value: String(counts.early).padStart(2, '0'),
          unit: '회',
        },
        {
          label: '출근율',
          value: String(
            counts.normal > 0 ? Math.round((counts.normal / 5) * 100) : 0,
          ),
          unit: '%',
        },
      ],
    };
  }

  private getKSTMinutes(date: Date): number {
    const kstStr = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul',
    }).format(date);
    const [h, m] = kstStr.split(':').map(Number);
    return h * 60 + m;
  }

  private resolveClockInStatus(
    now: Date,
    policy: WorkPolicy,
    hasHalfAM: boolean,
  ): AttendanceStatus {
    if (hasHalfAM) return AttendanceStatus.NORMAL;
    const [h, m] = (policy.workStartTime ?? '09:00').split(':').map(Number);
    const startMinutes = h * 60 + m;
    const nowMinutes = this.getKSTMinutes(now);
    return nowMinutes > startMinutes
      ? AttendanceStatus.LATE
      : AttendanceStatus.NORMAL;
  }

  private resolveIsShort(
    now: Date,
    workMinutes: number,
    policy: WorkPolicy | null,
    isHalfLeave: boolean,
  ): boolean {
    if (!policy) return false;
    const dailyMust = isHalfLeave ? 240 : (policy.workMinutes ?? 480);
    if (policy.workType === WorkType.FIXED) {
      const [endH, endM] = (policy.workEndTime ?? '18:00')
        .split(':')
        .map(Number);
      const endMinutes = endH * 60 + endM;
      const nowMinutes = this.getKSTMinutes(now);
      return nowMinutes < endMinutes || workMinutes < dailyMust;
    }
    return workMinutes < dailyMust;
  }

  private resolveFinalStatus(
    wasLate: boolean,
    isShort: boolean,
  ): AttendanceStatus {
    if (wasLate && isShort) return AttendanceStatus.LATE_EARLY;
    if (wasLate) return AttendanceStatus.LATE;
    if (isShort) return AttendanceStatus.EARLY_LEAVE;
    return AttendanceStatus.NORMAL;
  }

  private calcLunchDeduction(
    now: Date,
    clockIn: Date,
    policy: WorkPolicy | null,
  ): number {
    if (!policy || !policy.lunchStartTime || !policy.lunchEndTime) return 0;
    const [sh, sm] = policy.lunchStartTime.split(':').map(Number);
    const [eh, em] = policy.lunchEndTime.split(':').map(Number);
    const lStart = new Date(now);
    lStart.setHours(sh, sm, 0, 0);
    const lEnd = new Date(now);
    lEnd.setHours(eh, em, 0, 0);
    if (now <= lStart || clockIn >= lEnd) return 0;
    const effectiveStart = clockIn > lStart ? clockIn : lStart;
    const effectiveEnd = now < lEnd ? now : lEnd;
    return Math.max(
      0,
      Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / 60000),
    );
  }

  private getTodayStart(): Date {
    return this.getKSTDateStart(new Date());
  }

  private getKSTDateStart(date: Date): Date {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    });
    const kstDate = formatter.format(date);
    return new Date(`${kstDate}T00:00:00.000Z`);
  }

  private toWorkLogDataDto(log: WorkLogWithApprover): WorkLogDataDto {
    let formattedApprover: string | null = null;

    if (log.approver) {
      const { name, role, team } = log.approver; // ← position 제거
      const positionName = log.approver.position?.name; // ← 별도로 꺼내기

      const dept = team?.name || '';

      if (role === 'OWNER') {
        formattedApprover = `${name} 대표`;
      } else {
        const displayPosition = positionName || '사원';
        formattedApprover = dept
          ? `${dept} ${name} ${displayPosition}`
          : `${name} ${displayPosition}`;
      }
    }

    return {
      id: log.id,
      clockIn: log.clockIn,
      clockOut: log.clockOut,
      workMinutes: log.workMinutes,
      status: log.status,
      isOvertime: log.isOvertime,
      date: log.date,
      createdAt: log.createdAt,
      fixReason: log.fixReason,
      fixClockIn: log.fixClockIn,
      fixClockOut: log.fixClockOut,
      isFix: log.isFix,
      apprStatus: log.apprStatus,
      approverName: formattedApprover,
    };
  }
}
