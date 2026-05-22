"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface MenuItem {
  label: string;
  desc: string;
}

interface ManagementMenuCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  hoverBgColor: string;
  arrowHoverColor: string;
  items: MenuItem[];
  onItemClick: (label: string) => void;
}

export default function ManagementMenuCard({
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  hoverBgColor,
  arrowHoverColor,
  items,
  onItemClick,
}: ManagementMenuCardProps) {
  return (
    <section className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-2xl ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-[16px] text-gray-900">{title}</h3>
          <p className="text-[12px] font-medium  text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onItemClick(item.label)}
            className={`w-full flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl transition group ${hoverBgColor}`}
          >
            <div className="text-left">
              <p className="font-medium text-sm text-gray-800">{item.label}</p>
              <p className="text-[12px] font-medium text-gray-400 mt-0.5">
                {item.desc}
              </p>
            </div>
            <ChevronRight
              size={14}
              className={`text-gray-300 transition shrink-0 ml-2 ${arrowHoverColor}`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
