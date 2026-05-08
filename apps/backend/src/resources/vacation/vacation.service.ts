// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { PrismaService } from '../prisma/prisma.service';
// // import { WorkPolicy, LeaveType } from '@prisma/client';

// // // import { CreateVacationDto } from './dto/create-vacation.dto';
// // // import { UpdateVacationDto } from './dto/update-vacation.dto';

// // @Injectable()
// // export class VacationService {
// //   constructor(private prisma: PrismaService) {}

// //   // create(createVacationDto: CreateVacationDto) {
// //   //   return 'This action adds a new vacation';
// //   // }

// //   async findAll(
// //     userId: string,
// //     order: 'asc' | 'desc',
// //     page: number,
// //     limit: number,
// //   ) {
// //     const skip = (page - 1) * limit;

// //     // 1. 유저 정보 및 목록 데이터 동시 조회
// //     // 여기서 [user, totalCount, requests] 배열로 결과를 받습니다.
// //     const [user, totalCount, requests] = await Promise.all([
// //       this.prisma.user.findUnique({
// //         where: { id: userId },
// //         select: { id: true, totalLeave: true, usedLeave: true },
// //       }),
// //       this.prisma.leaveRequest.count({ where: { userId } }),
// //       this.prisma.leaveRequest.findMany({
// //         where: { userId },
// //         include: { user: { include: { workPolicy: true } } },
// //         orderBy: { startDate: order },
// //         skip,
// //         take: limit,
// //       }),
// //     ]);

// //     // user가 없을 경우(방어 코드)
// //     if (!user) {
// //       throw new NotFoundException('사용자를 찾을 수 없습니다.');
// //     }

// //     // 2. 응답 데이터 가공
// //     const data = requests.map((req) => ({
// //       id: req.id,
// //       type: req.type,
// //       startDate: req.startDate,
// //       endDate: req.endDate,
// //       timeRange: this.getTimeRange(req.type, req.user.workPolicy),
// //       status: req.status,
// //       createdAt: req.createdAt,
// //     }));

// //     // 3. 최종 결과 반환
// //     return {
// //       // 여기서 아까 말씀하신 summary를 넣어줍니다
// //       summary: {
// //         total: user.totalLeave,
// //         used: user.usedLeave,
// //         remaining: user.totalLeave - user.usedLeave,
// //       },
// //       data,
// //       meta: {
// //         totalCount,
// //         page,
// //         limit,
// //         lastPage: Math.ceil(totalCount / limit),
// //       },
// //     };
// //   }

// //   // 승인 로직 (트랜잭션 적용)
// //   async approveVacation(requestId: string) {
// //     return await this.prisma.$transaction(async (tx) => {
// //       // 1. 요청 조회
// //       const request = await tx.leaveRequest.findUnique({
// //         where: { id: requestId },
// //       });

// //       // 2. 방어 코드 (이게 핵심입니다)
// //       if (!request) {
// //         throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
// //       }

// //       // 3. 승인 처리
// //       await tx.leaveRequest.update({
// //         where: { id: requestId },
// //         data: { status: 'APPROVED' },
// //       });

// //       // 4. 가중치 계산 (request가 존재함이 보장됨)
// //       const weight = this.getLeaveWeight(request.type);

// //       // 5. 유저 연차 차감
// //       await tx.user.update({
// //         where: { id: request.userId }, // 이제 request.userId에 접근해도 에러 안 납니다
// //         data: { usedLeave: { increment: weight } },
// //       });
// //     });
// //   }

// //   private getTimeRange(type: string, policy: WorkPolicy | null) {
// //     if (!policy) return '설정 없음'; // 정책이 없으면 안전하게 반환

// //     switch (type) {
// //       case 'ANNUAL':
// //         return 'Full-day';
// //       case 'HALF_AM':
// //         return `${policy.workStartTime} - ${policy.lunchStartTime}`;
// //       case 'HALF_PM':
// //         return `${policy.lunchEndTime} - ${policy.workEndTime}`;
// //       default:
// //         return '-';
// //     }
// //   }

// //   private getLeaveWeight(type: LeaveType): number {
// //     return type === 'ANNUAL' ? 1.0 : 0.5;
// //   }

// //   findOne(id: number) {
// //     return `This action returns a #${id} vacation`;
// //   }

// //   // update(id: number, updateVacationDto: UpdateVacationDto) {
// //   //   return `This action updates a #${id} vacation`;
// //   // }

// //   // remove(id: number) {
// //   //   return `This action removes a #${id} vacation`;
// //   // }
// // }

// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { WorkPolicy, LeaveType, LeaveRequest, Role } from '@prisma/client';
// import { differenceInDays } from 'date-fns';

// @Injectable()
// export class VacationService {
//   constructor(private prisma: PrismaService) {}

