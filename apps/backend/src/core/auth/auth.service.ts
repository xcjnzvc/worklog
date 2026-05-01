// import {
//   Injectable,
//   BadRequestException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private prisma: PrismaService,
//     private jwt: JwtService,
//   ) {}

//   // 회사 생성 + OWNER 계정 생성
//   async createCompany(dto: {
//     companyName: string;
//     email: string;
//     password: string;
//     name: string;
//     phone: string;
//   }) {
//     const existing = await this.prisma.company.findUnique({
//       where: { name: dto.companyName },
//     });
//     if (existing) throw new BadRequestException('이미 존재하는 회사명입니다');

//     const hashed = await bcrypt.hash(dto.password, 10);

//     const company = await this.prisma.company.create({
//       data: { name: dto.companyName },
//     });

//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         password: hashed,
//         name: dto.name,
//         phone: dto.phone,
//         role: 'OWNER',
//         companyId: company.id,
//       },
//     });

//     return { companyId: company.id, userId: user.id };
//   }

//   // 로그인
//   async login(dto: { email: string; password: string }) {
//     const user = await this.prisma.user.findUnique({
//       where: { email: dto.email },
//       include: { company: true },
//     });
//     if (!user)
//       throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');

//     const valid = await bcrypt.compare(dto.password, user.password);
//     if (!valid)
//       throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');

//     const token = this.jwt.sign({
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//       companyId: user.companyId,
//     });

//     return {
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         companyId: user.companyId,
//         companyName: user.company.name,
//       },
//     };
//   }
// }

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, WorkType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * 회사 생성 + 기본 근무 정책 생성 + OWNER 계정 생성
   * (사용자는 정책을 입력하지 않지만, 시스템이 내부적으로 기본 정책을 만들어 연결합니다)
   */
  async createCompany(dto: {
    companyName: string;
    email: string;
    password: string;
    name: string;
    phone: string;
  }) {
    // 1. 회사명 중복 체크
    const existing = await this.prisma.company.findUnique({
      where: { name: dto.companyName },
    });
    if (existing) throw new BadRequestException('이미 존재하는 회사명입니다');

    // 2. 이메일 중복 체크
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new BadRequestException('이미 사용 중인 이메일입니다');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. 트랜잭션 실행: 하나라도 실패하면 모두 취소됩니다.
    return this.prisma.$transaction(async (tx) => {
      // (1) 회사 생성
      const company = await tx.company.create({
        data: { name: dto.companyName },
      });

      // (2) 해당 회사의 '기본 근무 정책' 생성
      // 사용자는 나중에 '설정'에서 이 정책 내용을 변경할 수 있습니다.
      const defaultPolicy = await tx.workPolicy.create({
        data: {
          companyId: company.id,
          name: '기본 근무 정책',
          workType: WorkType.FIXED,
          workStartTime: '09:00',
          lunchMinutes: 60,
          weeklyMustMinutes: 2400, // 주 40시간(60분 * 40h)
        },
      });

      // (3) OWNER 권한을 가진 유저 생성 및 정책 연결
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          phone: dto.phone,
          role: Role.OWNER,
          companyId: company.id,
          workPolicyId: defaultPolicy.id, // 필수 필드 해결
        },
      });

      return {
        companyId: company.id,
        userId: user.id,
        policyId: defaultPolicy.id,
      };
    });
  }

  /**
   * 로그인 로직
   */
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');
    }

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
