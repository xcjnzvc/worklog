import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // 회사 생성 + OWNER 계정 생성
  async createCompany(dto: {
    companyName: string;
    email: string;
    password: string;
    name: string;
    phone: string;
  }) {
    const existing = await this.prisma.company.findUnique({
      where: { name: dto.companyName },
    });
    if (existing) throw new BadRequestException('이미 존재하는 회사명입니다');

    const hashed = await bcrypt.hash(dto.password, 10);

    const company = await this.prisma.company.create({
      data: { name: dto.companyName },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
        phone: dto.phone,
        role: 'OWNER',
        companyId: company.id,
      },
    });

    return { companyId: company.id, userId: user.id };
  }

  // 로그인
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });
    if (!user)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company.name,
      },
    };
  }
}
