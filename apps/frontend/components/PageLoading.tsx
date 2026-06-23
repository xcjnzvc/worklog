// components/PageLoading.tsx
export default function PageLoading() {
  return (
    <div className="min-h-screen p-6 md:p-[40px] space-y-6 animate-pulse">
      {/* 타이틀 영역 */}
      <div className="h-8 bg-gray-200 rounded-lg w-48" />

      {/* 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>

      {/* 테이블/리스트 영역 */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
