import { Fetch } from "../../lib/Fetch";
import { EventRequirements } from "./event.service";

export interface ChallengeItem {
  id: string;
  title: string;
  challengeName?: string;
  description: string;
  scope: "COMMUNITY_WIDE" | "INDIVIDUAL";
  type?: string;
  status: "DRAFT" | "PUBLISHED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ENDED";
  currentProgress: number;
  targetProgress: number;
  progressUnit: string;
  progressPercent: number;
  coverImageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  participantsCount?: number;
  submissionsCount?: number;
  requirements?: EventRequirements;
  isJoined?: boolean;
  userIndividualKm?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MilestoneDestination {
  id: number;
  destination: string;
  countryCode: string;
  distanceRequiredKm: number;
  distanceRequired: string;
  badgeName: string;
  badgeIcon: string;
  status: "Unlocked" | "Current" | "Locked";
  unlockDate: string;
}

export interface ChallengeParticipant {
  id: string;
  userId: string;
  rank: number;
  name: string;
  email?: string;
  avatarUrl?: string;
  location?: string | null;
  individualKm: number;
  joinedAt: string;
}

export interface CreateChallengePayload {
  title?: string;
  challengeName?: string;
  description: string;
  type?: string;
  scope?: "COMMUNITY_WIDE" | "INDIVIDUAL";
  status?: string;
  coverImageUrl?: string;
  targetProgress?: number;
  progressUnit?: string;
  startDate?: string;
  endDate?: string;
  requirements?: EventRequirements;
}

export const ChallengeService = {
  /**
   * Get all challenges with query options
   */
  getChallenges: async (params?: {
    status?: string;
    scope?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.scope) query.append("scope", params.scope);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : "";
    const response = await Fetch.get(`/admin/challenges${qs}`);
    return response?.data || response;
  },

  /**
   * Get single challenge by ID
   */
  getChallengeById: async (id: string): Promise<{ status: string; data: ChallengeItem }> => {
    const response = await Fetch.get(`/admin/challenges/${id}`);
    return response?.data || response;
  },

  /**
   * Get RATW milestones & destinations for challenge
   */
  getDestinations: async (challengeId?: string): Promise<{ status: string; data: MilestoneDestination[] }> => {
    const url = challengeId
      ? `/admin/challenges/${challengeId}/destinations`
      : `/challenges/ratw/destinations`;
    const response = await Fetch.get(url);
    return response?.data || response;
  },

  /**
   * Get challenge leaderboard / participants
   */
  getChallengeParticipants: async (
    challengeId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{
    status: string;
    data: {
      challenge: {
        id: string;
        title: string;
        currentProgress: number;
        targetProgress: number;
        progressUnit: string;
      };
      participants: ChallengeParticipant[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    };
  }> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : "";
    const response = await Fetch.get(`/admin/challenges/${challengeId}/participants${qs}`);
    return response?.data || response;
  },

  /**
   * Create challenge
   */
  createChallenge: async (payload: CreateChallengePayload) => {
    const response = await Fetch.post("/admin/challenges", payload);
    return response?.data || response;
  },

  /**
   * Update challenge
   */
  updateChallenge: async (id: string, payload: Partial<CreateChallengePayload>) => {
    const response = await Fetch.patch(`/admin/challenges/${id}`, payload);
    return response?.data || response;
  },

  /**
   * Delete challenge
   */
  deleteChallenge: async (id: string) => {
    const response = await Fetch.delete(`/admin/challenges/${id}`);
    return response?.data || response;
  },

  /**
   * Upload cover image file locally to public/uploads
   */
  uploadCoverImage: async (file: File): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return { url: data?.url || data?.data?.url || "" };
    } catch (e) {
      console.warn("Local upload fallback:", e);
      return { url: URL.createObjectURL(file) };
    }
  },
};

