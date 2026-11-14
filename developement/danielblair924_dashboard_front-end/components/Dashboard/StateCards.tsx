"use client";

import DashboardSmallCardWrapper from "../reusable/DashboardSmallCardWrapper";
import { Skeleton } from "../ui/skeleton";

export default function StatCards({
  statCards,
  isLoading = false,
}: {
  statCards: { title: string; value: number | string; percentage: string }[];
  isLoading?: boolean;
}) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0b0f05] border border-[#1e2d0d] flex flex-col gap-4"
            >
              <Skeleton className="w-28 h-4 bg-zinc-800" />
              <Skeleton className="w-20 h-9 bg-zinc-800" />
              <Skeleton className="w-24 h-4 bg-zinc-800" />
            </div>
          ))
        : statCards.map((card, idx) => (
            <DashboardSmallCardWrapper key={idx}>
              {/* Content */}
              <div className="relative z-10 space-y-3">
                <p className="text-sm text-descriptionColor font-normal tracking-wide">
                  {card.title}
                </p>

                <div className="text-3xl font-bold tracking-tight text-white">
                  {card.value}
                </div>
              </div>

              <div className="relative z-10 mt-2">
                <p className="text-sm font-medium text-[#84cc16]">
                  {card.percentage}
                </p>
              </div>
            </DashboardSmallCardWrapper>
          ))}
    </div>
  );
}
