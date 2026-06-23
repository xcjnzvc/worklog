"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Clock,
  CheckCircle,
  Shield,
  User,
  Zap,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { inviteSchema, InviteForm } from "@/types/auth";
import { InviteResponse, InviteHistoryItem } from "@/types/invite";
import { inviteAPI, getInviteHistoryAPI, resendInviteAPI } from "@/api/invite";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { PageTabs } from "@/components/PageTabs";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { ListPageLayout } from "@/components/ListPageLayout";
import InviteLinkCard from "./_components/InviteLinkCard";
import { InviteTable } from "./_components/InviteTable";
import { UpgradeModal } from "./_components/UpgradeModal";

const ROLE_OPTIONS = [
  {
    value: "USER",
    label: "일반 직원 (USER)",
    description: "출퇴근 로그 기록, 본인의 연차 신청 및 정정 대행용 기본 권한",
    icon: User,
  },
  {
    value: "ADMIN",
    label: "관리자 (ADMIN)",
    description:
      "전사 출퇴근 최종 결재 승인 및 근무 시간 규칙 설정 최상위 권한",
    icon: Shield,
  },
] as const;

export default function AdminInvitePage() {
  const [activeTab, setActiveTab] = useState<"CREATE" | "HISTORY">("CREATE");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inviteResult, setInviteResult] = useState<InviteResponse | null>(null);
  const [historyList, setHistoryList] = useState<InviteHistoryItem[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    mode: "onTouched",
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const emailValue = watch("email");
  const roleValue = watch("role");

  // 데이터 불러오기 함수
  const fetchHistory = useCallback(async () => {
    try {
      const data = await getInviteHistoryAPI();
      setHistoryList(data);
    } catch (e) {
      toast.error("초대 내역을 불러오는 데 실패했습니다.");
    }
  }, []);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (activeTab === "HISTORY") {
      fetchHistory();
    }
  }, [activeTab, fetchHistory]);

  const onSubmit = async (data: InviteForm) => {
    try {
      const response = await toast.promise(inviteAPI(data), {
        loading: "초대 링크를 생성 중입니다...",
        success: "초대 링크 발행 성공!",
        error: (err) => {
          if (err instanceof AxiosError) {
            const msg = err.response?.data?.message || "";
            if (msg.includes("최대 인원")) {
              setShowUpgradeModal(true);
              return null; // toast 안 띄우기
            }
            return msg || "초대에 실패했습니다.";
          }
          return "알 수 없는 오류가 발생했습니다.";
        },
      });
      setInviteResult(response as InviteResponse);
    } catch (error) {
      console.error("Invited Error:", error);
    }
  };

  const handleResend = async (email: string) => {
    try {
      await toast.promise(resendInviteAPI(email), {
        loading: "재발송 중입니다...",
        success: "성공적으로 재발송되었습니다!",
        error: "재발송에 실패했습니다.",
      });
      fetchHistory();
    } catch (error) {
      console.error("Resend Error:", error);
    }
  };

  const handleResetForm = () => {
    setInviteResult(null);
    reset();
  };

  const filteredHistory = useMemo(() => {
    return historyList
      .filter((item) =>
        item.email.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
      .map((item, index) => ({
        ...item,
        displayId: String(index + 1).padStart(3, "0"),
      }));
  }, [historyList, searchKeyword]);

  const pendingCount = historyList.filter((i) => i.status === "PENDING").length;
  const acceptedCount = historyList.filter(
    (i) => i.status === "ACCEPTED",
  ).length;

  return (
    <ListPageLayout
      title="조직 구성원 초대 관리"
      description="새로운 팀원을 서비스에 초대하고 전사 시스템 권한 및 발송 내역을 모니터링합니다."
      stats={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            label="총 발송된 초대"
            value={`${historyList.length}건`}
            color="text-[#0029C0]"
            icon={<Mail />}
          />
          <StatCard
            label="가입 대기중"
            value={`${pendingCount}건`}
            color="text-[#FFA800]"
            icon={<Clock />}
          />
          <StatCard
            label="가입 완료"
            value={`${acceptedCount}건`}
            color="text-[#00B050]"
            icon={<CheckCircle />}
          />
        </div>
      }
      tabs={
        <PageTabs<"CREATE" | "HISTORY">
          tabs={[
            { value: "CREATE", label: "신규 초대장 발송" },
            {
              value: "HISTORY",
              label: `초대 발령 내역`,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchKeyword={activeTab === "HISTORY" ? searchKeyword : undefined}
          onSearchChange={
            activeTab === "HISTORY" ? setSearchKeyword : undefined
          }
          searchPlaceholder="초대 이메일 검색..."
        />
      }
    >
      {activeTab === "CREATE" && (
        <div className="w-full mt-4 px-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {inviteResult ? (
            <div className="max-w-[600px] mx-auto bg-white rounded-[32px] border border-gray-100 p-8 shadow-2xl shadow-gray-50/50">
              <InviteLinkCard
                inviteLink={inviteResult.inviteLink}
                expiresAt={inviteResult.expiresAt}
                onReset={handleResetForm}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="lg:col-span-7 flex flex-col justify-between gap-10 py-4 w-full max-w-[740px]"
              >
                <div className="space-y-8">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#4318FF] bg-[#F4F7FE] px-3.5 py-1.5 rounded-full inline-block mb-3">
                      WORKSPACE CONTROL
                    </span>
                    <h3 className="text-[26px] font-black text-[#1B254B] tracking-tight mb-2">
                      이메일 초대장 생성
                    </h3>
                    <p className="text-sm font-semibold text-[#A3AED0] leading-relaxed">
                      조직의 가입 대상자에게 고유 가입 링크를 안전하게 발행하며,
                      역할 기반 접근 제어(RBAC)를 설정합니다.
                    </p>
                  </div>
                  <div className="w-full relative group">
                    <Input
                      type="email"
                      label="초대 대상 이메일 주소"
                      placeholder="name@company.com"
                      error={errors.email?.message}
                      success={!errors.email && emailValue?.length > 0}
                      {...register("email")}
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1B254B] px-1">
                      부여할 시스템 권한 그룹
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {ROLE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = roleValue === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setValue("role", option.value, {
                                shouldValidate: true,
                              })
                            }
                            className={`flex flex-col items-start p-5 rounded-[22px] border text-left transition-all duration-300 relative group/btn ${
                              isSelected
                                ? "bg-white border-[#0029C0] shadow-[0_12px_24px_rgba(0,41,192,0.08)] ring-2 ring-[#0029C0]/10"
                                : "bg-white border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-xl mb-4 ${
                                isSelected
                                  ? option.value === "ADMIN"
                                    ? "bg-purple-50 text-purple-600"
                                    : "bg-[#0029C0]/5 text-[#0029C0]"
                                  : "bg-gray-50 text-[#707EAE]"
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                            <h4
                              className={`text-[15px] font-black mb-1.5 ${
                                isSelected
                                  ? option.value === "ADMIN"
                                    ? "text-purple-600"
                                    : "text-[#0029C0]"
                                  : "text-[#1B254B]"
                              }`}
                            >
                              {option.label}
                            </h4>
                            <p className="text-[11px] text-[#A3AED0] font-semibold leading-relaxed">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Button
                  text="초대 링크 생성 및 메일 발송"
                  disabled={!isValid}
                  type="submit"
                  className={`w-full h-[58px] rounded-[20px] text-[15px] font-black ${isValid ? "bg-[#4318FF] text-white hover:bg-[#3610DB]" : "bg-gray-100 text-[#A3AED0]"}`}
                />
              </form>
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
                {/* 가이드 카드 1: 링크 유효 기간 */}
                <div className="bg-[#F7F9FF] rounded-[28px] p-8 space-y-4 border border-blue-50/50">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100/70">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4318FF] shrink-0 shadow-inner">
                      <Clock size={18} />
                    </div>
                    <h4 className="text-[16px] font-extrabold text-[#1B254B]">
                      초대장 유효 기간 안내
                    </h4>
                  </div>
                  <p className="text-[13px] text-[#707EAE] font-semibold leading-relaxed">
                    조직 보안 정책에 따라, 생성된 가입 보안 토큰 링크는{" "}
                    <span className="font-bold text-[#1B254B]">
                      발행 후 72시간 동안만
                    </span>{" "}
                    활성화됩니다. 기간이 만료되면 해당 토큰은 자동으로
                    폐기되므로 `초대 발령 내역` 탭에서 재발송해야 합니다.
                  </p>
                  <div className="flex bg-white items-center gap-2 p-3 rounded-lg border border-gray-100">
                    <ShieldCheck size={16} className="text-[#05CD99]" />
                    <span className="text-xs text-[#707EAE]">
                      보안 서버를 통해 가입 토큰이 암호화됩니다.
                    </span>
                  </div>
                </div>

                {/* 가이드 카드 2: 권한 부여 주의사항 */}
                <div className="bg-white rounded-[28px] p-8 space-y-4 border border-gray-100 shadow-sm shadow-gray-50/50">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <Zap size={18} />
                    </div>
                    <h4 className="text-[16px] font-extrabold text-[#1B254B]">
                      권한 그룹 부여 주의사항
                    </h4>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[11px] font-black tracking-wider">
                        ADMIN (관리자)
                      </span>
                      <p className="text-[12px] text-[#707EAE] font-semibold leading-relaxed">
                        전사 근태 정정 최종 승인, 조직도 편집 및 연차 정책
                        설정을 제어할 수 있는 최상위 권한이 부여되므로, 발송 전
                        메일 주소가 정확한지 반드시 다시 한번 확인하시기
                        바랍니다.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-black tracking-wider">
                        USER (일반 직원)
                      </span>
                      <p className="text-[12px] text-[#707EAE] font-semibold leading-relaxed">
                        개인 출퇴근 체크, 휴가 신청, 본인의 근태 기록 조회 등
                        기본적인 서비스 이용 권한만 부여받습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "HISTORY" && (
        <div className="mt-2 space-y-6">
          <InviteTable data={filteredHistory} onResend={handleResend} />
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </ListPageLayout>
  );
}
