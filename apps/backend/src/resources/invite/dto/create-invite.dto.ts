import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateInviteDto {
  @ApiProperty({
    example: 'employee@worklog.com',
    description: '초대할 사용자의 이메일',
  })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다' })
  email: string;

  @ApiProperty({
    example: 'USER',
    enum: Role,
    description: '부여할 역할 (ADMIN 또는 USER)',
  })
  @IsEnum(Role, { message: '역할은 ADMIN 또는 USER만 가능합니다' })
  role: Role; // string에서 Role 타입으로 변경
}
