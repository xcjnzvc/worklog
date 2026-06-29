import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

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
            { label: "백엔드", desc: "API 구현 및 프론트와 독립된 분리 배포" },
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
      </section>

      <hr className="border-gray-100 mb-20" />

      {/* ─── 3. 기능 목록 + 캡처 ────────────────────────── */}
      <section className="mb-20">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
          기능 목록
        </p>

        <div className="flex flex-col gap-16">
          {[
            {
              badge: "출퇴근",
              badgeColor: "bg-gray-100 text-gray-600",
              title: "출퇴근 기록 & 정정 흐름",
              desc: "사원이 직접 출퇴근을 기록하고 이력을 조회합니다. 잘못된 기록은 정정 신청으로 요청하며, 관리자 승인 전까지는 실제 근태에 반영되지 않습니다. 승인 대기·승인·반려·취소 상태를 구분해 관리합니다.",
            },
            {
              badge: "휴가",
              badgeColor: "bg-green-50 text-green-700",
              title: "휴가 신청 & 승인 흐름",
              desc: "사원이 휴가를 신청하면 관리자가 승인·반려를 처리합니다. 승인 전까지는 휴가로 반영되지 않으며, 상태 전이는 정정 흐름과 동일한 구조로 관리됩니다.",
            },
            {
              badge: "조직",
              badgeColor: "bg-blue-50 text-blue-700",
              title: "초대 URL 기반 합류 & 구독 결제",
              desc: "대표 가입 시 회사가 생성되고, 초대 URL이 있어야만 구성원 가입이 가능합니다. 포트원 + 토스페이먼츠 기반 구독 결제와 취소까지 처리합니다.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-4">
              {/* 📸 캡처 2개 나란히 */}
              <div className="flex gap-4">
                <div className="flex-1 aspect-video bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">
                    스크린샷 1<br />
                    <span className="text-gray-300">{item.title}</span>
                  </p>
                </div>
                <div className="flex-1 aspect-video bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">
                    스크린샷 2<br />
                    <span className="text-gray-300">{item.title}</span>
                  </p>
                </div>
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
          Next.js 기반으로 프론트 중심 서비스를 구성했고, 근태 관리에 필요한
          API와 DB, 배포는 서비스 완성을 위해 직접 연동했습니다.
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
              tag: "백엔드",
              tagColor: "bg-orange-50 text-orange-700",
              name: "백엔드 분리 배포",
              reason:
                "프론트와 독립적으로 수정·배포할 수 있도록 분리 설계했다. 서비스를 끝까지 닫기 위해 필요한 범위만 직접 구현했다.",
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
                "로그아웃 후 다른 계정으로 재로그인했을 때 이전 유저의 데이터가 잠깐 노출됐다. queryClient.clear()를 호출하고 있었는데도 해결되지 않았다.",
              cause:
                "ReactQueryProvider와 useAuthStore가 각각 별도의 QueryClient 인스턴스를 생성하고 있었다. clear()는 아무도 쓰지 않는 인스턴스를 초기화하고 있었던 것.",
              fix: "ReactQueryProvider와 useAuthStore에서 각각 QueryClient를 생성하던 구조를 단일화해, 로그아웃 시 실제 사용 중인 캐시가 초기화되도록 수정했다. 이후 재로그인 시 이전 사용자 데이터 노출이 발생하지 않도록 개선했다.",
            },
            {
              label: "로그인 후 초기 렌더 지연 및 흰 화면 노출",
              problem:
                "클라이언트에서 useUserStore로 유저 상태를 꺼내 역할 분기를 하던 구조에서, 상태 로드 전 타이밍에 흰 화면이 노출됐다.",
              cause:
                "서버 컴포넌트에서 auth/me를 직접 호출하거나 역할만 헤더로 넘기는 방식을 시도했지만, auth/me 중복 호출 또는 클라이언트 의존 문제가 남았다.",
              fix: "미들웨어가 auth/me 응답을 x-user 헤더로 전달하고, 페이지는 헤더만 파싱해 역할 분기와 렌더를 서버에서 완료하도록 구조를 변경했다. dynamic import는 Suspense와 CardSkeleton으로 대체해 로딩 중에도 레이아웃이 유지되도록 개선했다.",
            },
            {
              label: "배포 환경 결제 오류",
              problem:
                "로컬에서는 정상 동작하던 결제 흐름이 배포 환경에서만 실패했다.",
              cause:
                "배포 환경에 NEXT_PUBLIC_PORTONE_STORE_ID가 누락되어 포트원 SDK 초기화 시 storeId가 undefined로 전달됐다. 결제 모듈이 초기화되지 않아 이후 결제 흐름 전체가 실패했다.",
              fix: "배포 환경의 환경변수 설정을 보완해 포트원 SDK 초기화가 정상 동작하도록 수정했고, 이후 결제 흐름이 안정적으로 동작하도록 복구했다. 재발 없이 운영 가능하도록 정리했다.",
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

      {/* ─── 6. 결과 ──────────────────────────────────── */}
      <section className="mb-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            결과
          </p>
          {[
            "백엔드를 독립 배포로 분리해 프론트 수정이 백엔드 재배포 없이 즉시 반영되도록 구성했다.",
            "승인 흐름을 상태 전이로 분리해 정정·휴가가 승인 없이 반영되는 상태 꼬임을 없앴다.",
            "미들웨어에서 유저를 주입하는 구조로 전환해 역할별 화면이 첫 렌더에 바로 뜨도록 개선했다.",
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-gray-300 text-sm shrink-0">—</span>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            이후 수정 반영 속도와 초기 진입 경험이 개선됐다.
          </p>
        </div>
      </section>

      {/* ─── 7. 링크 ──────────────────────────────────── */}
      <section className="flex gap-4">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
        >
          GitHub →
        </a>
      </section>
    </main>
  );
}
