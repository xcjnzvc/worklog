interface ListPageLayoutProps {
  title: string;
  description: string;
  headerRight?: React.ReactNode; // 신청 버튼 등
  stats: React.ReactNode; // StatCard 영역
  tabs: React.ReactNode; // PageTabs
  children: React.ReactNode; // 테이블 + 페이지네이션
}

export const ListPageLayout = ({
  title,
  description,
  headerRight,
  stats,
  tabs,
  children,
}: ListPageLayoutProps) => (
  <div className="w-full min-h-screen bg-[#F8F9FA] p-4 md:p-10 text-[#1B254B]">
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-black">{title}</h1>
          <p className="text-sm text-[#A3AED0]">{description}</p>
        </div>
        {headerRight}
      </div>
      {stats}
      {tabs}
      <div className="bg-white p-4 md:p-8 rounded-[32px] shadow-sm">
        {children}
      </div>
    </div>
  </div>
);
