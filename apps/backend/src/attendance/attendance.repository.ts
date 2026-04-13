import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AttendanceStatus,
  RequestStatus,
  WorkLog,
  WorkPolicy,
  LeaveRequest,
} from '@prisma/client';

// ─────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────

export type WorkLogWithUser = WorkLog & {
  user: {
    workPolicy: WorkPolicy;
    leaveRequests: LeaveRequest[];
  };
};

// ─────────────────────────────────────────────────────
// Repository
// ─────────────────────────────────────────────────────

@Injectable()
export class AttendanceRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 오늘 날짜의 승인된 휴가를 포함한 유저 + 정책 조회
   */
  async findUserWithPolicyAndTodayLeave(userId: string, today: Date) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        workPolicy: true,
        leaveRequests: {
          where: {
            startDate: { lte: today },
            endDate: { gte: today },
            status: RequestStatus.APPROVED,
          },
        },
      },
    });
  }

  /**
   * 유저 + 정책만 조회 (출근 상태 확인용)
   */
  async findUserWithPolicy(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { workPolicy: true },
    });
  }

  /**
   * 미퇴근 로그 조회 (익일 퇴근 포함)
   * - user.workPolicy, user.leaveRequests(APPROVED 전체) 포함
   * - 날짜 필터는 서비스에서 처리
   */
  async findOpenLog(userId: string): Promise<WorkLogWithUser | null> {
    return this.prisma.workLog.findFirst({
      where: { userId, clockOut: null },
      orderBy: { clockIn: 'desc' },
      include: {
        user: {
          include: {
            workPolicy: true,
            leaveRequests: {
              where: { status: RequestStatus.APPROVED },
            },
          },
        },
      },
    }) as Promise<WorkLogWithUser | null>;
  }

  /**
   * 어제 이전 미퇴근 로그 조회 (퇴근 누락 처리용)
   */
  async findForgottenLog(userId: string, today: Date): Promise<WorkLog | null> {
    return this.prisma.workLog.findFirst({
      where: { userId, clockOut: null, date: { lt: today } },
    });
  }

  /**
   * 오늘 활성 로그 조회 (중복 출근 방지)
   */
  async findTodayActiveLog(
    userId: string,
    today: Date,
  ): Promise<WorkLog | null> {
    return this.prisma.workLog.findFirst({
      where: { userId, clockOut: null, date: today },
    });
  }

  /**
   * 오늘 완료된 로그 조회
   */
  async findTodayFinishedLog(
    userId: string,
    today: Date,
  ): Promise<WorkLog | null> {
    return this.prisma.workLog.findFirst({
      where: { userId, date: today, clockOut: { not: null } },
      orderBy: { clockOut: 'desc' },
    });
  }

  /**
   * 이번 주 월요일 이후 완료된 로그 전체 조회
   */
  async findWeeklyLogs(userId: string, monday: Date): Promise<WorkLog[]> {
    return this.prisma.workLog.findMany({
      where: {
        userId,
        date: { gte: monday },
        workMinutes: { not: null },
      },
    });
  }

  /**
   * 출근 로그 생성
   */
  async createClockIn(data: {
    userId: string;
    companyId: string;
    clockIn: Date;
    status: AttendanceStatus;
    date: Date;
  }): Promise<WorkLog> {
    return this.prisma.workLog.create({ data });
  }

  /**
   * 퇴근 로그 업데이트
   */
  async updateClockOut(
    id: string,
    data: {
      clockOut: Date;
      workMinutes: number;
      status: AttendanceStatus;
      isOvertime: boolean;
    },
  ): Promise<WorkLog> {
    return this.prisma.workLog.update({ where: { id }, data });
  }

  /**
   * 퇴근 누락 처리 (강제 종료)
   */
  async markMissingOut(id: string, clockOut: Date): Promise<WorkLog> {
    return this.prisma.workLog.update({
      where: { id },
      data: { clockOut, status: AttendanceStatus.MISSING_OUT },
    });
  }

  /**
   * 결근 로그 생성 (배치용)
   */
  async createAbsent(data: {
    userId: string;
    companyId: string;
    date: Date;
  }): Promise<WorkLog> {
    return this.prisma.workLog.create({
      data: {
        ...data,
        clockIn: data.date,
        clockOut: data.date,
        workMinutes: 0,
        status: AttendanceStatus.ABSENT,
      },
    });
  }
}
