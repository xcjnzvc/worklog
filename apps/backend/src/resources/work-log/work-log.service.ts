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
} from '@prisma/client';
import { WorkLogRepository } from './work-log.repository';
import { WorkLogHistoryFindListDto } from './dto/work-log-history.find-list.dto';
import {
  WorkLogDataDto,
  WorkLogMgmtUpdateResponseDto,
  WorkLogUpdateResponseDto,
} from './dto/res/work-log.find-list.dto';
import { WorkLogUpdateDto } from './dto/work-log.update.dto';

@Injectable()
export class WorkLogService {
  constructor(private repo: WorkLogRepository) {}

  async findListMgmtWorkLog(query: WorkLogHistoryFindListDto) {
    const workLogHistory = await this.repo.findWorkLog(query);
    return workLogHistory;
  }

  async updateMgmtWorkLog(id: string): Promise<WorkLogMgmtUpdateResponseDto> {
    const log = await this.repo.findWorkLogById(id);
    if (!log.fixClockIn || !log.fixClockOut) {
      throw new BadRequestException('승인할 수정 출퇴근 시간이 없습니다.');
    }

    const clockIn = log.fixClockIn;
    const clockOut = log.fixClockOut;

    if (clockOut <= clockIn) {
      throw new BadRequestException('퇴근 시간은 출근 시간보다 이후여야 합니다.');
    }

    const policy = log.user.workPolicy;
    if (!policy) {
      throw new BadRequestException('근무 정책이 없습니다.');
    }

    const workDate = this.getKSTDateStart(clockIn);
    const isHalfLeave = log.user.leaveRequests.some((leave) => {
      const leaveDate = this.getKSTDateStart(new Date(leave.startDate));
      return (
        leaveDate.getTime() === workDate.getTime() &&
        (leave.type === LeaveType.HALF_AM || leave.type === LeaveType.HALF_PM)
      );
    });
    const hasHalfAM = log.user.leaveRequests.some((leave) => {
      const leaveDate = this.getKSTDateStart(new Date(leave.startDate));
      return (
        leaveDate.getTime() === workDate.getTime() &&
        leave.type === LeaveType.HALF_AM
      );
    });

    const rawMin = Math.floor(
      (clockOut.getTime() - clockIn.getTime()) / 60000,
    );
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

    const updatedLog = await this.repo.updateMgmtWorkLog(id, {
      workMinutes,
      status,
      isOvertime: workMinutes > (policy.workMinutes ?? 480),
      date: workDate,
      isFix: false,
    });

    return { result: this.toWorkLogDataDto(updatedLog) };
  }

  async fixWorkLog(userId: string, body: WorkLogUpdateDto) {
    return this.repo.fixWorkLog(userId, body);
  }

  async findFixWorkLog(userId: string): Promise<WorkLogUpdateResponseDto> {
    const logs = await this.repo.findFixWorkLog(userId);
    return { result: logs.map((log) => this.toWorkLogDataDto(log)) };
  }

  // ─────────────────────────────────────────
  // 1. 실시간 근무 상태 조회
  // ─────────────────────────────────────────
  async getLiveWorkMinutes(userId: string) {
    const now = new Date();
    const today = this.getTodayStart();
    const user = await this.repo.findUserWithPolicy(userId);

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

    const activeLog = await this.repo.findOpenLog(userId);

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

    const finishedLog = await this.repo.findTodayFinishedLog(userId, today);
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

  // ─────────────────────────────────────────
  // 2. 출근 처리
  // ─────────────────────────────────────────
  async clockIn(userId: string) {
    const now = new Date();
    const today = this.getTodayStart();

    const user = await this.repo.findUserWithPolicyAndTodayLeave(userId, today);
    if (!user.workPolicy)
      throw new BadRequestException('근무 정책이 없습니다.');

    if (user.leaveRequests.some((l) => l.type === LeaveType.ANNUAL)) {
      throw new BadRequestException('오늘은 연차 휴가일입니다.');
    }

    const forgotLog = await this.repo.findForgottenLog(userId, today);
    if (forgotLog) {
      const yesterdayEnd = new Date(forgotLog.date);
      yesterdayEnd.setHours(23, 59, 59, 999);
      await this.repo.markMissingOut(forgotLog.id, yesterdayEnd);
    }

    const activeLog = await this.repo.findTodayActiveLog(userId, today);
    if (activeLog) throw new ConflictException('이미 출근한 상태입니다.');

    const hasHalfAM = user.leaveRequests.some(
      (l) => l.type === LeaveType.HALF_AM,
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

  // ─────────────────────────────────────────
  // 3. 퇴근 처리
  // ─────────────────────────────────────────
  async clockOut(userId: string) {
    const now = new Date();
    const log = await this.repo.findOpenLog(userId);

    if (!log) throw new BadRequestException('출근 기록이 없습니다.');

    const policy = log.user.workPolicy;
    const today = this.getTodayStart();

    const isHalfLeave = log.user.leaveRequests.some((l) => {
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

    // ✅ 개선된 조퇴 판별 로직 적용
    const isShort = this.resolveIsShort(now, workMinutes, policy, isHalfLeave);
    const wasLate =
      log.status === AttendanceStatus.LATE ||
      log.status === AttendanceStatus.LATE_EARLY;
    const finalStatus = this.resolveFinalStatus(wasLate, isShort);

    return this.repo.updateClockOut(log.id, {
      clockOut: now,
      workMinutes,
      status: finalStatus,
      isOvertime: workMinutes > (policy?.workMinutes ?? 480),
    });
  }

  // ─────────────────────────────────────────
  // 4. 주간 통계 조회 (생략 가능하나 최신 상태 유지를 위해 포함)
  // ─────────────────────────────────────────
  async getWeeklyStats(userId: string) {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    const user = await this.repo.findUserWithPolicyAndTodayLeave(
      userId,
      monday,
    );
    const logs = await this.repo.findWeeklyLogs(userId, monday);
    const activeLog = await this.repo.findOpenLog(userId);

    const policyMax = user.workPolicy?.workMinutes ?? 480;
    const counts = { normal: 0, late: 0, early: 0, absent: 0 };

    const getKSTDateString = (date: Date) => {
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

      const hasHalfLeave = user.leaveRequests?.some((leave) => {
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

  // ─────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────

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

  /**
   * ✅ 조퇴/미달 여부 확인 (수정됨)
   * 1. FIXED: 퇴근 시각 이전이거나, 실제 근무 시간이 목표치(8시간) 미달이면 조퇴
   * 2. 그 외: 실제 근무 시간이 목표치 미달이면 조퇴
   */
  private resolveIsShort(
    now: Date,
    workMinutes: number,
    policy: WorkPolicy | null,
    isHalfLeave: boolean,
  ): boolean {
    if (!policy) return false;

    // 점심시간 제외 필수 근무 시간 (통상 480분, 반차 240분)
    const dailyMust = isHalfLeave ? 240 : (policy.workMinutes ?? 480);

    if (policy.workType === WorkType.FIXED) {
      const [endH, endM] = (policy.workEndTime ?? '18:00')
        .split(':')
        .map(Number);
      const endMinutes = endH * 60 + endM;
      const nowMinutes = this.getKSTMinutes(now);

      // (퇴근 시간 전이거나) OR (근무 시간이 8시간 미만이면) 조퇴 처리
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
    const now = new Date();
    return this.getKSTDateStart(now);
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

  private toWorkLogDataDto(log: WorkLog): WorkLogDataDto {
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
    };
  }
}
