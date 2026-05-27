interface ApprovalActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

export const ApprovalActionButtons = ({
  onApprove,
  onReject,
  className = "",
}: ApprovalActionButtonsProps) => {
  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onApprove();
        }}
        className="px-4 py-1.5 bg-[#0029C0] text-white rounded-lg text-sm font-bold hover:bg-[#002094] transition-colors"
      >
        승인
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReject();
        }}
        className="px-4 py-1.5 bg-white text-[#EE5D50] border border-[#EE5D50] rounded-lg text-sm font-bold hover:bg-[#FFEEF2] transition-colors"
      >
        반려
      </button>
    </div>
  );
};
