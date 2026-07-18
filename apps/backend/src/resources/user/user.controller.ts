import {
  Controller,
  Get,
  Request,
  UseGuards,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Get('members')
  @UseGuards(JwtAuthGuard)
  async getMembers(
    @Request() req: { user: UserPayload },
    @Query('page') page: number = 1,
  ) {
    return this.userService.getMembers(req.user, Number(page));
  }

  @Delete('members/:id')
  @UseGuards(JwtAuthGuard)
  async deleteMember(
    @Request() req: { user: UserPayload },
    @Param('id') memberId: string,
  ) {
    return this.userService.deleteMember(req.user, memberId);
  }
}
