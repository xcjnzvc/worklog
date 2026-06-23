import { VacationTableRow } from "@/types/vacation";
import Button from "@/components/Button"; 

interface Props {
  item: VacationTableRow;
  onBack: () => void;
}

export default function DetailView({ item, onBack }: Props) {
  return (
    <div className="p-8">
      <Button
        size="sm"
        text="← 목록으로"
        onClick={onBack}
        className="mb-4 bg-transparent text-gray-500 hover:text-gray-800 px-0 min-w-auto"
      />

      <div className="bg-gray-50 p-6 rounded-2xl border">
        <h2 className="text-2xl font-bold">{item.formattedPeriod}</h2>
        <p className="mt-4">{item.reason}</p>
      </div>
    </div>
  );
}
