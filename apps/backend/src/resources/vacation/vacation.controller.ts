import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { VacationService } from './vacation.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { RequestStatus } from '@prisma/client';
import { RejectVacationDto } from './dto/reject-vacation.dto';

@ApiTags('Vacation')
@ApiBearerAuth('access-token')
@Controller('vacation')
@UseGuards(JwtAuthGuard)
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Post()
  async create(
    @GetUser('userId') userId: string,
    @Body() createVacationDto: CreateVacationDto,
  ) {
    return this.vacationService.create(userId, createVacationDto);
  }

  @Get()
  async findAll(
    @GetUser('userId') userId: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    return this.vacationService.findAll(userId, order, p, l);
  }

  // 승인자용 목록 조회
  @Get('approvals')
  findAllForApprover(
    @GetUser('userId') userId: string,
    @Query('status') status?: RequestStatus,
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.vacationService.findAllForApprover(
      userId,
      status,
      order,
      +page,
      +limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacationService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.vacationService.approveVacation(id, userId);
  }

  // 반려 (💡 RejectVacationDto 추가 반영)
  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() rejectVacationDto: RejectVacationDto,
  ) {
    return this.vacationService.rejectVacation(id, userId, rejectVacationDto);
  }
}
