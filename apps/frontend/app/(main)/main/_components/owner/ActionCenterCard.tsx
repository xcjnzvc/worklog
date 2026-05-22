"use client";

import {
  FileCheck,
  Umbrella,
  Clock,
  UserPlus,
  ChevronRight,
} from "lucide-react";

interface ActionCenterCardProps {
  holidayCount?: number;
  attendanceCount?: number;
  onHolidayClick: () => void;
  onAttendanceClick: () => void;
  onInviteClick: () => void;
}

export default function ActionCenterCard({
  holidayCount = 0,
  attendanceCount = 0,
  onHolidayClick,
  onAttendanceClick,
  onInviteClick,
}: ActionCenterCardProps) {
  return (
    <div id="action-center">
      <section className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm h-full flex flex-col">
        <div className="flex items-center gap-2.5 mb-5 px-0">
          <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
            <FileCheck size={20} className="text-emerald-600" /> 운영 액션 센터
          </h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/60">
            처리 필요
          </span>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {/* 휴가 결재 요청 */}
          <button
            onClick={onHolidayClick}
            className="flex items-center justify-between p-4.5 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100/60 hover:border-emerald-200 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm">
                <Umbrella size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-base text-gray-900">
                  휴가 결재 요청
                </p>
                <p className="text-emerald-700 text-sm font-bold mt-1">
                  {holidayCount}건 대기 중
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-sm">
                {holidayCount}
              </span>
              <ChevronRight
                size={16}
                className="text-emerald-400 group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </button>

          {/* 근태 정정 요청 */}
          <button
            onClick={onAttendanceClick}
            className="flex items-center justify-between p-4.5 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100/60 hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white rounded-xl text-blue-600 shadow-sm">
                <Clock size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-base text-gray-900">
                  근태 정정 요청
                </p>
                {/* 💡 부모로부터 들어온 실시간 API 수치가 반영됩니다 */}
                <p className="text-blue-700 text-sm font-bold mt-1">
                  {attendanceCount}건 대기 중
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 💡 알림 배지도 실시간 동적 바인딩 완료 */}
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center shadow-sm">
                {attendanceCount}
              </span>
              <ChevronRight
                size={16}
                className="text-blue-400 group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </button>

          {/* 새 팀원 초대 */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={onInviteClick}
              className="w-full flex items-center justify-between p-4.5 bg-[#0029C0] hover:bg-[#0022a0] rounded-2xl transition-all text-white group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <UserPlus size={18} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-base">새 팀원 초대</p>
                  <p className="text-blue-200 text-sm font-medium mt-1">
                    초대코드 발행하기
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-blue-300 group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
