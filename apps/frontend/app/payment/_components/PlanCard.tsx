interface PlanCardProps {
  name: string;
  desc: string;
  monthlyDisplay: number;
  period: string;
  features: string[];
  selected: boolean;
  onClick: () => void;
}

export default function PlanCard({
  name,
  desc,
  monthlyDisplay,
  period,
  features,
  selected,
  onClick,
}: PlanCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-100 hover:border-slate-200"
      }`}
    >
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-slate-500 text-sm mb-4">{desc}</p>
      <div className="text-2xl font-semibold mb-3">
        ₩{monthlyDisplay.toLocaleString()}
        <span className="text-sm font-normal text-slate-400"> /월</span>
      </div>
      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mb-5">
        {period} 플랜
      </span>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li
            key={i}
            className="text-sm text-slate-600 flex items-center gap-2"
          >
            <span className="text-emerald-500">✓</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
