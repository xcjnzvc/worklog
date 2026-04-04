"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Title from "../../(auth)/signup/_components/Title";
import Button from "@/components/Button";
import { inviteSchema, InviteForm } from "@/types/auth";
import { useUserStore } from "@/store/useUserStore";

export default function Invite() {
  const { user } = useUserStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    mode: "onBlur",
  });

  const emailValue = watch("email");
  const roleValue = watch("role");

  const onSubmit = (data: InviteForm) => {
    console.log("data", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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
                onClick={() => setValue("role", "ADMIN")}
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
                onClick={() => setValue("role", "USER")}
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

          <Button text="초대하기" />
        </form>
      </div>
    </div>
  );
}
