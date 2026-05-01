// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { WorkPolicy, LeaveType } from '@prisma/client';

// // import { CreateVacationDto } from './dto/create-vacation.dto';
// // import { UpdateVacationDto } from './dto/update-vacation.dto';

// @Injectable()
// export class VacationService {
//   constructor(private prisma: PrismaService) {}

//   // create(createVacationDto: CreateVacationDto) {
//   //   return 'This action adds a new vacation';
//   // }

//   async findAll(
//     userId: string,
//     order: 'asc' | 'desc',
//     page: number,
//     limit: number,
//   ) {
//     const skip = (page - 1) * limit;

//     // 1. 유저 정보 및 목록 데이터 동시 조회
//     // 여기서 [user, totalCount, requests] 배열로 결과를 받습니다.
//     const [user, totalCount, requests] = await Promise.all([
//       this.prisma.user.findUnique({
//         where: { id: userId },
//         select: { id: true, totalLeave: true, usedLeave: true },
//       }),
//       this.prisma.leaveRequest.count({ where: { userId } }),
//       this.prisma.leaveRequest.findMany({
//         where: { userId },
//         include: { user: { include: { workPolicy: true } } },
//         orderBy: { startDate: order },
//         skip,
//         take: limit,
//       }),
//     ]);

//     // user가 없을 경우(방어 코드)
//     if (!user) {
//       throw new NotFoundException('사용자를 찾을 수 없습니다.');
//     }

//     // 2. 응답 데이터 가공
//     const data = requests.map((req) => ({
//       id: req.id,
//       type: req.type,
//       startDate: req.startDate,
//       endDate: req.endDate,
//       timeRange: this.getTimeRange(req.type, req.user.workPolicy),
//       status: req.status,
//       createdAt: req.createdAt,
//     }));

//     // 3. 최종 결과 반환
//     return {
//       // 여기서 아까 말씀하신 summary를 넣어줍니다
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

//   // 승인 로직 (트랜잭션 적용)
//   async approveVacation(requestId: string) {
//     return await this.prisma.$transaction(async (tx) => {
//       // 1. 요청 조회
//       const request = await tx.leaveRequest.findUnique({
//         where: { id: requestId },
//       });

//       // 2. 방어 코드 (이게 핵심입니다)
//       if (!request) {
//         throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
//       }

//       // 3. 승인 처리
//       await tx.leaveRequest.update({
//         where: { id: requestId },
//         data: { status: 'APPROVED' },
//       });

//       // 4. 가중치 계산 (request가 존재함이 보장됨)
//       const weight = this.getLeaveWeight(request.type);

//       // 5. 유저 연차 차감
//       await tx.user.update({
//         where: { id: request.userId }, // 이제 request.userId에 접근해도 에러 안 납니다
//         data: { usedLeave: { increment: weight } },
//       });
//     });
//   }

//   private getTimeRange(type: string, policy: WorkPolicy | null) {
//     if (!policy) return '설정 없음'; // 정책이 없으면 안전하게 반환

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

//   private getLeaveWeight(type: LeaveType): number {
//     return type === 'ANNUAL' ? 1.0 : 0.5;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} vacation`;
//   }

//   // update(id: number, updateVacationDto: UpdateVacationDto) {
//   //   return `This action updates a #${id} vacation`;
//   // }

//   // remove(id: number) {
//   //   return `This action removes a #${id} vacation`;
//   // }
// }


import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WorkPolicy, LeaveType, LeaveRequest, Role } from '@prisma/client';
import { differenceInDays } from 'date-fns';

@Injectable()
export class VacationService {
  constructor(private prisma: PrismaService) {}

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
          approver: { select: { name: true } }
        },
        orderBy: { startDate: order },
        skip,
        take: limit,
      }),
    ]);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const data = requests.map((req) => ({
      id: req.id,
      type: req.type,
      startDate: req.startDate.toISOString().split('T')[0],
      endDate: req.endDate.toISOString().split('T')[0],
      reason: req.reason,
      status: req.status,
      createdAt: req.createdAt,
      timeRange: this.getTimeRange(req.type, req.user.workPolicy),
      duration: this.calculateDuration(req),
      approver: req.approver?.name || '-',
    }));

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

  // 승인 로직 (권한 체크 및 승인자 저장 포함)
  async approveVacation(requestId: string, approverId: string) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. 요청 정보와 신청자의 역할을 함께 조회
      const request = await tx.leaveRequest.findUnique({
        where: { id: requestId },
        include: { user: true },
      });

      if (!request) {
        throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
      }

      // 2. 승인자 정보 조회
      const approver = await tx.user.findUnique({ where: { id: approverId } });
      if (!approver) {
        throw new NotFoundException('승인자 정보를 찾을 수 없습니다.');
      }

      // 3. 승인 권한 검증 로직
      // 본인 승인 방지 (단, 대표(OWNER)는 본인 승인 허용)
      if (request.userId === approverId && approver.role !== Role.OWNER) {
        throw new ForbiddenException('본인의 휴가는 본인이 승인할 수 없습니다.');
      }
      
      // 팀장(ADMIN) 휴가는 대표(OWNER)만 승인 가능
      if (request.user.role === Role.ADMIN && approver.role !== Role.OWNER) {
        throw new ForbiddenException('팀장급 휴가는 대표(OWNER)만 승인할 수 있습니다.');
      }

      // 4. 승인 처리 및 승인자(approverId) 업데이트
      await tx.leaveRequest.update({
        where: { id: requestId },
        data: { 
          status: 'APPROVED',
          approverId: approverId // 승인자 ID 기록
        },
      });

      // 5. 유저 연차 차감
      const weight = this.getLeaveWeight(request.type);
      await tx.user.update({
        where: { id: request.userId },
        data: { usedLeave: { increment: weight } },
      });
    });
  }

  private getTimeRange(type: string, policy: WorkPolicy | null) {
    if (!policy) return '설정 없음';
    switch (type) {
      case 'ANNUAL': return 'Full-day';
      case 'HALF_AM': return `${policy.workStartTime} - ${policy.lunchStartTime}`;
      case 'HALF_PM': return `${policy.lunchEndTime} - ${policy.workEndTime}`;
      default: return '-';
    }
  }

  private calculateDuration(req: LeaveRequest): string {
    if (req.type !== 'ANNUAL') return '0.5일';
    const days = differenceInDays(req.endDate, req.startDate) + 1;
    return `${days}일`;
  }

  private getLeaveWeight(type: LeaveType): number {
    return type === 'ANNUAL' ? 1.0 : 0.5;
  }
  
  async findOne(id: string) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
    }
    return request;
  }
  // update(id: number, updateVacationDto: UpdateVacationDto) {
  //   return `This action updates a #${id} vacation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} vacation`;
  // }
}