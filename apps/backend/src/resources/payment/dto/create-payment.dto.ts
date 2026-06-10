import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  paymentId: string;

  @IsString()
  planName: string;

  @IsNumber()
  seatCount: number;
}
