export default function PageLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#0023A1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400 font-medium">
          불러오는 중...
        </span>
      </div>
    </div>
  );
}
