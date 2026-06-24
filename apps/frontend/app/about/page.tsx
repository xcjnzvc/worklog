import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-white">
      {/* 1. Hero: 서비스 정의 */}
      <section className="text-center mb-20">
        <h1 className="text-5xl font-extrabold mb-6">WorkLog</h1>
        <p className="text-xl text-gray-600">
          복잡한 기업 근태 관리를 자동화하여, <br />
          <strong>
            관리자의 승인 시간은 줄이고, 사원의 투명성은 높이는
          </strong>{" "}
          B2B SaaS입니다.
        </p>
      </section>

      {/* 2. 전체 흐름 (Flow) */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center">
          서비스 핵심 흐름
        </h2>
        {/* 여기 흐름도 이미지나 단계별 박스를 배치하세요 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm font-semibold text-[#0029C0]">
          <div className="p-4 bg-blue-50 rounded-lg">① 회사 생성 및 초대</div>
          <span>→</span>
          <div className="p-4 bg-blue-50 rounded-lg">② 출퇴근 및 정정 요청</div>
          <span>→</span>
          <div className="p-4 bg-blue-50 rounded-lg">③ 관리자 승인 처리</div>
          <span>→</span>
          <div className="p-4 bg-blue-50 rounded-lg">④ 구독 결제 및 리포트</div>
        </div>
      </section>

      {/* 3. 사용자별 가치 (Roles) */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: "사원(Employee)",
            desc: "간편한 출퇴근 기록과 휴가/정정 신청, 그리고 승인 상태를 실시간 확인하여 근태 관리의 투명성을 확보합니다.",
          },
          {
            title: "관리자(Admin)",
            desc: "직관적인 승인/반려 프로세스와 권한 관리를 통해 복잡한 근태 정정 업무를 효율적으로 자동화합니다.",
          },
          {
            title: "운영자(Owner)",
            desc: "구독 상태와 결제 흐름을 한눈에 파악하고, 장애 대응 모니터링으로 안정적인 서비스를 유지합니다.",
          },
        ].map((role) => (
          <div
            key={role.title}
            className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-bold text-lg mb-3">{role.title}</h3>
            <p className="text-gray-600 text-sm">{role.desc}</p>
          </div>
        ))}
      </section>

      {/* 4. 핵심 성과 (Tech & Impact) */}
      <section className="bg-gray-900 text-white p-10 rounded-3xl">
        <h2 className="text-2xl font-bold mb-8">기술적 도전과 성과</h2>
        <ul className="space-y-6">
          <li>
            <strong>성능 최적화:</strong> LCP 15.6s에서 1.4s로 91% 단축하여
            사용자 진입 경험 개선
          </li>
          <li>
            <strong>안정성:</strong> Sentry 기반 실시간 장애 추적 시스템으로
            비즈니스 연속성 확보
          </li>
          <li>
            <strong>비즈니스:</strong> 포트원 V2/토스페이먼츠 연동을 통한 구독
            결제 시스템의 트랜잭션 무결성 구현
          </li>
        </ul>
      </section>
    </main>
  );
}
