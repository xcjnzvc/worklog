import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WorkPolicy, LeaveType, Role, RequestStatus } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { RejectVacationDto } from './dto/reject-vacation.dto';

@Injectable()
export class VacationService {
  constructor(private prisma: PrismaService) {}

  /**
   * 휴가 신청 생성
   */
  async create(userId: string, dto: CreateVacationDto) {
    const { type, startDate, endDate, reason, approverId, timeDetail } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalLeave: true, usedLeave: true, companyId: true },
    });

    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    let finalType: LeaveType;
    if (type === 'HALF') {
      if (!timeDetail)
        throw new ForbiddenException('반차 시 오전/오후 선택은 필수입니다.');
      finalType = timeDetail === 'AM' ? LeaveType.HALF_AM : LeaveType.HALF_PM;
    } else {
      finalType = type as unknown as LeaveType;
    }

    let requestedDays = 0;
    if (type === 'ANNUAL') {
      requestedDays =
        differenceInDays(new Date(endDate), new Date(startDate)) + 1;
    } else if (type === 'HALF') {
      requestedDays = 0.5;
    }

    if (requestedDays > 0 && user.totalLeave - user.usedLeave < requestedDays) {
      throw new ForbiddenException('잔여 연차가 부족하여 신청할 수 없습니다.');
    }

    return await this.prisma.leaveRequest.create({
      data: {
        userId,
        companyId: user.companyId,
        type: finalType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        approverId,
        status: 'PENDING',
      },
    });
  }

  /**
   * 휴가 신청 내역 전체 조회 (페이징 및 대시보드 요약 포함)
   */
  async findAll(
    userId: string,
    order: 'asc' | 'desc',
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [user, totalCount, requests] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, totalLeave: true, usedLeave: true, role: true },
      }),
      this.prisma.leaveRequest.count({ where: { userId } }),
      this.prisma.leaveRequest.findMany({
        where: { userId },
        include: {
          user: { include: { workPolicy: true } },
          approver: { select: { name: true } },
        },
        orderBy: { startDate: order },
        skip,
        take: limit,
      }),
    ]);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.role === Role.OWNER) {
      throw new ForbiddenException('OWNER는 승인 목록을 이용하세요.');
    }

    const data = requests.map((req) => {
      const days =
        req.type === 'ANNUAL'
          ? differenceInDays(req.endDate, req.startDate) + 1
          : 0.5;

      let timeDetail: '오전' | '오후' | null = null;
      if (req.type === 'HALF_AM') timeDetail = '오전';
      if (req.type === 'HALF_PM') timeDetail = '오후';

      return {
        id: req.id,
        displayId: req.id.substring(req.id.length - 6).toUpperCase(),
        type: req.type,
        startDate: req.startDate.toISOString().split('T')[0].replace(/-/g, '.'),
        endDate: req.endDate.toISOString().split('T')[0].replace(/-/g, '.'),
        reason: req.reason,
        status: req.status,
        createdAt: req.createdAt,
        timeRange: this.getTimeRange(req.type, req.user.workPolicy),
        durationText: `${days.toFixed(1)}일`,
        timeDetail: timeDetail,
        approver: req.approver?.name || '-',
      };
    });

    return {
      summary: {
        total: user.totalLeave,
        used: user.usedLeave,
        remaining: user.totalLeave - user.usedLeave,
      },
      data,
      meta: {
        currentPage: page,
        limit: limit,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * 단일 휴가 신청 내역 상세 조회
   */
  async findOne(id: string) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, role: true } },
        approver: { select: { name: true } },
      },
    });

    if (!request) {
      throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
    }

    return request;
  }

  /**
   * 휴가 신청 승인 처리 (권한 체크 및 연차 차감)
   */
  async approveVacation(requestId: string, approverId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const request = await tx.leaveRequest.findUnique({
        where: { id: requestId },
        include: { user: true },
      });

      if (!request) {
        throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
      }

      if (request.status !== 'PENDING') {
        throw new ForbiddenException('이미 처리된 신청 건입니다.');
      }

      const approver = await tx.user.findUnique({ where: { id: approverId } });
      if (!approver) {
        throw new NotFoundException('승인자 정보를 찾을 수 없습니다.');
      }

      if (request.userId === approverId && approver.role !== Role.OWNER) {
        throw new ForbiddenException('본인의 휴가는 직접 승인할 수 없습니다.');
      }

      await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          approverId: approverId,
        },
      });

      const weight =
        request.type === 'ANNUAL'
          ? differenceInDays(request.endDate, request.startDate) + 1
          : 0.5;

      await tx.user.update({
        where: { id: request.userId },
        data: { usedLeave: { increment: weight } },
      });
    });
  }

  /**
   * [Private] 근무 정책에 따른 시간대 텍스트 생성
   */
  private getTimeRange(type: string, policy: WorkPolicy | null) {
    if (!policy) return '설정 없음';
    switch (type) {
      case 'ANNUAL':
        return 'Full-day';
      case 'HALF_AM':
        return `${policy.workStartTime} - ${policy.lunchStartTime}`;
      case 'HALF_PM':
        return `${policy.lunchEndTime} - ${policy.workEndTime}`;
      default:
        return '-';
    }
  }

  /**
   * 승인자용 - 회사 전체 휴가 신청 목록 조회 (💡 통계 데이터 추가 반영)
   */
  async findAllForApprover(
    approverId: string,
    status: RequestStatus | undefined,
    order: 'asc' | 'desc',
    page: number,
    limit: number,
  ) {
    const approver = await this.prisma.user.findUnique({
      where: { id: approverId },
      select: { companyId: true, role: true },
    });

    if (!approver) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    if (approver.role === Role.USER)
      throw new ForbiddenException('승인 권한이 없습니다.');

    // 리스트 조회 필터 조건
    const where = {
      companyId: approver.companyId,
      ...(status ? { status } : {}),
    };

    const skip = (page - 1) * limit;

    // 💡 통계 집계를 위해 각각의 카운트 쿼리를 분리하여 Promise.all에 통합
    const [totalCount, requests, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        this.prisma.leaveRequest.count({ where }),
        this.prisma.leaveRequest.findMany({
          where,
          include: {
            user: { select: { name: true, position: true, role: true } },
            approver: { select: { name: true } },
          },
          orderBy: { startDate: order },
          skip,
          take: limit,
        }),
        // 💡 탭 상태와 독립적으로 상단 카드의 값을 채워주기 위한 전체 카운트 쿼리들
        this.prisma.leaveRequest.count({
          where: { companyId: approver.companyId, status: 'PENDING' },
        }),
        this.prisma.leaveRequest.count({
          where: { companyId: approver.companyId, status: 'APPROVED' },
        }),
        this.prisma.leaveRequest.count({
          where: { companyId: approver.companyId, status: 'REJECTED' },
        }),
      ]);

    const data = requests.map((req) => {
      const days =
        req.type === 'ANNUAL'
          ? differenceInDays(req.endDate, req.startDate) + 1
          : 0.5;

      return {
        id: req.id,
        displayId: req.id.substring(req.id.length - 6).toUpperCase(),
        type: req.type,
        startDate: req.startDate.toISOString().split('T')[0].replace(/-/g, '.'),
        endDate: req.endDate.toISOString().split('T')[0].replace(/-/g, '.'),
        reason: req.reason,
        status: req.status,
        createdAt: req.createdAt,
        durationText: `${days.toFixed(1)}일`,
        applicant: {
          name: req.user.name,
          position: req.user.position || '-',
        },
        approver: req.approver?.name || '미처리',
      };
    });

    return {
      // 💡 프론트엔드가 요청한 통계 요약 데이터 추가 제공
      summary: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      data,
      meta: {
        currentPage: page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * 휴가 반려 처리
   */
  async rejectVacation(
    requestId: string,
    approverId: string,
    dto: RejectVacationDto,
  ) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
    if (request.status !== 'PENDING')
      throw new ForbiddenException('이미 처리된 신청 건입니다.');

    return await this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approverId,
        rejectReason: dto.rejectReason?.trim() || '사유 없음',
      },
    });
  }
}
