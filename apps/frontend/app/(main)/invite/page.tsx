"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Title from "../../(auth)/signup/_components/Title";
import Button from "@/components/Button";
import { inviteSchema, InviteForm } from "@/types/auth";
import { useUserStore } from "@/store/useUserStore";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { inviteAPI } from "@/api/auth";
import { useState } from "react";
import InviteLinkCard from "./_components/InviteLinkCard";

interface InviteResponse {
  inviteLink: string;
  token: string;
  expiresAt: string;
}

export default function Invite() {
  const { user } = useUserStore();
  const [inviteResult, setInviteResult] = useState<InviteResponse | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    mode: "onTouched",
  });

  const emailValue = watch("email");
  const roleValue = watch("role");

  const onSubmit = async (data: InviteForm) => {
    console.log("data", data);
    try {
      const response = await toast.promise(inviteAPI(data), {
        loading: "초대중 입니다...",
        success: "초대가 완료되었습니다!",
        error: (err) => {
          if (err instanceof AxiosError) {
            // 에러 발생 시 백엔드 응답 확인은 여기서!
            console.log("백엔드 에러 응답:", err.response?.data);
            return err.response?.data?.message || "초대에 실패했습니다.";
          }
          return "알 수 없는 오류가 발생했습니다.";
        },
      });
      console.log("백엔드 성공 응답 데이터:", response);
      setInviteResult(response);
    } catch (error) {
      console.error("Invited Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {inviteResult ? (
        <InviteLinkCard
          inviteLink={inviteResult.inviteLink}
          expiresAt={inviteResult.expiresAt}
          onReset={() => setInviteResult(null)} // 초기화하여 다시 폼으로 돌아감
        />
      ) : (
        <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center">
          <Title describe="직원을 초대하는 페이지입니다." />
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

            {/* 직위 선택 */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[16px] text-[#666]">직위</label>
              <div className="flex gap-[12px]">
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "ADMIN", { shouldValidate: true })
                  }
                  className={`flex-1 h-[48px] rounded-[8px] border text-[16px] font-medium transition-colors
                  ${
                    roleValue === "ADMIN"
                      ? "bg-[#F6FAFF] text-[#0029C0] border-[#0029C0]"
                      : "bg-white text-[#333] border-[#DDDDDD]"
                  }`}
                >
                  관리자
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "USER", { shouldValidate: true })
                  }
                  className={`flex-1 h-[48px] rounded-[8px] border text-[16px] font-medium transition-colors
                  ${
                    roleValue === "USER"
                      ? "bg-[#F6FAFF] text-[#0029C0] border-[#0029C0]"
                      : "bg-white text-[#333] border-[#DDDDDD]"
                  }`}
                >
                  직원
                </button>
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <Button text="초대하기" disabled={!isValid} type="submit" />
          </form>
        </div>
      )}
    </div>
  );
}
