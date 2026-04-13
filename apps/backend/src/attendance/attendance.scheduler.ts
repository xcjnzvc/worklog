import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceRepository } from './attendance.repository';
import { RequestStatus, LeaveType } from '@prisma/client';

@Injectable()
export class AttendanceScheduler {
  private readonly logger = new Logger(AttendanceScheduler.name);

  constructor(
    private prisma: PrismaService,
    private repo: AttendanceRepository,
  ) {}

  /**
   * 매일 새벽 1시: 전날 결근 처리
   * - 출근 기록 없음 + 연차/반차 없음 → ABSENT 생성
   */
  @Cron('0 1 * * *', { timeZone: 'Asia/Seoul' })
  async processAbsent() {
    this.logger.log('[결근 배치] 시작');

    const yesterday = this.getYesterdayStart();

    const allUsers = await this.prisma.user.findMany({
      select: { id: true, companyId: true },
    });

    let absentCount = 0;

    for (const user of allUsers) {
      try {
        // 출근 기록 있으면 스킵
        const log = await this.prisma.workLog.findFirst({
          where: { userId: user.id, date: yesterday },
        });
        if (log) continue;

        // 연차 또는 하루종일 쉬는 반차 있으면 스킵
        const approvedLeave = await this.prisma.leaveRequest.findFirst({
          where: {
            userId: user.id,
            status: RequestStatus.APPROVED,
            startDate: { lte: yesterday },
            endDate: { gte: yesterday },
            type: { in: [LeaveType.ANNUAL] },
          },
        });
        if (approvedLeave) continue;

        // 오전/오후 반차 둘 다 있으면 사실상 하루 휴가 → 스킵
        const halfLeaves = await this.prisma.leaveRequest.findMany({
          where: {
            userId: user.id,
            status: RequestStatus.APPROVED,
            startDate: { lte: yesterday },
            endDate: { gte: yesterday },
            type: { in: [LeaveType.HALF_AM, LeaveType.HALF_PM] },
          },
        });
        const hasHalfAM = halfLeaves.some((l) => l.type === LeaveType.HALF_AM);
        const hasHalfPM = halfLeaves.some((l) => l.type === LeaveType.HALF_PM);
        if (hasHalfAM && hasHalfPM) continue;

        // 결근 처리
        await this.repo.createAbsent({
          userId: user.id,
          companyId: user.companyId,
          date: yesterday,
        });

        absentCount++;
      } catch (err) {
        this.logger.error(
          `[결근 배치] userId=${user.id} 처리 실패: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(`[결근 배치] 완료 - 결근 처리 ${absentCount}명`);
  }

  /**
   * 매일 자정 5분 후: 전날 미퇴근 로그 강제 MISSING_OUT 처리
   * - 익일 퇴근 케이스를 감안해 새벽 1시 배치보다 먼저 실행
   */
  @Cron('5 0 * * *', { timeZone: 'Asia/Seoul' })
  async processMissingOut() {
    this.logger.log('[미퇴근 배치] 시작');

    const today = this.getTodayStart();

    const forgottenLogs = await this.prisma.workLog.findMany({
      where: {
        clockOut: null,
        date: { lt: today },
      },
    });

    for (const log of forgottenLogs) {
      const yesterdayEnd = new Date(log.date);
      yesterdayEnd.setHours(23, 59, 59, 999);
      await this.repo.markMissingOut(log.id, yesterdayEnd);
    }

    this.logger.log(`[미퇴근 배치] ${forgottenLogs.length}건 처리 완료`);
  }

  // ─────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────

  private getTodayStart(): Date {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return new Date(
      Date.UTC(
        kst.getUTCFullYear(),
        kst.getUTCMonth(),
        kst.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
  }

  private getYesterdayStart(): Date {
    const today = this.getTodayStart();
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    return yesterday;
  }
}
