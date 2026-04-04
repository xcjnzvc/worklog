"use client";

import { forwardRef } from "react";

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
    <div>
      <label className={`text-[18px] ${labelColor}`}>{label}</label>
      <input
        ref={ref}
        type={type}
        placeholder={`${label}을 입력해주세요`}
        className={`pl-[10px] w-full mt-[6px] h-[46px] border ${borderColor} rounded-[12px] outline-none placeholder:text-[14px] placeholder:text-[#999999]`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
