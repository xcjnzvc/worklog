"use client";

import { Suspense, useEffect } from "react";
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
import { inviteRegisterAPI, signupAPI, verifyInviteAPI } from "@/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Resolver } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// 1. 기존 로직을 담당하는 내부 컴포넌트 (useSearchParams 사용 부분 포함)
function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isInvited = !!token;

  // 1. 초대 토큰 검증 API 호출
  const {
    isLoading,
    isError,
    data: inviteData,
  } = useQuery({
    queryKey: ["verifyInvite", token],
    queryFn: () => verifyInviteAPI(token!),
    enabled: isInvited,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // 2. 검증 실패 시 리다이렉트 처리
  useEffect(() => {
    if (isInvited && isError) {
      toast.error(
        "유효하지 않거나 만료된 초대 링크입니다. 정보를 다시 확인해주세요.",
      );
      router.replace("/");
    }
  }, [isInvited, isError, router]);

  const schema = isInvited ? invitedSignupSchema : signupSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<SignupForm & InvitedSignupForm>({
    resolver: zodResolver(schema) as unknown as Resolver<
      SignupForm & InvitedSignupForm
    >,
    mode: "onTouched",
  });

  // 3. 백엔드 데이터 자동 입력
  useEffect(() => {
    if (inviteData?.email) {
      setValue("email", inviteData.email, { shouldValidate: true });
    }
  }, [inviteData, setValue]);

  const onSubmit = async (data: SignupForm & InvitedSignupForm) => {
    try {
      if (isInvited) {
        await toast.promise(inviteRegisterAPI(token!, data), {
          loading: "회원가입 정보를 전송 중입니다...",
          success: "회원가입이 완료되었습니다! 로그인 해주세요.",
          error: (err) =>
            err instanceof AxiosError
              ? err.response?.data?.message
              : "가입 실패",
        });
      } else {
        await toast.promise(signupAPI(data), {
          loading: "회원가입 정보를 전송 중입니다...",
          success: "회원가입이 완료되었습니다! 로그인 해주세요.",
          error: (err) =>
            err instanceof AxiosError
              ? err.response?.data?.message
              : "가입 실패",
        });
      }
      router.push("/");
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  if (isInvited && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-[#666]">
        초대 정보를 확인하고 있습니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-[40px] py-20">
      <Title
        describe={
          isInvited
            ? "초대받은 회원가입 페이지입니다."
            : "최고 관리자의 회원가입 페이지입니다."
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col items-center gap-[40px] w-full transition-all ${
          isInvited ? "max-w-[450px]" : "max-w-[960px]"
        }`}
      >
        <div
          className={`flex w-full ${isInvited ? "flex-col" : "items-start gap-[60px]"}`}
        >
          <div className="flex flex-col gap-[24px] w-full">
            <Input
              type="email"
              label="이메일"
              error={errors.email?.message}
              success={!errors.email && watch("email")?.length > 0}
              {...register("email")}
              readOnly={isInvited && !!inviteData?.email}
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

        <div className="w-full flex justify-center">
          <Button
            type="submit"
            width={450}
            text="가입하기"
            disabled={!isValid}
          />
        </div>
      </form>
    </div>
  );
}

// 2. 최종 export: Suspense로 감싸서 배포 에러 해결
export default function Signup() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-medium text-[#666]">
          페이지를 불러오고 있습니다...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
