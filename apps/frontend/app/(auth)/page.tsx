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
// import axios from "axios";

// type ServerStatus = "checking" | "ok" | "fail";

// export default function Home() {
//   const router = useRouter();
//   const { login } = useAuthStore();
//   const [saveEmail, setSaveEmail] = useState(false);
//   const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");

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
//       router.push("/main");
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         const message =
//           error.response?.data?.message || "로그인에 실패했습니다.";
//         alert(message);
//       } else {
//         alert("알 수 없는 오류가 발생했습니다.");
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
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center">
//         <Title />

//         {/* 서버 상태 배너 */}
//         <div className="w-full flex items-center gap-[12px] px-[16px] py-[14px] rounded-[8px] border border-[#DDDDDD]">
//           <div
//             className={`w-[10px] h-[10px] rounded-full flex-shrink-0 ${serverBanner.dot}`}
//           />
//           <p className="flex-1 text-[14px] text-[#666]">{serverBanner.text}</p>
//           {serverBanner.showRetry && (
//             <button
//               type="button"
//               onClick={pingServer}
//               className="text-[13px] text-[#0029C0] border border-[#0029C0] rounded-[6px] px-[10px] py-[5px] whitespace-nowrap hover:bg-[#F6FAFF]"
//             >
//               재요청
//             </button>
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

//           {/* ✅ 이제 여기서는 추가적인 버튼 없이 type="password"만 넘기면 됩니다. */}
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
//     </div>
//   );
// }

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
// import { Download } from "lucide-react";
// import axios from "axios";

// type ServerStatus = "checking" | "ok" | "fail";

// export default function Home() {
//   const router = useRouter();
//   const { login } = useAuthStore();
//   const [saveEmail, setSaveEmail] = useState(false);
//   const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");

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
//       router.push("/main");
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         const message =
//           error.response?.data?.message || "로그인에 실패했습니다.";
//         alert(message);
//       } else {
//         alert("알 수 없는 오류가 발생했습니다.");
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
//     <div className="relative min-h-screen flex items-center justify-center">
//       <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center px-4">
//         <Title />

//         {/* 서버 상태 배너 */}
//         <div className="w-full flex items-center gap-[12px] px-[16px] py-[14px] rounded-[8px] border border-[#DDDDDD]">
//           <div
//             className={`w-[10px] h-[10px] rounded-full flex-shrink-0 ${serverBanner.dot}`}
//           />
//           <p className="flex-1 text-[14px] text-[#666]">{serverBanner.text}</p>
//           {serverBanner.showRetry && (
//             <button
//               type="button"
//               onClick={pingServer}
//               className="text-[13px] text-[#0029C0] border border-[#0029C0] rounded-[6px] px-[10px] py-[5px] whitespace-nowrap hover:bg-[#F6FAFF]"
//             >
//               재요청
//             </button>
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

//       {/* 🚀 앱 다운로드 플로팅 버튼 (그레이 버튼 + 중앙 정렬 파란 말풍선) */}
//       <a
//         href="/worklog.apk"
//         download
//         className="fixed bottom-8 right-8 flex flex-col items-center group transition-all"
//       >
//         {/* 파란색 말풍선 툴팁 (중앙 정렬) */}
//         <div className="relative mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
//           <div className="bg-[#0029C0] text-white text-[13px] font-medium py-2 px-4 rounded-[12px] whitespace-nowrap shadow-xl">
//             APK 파일 다운로드
//           </div>
//           {/* 말풍선 꼬리 (중앙 위치) */}
//           <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#0029C0]"></div>
//         </div>

//         {/* 차분한 회색 다운로드 버튼 */}
//         <div className="w-[56px] h-[56px] bg-[#f8f9fa] border border-[#e9ecef] rounded-full shadow-lg flex items-center justify-center text-[#ADB5BD] group-hover:text-[#0029C0] group-hover:bg-white group-hover:border-[#0029C0] transition-all duration-200 active:scale-95">
//           <Download size={24} />
//         </div>
//       </a>
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
import { ChevronRight, Download, Smartphone } from "lucide-react";
import axios from "axios";

type ServerStatus = "checking" | "ok" | "fail";

export default function Home() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [saveEmail, setSaveEmail] = useState(false);
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

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="max-w-[450px] w-full mx-auto flex gap-[40px] flex-col items-center px-4">
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

      {/* 🚀 옵션 1: 하단 미니 배너 스타일 */}
      {/* <Link
        href="/download"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,41,192,0.12)] hover:border-[#0029C0]/30 transition-all group"
      >
        <div className="w-8 h-8 bg-[#0029C0] rounded-full flex items-center justify-center text-white">
          <Download size={16} />
        </div>
        <span className="text-[14px] font-medium text-gray-700">
          현장에서 더 편리한{" "}
          <span className="text-[#0029C0] font-bold">WorkLog 앱</span> 설치하기
        </span>
        <div className="ml-2 text-gray-400 group-hover:text-[#0029C0] transition-colors">
          <ChevronRight size={18} />
        </div>
      </Link> */}
      {/* 앱 설치 안내 */}
      <Link
        href="/download"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,41,192,0.1)] hover:border-[#0029C0]/20 transition-all duration-300 group whitespace-nowrap"
      >
        <div className="w-7 h-7 bg-[#F0F4FF] rounded-lg flex items-center justify-center group-hover:bg-[#0029C0] transition-colors duration-300">
          <Smartphone
            size={15}
            className="text-[#0029C0] group-hover:text-white transition-colors duration-300"
          />
        </div>
        <span className="text-[13px] text-gray-400 font-medium">
          앱으로 더 편리하게 —{" "}
          <span className="text-[#0029C0] font-semibold">설치 안내 보기</span>
        </span>
        <ChevronRight
          size={15}
          className="text-gray-300 group-hover:text-[#0029C0] group-hover:translate-x-0.5 transition-all duration-300"
        />
      </Link>
    </div>
  );
}
