"use client";

import { useEffect, useState } from "react";
import PlanCard from "./_components/PlanCard";
import SeatSelector from "./_components/SeatSelector";
import PaymentSummary from "./_components/PaymentSummary";
import { useUserStore } from "@/store/useUserStore";
import {
  cancelPaymentAPI,
  completePaymentAPI,
  getCurrentPaymentAPI,
} from "@/api/payments";
import toast from "react-hot-toast";

interface PortOneSDK {
  requestPayment: (params: {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: string;
    payMethod: string;

    customer: { fullName: string };
  }) => Promise<{ code?: string; message?: string; paymentId?: string }>;
}

declare global {
  interface Window {
    PortOne: PortOneSDK;
  }
}

const PLANS = [
  {
    name: "Basic",
    monthlyDisplay: 5000,
    billingAmount: (seats: number) => seats * 5000,
    period: "월간",
    desc: "성장하는 팀을 위한 필수 근태 관리",
    features: ["최대 50명까지 사용 가능", "모든 기능 동일 제공"],
    maxSeats: 50,
  },
  {
    name: "Pro",
    monthlyDisplay: 490000,
    billingAmount: () => 490000,
    period: "연간",
    desc: "더 큰 조직을 위한 프리미엄 구독 (연간 고정가)",
    features: ["인원 무제한 사용", "모든 기능 동일 제공"],
    maxSeats: null,
  },
];

export default function PaymentPage() {
  const { user } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState("Basic");
  const [seatCount, setSeatCount] = useState(10);
  const [currentPayment, setCurrentPayment] = useState<{
    plan: string;
    maxMembers: number;
    amount: number;
    paidAt: string | null;
  } | null>(null);

  const plan = PLANS.find((p) => p.name === selectedPlan)!;
  const totalAmount = plan.billingAmount(seatCount);

  // 페이지 진입 시 fetch
  useEffect(() => {
    getCurrentPaymentAPI()
      .then(setCurrentPayment)
      .catch(() => {});
  }, []);

  const handlePayment = async () => {
    if (typeof window === "undefined" || !window.PortOne) {
      toast.error("결제 시스템이 준비 중입니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      const response = await window.PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId: `worklog-${crypto.randomUUID()}`,
        orderName: `${user?.companyName || "WorkLog"} ${plan.name} 구독`,
        totalAmount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customer: {
          fullName: `${user?.companyName?.endsWith("회사") ? user.companyName : (user?.companyName || "회사") + "회사"} - ${user?.name || "결제자"}`,
        },
      });

      if (response?.code != null) {
        toast.error(`결제 오류: ${response.message}`);
      } else {
        const verifyRes = await completePaymentAPI({
          paymentId: response.paymentId!,
          planName: plan.name,
          seatCount,
        });
        if (verifyRes.success) {
          toast.success("결제 및 구독 활성화가 완료되었습니다!");
          window.location.href = "/main";
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("결제 검증 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = async () => {
    if (!confirm("구독을 취소하시겠습니까? 즉시 FREE 플랜으로 전환됩니다."))
      return;
    try {
      await cancelPaymentAPI();
      setCurrentPayment({
        plan: "FREE",
        maxMembers: 3,
        amount: 0,
        paidAt: null,
      });
      useUserStore
        .getState()
        .setUser({ ...user!, plan: "FREE", maxMembers: 3 });
      toast.success("구독이 취소되었습니다.");
    } catch {
      toast.error("구독 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      {/* 현재 구독 상태 배너 */}
      {currentPayment && currentPayment.plan !== "FREE" && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-blue-400">현재 구독 중인 플랜</p>
            <p className="text-base font-bold text-blue-600">
              {currentPayment.plan} 플랜 · 최대 {currentPayment.maxMembers}명
            </p>
            <p className="text-sm text-slate-500">
              현재 결제 금액 ₩{currentPayment.amount.toLocaleString()}
              {currentPayment.paidAt && (
                <span className="text-xs text-slate-400 ml-2">
                  ({new Date(currentPayment.paidAt).toLocaleDateString("ko-KR")}{" "}
                  결제)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-xs text-red-400 hover:text-red-600 font-semibold transition"
          >
            구독 취소
          </button>
        </div>
      )}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          구독 플랜 선택
        </h1>
        <p className="text-slate-500">
          팀 규모에 맞는 최적의 플랜을 시작해보세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {PLANS.map((p) => (
          <PlanCard
            key={p.name}
            name={p.name}
            desc={p.desc}
            monthlyDisplay={p.monthlyDisplay}
            period={p.period}
            features={p.features}
            selected={selectedPlan === p.name}
            onClick={() => setSelectedPlan(p.name)}
          />
        ))}
      </div>

      {plan.maxSeats ? (
        <SeatSelector
          seatCount={seatCount}
          max={plan.maxSeats}
          onChange={setSeatCount}
        />
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-6 text-center">
          <p className="text-lg font-semibold text-blue-600 mb-1">
            인원 무제한
          </p>
          <p className="text-sm text-blue-400">
            직원 수 제한 없이 전체 팀이 사용 가능합니다.
          </p>
        </div>
      )}

      <PaymentSummary
        planName={plan.name}
        period={plan.period}
        totalAmount={totalAmount}
        onPayment={handlePayment}
      />
    </div>
  );
}
