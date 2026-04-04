import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({ example: 'employee@worklog.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다' })
  email: string;

  @ApiProperty({ example: 'USER', enum: ['ADMIN', 'USER'] })
  @IsIn(['ADMIN', 'USER'], { message: '역할은 ADMIN 또는 USER만 가능합니다' })
  role: string;
}
