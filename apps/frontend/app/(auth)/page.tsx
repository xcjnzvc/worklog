// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState } from "react";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import Link from "next/link";
// import Title from "./signup/_components/Title";
// import { loginSchema, LoginForm } from "@/types/auth";
// import { useAuthStore } from "@/store/useAuthStore";
// import { useRouter } from "next/navigation";
// import { AxiosError } from "axios";

// export default function Home() {
//   const router = useRouter();
//   const { login } = useAuthStore();
//   const [saveEmail, setSaveEmail] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     watch,
//     setValue,
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     mode: "onTouched",
//   });

//   // 페이지 로드 시 저장된 이메일 불러오기
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("savedEmail");
//     if (savedEmail) {
//       setValue("email", savedEmail);
//       setSaveEmail(true);
//     }
//   }, [setValue]);

//   const onSubmit = async (data: LoginForm) => {
//     try {
//       await login(data);

//       // 로그인 성공 후 체크박스 상태에 따라 저장/삭제
//       if (saveEmail) {
//         localStorage.setItem("savedEmail", data.email); // ✅ 이 줄이 없었음
//       } else {
//         localStorage.removeItem("savedEmail");
//       }

//       router.push("/main");
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         const message =
//           error.response?.data?.message || "로그인에 실패했습니다.";
//         alert(message);
//       } else {
//         console.error("알 수 없는 에러:", error);
//         alert("알 수 없는 오류가 발생했습니다.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center">
//         <Title />
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex flex-col gap-[24px] w-full"
//         >
//           <Input
//             type="email"
//             label="이메일"
//             error={errors.email?.message}
//             success={!errors.email && watch("email")?.length > 0}
//             {...register("email")}
//           />
//           <Input
//             type="password"
//             label="비밀번호"
//             error={errors.password?.message}
//             success={!errors.password && watch("password")?.length > 0}
//             {...register("password")}
//           />

//           {/* 이메일 저장 체크박스 */}
//           <label className="flex items-center gap-[8px] cursor-pointer">
//             <input
//               type="checkbox"
//               checked={saveEmail}
//               onChange={(e) => setSaveEmail(e.target.checked)}
//               className="w-[18px] h-[18px] accent-[#0029C0] cursor-pointer"
//             />
//             <span className="text-[14px] text-[#666]">이메일 저장</span>
//           </label>

//           <div className="flex flex-col gap-[20px]">
//             <Button type="submit" text="로그인" disabled={!isValid} />
//             <div className="w-full text-[16px] flex gap-[16px] items-center justify-center">
//               <span className="text-[#999]">
//                 아직 WorkLog 회원이 아니신가요?
//               </span>
//               <Link href="/signup" className="text-[#0029C0] font-bold">
//                 회원가입
//               </Link>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

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
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

type ServerStatus = "checking" | "ok" | "fail";

export default function Home() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [saveEmail, setSaveEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");

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

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setSaveEmail(true);
    }
  }, [setValue]);

  // 페이지 마운트 시 서버 상태 자동 체크
  useEffect(() => {
    pingServer();
  }, []);

  const pingServer = async () => {
    setServerStatus("checking");
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        timeout: 15000,
      });
      setServerStatus("ok");
    } catch {
      setServerStatus("fail");
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      if (saveEmail) {
        localStorage.setItem("savedEmail", data.email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      router.push("/main");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "로그인에 실패했습니다.";
        alert(message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 서버 상태별 배너 내용
  const serverBanner = {
    checking: {
      dot: "bg-amber-400 animate-pulse",
      text: "서버 연결 확인 중... 잠시만 기다려주세요",
      showRetry: false,
    },
    ok: {
      dot: "bg-green-500",
      text: "서버가 준비됐어요. 로그인해주세요",
      showRetry: false,
    },
    fail: {
      dot: "bg-red-500",
      text: "서버 연결에 실패했어요. 잠시 후 다시 시도해주세요",
      showRetry: true,
    },
  }[serverStatus];

  // password input의 {...register("password")} 와 type 충돌 방지를 위해 분리
  const passwordRegister = register("password");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center">
        <Title />

        {/* 서버 상태 배너 */}
        <div className="w-full flex items-center gap-[12px] px-[16px] py-[14px] rounded-[8px] border border-[#DDDDDD]">
          <div
            className={`w-[10px] h-[10px] rounded-full flex-shrink-0 ${serverBanner.dot}`}
          />
          <p className="flex-1 text-[14px] text-[#666]">{serverBanner.text}</p>
          {serverBanner.showRetry && (
            <button
              type="button"
              onClick={pingServer}
              className="text-[13px] text-[#0029C0] border border-[#0029C0] rounded-[6px] px-[10px] py-[5px] whitespace-nowrap hover:bg-[#F6FAFF]"
            >
              재요청
            </button>
          )}
        </div>

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
            {/* 서버 안 켜지면 로그인 버튼 비활성화 */}
            <Button
              type="submit"
              text="로그인"
              disabled={!isValid || serverStatus !== "ok"}
            />
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
