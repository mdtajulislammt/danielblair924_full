"use client";

import { useEffect, useState } from "react";
import StatCards from "./StateCards";
import DashboardUserTable from "./DashboardUserTable";
import { DashboardService, DashboardStats } from "../../service/dashboard/dashboard.service";
import { useAuth } from "@/hooks/useAuth";

function DashboardPage() {
  const { isMember } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeMembers: 0,
    pendingSubmissions: 0,
    upcomingEvents: 0,
    activeChallenges: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const liveStats = await DashboardService.getStats();
        if (isMounted && liveStats) {
          setStats({
            activeMembers: liveStats.activeMembers ?? 0,
            pendingSubmissions: liveStats.pendingSubmissions ?? 0,
            upcomingEvents: liveStats.upcomingEvents ?? 0,
            activeChallenges: liveStats.activeChallenges ?? 0,
          });
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = isMember
    ? [
        {
          title: "Community Runners",
          value: stats.activeMembers,
          percentage: "Active club runners",
        },
        {
          title: "Upcoming Events",
          value: stats.upcomingEvents,
          percentage: "Next 30 days",
        },
        {
          title: "Active Challenges",
          value: stats.activeChallenges,
          percentage: "Open to join",
        },
        {
          title: "Club Trophies",
          value: "5 Badges",
          percentage: "Available to earn",
        },
      ]
    : [
        {
          title: "Active Members",
          value: stats.activeMembers,
          percentage: "Registered runners",
        },
        {
          title: "Pending Submissions",
          value: stats.pendingSubmissions,
          percentage: "Awaiting review",
        },
        {
          title: "Upcoming Events",
          value: stats.upcomingEvents,
          percentage: "Next 30 days",
        },
        {
          title: "Upcoming Challenges",
          value: stats.activeChallenges,
          percentage: "Next 30 days",
        },
      ];

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <StatCards statCards={statCards} isLoading={isLoading} />
      </div>

      <div className="mt-10">
        <DashboardUserTable />
      </div>
    </div>
  );
}

export default DashboardPage;
