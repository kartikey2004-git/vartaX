"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-full max-w-xs px-6">
        <div className="flex flex-col items-center gap-5 rounded-lg border bg-card px-6 py-8 shadow-sm">
          <h1 className="pulse-soft text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
            Vartax
          </h1>

          <div className="h-2 w-2 rounded-full bg-primary" />

          <p className="flex items-center gap-1 text-sm text-muted-foreground sm:text-base">
            End-to-end secure chats
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
