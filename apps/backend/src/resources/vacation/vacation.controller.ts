import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VacationService } from './vacation.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacationService.findOne(id);
  }
}
