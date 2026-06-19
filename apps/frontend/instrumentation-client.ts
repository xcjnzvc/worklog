import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0043f344d6b92afcff9325463a7130b6@o4511544736284672.ingest.us.sentry.io/4511544736481280",

  // integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 0.1, // 100% → 10%
  enableLogs: true,

  replaysSessionSampleRate: 0, // 10% → 0% (세션 녹화 끄기)
  replaysOnErrorSampleRate: 1.0, // 에러시만 녹화 유지

  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
