import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserPayload } from './interfaces/user-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('company')
  createCompany(@Body() body: CreateCompanyDto) {
    return this.authService.createCompany(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    console.log('login_controller', body);
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: { user: UserPayload }): UserPayload {
    return req.user;
  }
}
