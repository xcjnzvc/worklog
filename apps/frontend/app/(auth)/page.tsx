"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Link from "next/link";
import Title from "./signup/_components/Title";
import { loginSchema, LoginForm } from "@/types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function Home() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [saveEmail, setSaveEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // 페이지 로드 시 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setSaveEmail(true);
    }
  }, [setValue]);

  // const onSubmit = async (data: LoginForm) => {
  //   await login(data);
  //   router.push("/main");
  // };

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      router.push("/main");
    } catch (error) {
      // 2. error가 AxiosError인지 확인(Type Guard)합니다.
      if (error instanceof AxiosError) {
        // 이제 error.response가 자동완성되고 안전하게 접근 가능합니다!
        const message =
          error.response?.data?.message || "로그인에 실패했습니다.";
        alert(message);
      } else {
        // axios 에러가 아닌 일반 에러일 경우
        console.error("알 수 없는 에러:", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center">
        <Title />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[24px] w-full"
        >
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

          {/* 이메일 저장 체크박스 */}
          <label className="flex items-center gap-[8px] cursor-pointer">
            <input
              type="checkbox"
              checked={saveEmail}
              onChange={(e) => setSaveEmail(e.target.checked)}
              className="w-[18px] h-[18px] accent-[#0029C0] cursor-pointer"
            />
            <span className="text-[14px] text-[#666]">이메일 저장</span>
          </label>

          <div className="flex flex-col gap-[20px]">
            <Button type="submit" text="로그인" disabled={!isValid} />
            <div className="w-full text-[16px] flex gap-[16px] items-center justify-center">
              <span className="text-[#999]">
                아직 WorkLog 회원이 아니신가요?
              </span>
              <Link href="/signup" className="text-[#0029C0] font-bold">
                회원가입
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
