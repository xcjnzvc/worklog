// InviteLinkCard.tsx (또는 Invite.tsx 하단에 추가)
"use client";

import toast from "react-hot-toast";

interface InviteLinkCardProps {
  inviteLink: string;
  expiresAt: string;
  onReset: () => void;
}

export default function InviteLinkCard({
  inviteLink,
  expiresAt,
  onReset,
}: InviteLinkCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("링크가 복사되었습니다!");
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };

  // 날짜 보기 좋게 포맷팅
  const date = new Date(expiresAt);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="max-w-[450px] w-full bg-white border border-[#EEEEEE] rounded-[20px] p-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex flex-col items-center">
      <div className="w-[64px] h-[64px] bg-[#F5F7FF] rounded-full flex items-center justify-center mb-[24px]">
        <span className="text-[32px]">✉️</span>
      </div>

      <h2 className="text-[24px] font-bold text-[#222] mb-[12px]">
        초대 링크가 생성되었습니다
      </h2>
      <p className="text-[#666] text-[16px] text-center mb-[32px] leading-relaxed">
        아래의 초대 링크를 복사하여
        <br />
        팀원에게 전달해 주세요.
      </p>

      <div className="w-full bg-[#F8F9FA] border border-[#EEEEEE] rounded-[12px] p-[16px] mb-[12px] flex flex-col gap-[8px]">
        <span className="text-[12px] font-bold text-[#0029C0] uppercase tracking-wider">
          Invite Link
        </span>
        <div className="flex items-center gap-[12px]">
          <input
            readOnly
            value={inviteLink}
            className="flex-1 bg-transparent text-[14px] text-[#333] outline-none truncate font-medium"
          />
          <button
            onClick={handleCopy}
            className="text-[13px] font-bold text-[#0029C0] hover:text-[#0023A1] transition-colors shrink-0"
          >
            복사하기
          </button>
        </div>
      </div>

      <p className="text-[13px] text-[#999] mb-[40px]">
        해당 링크는{" "}
        <span className="text-[#F44336] font-medium">{formattedDate}</span>까지
        유효합니다.
      </p>

      <button
        onClick={onReset}
        className="w-full h-[56px] bg-[#0029C0] text-white rounded-[12px] font-bold text-[16px] hover:bg-[#0023A1] transition-all active:scale-[0.98]"
      >
        확인
      </button>
    </div>
  );
}
