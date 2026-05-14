import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-xl font-bold text-sm ${
              currentPage === i + 1
                ? "bg-[#4318FF] text-white shadow-md"
                : "text-[#A3AED0] hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
