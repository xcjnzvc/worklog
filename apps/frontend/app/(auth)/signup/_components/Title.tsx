export default function Title({ describe }: { describe?: string }) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      <h2 className="text-[40px] font-bold text-[#0023A1]">WorkLog</h2>
      {describe && <span className="text-[#666] text-[18px]">{describe}</span>}
    </div>
  );
}
