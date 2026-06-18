// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
// // 1. Script 컴포넌트를 import 합니다.
// import Script from "next/script";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "WorkLog - 스마트한 근태 관리",
//   description: "B2B SaaS 근태 관리 서비스",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="ko"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">
//         {/* 2. 포트원 SDK 스크립트 추가 */}
//         <Script
//           src="https://cdn.portone.io/v2/browser-sdk.js"
//           strategy="afterInteractive" // 페이지가 로드된 직후 실행
//         />

//         <ReactQueryProvider>{children}</ReactQueryProvider>

//         <Toaster
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               borderRadius: "10px",
//               background: "#333",
//               color: "#fff",
//             },
//             error: {
//               duration: 4500,
//             },
//           }}
//         />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkLog - 스마트한 근태 관리",
  description: "B2B SaaS 근태 관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 포트원 SDK: afterInteractive 전략으로 렌더링 차단 방지 */}
        <Script
          src="https://cdn.portone.io/v2/browser-sdk.js"
          strategy="afterInteractive"
        />

        {/* 데이터 통신을 위한 React Query 공급자 */}
        <ReactQueryProvider>{children}</ReactQueryProvider>

        {/* 토스트 알림을 위한 클라이언트 전용 컴포넌트 */}
        <ToasterProvider />
      </body>
    </html>
  );
}
