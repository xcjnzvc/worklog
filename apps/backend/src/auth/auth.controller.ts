import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { LoginDto } from './dto/login.dto';

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
}
