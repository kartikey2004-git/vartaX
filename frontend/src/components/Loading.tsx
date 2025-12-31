"use client";

import React, { useEffect, useState } from "react";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25); // speed of loading

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f1117] px-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-white tracking-wide">
          <span className="text-3xl sm:text-4xl md:text-5xl font-normal">
            Vartax
          </span>
        </h1>

        <div className="w-64 sm:w-72 md:w-80 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2596be] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-gray-400 text-sm sm:text-base">{progress}%</p>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center gap-1">
          🔒 End-to-end secure chats
        </p>
      </div>
    </div>
  );
};

export default Loading;
