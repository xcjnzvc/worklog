import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceAction } from './dto/record-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // 오늘 날짜 00:00:00 기준으로 자르는 헬퍼
  private getTodayStart(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  // GET /attendance - 오늘 상태 조회
  async getTodayAttendance(userId: string) {
    const todayStart = this.getTodayStart();

    const workLog = await this.prisma.workLog.findFirst({
      where: {
        userId,
        date: todayStart,
      },
    });

    // WorkLog 없으면 출근 전
    if (!workLog) {
      return { status: 'BEFORE', startTime: null, endTime: null };
    }

    // WorkLog 있고 clockOut 없으면 근무 중
    if (!workLog.clockOut) {
      return {
        status: 'WORKING',
        startTime: this.formatTime(workLog.clockIn),
        endTime: null,
      };
    }

    // 둘 다 있으면 퇴근 완료
    return {
      status: 'AFTER',
      startTime: this.formatTime(workLog.clockIn),
      endTime: this.formatTime(workLog.clockOut),
    };
  }

  // POST /attendance - 출퇴근 기록
  async recordAttendance(
    userId: string,
    companyId: string,
    action: AttendanceAction,
  ) {
    const todayStart = this.getTodayStart();
    const now = new Date();

    console.log('userId', userId);
    const workLog = await this.prisma.workLog.findFirst({
      where: { userId, date: todayStart },
    });

    if (action === AttendanceAction.CLOCK_IN) {
      // 이미 출근한 경우 막기
      if (workLog) {
        throw new BadRequestException('이미 출근 처리가 되어 있습니다.');
      }

      const newLog = await this.prisma.workLog.create({
        data: {
          userId,
          companyId,
          clockIn: now,
          date: todayStart,
        },
      });

      return {
        status: 'WORKING',
        startTime: this.formatTime(newLog.clockIn),
        endTime: null,
      };
    }

    if (action === AttendanceAction.CLOCK_OUT) {
      // 출근 기록 없거나 이미 퇴근한 경우 막기
      if (!workLog) {
        throw new BadRequestException('출근 기록이 없습니다.');
      }
      if (workLog.clockOut) {
        throw new BadRequestException('이미 퇴근 처리가 되어 있습니다.');
      }

      const workMinutes = Math.floor(
        (now.getTime() - workLog.clockIn.getTime()) / 1000 / 60,
      );

      const updated = await this.prisma.workLog.update({
        where: { id: workLog.id },
        data: {
          clockOut: now,
          workMinutes,
        },
      });

      return {
        status: 'AFTER',
        startTime: this.formatTime(updated.clockIn),
        endTime: this.formatTime(updated.clockOut!),
      };
    }
  }

  // DateTime → "HH:MM:SS" 포맷
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
