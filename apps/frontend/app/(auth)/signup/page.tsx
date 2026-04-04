"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Title from "./_components/Title";
import {
  signupSchema,
  SignupForm,
  invitedSignupSchema,
  InvitedSignupForm,
} from "@/types/auth";
import { inviteRegisterAPI, signupAPI } from "@/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Resolver } from "react-hook-form";

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isInvited = !!token;

  const schema = isInvited ? invitedSignupSchema : signupSchema;

  // useForm 타입을 SignupForm | InvitedSignupForm 대신 any로 처리
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupForm & InvitedSignupForm>({
    // 합집합으로 처리
    resolver: zodResolver(schema) as unknown as Resolver<
      SignupForm & InvitedSignupForm
    >,
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupForm & InvitedSignupForm) => {
    try {
      if (isInvited) {
        await toast.promise(inviteRegisterAPI(token!, data), {
          loading: "회원가입 정보를 전송 중입니다...",
          success: "회원가입이 완료되었습니다! 로그인 해주세요.",
          error: (err) => {
            if (err instanceof AxiosError) {
              return err.response?.data?.message || "회원가입에 실패했습니다.";
            }
            return "알 수 없는 오류가 발생했습니다.";
          },
        });
      } else {
        await toast.promise(signupAPI(data), {
          loading: "회원가입 정보를 전송 중입니다...",
          success: "회원가입이 완료되었습니다! 로그인 해주세요.",
          error: (err) => {
            if (err instanceof AxiosError) {
              return err.response?.data?.message || "회원가입에 실패했습니다.";
            }
            return "알 수 없는 오류가 발생했습니다.";
          },
        });
      }
      router.push("/");
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-[40px]">
      <Title
        describe={
          isInvited
            ? "초대받은 회원가입 페이지입니다."
            : "최고 관리자의 회원가입 페이지입니다."
        }
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-[40px] w-full max-w-[960px]"
      >
        <div className="flex items-start gap-[60px] w-full">
          <div className="flex flex-col gap-[24px] max-w-[450px] w-full">
            <Input
              type="email"
              label="이메일"
              error={errors.email?.message}
              success={!errors.email && watch("email")?.length > 0}
              {...register("email")}
            />
            <Input
              type="password"
              label="비밀번호"
              error={errors.password?.message}
              success={!errors.password && watch("password")?.length > 0}
              {...register("password")}
            />
            <Input
              type="password"
              label="비밀번호 확인"
              error={errors.passwordConfirm?.message}
              success={
                !errors.passwordConfirm && watch("passwordConfirm")?.length > 0
              }
              {...register("passwordConfirm")}
            />
            <Input
              type="text"
              label="이름"
              error={errors.name?.message}
              success={!errors.name && watch("name")?.length > 0}
              {...register("name")}
            />
            <Input
              type="text"
              label="연락처"
              placeholder="숫자만 입력 (10~11자리)"
              error={errors.phone?.message}
              success={!errors.phone && watch("phone")?.length > 0}
              {...register("phone")}
            />
          </div>

          {/* 구분선 + 회사명: OWNER일 때만 표시 */}
          {!isInvited && (
            <>
              <div className="w-[1px] bg-[#DDDDDD] self-stretch" />
              <div className="max-w-[450px] w-full">
                <Input
                  type="text"
                  label="회사명"
                  error={errors.companyName?.message}
                  success={
                    !errors.companyName && watch("companyName")?.length > 0
                  }
                  {...register("companyName")}
                />
              </div>
            </>
          )}
        </div>

        <Button type="submit" width={450} text="가입하기" disabled={!isValid} />
      </form>
    </div>
  );
}
