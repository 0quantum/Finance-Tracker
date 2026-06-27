"use client";

export default function Dashboard() {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">

        {/* top row */}
        <div className="flex gap-2">
          {[...new Array(4)].map((_, idx) => (
            <div
              key={"top-skeleton-" + idx}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            />
          ))}
        </div>

        {/* bottom row */}
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((_, idx) => (
            <div
              key={"bottom-skeleton-" + idx}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            />
          ))}
        </div>

      </div>
    </div>
  );
}