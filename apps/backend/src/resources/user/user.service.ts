import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserPayload } from 'src/core/auth/interfaces/user-payload.interface';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getApprovers(user: UserPayload) {
    const { companyId, userId } = user;

    const approvers = await this.prisma.user.findMany({
      where: {
        companyId,
        OR: [{ role: Role.ADMIN }, { role: Role.OWNER }],
        NOT: { id: userId },
      },
      select: {
        id: true,
        name: true,
        role: true,
        position: {
          // ← string 대신 relation으로
          select: { name: true },
        },
        team: {
          select: { name: true },
        },
      },
    });

    return approvers.map((approver) => {
      const team = approver.team as { name: string } | null;
      const deptName = team?.name ?? '';
      const role = approver.role;
      const positionName =
        approver.position?.name || (role === Role.ADMIN ? '팀장' : '사원'); // ← .name으로

      return {
        id: approver.id,
        name: approver.name,
        role: role,
        department: deptName,
        position: positionName,
        displayTitle: this.formatDisplayTitle({
          role,
          team,
          position: positionName,
        }),
      };
    });
  }

  private formatDisplayTitle(user: {
    role: Role;
    team?: { name: string } | null;
    position?: string | null;
  }) {
    if (user.role === Role.OWNER) return '대표';

    const teamName = user.team?.name ?? '';
    const position =
      user.position || (user.role === Role.ADMIN ? '팀장' : '사원');

    return `${teamName} ${position}`.trim();
  }

  // user.service.ts

  // 팀원 목록 조회
  async getMembers(user: UserPayload, page: number) {
    const limit = 10;
    const skip = (page - 1) * limit;

    const [members, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: { companyId: user.companyId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          position: { select: { name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { companyId: user.companyId } }),
    ]);

    return {
      result: members,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  // 팀원 삭제 (OWNER 권한 체크 필수!)
  async deleteMember(currentUser: UserPayload, memberId: string) {
    // 1. 요청자가 OWNER인지 확인
    if (currentUser.role !== Role.OWNER) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    // 2. 본인 삭제 방지
    if (currentUser.userId === memberId) {
      throw new BadRequestException('본인은 탈퇴시킬 수 없습니다.');
    }

    // 3. 삭제 수행 (데이터 무결성을 위해 companyId를 조건으로 포함)
    return await this.prisma.user.delete({
      where: { id: memberId, companyId: currentUser.companyId },
    });
  }
}
