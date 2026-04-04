import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: '워크로그' })
  @IsString({ message: '회사명을 입력해주세요' })
  companyName: string;

  @ApiProperty({ example: 'boss@worklog.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다' })
  email: string;

  @ApiProperty({ example: '1234' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다' })
  password: string;

  @ApiProperty({ example: '홍길동' })
  @IsString({ message: '이름을 입력해주세요' })
  name: string;

  @ApiProperty({ example: '01012341234' })
  @IsString({ message: '연락처를 입력해주세요' })
  phone: string;
}
