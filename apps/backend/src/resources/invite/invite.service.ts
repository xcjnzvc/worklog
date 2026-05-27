import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}

  // 초대 링크 생성
  async createInvite(dto: { email: string; role: Role; companyId: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new BadRequestException('이미 가입된 이메일입니다');

    const existingInvite = await this.prisma.invite.findFirst({
      where: {
        email: dto.email,
        companyId: dto.companyId,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
    if (existingInvite)
      throw new BadRequestException('이미 초대 링크가 발송된 이메일입니다');

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invite = await this.prisma.invite.create({
      data: {
        token,
        email: dto.email,
        companyId: dto.companyId,
        role: dto.role,
        expiresAt,
      },
    });

    return {
      inviteLink: `${process.env.FRONTEND_URL}/signup?token=${invite.token}`,
      token: invite.token,
      expiresAt: invite.expiresAt,
    };
  }

  // 토큰 검증
  async verifyToken(token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invite) throw new NotFoundException('유효하지 않은 초대 링크입니다');
    if (invite.used)
      throw new BadRequestException('이미 사용된 초대 링크입니다');
    if (invite.expiresAt < new Date())
      throw new BadRequestException('만료된 초대 링크입니다');

    return {
      email: invite.email,
      role: invite.role,
      companyId: invite.companyId,
      companyName: invite.company.name,
    };
  }

  // 초대 토큰으로 회원가입
  async registerWithToken(dto: {
    token: string;
    password: string;
    name: string;
    phone: string;
  }) {
    const invite = await this.prisma.invite.findUnique({
      where: { token: dto.token },
    });

    if (!invite) throw new NotFoundException('유효하지 않은 초대 링크입니다');
    if (invite.used)
      throw new BadRequestException('이미 사용된 초대 링크입니다');
    if (invite.expiresAt < new Date())
      throw new BadRequestException('만료된 초대 링크입니다');

    const existingUser = await this.prisma.user.findUnique({
      where: { email: invite.email },
    });
    if (existingUser) throw new BadRequestException('이미 가입된 이메일입니다');

    // ─── [추가된 로직] 해당 회사의 기본 정책 찾기 ───
    // 회사가 처음 만들어질 때 생성된 '기본 근무 정책'을 가져옵니다.
    const policy = await this.prisma.workPolicy.findFirst({
      where: { companyId: invite.companyId },
      orderBy: { createdAt: 'asc' }, // 가장 먼저 생성된 것
    });

    if (!policy) {
      throw new BadRequestException(
        '회사의 기본 근무 정책을 찾을 수 없습니다. 관리자에게 문의하세요.',
      );
    }
    // ──────────────────────────────────────────────

    const hashed = await bcrypt.hash(dto.password, 10);

    // 유저 생성 시 workPolicyId를 포함합니다.
    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        password: hashed,
        name: dto.name,
        phone: dto.phone,
        role: invite.role,
        companyId: invite.companyId,
        workPolicyId: policy.id,
      },
    });

    // 토큰 사용 처리
    await this.prisma.invite.update({
      where: { token: dto.token },
      data: { used: true },
    });

    return { userId: user.id, email: user.email };
  }

  // src/invite/invite.service.ts

  async getInvites(companyId: string) {
    const invites = await this.prisma.invite.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();

    // 데이터를 가공해서 status를 추가하여 반환
    return invites.map((invite) => {
      let status = 'PENDING';
      if (invite.used) {
        status = 'ACCEPTED';
      } else if (invite.expiresAt < now) {
        status = 'EXPIRED';
      }

      return {
        ...invite,
        status, // 클라이언트가 바로 쓸 수 있게 상태값 추가
      };
    });
  }

  async resendInvite(email: string, companyId: string) {
    // 1. 기존 초대 건 찾기 (만료되었거나 pending 중인 건)
    const existingInvite = await this.prisma.invite.findFirst({
      where: { email, companyId, used: false },
    });

    // 2. 만약 있다면, 기존 토큰을 '사용 불가' 처리하거나 삭제
    if (existingInvite) {
      await this.prisma.invite.delete({ where: { id: existingInvite.id } });
    }

    // 3. 다시 createInvite 호출 (이미 만들어둔 로직 재사용)
    return this.createInvite({
      email,
      role: existingInvite?.role || 'USER', // 기존 권한 유지
      companyId,
    });
  }
}
