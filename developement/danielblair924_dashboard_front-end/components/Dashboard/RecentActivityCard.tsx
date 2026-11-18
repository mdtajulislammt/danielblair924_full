"use client";

import { useEffect, useState } from "react";
import DashboardCardWrapper from "../reusable/DashboardCardWrapper";
import { DashboardService, RecentActivityItem } from "../../service/dashboard/dashboard.service";
import { Skeleton } from "../ui/skeleton";

export default function RecentActivityCard() {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadActivity() {
      try {
        const data = await DashboardService.getRecentActivity(6);
        if (isMounted) {
          setActivities(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load recent activity feed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadActivity();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardCardWrapper>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-white">
          Recent Activity
        </h2>
        <span className="text-xs text-primaryColor font-medium">Live Feed</span>
      </div>

      {/* Activity List */}
      <div className="mt-5 divide-y divide-borderColor min-h-[220px]">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="py-3.5 flex items-start gap-3">
              <Skeleton className="mt-1 h-2 w-2 rounded-full bg-zinc-800" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                <Skeleton className="h-3 w-1/4 bg-zinc-850" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-descriptionColor">
              No recent activity recorded yet.
            </p>
          </div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-2 last:pb-1">
              <div className="flex items-start gap-3">
                {/* Neon Green Indicator Dot */}
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primaryColor" />

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white/95">
                      <span className="text-primaryColor font-semibold">
                        {item.member}
                      </span>{" "}
                      completed {item.activity} ({item.distance})
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.status === "APPROVED"
                          ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30"
                          : item.status === "PENDING"
                          ? "bg-amber-900/40 text-amber-400 border border-amber-500/30"
                          : "bg-rose-900/40 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-descriptionColor">{item.date}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCardWrapper>
  );
}
