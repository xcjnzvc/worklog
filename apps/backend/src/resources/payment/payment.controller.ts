import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // payment.controller.ts
  @Post('complete')
  @UseGuards(JwtAuthGuard)
  async completePayment(
    @GetUser('userId') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    // 🚀 이 로그를 확인하세요!
    console.log('받은 데이터:', createPaymentDto);
    console.log('유저 ID:', userId);

    return await this.paymentService.verifyAndActivateSubscription(
      userId,
      createPaymentDto.paymentId,
      createPaymentDto.planName,
      createPaymentDto.seatCount,
    );
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelPayment(@GetUser('userId') userId: string) {
    return await this.paymentService.cancelSubscription(userId);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentPayment(@GetUser('userId') userId: string) {
    return await this.paymentService.getCurrentPayment(userId);
  }
}
