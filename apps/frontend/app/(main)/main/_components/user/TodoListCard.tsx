"use client";

import React, { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  tag: string;
  tagColor: string;
}

export default function TodoListCard() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "주간 업무 보고서 작성",
      completed: false,
      tag: "업무",
      tagColor: "#3B82F6",
    },
    {
      id: 2,
      text: "디자인 시스템 리뷰하기",
      completed: true,
      tag: "디자인",
      tagColor: "#8B5CF6",
    },
    {
      id: 3,
      text: "신규 입사자 가이드 업데이트",
      completed: false,
      tag: "인사",
      tagColor: "#10B981",
    },
    {
      id: 4,
      text: "팀 런칭 이벤트 기획안",
      completed: false,
      tag: "기획",
      tagColor: "#F59E0B",
    },
  ]);

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / todos.length) * 100);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <article className="bg-white rounded-[32px] border border-gray-100 p-[30px] shadow-sm flex flex-col flex-1 overflow-hidden transition-all hover:shadow-md">
      {/* 상단 섹션: 제목 및 진행률 */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-bold text-[18px] text-gray-950">오늘 할 일</h3>
            <p className="text-[13px] text-gray-400 mt-1">
              오늘 목표 중{" "}
              <span className="text-[#0029C0] font-semibold">
                {completedCount}개
              </span>
              를 완료했어요
            </p>
          </div>
          <span className="text-[18px] font-black text-[#0029C0]">
            {progressPercent}%
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0029C0] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 할 일 리스트 영역 */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`flex items-center justify-between p-4 rounded-[20px] cursor-pointer transition-all border ${
              todo.completed
                ? "bg-gray-50 border-transparent opacity-70"
                : "bg-white border-gray-50 hover:border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* 커스텀 원형 체크박스 */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? "bg-[#0029C0] border-[#0029C0]"
                    : "border-gray-200"
                }`}
              >
                {todo.completed && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>

              {/* 텍스트 정보 */}
              <div className="flex flex-col gap-1">
                <span
                  className={`text-[15px] font-bold transition-all ${
                    todo.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>
                {todo.tag && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: todo.completed
                          ? "#D1D5DB"
                          : todo.tagColor,
                      }}
                    />
                    <span
                      className={`text-[11px] font-medium ${todo.completed ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {todo.tag}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
