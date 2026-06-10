import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

// 포트원 응답 구조를 인터페이스로 정의
interface PortOnePaymentResponse {
  amount: {
    total: number;
  };
  status: string;
}

interface PortOneErrorResponse {
  message: string;
  code?: string;
}

@Injectable()
export class PaymentService {
  // PrismaService를 주입받아야 합니다.
  constructor(private readonly prisma: PrismaService) {}

  async verifyAndActivateSubscription(
    userId: string,
    paymentId: string,
    planName: string,
    seatCount: number,
  ) {
    // 1. 포트원 API 호출 및 검증 (기존 로직 동일)
    const response = await fetch(
      `https://api.portone.io/payments/${paymentId}`,
      {
        method: 'GET',
        headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` },
      },
    );

    const paymentInfo = (await response.json()) as PortOnePaymentResponse;

    // 이 로그 추가
    console.log('포트원 응답:', JSON.stringify(paymentInfo));
    console.log('response.ok:', response.ok);
    // console.log('예상 금액:', expectedAmount);
    console.log('실제 금액:', paymentInfo.amount?.total);
    console.log('결제 상태:', paymentInfo.status);

    // planName에 따라 예상 금액 계산
    const expectedAmount = planName === 'Basic' ? seatCount * 5000 : 490000;

    if (
      !response.ok ||
      paymentInfo.amount.total !== expectedAmount ||
      paymentInfo.status !== 'PAID'
    ) {
      throw new BadRequestException('결제 검증에 실패했습니다.');
    }

    // 2. [추가] 결제하는 유저의 상세 정보(회사명, 이름 등)를 DB에서 조회
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }, // company 정보도 함께 가져옴
    });

    if (!user) throw new BadRequestException('유저를 찾을 수 없습니다.');

    // 3. 트랜잭션으로 DB 업데이트 (결제 기록 저장 + 회사 구독 활성화)
    // 두 작업이 모두 성공해야 하므로 트랜잭션($transaction) 사용 추천
    await this.prisma.$transaction([
      // 결제 기록 저장
      this.prisma.payment.create({
        data: {
          paymentId: paymentId,
          userId: userId,
          companyId: user.companyId,
          userName: user.name,
          companyName: user.company.name, // 조회한 회사 정보 활용
          amount: paymentInfo.amount.total,
          planName: planName,
          status: 'PAID',
        },
      }),
      // 회사 구독 상태 업데이트
      this.prisma.company.update({
        where: { id: user.companyId },
        data: {
          plan: planName,
          maxMembers: planName === 'Basic' ? 50 : 999999,
        },
      }),
    ]);

    return { success: true, message: '구독이 활성화되었습니다.' };
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) throw new BadRequestException('유저를 찾을 수 없습니다.');
    if (user.company.plan === 'FREE') {
      throw new BadRequestException('현재 구독 중인 플랜이 없습니다.');
    }

    const latestPayment = await this.prisma.payment.findFirst({
      where: { companyId: user.companyId, status: 'PAID' },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestPayment) throw new BadRequestException('결제 내역이 없습니다.');

    // 포트원 실제 취소 API 호출
    const cancelRes = await fetch(
      `https://api.portone.io/payments/${latestPayment.paymentId}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: '고객 구독 취소' }),
      },
    );

    if (!cancelRes.ok) {
      // 1. 타입을 명시하여 any 타입 문제를 해결합니다.
      const err = (await cancelRes.json()) as PortOneErrorResponse;

      // 2. 에러 메시지가 없을 경우를 대비해 기본값을 설정합니다.
      const errorMessage =
        err.message || '포트원 취소 요청 중 알 수 없는 오류가 발생했습니다.';

      throw new BadRequestException(`포트원 취소 실패: ${errorMessage}`);
    }

    // DB 업데이트
    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: latestPayment.id },
        data: { status: 'CANCELLED' },
      }),
      this.prisma.company.update({
        where: { id: user.companyId },
        data: { plan: 'FREE', maxMembers: 3 },
      }),
    ]);

    return { success: true, message: '구독이 취소되었습니다.' };
  }

  async getCurrentPayment(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) throw new BadRequestException('유저를 찾을 수 없습니다.');

    const latestPayment = await this.prisma.payment.findFirst({
      where: { companyId: user.companyId, status: 'PAID' },
      orderBy: { createdAt: 'desc' },
    });

    return {
      plan: user.company.plan,
      maxMembers: user.company.maxMembers,
      amount: latestPayment?.amount ?? 0,
      paidAt: latestPayment?.createdAt ?? null,
    };
  }
}
