import { Fetch } from "../../lib/Fetch";

export interface DashboardStats {
  activeMembers: number;
  pendingSubmissions: number;
  upcomingEvents: number;
  activeChallenges: number;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export const DashboardService = {
  /**
   * Get overall live stats for the admin dashboard
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await Fetch.get("/admin/dashboard/stats");
      if (response && response.data) {
        return response.data;
      }
      return response;
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
      const response = await Fetch.get(`/admin/dashboard/recent-activity?limit=${limit}`);
      if (response && response.data) {
        return response.data;
      }
      return response || [];
    } catch (error) {
      console.error("Failed to load recent activity:", error);
      return [];
    }
  },
};

