"use client";

import axios from "axios";
import { useState, useRef } from "react";

interface Props {
  onSuccess: () => void;
}

export default function ServerWakeUpSlot({ onSuccess }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [symbols, setSymbols] = useState(["🍒", "🍋", "🍇"]);
  const [status, setStatus] = useState<
    "idle" | "spinning" | "failed" | "success"
  >("idle");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const SYMBOLS = ["🍒", "🍋", "🍇", "💎", "🔔", "🍀"];

  const startSpin = async () => {
    setIsSpinning(true);
    setStatus("spinning");

    intervalRef.current = setInterval(() => {
      setSymbols([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 100);

    try {
      await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
          timeout: 5000, // 서버 응답을 5초까지만 기다림
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);

      if (intervalRef.current) clearInterval(intervalRef.current);
      setSymbols(["7️⃣", "7️⃣", "7️⃣"]);
      setStatus("success");
      setTimeout(onSuccess, 1500);
    } catch (error) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      let newSymbols;
      do {
        newSymbols = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];
      } while (
        newSymbols[0] === newSymbols[1] &&
        newSymbols[1] === newSymbols[2]
      );

      setSymbols(newSymbols);
      setStatus("failed");
      setIsSpinning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 p-6 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          WorkLog 시스템 기동
        </h1>
        <p className="text-gray-500">
          무료 서버가 잠들어 있습니다. 슬롯을 돌려 깨워주세요!
        </p>
      </div>

      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-inner mb-8">
        <div className="flex gap-3 text-5xl">
          {symbols.map((s, i) => (
            <div
              key={i}
              className="w-20 h-24 bg-white flex items-center justify-center rounded-2xl border border-gray-200 shadow-sm transition-all duration-75"
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {status === "idle" && (
        <button
          onClick={startSpin}
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95"
        >
          🎰 서버 깨우기 시작
        </button>
      )}

      {status === "spinning" && (
        <p className="text-blue-600 font-bold animate-pulse">
          서버 연결 시도 중...
        </p>
      )}

      {status === "failed" && (
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <p className="text-red-500 font-bold mb-4">
            😴 아직 서버가 자고 있어요.
          </p>
          <button
            onClick={startSpin}
            className="px-6 py-3 bg-gray-100 border border-gray-200 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto"
          >
            🔨 다시 깨우기
          </button>
        </div>
      )}

      {status === "success" && (
        <p className="text-green-600 font-bold text-xl animate-bounce">
          🎉 Jackpot! 서버가 기상했습니다.
        </p>
      )}
    </div>
  );
}
