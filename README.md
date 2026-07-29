# Worklog

중소 조직을 위한 근태·휴가 관리 B2B SaaS입니다.

대표 가입부터 구성원 초대, 역할별 출퇴근 관리,  
근태·휴가 승인, 구독 결제까지 하나의 서비스 흐름으로 구현했습니다.

🔗 [서비스 바로가기](https://worklog.vercel.app)  
🔗 [프로젝트 소개 페이지](https://worklog.vercel.app/about)

---

## Project Info

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2026.04 ~ 2026.06 |
| 개발 인원 | 1명 |
| 담당 | 기획 · UI/UX · Frontend · Backend · DB 설계 · 배포 |
| 프로젝트 유형 | 개인 B2B SaaS |

---

## Key Features

### 조직 및 권한

- 대표 가입 시 회사·기본 근무 정책·OWNER 계정 자동 생성
- 초대 URL 기반 구성원 가입
- OWNER / ADMIN / USER 역할별 화면 및 API 권한 분리

### 근태 및 휴가

- 출퇴근 기록 및 근태 이력 조회
- 근태 정정 신청 → 승인 → 실제 기록 반영
- 연차·반차 신청 → 승인 → 잔여 연차 반영
- 승인 전 원본 데이터 유지

### 결제 및 운영

- PortOne + TossPayments 구독 결제 및 취소
- Sentry + Slack 기반 배포 환경 에러 모니터링
- 스케줄러 기반 결근·미퇴근 자동 처리

---

## Tech Stack

### Frontend

Next.js · React · TypeScript · React Query · Zustand ·  
React Hook Form · Zod · Tailwind CSS

### Backend

NestJS · Prisma · PostgreSQL · Passport JWT ·  
@nestjs/schedule

### Infrastructure & Integration

Vercel · Render · PortOne · TossPayments · Sentry · Slack

---

## Architecture

```text
Next.js
   │
   │ JWT 인증 · 역할 분기
   ▼
NestJS API
   │
   ├── Auth / Company / Invite
   ├── WorkLog / Attendance
   ├── Vacation
   ├── Payment      # PortOne + TossPayments 구독 결제·취소
   └── Scheduler    # 결근·미퇴근 자동 처리
   │
   ▼
Prisma + PostgreSQL
```

---

## Folder Structure

```text
apps
├── frontend
│   ├── app
│   ├── api
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── store
│   └── types
│
└── backend
    └── src
        ├── core        # auth, prisma
        ├── resources   # work-log, vacation, invite, payment, …
        └── common      # guards, decorators, dto
```

---

## Getting Started

### Backend

```bash
cd apps/backend
npm install
```

`.env` 예시:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
PORTONE_API_SECRET=
```

```bash
npx prisma generate
npm run start:dev
```

### Frontend

```bash
cd apps/frontend
npm install
```

`.env.local` 예시:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTONE_STORE_ID=
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=
```

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.  
실제 키·시크릿 값은 저장소에 포함하지 않습니다.

---

## Project Details

서비스 흐름, 기술 선택 이유, UX 설계 판단 및 트러블슈팅은  
[프로젝트 소개 페이지](https://worklog.vercel.app/about)에서 확인할 수 있습니다.

---

## Links

- Service: https://worklog.vercel.app
- GitHub: https://github.com/xcjnzvc/worklog