//   async findAll(
//     userId: string,
//     order: 'asc' | 'desc',
//     page: number,
//     limit: number,
//   ) {
//     const skip = (page - 1) * limit;

//     const [user, totalCount, requests] = await Promise.all([
//       this.prisma.user.findUnique({
//         where: { id: userId },
//         select: { id: true, totalLeave: true, usedLeave: true },
//       }),
//       this.prisma.leaveRequest.count({ where: { userId } }),
//       this.prisma.leaveRequest.findMany({
//         where: { userId },
//         include: {
//           user: { include: { workPolicy: true } },
//           approver: { select: { name: true } },
//         },
//         orderBy: { startDate: order },
//         skip,
//         take: limit,
//       }),
//     ]);

//     if (!user) {
//       throw new NotFoundException('사용자를 찾을 수 없습니다.');
//     }

//     const data = requests.map((req) => ({
//       id: req.id,
//       type: req.type,
//       startDate: req.startDate.toISOString().split('T')[0],
//       endDate: req.endDate.toISOString().split('T')[0],
//       reason: req.reason,
//       status: req.status,
//       createdAt: req.createdAt,
//       timeRange: this.getTimeRange(req.type, req.user.workPolicy),
//       duration: this.calculateDuration(req),
//       approver: req.approver?.name || '-',
//     }));

//     return {
//       summary: {
//         total: user.totalLeave,
//         used: user.usedLeave,
//         remaining: user.totalLeave - user.usedLeave,
//       },
//       data,
//       meta: {
//         totalCount,
//         page,
//         limit,
//         lastPage: Math.ceil(totalCount / limit),
//       },
//     };
//   }

//   // 승인 로직 (권한 체크 및 승인자 저장 포함)
//   async approveVacation(requestId: string, approverId: string) {
//     return await this.prisma.$transaction(async (tx) => {
//       // 1. 요청 정보와 신청자의 역할을 함께 조회
//       const request = await tx.leaveRequest.findUnique({
//         where: { id: requestId },
//         include: { user: true },
//       });

//       if (!request) {
//         throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
//       }

//       // 2. 승인자 정보 조회
//       const approver = await tx.user.findUnique({ where: { id: approverId } });
//       if (!approver) {
//         throw new NotFoundException('승인자 정보를 찾을 수 없습니다.');
//       }

//       // 3. 승인 권한 검증 로직
//       // 본인 승인 방지 (단, 대표(OWNER)는 본인 승인 허용)
//       if (request.userId === approverId && approver.role !== Role.OWNER) {
//         throw new ForbiddenException(
//           '본인의 휴가는 본인이 승인할 수 없습니다.',
//         );
//       }

//       // 팀장(ADMIN) 휴가는 대표(OWNER)만 승인 가능
//       if (request.user.role === Role.ADMIN && approver.role !== Role.OWNER) {
//         throw new ForbiddenException(
//           '팀장급 휴가는 대표(OWNER)만 승인할 수 있습니다.',
//         );
//       }

//       // 4. 승인 처리 및 승인자(approverId) 업데이트
//       await tx.leaveRequest.update({
//         where: { id: requestId },
//         data: {
//           status: 'APPROVED',
//           approverId: approverId, // 승인자 ID 기록
//         },
//       });

//       // 5. 유저 연차 차감
//       const weight = this.getLeaveWeight(request.type);
//       await tx.user.update({
//         where: { id: request.userId },
//         data: { usedLeave: { increment: weight } },
//       });
//     });
//   }

//   private getTimeRange(type: string, policy: WorkPolicy | null) {
//     if (!policy) return '설정 없음';
//     switch (type) {
//       case 'ANNUAL':
//         return 'Full-day';
//       case 'HALF_AM':
//         return `${policy.workStartTime} - ${policy.lunchStartTime}`;
//       case 'HALF_PM':
//         return `${policy.lunchEndTime} - ${policy.workEndTime}`;
//       default:
//         return '-';
//     }
//   }

//   private calculateDuration(req: LeaveRequest): string {
//     if (req.type !== 'ANNUAL') return '0.5일';
//     const days = differenceInDays(req.endDate, req.startDate) + 1;
//     return `${days}일`;
//   }

//   private getLeaveWeight(type: LeaveType): number {
//     return type === 'ANNUAL' ? 1.0 : 0.5;
//   }

//   async findOne(id: string) {
//     const request = await this.prisma.leaveRequest.findUnique({
//       where: { id },
//     });
//     if (!request) {
//       throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
//     }
//     return request;
//   }
//   // update(id: number, updateVacationDto: UpdateVacationDto) {
//   //   return `This action updates a #${id} vacation`;
//   // }

