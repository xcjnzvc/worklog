import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  AttendanceStatus,
  RequestStatus,
  WorkLog,
  WorkPolicy,
  LeaveRequest,
  Prisma,
} from '@prisma/client';
import {
  WorkLogHistoryFindListDto,
  WorkLogHistoryFindListMgmtDto,
} from './dto/work-log-history.find-list.dto';

export type WorkLogWithApprover = Prisma.WorkLogGetPayload<{
  include: { approver: true };
}>;

// ─────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────

export type WorkLogWithUser = WorkLog & {
  user: {
    workPolicy: WorkPolicy | null;
    leaveRequests: LeaveRequest[];
  };
};

// ─────────────────────────────────────────────────────
// Repository
// ─────────────────────────────────────────────────────

@Injectable()
export class WorkLogRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 대시보드 통계 조회
   */
  // work-log.repository.ts

  async dashboard(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // 💡 1. 상태별 카운트를 위해 groupBy 실행
      const fixStatsRaw = await tx.workLog.groupBy({
        by: ['apprStatus'],
        where: {
          userId,
          isFix: true, // 정정 신청 중이거나 신청했던 기록 대상
        },
        _count: { id: true },
      });

      // 💡 2. 가공 (변수명 fixStats 정의)
      const pendingCount =
        fixStatsRaw.find((s) => s.apprStatus === 'PENDING')?._count.id || 0;
      const approvedCount =
        fixStatsRaw.find((s) => s.apprStatus === 'APPROVED')?._count.id || 0;

      // 💡 3. 이번 달 총 근무 시간 (이미지의 160h 부분)
      const monthlyWork = await tx.workLog.aggregate({
        where: {
          userId,
          date: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
        _sum: { workMinutes: true },
      });

      const totalMinutes = monthlyWork._sum.workMinutes || 0;

      return {
        pendingCount, // "정정 요청 중" 카드용
        approvedCount, // "정정 완료" 카드용
        totalWorkHours: Math.floor(totalMinutes / 60), // "이번 달 총 근무" 시간만 계산
        totalWorkMinutes: totalMinutes,
      };
    });
  }

  /**
   * [사용자] 정정 신청 정보 업데이트
   * Prisma.WorkLogUpdateInput을 사용하여 fixType, approverId 등 모든 필드 수용 가능
   */
  async fixWorkLog(
    userId: string,
    id: string,
    data: Prisma.WorkLogUpdateInput,
  ): Promise<WorkLog> {
    return this.prisma.workLog.update({
      where: { id, userId },
      data,
    });
  }

  /**
   * [관리자] 근태 기록 목록 조회
   */
  async findWorkLogMgmt(query: WorkLogHistoryFindListMgmtDto) {
    const { page, limit, userId } = query;
    const options = Prisma.validator<Prisma.WorkLogFindManyArgs>()({
      where: { userId },
      omit: { userId: true, companyId: true } as any, // Prisma 버전에 따라 필드 제외 설정
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const workLogHistory = await this.prisma.workLog.findMany(options);

    const total = await this.prisma.workLog.count({ where: options.where });
    return { result: workLogHistory, total };
  }

  /**
   * [사용자] 본인 근태 기록 목록 조회
   */
  async findWorkLog(query: WorkLogHistoryFindListDto, userId: string) {
    const { page, limit } = query;
    const options = Prisma.validator<Prisma.WorkLogFindManyArgs>()({
      where: { userId },
      omit: { userId: true, companyId: true } as any,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const workLogHistory = await this.prisma.workLog.findMany(options);

    const total = await this.prisma.workLog.count({ where: options.where });
    return { result: workLogHistory, total };
  }

  /**
   * ID로 단일 로그 조회 (유저 정책 및 승인된 휴가 포함)
   */
  async findWorkLogById(id: string): Promise<WorkLogWithUser> {
    return this.prisma.workLog.findUniqueOrThrow({
      where: { id },
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
    }) as Promise<WorkLogWithUser>;
  }

  /**
   * 정정 신청 중인 로그 목록 조회
   */
  async findFixWorkLog(userId: string, query: WorkLogHistoryFindListDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const [logs, total] = await this.prisma.$transaction([
      this.prisma.workLog.findMany({
        where: { userId, isFix: true },
        include: {
          approver: {
            include: { team: true }, // 💡 실제 데이터를 가져옴
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.workLog.count({ where: { userId, isFix: true } }),
    ]);

    return { result: logs, total };
  }

  /**
   * [관리자] 최종 승인 처리 및 시간 덮어쓰기
   */
  async updateMgmtWorkLog(
    id: string,
    data: Prisma.WorkLogUpdateInput,
  ): Promise<WorkLog> {
    return this.prisma.workLog.update({
      where: { id },
      data,
    });
  }

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
   * 미퇴근 로그 조회 (실시간 근무 상태용)
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
      where: {
        userId,
        date: today,
        clockOut: { not: null },
      },
      orderBy: { clockOut: 'desc' },
    });
  }

  /**
   * 주간 통계용 로그 조회
   */
  async findWeeklyLogs(userId: string, monday: Date): Promise<WorkLog[]> {
    return this.prisma.workLog.findMany({
      where: {
        userId,
        date: { gte: monday },
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
