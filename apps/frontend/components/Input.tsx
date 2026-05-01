"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  type: string;
  label: string;
  error?: string;
  success?: boolean;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
>(({ type, label, error, success, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const currentType = isPasswordType && showPassword ? "text" : type;

  const borderColor = error
    ? "border-red-500"
    : success
      ? "border-[#0029C0]"
      : "border-[#DDDDDD]";

  const labelColor = error
    ? "text-red-500"
    : success
      ? "text-[#0029C0]"
      : "text-[#666]";

  return (
    <div className="w-full">
      <label className={`text-[16px] ${labelColor}`}>{label}</label>
      <div className="relative w-full mt-[6px]">
        <input
          ref={ref}
          type={currentType}
          placeholder={`${label}을 입력해주세요`}
          className={`pl-[10px] pr-[40px] w-full h-[46px] border ${borderColor} rounded-[12px] outline-none placeholder:text-[14px] placeholder:text-[#999999]`}
          {...rest}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#999999]"
          >
            {/* ✅ 사용자님 요청대로 수정: 
                비밀번호가 보일 때(true) -> 눈 뜬 아이콘(Eye)
                비밀번호가 가려졌을 때(false) -> 눈 감은 아이콘(EyeOff) */}
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
