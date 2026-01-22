"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
        <h1 className="text-foreground tracking-wide text-4xl font-normal pulse-soft">
          Vartax
        </h1>

        <div className="relative w-full h-[2px] bg-border/40 overflow-hidden rounded-full">
          <div className="absolute inset-0 shimmer" />
        </div>

        <p className="text-md text-muted-foreground/70 flex items-center gap-1">
          End-to-end secure chats
        </p>
      </div>
    </div>
  );
};

export default Loading;
