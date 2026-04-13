/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { AttendanceRepository } from './attendance.repository';
import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  AttendanceStatus,
  WorkType,
  WorkLog,
  WorkPolicy,
  LeaveType,
  RequestStatus,
} from '@prisma/client';

// ─────────────────────────────────────────────────────
// 테스트 픽스처 팩토리
// ─────────────────────────────────────────────────────

const makePolicy = (overrides: Partial<WorkPolicy> = {}): WorkPolicy => ({
  id: 'policy-1',
  companyId: 'company-1',
  name: '기본 정책',
  workType: WorkType.FIXED,
  workStartTime: '09:00',
  workEndTime: '18:00',
  workMinutes: 480,
  coreTimeStart: null,
  coreTimeEnd: null,
  lunchMinutes: 60,
  lunchStartTime: '12:00',
  lunchEndTime: '13:00',
  weeklyMustMinutes: 2400,
  timezone: 'Asia/Seoul',
  createdAt: new Date(),
  ...overrides,
});

const makeLog = (overrides: Partial<WorkLog> = {}): WorkLog => ({
  id: 'log-1',
  userId: 'user-1',
  companyId: 'company-1',
  clockIn: new Date('2026-04-09T00:00:00Z'),
  clockOut: null,
  workMinutes: null,
  status: AttendanceStatus.NORMAL,
  isOvertime: false,
  date: new Date('2026-04-09'),
  createdAt: new Date(),
  ...overrides,
});

const makeLeaveRequest = (type: LeaveType) => ({
  id: 'leave-1',
  userId: 'user-1',
  companyId: 'company-1',
  type,
  startDate: new Date('2026-04-09'),
  endDate: new Date('2026-04-09'),
  reason: '테스트',
  status: RequestStatus.APPROVED,
  createdAt: new Date(),
});

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repo: jest.Mocked<AttendanceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: AttendanceRepository,
          useValue: {
            findUserWithPolicy: jest.fn(),
            findUserWithPolicyAndTodayLeave: jest.fn(),
            findOpenLog: jest.fn(),
            findForgottenLog: jest.fn(),
            findTodayActiveLog: jest.fn(),
            findTodayFinishedLog: jest.fn(),
            findWeeklyLogs: jest.fn(),
            createClockIn: jest.fn(),
            updateClockOut: jest.fn(),
            markMissingOut: jest.fn(),
            createAbsent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    repo = module.get(AttendanceRepository);

    jest.useFakeTimers().setSystemTime(new Date('2026-04-09T06:00:00Z'));
  });

  afterAll(() => jest.useRealTimers());

  describe('익일 퇴근 대응', () => {
    it('전날 미퇴근 로그가 있으면 해당 로그로 퇴근 처리한다', async () => {
      const yesterdayLog = makeLog({
        id: 'yesterday-log',
        clockIn: new Date('2026-04-08T14:00:00Z'),
      });

      const logWithUser = {
        ...yesterdayLog,
        user: { workPolicy: makePolicy(), leaveRequests: [] },
      };

      repo.findOpenLog.mockResolvedValue(logWithUser as any);
      repo.updateClockOut.mockResolvedValue({} as any);

      await service.clockOut('user-1');

      expect(repo.updateClockOut).toHaveBeenCalledWith(
        'yesterday-log',
        expect.objectContaining({ clockOut: expect.any(Date) }),
      );
    });
  });

  describe('반차 연동', () => {
    it('오전 반차 출근 시 NORMAL로 기록된다', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-04-09T01:00:00Z'));

      repo.findUserWithPolicyAndTodayLeave.mockResolvedValue({
        id: 'user-1',
        companyId: 'company-1',
        workPolicy: makePolicy({ workStartTime: '09:00' }),
        leaveRequests: [makeLeaveRequest(LeaveType.HALF_AM)],
      } as any);
      repo.findForgottenLog.mockResolvedValue(null);
      repo.findTodayActiveLog.mockResolvedValue(null);
      repo.createClockIn.mockResolvedValue(makeLog() as any);

      await service.clockIn('user-1');

      expect(repo.createClockIn).toHaveBeenCalledWith(
        expect.objectContaining({ status: AttendanceStatus.NORMAL }),
      );
    });

    it('오전 반차 퇴근 시 4시간 미만이면 EARLY_LEAVE로 처리된다', async () => {
      const clockIn = new Date('2026-04-09T03:00:00Z');
      const logWithUser = {
        ...makeLog({ clockIn }),
        user: {
          workPolicy: makePolicy(),
          leaveRequests: [makeLeaveRequest(LeaveType.HALF_AM)],
        },
      };

      repo.findOpenLog.mockResolvedValue(logWithUser as any);
      repo.updateClockOut.mockResolvedValue({} as any);

      await service.clockOut('user-1');

      expect(repo.updateClockOut).toHaveBeenCalledWith(
        'log-1',
        expect.objectContaining({ status: AttendanceStatus.EARLY_LEAVE }),
      );
    });
  });

  describe('퇴근 상태 결정 (FIXED)', () => {
    it('지각 + 조기 퇴근 시 LATE_EARLY로 처리된다', async () => {
      const logWithUser = {
        ...makeLog({ status: AttendanceStatus.LATE }),
        user: {
          workPolicy: makePolicy({ workEndTime: '18:00' }),
          leaveRequests: [],
        },
      };

      repo.findOpenLog.mockResolvedValue(logWithUser as any);
      repo.updateClockOut.mockResolvedValue({} as any);

      await service.clockOut('user-1');

      expect(repo.updateClockOut).toHaveBeenCalledWith(
        'log-1',
        expect.objectContaining({ status: AttendanceStatus.LATE_EARLY }),
      );
    });
  });

  describe('예외 케이스', () => {
    it('출근 기록 없이 퇴근 시도 시 BadRequestException 발생', async () => {
      repo.findOpenLog.mockResolvedValue(null);
      // ✅ 화살표 함수로 감싸서 unbound-method 에러 방지
      await expect(() => service.clockOut('user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('이미 출근 중인 상태에서 출근 시도 시 ConflictException 발생', async () => {
      repo.findUserWithPolicyAndTodayLeave.mockResolvedValue({
        id: 'user-1',
        workPolicy: makePolicy(),
        leaveRequests: [],
      } as any);
      repo.findTodayActiveLog.mockResolvedValue(makeLog() as any);

      await expect(() => service.clockIn('user-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('이전 미퇴근 로그가 있으면 MISSING_OUT 처리 후 새로 출근한다', async () => {
      const forgottenLog = makeLog({
        id: 'forgotten-log',
        date: new Date('2026-04-08'),
      });

      repo.findUserWithPolicyAndTodayLeave.mockResolvedValue({
        id: 'user-1',
        workPolicy: makePolicy(),
        leaveRequests: [],
      } as any);
      repo.findForgottenLog.mockResolvedValue(forgottenLog as any);
      repo.markMissingOut.mockResolvedValue({} as any);
      repo.findTodayActiveLog.mockResolvedValue(null);
      repo.createClockIn.mockResolvedValue(makeLog() as any);

      await service.clockIn('user-1');

      expect(repo.markMissingOut).toHaveBeenCalled();
      expect(repo.createClockIn).toHaveBeenCalled();
    });
  });
});
