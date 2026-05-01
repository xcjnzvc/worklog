"use client";

import {
  Download,
  ChevronLeft,
  ShieldCheck,
  Settings,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Title from "../(auth)/signup/_components/Title";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* 상단 네비게이션 */}
      <div className="w-full max-w-[450px] pt-4">
        <Link
          href="/"
          className="flex items-center text-[#999] hover:text-[#666] transition-colors group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[14px]">로그인 화면으로 돌아가기</span>
        </Link>
      </div>

      <div className="max-w-[450px] w-full mx-auto flex flex-col items-center py-12">
        <Title />

        <div className="mt-10 text-center">
          <h1 className="text-[24px] font-bold text-[#333] tracking-tight">
            WorkLog 앱 설치 가이드
          </h1>
          <p className="text-[#666] mt-3 text-[15px] leading-relaxed">
            안드로이드 전용 앱으로
            <br />
            더욱 쾌적한 업무 기록을 시작해보세요.
          </p>
        </div>

        {/* 실제 파일 다운로드 버튼 */}
        <a
          href="https://drive.google.com/file/d/18QnPkrE_sC31uM8ups-lQNUdzNa3xNqS/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-10 bg-[#0029C0] text-white py-4 rounded-[16px] flex items-center justify-center gap-3 font-bold text-[16px] shadow-[0_8px_25px_rgba(0,41,192,0.3)] hover:bg-[#0022a0] active:scale-[0.98] transition-all"
        >
          <Download size={22} />
          APK 파일 다운로드 하기
        </a>

        {/* 상세 가이드 섹션 */}
        <div className="w-full mt-14 space-y-10">
          <h2 className="text-[18px] font-bold text-[#333] border-b border-gray-100 pb-3">
            설치 방법
          </h2>

          <div className="flex gap-5">
            <div className="w-12 h-12 bg-[#F6FAFF] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <ExternalLink size={20} className="text-[#0029C0]" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-[#333]">
                01. 구글 드라이브 이동 및 다운로드
              </p>
              <p className="text-[13px] text-[#888] mt-1.5 leading-relaxed">
                위 버튼을 누르면 구글 드라이브 화면으로 이동합니다. 화면 중앙의{" "}
                <strong className="text-[#333]">[다운로드]</strong> 버튼을 다시
                한 번 눌러주세요.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 h-12 bg-[#F6FAFF] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Download size={20} className="text-[#0029C0]" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-[#333]">
                02. 보안 경고 무시 및 저장
              </p>
              <p className="text-[13px] text-[#888] mt-1.5 leading-relaxed">
                유해한 파일일 수 있음 문구가 뜨더라도{" "}
                <strong className="text-[#333]">[무시하고 다운로드]</strong>를
                선택하여 파일을 기기에 저장해 주세요.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 h-12 bg-[#F6FAFF] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Settings size={20} className="text-[#0029C0]" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-[#333]">
                03. 출처를 알 수 없는 앱 허용
              </p>
              <p className="text-[13px] text-[#888] mt-1.5 leading-relaxed">
                다운로드된 APK를 실행했을 때 설정 팝업이 뜨면{" "}
                <strong className="text-[#333]">이 출처의 앱 허용</strong>{" "}
                옵션을 활성화한 뒤 설치를 진행해 주세요.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 h-12 bg-[#F6FAFF] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={20} className="text-[#0029C0]" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-[#333]">
                04. 설치 완료 및 실행
              </p>
              <p className="text-[13px] text-[#888] mt-1.5 leading-relaxed">
                설치가 완료되면 앱을 실행하여 기존의 WorkLog 계정으로 로그인해
                주세요.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 px-6 py-4 bg-gray-50 rounded-xl w-full">
          <p className="text-[12px] text-[#999] text-center leading-5">
            도움이 필요하신가요? <br />
            설치가 되지 않을 경우 사내 IT 팀 또는 관리자에게 문의바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
