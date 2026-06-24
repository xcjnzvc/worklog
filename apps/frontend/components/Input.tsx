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
              className="flex items-center justify-center"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          ) : (
            icon
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500 ml-2">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
