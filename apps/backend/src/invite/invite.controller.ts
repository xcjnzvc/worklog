import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RegisterInviteDto } from './dto/register-invite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPayload } from '../auth/interfaces/user-payload.interface'; // 유저 페이로드 인터페이스
import { GetUser } from 'common/decorators/get-user.decorator';

@ApiTags('Invite')
@Controller('invite')
@ApiBearerAuth('access-token')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createInvite(@Body() body: CreateInviteDto, @GetUser() user: UserPayload) {
    return this.inviteService.createInvite({
      email: body.email,
      role: body.role,
      companyId: user.companyId,
    });
  }

  @Get('verify/:token')
  verifyToken(@Param('token') token: string) {
    return this.inviteService.verifyToken(token);
  }

  @Post('signup/:token')
  register(@Param('token') token: string, @Body() body: RegisterInviteDto) {
    return this.inviteService.registerWithToken({ token, ...body });
  }
}
