import { twMerge } from "tailwind-merge";

interface ButtonProps {
  text: string;
  width?: number;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  text,
  width,
  disabled,
  type = "button",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={width ? { width: `${width}px` } : undefined}
      className={twMerge(
        // 기본 스타일
        "h-[58px] rounded-[12px] text-[18px]  transition-colors flex items-center justify-center",
        !width && "w-full",
        disabled
          ? "bg-[#CCCCCC] text-[#999999] cursor-not-allowed"
          : "bg-[#0029C0] text-white cursor-pointer",
        // 외부에서 넘긴 className이 기본값을 덮어씀
        className,
      )}
    >
      {text}
    </button>
  );
}
