export default function GlobalLoading() {
  return (
    <div className="min-h-screen p-6 md:p-[40px] animate-pulse space-y-8">
      {/* 범용 헤더 영역 */}
      <div className="h-16 bg-gray-200 rounded-2xl w-full max-w-[1600px] mx-auto" />

      {/* 범용 본문 영역 (카드 형태) */}
      <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        <div className="col-span-3 h-64 bg-gray-200 rounded-2xl" />
        <div className="col-span-6 h-64 bg-gray-200 rounded-2xl" />
        <div className="col-span-3 h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}
