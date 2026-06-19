import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import Script from "next/script";

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
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Script
          src="https://cdn.portone.io/v2/browser-sdk.js"
          strategy="afterInteractive"
        />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
