import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';
import { InviteModule } from './resources/invite/invite.module';
import { WorkLogModule } from './resources/work-log/work-log.module';
import { VacationModule } from './resources/vacation/vacation.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    InviteModule,
    WorkLogModule,
    VacationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
