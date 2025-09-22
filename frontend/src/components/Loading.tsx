import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-5xl space-y-5 p-6">
        {/* Banner skeleton */}
        <Skeleton className="rounded-lg">
          <div className="h-32 w-full rounded-lg bg-gray-100" />
        </Skeleton>

        {/* Text lines */}
        <div className="space-y-4">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-gray-100" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 w-4/5 rounded-lg bg-gray-100" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-4 w-2/5 rounded-lg bg-gray-100" />
          </Skeleton>
        </div>
        <div className="space-y-4">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-gray-100" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 w-4/5 rounded-lg bg-gray-100" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-4 w-2/5 rounded-lg bg-gray-100" />
          </Skeleton>
        </div>
        <div className="space-y-4">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-gray-100" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 w-4/5 rounded-lg bg-gray-100" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-4 w-2/5 rounded-lg bg-gray-100" />
          </Skeleton>
        </div>
      </Card>
    </div>
  );
};

export default Loading;
