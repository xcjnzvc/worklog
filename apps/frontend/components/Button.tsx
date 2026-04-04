interface ButtonProps {
  text: string;
  width?: number;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  text,
  width,
  disabled,
  type = "submit",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      style={width ? { width: `${width}px` } : undefined}
      className={`h-[48px] rounded-[12px] text-[18px] font-medium transition-colors
        ${!width ? "w-full" : ""}
        ${
          disabled
            ? "bg-[#CCCCCC] text-[#999999] cursor-not-allowed"
            : "bg-[#0029C0] text-[#fff] cursor-pointer"
        }`}
    >
      {text}
    </button>
  );
}
