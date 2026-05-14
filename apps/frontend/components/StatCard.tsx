import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

export const StatCard = ({ label, value, color, icon }: StatCardProps) => {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm flex items-center gap-6">
      <div
        className={`w-14 h-14 rounded-2xl bg-[#F4F7FE] flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#A3AED0]">{label}</p>
        <p className={`text-[28px] font-black ${color}`}>{value}</p>
      </div>
    </div>
  );
};
