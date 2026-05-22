import { IsOptional, IsString } from 'class-validator';

export class RejectWorkLogDto {
  @IsOptional()
  @IsString()
  rejectReason?: string;
}
