import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // 👈 추가
import { UserService } from './user.service';
import { UserPayload } from 'src/core/auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('approvers')
  @UseGuards(JwtAuthGuard)
  async getApprovers(@Request() req: { user: UserPayload }) {
    return this.userService.getApprovers(req.user);
  }
}
