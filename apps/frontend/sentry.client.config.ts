import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0043f344d6b92afcff9325463a7130b6@o4511544736284672.ingest.us.sentry.io/4511544736481280",
  tracesSampleRate: 0, // 성능 트레이싱(페이지 로딩 속도 측정) 끔.
  sendDefaultPii: false,
  enableLogs: false, // Sentry 자체 로그 끔.
  // defaultIntegrations: false, // 브라우저 세션 리플레이, 성능 모니터링 등 끔
  // integrations: [], // 추가 플러그인 없음
});
