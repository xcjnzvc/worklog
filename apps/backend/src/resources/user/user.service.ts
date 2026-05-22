import { Injectable } from '@nestjs/common';
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
}