//   // remove(id: number) {
//   //   return `This action removes a #${id} vacation`;
//   // }
// }

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WorkPolicy, LeaveType, LeaveRequest, Role } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { CreateVacationDto } from './dto/create-vacation.dto';

@Injectable()
export class VacationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateVacationDto) {
    const { type, startDate, endDate, reason, approverId, timeDetail } = dto;

    // 1. 유저 및 회사 정보 조회 (companyId 필수 입력 대응)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalLeave: true, usedLeave: true, companyId: true },
    });

    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    // 2. DTO 타입을 Prisma Enum 타입으로 변환 (HALF 분기 처리)
    let finalType: LeaveType;
    if (type === 'HALF') {
      if (!timeDetail)
        throw new ForbiddenException('반차 시 오전/오후 선택은 필수입니다.');
      finalType = timeDetail === 'AM' ? LeaveType.HALF_AM : LeaveType.HALF_PM;
    } else {
      finalType = type as unknown as LeaveType;
    }

    // 3. 차감 일수 계산 (연차는 날짜 차이, 반차는 0.5일, 나머지는 0일)
    let requestedDays = 0;
    if (type === 'ANNUAL') {
      requestedDays =
        differenceInDays(new Date(endDate), new Date(startDate)) + 1;
    } else if (type === 'HALF') {
      requestedDays = 0.5;
    }

    // 4. 잔여 연차 검증 (연차/반차인 경우에만 체크)
    if (requestedDays > 0 && user.totalLeave - user.usedLeave < requestedDays) {
      throw new ForbiddenException('잔여 연차가 부족하여 신청할 수 없습니다.');
    }

    // 5. DB 저장
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
        select: { id: true, totalLeave: true, usedLeave: true },
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

    const data = requests.map((req) => {
      // 1. durationText 계산 ("1.0일", "0.5일" 등)
      const duration = this.calculateDuration(req);

      // 2. timeDetail 한글 변환 ("오전", "오후" 또는 null)
      let timeDetail: '오전' | '오후' | null = null;
      if (req.type === 'HALF_AM') timeDetail = '오전';
      if (req.type === 'HALF_PM') timeDetail = '오후';

      return {
        id: req.id,
        // 프론트엔드용 가독성 ID (ID 뒷자리 6자리 추출)
        displayId: req.id.substring(req.id.length - 6).toUpperCase(),
        type: req.type,
        startDate: req.startDate.toISOString().split('T')[0].replace(/-/g, '.'),
        endDate: req.endDate.toISOString().split('T')[0].replace(/-/g, '.'),
        reason: req.reason,
        status: req.status,
        createdAt: req.createdAt,
        timeRange: this.getTimeRange(req.type, req.user.workPolicy),
        durationText: duration,
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
        totalCount,
        page,
        limit,
        lastPage: Math.ceil(totalCount / limit),
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
      // 1. 요청 정보 조회
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

      // 2. 승인자 정보 조회
      const approver = await tx.user.findUnique({ where: { id: approverId } });
      if (!approver) {
        throw new NotFoundException('승인자 정보를 찾을 수 없습니다.');
      }

      // 3. 권한 검증
      // 본인 승인 방지 (단, OWNER는 허용 가능 - 정책에 따라 조절)
      if (request.userId === approverId && approver.role !== Role.OWNER) {
        throw new ForbiddenException('본인의 휴가는 직접 승인할 수 없습니다.');
      }

      // ADMIN(팀장) 휴가는 OWNER(대표)만 승인 가능
      if (request.user.role === Role.ADMIN && approver.role !== Role.OWNER) {
        throw new ForbiddenException(
          '팀장급 휴가는 대표만 승인할 수 있습니다.',
        );
      }

      // 4. 상태 업데이트
      await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          approverId: approverId,
        },
      });

      // 5. 연차 차감 로직
      const weight = this.getLeaveWeight(request.type);

      // ANNUAL일 경우 날짜 차이만큼 계산, 반차일 경우 0.5
      let totalDeduction = weight;
      if (request.type === 'ANNUAL') {
        totalDeduction =
          differenceInDays(request.endDate, request.startDate) + 1;
      }

      await tx.user.update({
        where: { id: request.userId },
        data: { usedLeave: { increment: totalDeduction } },
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
   * [Private] UI용 기간 텍스트 계산
   */
  private calculateDuration(req: LeaveRequest): string {
    if (req.type !== 'ANNUAL') return '0.5일';
    const days = differenceInDays(req.endDate, req.startDate) + 1;
    return `${days}.0일`;
  }

  /**
   * [Private] 휴가 타입별 가중치 (반차 0.5, 연차 1.0 기준)
   */
  private getLeaveWeight(type: LeaveType): number {
    return type === 'ANNUAL' ? 1.0 : 0.5;
  }
}
