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

  /**
   * [사용자] 본인 근태 대시보드 통계 조회
   */
  async dashboard(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      // 💡 한국 시간(KST) 기준 이번 달 시작일과 다음 달 시작일을 정확히 계산합니다.
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // 💡 [개선] 승인 완료(APPROVED)된 건은 isFix가 false로 바뀌므로,
      // 이번 달 날짜 범위 안에서 apprStatus가 PENDING이거나 APPROVED인 것을 모두 집계합니다.
      const fixStatsRaw = await tx.workLog.groupBy({
        by: ['apprStatus'],
        where: {
          userId,
          date: {
            gte: monthStart,
            lt: nextMonthStart,
          },
          OR: [
            { isFix: true }, // 대기 중인 상태 (PENDING)
            { apprStatus: 'APPROVED' }, // 승인 완료된 상태 (이때는 isFix가 false임)
            { apprStatus: 'REJECTED' }, // 반려된 상태까지 포함하고 싶다면 유지
          ],
        },
        _count: { id: true },
      });

      // 상태별 카운트 가공
      const pendingCount =
        fixStatsRaw.find((s) => s.apprStatus === 'PENDING')?._count.id || 0;
      const approvedCount =
        fixStatsRaw.find((s) => s.apprStatus === 'APPROVED')?._count.id || 0;

      // 이번 달 총 근무 시간 계산 (기존 유지)
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
        totalWorkHours: Math.floor(totalMinutes / 60), // "이번 달 총 근무" 시간
        totalWorkMinutes: totalMinutes,
      };
    });
  }

  /**
   * [관리자용] 회사 전체의 정정 신청 통계 집계
   */
  async dashboardMgmt(companyId: string) {
    return this.prisma.$transaction(async (tx) => {
      const fixStatsRaw = await tx.workLog.groupBy({
        by: ['apprStatus'],
        where: {
          companyId,
          isFix: true,
        },
        _count: { id: true },
      });

      const pendingCount =
        fixStatsRaw.find((s) => s.apprStatus === 'PENDING')?._count.id || 0;
      const approvedCount =
        fixStatsRaw.find((s) => s.apprStatus === 'APPROVED')?._count.id || 0;

      return {
        pendingCount,
        approvedCount,
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
   * [관리자] 팀원들이 보낸 근태 정정 신청 대기 목록 조회
   */
  async findWorkLogMgmt(query: WorkLogHistoryFindListMgmtDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const take = Number(limit);

    // 💡 [핵심] 정정 요청 중(isFix: true)이면서 대기 상태(PENDING)인 조건만 필터링
    const whereCondition: Prisma.WorkLogWhereInput = {
      isFix: true,
      apprStatus: 'PENDING',
    };

    const [workLogHistory, total] = await this.prisma.$transaction([
      this.prisma.workLog.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        // 💡 대표 화면 테이블에 '요청자 이름'과 '부서명'이 출력되도록 연관 데이터를 함께 로드합니다.
        include: {
          user: {
            include: {
              team: true,
              position: true,
            },
          },
        },
      }),
      this.prisma.workLog.count({ where: whereCondition }),
    ]);

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
    // Prisma UpdateInput 타입에 존재하는 필드들만 안전하게 필터링하여 전달합니다.
    // 특히 userId와 date는 제외하여 P2002 에러를 방지합니다.

    return this.prisma.workLog.update({
      where: { id },
      data: {
        status: data.status,
        apprStatus: data.apprStatus,
        fixReason: data.fixReason,
        fixClockIn: data.fixClockIn,
        fixClockOut: data.fixClockOut,
        rejectReason: data.rejectReason,
        approver: data.approver,
        isFix: data.isFix,
      },
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
