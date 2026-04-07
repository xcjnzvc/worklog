import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface'; // 임포트
import { GetUser } from 'common/decorators/get-user.decorator';
// import { use } from 'passport';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getTodayAttendance(@GetUser('userId') userId: string) {
    console.log('getTodayAttendance', userId);
    return this.attendanceService.getTodayAttendance(userId);
  }

  @Post()
  recordAttendance(
    @GetUser() user: UserPayload, // 유저 객체 전체를 가져옴 (타입 안전!)
    @Body() dto: RecordAttendanceDto,
  ) {
    console.log('출퇴근 post', dto);
    return this.attendanceService.recordAttendance(
      user.userId,
      user.companyId,
      dto.action,
    );
  }
}
