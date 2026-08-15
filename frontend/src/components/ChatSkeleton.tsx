import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSkeleton() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <div className="hidden w-80 shrink-0 flex-col border-r bg-sidebar sm:flex">
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="p-3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex flex-col gap-1 px-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md px-2 py-3">
              <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="m-3 flex min-w-0 flex-1 flex-col rounded-lg border bg-card p-3 shadow-sm sm:m-4 sm:p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-3 overflow-hidden px-1 py-4">
          <Skeleton className="h-10 w-2/5 rounded-lg" />
          <Skeleton className="ml-auto h-10 w-1/3 rounded-lg" />
          <Skeleton className="h-16 w-1/2 rounded-lg" />
          <Skeleton className="ml-auto h-10 w-2/5 rounded-lg" />
        </div>

        <Skeleton className="h-12 w-full shrink-0 rounded-md" />
      </div>
    </div>
  );
}
