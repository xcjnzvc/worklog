import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RegisterInviteDto {
  @ApiProperty({ example: '1234' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다' })
  password: string;

  @ApiProperty({ example: '김직원' })
  @IsString({ message: '이름을 입력해주세요' })
  name: string;

  @ApiProperty({ example: '01098765432' })
  @IsString({ message: '연락처를 입력해주세요' })
  phone: string;
}
