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
} from '@prisma/client';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(private repo: AttendanceRepository) {}

  // ─────────────────────────────────────────
  // 1. 실시간 근무 상태 조회
  // ─────────────────────────────────────────
  async getLiveWorkMinutes(userId: string) {
    const now = new Date();
    const today = this.getTodayStart();
    const user = await this.repo.findUserWithPolicy(userId);

    // 1. 한국 시간 표기 헬퍼 함수 (내부 선언)
    const formatKST = (date: Date | null): string | null => {
      if (!date) return null;
      // Intl을 사용하여 서버 타임존에 상관없이 한국 시간으로 계산
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Seoul', // 여기서 한국 시간으로 변환합니다.
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
        status: 'WORKING',
        isClockedIn: true,
        workMinutes: Math.max(0, rawMin - lunch),
        // ⭐ 출근 시점도 한국 시간으로 변환
        clockIn: formatKST(activeLog.clockIn),
        clockOut: null,
        // ⭐ 서버 현재 시간도 한국 시간으로 변환
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
        // ⭐ 완료된 로그의 출/퇴근 시간 변환
        clockIn: formatKST(finishedLog.clockIn),
        clockOut: formatKST(finishedLog.clockOut),
        serverTime: formatKST(now),
        policy: user.workPolicy,
      };
    }

    return {
      status: 'NOT_STARTED',
      isClockedIn: false,
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

    if (!user.workPolicy) {
      throw new BadRequestException('근무 정책이 없습니다.');
    }

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
    const todayLeaves = log.user.leaveRequests.filter((l) => {
      const start = new Date(l.startDate).getTime();
      const end = new Date(l.endDate).getTime();
      return start <= today.getTime() && end >= today.getTime();
    });

    const isHalfLeave = todayLeaves.some(
      (l) => l.type === LeaveType.HALF_AM || l.type === LeaveType.HALF_PM,
    );

    const rawMin = Math.floor((now.getTime() - log.clockIn.getTime()) / 60000);

    const lunch = isHalfLeave
      ? 0
      : this.calcLunchDeduction(now, log.clockIn, policy);

    const workMinutes = Math.max(0, rawMin - lunch);

    const isShort = this.resolveIsShort(now, workMinutes, policy, isHalfLeave);

    const wasLate = log.status !== AttendanceStatus.NORMAL;

    const finalStatus = this.resolveFinalStatus(wasLate, isShort);

    return this.repo.updateClockOut(log.id, {
      clockOut: now,
      workMinutes,
      status: finalStatus,
      isOvertime: workMinutes > 480,
    });
  }

  // ─────────────────────────────────────────
  // 4. 주간 누적 근무 시간 조회
  // ─────────────────────────────────────────
  async getWeeklyStats(userId: string) {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    // 1. 유저 정보(휴가 포함), 근무 정책, 이번 주 로그를 가져옴
    const user = await this.repo.findUserWithPolicyAndTodayLeave(
      userId,
      monday,
    );
    const logs = await this.repo.findWeeklyLogs(userId, monday);

    const policyMax = user.workPolicy?.workMinutes ?? 480;
    const counts = { normal: 0, late: 0, early: 0, absent: 0 };

    const weekDays = ['월', '화', '수', '목', '금'];
    const dailyGraph = weekDays.map((dayName, index) => {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);

      // 해당 요일에 출근 로그가 있는지 확인
      const log = logs.find(
        (l) => new Date(l.date).toDateString() === targetDate.toDateString(),
      );

      // ⭐ 반차 여부 확인 (수정님 스키마: HALF_AM, HALF_PM)
      const hasHalfLeave = user.leaveRequests?.some((leave) => {
        const leaveDate = new Date(leave.startDate).toDateString();
        return (
          leaveDate === targetDate.toDateString() &&
          (leave.type === 'HALF_AM' || leave.type === 'HALF_PM')
        );
      });

      const actualMinutes = log?.workMinutes ?? 0;

      // 상태 카운팅
      if (log) {
        if (log.status === 'NORMAL') counts.normal++;
        if (log.status === 'LATE' || log.status === 'LATE_EARLY') counts.late++;
        if (log.status === 'EARLY_LEAVE' || log.status === 'LATE_EARLY')
          counts.early++;
      } else {
        // 로그가 없는데 반차도 아니라면 결근으로 처리 (주말 제외 로직은 weekDays가 월~금이라 자동 해결)
        if (!hasHalfLeave) counts.absent++;
      }

      // ⭐ 반차라면 기준 시간을 절반으로 조정

      const dailyTarget = hasHalfLeave ? policyMax / 2 : policyMax;

      return {
        day: dayName,
        actualMinutes,
        targetMinutes: dailyTarget,
        percent:
          dailyTarget > 0
            ? Math.min(Math.round((actualMinutes / dailyTarget) * 100), 125)
            : 0,
        status: log?.status ?? (hasHalfLeave ? 'LEAVE' : 'ABSENT'),
      };
    });

    const totalMinutes = logs.reduce((sum, l) => sum + (l.workMinutes ?? 0), 0);

    return {
      weeklySummary: {
        // 날짜 표기를 YYYY.MM.DD 형식으로 깔끔하게
        period: `${monday.toLocaleDateString('ko-KR')} - ${now.toLocaleDateString('ko-KR')}`,
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

  private resolveClockInStatus(
    now: Date,
    policy: WorkPolicy,
    hasHalfAM: boolean,
  ): AttendanceStatus {
    if (hasHalfAM) return AttendanceStatus.NORMAL;

    const [h, m] = (policy.workStartTime ?? '09:00').split(':').map(Number);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = h * 60 + m;

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

    if (policy.workType === WorkType.FIXED) {
      if (isHalfLeave) return workMinutes < 240;

      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const [endH, endM] = (policy.workEndTime ?? '18:00')
        .split(':')
        .map(Number);

      const endMinutes = endH * 60 + endM;

      const result = nowMinutes < endMinutes;

      console.log({
        nowMinutes,
        endMinutes,
        isShort: result,
      });

      return result;
    }

    const dailyMust = isHalfLeave ? 240 : (policy.workMinutes ?? 480);
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

    const overlapMs = effectiveEnd.getTime() - effectiveStart.getTime();

    return Math.max(0, Math.floor(overlapMs / 60000));
  }

  private getTodayStart(): Date {
    const now = new Date();

    // 별도의 시간 보정 없이 현재 연/월/일의 00:00:00을 반환합니다.
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
  }
}
