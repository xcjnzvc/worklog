"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { inviteSchema, InviteForm } from "@/types/auth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useState } from "react";
import { X } from "lucide-react";
import InviteLinkCard from "@/app/(main)/invite/_components/InviteLinkCard";
import { inviteAPI } from "@/api/invite";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 초대 성공 후 메인 대시보드 데이터 리프레시용 콜백 (필요시 사용)
}

interface InviteResponse {
  inviteLink: string;
  token: string;
  expiresAt: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteModalProps) {
  const [inviteResult, setInviteResult] = useState<InviteResponse | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    mode: "onTouched",
  });

  const emailValue = watch("email");
  const roleValue = watch("role");

  if (!isOpen) return null;

  // 💡 닫기 및 초기화를 담당하는 핸들러
  const handleClose = () => {
    setInviteResult(null);
    reset(); // 다음 번에 열릴 때를 위해 입력 폼 리셋
    onClose();
  };

  const onSubmit = async (data: InviteForm) => {
    try {
      const response = await toast.promise(inviteAPI(data), {
        loading: "초대중 입니다...",
        success: "초대가 완료되었습니다!",
        error: (err) => {
          if (err instanceof AxiosError) {
            return err.response?.data?.message || "초대에 실패했습니다.";
          }
          return "알 수 없는 오류가 발생했습니다.";
        },
      });
      setInviteResult(response);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Invited Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-[500px] p-8 relative shadow-2xl border border-gray-100">
        {/* 상단 우측 X 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {inviteResult ? (
          <InviteLinkCard
            inviteLink={inviteResult.inviteLink}
            expiresAt={inviteResult.expiresAt}
            onReset={handleClose}
          />
        ) : (
          <div className="w-full flex gap-[32px] flex-col items-center pt-4">
            <div className="text-center">
              <h3 className="text-[22px] font-bold text-gray-950 mb-1">
                직원 초대하기
              </h3>
              <p className="text-sm text-gray-500">
                함께할 직원의 이메일과 직위를 지정해 주세요.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[24px] w-full"
            >
              <Input
                type="email"
                label="이메일"
                error={errors.email?.message}
                success={!errors.email && emailValue?.length > 0}
                {...register("email")}
              />

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-gray-600">
                  직위
                </label>
                <div className="flex gap-[12px]">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("role", "ADMIN", { shouldValidate: true })
                    }
                    className={`flex-1 h-[48px] rounded-[12px] border text-[15px] font-semibold transition-all
                    ${
                      roleValue === "ADMIN"
                        ? "bg-[#F6FAFF] text-[#0029C0] border-[#0029C0] shadow-[0_0_0_1px_#0029C0]"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    관리자
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setValue("role", "USER", { shouldValidate: true })
                    }
                    className={`flex-1 h-[48px] rounded-[12px] border text-[15px] font-semibold transition-all
                    ${
                      roleValue === "USER"
                        ? "bg-[#F6FAFF] text-[#0029C0] border-[#0029C0] shadow-[0_0_0_1px_#0029C0]"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    직원
                  </button>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-500 font-medium mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <Button text="초대 링크 발행" disabled={!isValid} type="submit" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
