import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { v4 as uuidv4 } from 'uuid';
import { randomUUID } from 'crypto';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}

  // 초대 링크 생성
  async createInvite(dto: { email: string; role: string; companyId: string }) {
    // 이미 가입된 유저인지 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new BadRequestException('이미 가입된 이메일입니다');

    // 이미 유효한 초대가 있는지 확인
    const existingInvite = await this.prisma.invitation.findFirst({
      where: {
        email: dto.email,
        companyId: dto.companyId,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
    if (existingInvite)
      throw new BadRequestException('이미 초대 링크가 발송된 이메일입니다');

    // const token = uuidv4();
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24시간 후 만료

    const invite = await this.prisma.invitation.create({
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

  // 토큰 검증 (가입 페이지에서 사용)
  async verifyToken(token: string) {
    const invite = await this.prisma.invitation.findUnique({
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
    const invite = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
    });

    if (!invite) throw new NotFoundException('유효하지 않은 초대 링크입니다');
    if (invite.used)
      throw new BadRequestException('이미 사용된 초대 링크입니다');
    if (invite.expiresAt < new Date())
      throw new BadRequestException('만료된 초대 링크입니다');

    // 이미 가입된 유저 확인 추가
    const existingUser = await this.prisma.user.findUnique({
      where: { email: invite.email },
    });
    if (existingUser) throw new BadRequestException('이미 가입된 이메일입니다');

    const bcrypt = await import('bcrypt');
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        password: hashed,
        name: dto.name,
        phone: dto.phone,
        role: invite.role,
        companyId: invite.companyId,
      },
    });

    // 토큰 사용 처리
    await this.prisma.invitation.update({
      where: { token: dto.token },
      data: { used: true },
    });

    return { userId: user.id, email: user.email };
  }
}
