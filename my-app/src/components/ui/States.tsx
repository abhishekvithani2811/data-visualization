"use client";

import { Car } from "lucide-react";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel space-y-3 p-5">
            <SkeletonBlock className="h-10 w-10" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-80 w-full rounded-[18px]" />
        <SkeletonBlock className="h-80 w-full rounded-[18px]" />
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Car size={28} strokeWidth={1.75} />
      </div>
      <h3 className="text-section-title text-[1.25rem]">No cars found</h3>
      <p className="text-sub mt-2 max-w-sm">
        Try changing filters or clearing the active chart selection.
      </p>
    </div>
  );
}
