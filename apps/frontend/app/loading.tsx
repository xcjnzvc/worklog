import NavigationLoader from "@/components/NavigationLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // ← 타입 추가
}) {
  return (
    <html>
      <body>
        <NavigationLoader />
        {children}
      </body>
    </html>
  );
}
