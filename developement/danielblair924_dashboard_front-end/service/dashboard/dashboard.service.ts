import { Fetch } from "../../lib/Fetch";
import { unwrap } from "../../lib/apiResponse";

export interface DashboardStats {
  activeMembers: number;
  pendingSubmissions: number;
  upcomingEvents: number;
  activeChallenges: number;
  upcomingChallenges?: number;
}

export interface RecentActivityItem {
  id: string;
  member: string;
  activity: string;
  distance: string;
  date: string;
  status: string;
}

export const DashboardService = {
  /**
   * Get overall live stats for the admin dashboard
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      const s = unwrap<any>(await Fetch.get("/admin/dashboard/stats"));
      return {
        activeMembers: s?.activeMembers ?? 0,
        pendingSubmissions: s?.pendingSubmissions ?? 0,
        upcomingEvents: s?.upcomingEvents ?? 0,
        activeChallenges: s?.activeChallenges ?? s?.upcomingChallenges ?? 0,
      };
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      return {
        activeMembers: 0,
        pendingSubmissions: 0,
        upcomingEvents: 0,
        activeChallenges: 0,
      };
    }
  },

  /**
   * Get recent admin activities
   */
  getRecentActivity: async (limit: number = 5): Promise<RecentActivityItem[]> => {
    try {
      const res = await Fetch.get(`/admin/dashboard/recent-activity?limit=${limit}`);
      const d = unwrap<any>(res);
      return Array.isArray(d) ? d.slice(0, limit) : [];
    } catch (error) {
      console.error("Failed to load recent activity:", error);
      return [];
    }
  },
};
