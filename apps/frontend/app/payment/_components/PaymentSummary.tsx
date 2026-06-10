import Button from "@/components/Button";

interface PaymentSummaryProps {
  planName: string;
  period: string;
  totalAmount: number;
  onPayment: () => void;
}

export default function PaymentSummary({
  planName,
  period,
  totalAmount,
  onPayment,
}: PaymentSummaryProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl flex justify-between items-center">
      <div>
        <p className="text-xs text-slate-400 mb-1">
          {planName} · {period} 결제
        </p>
        <p className="text-2xl font-semibold text-slate-900">
          ₩{totalAmount.toLocaleString()}
        </p>
      </div>
      <Button
        text={`${planName} 구독 시작하기`}
        width={220}
        onClick={onPayment}
      />
    </div>
  );
}
