// "use client";

// import { forwardRef, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// interface InputProps {
//   type: string;
//   label: string;
//   error?: string;
//   success?: boolean;
// }

// const Input = forwardRef<
//   HTMLInputElement,
//   InputProps & React.InputHTMLAttributes<HTMLInputElement>
// >(({ type, label, error, success, ...rest }, ref) => {
//   const [showPassword, setShowPassword] = useState(false);

//   const isPasswordType = type === "password";
//   const currentType = isPasswordType && showPassword ? "text" : type;

//   const borderColor = error
//     ? "border-red-500"
//     : success
//       ? "border-[#0029C0]"
//       : "border-[#DDDDDD]";

//   const labelColor = error
//     ? "text-red-500"
//     : success
//       ? "text-[#0029C0]"
//       : "text-[#666]";

//   return (
//     <div className="w-full">
//       <label className={`text-[16px] ${labelColor}`}>{label}</label>
//       <div className="relative w-full mt-[6px]">
//         <input
//           ref={ref}
//           type={currentType}
//           placeholder={`${label}을 입력해주세요`}
//           className={`pl-[10px] pr-[40px] w-full h-[46px] border ${borderColor} rounded-[12px] outline-none placeholder:text-[14px] placeholder:text-[#999999]`}
//           {...rest}
//         />

//         {isPasswordType && (
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#999999]"
//           >
//             {/* ✅ 사용자님 요청대로 수정:
//                 비밀번호가 보일 때(true) -> 눈 뜬 아이콘(Eye)
//                 비밀번호가 가려졌을 때(false) -> 눈 감은 아이콘(EyeOff) */}
//             {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//           </button>
//         )}
//       </div>
//       {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//     </div>
//   );
// });

// Input.displayName = "Input";
// export default Input;

"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  type: string;
  label: string;
  error?: string;
  success?: boolean;
  variant?: "auth" | "form"; // ✅ 스타일 옵션 추가
  icon?: React.ReactNode; // ✅ 우측 아이콘 커스텀용
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
>(({ type, label, error, success, variant = "auth", icon, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const currentType = isPasswordType && showPassword ? "text" : type;

  // ✅ 스타일에 따른 클래스 분기
  const containerStyle = variant === "auth" ? "w-full" : "space-y-3";
  const labelStyle =
    variant === "auth"
      ? `text-[16px] ${error ? "text-red-500" : success ? "text-[#0029C0]" : "text-[#666]"}`
      : "text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider";

  const inputStyle =
    variant === "auth"
      ? `h-[46px] border ${error ? "border-red-500" : success ? "border-[#0029C0]" : "border-[#DDDDDD]"} rounded-[12px] bg-white px-[10px]`
      : `h-[60px] border-2 border-transparent bg-[#F4F7FE] focus:border-[#4318FF] rounded-[24px] px-8 text-lg font-bold`;

  return (
    <div className={containerStyle}>
      <label className={labelStyle}>{label}</label>
      <div className="relative w-full mt-[6px]">
        <input
          ref={ref}
          type={currentType}
          className={`w-full outline-none transition-all placeholder:text-[#999999] ${inputStyle} ${rest.className} 
            ${type === "time" ? "[&::-webkit-calendar-picker-indicator]:hidden" : ""}`} // ✅ 시간 아이콘 숨김 처리
          {...rest}
        />

        {/* 패스워드 토글 혹은 전달받은 아이콘 표시 */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A3AED0]">
          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          ) : (
            icon // ✅ 전달받은 Clock 아이콘 등이 여기 뜸
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500 ml-2">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
