import { Fetch } from "../../lib/Fetch";

export interface SubmissionItem {
  id: string;
  userId: string;
  activityType: string;
  distanceKm: number;
  durationMinutes: number;
  pace?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofUrl?: string;
  socialPostUrl?: string;
  rejectionReason?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  event?: {
    id: string;
    title: string;
  };
}

export const SubmissionService = {
  /**
   * Get all submissions with filtering & pagination
   */
  getSubmissions: async (params?: {
    status?: "PENDING" | "APPROVED" | "REJECTED";
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const url = `/admin/submissions${query.toString() ? `?${query.toString()}` : ""}`;
    const response = await Fetch.get(url);
    return response?.data || response;
  },

  /**
   * Get submission detail by ID
   */
  getSubmissionById: async (id: string): Promise<SubmissionItem> => {
    const response = await Fetch.get(`/admin/submissions/${id}`);
    return response?.data || response;
  },

  /**
   * Moderate submission (Approve or Reject)
   */
  moderateSubmission: async (
    id: string,
    payload: { status: "APPROVED" | "REJECTED"; rejectionReason?: string }
  ) => {
    if (payload.status === "APPROVED") {
      const response = await Fetch.patch(`/admin/submissions/${id}/approve`, {});
      return response?.data || response;
    } else {
      const response = await Fetch.patch(`/admin/submissions/${id}/reject`, {
        reason: payload.rejectionReason || "Submission rejected by admin",
      });
      return response?.data || response;
    }
  },
};

