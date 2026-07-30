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
// import { ChevronRight, Smartphone } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import FloatingMenu from "@/components/FloatingMenu";

// type ServerStatus = "checking" | "ok" | "fail";

// export default function Home() {
//   const router = useRouter();
//   const { login } = useAuthStore();
//   const [saveEmail, setSaveEmail] = useState(false);
//   const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");
//   const [isNavigating, setIsNavigating] = useState(false);

//   console.log("환경변수 로드 확인:", process.env.NEXT_PUBLIC_API_URL);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid, isSubmitting },
//     watch,
//     setValue,
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     mode: "onTouched",
//   });

//   useEffect(() => {
//     const savedEmail = localStorage.getItem("savedEmail");
//     if (savedEmail) {
//       setValue("email", savedEmail);
//       setSaveEmail(true);
//     }
//   }, [setValue]);

//   useEffect(() => {
//     pingServer();
//   }, []);

//   const pingServer = async () => {
//     setServerStatus("checking");
//     try {
//       await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
//         timeout: 15000,
//       });
//       setServerStatus("ok");
//     } catch {
//       setServerStatus("fail");
//     }
//   };

//   const onSubmit = async (data: LoginForm) => {
//     try {
//       await login(data);
//       if (saveEmail) {
//         localStorage.setItem("savedEmail", data.email);
//       } else {
//         localStorage.removeItem("savedEmail");
//       }
//       setIsNavigating(true);
//       router.push("/main");
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         const message =
//           error.response?.data?.message || "로그인에 실패했습니다.";
//         toast.error(message);
//       } else {
//         toast.error("알 수 없는 오류가 발생했습니다.");
//       }
//     }
//   };
//   const serverBanner = {
//     checking: {
//       dot: "bg-amber-400 animate-pulse",
//       text: "서버 연결 확인 중... 잠시만 기다려주세요",
//       showRetry: false,
//     },
//     ok: {
//       dot: "bg-green-500",
//       text: "서버가 준비됐어요. 로그인해주세요",
//       showRetry: false,
//     },
//     fail: {
//       dot: "bg-red-500",
//       text: "서버 연결에 실패했어요. 잠시 후 다시 시도해주세요",
//       showRetry: true,
//     },
//   }[serverStatus];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white py-12">
//       <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center px-4">
//         <Title />

//         {/* 서버 상태 배너 */}
//         <div className="w-full flex items-center gap-[12px] px-[16px] py-[14px] rounded-[8px] border border-[#DDDDDD]">
//           <div
//             className={`w-[10px] h-[10px] rounded-full flex-shrink-0 ${serverBanner.dot}`}
//           />
//           <p className="flex-1 text-[14px] text-[#666]">{serverBanner.text}</p>
//           {serverBanner.showRetry && (
//             <Button
//               size="sm"
//               text="재요청"
//               onClick={pingServer}
//               className="bg-transparent text-[#0029C0] border border-[#0029C0] hover:bg-[#F6FAFF] h-[30px] w-auto px-[10px]"
//             />
//           )}
//         </div>

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
//             <Button
//               type="submit"
//               text="로그인"
//               loadingText="잠시만요..."
//               isLoading={isSubmitting || isNavigating}
//               disabled={!isValid || serverStatus !== "ok"}
//             />
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
//       <FloatingMenu />
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Link from "next/link";
import Title from "./signup/_components/Title";
import ServerWakeUpSlot from "./_components/ServerWakeUpSlot"; // 분리한 컴포넌트 import
import FloatingMenu from "@/components/FloatingMenu";
import { loginSchema, LoginForm } from "@/types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import {
  clearServerAwake,
  isServerAwakeCached,
  markServerAwake,
} from "@/lib/serverAwake";

export default function Home() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [saveEmail, setSaveEmail] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isServerReady, setIsServerReady] = useState(isServerAwakeCached);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
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

  useEffect(() => {
    const verifyServer = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
          timeout: 5000,
        });
        markServerAwake();
        setIsServerReady(true);
      } catch {
        clearServerAwake();
        setIsServerReady(false);
      }
    };

    verifyServer();
  }, []);

  // 서버가 안 깨어났으면 슬롯머신만 렌더링
  if (!isServerReady) {
    return (
      <ServerWakeUpSlot
        onSuccess={() => {
          markServerAwake();
          setIsServerReady(true);
        }}
      />
    );
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      if (saveEmail) {
        localStorage.setItem("savedEmail", data.email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      setIsNavigating(true);
      router.push("/main");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "로그인에 실패했습니다.";
        toast.error(message);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 서버가 깨어났으면 로그인 폼 렌더링
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12">
      <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center px-4">
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
            <Button
              type="submit"
              text="로그인"
              loadingText="잠시만요..."
              isLoading={isSubmitting || isNavigating}
              disabled={!isValid || !isServerReady}
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
      <FloatingMenu />
    </div>
  );
}
