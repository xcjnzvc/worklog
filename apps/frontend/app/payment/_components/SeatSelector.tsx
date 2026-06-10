interface SeatSelectorProps {
  seatCount: number;
  max: number;
  onChange: (v: number) => void;
}

export default function SeatSelector({
  seatCount,
  max,
  onChange,
}: SeatSelectorProps) {
  return (
    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold text-slate-700">인원 설정</h2>
        <span className="text-blue-600 font-semibold">{seatCount}명</span>
      </div>
      <input
        type="range"
        min={1}
        max={max}
        step={1}
        value={seatCount}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>1명</span>
        <span>{max}명 (최대)</span>
      </div>
    </div>
  );
}
