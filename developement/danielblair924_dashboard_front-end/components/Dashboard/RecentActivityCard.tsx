"use client";

import DashboardCardWrapper from "../reusable/DashboardCardWrapper";

interface ActivityItem {
  id: number;
  message: string;
  time: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    message: "Nadia Islam's submission was approved",
    time: "2 min ago",
  },
  {
    id: 2,
    message: "New member registered: Tanvir Hossain",
    time: "18 min ago",
  },
  {
    id: 3,
    message: "Event 'Run For Life 2026' was published",
    time: "1 hr ago",
  },
  {
    id: 4,
    message: "Omar Faruq earned 'First 5K' badge",
    time: "2 hr ago",
  },
  {
    id: 5,
    message: "System news post published",
    time: "Yesterday",
  },
];

interface RecentActivityCardProps {
  activities?: ActivityItem[];
}

export default function RecentActivityCard({
  activities = DEFAULT_ACTIVITIES,
}: RecentActivityCardProps) {
  return (
    <DashboardCardWrapper>
      <h2 className="text-base font-bold tracking-tight text-white">
        Recent Activity
      </h2>

      {/* Activity List */}
      <div className="mt-5 divide-y divide-borderColor">
        {activities.map((item) => (
          <div key={item.id} className="py-3.5 first:pt-2 last:pb-1">
            <div className="flex items-start gap-3">
              {/* Neon Green Indicator Dot */}
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primaryColor" />

              <div className="space-y-1">
                <p className="text-sm font-medium text-white/95">
                  {item.message}
                </p>
                <p className="text-xs text-descriptionColor">{item.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCardWrapper>
  );
}
