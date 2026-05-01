export default function CardSkeleton({
  className = "h-[300px]",
}: {
  className?: string;
}) {
  return (
    <div
      className={`p-[30px] bg-white rounded-[32px] border border-gray-100 shadow-sm w-full animate-pulse ${className}`}
    >
      <div className="flex flex-col gap-4">
        {/* 제목 부분 뼈대 */}
        <div className="h-6 w-24 bg-gray-200 rounded-md" />
        {/* 본문 부분 뼈대 */}
        <div className="h-32 w-full bg-gray-100 rounded-xl" />
        {/* 하단 버튼 부분 뼈대 */}
        <div className="h-12 w-full bg-gray-200 rounded-full mt-auto" />
      </div>
    </div>
  );
}
