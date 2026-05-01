// import { Module } from '@nestjs/common';
// import { InviteService } from './invite.service';
// import { InviteController } from './invite.controller';

// @Module({
//   providers: [InviteService],
//   controllers: [InviteController],
// })
// export class InviteModule {}

import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { AuthModule } from '../../core/auth/auth.module'; // 👈 AuthModule 경로를 확인해서 임포트하세요.

@Module({
  imports: [
    AuthModule, // 👈 핵심: 이걸 넣어야 InviteController의 @UseGuards(JwtAuthGuard)가 동작합니다!
  ],
  providers: [InviteService],
  controllers: [InviteController],
})
export class InviteModule {}
