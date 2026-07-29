import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const features = [
  {
    badge: "출퇴근",
    badgeColor: "bg-gray-100 text-gray-600",
    title: "출퇴근 기록 & 정정 흐름",
    desc: "출퇴근 기록과 이력 조회, 정정 신청부터 승인·반려까지의 전체 흐름을 구현했습니다.",
    images: ["/img/work.png", "/img/attendance.png"],
  },
  {
    badge: "휴가",
    badgeColor: "bg-green-50 text-green-700",
    title: "휴가 신청 & 승인 흐름",
    desc: "연차·반차 신청부터 승인·반려, 잔여 연차 반영까지의 흐름을 구현했습니다.",
    images: ["/img/vacation.png", "/img/vacation2.png"],
  },
  {
    badge: "조직",
    badgeColor: "bg-blue-50 text-blue-700",
    title: "초대 URL 기반 합류 & 구독 결제",
    desc: "초대 URL 기반 구성원 합류와 PortOne + TossPayments 구독 결제·취소를 구현했습니다.",
    images: ["/img/invite.png", "/img/payment.png"],
  },
];

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-white">
      {/* 뒤로가기 */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft size={16} />
          돌아가기
        </Link>
      </div>

      {/* ─── 1. 문제 ─────────────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          문제
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-5">
          중소 조직의 근태 관리 흐름을
          <br />
          단순화하기 위해 만든 B2B SaaS
        </h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
          스프레드시트나 구두 보고에 의존하는 소규모 팀이 출퇴근·휴가를
          체계적으로 관리할 수 있도록, 대표 가입부터 결제까지 실제 서비스 흐름을
          직접 구현했습니다.
        </p>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 1-2. 프로젝트 정보 ──────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          프로젝트 정보
        </p>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {[
            { label: "개발 기간", value: "2026.04 ~ 2026.06" },
            { label: "개발 인원", value: "1명" },
            {
              label: "담당",
              value: "기획 · UI/UX · Frontend · Backend · DB 설계 · 배포",
            },
            { label: "유형", value: "개인 B2B SaaS" },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex gap-6 px-5 py-4 ${
                i < arr.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-xs font-semibold text-gray-400 min-w-[72px] shrink-0 pt-0.5">
                {item.label}
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 2. 혼자 책임진 범위 ──────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          혼자 책임진 범위
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "디자인", desc: "전체 UI 직접 설계 및 구현" },
            {
              label: "프론트엔드",
              desc: "Next.js 기반 역할별 화면, 상태 관리, 결제 연동",
            },
            { label: "백엔드", desc: "NestJS API·DB 설계 및 프론트엔드와 독립된 배포 구성" },
            {
              label: "운영 대응",
              desc: "배포 환경 결제 오류 원인 추적 및 수정, Sentry + Slack 모니터링 구축",
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 items-start">
              <span className="text-xs font-semibold text-gray-400 min-w-[80px] pt-0.5 shrink-0">
                {item.label}
              </span>
              <span className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 3. 핵심 흐름 ─────────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          핵심 흐름
        </p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-2 text-sm">
          {[
            {
              step: "01",
              title: "조직 생성",
              desc: "대표 가입 시 회사 자동 생성",
            },
            {
              step: "02",
              title: "초대 합류",
              desc: "초대 URL로만 구성원 가입 가능",
            },
            {
              step: "03",
              title: "권한 분리",
              desc: "대표·관리자·사원 역할별 화면",
            },
            {
              step: "04",
              title: "승인 루프",
              desc: "정정·휴가 모두 관리자 승인 필요",
            },
            {
              step: "05",
              title: "구독 결제",
              desc: "1인 5천원·무제한 플랜, 취소까지",
            },
          ].map((item, i, arr) => (
            <div
              key={item.step}
              className="flex md:flex-row flex-col items-start md:items-center gap-2 md:gap-2"
            >
              <div className="bg-gray-50 rounded-xl px-4 py-3 min-w-[120px]">
                <p className="text-[10px] font-semibold text-gray-400 mb-1">
                  {item.step}
                </p>
                <p className="font-semibold text-gray-900 text-sm">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
              {i < arr.length - 1 && (
                <span className="text-gray-300 hidden md:block text-lg">→</span>
              )}
            </div>
          ))}
        </div>

        {/* 상세 흐름 */}
        <div className="mt-10 flex flex-col gap-6">
          {[
            {
              title: "근태 정정",
              steps: [
                "사원이 출근·퇴근 기록의 정정을 신청",
                "승인 대기 상태에서는 기존 근태 기록 유지",
                "관리자 승인 시 실제 기록 반영 및 근무시간 재계산",
                "반려 시 사유와 함께 결과 확인",
              ],
            },
            {
              title: "휴가 신청",
              steps: [
                "사원이 연차·반차를 신청하고 잔여 연차 확인",
                "승인 전까지 휴가 신청을 대기 상태로 관리",
                "관리자 승인 시 사용 연차 반영",
                "반차는 근태 기록과 연동해 근무시간 계산",
              ],
            },
          ].map((flow) => (
            <div
              key={flow.title}
              className="border border-gray-100 rounded-xl px-5 py-5"
            >
              <p className="font-semibold text-gray-900 text-sm mb-3">
                {flow.title}
              </p>
              <ol className="flex flex-col gap-2">
                {flow.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 items-start">
                    <span className="text-[10px] font-semibold text-gray-400 min-w-[18px] pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-gray-500 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 3. 기능 목록 + 캡처 ────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          기능 목록
        </p>

        <div className="flex flex-col gap-16">
          {features.map((item) => (
            <div key={item.title} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {item.images.map((src, idx) => (
                  <div
                    key={idx}
                    className="flex-1 relative bg-gray-50 border border-dashed border-gray-200 rounded-xl overflow-hidden aspect-video"
                  >
                    <Image
                      src={src}
                      alt={`${item.title} 스크린샷 ${idx + 1}`}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* 설명 */}
              <div className="flex flex-col gap-2">
                <span
                  className={`self-start text-xs font-semibold px-2 py-1 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                <h3 className="font-semibold text-gray-900 text-base">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 4. 기술 선택 이유 ────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          기술 선택 이유
        </p>
        <p className="text-sm text-gray-400 mb-8">
          역할 기반 화면과 서버 렌더링은 Next.js로 구성하고, 근태·휴가·권한·결제
          도메인은 NestJS와 PostgreSQL 기반으로 설계·구현했습니다.
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              tag: "Frontend",
              tagColor: "bg-blue-50 text-blue-700",
              name: "Next.js + TypeScript",
              reason:
                "역할별 렌더를 서버에서 완결하기 위해 선택. 미들웨어에서 유저 정보를 헤더로 주입해 클라이언트 상태 로드 전 흰 화면 노출을 없앴다.",
            },
            {
              tag: "Frontend",
              tagColor: "bg-blue-50 text-blue-700",
              name: "React Query",
              reason:
                "캐시 일관성과 로그아웃 시 이전 유저 데이터 노출을 막기 위해 도입. QueryClient 인스턴스를 단일화해 초기화가 실제로 동작하도록 구조를 잡았다.",
            },
            {
              tag: "Frontend",
              tagColor: "bg-blue-50 text-blue-700",
              name: "Zustand",
              reason:
                "인증 상태와 UI 상태를 클라이언트에서 담당. 서버 상태는 React Query, 클라이언트 상태는 Zustand로 역할을 분리했다.",
            },
            {
              tag: "연동",
              tagColor: "bg-gray-100 text-gray-600",
              name: "포트원 + 토스페이먼츠",
              reason:
                "구독 결제와 취소 흐름을 실제 테스트 환경에서 검증하기 위해 도입했다.",
            },
            {
              tag: "연동",
              tagColor: "bg-gray-100 text-gray-600",
              name: "Sentry + Slack",
              reason:
                "배포 환경 에러를 실시간으로 감지하고 Slack 알림으로 받기 위해 연동했다.",
            },
            {
              tag: "Architecture",
              tagColor: "bg-orange-50 text-orange-700",
              name: "프론트엔드·백엔드 분리 구조",
              reason:
                "Next.js와 NestJS를 분리해 각 애플리케이션을 독립적으로 수정·배포할 수 있도록 구성했습니다. 근태·권한·승인·결제 도메인은 API와 데이터베이스까지 직접 구현해 서비스의 주요 흐름이 실제로 동작하도록 완성했습니다.",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex gap-4 items-start border border-gray-100 rounded-xl px-5 py-4"
            >
              <div className="shrink-0 pt-0.5">
                <span
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full ${item.tagColor}`}
                >
                  {item.tag}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-900">
                  {item.name}
                </span>
                <span className="text-sm text-gray-500 leading-relaxed">
                  {item.reason}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4-2. UX 설계 판단 ────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          UX 설계 판단
        </p>
        <div className="border border-gray-100 rounded-xl px-5 py-5">
          <p className="font-semibold text-gray-900 text-sm mb-4">
            제거할 수 없는 대기 시간을 인터랙션으로 전환
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-start">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 bg-red-50 text-red-600">
                배경
              </span>
              <p className="text-sm text-gray-500 leading-relaxed">
                무료 티어 서버는 일정 시간 요청이 없으면 슬립 상태로 전환되고,
                재접속 시 콜드스타트로 15~30초가량의 대기 시간이 발생한다.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 bg-orange-50 text-orange-600">
                고민
              </span>
              <p className="text-sm text-gray-500 leading-relaxed">
                주기적인 헬스체크로 서버 슬립을 막는 방법도 검토했지만, 실제
                사용 여부와 관계없이 서버를 계속 활성 상태로 유지하는 방식은
                채택하지 않았습니다.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 bg-green-50 text-green-700">
                결정
              </span>
              <p className="text-sm text-gray-500 leading-relaxed">
                대신 로그인 시 슬롯머신 UI를 제공하고, 연출이 진행되는 동안
                백그라운드에서 서버를 깨우도록 구성했습니다. 서버가 준비되면 777
                연출과 함께 로그인 화면으로 전환하고, 실패 시 재시도할 수
                있도록 설계했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 5. 트러블슈팅 ───────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          트러블슈팅
        </p>
        <div className="flex flex-col gap-5">
          {[
            {
              label: "React Query 캐시 오염",
              problem:
                "로그아웃 후 다른 계정으로 재로그인했을 때 이전 유저 데이터가 잠깐 노출됐다.",
              cause:
                "ReactQueryProvider와 useAuthStore가 각각 별도의 QueryClient를 생성하고 있었다.",
              fix: "QueryClient를 단일 인스턴스로 관리하도록 구조를 변경했습니다. 로그아웃 시 실제 사용 중인 캐시가 초기화되도록 수정해 계정 전환 시 이전 데이터 노출을 제거했습니다.",
            },
            {
              label: "로그인 후 초기 렌더 지연 및 흰 화면 노출",
              problem:
                "클라이언트에서 useUserStore로 역할 분기를 하던 구조에서, 상태 로드 전 흰 화면이 노출됐다.",
              cause:
                "auth/me 중복 호출 또는 클라이언트 상태 의존으로 첫 렌더 타이밍이 불안정했다.",
              fix: "미들웨어가 auth/me 응답을 x-user 헤더로 전달하고, 페이지는 헤더만 파싱해 역할 분기와 렌더를 서버에서 완료하도록 변경했습니다. 로딩 구간은 Suspense와 Skeleton으로 레이아웃을 유지했습니다.",
            },
            {
              label: "배포 환경 결제 오류",
              problem:
                "로컬에서는 정상 동작하던 결제 흐름이 배포 환경에서만 실패했다.",
              cause:
                "배포 환경에 NEXT_PUBLIC_PORTONE_STORE_ID가 누락되어 포트원 SDK 초기화가 실패했다.",
              fix: "배포 환경의 환경변수를 보완해 포트원 SDK 초기화와 결제 흐름이 정상 동작하도록 복구했습니다.",
            },
            {
              label: "승인 전 원본 데이터 유지",
              problem:
                "정정·휴가가 신청만으로 즉시 반영되면 근태·연차 데이터가 쉽게 꼬인다.",
              cause:
                "신청 데이터와 확정 데이터를 같은 필드에 쓰면 승인 전에도 원본이 덮어써진다.",
              fix: "정정은 fix* 필드와 apprStatus로, 휴가는 LeaveRequest.status로 분리했습니다. 승인 시에만 clockIn/clockOut 또는 usedLeave가 갱신되도록 설계했습니다.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-gray-100 rounded-xl px-5 py-5"
            >
              <p className="font-semibold text-gray-900 text-sm mb-4">
                {item.label}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    tag: "문제",
                    text: item.problem,
                    tagColor: "bg-red-50 text-red-600",
                  },
                  {
                    tag: "원인",
                    text: item.cause,
                    tagColor: "bg-orange-50 text-orange-600",
                  },
                  {
                    tag: "해결",
                    text: item.fix,
                    tagColor: "bg-green-50 text-green-700",
                  },
                ].map(({ tag, text, tagColor }) => (
                  <div key={tag} className="flex gap-3 items-start">
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${tagColor}`}
                    >
                      {tag}
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 6. 설계 결과 ──────────────────────────────── */}
      <section className="mb-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            설계 결과
          </p>
          {[
            "조직 생성부터 초대, 역할별 근태 관리, 승인, 구독 결제까지 하나의 서비스 흐름을 구현했습니다.",
            "정정·휴가 신청 데이터와 확정 데이터를 분리해 승인 전 원본 데이터가 변경되지 않도록 설계했습니다.",
            "프론트엔드와 백엔드를 독립 배포하고 Sentry + Slack 모니터링을 구성해 배포 환경의 오류를 추적할 수 있도록 했습니다.",
            "역할 정보를 서버 렌더링 단계에서 처리해 첫 화면에서 역할별 UI가 바로 렌더링되도록 개선했습니다.",
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-gray-300 text-sm shrink-0">—</span>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. 링크 ──────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          링크
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          실행 방법·폴더 구조·아키텍처 요약은 GitHub README에서 확인할 수
          있습니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://worklog.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
          >
            서비스 →
          </a>
          <a
            href="https://github.com/xcjnzvc/worklog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
          >
            GitHub README →
          </a>
        </div>
      </section>
    </main>
  );
}
