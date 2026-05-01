import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'boss@worklog.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다' })
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString({ message: '비밀번호를 입력해주세요' })
  password: string;
}
