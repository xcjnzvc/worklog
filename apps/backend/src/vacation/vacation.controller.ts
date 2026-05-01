import {
  Controller,
  Get,
  // Post,
  Body,
  // Patch,
  Param,
  // Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VacationService } from './vacation.service';
// import { CreateVacationDto } from './dto/create-vacation.dto';
// import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetUser } from 'common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('vacation')
@UseGuards(AuthGuard('jwt'))
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  // @Post()
  // create(@Body() createVacationDto: CreateVacationDto) {
  //   return this.vacationService.create(createVacationDto);
  // }

  @Get()
  async findAll(
    @GetUser('userId') userId: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // 쿼리가 없으면 대시보드용 기본값(1페이지, 3개) 적용
    const p = page ? parseInt(page) : 1;
    const l = limit ? parseInt(limit) : 3;

    return this.vacationService.findAll(userId, order, p, l);
  }
  // src/vacation/vacation.controller.ts
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacationService.findOne(id); // +id가 아니라 id 그대로 전달!
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateVacationDto: UpdateVacationDto,
  // ) {
  //   return this.vacationService.update(+id, updateVacationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vacationService.remove(+id);
  // }
}
