"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function Main() {
  const { user, isLoggedIn } = useUserStore();
  const router = useRouter();

  if (!isLoggedIn || !user) {
    return <div className="p-20">로그인이 필요한 서비스입니다.</div>;
  }

  return (
    <div className="relative min-h-screen">
      <div className="mt-[80px] ml-[60px]">
        <div className="flex gap-[12px] items-end">
          <h2 className="font-bold text-[28px] text-[#222]">
            <span className="text-[#0029C0]">{user.companyName}</span>의{" "}
            {user.name}님
          </h2>
          <span className="text-[20px] text-[#666]">안녕하세요!</span>
        </div>

        {/* OWNER에게만 보이는 초대 가이드 카드 */}
        {user.role === "OWNER" && (
          <div className="mt-10 p-6 border border-[#EEEEEE] rounded-xl bg-[#F5F7FF] max-w-[600px]">
            <h3 className="font-bold text-[#0023A1] text-lg">
              관리자 초대하기
            </h3>
            <p className="text-[#666] mt-1">
              팀원을 초대하여 근태 관리를 시작하세요.
            </p>
            <button
              onClick={() => router.push("/invite")}
              className="mt-4 bg-[#0029C0] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#0023A1] transition-colors"
            >
              초대 링크 생성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
