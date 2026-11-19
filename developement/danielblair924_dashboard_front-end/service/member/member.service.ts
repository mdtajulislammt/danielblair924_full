import { Fetch } from "../../lib/Fetch";

export interface MemberItem {
  id: string;
  email: string;
  username?: string;
  fname?: string;
  lname?: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  totalDistanceKm: number;
  joinDate?: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
  organization?: string;
  recipientPhoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
  badges?: Array<{
    id: string;
    earnedAt: string;
    badge: {
      id: string;
      name: string;
      slug: string;
      iconUrl?: string;
      tagType?: string;
    };
  }>;
  submissions?: Array<{
    id: string;
    activityType: string;
    distanceKm: number;
    duration: string;
    pace?: string;
    runDate: string;
    status: string;
  }>;
}

export const MemberService = {
  /**
   * Get all members with pagination, search, and status filter
   */
  getMembers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);
    if (params?.status && params.status !== "all") query.append("status", params.status);
    if (params?.sortBy) query.append("sortBy", params.sortBy);

    const url = `/admin/members${query.toString() ? `?${query.toString()}` : ""}`;
    const response = await Fetch.get(url);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Get specific member details by ID
   */
  getMemberById: async (id: string): Promise<MemberItem> => {
    const response = await Fetch.get(`/admin/members/${id}`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Get member badges
   */
  getMemberBadges: async (id: string) => {
    const response = await Fetch.get(`/admin/members/${id}/badges`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Get member submissions / activities
   */
  getMemberSubmissions: async (
    id: string,
    params?: { page?: number; limit?: number; status?: string }
  ) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.status) query.append("status", params.status);

    const url = `/admin/members/${id}/submissions${
      query.toString() ? `?${query.toString()}` : ""
    }`;
    const response = await Fetch.get(url);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Update member status (ACTIVE | INACTIVE | SUSPENDED)
   */
  updateMemberStatus: async (
    id: string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  ) => {
    const response = await Fetch.patch(`/admin/members/${id}/status`, { status });
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Delete member
   */
  deleteMember: async (id: string) => {
    const response = await Fetch.delete(`/admin/members/${id}`);
    return response?.data?.data ?? response?.data ?? response;
  },
};
