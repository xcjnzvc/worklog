import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RegisterInviteDto } from './dto/register-invite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    companyId: string;
  };
}

@ApiTags('Invite')
@Controller('invite')
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createInvite(@Body() body: CreateInviteDto, @Req() req: RequestWithUser) {
    const companyId = req.user.companyId;
    return this.inviteService.createInvite({ ...body, companyId });
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
