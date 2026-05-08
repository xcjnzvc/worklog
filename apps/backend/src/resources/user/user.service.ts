import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserPayload } from 'src/core/auth/interfaces/user-payload.interface';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getApprovers(user: UserPayload) {
    const { companyId, userId } = user;

    // Prisma가 리턴하는 타입을 명확히 정의 (ESLint 추론 에러 방지)
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
        position: true,
        team: {
          select: { name: true },
        },
      },
    });

    return approvers.map((approver) => {
      // 1. 타입을 수동으로 지정하여 ESLint의 추론 문제를 해결합니다.
      const team = approver.team as { name: string } | null;
      const deptName = team?.name ?? '';

      const role = approver.role;
      const position =
        approver.position || (role === Role.ADMIN ? '팀장' : '사원');

      return {
        id: approver.id,
        name: approver.name,
        role: role,
        department: deptName,
        position: position,
        displayTitle: this.formatDisplayTitle({
          role,
          team,
          position: approver.position,
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
}
