import type { Metadata } from "next";
import localFont from "next/font/local"; // 1. import 추가
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import Script from "next/script";

// 2. 폰트 설정
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2", // 로컬 경로 지정
  variable: "--font-pretendard",
  display: "swap", // 이게 핵심: 로딩 전까지 기본 폰트로 즉시 표시
});

export const metadata: Metadata = {
  title: "WorkLog - 스마트한 근태 관리",
  description: "B2B SaaS 근태 관리 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 3. 폰트 변수 적용
    <html lang="ko" className={`h-full antialiased ${pretendard.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <Script
          src="https://cdn.portone.io/v2/browser-sdk.js"
          strategy="lazyOnload" // 4. 로딩 시점 최적화
        />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
