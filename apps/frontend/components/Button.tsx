import { twMerge } from "tailwind-merge";

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  loadingText?: string;
  isLoading?: boolean;
  size?: "default" | "sm" | "icon";
  width?: number;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function Button({
  text,
  icon,
  loadingText = "처리 중...",
  isLoading = false,
  size = "default",
  width,
  disabled,
  type = "button",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={width ? { width: `${width}px` } : undefined}
      className={twMerge(
        // 핵심 수정: justify-between -> justify-center로 변경하고 gap-2 추가
        "rounded-[12px] font-bold transition-all flex items-center justify-center gap-2 px-6 active:scale-[0.98]",

        size === "default"
          ? "h-[58px] text-[18px]"
          : size === "sm"
            ? "h-[36px] px-4 text-[13px]"
            : "w-12 h-12",

        !width && size === "default" && "w-full",

        disabled || isLoading
          ? "bg-[#CCCCCC] text-[#999999] cursor-not-allowed"
          : "bg-[#0029C0] text-white cursor-pointer hover:bg-[#0023a0]",

        className,
      )}
    >
      {isLoading ? (
        loadingText
      ) : (
        <>
          {text && <span>{text}</span>}
          {icon && <span className="flex items-center">{icon}</span>}
        </>
      )}
    </button>
  );
}
