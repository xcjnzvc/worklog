import { VacationTableRow } from "@/types/vacation";

interface Props {
  item: VacationTableRow;
  onBack: () => void;
}

export default function DetailView({ item, onBack }: Props) {
  return (
    <div className="p-8">
      <button onClick={onBack} className="mb-4 text-sm font-bold text-gray-500">
        ← 목록으로
      </button>
      <div className="bg-gray-50 p-6 rounded-2xl border">
        <h2 className="text-2xl font-bold">{item.formattedPeriod}</h2>
        <p className="mt-4">{item.reason}</p>
      </div>
    </div>
  );
}
